# trace-differences
code patches programs for an a/v composition

this work captures a performance of a gestural instrument i made. my gestures, captured by a [Leap Motion](https://www.ultraleap.com/product/leap-motion-controller/) control a software instrument to generate sound. The performance is also captured by ordinary video, then that video is processed in [Max] (https://cycling74.com/).

## audio
gestures are captured using a Leap Motion working in conjuction with the Leap Motion SDK. leapProcessing_PDM.pde, running in [Processing](https://processing.org/) retrieves certain gestures from the Leap Motion, then transmits that data with OSC over UDP to the gestureHub patch in Max. Max does some additonal parsing, then transmits data to Ableton Live, via MIDI (note on/off) and also via OSC (parameter controls). The osc-receiver.amxd Max for Live device is responsible for receiving OSC messages from Processing and mapping them to parameters within Live. The instrument being played in Live is Madrona Labs' [Kaivo] (https://madronalabs.com/products/kaivo). 

## video
video of the performance has been captured using an iPhone 11. That video is then processed in Max in trace-differences-gpu_0.3.maxpat.

##files included
* leapProcessing_PDM.pde
* gestureHub: gestureHub_1.2.1.maxpat and abstractions
* osc-receiver.amxd
* scratchingACello[4].mlpreset (Kaivo instrument preset)
* trace-differences_2020-11-07.als (ableton live file)
* trace-differences-gpu_0.3.maxpat
