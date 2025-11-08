# Story 2: Game Canvas Setup

## Objective
Configure the game canvas with proper coordinate systems, set up the camera and viewport for a vertical-scrolling shooter, and understand Flame's rendering pipeline.

## Prerequisites
- Story 1 completed (project setup with Flame)
- Understanding of coordinate systems (x, y axes)
- Basic knowledge of screen resolutions and aspect ratios

## Concepts Covered
- Flame's coordinate system (origin at top-left)
- Camera and viewport configuration
- Fixed resolution vs responsive design
- World bounds and game area
- Rendering pipeline basics

## Implementation Steps

### Step 1: Understand Flame's Coordinate System
Flame uses a standard 2D coordinate system where:
- Origin (0, 0) is at the top-left corner
- X increases to the right
- Y increases downward
- This matches most 2D game engines and HTML canvas

For ARES, we'll use a fixed logical resolution approach. The original game uses 800x600 pixels, which we'll adapt to mobile portrait orientation (e.g., 400x700).

### Step 2: Define Game Constants
Create a file `lib/utils/constants.dart` to store game-wide constants:
- Game width (e.g., 400.0)
- Game height (e.g., 700.0)
- World bounds (play area boundaries)
- UI safe zones (areas reserved for HUD)

These constants ensure consistency across all game components and make it easy to adjust the game's dimensions.

### Step 3: Configure Camera with Fixed Resolution
In your `AresGame` class, configure the camera to use a fixed resolution viewport. Flame's camera system has two parts:
- **Viewport**: What portion of the screen shows the game
- **World**: The coordinate space where game objects exist

Use `FixedResolutionViewport` to maintain consistent game dimensions regardless of device screen size. This ensures the game looks the same on all devices - objects move at the same speed, UI elements are positioned consistently, etc.

### Step 4: Set Up World Bounds
Define the playable area boundaries:
- Left bound: 0
- Right bound: game width
- Top bound: 0 (or slightly below for UI)
- Bottom bound: game height (or slightly above for UI)

These bounds will be used later for:
- Keeping the player ship within the play area
- Spawning enemies at the top
- Removing off-screen entities
- Collision detection optimization

### Step 5: Add Background Color
Set a background color for your game. The original ARES uses a dark space theme. In Flame, you can set the background color in the `onLoad()` method or by overriding the `backgroundColor` property.

A dark blue or black background works well for a space shooter. This will be replaced with a starfield in later stories.

### Step 6: Understand the Rendering Pipeline
Flame's rendering pipeline works as follows:
1. **Update Phase**: All components' `update(dt)` methods are called
2. **Render Phase**: All components' `render(canvas)` methods are called
3. **Camera Transform**: The camera applies its viewport transformation
4. **Screen Output**: The final image is displayed

Components are rendered in the order they were added, so add background elements first and UI elements last.

### Step 7: Add Debug Rendering
Temporarily add debug rendering to visualize the game bounds:
- Draw a rectangle showing the playable area
- Display the game dimensions as text
- Show the coordinate system origin

This helps verify your camera and viewport are configured correctly. You can remove this debug rendering once you're confident the setup is correct.

### Step 8: Test Different Screen Sizes
Run your game on different device sizes or use the Flutter device simulator to test various aspect ratios. With a fixed resolution viewport, the game should:
- Maintain the same aspect ratio
- Scale appropriately (letterboxing if needed)
- Keep all UI elements visible
- Preserve gameplay area proportions

## Success Criteria
- [ ] Game uses fixed resolution viewport
- [ ] Constants file created with game dimensions
- [ ] Camera configured and rendering correctly
- [ ] World bounds defined and accessible
- [ ] Background color displays properly
- [ ] Debug rendering shows correct game area
- [ ] Game scales correctly on different screen sizes
- [ ] No distortion or stretching of game area

## Testing
Run the game and verify:
1. The game area is centered on screen
2. The background color fills the entire game area
3. Debug bounds (if added) show the correct dimensions
4. Rotating the device maintains portrait orientation
5. The game looks consistent on different device sizes

Use Flutter DevTools to inspect the widget tree and verify the GameWidget is rendering at the expected size.

## Next Steps
In Story 3, we'll implement the game loop with proper delta time handling, understand FPS management, and set up the foundation for smooth animations and movement. We'll also add a simple FPS counter to monitor performance.

## Notes

**Common Pitfalls:**
- Forgetting to initialize the camera before using it
- Mixing screen coordinates with world coordinates
- Not accounting for device safe areas (notches, rounded corners)
- Using device pixels instead of logical pixels

**Flutter/Flame Tips:**
- Flame's camera system is powerful but can be complex - start simple
- Fixed resolution viewports are easier to work with than responsive designs for games
- Use `camera.viewport.size` to get the current viewport dimensions
- The camera's `visibleWorldRect` property is useful for culling off-screen objects

**Performance Considerations:**
- Fixed resolution viewports are more performant than dynamic scaling
- The camera transformation is applied once per frame, not per component
- Keep world bounds checks simple (AABB is faster than complex shapes)
- Consider using a spatial partitioning system later for large numbers of entities

**Reference to Original:**
The React version used a fixed 800x600 canvas with CSS scaling. We're using a similar approach but optimized for mobile portrait orientation. The coordinate system is identical, making it easier to port game logic.