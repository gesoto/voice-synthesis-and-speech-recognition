# Voice Synthesis & Speech Recognition Prototype

This is a sample of a prototype created to simulate voice interactions in a display interface.
The prototype combined voice recognition and speech synthesis with a simulated visual interface with multiple animations.

![Image of description](readmeimg/description1.gif)

The variables in the voice recognition and speech output were controlled by a JSON file containing all the strings.

The recognition and syntesis was done in the HTML side with [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) using `SpeechSynthesisUtterance` and `SpeechRecognition`. I hooked these events to an Animate prototype contianing all the dynamic animations and visuals.

![Image of description](readmeimg/description2.gif)
