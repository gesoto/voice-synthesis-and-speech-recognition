// Adobe Animate Code //

// needs to be compiled to swf together with graphics //

import flash.external.ExternalInterface;
import flash.events.KeyboardEvent;
import fl.transitions.Tween;
import fl.motion.easing.*;
import flash.utils.Timer;
import flash.events.TimerEvent;
import fl.transitions.TweenEvent;
import flash.events.MouseEvent;


// Variables

var biggerBubble = true;
var bubbleWithAvatar = false;
var longPress = false;
var overlayIsOn = false;
var overlayInExitTransition = false;
var replyWithContent = false;
var soundvizIsUp = false;
var firstTimeSound = true;
var micIsPressed = false;
var inputreceived = false;
var farfieldon = false;
var firstword = false;

var firstTimeCounter = 0;
var stringCount = 0;
var speechToTextDelay = 800;
var serverResponseTime = 2000;

var resulttype;
var tvresponse;
var wavesposy;
var wavesposx;
var owavesposy;
var owavesposx;
var bubble_user;
var bubble_tv;
var profilepic;
var strings;
var string1;
var stringTotal;
var fullstring;
var tvbubblesize;
var suggestionsArray;
var bubbletvOriginalWidth = bubble_tv.width;
var bubbletvOriginaHeight = bubble_tv.height;

var ububble = new Array();
var tbubble = new Array();
var ppic = new Array();


// Preload sounds

var audiostart = new AStart;
var audioresponse = new AResponse;
var audiooverlayin = new AOverlayIn;


// Init

loadJSON();
waves.scaleX = 0;
waves.scaleY = 0;
wavesposy = waves.y;
wavesposx = waves.x;
owavesposy = waves.y;
owavesposx = waves.x;
char.alpha = 0;
suggestions.alpha = 0;
Object(parent).overlaybg.alpha = 0;
bubble_user.x = wavesposx;
bubble_user.y = wavesposy;
profilepic.x = wavesposx;
profilepic.y = wavesposy;
profilepic.scaleX = 0;
profilepic.scaleY = 0;
waves.x = wavesposx;
waves.y = wavesposy;
waves.scaleX = 0;
waves.scaleY = 0;
bubble_user.scaleX = 0;
bubble_user.scaleY = 0;


// Load and parse JSON

var json;
var parsedjson: Object;
function loadJSON(): void {
	json = new URLLoader();
	json.load(new URLRequest("strings.json"));
	json.addEventListener(Event.COMPLETE, function () {
		parsedjson = JSON.parse(json.data);
		stringTotal = parsedjson.responses.length;
	});
}


// Check if string provided is inside the JSON parsed object

function check(u) {
	var found = false;
	for (var i in parsedjson.responses) {
		if (parsedjson.responses[i].userinput.indexOf(u) > -1 && !found) {
			found = true;
			tvresponse = parsedjson.responses[i].response;
			resulttype = parsedjson.responses[i].resulttype;
			suggestionsArray = parsedjson.responses[i].suggestions;
			break;
		} else {
			tvresponse = parsedjson.genericresponse;
			resulttype = "single_string";
		}
	}
	found = false;
}


// Timers

var dismissTimer = new Timer(20000, 1);
dismissTimer.addEventListener(TimerEvent.TIMER, function () {
	overlayTimeOut();
});

var farfieldreplyTimer = new Timer(1000, 1);
farfieldreplyTimer.addEventListener(TimerEvent.TIMER, farfieldreply);


// Keyboard listener and actions

stage.addEventListener(KeyboardEvent.KEY_DOWN, keydown);
function keydown(e: KeyboardEvent) {
	if (e.keyCode == 83) { // S
		listening();
	} else if (e.keyCode == 66) { // B
		if (overlayIsOn) {
			overlayOut();
		}
	} else if (e.keyCode == 65) { // A
		if (!overlayInExitTransition) {
			if (!micIsPressed) {
				if (!overlayIsOn) {
					overlayIn();
				}
				farfieldon = false;
				micIsPressed = true;
				startListening();
			}
		}
	} else if (e.keyCode == 32) { // SPACE BAR
		results.cluster.select();
	} else if (e.keyCode == 49 || e.keyCode == 50 || e.keyCode == 51 || e.keyCode == 52 || e.keyCode == 53 || e.keyCode == 54 || e.keyCode == 55 || e.keyCode == 56 || e.keyCode == 57) { // 1 - 9
		stringCount = e.keyCode - 49;
	} else if (e.keyCode == 37) {
		results.cluster.left();
	} else if (e.keyCode == 38) {
		results.cluster.up();
	} else if (e.keyCode == 39) {
		results.cluster.right();
	} else if (e.keyCode == 40) {
		results.cluster.down();
	}
}

stage.addEventListener(KeyboardEvent.KEY_UP, keyup);
function keyup(e: KeyboardEvent) {
	if (e.keyCode == 65) { // A
		if (!overlayInExitTransition) {
			stopListening();
			micIsPressed = false;
		}
	} else if (e.keyCode == 70) { // F
		if (!overlayIsOn) {
			overlayIn();
		}
		startListening();
		farfieldon = true;
	} else if (e.keyCode == 71) { // G
		Object(parent).startmic();
	}
}


// Overlay

function overlayIn() {
	overlayIsOn = true;
	var t1 = new Tween(Object(parent).overlaybg, "alpha", Quintic.easeOut, Object(parent).overlaybg.alpha, 1, .5, true);
	var t2 = new Tween(char, "alpha", Quintic.easeOut, char.alpha, 1, .5, true);
	var t3 = new Tween(suggestions, "alpha", Quintic.easeOut, suggestions.alpha, 1, .5, true);
	maximizeTvBubbleQuick();
}

function overlayOut() {
	Object(parent).stopmic();
	overlayIsOn = false;
	var t1 = new Tween(Object(parent).overlaybg, "alpha", Quintic.easeOut, Object(parent).overlaybg.alpha, 0, .5, true);
	var t2 = new Tween(char, "alpha", Quintic.easeOut, char.alpha, 0, .5, true);
	var t3 = new Tween(suggestions, "alpha", Quintic.easeOut, suggestions.alpha, 0, .5, true);
	var t4 = new Tween(results, "alpha", Quintic.easeOut, results.alpha, 0, .5, true);
	var t5 = new Tween(waves, "alpha", Quintic.easeOut, waves.alpha, 0, .5, true);
	var t6 = new Tween(profilepic, "alpha", Quintic.easeOut, profilepic.alpha, 0, .5, true);
	var t7 = new Tween(bubble_user, "alpha", Quintic.easeOut, bubble_user.alpha, 0, .5, true);
	var t8 = new Tween(bubble_tv, "alpha", Quintic.easeOut, bubble_tv.alpha, 0, .5, true);
	setTimeout(function () {
		overlayInExitTransition = false;
		Object(parent).main.y = 360;
		Object(parent).overlaybg.bg1.alpha = 1;
		Object(parent).overlaybg.bg2.alpha = 0;
		waves.scaleX = 0;
		waves.scaleY = 0;
		profilepic.scaleX = 0;
		profilepic.scaleY = 0;
		bubble_user.scaleX = 0;
		bubble_user.scaleY = 0;
		bubble_user.x = wavesposx;
	}, 500);
}

function overlayTimeOut() {
	Object(parent).stopmic();
	farfieldon = false;
	overlayInExitTransition = true;
	char.gotoAndStop("wave");
	char.seq.play();
	setTimeout(overlayOut, 1200);
}

function clearUserLabel() {
	bubble_user.label.txt.multiline = false;
	bubble_user.label.txt.wordWrap = false;
	bubble_user.label.txt.autoSize = TextFieldAutoSize.RIGHT;
	bubble_user.label.txt.text = "";
	bubble_user.label.y = 0;
}

function startListening() {
	Object(parent).startmic();
	inputreceived = false;
	longPress = false;
	biggerBubble = true;
	bubble_user.arrow.x = 0;
	waves.alpha = 1;
	profilepic.alpha = 1;
	bubble_user.alpha = 1;
	dismissTimer.stop();
	soundvizentry();
	bubble_user.gotoAndStop(1); // Show green dots
	results.cluster.removeFocus();

	var t1 = new Tween(waves, "x", null, wavesposx, wavesposx, .5, true);

	if (!farfieldon) {
		char.gotoAndStop("listen");
		char.seq.gotoAndPlay("startlistening");
	}
}

function soundvizentry() {
	bubble_user.ind.alpha = 1;
	bubble_user.ind.gotoAndPlay(40); // show loop
	bubble_user.scaleX = 0;
	bubble_user.scaleY = 0;
	currstrLines = 1;
	clearUserLabel();
	bubble_user.shape.height = 72;
	bubble_user.shape.width = 80;
	waves.gotoAndStop("active");

	var tx1 = new Tween(char, "scaleX", Quintic.easeOut, char.scaleX, .40, .5, true);
	var tx2 = new Tween(char, "scaleY", Quintic.easeOut, char.scaleY, .40, .5, true);
	var tb1 = new Tween(profilepic, "scaleX", Quintic.easeOut, profilepic.scaleX, 1, .5, true);
	var tb2 = new Tween(profilepic, "scaleY", Quintic.easeOut, profilepic.scaleY, 1, .5, true);
	var ta1 = new Tween(waves, "scaleX", Quintic.easeOut, waves.scaleX, 1, .5, true);
	var ta2 = new Tween(waves, "scaleY", Quintic.easeOut, waves.scaleY, 1, .5, true);
	var t0 = new Tween(bubble_user, "scaleX", Quintic.easeOut, bubble_user.scaleX, 1, .5, true);
	var t1 = new Tween(bubble_user, "scaleY", Quintic.easeOut, bubble_user.scaleY, 1, .5, true);
	var t2 = new Tween(bubble_user, "x", Quintic.easeOut, bubble_user.x, wavesposx - 80, .5, true);
	longPress = true;
}

function listening() {
	inputreceived = true;
	if (farfieldon && !firstword && char.currentFrame != 1) { 
		char.gotoAndStop("listen");
		char.seq.gotoAndPlay("startlistening");
		soundvizentry();
		firstword = true;
	}
	if (farfieldon) {
		farfieldreplyTimer.stop();
		farfieldreplyTimer.start();
	}
	waves.seq.play();
}

function farfieldreply(e: TimerEvent) {
	stopListening();
	firstword = false;
}

function stopListening() {
	if (!farfieldon) {
		Object(parent).stopmic();
		waves.gotoAndStop("inactive");
	}
	char.gotoAndStop("listen");
	char.seq.gotoAndPlay("stoplistening");


	if (inputreceived) {
		setTimeout(function () {
			char.gotoAndStop("thinking");
			char.seq.gotoAndPlay(1);
		}, 470);
		setTimeout(showspeech, speechToTextDelay); // Time from releasing mic button to display input string

		if (!farfieldon) {
			var tb1 = new Tween(profilepic, "scaleX", Quintic.easeOut, profilepic.scaleX, .83, .5, true);
			var tb2 = new Tween(profilepic, "scaleY", Quintic.easeOut, profilepic.scaleY, .83, .5, true);
			var ta1 = new Tween(waves, "scaleX", Quintic.easeOut, waves.scaleX, .83, .5, true);
			var ta2 = new Tween(waves, "scaleY", Quintic.easeOut, waves.scaleY, .83, .5, true);
		}

	} else {
		noinputReply();
	}
	var td1 = new Tween(char, "scaleX", Quintic.easeIn, char.scaleX, .48, .5, true);
	var td2 = new Tween(char, "scaleY", Quintic.easeIn, char.scaleY, .48, .5, true);
}

function showspeech() {
	addWord();
	replyBubble();
}

function noinputReply() {
	var tb1 = new Tween(profilepic, "scaleX", Quintic.easeOut, profilepic.scaleX, .83, .5, true);
	var tb2 = new Tween(profilepic, "scaleY", Quintic.easeOut, profilepic.scaleY, .83, .5, true);
	var ta1 = new Tween(waves, "scaleX", Quintic.easeOut, waves.scaleX, .83, .5, true);
	var ta2 = new Tween(waves, "scaleY", Quintic.easeOut, waves.scaleY, .83, .5, true);
	bubble_user.gotoAndStop(2); // Show grey dots
}

function replyBubble() {
	check(bubble_user.label.txt.text);
	if (resulttype == "launchmovie" && results.currentFrame == 1) {
		launchapp("movie1");
	} else { 
		setTimeout(function () {
			maximizeTvBubble();
		}, 500);
	}
}

function prepare_bubble_tv() {
	bubble_tv.label.txt.multiline = false;
	bubble_tv.label.txt.wordWrap = false;
	bubble_tv.label.txt.autoSize = TextFieldAutoSize.LEFT;
	bubble_tv.label.txt.width = 46;
	bubble_tv.label.alpha = 0;
	bubble_tv.label.y = 0;
}


// Bubble animations

function resizeUserBubble() {
	var size;
	size = bubble_user.label.txt.width + 50;
	calculateHeight("user");
	bubble_user.shape.width = size;
	var ta0 = new Tween(bubble_user, "scaleX", Quintic.easeOut, 0, 1, .5, true);
	var ta1 = new Tween(bubble_user, "scaleY", Quintic.easeOut, 0, 1, .5, true);
	var tb2 = new Tween(bubble_user.label, "alpha", null, 0, 1, .5, true);
}

function resizeTvBubble() {
	var size;
	size = bubble_tv.label.txt.width + 50;
	calculateHeight("tv");
	bubble_tv.shape.width = size;
	var ta0 = new Tween(bubble_tv, "scaleX", Quintic.easeOut, 0, 1, .5, true);
	var ta1 = new Tween(bubble_tv, "scaleY", Quintic.easeOut, 0, 1, .5, true);
	var tb2 = new Tween(bubble_tv.label, "alpha", null, 0, 1, .5, true);
}

function calculateHeight(u) {
	var vsize = 72;
	var vlabelpos = 0;
	if (this["bubble_" + u].label.txt.numLines == 2) {
		vsize = vsize + 37.15;
		this["bubble_" + u].label.y = vlabelpos - 37.15 / 2;
	} else if (this["bubble_" + u].label.txt.numLines > 2) {
		vsize = vsize + 37.15 * 2;
		this["bubble_" + u].label.y = vlabelpos - 37.15;
	}
	this["bubble_" + u].shape.height = vsize;
}

function maximizeTvBubble() {
	bubble_tv.label.alpha = .1;
	bubble_tv.ind.x = bubble_tv.shape.width / 2;
	dismissTimer.start();
	bubble_tv.ind.alpha = 1;
	bubble_tv.ind.gotoAndPlay(40);
	setTimeout(function () { // Fake loading
		prepare_bubble_tv();
		bubble_tv.label.txt.text = tvresponse;
		checkTvStrWidth();
		resizeTvBubble();
		showresults();
		bubble_tv.ind.alpha = 0;
		bubble_tv.ind.gotoAndStop(1);
		if (farfieldon) {
			Object(parent).startmic();
		}
		setTimeout(function () { // Character starts talking 
			if (!farfieldon && !micIsPressed) {
				char.gotoAndStop("speak");
				char.seq.play();
				Object(parent).sent(tvresponse);
			}
		}, 400);
	}, serverResponseTime); // Server response time
}

function maximizeTvBubbleQuick() {
	bubble_tv.label.txt.multiline = false;
	bubble_tv.label.txt.wordWrap = false;
	bubble_tv.label.txt.autoSize = TextFieldAutoSize.LEFT;
	bubble_tv.label.txt.width = 46;
	bubble_tv.label.y = 0;
	bubble_tv.shape.height = 72;
	bubble_tv.shape.width = 80;
	bubble_tv.x = char.x + 80;
	bubble_tv.y = char.y;
	bubble_tv.scaleX = 0;
	bubble_tv.scaleY = 0;
	bubble_tv.alpha = 1;
	bubble_tv.ind.alpha = 0;
	bubble_tv.ind.gotoAndPlay(40);
	bubble_tv.label.txt.text = parsedjson.welcomemessage;
	var t0 = new Tween(bubble_tv, "scaleX", Quintic.easeOut, bubble_tv.scaleX, 1, .5, true);
	var t1 = new Tween(bubble_tv, "scaleY", Quintic.easeOut, bubble_tv.scaleY, 1, .5, true);
	var t2 = new Tween(bubble_tv.label, "alpha", null, 0, 1, .5, true);

	checkTvStrWidth();
	resizeTvBubble();
}


// Showing results

function showresults() {
	suggestions.labelstr = suggestionsArray;
	suggestions.genLabls();

	if (resulttype == "movie_cluster_16:9") {
		changeresults("cluster169movies");
		moveresults(360 - 400);
	} else if (resulttype == "movie_detail") {
		changeresults("detailmovie");
		moveresults(360 - 470);
	} else if (resulttype == "ticket_detail") {
		changeresults("detailticket");
		moveresults(360 - 360);
	} else if (resulttype == "tickets_single_row_16:9") {
		changeresults("singlerow169tickets");
		moveresults(360 - 180);
	} else if (resulttype == "movie_single_row_2:3") {
		changeresults("singlerow23movies");
		moveresults(360 - 280);
	} else if (resulttype == "single_string") {
		moveresults(360);
	}
}

function changeresults(u) {
	var t1 = new Tween(results, "alpha", null, results.alpha, 0, .25, true);
	setTimeout(changeresults2, 500, u);
}

function changeresults2(u) {
	results.gotoAndStop(u);
	var t2 = new Tween(results, "alpha", null, results.alpha, 1, .25, true);
}

function moveresults(u) {
	results.cluster.resetView();
	results.alpha = 1;
	setTimeout(function () {
		var t1 = new Tween(Object(parent).main, "y", Quintic.easeInOut, Object(parent).main.y, u, .75, true);
		changebgoverlay();
	}, 200);
}

function changebgoverlay() {
	if (resulttype == "single_string") {
		var tx2 = new Tween(Object(parent).overlaybg.bg2, "alpha", null, Object(parent).overlaybg.bg2.alpha, 0, .5, true);
	} else {
		var tx4 = new Tween(Object(parent).overlaybg.bg2, "alpha", null, Object(parent).overlaybg.bg2.alpha, 1, .5, true);
	}
}

function checkTvStrWidth() {
	if (bubble_tv.label.txt.width > 468) {
		bubble_tv.label.txt.multiline = true;
		bubble_tv.label.txt.wordWrap = true;
		bubble_tv.label.txt.width = 468;
	}
}

var currstrLines = 1;
function checkUserStrWidth() {
	if (bubble_user.label.txt.width > 468) {
		bubble_user.label.txt.multiline = true;
		bubble_user.label.txt.wordWrap = true;
		bubble_user.label.txt.width = 468;
		bubble_user.label.txt.x = -bubble_user.label.txt.width;

	}
}

function addWord() {
	if (farfieldon) {
		clearUserLabel();
	}
	bubble_user.ind.alpha = 0;
	if (Object(parent).usingapi == false) {
		assignString();
		bubble_user.label.txt.text = fullstring;
	} else {
		bubble_user.label.txt.text = Object(parent).tempstr;
	}

	checkUserStrWidth();
	resizeUserBubble();
}

function assignString() { // Splits the string from JSON into array of words
	fullstring = parsedjson.responses[stringCount].userinput[0];
	if (stringCount < stringTotal - 1) {
		stringCount++;
	} else {
		stringCount = 0;
	}
}

function launchapp(u) {
	var target;
	if (u == "movie1") {
		target = Object(parent).screen.movie1
	} else if (u == "movie2") {
		target = Object(parent).screen.movie2
	} else if (u == "actor1") {
		target = Object(parent).screen.actor1
	}
	overlayOut();
	setTimeout(function () {
		Object(parent).screen.openapp(target);
	}, 1000);
}
