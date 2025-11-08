# Story 1: Flutter/Flame Project Setup

## Objective
Set up a new Flutter project with the Flame game engine, configure dependencies, and establish the basic project structure for the ARES idle shooter game.

## Prerequisites
- Flutter SDK installed (3.0.0 or higher)
- Basic understanding of Dart programming
- Code editor (VS Code or Android Studio recommended)
- Android/iOS emulator or physical device for testing

## Concepts Covered
- Flutter project initialization
- Flame game engine integration
- Project structure organization
- Dependency management with pubspec.yaml
- Basic Flame game widget setup

## Implementation Steps

### Step 1: Create New Flutter Project
Create a new Flutter project named `ares_flame`. Use the Flutter CLI to initialize the project with the standard template. This creates the basic Flutter app structure with all necessary configuration files.

### Step 2: Add Flame Dependencies
Open `pubspec.yaml` and add the Flame game engine dependencies. You'll need:
- `flame`: The core game engine (version ^1.15.0 or higher)
- `flame_audio`: For sound effects and music
- `shared_preferences`: For save/load functionality (we'll use this later)

Add these under the `dependencies` section, then run `flutter pub get` to download them.

### Step 3: Clean Up Default Code
Remove the default Flutter counter app code from `lib/main.dart`. We'll replace it with our game structure. Keep the `main()` function but remove the `MyApp` and `MyHomePage` classes.

### Step 4: Create Game Directory Structure
Inside the `lib` folder, create the following directory structure:
- `lib/game/` - Core game logic
- `lib/components/` - Game entities (player, enemies, projectiles)
- `lib/ui/` - UI overlays and menus
- `lib/utils/` - Helper functions and constants
- `lib/data/` - Data models and save/load logic

This organization keeps code modular and maintainable as the project grows.

### Step 5: Create Main Game Class
In `lib/game/`, create a new file `ares_game.dart`. This will contain your main game class that extends `FlameGame`. The FlameGame class is the heart of any Flame application - it manages the game loop, component lifecycle, and rendering.

Your game class should:
- Extend `FlameGame`
- Override the `onLoad()` method for initialization
- Set up the game's background color
- Prepare for component management

### Step 6: Create Game Widget
In `lib/main.dart`, create a widget that wraps your game. Use `GameWidget<AresGame>` from Flame, which is a Flutter widget that hosts your game. This bridges Flutter's widget system with Flame's game loop.

The GameWidget handles:
- Creating the game instance
- Managing the game lifecycle
- Rendering the game canvas
- Handling touch/mouse input

### Step 7: Configure App Entry Point
Set up the `main()` function to:
- Ensure Flutter bindings are initialized
- Set the app to fullscreen mode (hide status bar)
- Lock orientation to portrait mode
- Run the app with your game widget

Use `WidgetsFlutterBinding.ensureInitialized()` before any Flutter operations, and use `SystemChrome` for device configuration.

### Step 8: Test Basic Setup
Run the application on your device or emulator. You should see a blank screen with your chosen background color. This confirms:
- Flutter is properly configured
- Flame is integrated correctly
- The game loop is running
- The widget hierarchy is correct

## Success Criteria
- [ ] Flutter project created and runs without errors
- [ ] Flame dependencies added and resolved
- [ ] Project directory structure created
- [ ] Main game class extends FlameGame
- [ ] GameWidget displays on screen
- [ ] App runs in fullscreen portrait mode
- [ ] Blank game canvas visible with background color

## Testing
Run `flutter run` in your project directory. The app should launch and display a solid-colored screen (typically black or dark blue). There should be no errors in the console. The app should fill the entire screen without status bars.

Try hot reload (press 'r' in terminal) to verify the development workflow is functioning.

## Next Steps
In Story 2, we'll set up the game canvas with proper coordinate systems, understand Flame's rendering pipeline, and prepare for drawing our first game elements. We'll also configure the camera and viewport for our vertical-scrolling shooter.

## Notes

**Common Pitfalls:**
- Forgetting to run `flutter pub get` after adding dependencies
- Not calling `ensureInitialized()` before SystemChrome operations
- Using incompatible Flame version with your Flutter SDK

**Flutter/Flame Tips:**
- Flame uses a component-based architecture similar to Unity or Godot
- The game loop runs at 60 FPS by default
- Hot reload works with Flame, but hot restart is sometimes needed for game logic changes
- Use `flutter doctor` to verify your Flutter installation is healthy

**Performance Considerations:**
- Flame is optimized for 2D games and handles thousands of components efficiently
- The game loop runs on the main thread, so keep `update()` methods lightweight
- We'll address performance optimization in later stories as we add more features