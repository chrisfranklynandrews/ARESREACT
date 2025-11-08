# Story 3: Game Loop Implementation

## Objective
Implement the game loop with proper delta time handling, understand FPS management, and create the foundation for smooth animations and movement in the ARES shooter.

## Prerequisites
- Story 2 completed (game canvas setup)
- Understanding of frame-based animation
- Basic knowledge of time-based vs frame-based movement

## Concepts Covered
- Delta time (dt) and frame-independent movement
- Flame's update/render cycle
- FPS monitoring and performance
- Component lifecycle methods
- Time-based game logic

## Implementation Steps

### Step 1: Understand Delta Time
Delta time (dt) represents the time elapsed since the last frame, typically in seconds. This is crucial for smooth, consistent gameplay across different devices:
- A device running at 60 FPS has dt ≈ 0.0167 seconds per frame
- A device running at 30 FPS has dt ≈ 0.0333 seconds per frame
- By multiplying movement by dt, objects move at the same speed regardless of frame rate

For example, if an enemy should move 100 pixels per second:
- At 60 FPS: moves 100 * 0.0167 = 1.67 pixels per frame
- At 30 FPS: moves 100 * 0.0333 = 3.33 pixels per frame
- Both result in 100 pixels per second

### Step 2: Override the Update Method
In your `AresGame` class, override the `update(double dt)` method. This method is called every frame before rendering. The `dt` parameter is automatically provided by Flame and represents seconds since the last frame.

This is where you'll:
- Update game state
- Process input
- Move entities
- Check collisions
- Update timers
- Handle game logic

Keep this method efficient - it runs 60 times per second!

### Step 3: Create a Simple FPS Counter
Add an FPS counter to monitor performance. Create a simple component that:
- Tracks frame times
- Calculates average FPS over the last second
- Displays the FPS on screen

This helps identify performance issues early. In Flame, you can create a `TextComponent` that updates its text each frame with the current FPS.

Calculate FPS as: `1.0 / dt` for instantaneous FPS, or maintain a rolling average for smoother readings.

### Step 4: Add Game Time Tracking
Create variables to track:
- Total elapsed game time (sum of all dt values)
- Current wave time (resets each wave)
- Time since last spawn
- Time since last difficulty increase

These timers drive the game's progression system. The original ARES increases difficulty every 60 seconds and spawns enemies based on timers.

### Step 5: Implement Pause Functionality
Add the ability to pause the game loop. When paused:
- Stop calling update on game components
- Continue rendering (so the game doesn't freeze)
- Show a pause overlay
- Prevent input processing

Create a `isPaused` boolean flag. In your update method, check this flag and return early if true. This prevents game logic from running while maintaining the render loop.

### Step 6: Create Update Priority System
Not all components need to update at the same rate. Consider creating update priorities:
- **Critical** (every frame): Player, enemies, projectiles
- **Normal** (every frame): Particles, effects
- **Low** (every few frames): UI updates, background

Flame's component system handles this automatically through the component tree, but understanding priorities helps optimize performance later.

### Step 7: Add Debug Time Controls
For testing, add debug controls to:
- Speed up time (2x, 4x speed)
- Slow down time (0.5x, 0.25x speed)
- Step frame-by-frame
- Display current dt value

Multiply dt by a `timeScale` factor before passing it to components. This is invaluable for testing enemy patterns, timing-based mechanics, and difficulty progression.

### Step 8: Test Frame Independence
Verify that game logic is frame-independent:
- Run the game on different devices
- Use debug time controls to vary frame rate
- Ensure movement speeds remain consistent
- Check that timers fire at correct intervals

If something moves faster on a faster device, it's not using dt correctly.

## Success Criteria
- [ ] Update method implemented and called every frame
- [ ] Delta time properly passed to all game logic
- [ ] FPS counter displays current frame rate
- [ ] Game time tracking implemented
- [ ] Pause functionality works correctly
- [ ] Debug time controls functional
- [ ] Movement is frame-independent
- [ ] Game runs smoothly at 60 FPS

## Testing
Run the game and verify:
1. FPS counter shows stable 60 FPS (or device refresh rate)
2. Pausing stops game logic but keeps rendering
3. Time scale controls affect game speed proportionally
4. Game runs consistently on different devices
5. No stuttering or frame drops during normal operation

Use Flutter DevTools Performance tab to profile the update loop and identify any bottlenecks.

## Next Steps
In Story 4, we'll create the player ship component with rendering, positioning, and movement controls. We'll use the delta time system we just built to ensure smooth, responsive player movement.

## Notes

**Common Pitfalls:**
- Forgetting to multiply movement by dt (causes frame-rate dependent movement)
- Using dt for discrete events (use timers instead)
- Not clamping dt for large frame drops (can cause physics issues)
- Updating UI every frame (wasteful, update only when values change)

**Flutter/Flame Tips:**
- Flame automatically provides dt to all components' update methods
- The game loop runs on the main thread - keep update methods fast
- Use `Timer` class from Flame for countdown/interval timers
- Consider using `FixedUpdate` for physics if you add complex collisions later
- Profile with `flutter run --profile` for accurate performance metrics

**Performance Considerations:**
- Target 60 FPS on mid-range devices
- Keep update methods under 16ms (1/60th second)
- Avoid allocating objects in update loop (causes garbage collection)
- Use object pooling for frequently created/destroyed objects (we'll implement this later)
- Cache calculations that don't change every frame

**Reference to Original:**
The React version used `requestAnimationFrame` which provides dt automatically. Flame's game loop is similar but more structured. The original game tracked time for wave progression and difficulty scaling - we're setting up the same foundation here.

**Advanced Concepts (For Later):**
- Fixed timestep for deterministic physics
- Interpolation for smooth rendering between updates
- Separate update rates for different systems
- Async operations and the game loop