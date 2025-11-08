# Story 19: Wave System and Difficulty Scaling

## Objective
Implement the wave progression system with 25 kills per wave, boss waves every 3 waves, and progressive difficulty scaling over 60 seconds per wave.

## Prerequisites
- Story 18 completed (homing missiles)
- Understanding of difficulty curves
- Knowledge of game pacing

## Concepts Covered
- Wave-based progression
- Difficulty scaling algorithms
- Boss wave triggers
- Time-based difficulty increase
- Player progression feedback

## Implementation Steps

### Step 1: Understand Wave System
ARES uses a wave-based progression system:
- Each wave requires 25 enemy kills
- Every 3rd wave is a boss wave (waves 3, 6, 9, etc.)
- Difficulty increases within each wave (over 60 seconds)
- Difficulty increases between waves
- Wave number displayed prominently in HUD

This creates clear progression milestones and escalating challenge.

### Step 2: Create Wave Manager
Create `lib/game/wave_manager.dart` to track wave state:
- Current wave number (starts at 1)
- Kills in current wave (0-25)
- Time in current wave (0-60 seconds)
- Base difficulty multiplier
- Is boss wave flag

Properties:
```
currentWave: int = 1
killsThisWave: int = 0
waveTime: double = 0.0
baseDifficulty: double = 1.0
isBossWave: bool = false
```

### Step 3: Implement Kill Tracking
Track enemy kills and wave progression:
```
onEnemyKilled() {
  killsThisWave++
  totalKills++
  
  if (killsThisWave >= 25) {
    advanceWave()
  }
}

advanceWave() {
  currentWave++
  killsThisWave = 0
  waveTime = 0.0
  isBossWave = (currentWave % 3 == 0)
  
  if (isBossWave) {
    spawnBoss()
  }
}
```

### Step 4: Implement Time-Based Difficulty
Increase difficulty over 60 seconds within each wave:
```
update(dt) {
  waveTime += dt
  
  // Difficulty increases from 1.0 to 2.0 over 60 seconds
  timeDifficulty = 1.0 + (waveTime / 60.0)
  
  // Cap at 2.0x
  if (timeDifficulty > 2.0) {
    timeDifficulty = 2.0
  }
}
```

This creates urgency - players must kill enemies quickly or face increasing difficulty.

### Step 5: Implement Wave-Based Difficulty
Increase base difficulty with each wave:
```
baseDifficulty = 1.0 + (currentWave * 0.1)

// Wave 1: 1.0x
// Wave 5: 1.5x
// Wave 10: 2.0x
// Wave 20: 3.0x
```

This ensures long-term progression and prevents the game from becoming too easy.

### Step 6: Calculate Total Difficulty
Combine time and wave difficulty:
```
totalDifficulty = baseDifficulty * timeDifficulty

// Examples:
// Wave 1, 0 seconds: 1.0 * 1.0 = 1.0x
// Wave 1, 30 seconds: 1.0 * 1.5 = 1.5x
// Wave 5, 0 seconds: 1.5 * 1.0 = 1.5x
// Wave 5, 60 seconds: 1.5 * 2.0 = 3.0x
```

Use this multiplier to scale enemy stats.

### Step 7: Apply Difficulty to Enemies
Scale enemy properties based on difficulty:
```
spawnEnemy(type) {
  enemy = createEnemy(type)
  
  // Scale health
  enemy.health *= totalDifficulty
  
  // Scale speed (less aggressive scaling)
  enemy.speed *= (1.0 + (totalDifficulty - 1.0) * 0.5)
  
  // Scale money reward
  enemy.moneyReward *= totalDifficulty
  
  return enemy
}
```

Health scales linearly, speed scales more slowly to maintain playability.

### Step 8: Adjust Spawn Rates
Increase enemy spawn frequency with difficulty:
```
baseSpawnInterval = 2.0 seconds

currentSpawnInterval = baseSpawnInterval / sqrt(totalDifficulty)

// Wave 1, 0s: 2.0 / 1.0 = 2.0s
// Wave 5, 30s: 2.0 / 1.73 = 1.15s
// Wave 10, 60s: 2.0 / 2.0 = 1.0s
```

Square root scaling prevents spawn rate from becoming overwhelming.

### Step 9: Implement Wave Transitions
Add visual feedback for wave changes:
- Display "Wave X" announcement
- Brief pause before new wave starts (1-2 seconds)
- Sound effect for wave start
- Special announcement for boss waves
- Screen flash or particle effect

Transitions give players a moment to prepare and celebrate progress.

### Step 10: Add Wave Progress Indicator
Show progress toward next wave in HUD:
- "Kills: 15/25" text display
- Progress bar (visual)
- Highlight when close to next wave
- Special indicator for boss waves

This helps players understand their progress and set goals.

## Success Criteria
- [ ] Wave manager tracks current wave
- [ ] Kills increment and trigger wave advancement
- [ ] 25 kills required per wave
- [ ] Boss waves occur every 3rd wave
- [ ] Time-based difficulty increases over 60 seconds
- [ ] Wave-based difficulty increases with wave number
- [ ] Enemy stats scale with difficulty
- [ ] Spawn rates increase with difficulty
- [ ] Wave transitions provide feedback
- [ ] HUD shows wave progress

## Testing
Run the game and verify:
1. Wave starts at 1
2. Killing 25 enemies advances to wave 2
3. Wave 3 is marked as boss wave
4. Difficulty increases over time within wave
5. Enemies get stronger in later waves
6. Spawn rate increases with difficulty
7. Wave transitions display correctly
8. Progress indicator shows kills/25
9. Boss waves feel special
10. Difficulty curve feels balanced
11. Long-term progression is satisfying

Play through multiple waves to test scaling.

## Next Steps
In Story 20, we'll implement the Boss enemy with multi-phase behavior, unique attack patterns, and special mechanics that make boss waves challenging and memorable.

## Notes

**Common Pitfalls:**
- Difficulty scaling too aggressive (game becomes impossible)
- Difficulty scaling too slow (game becomes boring)
- Not resetting wave time on wave change
- Boss waves not feeling special enough
- Spawn rate too high (overwhelming)

**Flutter/Flame Tips:**
- Use `Timer` class for wave transitions
- Store wave data in a separate class for easy serialization
- Consider using events for wave changes
- Cache difficulty calculations when possible
- Profile with high wave numbers

**Performance Considerations:**
- Difficulty calculations are lightweight
- Wave transitions are infrequent
- Scaling enemy stats happens at spawn time
- No performance concerns with wave system
- Profile spawn rate at high difficulties

**Reference to Original:**
The React version had 25 kills per wave, boss every 3 waves, and difficulty scaling over 60 seconds. We're implementing the same progression system with proper difficulty curves.

**Difficulty Curve Design:**
```
Time (s) | Wave 1 | Wave 5 | Wave 10
---------|--------|--------|--------
0        | 1.0x   | 1.5x   | 2.0x
30       | 1.5x   | 2.25x  | 3.0x
60       | 2.0x   | 3.0x   | 4.0x
```

This creates exponential growth that remains manageable.

**Scaling Strategies:**
- **Linear**: Simple but can feel flat
- **Exponential**: Dramatic but can become overwhelming
- **Logarithmic**: Smooth but may plateau
- **Hybrid**: Combine approaches for best feel

Use exponential for health, logarithmic for speed.

**Boss Wave Design:**
- Clear announcement ("BOSS WAVE!")
- Different background color/effect
- Boss spawns immediately
- No regular enemies until boss defeated
- Extra rewards for completion

**Balance Philosophy:**
- Early waves: Learn mechanics
- Mid waves: Test mastery
- Late waves: Ultimate challenge
- Difficulty should feel fair, not cheap
- Player power should scale with difficulty

**Future Enhancements:**
- Endless mode (waves continue indefinitely)
- Wave modifiers (special rules per wave)
- Wave rewards (bonus money/items)
- Wave challenges (optional objectives)
- Wave leaderboards
- Custom wave configurations
- Survival mode (one life, how far can you go?)