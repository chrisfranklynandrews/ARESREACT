# Story 15: Advanced Enemies (Charger, Weaver, Guardian)

## Objective
Implement the three remaining advanced enemy types that combine multiple behaviors for maximum challenge: Charger (charges at player), Weaver (complex movement), and Guardian (high health tank).

## Prerequisites
- Story 14 completed (Splitter enemy)
- Understanding of all previous enemy patterns
- Knowledge of combining multiple behaviors

## Concepts Covered
- Complex enemy AI combining multiple behaviors
- Player-tracking movement
- Defensive enemy types
- Late-game difficulty scaling
- Enemy role diversity

## Implementation Steps

### Step 1: Understand Advanced Enemy Roles
These three enemies represent late-game challenges:
- **Charger**: Aggressive pursuer, charges directly at player
- **Weaver**: Unpredictable movement, combines swooping and dashing
- **Guardian**: Tank enemy, high health but slow, protects other enemies

Each fills a unique role in creating challenging enemy compositions.

### Step 2: Create Charger Enemy
**Charger Behavior:**
- Tracks player position continuously
- Moves directly toward player (not just downward)
- Moderate speed (150 pixels/second)
- Medium health (5 hits)
- Dangerous in groups

**Implementation:**
- Calculate direction vector to player each frame
- Normalize and multiply by speed
- Update position toward player
- Add slight acceleration for momentum
- Collision with player deals extra damage

**Visual Design:**
- Pointed shape (arrow or wedge)
- Bright aggressive color (red/orange)
- Motion trail showing direction
- Pulsing animation when close to player

### Step 3: Implement Charger Tracking
Add player-tracking logic:
```
direction = (playerPos - chargerPos).normalized()
velocity = direction * speed * dt
position += velocity
```

Add smoothing to prevent instant direction changes:
```
targetDirection = (playerPos - chargerPos).normalized()
currentDirection = lerp(currentDirection, targetDirection, 0.1)
velocity = currentDirection * speed * dt
```

This creates more natural, predictable movement.

### Step 4: Create Weaver Enemy
**Weaver Behavior:**
- Combines sine wave (Swooper) and dash (Dasher) patterns
- Alternates between smooth weaving and sudden dashes
- Unpredictable but learnable
- Medium-high health (6 hits)
- Difficult to hit consistently

**Implementation:**
- State machine: Weaving → Dashing → Weaving
- During Weaving: Apply sine wave to horizontal position
- During Dashing: Rapid downward movement
- Transition randomly between states
- Each state lasts 1-3 seconds

**Visual Design:**
- Flowing, organic shape
- Color shifts between states
- Trail effect during dash
- Smooth animations

### Step 5: Implement Weaver State Machine
Combine Swooper and Dasher logic:
```
if (state == Weaving) {
  // Sine wave movement
  x = centerX + amplitude * sin(frequency * time)
  y += weavingSpeed * dt
  
  if (stateTimer > weaveDuration) {
    state = Dashing
    stateTimer = 0
  }
} else if (state == Dashing) {
  // Fast downward movement
  y += dashSpeed * dt
  
  if (stateTimer > dashDuration) {
    state = Weaving
    stateTimer = 0
  }
}
```

### Step 6: Create Guardian Enemy
**Guardian Behavior:**
- Very high health (15-20 hits)
- Slow movement (60 pixels/second)
- Large size (60x60 pixels)
- Spawns with other enemies (protective role)
- High money reward (50)

**Implementation:**
- Simple downward movement (like Standard)
- No special abilities, just durability
- Acts as shield for other enemies
- Players must decide: kill Guardian first or ignore?

**Visual Design:**
- Large, imposing appearance
- Armored or shielded look
- Dark, heavy colors
- Visible health bar (important for such high HP)

### Step 7: Implement Guardian Spawning
Guardians should spawn strategically:
- Spawn with groups of other enemies
- Position in front of weaker enemies
- Limit to 1-2 active Guardians
- Only appear in late waves (wave 7+)

Create spawn patterns:
```
spawnGuardian(x, y)
spawnStandard(x + 50, y + 30)  // Behind Guardian
spawnStandard(x - 50, y + 30)  // Behind Guardian
```

### Step 8: Balance Advanced Enemy Stats
Tune parameters for appropriate late-game challenge:

**Charger:**
- Health: 5 hits
- Speed: 150 pixels/second
- Money: 30
- Spawn weight: 10%
- Appears: Wave 5+

**Weaver:**
- Health: 6 hits
- Weaving speed: 100 pixels/second
- Dash speed: 300 pixels/second
- Money: 35
- Spawn weight: 8%
- Appears: Wave 6+

**Guardian:**
- Health: 18 hits
- Speed: 60 pixels/second
- Money: 50
- Spawn weight: 5%
- Appears: Wave 7+

### Step 9: Update Enemy Spawner
Add advanced enemies to spawn pool:
- Weight by difficulty and wave number
- Increase frequency in later waves
- Create interesting enemy combinations
- Balance spawn rates to maintain challenge

Example wave 10 composition:
- Standard: 40%
- Swooper: 20%
- Dasher: 15%
- Turret: 10%
- Splitter: 5%
- Charger: 5%
- Weaver: 3%
- Guardian: 2%

### Step 10: Add Splinter Enemy (Bonus)
**Splinter Behavior:**
- Similar to Splitter but different split pattern
- Splits into 4-6 tiny enemies instead of 2-3 medium
- Creates swarm effect
- Lower individual health but overwhelming numbers

This is mentioned in the original analysis as a 10th enemy type. Implement if time allows, or save for polish phase.

## Success Criteria
- [ ] Charger enemy tracks and moves toward player
- [ ] Weaver enemy combines sine wave and dash patterns
- [ ] Guardian enemy has high health and acts as tank
- [ ] All three enemies visually distinct
- [ ] Difficulty balanced for late-game
- [ ] Spawner includes all advanced enemies
- [ ] Enemy combinations create interesting challenges
- [ ] Performance stable with all enemy types active
- [ ] Money rewards appropriate for difficulty

## Testing
Run the game to late waves and verify:
1. Chargers pursue player effectively
2. Weavers alternate between weaving and dashing
3. Guardians absorb significant damage
4. Advanced enemies spawn in appropriate waves
5. Enemy combinations feel challenging but fair
6. Visual distinction clear for all types
7. Money rewards feel appropriate
8. Performance stable with mixed enemy types
9. Player can develop strategies for each type
10. Late-game difficulty feels satisfying

Test various enemy combinations to ensure balance.

## Next Steps
In Story 16, we'll implement the player auto-targeting system that automatically aims at the nearest enemy, making the idle gameplay more effective.

## Notes

**Common Pitfalls:**
- Chargers too fast (impossible to avoid)
- Weavers too unpredictable (frustrating)
- Guardians too tanky (boring to fight)
- Advanced enemies appearing too early
- Not enough visual distinction between types

**Flutter/Flame Tips:**
- Reuse existing behavior components where possible
- Use composition over inheritance for complex behaviors
- Profile with all enemy types active simultaneously
- Consider using behavior trees for complex AI
- Cache player position for tracking enemies

**Performance Considerations:**
- Charger tracking is more expensive than simple movement
- Limit number of tracking enemies (e.g., 5 Chargers max)
- Weaver state machine is lightweight
- Guardian is simple despite high health
- Profile late-game scenarios with all enemy types

**Reference to Original:**
The React version had 10 enemy types total. Charger tracked player, Weaver combined patterns, Guardian was a tank. Splinter was similar to Splitter. We're implementing all advanced behaviors.

**Enemy Role Design:**
- **Standard**: Basic threat, filler
- **Swooper**: Movement challenge
- **Dasher**: Timing challenge
- **Turret**: Dodging challenge
- **Splitter**: Strategic challenge
- **Charger**: Positioning challenge
- **Weaver**: Prediction challenge
- **Guardian**: Prioritization challenge

Each enemy type teaches different skills.

**Difficulty Progression:**
```
Waves 1-2: Standard only
Waves 3-4: + Swooper
Waves 5-6: + Dasher, Turret
Waves 7-8: + Splitter, Charger
Waves 9+: + Weaver, Guardian
Boss waves: All types + Boss
```

**Future Enhancements:**
- Elite variants (stronger versions)
- Enemy abilities (shields, healing, buffs)
- Formation flying (enemies move in patterns)
- Boss minions (special enemies during boss fights)
- Environmental enemies (spawn from sides)
- Kamikaze enemies (explode on contact)