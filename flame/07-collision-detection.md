# Story 7: Collision Detection System

## Objective
Implement collision detection between bullets and enemies, handle hit responses, and add visual feedback for successful hits.

## Prerequisites
- Story 6 completed (enemy spawning and movement)
- Understanding of AABB collision detection
- Basic knowledge of spatial optimization

## Concepts Covered
- Axis-Aligned Bounding Box (AABB) collision
- Collision detection optimization
- Hit response and feedback
- Component interaction patterns
- Collision layers and filtering

## Implementation Steps

### Step 1: Understand AABB Collision
AABB (Axis-Aligned Bounding Box) collision is the simplest and fastest collision detection method:
- Each entity has a rectangular bounding box
- Check if boxes overlap on both X and Y axes
- Collision occurs when: `(box1.left < box2.right && box1.right > box2.left && box1.top < box2.bottom && box1.bottom > box2.top)`

This works perfectly for ARES since all entities are roughly rectangular and don't rotate significantly.

### Step 2: Add Collision Bounds to Components
Add methods to get collision bounds for each component type:
- Player: Use the ship's size and position
- Bullet: Use the bullet's size and position
- Enemy: Use the enemy's size and position

In Flame, `PositionComponent` provides `toRect()` method that returns the component's bounding box. You can use this directly or create custom collision shapes.

### Step 3: Create Collision Manager
Create a `CollisionManager` class or add collision logic to your game class:
- Track all collidable entities (bullets, enemies, player)
- Check collisions each frame
- Handle collision responses
- Optimize checks (don't check every entity against every other)

The manager should iterate through bullets and check each against all enemies. This is O(n*m) complexity but acceptable for the number of entities in ARES.

### Step 4: Implement Bullet-Enemy Collision
In your game's update loop, check for bullet-enemy collisions:
- For each active bullet
- Check against each active enemy
- If collision detected:
  - Damage the enemy
  - Remove the bullet
  - Trigger hit effects

Use the AABB collision formula from Step 1. Flame also provides built-in collision detection through `CollisionCallbacks` mixin, which you can use as an alternative.

### Step 5: Handle Hit Response
When a bullet hits an enemy:
- Call `enemy.takeDamage(bulletDamage)`
- Remove the bullet immediately
- Check if enemy health reached zero
- Award money if enemy died
- Increment kill counter
- Trigger visual/audio feedback

The bullet should be removed on first hit (no penetration for basic bullets). Later we can add penetrating bullets as an upgrade.

### Step 6: Add Visual Hit Feedback
Create visual feedback for successful hits:
- Flash the enemy white briefly
- Spawn small particle effect at hit point
- Scale the enemy slightly (hit reaction)
- Show damage number floating up (optional)

These effects make combat feel impactful and help players understand what's happening. Keep effects brief (0.1-0.2 seconds) to avoid visual clutter.

### Step 7: Implement Player-Enemy Collision
Add collision detection between player and enemies:
- Check if any enemy overlaps with player
- Reduce player shields on collision
- Remove the enemy (or bounce it away)
- Trigger damage effects on player
- Check for game over if shields depleted

Player collision should feel punishing but fair. Consider adding brief invincibility after being hit to prevent instant death from multiple enemies.

### Step 8: Optimize Collision Detection
Implement basic optimizations:
- Spatial partitioning (divide screen into grid cells)
- Only check nearby entities
- Skip off-screen entities
- Use broad-phase/narrow-phase approach
- Cache collision bounds when possible

For ARES's entity count, simple optimizations are sufficient. Don't over-engineer unless you see performance issues.

## Success Criteria
- [ ] AABB collision detection implemented
- [ ] Bullets damage enemies on hit
- [ ] Bullets are removed after hitting enemy
- [ ] Enemies die when health reaches zero
- [ ] Player takes damage from enemy collision
- [ ] Visual feedback shows successful hits
- [ ] Kill counter increments correctly
- [ ] Money is awarded for enemy kills
- [ ] No false positive collisions
- [ ] Performance remains stable with many entities

## Testing
Run the game and verify:
1. Bullets destroy enemies after correct number of hits
2. Bullets disappear immediately on hit
3. Enemy health bars decrease when hit
4. Visual feedback appears at hit location
5. Player takes damage when touching enemies
6. Kill counter increases when enemies die
7. Money is awarded for each kill
8. No bullets pass through enemies
9. Collision detection works at all frame rates
10. Performance is stable with 20+ entities

Test edge cases: bullets hitting multiple enemies, player touching multiple enemies, rapid-fire scenarios.

## Next Steps
In Story 8, we'll implement game state management to handle different game states (playing, paused, game over). This will give us proper control flow and allow us to add menus and transitions.

## Notes

**Common Pitfalls:**
- Checking collisions in wrong order (after entities removed)
- Not removing bullets after collision (bullets hit multiple enemies)
- Collision bounds not matching visual representation
- Forgetting to check if entities still exist before collision check
- Performance issues from checking all entities against all others

**Flutter/Flame Tips:**
- Flame provides `CollisionCallbacks` mixin for automatic collision detection
- Use `HasCollisionDetection` mixin on game class to enable collision system
- `PolygonComponent` and `CircleComponent` have built-in collision shapes
- Consider using Flame's collision system instead of manual AABB checks
- Debug collision bounds with `debugMode = true`

**Performance Considerations:**
- AABB checks are very fast (simple arithmetic)
- Spatial partitioning helps with many entities (100+)
- Broad-phase culling eliminates most checks
- Cache entity lists instead of querying every frame
- Profile collision detection if FPS drops

**Reference to Original:**
The React version used simple rectangle collision detection. Bullets were removed on first hit, enemies took damage, and player had shields. We're implementing the same system with Flame's component architecture.

**Collision Detection Approaches:**
1. **Manual AABB**: Simple, fast, full control
2. **Flame's Collision System**: Automatic, feature-rich, slightly more complex
3. **Hybrid**: Use Flame's system with custom collision logic

For ARES, either approach works. Manual AABB is simpler to understand initially.

**Hit Feedback Best Practices:**
- Keep effects brief (< 0.2 seconds)
- Use contrasting colors (white flash on colored enemy)
- Add screen shake for player hits (subtle)
- Combine visual and audio feedback
- Scale effects based on damage amount

**Future Enhancements:**
- Penetrating bullets (hit multiple enemies)
- Explosive bullets (area damage)
- Enemy shields (require multiple hits to penetrate)
- Critical hits (random bonus damage)
- Collision damage types (fire, ice, electric)
- Invincibility frames for player