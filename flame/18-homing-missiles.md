# Story 18: Homing Missile Implementation

## Objective
Enhance the homing missile system with sophisticated tracking, visual effects, and make it available as a player weapon upgrade beyond just the drone system.

## Prerequisites
- Story 17 completed (drone system with basic homing)
- Understanding of vector mathematics
- Knowledge of steering behaviors

## Concepts Covered
- Steering behaviors (seek, pursue)
- Smooth rotation and turning
- Missile guidance systems
- Trail particle effects
- Weapon variety and upgrades

## Implementation Steps

### Step 1: Understand Homing Missile Behavior
Homing missiles are guided projectiles that track targets:
- Launch toward initial target
- Continuously update direction toward target
- Limited turn rate (can't turn instantly)
- Explode on impact or timeout
- Visual trail shows path
- More expensive than regular bullets

This creates satisfying "fire and forget" gameplay.

### Step 2: Create Homing Missile Class
Create `HomingMissile` class extending projectile base:
- Current velocity (direction and speed)
- Target enemy reference
- Turn rate (degrees per second)
- Lifetime (max flight time)
- Speed (pixels per second)
- Damage (higher than regular bullets)

Properties:
- `speed`: 250 pixels/second
- `turnRate`: 180 degrees/second
- `lifetime`: 5 seconds
- `damage`: 50 (vs regular bullet's 10)

### Step 3: Implement Steering Behavior
Use "seek" steering behavior for smooth tracking:
```
// Calculate desired direction
desired = (target.position - missile.position).normalized()

// Calculate steering force
steering = desired - missile.velocity.normalized()

// Apply steering with turn rate limit
maxTurn = turnRate * dt
steering = steering.clampLength(0, maxTurn)

// Update velocity
missile.velocity += steering
missile.velocity = missile.velocity.normalized() * speed
```

This creates smooth, realistic missile movement.

### Step 4: Handle Target Loss
Missiles should handle target destruction gracefully:
- If target destroyed, continue in current direction
- Or retarget to nearest enemy
- Or explode after brief delay
- Don't crash or behave erratically

```
if (target == null || target.isDestroyed) {
  // Option 1: Continue straight
  // (current velocity maintained)
  
  // Option 2: Retarget
  target = findNearestEnemy()
  
  // Option 3: Self-destruct
  if (timeSinceTargetLost > 1.0) {
    explode()
  }
}
```

### Step 5: Add Missile Trail Effect
Create visual trail behind missile:
- Spawn small particles at missile position
- Particles fade out over time
- Trail color matches missile
- Trail shows missile's path

Simple implementation:
```
every 0.05 seconds {
  spawnTrailParticle(missile.position)
}
```

Trail particles should be small (2-4 pixels) and fade quickly (0.3 seconds).

### Step 6: Implement Missile Rotation
Rotate missile sprite to face movement direction:
```
angle = atan2(velocity.y, velocity.x)
missile.rotation = angle
```

This makes missiles look like they're actually flying, not sliding.

### Step 7: Add Missile Launch Effect
Create visual feedback when missile launches:
- Muzzle flash at launch point
- Smoke puff
- Sound effect
- Brief screen shake (subtle)

Launch effects make missiles feel powerful and impactful.

### Step 8: Implement Missile Explosion
When missile hits target:
- Deal damage to target
- Create explosion particle effect
- Play explosion sound
- Apply area damage (optional)
- Remove missile

Explosion should be more dramatic than regular bullet hit.

### Step 9: Add Player Missile Upgrade
Make homing missiles available to player:
- New upgrade: "Homing Missiles"
- Replaces some regular bullets with missiles
- Higher cost than other upgrades
- Percentage-based (10% of shots are missiles)

This gives players another upgrade path and weapon variety.

### Step 10: Balance Missile Power
Tune missile parameters for fun gameplay:
- Damage high but not overpowered (50 vs 10)
- Turn rate allows dodging by fast enemies
- Speed fast but trackable
- Cost appropriate for power (500 base cost)
- Spawn rate balanced (10-20% of shots)

Test against all enemy types to ensure missiles feel powerful but fair.

## Success Criteria
- [ ] Homing missile class created
- [ ] Missiles track targets smoothly
- [ ] Turn rate limits create realistic movement
- [ ] Target loss handled gracefully
- [ ] Visual trail shows missile path
- [ ] Missile rotates to face direction
- [ ] Launch and explosion effects implemented
- [ ] Player can upgrade to use missiles
- [ ] Damage balanced appropriately
- [ ] Missiles work with auto-targeting

## Testing
Run the game and verify:
1. Missiles launch toward targets
2. Missiles curve smoothly toward moving enemies
3. Turn rate prevents instant direction changes
4. Missiles continue if target destroyed
5. Trail effect shows missile path clearly
6. Missile sprite rotates correctly
7. Explosions look satisfying
8. Missiles deal appropriate damage
9. Player upgrade spawns missiles correctly
10. Performance stable with multiple missiles
11. Missiles work against all enemy types

Test against fast-moving enemies (Swooper, Dasher) to verify tracking.

## Next Steps
In Story 19, we'll implement the wave system with difficulty scaling, boss waves every 3 waves, and the 25-kills-per-wave progression that drives the game forward.

## Notes

**Common Pitfalls:**
- Turn rate too high (missiles look unnatural)
- Turn rate too low (missiles miss everything)
- Not handling target destruction (crashes)
- Trail too dense (performance issues)
- Missiles too powerful (trivialize game)

**Flutter/Flame Tips:**
- Use `Vector2.angleTo()` for rotation calculations
- Cache target position for one frame (avoid multiple lookups)
- Use object pooling for trail particles
- Consider using `atan2` for angle calculations
- Profile with many missiles active

**Performance Considerations:**
- Steering calculations are lightweight
- Trail particles can add up (limit active particles)
- Limit maximum active missiles (e.g., 10)
- Use simple particle effects for trails
- Profile with maximum missiles and trails

**Reference to Original:**
The React version had homing missiles from the drone system. They tracked enemies with smooth turning. Visual trails showed paths. We're expanding this to be a player upgrade as well.

**Steering Behavior Math:**
```
// Seek behavior
desired = normalize(target - position)
steering = desired - normalize(velocity)
velocity += steering * turnRate * dt

// Pursue behavior (predictive)
futurePos = target.position + target.velocity * lookAhead
desired = normalize(futurePos - position)
// ... rest same as seek
```

Seek is simpler and usually sufficient.

**Turn Rate Balance:**
- Too high (360°/s): Instant turns, looks robotic
- Balanced (180°/s): Smooth curves, looks natural
- Too low (45°/s): Wide turns, often misses

180°/s is a good starting point.

**Visual Design:**
- Missile shape: Small rocket or arrow
- Missile color: Red or orange (danger)
- Trail color: White or yellow (exhaust)
- Explosion: Bright flash with particles
- Size: Slightly larger than regular bullets

**Damage Scaling:**
```
Regular bullet: 10 damage, 5 shots/second = 50 DPS
Homing missile: 50 damage, 0.5 shots/second = 25 DPS
But missiles have 100% hit rate vs ~70% for bullets
Effective DPS: Missiles ~35, Bullets ~35
```

Balance through hit rate, not just raw damage.

**Future Enhancements:**
- Multi-stage missiles (boost phase, tracking phase)
- Cluster missiles (split into multiple warheads)
- EMP missiles (disable enemy abilities)
- Nuke missiles (massive area damage)
- Missile barrage (fire multiple at once)
- Smart missiles (avoid obstacles)
- Missile interception (enemies shoot them down)