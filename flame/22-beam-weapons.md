# Story 22: Beam Weapons (Laser and Electricity Arc)

## Objective
Implement beam weapons for the laser and electricity drones with proper rendering, continuous damage, collision detection, and visual effects.

## Prerequisites
- Story 21 completed (particle system)
- Understanding of line rendering
- Knowledge of continuous collision detection

## Concepts Covered
- Line-based weapons
- Continuous damage over time
- Ray casting for collision
- Animated beam effects
- Visual feedback for beams

## Implementation Steps

### Step 1: Understand Beam Weapons
Beams are different from projectiles:
- Instant hit (no travel time)
- Continuous damage while active
- Visual line from source to target
- Require line-of-sight
- More visually impressive than bullets

Laser drone uses solid beam, electricity drone uses jagged arc.

### Step 2: Create Beam Base Class
Create `lib/components/beam.dart` with base Beam class:
- Start position (source)
- End position (target)
- Active state (on/off)
- Damage per second
- Visual properties (color, width, glow)
- Lifetime (for temporary beams)

Properties:
```
startPos: Vector2
endPos: Vector2
isActive: bool
damagePerSecond: double
color: Color
width: double
glowWidth: double
```

### Step 3: Implement Laser Beam
**Laser Beam (Drone 1):**
- Solid, straight line
- Bright cyan/blue color
- Continuous while target in range
- Deals 10 damage per second
- Glow effect for visibility

```
class LaserBeam extends Beam {
  update(dt) {
    if (target != null && inRange(target)) {
      startPos = drone.position
      endPos = target.position
      isActive = true
      
      // Apply damage
      target.takeDamage(damagePerSecond * dt)
    } else {
      isActive = false
    }
  }
  
  render(Canvas canvas) {
    if (!isActive) return
    
    // Draw glow (wider, transparent)
    paint.strokeWidth = glowWidth
    paint.color = color.withOpacity(0.3)
    canvas.drawLine(startPos, endPos, paint)
    
    // Draw core beam (narrow, solid)
    paint.strokeWidth = width
    paint.color = color
    canvas.drawLine(startPos, endPos, paint)
  }
}
```

### Step 4: Implement Electricity Arc
**Electricity Arc (Drone 2):**
- Jagged, animated line
- Yellow/white color
- Chains between enemies
- Deals burst damage (30 per hit)
- Animated segments

```
class ElectricityArc extends Beam {
  List<Vector2> segments = []
  
  update(dt) {
    if (shouldFire()) {
      // Find chain targets
      targets = findChainTargets(3)
      
      if (targets.isNotEmpty) {
        generateArcSegments(targets)
        applyChainDamage(targets)
      }
    }
  }
  
  generateArcSegments(targets) {
    segments.clear()
    segments.add(drone.position)
    
    for (target in targets) {
      // Add jagged path to target
      current = segments.last
      
      while (distance(current, target.position) > 20) {
        // Random offset perpendicular to direction
        direction = (target.position - current).normalized()
        perpendicular = Vector2(-direction.y, direction.x)
        offset = perpendicular * random(-15, 15)
        
        next = current + (direction * 20) + offset
        segments.add(next)
        current = next
      }
      
      segments.add(target.position)
    }
  }
  
  render(Canvas canvas) {
    if (segments.isEmpty) return
    
    // Draw jagged line through segments
    for (i = 0; i < segments.length - 1; i++) {
      paint.strokeWidth = 3
      paint.color = Colors.yellow
      canvas.drawLine(segments[i], segments[i+1], paint)
    }
  }
}
```

### Step 5: Implement Ray Casting
For laser beam collision detection:
```
findBeamTarget(startPos, maxRange) {
  Enemy nearest = null
  double minDistance = maxRange
  
  for (enemy in activeEnemies) {
    // Check if enemy intersects beam ray
    distance = distanceToLine(startPos, direction, enemy.position)
    
    if (distance < enemy.radius && 
        distanceToPoint(startPos, enemy.position) < minDistance) {
      nearest = enemy
      minDistance = distanceToPoint(startPos, enemy.position)
    }
  }
  
  return nearest
}
```

### Step 6: Add Beam Visual Effects
Enhance beams with effects:

**Laser Beam:**
- Pulsing glow (animate glow width)
- Particle sparks at impact point
- Lens flare at source
- Heat distortion (optional)

**Electricity Arc:**
- Animated segments (regenerate each frame)
- Bright flash at each chain point
- Electric particles along arc
- Sound effect for zap

### Step 7: Implement Chain Lightning
For electricity arc, implement chaining:
```
findChainTargets(maxChains) {
  targets = []
  current = drone.position
  
  for (i = 0; i < maxChains; i++) {
    // Find nearest enemy not already targeted
    nearest = findNearestEnemy(current, excludeList: targets)
    
    if (nearest == null || distance(current, nearest) > chainRange) {
      break
    }
    
    targets.add(nearest)
    current = nearest.position
  }
  
  return targets
}

applyChainDamage(targets) {
  damage = baseDamage
  
  for (target in targets) {
    target.takeDamage(damage)
    damage *= 0.8 // 20% reduction per chain
  }
}
```

### Step 8: Add Beam Cooldowns
Beams shouldn't be continuous (too powerful):

**Laser Beam:**
- Active for 2 seconds
- Cooldown for 1 second
- Cycles continuously

**Electricity Arc:**
- Instant hit
- Cooldown for 1.5 seconds
- Burst damage

```
update(dt) {
  if (isActive) {
    activeTime += dt
    if (activeTime >= activeDuration) {
      isActive = false
      cooldownTime = 0
    }
  } else {
    cooldownTime += dt
    if (cooldownTime >= cooldownDuration) {
      isActive = true
      activeTime = 0
    }
  }
}
```

### Step 9: Optimize Beam Rendering
Beams can be expensive to render:
- Cache line calculations
- Use simple rendering (avoid complex effects)
- Limit segment count for electricity
- Batch similar beams if possible
- Profile rendering performance

### Step 10: Add Boss Laser Beam
Implement sweeping laser for boss Phase 3:
```
class BossLaser extends Beam {
  double sweepAngle = 0
  double sweepSpeed = 45 // degrees per second
  
  update(dt) {
    // Sweep from left to right
    sweepAngle += sweepSpeed * dt
    
    if (sweepAngle > 180) {
      isActive = false
      return
    }
    
    // Calculate beam endpoint
    direction = Vector2(cos(sweepAngle), sin(sweepAngle))
    endPos = startPos + (direction * 1000)
    
    // Damage anything in path
    damageEnemiesInBeam()
  }
}
```

## Success Criteria
- [ ] Beam base class created
- [ ] Laser beam renders as solid line
- [ ] Laser beam deals continuous damage
- [ ] Electricity arc renders as jagged line
- [ ] Electricity arc chains between enemies
- [ ] Beams have proper cooldowns
- [ ] Visual effects enhance beam appearance
- [ ] Ray casting finds correct targets
- [ ] Chain lightning works correctly
- [ ] Performance stable with multiple beams

## Testing
Run the game with drones unlocked and verify:
1. Laser drone fires beam at nearest enemy
2. Laser beam is visible and solid
3. Laser beam deals damage over time
4. Electricity drone fires arc at enemies
5. Electricity arc is jagged and animated
6. Arc chains to 2-3 enemies
7. Damage decreases with each chain
8. Beams have appropriate cooldowns
9. Visual effects look good
10. Performance stable with all beams active
11. Boss laser sweeps correctly (if implemented)

Test with multiple drones active simultaneously.

## Next Steps
In Story 23, we'll implement additional visual effects including glows, shadows, screen shake, and animations that polish the game's appearance.

## Notes

**Common Pitfalls:**
- Beams too powerful (continuous damage)
- No cooldowns (constant beam spam)
- Electricity arc too straight (looks like laser)
- Chain lightning too long (hits everything)
- Beam rendering too expensive (frame drops)

**Flutter/Flame Tips:**
- Use `Canvas.drawLine()` for beams
- Use `Path` for complex beam shapes
- Cache beam calculations when possible
- Consider using shaders for advanced effects
- Profile beam rendering with multiple active

**Performance Considerations:**
- Line rendering is relatively fast
- Electricity segments can add up (limit to 10-15)
- Glow effects are expensive (use sparingly)
- Ray casting is O(n) where n = enemy count
- Profile with maximum beams active

**Reference to Original:**
The React version had laser and electricity beams for drones. Laser was continuous, electricity chained. Visual effects were simple but effective. We're implementing similar beams with better rendering.

**Beam Damage Balance:**
```
Laser: 10 DPS * 2s active = 20 damage per cycle
Electricity: 30 + 24 + 19 = 73 damage per cycle
Regular bullets: ~10 DPS continuous

Beams should feel powerful but not overpowered
```

**Visual Design:**
- **Laser**: Solid core + soft glow
- **Electricity**: Jagged segments + bright flashes
- **Boss Laser**: Thick beam + warning indicator
- All beams: Particle effects at impact

**Electricity Arc Animation:**
- Regenerate segments every frame
- Random offsets create jagged look
- Animate brightness (flicker)
- Add branch segments (optional)

**Future Enhancements:**
- Beam upgrades (damage, range, duration)
- Different beam types (fire, ice, plasma)
- Beam focusing (narrow = more damage)
- Beam reflection (bounces off walls)
- Beam splitting (forks into multiple)
- Beam charging (hold to power up)
- Beam overheating (cooldown increases with use)