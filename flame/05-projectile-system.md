# Story 5: Basic Projectile System

## Objective
Implement the projectile system with bullet creation, movement, firing logic, and automatic cleanup for off-screen projectiles.

## Prerequisites
- Story 4 completed (player ship with movement)
- Understanding of component lifecycle
- Basic knowledge of object pooling concepts

## Concepts Covered
- Creating and managing multiple components
- Component removal and cleanup
- Fire rate limiting with timers
- Off-screen culling
- Parent-child component relationships

## Implementation Steps

### Step 1: Create Bullet Component
Create a new file `lib/components/bullet.dart`. Define a `Bullet` class that extends `PositionComponent`. Bullets are simpler than the player:
- Small size (4x12 pixels, vertical rectangle)
- Single color (bright yellow or cyan)
- Constant upward velocity
- No input handling needed

Bullets should be visually distinct and easy to see against the background. The original ARES uses bright colors for player projectiles.

### Step 2: Implement Bullet Movement
In the bullet's `update(dt)` method:
- Move upward by velocity * dt
- Velocity should be fast (e.g., 400-500 pixels per second)
- No acceleration or complex physics needed
- Movement is purely vertical (no horizontal component)

Bullets travel in a straight line from their spawn position. This is the simplest projectile type - we'll add homing missiles later.

### Step 3: Add Bullet Rendering
Override the `render(Canvas canvas)` method:
- Draw a simple rectangle or rounded rectangle
- Use a bright color (yellow, cyan, or white)
- Consider adding a subtle glow effect
- Keep it simple - bullets are small and numerous

You can also draw a simple gradient (darker at bottom, brighter at top) to give bullets more visual interest.

### Step 4: Implement Bullet Spawning
Add a method to the Player class to spawn bullets:
- Create new Bullet instance
- Position it at the player's current position (slightly above)
- Add it to the game world
- Return reference for potential tracking

The spawn position should be at the front of the player ship (top center) so bullets appear to come from the ship's weapons.

### Step 5: Add Fire Rate Limiting
Implement a cooldown timer to control firing rate:
- Track time since last shot
- Only allow firing when cooldown expires
- Reset cooldown after each shot
- Make fire rate configurable (start with 0.2 seconds between shots)

Use Flame's `Timer` class or manually track elapsed time. The original ARES has upgradeable fire rate, so design this to be easily adjustable.

### Step 6: Implement Automatic Firing
Add logic to automatically fire bullets:
- Check if cooldown has expired
- Spawn bullet at player position
- Reset cooldown timer
- Continue firing as long as game is active

In ARES, the player fires automatically - no button press needed. This is an idle game mechanic. The player only controls movement.

### Step 7: Add Off-Screen Cleanup
Bullets that leave the screen should be removed:
- Check if bullet's y position is above screen (y < 0)
- Call `removeFromParent()` to remove the component
- This prevents memory leaks and improves performance

Check this in the bullet's `update()` method. Flame will handle the actual removal and cleanup.

### Step 8: Implement Bullet Pooling (Optional but Recommended)
For better performance, implement object pooling:
- Create a pool of inactive bullets
- Reuse bullets instead of creating new ones
- Reset bullet properties when reusing
- Return bullets to pool when they go off-screen

This reduces garbage collection and improves performance, especially important when firing many bullets. You can start without pooling and add it later if needed.

## Success Criteria
- [ ] Bullet component created and renders correctly
- [ ] Bullets move upward at constant speed
- [ ] Player spawns bullets automatically
- [ ] Fire rate limiting works correctly
- [ ] Bullets are removed when off-screen
- [ ] No memory leaks (bullets are properly cleaned up)
- [ ] Multiple bullets can exist simultaneously
- [ ] Firing is frame-independent

## Testing
Run the game and verify:
1. Bullets spawn from the player ship position
2. Bullets move upward smoothly
3. Bullets fire at consistent intervals (not too fast/slow)
4. Bullets disappear when they leave the top of screen
5. Game performance remains stable with many bullets
6. Moving the player doesn't affect bullet trajectories
7. Fire rate is consistent regardless of frame rate

Use Flutter DevTools to monitor component count - it should stabilize, not grow infinitely.

## Next Steps
In Story 6, we'll create the first enemy type (Standard enemy) with spawning, movement patterns, and basic AI. This will give us something to shoot at and test our collision system.

## Notes

**Common Pitfalls:**
- Forgetting to remove off-screen bullets (memory leak)
- Not using delta time for bullet movement
- Making bullets too fast or too slow
- Spawning bullets at wrong position (not aligned with ship)
- Fire rate affected by frame rate (not using proper timer)

**Flutter/Flame Tips:**
- Use `removeFromParent()` to remove components safely
- Flame automatically calls `onRemove()` for cleanup
- Component removal happens at end of frame (safe to call during update)
- Use `children` property to access all child components
- Consider using `ComponentSet` for efficient component management

**Performance Considerations:**
- Object pooling significantly reduces garbage collection
- Limit maximum number of active bullets if needed
- Use simple shapes for bullets (faster than complex sprites)
- Batch rendering if you have hundreds of bullets
- Profile with many bullets to ensure stable frame rate

**Reference to Original:**
The React version spawned bullets automatically at a fixed rate, upgradeable through the fire rate system. Bullets were simple rectangles that moved upward. We're implementing the same behavior with Flame's component system.

**Fire Rate Mechanics:**
- Base fire rate: 5 shots per second (0.2s cooldown)
- Upgradeable to much faster rates
- Fire rate upgrade is one of the six upgrade systems
- Consider exponential scaling for upgrades (1.2x per level)

**Visual Enhancements:**
- Add a muzzle flash effect when firing
- Create bullet trail particles
- Add sound effect for firing (in later story)
- Vary bullet appearance based on upgrades
- Add critical hit visual (different color/size)

**Future Improvements:**
- Multiple bullet types (spread shot, laser, missiles)
- Bullet damage system
- Bullet upgrades (size, speed, penetration)
- Special weapons (bombs, beams)
- Bullet patterns (fan, spiral, etc.)