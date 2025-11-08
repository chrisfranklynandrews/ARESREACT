# Story 16: Player Auto-Targeting System

## Objective
Implement an auto-targeting system that automatically aims player bullets at the nearest enemy, making the idle gameplay more effective and satisfying.

## Prerequisites
- Story 15 completed (all enemy types)
- Understanding of distance calculations
- Basic knowledge of targeting algorithms

## Concepts Covered
- Distance-based targeting
- Nearest enemy selection
- Bullet trajectory calculation
- Idle game automation
- Target prioritization

## Implementation Steps

### Step 1: Understand Auto-Targeting Purpose
In ARES, the player only controls movement - shooting is automatic:
- Bullets fire automatically at regular intervals
- Bullets aim toward nearest enemy
- No manual aiming required (idle game mechanic)
- Makes gameplay accessible and relaxing
- Allows focus on positioning and upgrades

This is a core idle game feature that differentiates ARES from traditional shooters.

### Step 2: Implement Nearest Enemy Detection
Create a method to find the nearest enemy to the player:
```
findNearestEnemy() {
  Enemy nearest = null
  double minDistance = infinity
  
  for each enemy in activeEnemies {
    distance = calculateDistance(player, enemy)
    if (distance < minDistance) {
      minDistance = distance
      nearest = enemy
    }
  }
  
  return nearest
}
```

Use squared distance for performance (avoid sqrt):
```
distanceSquared = (dx * dx) + (dy * dy)
```

### Step 3: Calculate Aim Direction
When firing a bullet, calculate direction to target:
```
if (target != null) {
  direction = (target.position - player.position).normalized()
  bullet.velocity = direction * bulletSpeed
} else {
  // No target, fire straight up (default)
  bullet.velocity = Vector2(0, -bulletSpeed)
}
```

This ensures bullets always move toward enemies when available.

### Step 4: Add Target Leading (Optional)
For moving enemies, aim where they will be:
```
// Calculate interception point
timeToHit = distance / bulletSpeed
predictedPosition = enemy.position + (enemy.velocity * timeToHit)
direction = (predictedPosition - player.position).normalized()
```

This makes bullets more likely to hit, especially fast-moving enemies.

### Step 5: Implement Target Prioritization
Add logic to prefer certain targets:
- Closest enemy (default)
- Lowest health enemy (finish kills)
- Highest threat enemy (Chargers, Turrets)
- Enemies closest to player (defensive)

Create a scoring system:
```
score = baseScore
score -= distance * 0.1  // Prefer close
score += (maxHealth - currentHealth) * 2  // Prefer damaged
score += threatLevel * 5  // Prefer dangerous
```

Choose enemy with highest score.

### Step 6: Add Visual Targeting Indicator
Show which enemy is being targeted:
- Draw line from player to target (subtle)
- Highlight target with glow or outline
- Show targeting reticle on target
- Update indicator each frame

This helps players understand the auto-targeting system.

### Step 7: Optimize Target Selection
Avoid recalculating every frame:
- Cache nearest enemy for 0.1-0.2 seconds
- Only recalculate when:
  - Current target is destroyed
  - Cache expires
  - New enemy spawns closer
- Reduces CPU usage significantly

```
if (targetCache.isExpired() || currentTarget.isDestroyed()) {
  currentTarget = findNearestEnemy()
  targetCache.reset()
}
```

### Step 8: Handle Edge Cases
Account for special situations:
- No enemies on screen (fire straight up)
- Target destroyed mid-flight (bullet continues)
- Multiple enemies at same distance (pick randomly)
- Target behind player (still aim at it)
- Target off-screen (still valid target)

Robust targeting prevents bugs and edge case failures.

### Step 9: Add Manual Override (Optional)
Allow players to manually target:
- Tap enemy to prioritize it
- Hold tap to lock target
- Release to return to auto-targeting
- Useful for strategic play

This adds depth while maintaining idle accessibility.

### Step 10: Balance Auto-Targeting Effectiveness
Tune targeting to feel good:
- Not too accurate (some bullets should miss)
- Not too slow (responsive to new threats)
- Prioritize appropriately (smart targeting)
- Visual feedback clear (players understand system)

Test with various enemy compositions to ensure targeting feels intelligent.

## Success Criteria
- [ ] Nearest enemy detection implemented
- [ ] Bullets aim toward nearest enemy
- [ ] Targeting updates when enemies destroyed
- [ ] Visual indicator shows current target
- [ ] Performance optimized (cached targeting)
- [ ] Edge cases handled gracefully
- [ ] Targeting feels intelligent and responsive
- [ ] Works with all enemy types
- [ ] No targeting when no enemies present
- [ ] System enhances idle gameplay feel

## Testing
Run the game and verify:
1. Bullets aim toward nearest enemy
2. Targeting switches when enemy destroyed
3. Visual indicator shows current target
4. Bullets hit enemies more consistently
5. Targeting works with fast-moving enemies
6. Performance stable (no frame drops)
7. Targeting feels natural and helpful
8. Works correctly with all enemy types
9. Handles edge cases without errors
10. Enhances overall gameplay experience

Test with various enemy counts and types to ensure robustness.

## Next Steps
In Story 17, we'll implement the drone system that unlocks at ship levels 4-6. Drones provide additional firepower with unique attack types (laser, electricity, homing).

## Notes

**Common Pitfalls:**
- Recalculating target every frame (performance issue)
- Not handling destroyed targets (null reference errors)
- Targeting off-screen enemies (confusing)
- Too accurate targeting (removes challenge)
- No visual feedback (players don't understand system)

**Flutter/Flame Tips:**
- Use `Vector2.distanceToSquared()` for performance
- Cache enemy list instead of querying every frame
- Consider using spatial partitioning for many enemies
- Use `Timer` class for target cache expiration
- Profile targeting logic with 50+ enemies

**Performance Considerations:**
- Distance calculations are O(n) where n = enemy count
- Squared distance avoids expensive sqrt operation
- Caching reduces calculations by 90%+
- Spatial partitioning helps with 100+ enemies
- Profile to ensure targeting doesn't impact frame rate

**Reference to Original:**
The React version had auto-targeting that aimed at nearest enemy. Bullets automatically tracked targets. Visual indicator showed current target. We're implementing the same system with optimization.

**Targeting Strategies:**
1. **Nearest**: Simple, predictable, works well
2. **Lowest Health**: Efficient, finishes kills
3. **Highest Threat**: Defensive, protects player
4. **Weighted Score**: Balanced, considers multiple factors

Start with nearest, add complexity if needed.

**Target Leading Math:**
```
// Simple leading
futurePos = enemyPos + (enemyVel * timeToHit)

// Accurate leading (iterative)
for (i = 0; i < 3; i++) {
  timeToHit = distance(playerPos, futurePos) / bulletSpeed
  futurePos = enemyPos + (enemyVel * timeToHit)
}
```

Simple leading is usually sufficient.

**Visual Feedback Options:**
- Line from player to target
- Reticle on target
- Target glow/highlight
- Arrow pointing to target
- Target health bar emphasis

Choose feedback that's clear but not distracting.

**Idle Game Design:**
Auto-targeting is essential for idle games:
- Reduces player input requirements
- Allows focus on strategy over execution
- Makes game accessible to all skill levels
- Enables true "idle" gameplay
- Still allows skill expression through positioning

**Future Enhancements:**
- Multi-targeting (multiple bullets, multiple targets)
- Smart targeting (avoid overkill)
- Target switching cooldown
- Predictive targeting for all enemy types
- Target priority customization
- Manual target lock
- Target threat assessment