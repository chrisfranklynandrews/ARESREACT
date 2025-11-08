# Story 20: Boss Enemy (Multi-Phase, Attack Patterns)

## Objective
Implement the Boss enemy with multi-phase behavior, unique attack patterns, and special mechanics that make boss waves challenging and memorable climactic encounters.

## Prerequisites
- Story 19 completed (wave system)
- Understanding of state machines
- Knowledge of attack pattern design

## Concepts Covered
- Multi-phase boss design
- Attack pattern systems
- Boss health management
- Phase transitions
- Epic encounter design

## Implementation Steps

### Step 1: Understand Boss Design
Bosses are special enemies that appear every 3rd wave:
- Much larger than normal enemies (100x100 pixels)
- Very high health (scales with wave number)
- Multiple attack phases (3 phases)
- Unique attack patterns per phase
- Spawns alone (no other enemies during boss)
- Drops massive money reward
- Special visual effects and music

Bosses are the highlight of the game - they should feel epic and challenging.

### Step 2: Create Boss Enemy Class
Create `BossEnemy` class extending `Enemy`:
- Large size (100x100 pixels)
- Massive health (base: 500, scales with wave)
- Slow movement (40 pixels/second)
- Current phase (1, 2, or 3)
- Attack pattern state machine
- Phase transition thresholds

Properties:
```
baseHealth: 500
currentPhase: 1
phaseThresholds: [100%, 66%, 33%]
attackCooldown: 2.0 seconds
movementPattern: varies by phase
```

### Step 3: Implement Phase System
Bosses have three phases based on health:
- **Phase 1** (100%-66% health): Basic attacks
- **Phase 2** (66%-33% health): Increased aggression
- **Phase 3** (33%-0% health): Desperate, most dangerous

```
update(dt) {
  healthPercent = currentHealth / maxHealth
  
  if (healthPercent > 0.66) {
    currentPhase = 1
  } else if (healthPercent > 0.33) {
    if (currentPhase == 1) {
      transitionToPhase2()
    }
    currentPhase = 2
  } else {
    if (currentPhase == 2) {
      transitionToPhase3()
    }
    currentPhase = 3
  }
}
```

### Step 4: Design Phase 1 Attacks
**Phase 1 - Basic Patterns:**
- Slow downward movement
- Fires spread shot (5 bullets in fan pattern)
- Occasional dash to side
- Spawns 2-3 minions (Standard enemies)

Attack cycle:
1. Move slowly for 3 seconds
2. Fire spread shot
3. Wait 2 seconds
4. Dash to random side
5. Spawn minions
6. Repeat

### Step 5: Design Phase 2 Attacks
**Phase 2 - Aggressive Patterns:**
- Faster movement (60 pixels/second)
- Fires spiral pattern (bullets rotate outward)
- Charges toward player position
- Spawns 4-5 stronger minions

Attack cycle:
1. Fire spiral pattern
2. Charge toward player
3. Fire spread shot while moving
4. Spawn minions
5. Repeat faster than Phase 1

### Step 6: Design Phase 3 Attacks
**Phase 3 - Desperate Patterns:**
- Erratic movement (weaving)
- Fires bullet hell pattern (many bullets)
- Continuous minion spawning
- Laser beam attack (sweeping)

Attack cycle:
1. Fire massive bullet spread
2. Activate laser beam (sweeps across screen)
3. Spawn minions continuously
4. Dash randomly
5. Repeat very quickly

### Step 7: Implement Attack Patterns
Create attack pattern methods:

**Spread Shot:**
```
fireSpreadShot() {
  angleStep = 30 degrees
  startAngle = -60 degrees
  
  for (i = 0; i < 5; i++) {
    angle = startAngle + (i * angleStep)
    direction = Vector2(cos(angle), sin(angle))
    spawnBullet(position, direction)
  }
}
```

**Spiral Pattern:**
```
fireSpiralPattern() {
  for (i = 0; i < 12; i++) {
    angle = (i * 30) + spiralRotation
    direction = Vector2(cos(angle), sin(angle))
    spawnBullet(position, direction)
  }
  spiralRotation += 15 // Rotate for next shot
}
```

**Bullet Hell:**
```
fireBulletHell() {
  for (i = 0; i < 24; i++) {
    angle = i * 15 // Every 15 degrees
    direction = Vector2(cos(angle), sin(angle))
    spawnBullet(position, direction)
  }
}
```

### Step 8: Implement Phase Transitions
Add dramatic transitions between phases:
- Screen shake
- Flash effect
- Particle explosion
- Sound effect
- Brief invulnerability (0.5 seconds)
- Visual transformation (color change, size pulse)

```
transitionToPhase2() {
  isInvulnerable = true
  playTransitionAnimation()
  changeColor(phase2Color)
  screenShake(intensity: 0.5)
  
  Timer(0.5 seconds, () {
    isInvulnerable = false
  })
}
```

### Step 9: Implement Boss Movement
Bosses move differently than regular enemies:
- **Phase 1**: Slow vertical descent
- **Phase 2**: Weaving side-to-side while descending
- **Phase 3**: Erratic, unpredictable movement

```
updateMovement(dt) {
  if (phase == 1) {
    y += speed * dt
  } else if (phase == 2) {
    y += speed * dt
    x += sin(time * 2) * 100 * dt
  } else if (phase == 3) {
    // Random direction changes
    if (shouldChangeDirection()) {
      targetX = random(bounds)
      targetY = random(bounds)
    }
    moveToward(targetX, targetY)
  }
}
```

### Step 10: Balance Boss Difficulty
Tune boss parameters for appropriate challenge:
- Health scales with wave: `baseHealth * (1 + wave * 0.5)`
- Wave 3 boss: 500 health
- Wave 6 boss: 1000 health
- Wave 9 boss: 1500 health
- Money reward: 500 * wave
- Should take 30-60 seconds to defeat

Test extensively to ensure bosses feel challenging but fair.

## Success Criteria
- [ ] Boss enemy class created
- [ ] Three distinct phases implemented
- [ ] Phase transitions trigger at correct health thresholds
- [ ] Each phase has unique attack patterns
- [ ] Boss movement varies by phase
- [ ] Phase transitions have visual effects
- [ ] Boss spawns on wave 3, 6, 9, etc.
- [ ] Boss health scales with wave number
- [ ] Boss drops appropriate money reward
- [ ] Boss fights feel epic and challenging

## Testing
Run the game to wave 3 and verify:
1. Boss spawns at start of wave 3
2. Boss is visually distinct and large
3. Phase 1 attacks work correctly
4. Boss transitions to Phase 2 at 66% health
5. Phase 2 attacks are more aggressive
6. Boss transitions to Phase 3 at 33% health
7. Phase 3 attacks are most dangerous
8. Phase transitions have visual effects
9. Boss can be defeated with skill
10. Defeating boss advances to next wave
11. Boss drops large money reward
12. Performance stable during boss fight

Test multiple boss waves to ensure scaling works.

## Next Steps
In Story 21, we'll implement the particle system for explosions, trails, and visual effects that make combat feel impactful and satisfying.

## Notes

**Common Pitfalls:**
- Boss too easy (dies too quickly)
- Boss too hard (impossible to defeat)
- Phase transitions not clear
- Attack patterns too predictable
- Not enough visual distinction from regular enemies

**Flutter/Flame Tips:**
- Use state machine for attack patterns
- Cache attack pattern data
- Use `Timer` for attack cooldowns
- Consider using behavior trees for complex AI
- Profile boss fights for performance

**Performance Considerations:**
- Boss spawns many projectiles (use pooling)
- Particle effects can be expensive (limit count)
- Complex movement calculations (optimize)
- Phase transitions are infrequent (no concerns)
- Profile with all effects active

**Reference to Original:**
The React version had boss enemies every 3rd wave with multiple phases and attack patterns. Bosses were challenging encounters that required skill to defeat. We're implementing similar epic boss fights.

**Boss Design Philosophy:**
- **Telegraphing**: Players should see attacks coming
- **Fairness**: Attacks should be dodgeable with skill
- **Escalation**: Each phase should feel more intense
- **Reward**: Victory should feel earned and rewarding
- **Spectacle**: Bosses should look and feel epic

**Attack Pattern Design:**
- Start simple (spread shot)
- Add complexity (spiral, tracking)
- Combine patterns (spread + movement)
- Create bullet hell (many projectiles)
- Always leave safe spaces

**Phase Transition Tips:**
- Make transitions obvious (visual + audio)
- Brief invulnerability prevents cheap damage
- Transitions should feel dramatic
- Use transitions to reset player positioning
- Consider healing player slightly (optional)

**Difficulty Scaling:**
```
Wave 3:  500 HP, Phase 1 attacks
Wave 6:  1000 HP, Phase 1-2 attacks
Wave 9:  1500 HP, All phases
Wave 12: 2000 HP, Faster attacks
```

**Future Enhancements:**
- Multiple boss types (different patterns)
- Boss abilities (shields, healing, summons)
- Boss weak points (target specific areas)
- Boss enrage (time limit)
- Boss dialogue/taunts
- Boss music (unique track)
- Boss achievements
- Boss rush mode (fight all bosses)