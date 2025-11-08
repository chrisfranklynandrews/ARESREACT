# Story 12: Dasher Enemy (Pause and Dash Behavior)

## Objective
Implement the Dasher enemy with pause-and-dash behavior, creating sudden bursts of speed that challenge player reaction time.

## Prerequisites
- Story 11 completed (Swooper enemy)
- Understanding of state-based AI
- Basic knowledge of acceleration and velocity

## Concepts Covered
- State machine for enemy AI
- Acceleration and deceleration
- Timing-based behavior
- Visual telegraphing of actions
- Predictable randomness

## Implementation Steps

### Step 1: Understand Dasher Behavior
Dashers alternate between two states:
- **Pausing**: Move slowly or stop completely (1-2 seconds)
- **Dashing**: Rapid downward acceleration (0.5-1 second)
- Cycle repeats throughout lifetime
- Dash speed is 3-4x normal speed
- Pause gives player time to aim

This creates a rhythm - players must time their shots during the pause phase or lead the dash.

### Step 2: Create Dasher State Enum
Define states for Dasher behavior:
- `Pausing`: Moving slowly or stationary
- `Dashing`: Moving at high speed
- `Transitioning`: Brief moment between states (optional)

Use an enum to track current state and switch between them based on timers.

### Step 3: Create Dasher Enemy Class
Create `DasherEnemy` class extending `Enemy`:
- Medium size (35x35 pixels)
- Higher health (5 hits)
- State tracking (current state, state timer)
- Two speed values (pause speed, dash speed)
- Visual indicator for current state

Properties:
- `pauseSpeed`: 30-50 pixels/second (very slow)
- `dashSpeed`: 300-400 pixels/second (very fast)
- `pauseDuration`: 1.5-2.0 seconds
- `dashDuration`: 0.5-0.8 seconds

### Step 4: Implement State Machine
In the `update(dt)` method, implement state machine logic:
- Track time in current state
- When timer expires, switch to next state
- Reset timer for new state
- Update speed based on current state
- Apply movement with current speed

```
if (state == Pausing) {
  speed = pauseSpeed
  if (stateTimer >= pauseDuration) {
    state = Dashing
    stateTimer = 0
  }
} else if (state == Dashing) {
  speed = dashSpeed
  if (stateTimer >= dashDuration) {
    state = Pausing
    stateTimer = 0
  }
}
```

### Step 5: Add Visual Telegraphing
Make the state visible to players:
- **Pausing**: Normal color, maybe pulsing glow
- **About to Dash**: Flash or color change (0.2s warning)
- **Dashing**: Bright color, motion blur trail
- **After Dash**: Brief cooldown indicator

Visual feedback helps players predict behavior and react appropriately.

### Step 6: Implement Smooth Transitions
Add acceleration/deceleration for smoother movement:
- Don't instantly jump to dash speed
- Accelerate over 0.1-0.2 seconds
- Decelerate when returning to pause
- Creates more natural-feeling movement

Use linear interpolation or easing functions for smooth speed changes.

### Step 7: Add Randomization
Introduce slight randomness to prevent predictability:
- Vary pause duration (±0.3 seconds)
- Vary dash duration (±0.2 seconds)
- Random starting state (some start pausing, some dashing)
- Prevents players from memorizing exact timing

Keep randomness bounded so behavior remains learnable.

### Step 8: Balance Difficulty
Tune Dasher parameters for appropriate challenge:
- More health than Swooper (harder to kill during dash)
- Drops more money (20 vs 15)
- Spawns less frequently (10-15% of enemies)
- Appears starting from wave 3-4

Dashers should feel dangerous but fair - players can learn to counter them.

### Step 9: Update Enemy Spawner
Add Dashers to spawn pool:
- Include in enemy type selection
- Weight appropriately (Standard 60%, Swooper 25%, Dasher 15%)
- Increase frequency in later waves
- Ensure good enemy variety

### Step 10: Add Sound/Visual Effects
Enhance Dasher with effects:
- Sound effect when starting dash
- Particle trail during dash
- Screen shake on dash start (subtle)
- Impact effect if hitting player

These effects make Dashers feel impactful and dangerous.

## Success Criteria
- [ ] Dasher enemy class created with state machine
- [ ] Dashers alternate between pausing and dashing
- [ ] State transitions work correctly
- [ ] Visual indicators show current state
- [ ] Movement feels smooth and natural
- [ ] Timing is balanced (not too fast/slow)
- [ ] Dashers visually distinct from other enemies
- [ ] Spawner includes Dashers in mix
- [ ] Difficulty appropriate for mid-game
- [ ] Multiple Dashers can exist with different timings

## Testing
Run the game and verify:
1. Dashers spawn periodically
2. Dashers pause for 1-2 seconds
3. Dashers dash rapidly for 0.5-1 second
4. State transitions are smooth
5. Visual indicators clearly show state
6. Multiple Dashers have different timings
7. Dashers are challenging but not unfair
8. Players can learn to predict behavior
9. Dashers drop correct amount of money
10. Performance stable with multiple Dashers

Test player reaction time - can they hit Dashers during pause phase?

## Next Steps
In Story 13, we'll implement the Turret enemy that shoots projectiles at the player. This introduces enemy attacks and requires dodging mechanics.

## Notes

**Common Pitfalls:**
- State transitions too abrupt (jarring movement)
- Dash speed too fast (impossible to track)
- No visual warning before dash (unfair)
- Timers not using delta time (inconsistent behavior)
- All Dashers synchronized (too predictable)

**Flutter/Flame Tips:**
- Use enum for type-safe state management
- Consider using Flame's `TimerComponent` for state timing
- Store state history for debugging
- Use `debugMode` to display current state
- Profile state machine logic if complex

**Performance Considerations:**
- State machine logic is very lightweight
- No expensive calculations needed
- Smooth transitions use simple interpolation
- Visual effects are the main performance cost
- Profile if you have 50+ Dashers simultaneously

**Reference to Original:**
The React version had Dasher enemies with pause-dash cycles. They were unpredictable and required timing to hit. Visual indicators telegraphed dashes. We're implementing the same behavior with state machine architecture.

**State Machine Design Pattern:**
State machines are perfect for enemy AI:
- Clear, discrete states
- Well-defined transitions
- Easy to debug and extend
- Predictable behavior
- Simple to balance

Consider this pattern for all complex enemy types.

**Timing Balance:**
- **Too Fast**: Frustrating, feels unfair
- **Too Slow**: Boring, too easy
- **Just Right**: Challenging but learnable

Test with multiple players to find sweet spot.

**Visual Telegraphing Importance:**
Players should never be surprised by enemy behavior:
- Clear visual indicators
- Consistent timing
- Learnable patterns
- Fair warning before dangerous actions

Good telegraphing makes difficulty feel fair.

**Future Enhancements:**
- Horizontal dashing (side to side)
- Diagonal dashing (toward player)
- Multiple dash charges
- Dash leaves damaging trail
- Dash can destroy other enemies
- Charge-up animation before dash
- Exhaustion state after multiple dashes