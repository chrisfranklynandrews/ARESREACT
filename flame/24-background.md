# Story 24: Background (Stars, Parallax, Boss Mode)

## Objective
Implement an animated starfield background with parallax scrolling and special visual effects for boss waves to enhance atmosphere and depth.

## Prerequisites
- Story 23 completed (visual effects)
- Understanding of parallax scrolling
- Knowledge of background rendering

## Concepts Covered
- Starfield generation
- Parallax scrolling layers
- Background state changes
- Depth perception through movement
- Performance-optimized backgrounds

## Implementation Steps

### Step 1: Understand Background Design
The background creates atmosphere and depth:
- **Starfield**: Animated stars moving downward
- **Parallax Layers**: Multiple layers at different speeds
- **Boss Mode**: Special background during boss waves
- **Depth**: Faster stars appear closer
- **Performance**: Must not impact gameplay FPS

A good background enhances immersion without distracting from gameplay.

### Step 2: Create Star Class
Create `lib/components/star.dart` for individual stars:

```
class Star {
  Vector2 position
  double speed // pixels per second
  double size // 1-3 pixels
  double brightness // 0.3-1.0
  Color color
  
  update(dt) {
    // Move downward
    position.y += speed * dt
    
    // Wrap around when off-screen
    if (position.y > gameHeight) {
      position.y = -10
      position.x = random(0, gameWidth)
    }
  }
  
  render(Canvas canvas) {
    paint.color = color.withOpacity(brightness)
    canvas.drawCircle(position, size, paint)
  }
}
```

### Step 3: Implement Starfield Manager
Create multiple layers of stars for parallax effect:

```
class Starfield {
  List<Star> nearStars = [] // Fast, large, bright
  List<Star> midStars = []  // Medium speed and size
  List<Star> farStars = []  // Slow, small, dim
  
  initialize() {
    // Far layer (background)
    for (i = 0; i < 50; i++) {
      farStars.add(Star(
        position: randomPosition(),
        speed: 30,
        size: 1,
        brightness: 0.3,
        color: Colors.white
      ))
    }
    
    // Mid layer
    for (i = 0; i < 30; i++) {
      midStars.add(Star(
        position: randomPosition(),
        speed: 60,
        size: 2,
        brightness: 0.6,
        color: Colors.white
      ))
    }
    
    // Near layer (foreground)
    for (i = 0; i < 20; i++) {
      nearStars.add(Star(
        position: randomPosition(),
        speed: 120,
        size: 3,
        brightness: 1.0,
        color: Colors.white
      ))
    }
  }
  
  update(dt) {
    for (star in farStars) star.update(dt)
    for (star in midStars) star.update(dt)
    for (star in nearStars) star.update(dt)
  }
  
  render(Canvas canvas) {
    // Render back to front for proper layering
    for (star in farStars) star.render(canvas)
    for (star in midStars) star.render(canvas)
    for (star in nearStars) star.render(canvas)
  }
}
```

### Step 4: Add Star Color Variation
Make stars more interesting with color variation:

```
generateStarColor() {
  // Most stars are white
  if (random() < 0.7) {
    return Colors.white
  }
  
  // Some stars have color tints
  colors = [
    Color(0xFFCCEEFF), // Pale blue
    Color(0xFFFFEECC), // Pale yellow
    Color(0xFFFFCCEE), // Pale pink
    Color(0xFFCCFFEE), // Pale cyan
  ]
  
  return colors[random(0, colors.length)]
}
```

### Step 5: Implement Boss Wave Background
Create special background for boss waves:

```
class BossBackground {
  Color normalColor = Color(0xFF000033) // Dark blue
  Color bossColor = Color(0xFF330000)   // Dark red
  Color currentColor
  
  double pulseTime = 0.0
  double pulseSpeed = 2.0
  
  transitionToBossMode() {
    // Smoothly transition to boss color
    animateColorTransition(normalColor, bossColor, 1.0)
  }
  
  update(dt) {
    if (isBossWave) {
      // Pulsing effect during boss
      pulseTime += dt
      intensity = 0.5 + sin(pulseTime * pulseSpeed) * 0.2
      
      currentColor = Color.lerp(
        bossColor,
        bossColor.withOpacity(intensity),
        0.5
      )
    }
  }
  
  render(Canvas canvas) {
    // Fill background with color
    paint.color = currentColor
    canvas.drawRect(gameRect, paint)
  }
}
```

### Step 6: Add Nebula Effect
Create subtle nebula clouds in background:

```
class Nebula {
  List<NebulaCloud> clouds = []
  
  initialize() {
    for (i = 0; i < 3; i++) {
      clouds.add(NebulaCloud(
        position: randomPosition(),
        size: random(100, 200),
        color: randomNebulaColor(),
        speed: random(10, 20)
      ))
    }
  }
  
  render(Canvas canvas) {
    for (cloud in clouds) {
      // Draw large, semi-transparent circles
      paint.color = cloud.color.withOpacity(0.1)
      paint.maskFilter = MaskFilter.blur(BlurStyle.normal, 50)
      
      canvas.drawCircle(cloud.position, cloud.size, paint)
    }
  }
}

randomNebulaColor() {
  colors = [
    Color(0xFF4444FF), // Blue
    Color(0xFFFF4444), // Red
    Color(0xFF44FF44), // Green
    Color(0xFFFF44FF), // Purple
  ]
  return colors[random(0, colors.length)]
}
```

### Step 7: Implement Scrolling Speed Control
Allow background speed to match game intensity:

```
class BackgroundController {
  double baseSpeed = 1.0
  double currentSpeed = 1.0
  double targetSpeed = 1.0
  
  setSpeed(double speed) {
    targetSpeed = speed
  }
  
  update(dt) {
    // Smoothly interpolate to target speed
    currentSpeed = lerp(currentSpeed, targetSpeed, 5.0 * dt)
    
    // Apply speed multiplier to all stars
    for (star in allStars) {
      star.currentSpeed = star.baseSpeed * currentSpeed
    }
  }
}

// Usage:
// Normal gameplay: speed = 1.0
// Boss wave: speed = 1.5 (faster, more intense)
// Paused: speed = 0.0 (frozen)
```

### Step 8: Add Shooting Stars
Occasional shooting stars for visual interest:

```
class ShootingStar {
  Vector2 position
  Vector2 velocity
  double lifetime = 0.0
  double maxLifetime = 1.0
  
  spawn() {
    // Start from top, move diagonally
    position = Vector2(random(0, gameWidth), -10)
    velocity = Vector2(
      random(-100, 100),
      random(200, 400)
    )
  }
  
  update(dt) {
    lifetime += dt
    position += velocity * dt
    
    if (lifetime >= maxLifetime) {
      remove()
    }
  }
  
  render(Canvas canvas) {
    // Draw trail
    alpha = 1.0 - (lifetime / maxLifetime)
    
    for (i = 0; i < 5; i++) {
      trailPos = position - (velocity.normalized() * i * 10)
      trailAlpha = alpha * (1.0 - i / 5.0)
      
      paint.color = Colors.white.withOpacity(trailAlpha)
      canvas.drawCircle(trailPos, 2, paint)
    }
  }
}

// Spawn shooting star every 10-20 seconds
```

### Step 9: Optimize Background Rendering
Ensure background doesn't impact performance:

```
class OptimizedBackground {
  // Cache background rendering
  Picture cachedBackground
  bool needsRedraw = true
  
  render(Canvas canvas) {
    if (needsRedraw) {
      // Render to cached picture
      recorder = PictureRecorder()
      cacheCanvas = Canvas(recorder)
      
      renderStarfield(cacheCanvas)
      renderNebula(cacheCanvas)
      
      cachedBackground = recorder.endRecording()
      needsRedraw = false
    }
    
    // Draw cached background
    canvas.drawPicture(cachedBackground)
    
    // Render dynamic elements (shooting stars)
    renderDynamicElements(canvas)
  }
}
```

### Step 10: Add Background Transitions
Smooth transitions between background states:

```
transitionToBossWave() {
  // Increase star speed
  backgroundController.setSpeed(1.5)
  
  // Change background color
  bossBackground.transitionToBossMode()
  
  // Add more shooting stars
  shootingStarSpawnRate *= 2
  
  // Intensify nebula colors
  for (cloud in nebulaClouds) {
    cloud.intensify()
  }
}

transitionToNormalWave() {
  // Return to normal speed
  backgroundController.setSpeed(1.0)
  
  // Restore normal color
  bossBackground.transitionToNormalMode()
  
  // Normal shooting star rate
  shootingStarSpawnRate = baseRate
  
  // Calm nebula colors
  for (cloud in nebulaClouds) {
    cloud.calm()
  }
}
```

## Success Criteria
- [ ] Starfield with multiple parallax layers
- [ ] Stars move at different speeds for depth
- [ ] Stars wrap around screen edges
- [ ] Boss wave background is visually distinct
- [ ] Nebula clouds add atmosphere
- [ ] Shooting stars appear occasionally
- [ ] Background speed adjusts for intensity
- [ ] Smooth transitions between states
- [ ] Performance remains at 60 FPS
- [ ] Background enhances without distracting

## Testing
Run the game and verify:
1. Stars visible and moving downward
2. Multiple layers create depth perception
3. Faster stars appear closer
4. Stars wrap smoothly at screen edges
5. Boss wave changes background appearance
6. Nebula clouds visible but subtle
7. Shooting stars appear occasionally
8. Background speed increases during boss
9. Transitions are smooth
10. Performance stable (60 FPS maintained)
11. Background doesn't obscure gameplay

Test transitions between normal and boss waves.

## Next Steps
In Story 25, we'll implement the save/load system using shared_preferences to persist player progress, upgrades, and statistics between sessions.

## Notes

**Common Pitfalls:**
- Too many stars (performance issues)
- Stars too bright (distract from gameplay)
- No parallax (flat appearance)
- Background too busy (visual clutter)
- Not optimizing rendering (frame drops)

**Flutter/Flame Tips:**
- Use `Canvas.drawPoints()` for many stars
- Cache static background elements
- Update only visible stars
- Use simple shapes for performance
- Profile background rendering

**Performance Considerations:**
- Star count directly impacts performance
- Blur effects are expensive (use sparingly)
- Caching helps with static elements
- Update only what's visible
- Target: <1ms for background rendering

**Reference to Original:**
The React version had animated starfield with parallax. Boss waves had different background color. We're implementing similar atmosphere with additional effects.

**Parallax Speed Ratios:**
```
Far layer:   1x speed (slowest)
Mid layer:   2x speed
Near layer:  4x speed (fastest)

This creates convincing depth perception
```

**Color Palette:**
- Normal background: Dark blue (#000033)
- Boss background: Dark red (#330000)
- Stars: White with occasional color tints
- Nebula: Subtle blues, purples, reds

**Star Distribution:**
```
Far:  50 stars, small, dim
Mid:  30 stars, medium, moderate
Near: 20 stars, large, bright

Total: 100 stars (manageable count)
```

**Future Enhancements:**
- Planets in background
- Asteroid fields
- Space stations
- Warp speed effect (during transitions)
- Black holes (distortion effect)
- Galaxies in far background
- Dynamic weather (space storms)
- Constellation patterns