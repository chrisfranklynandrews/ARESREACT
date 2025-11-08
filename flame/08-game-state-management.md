# Story 8: Game State Management

## Objective
Implement a robust game state management system to handle different game states (WelcomeBack, Start, Tutorial, Playing, Paused, GameOver) and transitions between them.

## Prerequisites
- Story 7 completed (collision detection)
- Understanding of state machines
- Basic knowledge of enum types in Dart

## Concepts Covered
- State machine pattern
- Game state transitions
- State-specific update logic
- Pause/resume functionality
- Game lifecycle management

## Implementation Steps

### Step 1: Define Game States
Create an enum in `lib/utils/game_state.dart` for all possible game states:
- `WelcomeBack`: Returning player screen (shows previous progress)
- `Start`: Initial start screen for new players
- `Tutorial`: Tutorial mode (7 steps in original)
- `Playing`: Active gameplay
- `Paused`: Game paused
- `GameOver`: Death/restart screen

These states match the original ARES game flow. Each state has different UI, input handling, and update logic.

### Step 2: Add State to Game Class
Add a `currentState` property to your main game class:
- Store the current GameState
- Initialize to `Start` or `WelcomeBack` based on save data
- Provide methods to change state
- Track previous state for resume functionality

The state should be accessible throughout the game for conditional logic.

### Step 3: Implement State Transition Logic
Create a `changeState(GameState newState)` method:
- Validate the transition is allowed
- Call exit logic for current state
- Update currentState
- Call enter logic for new state
- Trigger any necessary UI updates

Some transitions should be restricted (e.g., can't go from GameOver directly to Playing without resetting).

### Step 4: Add State-Specific Update Logic
Modify your game's `update(dt)` method to handle different states:
- **Playing**: Update all game entities, check collisions, spawn enemies
- **Paused**: Skip entity updates, keep rendering
- **GameOver**: Stop spawning, let existing entities finish
- **Tutorial**: Update with tutorial-specific logic
- **Start/WelcomeBack**: No game updates, just UI

Use a switch statement or if-else chain based on currentState.

### Step 5: Implement Pause Functionality
Add pause/resume capability:
- Pause button in UI (we'll add in Story 9)
- Keyboard shortcut (ESC or P key)
- Automatic pause when app loses focus
- Store game time when paused
- Resume from exact same state

When paused, the game should freeze but remain visible. Players should be able to see their current situation.

### Step 6: Handle Game Over State
Implement game over logic:
- Trigger when player shields reach zero
- Stop enemy spawning
- Allow existing entities to finish animating
- Display final statistics (kills, money, wave)
- Provide restart option
- Save final score/progress

The game over screen should feel like a natural conclusion, not an abrupt stop.

### Step 7: Add State Change Callbacks
Create callback system for state changes:
- `onStateEnter(GameState state)`: Called when entering a state
- `onStateExit(GameState state)`: Called when leaving a state
- Use these for setup/cleanup (e.g., clear enemies on restart)

This keeps state-specific logic organized and maintainable.

### Step 8: Implement Restart Functionality
Add ability to restart the game:
- Reset player position and health
- Clear all enemies and bullets
- Reset counters (kills, money, wave)
- Keep persistent upgrades (from save data)
- Transition to Playing state

Restart should feel instant - no loading screens or delays.

## Success Criteria
- [ ] GameState enum defined with all states
- [ ] Current state tracked in game class
- [ ] State transitions work correctly
- [ ] Update logic respects current state
- [ ] Pause/resume functionality works
- [ ] Game over triggers correctly
- [ ] Restart resets game properly
- [ ] State changes trigger appropriate callbacks
- [ ] No invalid state transitions possible

## Testing
Run the game and verify:
1. Game starts in correct initial state
2. Transitioning to Playing state starts gameplay
3. Pause stops entity updates but keeps rendering
4. Resume continues from paused state
5. Game over triggers when player dies
6. Restart properly resets all game state
7. State transitions are smooth (no flashing/glitches)
8. Each state has appropriate behavior
9. Invalid transitions are prevented
10. State persists correctly across frames

Test all possible state transitions to ensure they work as expected.

## Next Steps
In Story 9, we'll implement the HUD (Heads-Up Display) to show money, kills, shields, and wave information. We'll also add UI buttons for pause and upgrades.

## Notes

**Common Pitfalls:**
- Not stopping updates in paused state (game continues running)
- Forgetting to reset state on restart (old data persists)
- Allowing invalid state transitions
- Not handling app lifecycle events (backgrounding)
- State changes causing visual glitches

**Flutter/Flame Tips:**
- Use Dart enums for type-safe state management
- Consider using a state machine library for complex logic
- Flame's `overlays` system is perfect for state-specific UI
- Use `AppLifecycleListener` to handle app backgrounding
- Store state in a separate class for better organization

**Performance Considerations:**
- State checks are very fast (enum comparison)
- Avoid creating new objects during state transitions
- Cache state-specific data instead of recalculating
- Use state to skip unnecessary updates (optimization)
- Profile state transition performance

**Reference to Original:**
The React version used a simple state variable with conditional rendering. States included WelcomeBack, Start, Tutorial, Playing, Paused, and GameOver. We're implementing the same states with Flame's architecture.

**State Machine Design:**
```
Start/WelcomeBack → Tutorial → Playing ⇄ Paused
                                  ↓
                              GameOver → Start
```

Valid transitions:
- Start → Tutorial or Playing
- Tutorial → Playing
- Playing ⇄ Paused
- Playing → GameOver
- GameOver → Start
- Any → Paused (emergency pause)

**State-Specific Behavior:**
- **Start**: Show title, play button, load save data
- **WelcomeBack**: Show previous stats, continue button
- **Tutorial**: Step-by-step instructions, limited gameplay
- **Playing**: Full game logic, all systems active
- **Paused**: Frozen gameplay, pause menu visible
- **GameOver**: Final stats, restart/quit options

**Future Enhancements:**
- Settings state (audio, graphics options)
- Shop state (purchase upgrades between runs)
- Achievements state (view unlocked achievements)
- Leaderboard state (compare scores)
- State history for debugging
- State serialization for save/load