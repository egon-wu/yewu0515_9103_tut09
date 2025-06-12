# ASCII Cow Animation — Perlin Noise & Randomness Version
# Creative coding major project
# yewu0515_9103_tut09

## Introduction
This project is my personal reinterpretation of our group-coded ASCII cow visualization using **Perlin noise** and **randomness** as the core animation drivers. It is built with [p5.js](https://p5js.org/) and takes inspiration from the abstract artwork **"Untitled (Bull)" by Elaine de Kooning**, which I selected at the beginning of the assignment.

## How to Interact
- Move your mouse over the canvas: the ripple effect reacts to mouse position and triggers wave-like disturbances.
- No keyboard input is required.
- The animation starts automatically when the page loads and continuously evolves using noise and random values.

## My Animation Approach

### Technique I Chose
I focused on **Perlin noise** and **randomness** to drive all animated aspects of my sketch. These techniques allow for natural, organic movement and unpredictable visual textures.

### What I Animated

| Component             | Technique                    | Behavior Description |
|-----------------------|------------------------------|-----------------------|
| Background canvas     | `noise()` + wave distortion  | Fluid ripple animation with Perlin-based offsets and mouse-triggered wave bursts |
| ASCII texture layer   | `noise()` + `random()`       | Each character flickers and changes brightness over time, forming a shifting ASCII surface |
| Cow motion            | `sin(frameCount)` oscillation| The legs gently swing using sinusoidal animation |
| Brush stroke texture  | Random angle + color sampling| Simulates the look of an oil painting with stroke direction from noise and palette sampling |
| Mouse interaction     | Mouse position               | Triggers ripple effects that distort the canvas dynamically |

### How My Version Differs
- I did not use sound, time events, or keyboard input.
- My work relies entirely on **Perlin noise**, `random()`, and **mouse interaction** to produce a rich and unpredictable animated canvas.
- The animation emphasizes spatial texture and ripple distortion instead of narrative or synchronized timing.

## Artwork Reference

My visual choices were heavily influenced by the artwork:

**Elaine de Kooning - _Untitled (Bull)_**  
📁 Reference image located at: `assets/untitled-bull- Elaine de Kooning.jpeg`

The bold gestures, abstract line contours, and raw texture in de Kooning’s work inspired the rough polygonal rendering of the cow and the expressive ASCII + brushstroke visual style.

## Technical Overview

- `generateASCIILayer()` maps a grid of Perlin-noise-based brightness to ASCII characters, with flickering from `random()`.
- `updateWaterRipple()` uses both noise fields and expanding wave calculations triggered by `mousePressed()`.
- `drawMaskedTexture()` masks each ASCII texture into the cow’s body parts.
- `createImpastoBG()` lays down brush strokes in randomized directions and colors, modulated by Perlin noise.

## External Sources and Inspiration

- [ASCII rain using Perlin noise – YouTube](https://www.youtube.com/watch?v=4IyeLc6J1Uo)
- [ASCII noise grid flicker by pattvira](https://editor.p5js.org/pattvira/sketches/pdK2ZxNSe)
- [Flow fields and Perlin distortion – YouTube](https://www.youtube.com/watch?v=zJnSwHnYLhs)
- [p5.js distortion overlay by BarneyCodes](https://editor.p5js.org/BarneyCodes/sketches/SHWPGoc-V)

These sketches gave me insight into how to use noise fields to drive visual feedback and how to generate layered distortions with simple noise and random math.

## Tools and Techniques
- I only used `p5.js` and `p5.sound.js`.
- I referenced public sketches and tutorials for conceptual inspiration, but wrote the ripple and flicker logic myself.
- Mouse ripple triggering and brush stroke generation are adapted from my own experimentation.

## How to Run the Sketch

Just open the `index.html` file in any browser.

Or clone and run locally:
```bash
git clone https://github.com/your-username/ascii-cow-perlin.git
cd ascii-cow-perlin
open index.html