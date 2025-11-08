# Story 11: Swooper Enemy (Sine Wave Movement)

## Objective
Implement the Swooper enemy type with sine wave horizontal movement pattern, creating more dynamic and challenging enemy behavior.

## Prerequisites
- Story 10 completed (upgrade system)
- Understanding of sine wave mathematics
- Basic knowledge of parametric movement

## Concepts Covered
- Sine wave movement patterns
- Parametric motion equations
- Enemy behavior variation
- Time-based animation
- Movement pattern design

## Implementation Steps

### Step 1: Understand Sine Wave Movement
Sine wave movement creates a smooth, oscillating horizontal motion:
- Base position moves downward (like Standard enemy)
- Horizontal offset follows sine wave: `x = centerX + amplitude * sin(frequency * time)`
- Creates smooth left-right weaving motion
- Amplitude controls how far left/right enemy moves
- Frequency controls how fast enemy oscillates

This creates a more unpredictable target that's harder to hit than Standard enemies.

### Step 2: Create Swooper Enemy Class
Create `SwooперEnemy` class extending `Enemy`:
- Similar size to Standard (30x30 pixels)
- Slightly more health (4 hits instead of 3)
- Same downward speed (100-150 pixels/second)
- Additional properties for sine wave:
  - `amplitude`: How far to move horizontally (e.g., 80 pixels)
  - `frequency`: How fast to oscillate (e.g., 2.0)
  - `centerX`: The center line of oscillation
  - `timeOffset`: Random starting phase for variety

### Step 3: Implement Sine Wave Calculation
In the `update(dt)` method, calculate position using sine wave:
- Update elapsed time: `time += dt`
- Calculate horizontal offset: `offsetX = amplitude * sin(frequency * time + timeOffset)`
- Set x position: `x = centerX + offsetX`
- Update y position normally: `y += speed * dt`

The `timeOffset` ensures Swoopers spawned at the same time don't move in perfect sync.

### Step 4: Handle Boundary Constraints
Ensure Swoopers stay within screen bounds:
- Check if calculated x position would exceed bounds
- Clamp position to valid range
- Consider reducing amplitude near screen edges
- Alternatively, reverse direction when hitting bounds

Swoopers should weave within the play area, not oscillate off-screen.

### Step 5: Set Spawn Parameters
When spawning Swoopers:
- Set `centerX` to spawn position (random along top)
- Generate random `timeOffset` (0 to 2π)
- Use consistent amplitude and frequency
- Ensure centerX allows full oscillation within bounds

The spawn position becomes the center of the sine wave, not the starting position.

### Step 6: Add Visual Distinction
Make Swoopers visually distinct from Standard enemies:
- Different color (purple or green vs red)
- Different shape (diamond or oval vs circle)
- Add motion trail effect (optional)
- Slightly larger or smaller size

Players should instantly recognize enemy types by appearance.

### Step 7: Adjust Difficulty Balance
Balance Swooper difficulty:
- More health than Standard (harder to kill)
- Drops more money (15 vs 10)
- Spawns less frequently than Standard
- Appears starting from wave 2 or 3

Swoopers should feel like a meaningful challenge without being frustrating.

### Step 8: Update Enemy Spawner
Modify the spawner to include Swoopers:
- Add Swooper to enemy type pool
- Weight spawn chances (e.g., 70% Standard, 30% Swooper)
- Increase Swooper frequency in later waves
- Ensure variety in enemy composition

The spawner should create interesting enemy mixes that keep gameplay fresh.

## Success Criteria
- [ ] Swooper enemy class created
- [ ] Sine wave movement implemented correctly
- [ ] Swoopers move smoothly left and right
- [ ] Swoopers stay within screen bounds
- [ ] Movement is frame-independent (uses delta time)
- [ ] Swoopers visually distinct from Standard enemies
- [ ] Spawner includes Swoopers in enemy mix
- [ ] Difficulty balanced appropriately
- [ ] Multiple Swoopers can exist with different patterns

## Testing
Run the game and verify:
1. Swoopers spawn periodically
2. Swoopers weave left and right smoothly
3. Sine wave motion looks natural, not jerky
4. Swoopers don't move off-screen
5. Multiple Swoopers have different movement patterns
6. Swoopers are harder to hit than Standard enemies
7. Movement speed feels appropriate
8. Amplitude and frequency create interesting patterns
9. Swoopers drop correct amount of money
10. Performance remains stable with multiple Swoopers

Adjust amplitude and frequency values until movement feels challenging but fair.

## Next Steps
In Story 12, we'll implement the Dasher enemy with pause-and-dash behavior. This creates a different challenge - enemies that suddenly accelerate toward the player.

## Notes

**Common Pitfalls:**
- Not using delta time (movement speed varies with frame rate)
- Amplitude too large (enemies go off-screen)
- Frequency too high (movement looks spastic)
- Forgetting to add random time offset (all enemies sync)
- Not clamping position to bounds

**Flutter/Flame Tips:**
- Use `dart:math` for sin() function
- Store time as double for precision
- Consider using `Vector2` for position calculations
- Cache sine calculations if performance is an issue
- Use `debugMode` to visualize movement path

**Performance Considerations:**
- Sine calculations are fast (hardware accelerated)
- No need to optimize unless you have 100+ Swoopers
- Consider using lookup tables for extreme cases
- Profile if you notice frame drops
- Movement calculations are per-enemy, not per-frame

**Reference to Original:**
The React version had Swooper enemies with sine wave movement. They were harder to hit and dropped more money. Movement parameters were tuned for challenge without frustration. We're implementing identical behavior.

**Movement Pattern Variations:**
- **Gentle**: amplitude=50, frequency=1.5 (easy to predict)
- **Standard**: amplitude=80, frequency=2.0 (moderate challenge)
- **Aggressive**: amplitude=100, frequency=3.0 (hard to hit)
- **Chaotic**: Random amplitude/frequency per enemy

Start with standard values and adjust based on playtesting.

**Sine Wave Math Explained:**
```
sin(0) = 0      (center)
sin(π/2) = 1    (max right)
sin(π) = 0      (center)
sin(3π/2) = -1  (max left)
sin(2π) = 0     (center, cycle complete)
```

Frequency multiplies time, speeding up the cycle.
Amplitude multiplies result, increasing range.

**Visual Enhancement Ideas:**
- Trail particles following the path
- Rotation based on movement direction
- Glow effect that pulses with movement
- Different colors for different frequencies
- Size changes with horizontal position

**Future Enhancements:**
- Vertical sine wave (up-down oscillation)
- Circular motion (combine sine and cosine)
- Figure-8 patterns
- Spiral movement
- Bezier curve paths
- Randomized movement patterns