---
title: Timing notes
layout: page
---
1 m ≈ 3.3 ns

#### There are no "digital signals" in the nanosecond domain.

A "digital" signal is a useful simplification only at slow timescales. At nanosecond timescales you're dealing with an analog voltage moving through a physical structure, and that's what you have to measure.

**The edge has a duration.** Digital logic treats a signal as 0 or 1 that switches instantly. In reality the voltage climbs over a rise time. Take a TTL signal going from 0.7 V to 2.4 V in 1 ns: that's a slew rate of 1.7 V/ns, or 1.7 billion V/s. The consequence is that if you want to know *when* the signal changed to within a nanosecond, the edge itself takes that long. So "when" depends on which voltage you call the crossing point.

**The threshold decides the timestamp, and it's fuzzy.** A TTL input is only guaranteed to read low below 0.8 V and high above 2.0 V. The actual switching point of a given gate is somewhere in between, and it shifts with temperature, supply voltage and the individual chip. On a 1.7 V/ns edge, that 1.2 V band is about 0.7 ns of ambiguity. Two receivers looking at the same wire can disagree by most of a nanosecond about when the edge happened.

**Noise turns into timing jitter.** Any voltage noise on the edge moves the crossing point in time by roughly noise ÷ slew rate. With 10 mV of noise on a 1.7 V/ns edge, that's about 6 ps. This is why precision timing wants fast, clean edges: a steeper edge converts the same noise into less time error.

**Fast edges mean high frequencies.** A sharp transition is made of many high-frequency components (Fourier). The usual rule of thumb is bandwidth ≈ 0.35 / rise time. For a 1 ns edge that's about 350 MHz, and more like 1-2 GHz if you want to keep the edge's shape faithfully. Going down to edges of tens of picoseconds pushes this into the tens of GHz. Either way, these frequencies are high enough for RF behaviour to dominate.

**Wires become transmission lines.** Signals travel at about 15 cm/ns on a PCB and about 20 cm/ns (5 ns/m) in typical coax. So a 1 ns edge is physically about 15 cm long while it travels. Once a trace or cable is longer than roughly 1/6 of that (a few centimetres), it stops acting like an ideal conductor that is at one voltage everywhere. Maxwell's equations apply whether you call it a wire or a PCB trace:

- **Impedance:** the line has a characteristic impedance, and the signal sees that, not the load at the far end.
- **Reflections:** any mismatch (connector, stub, unterminated end, change of trace width) reflects part of the edge back. The reflection arrives nanoseconds later and adds to the signal. You get ringing and steps in the edge, and sometimes a receiver triggers twice.
- **Ground isn't a single reference:** the return current needs a path too. Inductance in that path (L·di/dt) means "ground" at the sender and at the receiver aren't the same voltage during the edge.
- **Delay:** the cable length itself is a delay you have to calibrate. Every 20 cm of coax is a nanosecond, and that delay drifts slightly with temperature.

**There is no such thing as a digital signal at this scale.** "Digital" works because you sample long after the edge has settled, so none of the above matters. When the thing you want to measure *is* the edge, at a resolution close to its own duration, you're doing analog and RF engineering. That means controlled-impedance traces, proper termination, matched cable lengths, comparators with known thresholds, and clean grounding.

This is why the PPS path from the GPS module to the timestamping hardware matters. Its length, termination and edge quality decide whether "the second starts here" is good to picoseconds or only to a nanosecond or so.