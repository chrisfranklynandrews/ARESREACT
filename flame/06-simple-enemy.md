# Story 6: Simple Enemy (Standard Type)

## Objective
Create the first enemy type (Standard) with spawning logic, downward movement, health system, and basic AI behavior.

## Prerequisites
- Story 5 completed (projectile system)
- Understanding of component management
- Basic knowledge of random number generation

## Concepts Covered
- Enemy component architecture
- Spawn system and positioning
- Health and damage system
- Enemy movement patterns
- Random spawning logic

## Implementation Steps

### Step 1: Create Enemy Base Class
Create `lib/components/enemy.dart` with a base `Enemy` class that extends `PositionComponent`. This base class will be shared by all enemy types and should include:
- Health points
- Speed
- Damage value (for player collision)
- Money reward (dropped on death)
- Enemy type identifier

This base class provides common functionality that all 10 enemy types will inherit. Keep it flexible for different behaviors.

### Step 2: Create Standard Enemy Class
Create a `StandardEnemy` class that extends `Enemy`. The Standard enemy is the simplest type:
- Medium size (30x30 pixels)
- Moderate health (3 hits to destroy)
- Straight downward movement
- No special abilities
- Drops 10 money on death

This is the most common enemy type in ARES, appearing frequently throughout the game.

### Step 3: Implement Enemy Rendering
Override the `render(Canvas canvas)` method to draw the Standard enemy:
- Draw a simple geometric shape (circle, hexagon, or square)
- Use a distinct color (red or orange for enemies)
- Add a health bar above the enemy
- Consider adding a subtle outline or glow

The health bar should show current/max health visually. Make it small but visible (e.g., 20 pixels wide, 3 pixels tall).

### Step 4: Add Enemy Movement
In the `update(dt)` method, implement downward movement:
- Move down by speed * dt
- Speed should be moderate (100-150 pixels per second)
- No horizontal movement for Standard type
- Movement is constant (no acceleration)

Standard enemies move in a predictable straight line, making them easy targets for new players.

### Step 5: Create Enemy Spawner
Add a spawner system to your game class:
- Track time since last spawn
- Spawn enemies at random intervals (1-3 seconds)
- Position enemies randomly along the top edge
- Ensure enemies spawn within horizontal bounds

The spawner should create enemies just above the visible screen area so they smoothly enter the play field.

### Step 6: Implement Random Positioning
When spawning enemies:
- Generate random x position (within bounds)
- Start y position just above screen (y = -50)
- Ensure enemies don't spawn too close to edges
- Add padding to prevent clipping

Use Dart's `Random` class for position generation. Consider the enemy's size when calculating valid spawn positions.

### Step 7: Add Off-Screen Cleanup
Remove enemies that leave the bottom of the screen:
- Check if enemy's y position exceeds screen height
- Remove enemy from game
- Don't award money for escaped enemies
- Track escaped enemies for statistics (optional)

This prevents memory leaks and maintains performance. Enemies that reach the bottom represent a failure state (player didn't destroy them).

### Step 8: Implement Health System
Add damage handling to enemies:
- `takeDamage(amount)` method reduces health
- Check if health reaches zero
- Trigger death sequence when destroyed
- Award money to player on death

When an enemy dies, it should be removed from the game and trigger visual effects (we'll add explosion particles in a later story).

## Success Criteria
- [ ] Enemy base class created with common properties
- [ ] Standard enemy renders correctly
- [ ] Enemies spawn at random positions along top edge
- [ ] Enemies move downward at consistent speed
- [ ] Health bar displays correctly
- [ ] Enemies are removed when off-screen
- [ ] Damage system reduces enemy health
- [ ] Enemies die when health reaches zero
- [ ] Multiple enemies can exist simultaneously

## Testing
Run the game and verify:
1. Enemies spawn periodically at the top of screen
2. Enemies move downward smoothly
3. Spawn positions are random but within bounds
4. Health bars show current health accurately
5. Enemies disappear when reaching bottom of screen
6. Multiple enemies can be on screen at once
7. Enemy count stabilizes (no memory leaks)
8. Performance remains stable with 10+ enemies

Test the damage system by manually calling `takeDamage()` to verify health decreases and enemies die correctly.

## Next Steps
In Story 7, we'll implement the collision detection system to connect bullets with enemies. This will make the game interactive - bullets will damage enemies, and we'll add visual feedback for hits.

## Notes

**Common Pitfalls:**
- Not removing off-screen enemies (memory leak)
- Spawning enemies outside visible bounds
- Health bar not updating when damage is taken
- Enemies moving too fast or too slow
- Not using delta time for movement

**Flutter/Flame Tips:**
- Use `Random` with a seed for reproducible testing
- Store enemy references in a list for easy access
- Consider using an enum for enemy types
- Override `onRemove()` for cleanup logic
- Use `debugMode` to visualize enemy hitboxes

**Performance Considerations:**
- Limit maximum number of active enemies (e.g., 20)
- Use object pooling for frequently spawned enemies
- Cull enemies that are far off-screen
- Batch similar rendering operations
- Profile with many enemies to ensure stable FPS

**Reference to Original:**
The React version spawned Standard enemies continuously with random positioning. They moved straight down at constant speed. Health was tracked per enemy, and they dropped money on death. We're implementing identical behavior.

**Enemy Spawning Strategy:**
- Start with slow spawn rate (every 2-3 seconds)
- Increase spawn rate as game progresses
- Vary spawn rate based on current wave
- Consider spawn patterns (groups, formations)
- Balance difficulty with player power

**Health Bar Design:**
- Position above enemy (offset by enemy height)
- Background bar (dark color)
- Foreground bar (bright color, width = health percentage)
- Optional: Color changes based on health (green → yellow → red)
- Keep it small to avoid cluttering screen

**Future Enhancements:**
- Enemy death animations
- Damage numbers floating up
- Different enemy sizes
- Enemy formations and patterns
- Elite/rare enemy variants
- Enemy abilities and attacks