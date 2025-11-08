# Story 17: Drone System (Laser, Electricity, Homing)

## Objective
Implement the drone system that unlocks at ship levels 4-6, providing additional firepower with three unique attack types: laser beams, electricity arcs, and homing missiles.

## Prerequisites
- Story 16 completed (auto-targeting)
- Understanding of different weapon types
- Knowledge of upgrade system integration

## Concepts Covered
- Companion/pet system
- Multiple weapon types
- Orbital movement patterns
- Beam weapon rendering
- Upgrade-based unlocks

## Implementation Steps

### Step 1: Understand Drone System
Drones are companion units that orbit the player:
- Unlock at Ship Level 4, 5, and 6 (one per level)
- Each drone has a unique weapon type
- Orbit around player at fixed distance
- Attack independently with their own cooldowns
- Provide significant power increase

This creates meaningful progression through the Ship Level upgrade.

### Step 2: Create Drone Base Class
Create `lib/components/drone.dart` with base Drone class:
- Position relative to player (orbital)
- Orbit radius (distance from player)
- Orbit angle (position on circle)
- Orbit speed (rotation rate)
- Weapon type (laser, electricity, homing)
- Fire rate and cooldown

Properties:
- `orbitRadius`: 60-80 pixels from player
- `orbitSpeed`: 90 degrees per second (slow rotation)
- `fireRate`: Varies by weapon type

### Step 3: Implement Orbital Movement
Drones orbit the player in a circle:
```
angle += orbitSpeed * dt
x = player.x + cos(angle) * orbitRadius
y = player.y + sin(angle) * orbitRadius
```

For multiple drones, offset starting angles:
- Drone 1: 0 degrees
- Drone 2: 120 degrees
- Drone 3: 240 degrees

This creates evenly-spaced orbital pattern.

### Step 4: Create Laser Drone
**Laser Drone (Ship Level 4):**
- Fires continuous laser beam
- Beam connects drone to nearest enemy
- Deals damage over time (10 damage/second)
- Visual: Bright beam with glow effect
- Fire rate: Continuous (always on when enemy in range)

Implementation:
- Find nearest enemy in range (300 pixels)
- Draw line from drone to enemy
- Apply damage each frame while connected
- Beam width: 3-5 pixels
- Beam color: Cyan or blue

### Step 5: Create Electricity Drone
**Electricity Drone (Ship Level 5):**
- Fires arcing electricity
- Chains between multiple enemies
- Hits 2-3 enemies per attack
- Visual: Jagged lightning bolt
- Fire rate: Every 1.5 seconds

Implementation:
- Find nearest enemy
- Deal damage to that enemy
- Chain to next nearest enemy within range
- Continue for 2-3 jumps
- Each jump deals 80% of previous damage
- Arc color: Yellow or white

### Step 6: Create Homing Drone
**Homing Drone (Ship Level 6):**
- Fires homing missiles
- Missiles track target until hit
- High damage per missile (50)
- Visual: Small missile with trail
- Fire rate: Every 2 seconds

Implementation:
- Spawn homing missile at drone position
- Missile tracks nearest enemy
- Update missile direction each frame toward target
- Missile speed: 250 pixels/second
- Turn rate: 180 degrees/second

### Step 7: Implement Drone Unlocking
Connect drones to Ship Level upgrade:
```
onShipLevelUpgrade(level) {
  if (level == 4) {
    spawnDrone(DroneType.Laser)
  } else if (level == 5) {
    spawnDrone(DroneType.Electricity)
  } else if (level == 6) {
    spawnDrone(DroneType.Homing)
  }
}
```

Drones persist until game over, then respawn on next run if Ship Level maintained.

### Step 8: Add Drone Rendering
Render drones distinctly:
- **Laser Drone**: Triangular shape, cyan color
- **Electricity Drone**: Diamond shape, yellow color
- **Homing Drone**: Circular shape, red color
- All drones: Glow effect, rotation animation
- Size: 15-20 pixels

Drones should be visible but not obstruct view of enemies.

### Step 9: Implement Beam Rendering
For Laser and Electricity drones, render beams:

**Laser Beam:**
```
canvas.drawLine(
  dronePosition,
  targetPosition,
  paint..strokeWidth = 4..color = cyan
)
// Add glow effect with wider, semi-transparent line
canvas.drawLine(
  dronePosition,
  targetPosition,
  paint..strokeWidth = 8..color = cyan.withOpacity(0.3)
)
```

**Electricity Arc:**
```
// Draw jagged line with random offsets
for each segment in arc {
  offset = random(-10, 10)
  drawLineSegment(start, end + offset)
}
```

### Step 10: Balance Drone Power
Tune drone damage to feel impactful but not overpowered:
- Laser: 10 DPS (continuous)
- Electricity: 30 damage per hit, chains 3x (90 total)
- Homing: 50 damage per missile

Combined with player bullets, drones should roughly double DPS.

Test with various enemy compositions to ensure balance.

## Success Criteria
- [ ] Drone base class created with orbital movement
- [ ] Laser drone fires continuous beam
- [ ] Electricity drone chains between enemies
- [ ] Homing drone fires tracking missiles
- [ ] Drones unlock at Ship Level 4, 5, 6
- [ ] Drones orbit player smoothly
- [ ] Each drone type visually distinct
- [ ] Beam rendering looks good
- [ ] Damage balanced appropriately
- [ ] Multiple drones work together

## Testing
Run the game and verify:
1. No drones at Ship Level < 4
2. Laser drone appears at Ship Level 4
3. Electricity drone appears at Ship Level 5
4. Homing drone appears at Ship Level 6
5. Drones orbit player in circle
6. Laser beam connects to enemies
7. Electricity chains between enemies
8. Homing missiles track targets
9. All three drones can be active simultaneously
10. Drones significantly increase player power
11. Performance stable with all drones active

Test progression from no drones to all three unlocked.

## Next Steps
In Story 18, we'll enhance the homing missile system with better tracking, visual effects, and make it available as a player weapon upgrade (not just drones).

## Notes

**Common Pitfalls:**
- Drones moving too fast (disorienting)
- Beams too thick (obscure view)
- Homing missiles too accurate (boring)
- Drones unlocking at wrong levels
- Orbital math errors (drones drift away)

**Flutter/Flame Tips:**
- Use `Vector2.rotate()` for orbital calculations
- Cache trigonometric calculations when possible
- Use `Canvas.drawLine()` for beams
- Consider using `Path` for electricity arcs
- Profile beam rendering if performance issues

**Performance Considerations:**
- Beam rendering is relatively expensive
- Limit beam segments for electricity arcs
- Use simple line rendering, not complex effects
- Homing missiles use standard projectile system
- Profile with all three drones active

**Reference to Original:**
The React version unlocked drones at Ship Level 4, 5, 6. Each had unique weapons: laser (continuous), electricity (chain), homing (tracking). Drones orbited the player. We're implementing identical behavior.

**Orbital Math:**
```
// Convert angle to radians
angleRad = angle * (PI / 180)

// Calculate position
x = centerX + cos(angleRad) * radius
y = centerY + sin(angleRad) * radius

// Update angle
angle += speed * dt
if (angle >= 360) angle -= 360
```

**Weapon Type Comparison:**
- **Laser**: Consistent DPS, good for tanky enemies
- **Electricity**: Burst damage, good for groups
- **Homing**: High single-target, good for priority targets

Each weapon type has situational advantages.

**Visual Effects:**
- Laser: Solid beam with glow
- Electricity: Animated jagged arc
- Homing: Missile with particle trail
- All: Muzzle flash on fire
- All: Impact effect on hit

**Progression Feel:**
- Ship Level 4: "I got a helper!"
- Ship Level 5: "Now I have two!"
- Ship Level 6: "Full squad!"

Each unlock should feel like a significant power spike.

**Future Enhancements:**
- Drone upgrades (damage, fire rate)
- Different drone types (shield, heal, buff)
- Drone formations (line, triangle, circle)
- Drone abilities (special attacks)
- Drone customization (colors, shapes)
- More drones at higher ship levels
- Drone AI improvements (target priority)