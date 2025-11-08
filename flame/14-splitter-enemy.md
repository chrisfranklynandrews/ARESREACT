# Story 14: Splitter Enemy (Splits on Death)

## Objective
Implement the Splitter enemy that splits into multiple smaller enemies when destroyed, creating cascading threats and strategic depth.

## Prerequisites
- Story 13 completed (Turret enemy)
- Understanding of recursive enemy spawning
- Basic knowledge of enemy scaling

## Concepts Covered
- Dynamic enemy spawning
- Recursive splitting behavior
- Enemy size and health scaling
- Cascading difficulty
- Strategic target prioritization

## Implementation Steps

### Step 1: Understand Splitter Behavior
Splitters create a chain reaction when destroyed:
- Large Splitter splits into 2-3 Medium Splitters
- Medium Splitters split into 2-3 Small Splitters
- Small Splitters don't split (base case)
- Each split spawns enemies at parent's position
- Split enemies inherit parent's velocity with variation

This creates a risk-reward dynamic - killing Splitters creates more enemies but also more money.

### Step 2: Add Split Level Property
Extend the Enemy base class or Splitter specifically:
- `splitLevel`: 0 (small), 1 (medium), 2 (large)
- `canSplit`: Boolean indicating if enemy splits on death
- `splitCount`: How many enemies to spawn (2-3)

Large Splitters are rare but dangerous. Small Splitters are common but manageable.

### Step 3: Create Splitter Enemy Class
Create `SplitterEnemy` class extending `Enemy`:
- Size scales with split level:
  - Large: 50x50 pixels, 8 health
  - Medium: 35x35 pixels, 4 health
  - Small: 20x20 pixels, 2 health
- Speed increases as size decreases:
  - Large: 80 pixels/second
  - Medium: 120 pixels/second
  - Small: 160 pixels/second
- Money reward scales with size

### Step 4: Implement Split Logic
Override the death/destroy method:
- Check if `canSplit` is true
- If yes, spawn `splitCount` new Splitters
- New Splitters have `splitLevel - 1`
- Position new Splitters at parent's position
- Add slight velocity variation for spread
- Award money for parent destruction

```
onDestroy() {
  if (canSplit && splitLevel > 0) {
    for (i = 0; i < splitCount; i++) {
      spawnSplitter(position, splitLevel - 1)
    }
  }
  awardMoney()
}
```

### Step 5: Add Velocity Inheritance
Split enemies should inherit parent's momentum:
- Copy parent's velocity vector
- Add random variation (±30 degrees)
- Slightly increase speed for smaller enemies
- Creates natural spreading pattern

This makes splits feel dynamic and organic, not static spawns.

### Step 6: Implement Size Scaling
Scale visual properties based on split level:
- Larger enemies are bigger and slower
- Smaller enemies are faster and harder to hit
- Color intensity varies with size
- Health bars scale with enemy size

Visual scaling helps players quickly assess threat level.

### Step 7: Balance Split Rewards
Tune money rewards to balance risk:
- Large Splitter: 30 money (but spawns 2-3 mediums)
- Medium Splitter: 15 money (but spawns 2-3 smalls)
- Small Splitter: 10 money (no split)
- Total potential: 30 + (2×15) + (4×10) = 100 money

Killing a Large Splitter completely is very rewarding but creates many enemies.

### Step 8: Add Visual Distinction
Make Splitters recognizable:
- Unique color (green or purple)
- Pulsing or animated appearance
- Visual indicator of split level (size, glow intensity)
- Split animation when destroyed

Players should recognize Splitters and plan accordingly.

### Step 9: Implement Split Limits
Prevent exponential enemy explosion:
- Limit maximum active enemies (e.g., 30)
- If limit reached, Splitters don't split
- Or reduce split count when many enemies exist
- Prevents performance issues and overwhelming difficulty

### Step 10: Update Enemy Spawner
Add Splitters to spawn pool:
- Only spawn Large Splitters initially
- Low spawn weight (5% of enemies)
- Increase frequency in later waves
- Never spawn Medium/Small directly (only from splits)

Splitters should feel special and strategic, not common.

## Success Criteria
- [ ] Splitter enemy class created with split levels
- [ ] Large Splitters split into Medium on death
- [ ] Medium Splitters split into Small on death
- [ ] Small Splitters don't split
- [ ] Split enemies spawn at parent position
- [ ] Size and speed scale with split level
- [ ] Money rewards balanced appropriately
- [ ] Visual distinction clear
- [ ] Split limits prevent overwhelming enemies
- [ ] Spawner includes Large Splitters only

## Testing
Run the game and verify:
1. Large Splitters spawn periodically
2. Destroying Large creates 2-3 Medium Splitters
3. Destroying Medium creates 2-3 Small Splitters
4. Destroying Small doesn't create more enemies
5. Split enemies spread out naturally
6. Size scaling is visually clear
7. Speed increases for smaller enemies
8. Total money reward is balanced
9. Enemy count doesn't explode uncontrollably
10. Performance stable with many splits

Test chain reactions - destroy Large Splitter and track all resulting enemies.

## Next Steps
In Story 15, we'll implement the remaining advanced enemy types (Charger, Weaver, Guardian) that combine multiple behaviors for increased challenge.

## Notes

**Common Pitfalls:**
- Infinite recursion (no base case for splitting)
- Too many enemies spawned (performance issues)
- Split enemies spawning on top of each other
- Not scaling difficulty with split level
- Rewards too high (economy breaks)

**Flutter/Flame Tips:**
- Use factory pattern for creating split enemies
- Check enemy count before spawning splits
- Use `Future.delayed` if spawning causes frame drops
- Consider using object pooling for split enemies
- Profile with maximum splits to ensure performance

**Performance Considerations:**
- Limit maximum active enemies
- Use object pooling for frequently split enemies
- Batch spawn operations if possible
- Monitor frame rate during split cascades
- Consider reducing particle effects during splits

**Reference to Original:**
The React version had Splitter enemies that divided into smaller versions. Large → Medium → Small progression. Each split created 2-3 enemies. We're implementing the same cascading behavior.

**Split Patterns:**
- **Binary**: Always split into 2 (predictable)
- **Variable**: Split into 2-3 (more chaotic)
- **Exponential**: Each level splits into more (very chaotic)

Start with variable (2-3) for good balance.

**Strategic Depth:**
Splitters create interesting decisions:
- Kill quickly to prevent splits?
- Let them reach bottom to avoid more enemies?
- Focus fire to eliminate chains?
- Ignore until other threats cleared?

Good design creates meaningful choices.

**Visual Feedback:**
- Split animation (explosion, flash)
- Particle effects showing split direction
- Sound effect for splitting
- Screen shake for Large splits
- Visual trail connecting parent to children

**Difficulty Scaling:**
- Early waves: Rare Large Splitters
- Mid waves: More frequent, occasional Medium spawns
- Late waves: Multiple Large Splitters, faster splits
- Boss waves: Splitters + other enemy types

**Future Enhancements:**
- Splinters (Story 15) - similar but different behavior
- Merge mechanic (Small enemies combine into Large)
- Split on damage (not just death)
- Directional splits (toward/away from player)
- Special split types (explosive, toxic)
- Split limit per enemy (can only split once)
- Split cooldown (delay between splits)