# Story 21: Particle System (Explosions, Trails, Effects)

## Objective
Implement a comprehensive particle system for explosions, trails, hit effects, and other visual feedback that makes combat feel impactful and satisfying.

## Prerequisites
- Story 20 completed (boss enemy)
- Understanding of particle systems
- Basic knowledge of visual effects

## Concepts Covered
- Particle emitters and spawners
- Particle lifecycle (spawn, update, fade, die)
- Object pooling for particles
- Various particle effects
- Performance optimization

## Implementation Steps

### Step 1: Understand Particle Systems
Particles are small, short-lived visual elements:
- Spawn at specific locations (explosions, hits)
- Move according to physics (velocity, gravity)
- Fade out over time (alpha/opacity)
- Die and get recycled (object pooling)
- Create visual impact without gameplay effect

Good particles make the game feel "juicy" and responsive.

### Step 2: Create Particle Class
Create `lib/components/particle.dart` with base Particle class:
- Position (x, y)
- Velocity (dx, dy)
- Lifetime (current, maximum)
- Size (width, height)
- Color (with alpha for fading)
- Gravity (optional downward acceleration)

Properties:
```
position: Vector2
velocity: Vector2
lifetime: double = 0.0
maxLifetime: double = 1.0
size: double = 4.0
color: Color
gravity: double = 0.0
```

### Step 3: Implement Particle Update
Particles update each frame:
```
update(dt) {
  // Update lifetime
  lifetime += dt
  
  // Check if dead
  if (lifetime >= maxLifetime) {
    removeFromParent()
    return
  }
  
  // Update position
  velocity.y += gravity * dt
  position += velocity * dt
  
  // Calculate fade
  alpha = 1.0 - (lifetime / maxLifetime)
}
```

### Step 4: Create Particle Pool
Implement object pooling for performance:
```
class ParticlePool {
  List<Particle> activeParticles = []
  List<Particle> inactiveParticles = []
  
  Particle spawn(position, velocity, color) {
    Particle p
    
    if (inactiveParticles.isNotEmpty) {
      p = inactiveParticles.removeLast()
      p.reset(position, velocity, color)
    } else {
      p = Particle(position, velocity, color)
    }
    
    activeParticles.add(p)
    return p
  }
  
  recycle(Particle p) {
    activeParticles.remove(p)
    inactiveParticles.add(p)
  }
}
```

### Step 5: Create Explosion Effect
Implement explosion particles for enemy deaths:
```
spawnExplosion(position, color) {
  particleCount = 20-30
  
  for (i = 0; i < particleCount; i++) {
    // Random direction
    angle = random(0, 360)
    speed = random(50, 150)
    
    velocity = Vector2(
      cos(angle) * speed,
      sin(angle) * speed
    )
    
    particle = pool.spawn(
      position,
      velocity,
      color
    )
    
    particle.maxLifetime = random(0.3, 0.8)
    particle.size = random(2, 6)
    particle.gravity = 100 // Falls down
  }
}
```

### Step 6: Create Trail Effect
Implement trail particles for missiles and fast-moving objects:
```
spawnTrail(position, color) {
  particle = pool.spawn(
    position,
    Vector2(0, 0), // No velocity
    color
  )
  
  particle.maxLifetime = 0.3
  particle.size = 3
  particle.gravity = 0
}

// Call every 0.05 seconds for continuous trail
```

### Step 7: Create Hit Effect
Implement hit particles for bullet impacts:
```
spawnHitEffect(position, direction) {
  particleCount = 5-8
  
  for (i = 0; i < particleCount; i++) {
    // Spread around impact direction
    angle = direction.angle + random(-30, 30)
    speed = random(100, 200)
    
    velocity = Vector2(
      cos(angle) * speed,
      sin(angle) * speed
    )
    
    particle = pool.spawn(
      position,
      velocity,
      Colors.white
    )
    
    particle.maxLifetime = 0.2
    particle.size = 2
  }
}
```

### Step 8: Create Muzzle Flash
Implement muzzle flash for weapon firing:
```
spawnMuzzleFlash(position, direction) {
  particleCount = 3-5
  
  for (i = 0; i < particleCount; i++) {
    // Forward direction with slight spread
    angle = direction.angle + random(-15, 15)
    speed = random(150, 250)
    
    velocity = Vector2(
      cos(angle) * speed,
      sin(angle) * speed
    )
    
    particle = pool.spawn(
      position,
      velocity,
      Colors.yellow
    )
    
    particle.maxLifetime = 0.1
    particle.size = 4
  }
}
```

### Step 9: Add Particle Rendering
Render particles efficiently:
```
render(Canvas canvas) {
  for (particle in activeParticles) {
    paint.color = particle.color.withOpacity(particle.alpha)
    
    canvas.drawCircle(
      particle.position,
      particle.size,
      paint
    )
  }
}
```

Consider batching similar particles for better performance.

### Step 10: Integrate Particles into Game
Add particle effects to game events:
- Enemy death → Explosion (color matches enemy)
- Bullet hit → Hit effect (white sparks)
- Weapon fire → Muzzle flash (yellow/orange)
- Missile trail → Continuous trail (white/gray)
- Boss phase transition → Large explosion
- Player damage → Red particles
- Power-up collect → Sparkle effect

## Success Criteria
- [ ] Particle class created with lifecycle
- [ ] Particle pool implemented for performance
- [ ] Explosion effect spawns on enemy death
- [ ] Trail effect follows missiles
- [ ] Hit effect shows bullet impacts
- [ ] Muzzle flash shows weapon firing
- [ ] Particles fade out smoothly
- [ ] Particles are recycled (no memory leaks)
- [ ] Performance stable with many particles
- [ ] Visual effects enhance game feel

## Testing
Run the game and verify:
1. Explosions appear when enemies die
2. Explosion particles spread outward
3. Particles fade out over time
4. Missile trails are visible and smooth
5. Hit effects appear on bullet impact
6. Muzzle flashes appear when firing
7. Multiple effects can occur simultaneously
8. Performance remains stable (60 FPS)
9. No memory leaks (particle count stabilizes)
10. Effects enhance visual feedback
11. Colors match game theme

Stress test with many simultaneous explosions.

## Next Steps
In Story 22, we'll implement beam weapons (laser and electricity) with proper rendering, collision detection, and visual effects for the drone system.

## Notes

**Common Pitfalls:**
- Not using object pooling (performance issues)
- Too many particles (frame drops)
- Particles too large (obscure gameplay)
- Not removing dead particles (memory leak)
- Particles lasting too long (visual clutter)

**Flutter/Flame Tips:**
- Use `Canvas.drawPoints()` for many small particles
- Batch particles by color for efficiency
- Consider using `ParticleComponent` from Flame
- Profile particle rendering if FPS drops
- Limit maximum active particles (e.g., 500)

**Performance Considerations:**
- Object pooling is essential for particles
- Rendering many particles is expensive
- Use simple shapes (circles, squares)
- Avoid complex calculations in particle update
- Profile with 100+ active particles

**Reference to Original:**
The React version had particle effects for explosions, hits, and trails. Effects were simple but effective. We're implementing similar effects with proper pooling and optimization.

**Particle Effect Design:**
- **Explosions**: Radial burst, fades quickly
- **Trails**: Continuous spawn, no velocity
- **Hits**: Directional spray, very brief
- **Muzzle Flash**: Forward cone, instant
- **Sparkles**: Random directions, floaty

**Color Schemes:**
- Enemy explosions: Match enemy color
- Bullet hits: White/yellow
- Muzzle flash: Yellow/orange
- Missile trail: White/gray
- Player damage: Red
- Power-ups: Gold/cyan

**Particle Counts:**
- Small explosion: 10-15 particles
- Large explosion: 30-50 particles
- Trail: 1 particle per 0.05s
- Hit effect: 5-8 particles
- Muzzle flash: 3-5 particles

**Advanced Techniques:**
- Particle textures (sprites instead of circles)
- Particle rotation
- Particle scaling over lifetime
- Particle color gradients
- Particle emitters (continuous spawning)
- Particle affectors (wind, turbulence)

**Future Enhancements:**
- Smoke particles (rising, fading)
- Fire particles (flickering, rising)
- Electric sparks (jagged, bright)
- Magic effects (glowing, swirling)
- Weather effects (rain, snow)
- Screen-space particles (UI effects)
- Particle systems for backgrounds