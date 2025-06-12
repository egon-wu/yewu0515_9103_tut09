# ASCII Cow Animation — Perlin Noise & Randomness Version

## Introduction
This project is a Perlin-noise-driven animated reinterpretation of a group-coded ASCII cow visualization, built using [p5.js](https://p5js.org/). The base structure comes from our team’s collaborative artwork — a polygonal cow rendered with rough outlines, animated legs, and an impasto-style procedural background.

## How to Interact
- Load the page, and the animation will start automatically.
- The background and cow texture will ripple and shimmer dynamically using Perlin noise and randomness.
- No mouse or keyboard input is required for animation to function.

## Individual Animation Approach

### Driver Used
**Perlin noise and randomness**

### Animated Elements and Behaviors

| Component           | Technique              | Behavior Description |
|---------------------|------------------------|-----------------------|
| Background canvas   | `noise()` and `random()` | Distorted via time-evolving Perlin displacement with ripple overlay |
| ASCII texture layer | `noise()` + flicker     | Characters dynamically change brightness and form a shifting texture |
| Cow motion          | `sin(frameCount)`       | Legs sway slightly to preserve original motion from group code |
| Brush stroke base   | Random stroke generation| Each page load renders a unique oil paint texture using noise-based direction and palette sampling |

### Distinction from Group Members
- Other group members chose **time**, **sound**, or **interaction**; I used **Perlin noise + seeded randomness**.
- This version focuses on **unpredictability and ambient texture movement** rather than interactivity or timed events.
- My animation emphasizes **complex spatial variation**, especially in ripple and ASCII character distortion.

## References and Inspirations

- [ASCII rain using Perlin noise – YouTube](https://www.youtube.com/watch?v=4IyeLc6J1Uo)  
- [ASCII noise grid flicker by pattvira](https://editor.p5js.org/pattvira/sketches/pdK2ZxNSe)  
- [Flow fields and Perlin distortion – YouTube](https://www.youtube.com/watch?v=zJnSwHnYLhs)  
- [p5.js distortion overlay by BarneyCodes](https://editor.p5js.org/BarneyCodes/sketches/SHWPGoc-V)

These references inspired the way I integrated noise-driven distortion and mapped it to visual elements such as text layers and pixel displacement.

## Technical Explanation

- `generateASCIILayer()` creates an ASCII grid where each cell uses noise brightness and a flicker factor to select a character.
- `updateWaterRipple()` applies Perlin noise displacement plus expanding circular wave forces from mouse or timed triggers.
- `drawMaskedTexture()` ensures the ASCII layer is clipped to body part shapes using an alpha mask.
- `createImpastoBG()` uses seeded noise and randomness to simulate paint strokes with spatial coherence.

## External Techniques or Tools

- I used only `p5.js` and `p5.sound.js`, plus general JavaScript and built-in noise/random APIs.
- Ripple effect was influenced by open source sketches and tutorials, but implemented manually in this project.
- References were adapted for educational purposes and all linked in this document.

## Running the Sketch

You can open the `index.html` file directly in a browser to run the project.

To clone and view via local server:
```bash
git clone https://github.com/your-username/ascii-cow-perlin.git
cd ascii-cow-perlin
open index.html