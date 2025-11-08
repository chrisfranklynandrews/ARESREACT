# Story 4: Player Ship Component

## Objective
Create the player ship component with rendering, positioning, movement controls, and boundary constraints for the ARES shooter.

## Prerequisites
- Story 3 completed (game loop with delta time)
- Understanding of Flame's component system
- Basic knowledge of touch/mouse input handling

## Concepts Covered
- PositionComponent and rendering
- Custom painting with Canvas
- Touch input handling in Flame
- Boundary collision (keeping player in bounds)
- Component lifecycle (onLoad, update, render)

## Implementation Steps

### Step 1: Create Player Component Class
Create a new file `lib/components/player.dart`. Define a `Player` class that extends `PositionComponent`. This is Flame's base class for entities with position, size, and rendering.

The PositionComponent provides:
- `position` (Vector2): Current x, y coordinates
- `size` (Vector2): Width and height
- `anchor` (Anchor): Registration point (center, topLeft, etc.)
- Automatic rendering and update calls

Set the anchor to `Anchor.center` so the ship rotates and positions from its center point.

### Step 2: Define Player Properties
Add properties to your Player class:
- Position (x, y coordinates)
- Size (width and height of the ship)
- Speed (pixels per second for movement)
- Health/shields (for later collision handling)
- Current velocity (for smooth movement)

The original ARES player ship is relatively small (about 40x40 pixels) and moves at a moderate speed. Start with these values and adjust based on feel.

### Step 3: Draw the Player Ship
Override the `render(Canvas canvas)` method to draw the player ship. For now, create a simple geometric representation:
- A triangle pointing upward (classic spaceship shape)
- Use `canvas.drawPath()` to create the triangle
- Add a contrasting color (bright blue or white against dark background)
- Consider adding a small circle or detail for the cockpit

The original game uses SVG graphics, but we'll start with simple shapes and upgrade to sprites later. This approach helps you understand the rendering pipeline.

### Step 4: Position the Player
In the `onLoad()` method, set the initial player position:
- Horizontally: Center of the screen (gameWidth / 2)
- Vertically: Near the bottom (gameHeight - 100 pixels)

This gives the player room to maneuver while keeping them in the lower portion of the screen, typical for vertical shooters.

### Step 5: Implement Touch Input
Add touch/mouse input handling. Flame provides several approaches:
- Override `onTapDown()` for tap events
- Use `onDragUpdate()` for continuous movement
- Implement `onPanUpdate()` for smooth dragging

For ARES, use drag/pan input so the player can smoothly follow their finger or mouse. The ship should move toward the touch position, not teleport instantly.

### Step 6: Add Smooth Movement
Instead of instantly moving to touch position, implement smooth interpolation:
- Calculate direction vector from player to target
- Multiply by speed and delta time
- Update position gradually each frame
- Stop when close enough to target (within a small threshold)

This creates more natural, responsive movement. Use `Vector2.lerp()` or manual interpolation for smooth motion.

### Step 7: Implement Boundary Constraints
Keep the player within the game bounds:
- Check if new position would exceed left/right bounds
- Check if new position would exceed top/bottom bounds
- Clamp position to valid range
- Consider adding padding (e.g., half the ship's width from edges)

This prevents the player from moving off-screen or into UI areas. Use the world bounds constants from Story 2.

### Step 8: Add Visual Feedback
Enhance the player ship with:
- A subtle glow or outline
- Engine trail effect (simple circles fading behind ship)
- Slight rotation toward movement direction (optional)
- Scale pulse when moving (optional)

These details make the game feel more alive and responsive. Keep effects subtle to maintain clarity.

## Success Criteria
- [ ] Player component created and extends PositionComponent
- [ ] Player ship renders on screen
- [ ] Ship positioned correctly at game start
- [ ] Touch/mouse input moves the ship smoothly
- [ ] Movement is frame-independent (uses delta time)
- [ ] Player stays within game boundaries
- [ ] Ship follows touch position naturally
- [ ] Visual feedback indicates movement

## Testing
Run the game and verify:
1. Player ship appears at the bottom center of screen
2. Touching/clicking moves the ship toward that position
3. Ship moves smoothly, not instantly
4. Ship cannot move outside game boundaries
5. Movement speed feels responsive but controllable
6. Ship continues moving if you hold touch/click
7. Movement works consistently at different frame rates

Test on both touch devices and with mouse input to ensure both work correctly.

## Next Steps
In Story 5, we'll implement the projectile system so the player can shoot. We'll create bullet components, handle firing logic, and set up automatic cleanup for off-screen projectiles.

## Notes

**Common Pitfalls:**
- Not using delta time for movement (causes inconsistent speed)
- Forgetting to clamp position to bounds (player escapes screen)
- Making movement too fast or too slow (test and adjust)
- Not handling touch release (ship keeps moving)
- Using screen coordinates instead of world coordinates

**Flutter/Flame Tips:**
- PositionComponent automatically handles rendering at its position
- Use `Vector2` for all position/velocity calculations (built-in math operations)
- The `anchor` property affects both rendering and collision detection
- Override `containsPoint()` for custom hit detection if needed
- Use `debugMode = true` to see component bounds during development

**Performance Considerations:**
- Drawing simple shapes is very fast
- Avoid creating new Vector2 objects in update/render (reuse them)
- Cache paint objects (don't create new Paint() every frame)
- Consider using sprites instead of canvas drawing for better performance with many objects

**Reference to Original:**
The React version used mouse position for player movement with smooth interpolation. The player was constrained to the canvas bounds with padding. We're implementing the same behavior but optimized for touch input on mobile devices.

**Input Handling Details:**
- Flame's gesture detection works on both mobile and desktop
- `onDragUpdate` provides delta movement (how much finger moved)
- `onPanUpdate` provides absolute position (where finger is)
- For ARES, pan/drag is better than tap (allows continuous control)
- Consider adding a "dead zone" near the player to prevent jittering

**Future Enhancements:**
- Add ship rotation toward movement direction
- Implement momentum/inertia for more realistic physics
- Add different ship types with unique movement characteristics
- Create a ship selection system
- Add visual damage states