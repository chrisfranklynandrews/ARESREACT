# Story 23: Visual Effects (Glows, Shadows, Animations)

## Objective
Implement additional visual effects including glows, shadows, screen shake, and animations that polish the game's appearance and enhance player feedback.

## Prerequisites
- Story 22 completed (beam weapons)
- Understanding of visual effects techniques
- Knowledge of animation principles

## Concepts Covered
- Glow effects and bloom
- Drop shadows for depth
- Screen shake for impact
- Sprite animations
- Visual polish techniques

## Implementation Steps

### Step 1: Understand Visual Polish
Visual effects make the game feel more polished:
- **Glows**: Make important elements stand out
- **Shadows**: Add depth and dimension
- **Screen Shake**: Emphasize impacts
- **Animations**: Bring static elements to life
- **Transitions**: Smooth state changes

These effects don't change gameplay but significantly improve feel.

### Step 2: Implement Glow Effect
Add glow to important game elements:

```
renderWithGlow(Canvas canvas, Component component) {
  // Draw glow layers (largest to smallest)
  for (i = 3; i >= 1; i--) {
    paint.color = glowColor.withOpacity(0.1 * i)
    paint.maskFilter = MaskFilter.blur(BlurStyle.normal, i * 2.0)
    
    component.render(canvas, paint)
  }
  
  // Draw solid component on top
  paint.maskFilter = null
  component.render(canvas, paint)
}
```

Apply glows to:
- Player ship (subtle cyan glow)
- Drones (colored glows matching type)
- Bullets and missiles (bright glows)
- Power-ups (pulsing glows)
- Boss (intense glow, especially in Phase 3)

### Step 3: Add Drop Shadows
Create depth with shadows:

```
renderWithShadow(Canvas canvas, Component component) {
  // Draw shadow (offset and darkened)
  canvas.save()
  canvas.translate(shadowOffset.x, shadowOffset.y)
  
  paint.color = Colors.black.withOpacity(0.3)
  paint.maskFilter = MaskFilter.blur(BlurStyle.normal, 4.0)
  component.render(canvas, paint)
  
  canvas.restore()
  
  // Draw component normally
  paint.maskFilter = null
  component.render(canvas, paint)
}
```

Apply shadows to:
- Player ship
- Enemies (larger enemies = larger shadows)
- Boss (prominent shadow)
- UI elements (subtle shadows)

### Step 4: Implement Screen Shake
Add screen shake for impactful moments:

```
class ScreenShake {
  double intensity = 0.0
  double duration = 0.0
  double elapsed = 0.0
  
  trigger(double intensity, double duration) {
    this.intensity = max(this.intensity, intensity)
    this.duration = duration
    this.elapsed = 0.0
  }
  
  update(dt) {
    if (elapsed < duration) {
      elapsed += dt
      
      // Decay intensity over time
      currentIntensity = intensity * (1.0 - elapsed / duration)
      
      // Random offset
      offset = Vector2(
        random(-currentIntensity, currentIntensity),
        random(-currentIntensity, currentIntensity)
      )
      
      return offset
    }
    
    return Vector2.zero()
  }
}
```

Trigger shake for:
- Player taking damage (medium shake)
- Boss phase transitions (large shake)
- Large explosions (small shake)
- Boss attacks (small shake)

### Step 5: Add Pulsing Animations
Create pulsing effects for emphasis:

```
class PulseAnimation {
  double time = 0.0
  double frequency = 2.0 // pulses per second
  double amplitude = 0.2 // scale variation
  
  update(dt) {
    time += dt
  }
  
  getScale() {
    return 1.0 + sin(time * frequency * 2 * PI) * amplitude
  }
  
  getAlpha() {
    return 0.5 + sin(time * frequency * 2 * PI) * 0.5
  }
}
```

Apply pulsing to:
- Power-ups (scale pulse)
- Low health warning (alpha pulse)
- Boss in low health (scale and color pulse)
- Upgrade buttons when affordable (glow pulse)

### Step 6: Implement Rotation Animations
Add rotation for visual interest:

```
class RotationAnimation {
  double angle = 0.0
  double speed = 90.0 // degrees per second
  
  update(dt) {
    angle += speed * dt
    if (angle >= 360) angle -= 360
  }
  
  render(Canvas canvas, Component component) {
    canvas.save()
    canvas.translate(component.position.x, component.position.y)
    canvas.rotate(angle * PI / 180)
    canvas.translate(-component.position.x, -component.position.y)
    
    component.render(canvas)
    
    canvas.restore()
  }
}
```

Apply rotation to:
- Drones (slow rotation while orbiting)
- Power-ups (continuous rotation)
- Particles (rotate while moving)
- Boss (rotate during attacks)

### Step 7: Add Flash Effects
Create flash effects for emphasis:

```
class FlashEffect {
  double duration = 0.1
  double elapsed = 0.0
  Color flashColor = Colors.white
  bool isActive = false
  
  trigger(Color color, double duration) {
    this.flashColor = color
    this.duration = duration
    this.elapsed = 0.0
    this.isActive = true
  }
  
  update(dt) {
    if (isActive) {
      elapsed += dt
      if (elapsed >= duration) {
        isActive = false
      }
    }
  }
  
  getAlpha() {
    if (!isActive) return 0.0
    return 1.0 - (elapsed / duration)
  }
  
  render(Canvas canvas, Component component) {
    if (!isActive) return
    
    // Draw white flash over component
    paint.color = flashColor.withOpacity(getAlpha())
    canvas.drawRect(component.bounds, paint)
  }
}
```

Apply flashes to:
- Enemies when hit (white flash)
- Player when damaged (red flash)
- Boss phase transitions (bright flash)
- Power-up collection (gold flash)

### Step 8: Implement Trail Effects
Add motion trails for fast-moving objects:

```
class TrailEffect {
  List<TrailSegment> segments = []
  int maxSegments = 10
  double spawnInterval = 0.05
  double timeSinceSpawn = 0.0
  
  update(dt, position) {
    timeSinceSpawn += dt
    
    if (timeSinceSpawn >= spawnInterval) {
      segments.add(TrailSegment(position, 0.5))
      timeSinceSpawn = 0.0
      
      if (segments.length > maxSegments) {
        segments.removeAt(0)
      }
    }
    
    // Update existing segments
    for (segment in segments) {
      segment.lifetime += dt
    }
  }
  
  render(Canvas canvas) {
    for (i = 0; i < segments.length; i++) {
      segment = segments[i]
      alpha = 1.0 - (segment.lifetime / segment.maxLifetime)
      alpha *= (i / segments.length) // Fade older segments more
      
      paint.color = trailColor.withOpacity(alpha)
      canvas.drawCircle(segment.position, 3, paint)
    }
  }
}
```

Apply trails to:
- Player ship (subtle trail)
- Missiles (bright trail)
- Fast enemies (Dasher, Charger)
- Boss during dashes

### Step 9: Add Scale Animations
Implement scale effects for feedback:

```
class ScaleAnimation {
  double targetScale = 1.0
  double currentScale = 1.0
  double speed = 5.0 // interpolation speed
  
  setTarget(double scale) {
    targetScale = scale
  }
  
  update(dt) {
    currentScale = lerp(currentScale, targetScale, speed * dt)
  }
  
  render(Canvas canvas, Component component) {
    canvas.save()
    canvas.translate(component.position.x, component.position.y)
    canvas.scale(currentScale)
    canvas.translate(-component.position.x, -component.position.y)
    
    component.render(canvas)
    
    canvas.restore()
  }
}
```

Apply scale animations to:
- Enemies when hit (brief shrink)
- Player when firing (slight recoil)
- Buttons when pressed (press down)
- Power-ups when collected (grow then disappear)

### Step 10: Implement Color Transitions
Add smooth color transitions:

```
class ColorTransition {
  Color currentColor
  Color targetColor
  double duration = 0.5
  double elapsed = 0.0
  
  transitionTo(Color target, double duration) {
    this.targetColor = target
    this.duration = duration
    this.elapsed = 0.0
  }
  
  update(dt) {
    if (elapsed < duration) {
      elapsed += dt
      t = min(elapsed / duration, 1.0)
      
      currentColor = Color.lerp(currentColor, targetColor, t)
    }
  }
}
```

Apply color transitions to:
- Enemies based on health (green → yellow → red)
- Boss between phases
- Background during boss waves
- UI elements on state changes

## Success Criteria
- [ ] Glow effects implemented for key elements
- [ ] Drop shadows add depth to components
- [ ] Screen shake triggers on impacts
- [ ] Pulsing animations emphasize important elements
- [ ] Rotation animations add visual interest
- [ ] Flash effects provide hit feedback
- [ ] Trail effects show motion
- [ ] Scale animations respond to actions
- [ ] Color transitions are smooth
- [ ] All effects enhance game feel without hindering gameplay

## Testing
Run the game and verify:
1. Player ship has subtle glow
2. Enemies have drop shadows
3. Screen shakes on player damage
4. Power-ups pulse to attract attention
5. Drones rotate while orbiting
6. Enemies flash white when hit
7. Missiles leave visible trails
8. Buttons scale when pressed
9. Boss changes color between phases
10. All effects run smoothly at 60 FPS
11. Effects don't obscure important gameplay elements

Test with all effects active simultaneously.

## Next Steps
In Story 24, we'll implement the background with animated stars, parallax scrolling, and special effects for boss waves.

## Notes

**Common Pitfalls:**
- Too many effects (visual clutter)
- Effects too intense (distracting)
- Not optimizing effects (performance issues)
- Effects obscuring gameplay
- Inconsistent effect styles

**Flutter/Flame Tips:**
- Use `MaskFilter.blur()` for glows
- Cache effect calculations when possible
- Use `Canvas.saveLayer()` for complex effects
- Consider using shaders for advanced effects
- Profile effects to ensure 60 FPS

**Performance Considerations:**
- Blur effects are expensive (use sparingly)
- Screen shake is very cheap
- Trails can add up (limit segments)
- Animations are lightweight
- Profile with all effects active

**Reference to Original:**
The React version had glows, shadows, and screen shake. Effects were subtle but effective. We're implementing similar polish with Flame's rendering capabilities.

**Effect Intensity Guidelines:**
- **Subtle**: Player ship glow, UI shadows
- **Moderate**: Enemy hit flashes, power-up pulses
- **Intense**: Boss phase transitions, player damage

Balance is key - effects should enhance, not overwhelm.

**Visual Hierarchy:**
1. Player (most important, brightest)
2. Immediate threats (enemies, bullets)
3. Collectibles (power-ups, money)
4. Background elements (least important)

Use effects to reinforce this hierarchy.

**Future Enhancements:**
- Particle-based effects (more complex)
- Post-processing effects (bloom, chromatic aberration)
- Dynamic lighting
- Weather effects
- Distortion effects (heat waves, ripples)
- Sprite-based animations
- Skeletal animations for complex characters