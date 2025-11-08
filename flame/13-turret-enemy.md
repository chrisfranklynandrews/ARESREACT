# Story 13: Turret Enemy (Shooting Projectiles)

## Objective
Implement the Turret enemy that shoots projectiles at the player, introducing enemy attacks and requiring dodging mechanics.

## Prerequisites
- Story 12 completed (Dasher enemy)
- Understanding of projectile systems
- Basic knowledge of targeting and aiming

## Concepts Covered
- Enemy projectile system
- Targeting and aiming algorithms
- Fire rate management for enemies
- Player dodging mechanics
- Projectile-player collision

## Implementation Steps

### Step 1: Understand Turret Behavior
Turrets are stationary or slow-moving enemies that shoot at the player:
- Move slowly downward (50 pixels/second)
- Fire projectiles periodically (every 1-2 seconds)
- Aim toward player's current position
- Projectiles move in straight lines
- Turrets have moderate health (4 hits)

This introduces a new threat - players must dodge while shooting.

### Step 2: Create Enemy Projectile Class
Create `EnemyBullet` class similar to player bullets:
- Smaller than player bullets (3x8 pixels)
- Different color (red/orange vs player's yellow/cyan)
- Moves toward player at moderate speed (200 pixels/second)
- Damages player on collision
- Removed when off-screen or hitting player

Enemy projectiles should be visually distinct from player projectiles to avoid confusion.

### Step 3: Create Turret Enemy Class
Create `TurretEnemy` class extending `Enemy`:
- Larger size (40x40 pixels) - stationary target
- Moderate health (4 hits)
- Slow movement speed (50 pixels/second)
- Fire rate timer (tracks time since last shot)
- Fire cooldown (1.5-2.0 seconds between shots)

Properties:
- `fireRate`: Time between shots
- `projectileSpeed`: Speed of fired bullets
- `lastFireTime`: Tracks when last shot was fired

### Step 4: Implement Aiming Logic
Calculate direction to fire projectiles:
- Get player's current position
- Calculate vector from turret to player
- Normalize the vector (unit direction)
- Multiply by projectile speed
- Fire projectile with this velocity

```
direction = (playerPos - turretPos).normalized()
velocity = direction * projectileSpeed
```

This creates projectiles that move toward where the player currently is.

### Step 5: Add Fire Rate Management
Implement shooting logic in Turret's update method:
- Track time since last shot
- When cooldown expires, fire projectile
- Reset cooldown timer
- Spawn projectile at turret position
- Add projectile to game world

Only fire when player is in range (on screen) to avoid wasting projectiles.

### Step 6: Implement Projectile-Player Collision
Add collision detection for enemy projectiles:
- Check each enemy projectile against player
- Use AABB collision (same as bullet-enemy)
- Damage player on hit
- Remove projectile on hit
- Trigger hit effects (flash, sound)

This is the reverse of bullet-enemy collision from Story 7.

### Step 7: Add Visual Telegraphing
Warn player before Turret fires:
- Flash or glow before shooting (0.3s warning)
- Show aiming line toward player (optional)
- Charging animation
- Sound effect for charging

Visual warnings make dodging fair and skill-based.

### Step 8: Balance Turret Difficulty
Tune Turret parameters:
- Fire rate not too fast (allow dodging)
- Projectile speed not too fast (reactable)
- Turrets spawn less frequently (5-10% of enemies)
- Drop more money (25 vs 20)
- Appear starting from wave 4-5

Turrets should feel dangerous but counterable with good movement.

### Step 9: Add Predictive Aiming (Optional)
For advanced difficulty, aim where player will be:
- Calculate player velocity
- Predict future position
- Aim at predicted position instead of current
- Makes dodging more challenging

Start with simple aiming, add prediction later if needed.

### Step 10: Update Enemy Spawner
Add Turrets to spawn pool:
- Include in enemy type selection
- Low spawn weight (Standard 50%, Swooper 25%, Dasher 15%, Turret 10%)
- Increase frequency in later waves
- Limit maximum active Turrets (e.g., 3 at once)

Too many Turrets creates bullet hell - keep it manageable.

## Success Criteria
- [ ] Enemy projectile class created
- [ ] Turret enemy class created with firing logic
- [ ] Turrets aim toward player position
- [ ] Turrets fire at regular intervals
- [ ] Enemy projectiles damage player on hit
- [ ] Visual warning before firing
- [ ] Projectiles visually distinct from player bullets
- [ ] Spawner includes Turrets in mix
- [ ] Difficulty balanced appropriately
- [ ] Player can dodge projectiles with skill

## Testing
Run the game and verify:
1. Turrets spawn periodically
2. Turrets fire projectiles toward player
3. Projectiles move in straight lines
4. Projectiles damage player on hit
5. Visual warning appears before firing
6. Fire rate is consistent
7. Multiple Turrets can fire independently
8. Player can dodge with good movement
9. Turrets drop correct amount of money
10. Performance stable with multiple projectiles

Test dodging - can skilled players avoid all shots?

## Next Steps
In Story 14, we'll implement the Splitter enemy that splits into smaller enemies when destroyed. This creates cascading threats and rewards careful targeting.

## Notes

**Common Pitfalls:**
- Projectiles too fast (impossible to dodge)
- Fire rate too high (bullet hell)
- No visual warning (feels unfair)
- Aiming too accurate (no counterplay)
- Not removing off-screen projectiles (memory leak)

**Flutter/Flame Tips:**
- Reuse bullet pooling system for enemy projectiles
- Use different collision layers for player/enemy bullets
- Consider using `Vector2.angleTo()` for aiming
- Cache player position instead of querying every frame
- Use `Timer` class for fire rate management

**Performance Considerations:**
- Enemy projectiles use same optimization as player bullets
- Limit maximum active enemy projectiles (e.g., 50)
- Use object pooling for frequent creation/destruction
- Cull off-screen projectiles aggressively
- Profile with many Turrets firing simultaneously

**Reference to Original:**
The React version had Turret enemies that fired at the player. Projectiles were simple and moved in straight lines. Visual warnings telegraphed shots. We're implementing the same system with proper collision detection.

**Aiming Strategies:**
1. **Current Position**: Aim where player is now (easiest to dodge)
2. **Predictive**: Aim where player will be (harder to dodge)
3. **Spread**: Fire multiple projectiles in a cone (area denial)
4. **Homing**: Projectiles track player (very difficult)

Start with current position aiming for fairness.

**Dodging Mechanics:**
Players should be able to dodge through:
- Movement (sidestep projectiles)
- Positioning (stay away from Turrets)
- Timing (move between shots)
- Prioritization (kill Turrets first)

Good dodging should feel skillful, not lucky.

**Visual Design:**
- Enemy projectiles: Red/orange, smaller than player bullets
- Player projectiles: Yellow/cyan, larger
- Clear visual distinction prevents confusion
- Consider different shapes (enemy = circles, player = rectangles)

**Difficulty Scaling:**
- Early waves: Few Turrets, slow fire rate
- Mid waves: More Turrets, moderate fire rate
- Late waves: Many Turrets, fast fire rate
- Boss waves: Turrets + other enemies (chaos)

**Future Enhancements:**
- Burst fire (3 shots rapid, then cooldown)
- Spread shot (fan of projectiles)
- Homing projectiles
- Explosive projectiles (area damage)
- Laser beams (continuous damage)
- Turret rotation animation
- Different turret types (fast/slow, weak/strong)