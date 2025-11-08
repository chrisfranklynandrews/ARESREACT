# Story 10: Upgrade System Foundation

## Objective
Implement the core upgrade system with data structures, cost calculations, level tracking, and effect application for all six upgrade types.

## Prerequisites
- Story 9 completed (HUD with upgrade buttons)
- Understanding of data modeling
- Basic knowledge of exponential scaling

## Concepts Covered
- Upgrade data structures
- Cost scaling formulas
- Effect application
- Persistent upgrade state
- Balance and progression design

## Implementation Steps

### Step 1: Define Upgrade Types
Create an enum in `lib/data/upgrade_type.dart` for the six upgrade types:
- `FireRate`: Increases bullets per second
- `BulletPower`: Increases damage per bullet
- `ShipLevel`: Unlocks drones and increases stats
- `Interest`: Passive money generation per second
- `CashBoost`: Multiplier for money from kills
- `Shield`: Maximum player health/shields

Each upgrade type has unique effects and scaling. Ship Level is special - it unlocks drones at levels 4, 5, and 6.

### Step 2: Create Upgrade Data Model
Create `lib/data/upgrade.dart` with an Upgrade class:
- `type`: UpgradeType enum
- `level`: Current level (starts at 0 or 1)
- `baseCost`: Initial cost for level 1
- `costMultiplier`: How much cost increases per level
- `baseEffect`: Initial effect value
- `effectMultiplier`: How much effect increases per level

This model allows flexible configuration of each upgrade's progression curve.

### Step 3: Implement Cost Calculation
Add a method to calculate upgrade cost based on level:
```
cost = baseCost * (costMultiplier ^ level)
```

For example, if Fire Rate starts at 100 cost with 1.15x multiplier:
- Level 1: 100
- Level 2: 115
- Level 3: 132
- Level 10: 405

This exponential scaling creates meaningful progression - early upgrades are cheap, later ones are expensive.

### Step 4: Implement Effect Calculation
Add a method to calculate current effect based on level:
```
effect = baseEffect + (effectMultiplier * level)
```

Or for multiplicative effects:
```
effect = baseEffect * (effectMultiplier ^ level)
```

Choose the formula that best fits each upgrade type. Fire Rate might be additive, while Cash Boost is multiplicative.

### Step 5: Create Upgrade Manager
Create `lib/data/upgrade_manager.dart` to manage all upgrades:
- Store all six upgrades in a map or list
- Provide methods to purchase upgrades
- Check if player can afford upgrade
- Apply upgrade effects to game
- Track total money spent

The manager centralizes upgrade logic and makes it easy to save/load upgrade state.

### Step 6: Define Initial Upgrade Values
Set balanced starting values for each upgrade:

**Fire Rate:**
- Base cost: 100
- Cost multiplier: 1.15
- Base effect: 5 shots/second
- Effect: +0.5 shots/second per level

**Bullet Power:**
- Base cost: 150
- Cost multiplier: 1.2
- Base effect: 1 damage
- Effect: +1 damage per level

**Ship Level:**
- Base cost: 500
- Cost multiplier: 2.0
- Base effect: Level 1
- Effect: Unlocks drones at 4, 5, 6

**Interest:**
- Base cost: 200
- Cost multiplier: 1.25
- Base effect: 0 money/second
- Effect: +1 money/second per level

**Cash Boost:**
- Base cost: 300
- Cost multiplier: 1.3
- Base effect: 1x multiplier
- Effect: +0.1x per level

**Shield:**
- Base cost: 250
- Cost multiplier: 1.4
- Base effect: 3 shields
- Effect: +1 shield per level

These values are starting points - balance through playtesting.

### Step 7: Implement Purchase Logic
Add `purchaseUpgrade(UpgradeType type)` method:
- Check if player has enough money
- Deduct cost from player money
- Increment upgrade level
- Apply new effect to game
- Update UI to reflect changes
- Return success/failure

Prevent purchasing if player can't afford it. Provide feedback on successful purchase.

### Step 8: Apply Upgrade Effects
Create methods to apply each upgrade's effect:
- **Fire Rate**: Update player's fire cooldown
- **Bullet Power**: Update bullet damage value
- **Ship Level**: Check for drone unlocks
- **Interest**: Start/update passive income timer
- **Cash Boost**: Update money multiplier
- **Shield**: Increase max shields and heal player

Effects should apply immediately and persist until game restart.

### Step 9: Add Passive Income System
Implement Interest upgrade's passive income:
- Track time since last income tick
- Generate money every second based on Interest level
- Update money counter in real-time
- Continue generating during gameplay
- Pause during pause state

This creates the "idle" aspect of the idle game - money generates even without kills.

### Step 10: Implement Max Level Caps (Optional)
Consider adding maximum levels for balance:
- Fire Rate: Cap at level 50 (very fast but not instant)
- Bullet Power: Cap at level 100 (high damage but not one-shot)
- Ship Level: Cap at level 6 (all drones unlocked)
- Interest: No cap (passive income scales infinitely)
- Cash Boost: No cap (multiplier scales infinitely)
- Shield: Cap at level 20 (reasonable max health)

Max levels prevent game-breaking scenarios and give players goals to reach.

## Success Criteria
- [ ] All six upgrade types defined
- [ ] Upgrade data model created
- [ ] Cost calculation works correctly
- [ ] Effect calculation works correctly
- [ ] Upgrade manager tracks all upgrades
- [ ] Purchase logic deducts money and applies effects
- [ ] Each upgrade type has balanced initial values
- [ ] Passive income generates money over time
- [ ] Upgrade effects persist during gameplay
- [ ] UI updates when upgrades purchased

## Testing
Run the game and verify:
1. All six upgrade buttons show correct costs
2. Clicking upgrade deducts correct amount of money
3. Upgrade level increments after purchase
4. Cost increases after each purchase
5. Effects apply immediately (fire rate increases, etc.)
6. Can't purchase if insufficient money
7. Passive income generates money every second
8. Ship Level unlocks drones at levels 4, 5, 6
9. Multiple upgrades can be purchased in sequence
10. Upgrade state persists during gameplay session

Test each upgrade type individually to verify effects work correctly.

## Next Steps
In Story 11, we'll implement the Swooper enemy with sine wave movement patterns. This adds variety to enemy behavior and increases difficulty.

## Notes

**Common Pitfalls:**
- Cost scaling too aggressive (upgrades become unaffordable)
- Effects too powerful (game becomes too easy)
- Not applying effects immediately after purchase
- Forgetting to update UI after purchase
- Passive income continuing during pause

**Flutter/Flame Tips:**
- Use `Timer.periodic` for passive income generation
- Store upgrade state in a separate class for easy serialization
- Use callbacks to notify UI of upgrade changes
- Consider using `ChangeNotifier` for reactive updates
- Profile upgrade calculations if you have many levels

**Performance Considerations:**
- Cache calculated values instead of recalculating every frame
- Upgrade calculations are infrequent (only on purchase)
- Passive income timer is lightweight
- Avoid creating objects during effect application
- Use efficient data structures for upgrade storage

**Reference to Original:**
The React version had six upgrades with exponential cost scaling. Effects applied immediately. Interest generated passive income. Ship Level unlocked drones. We're implementing the same system with proper data modeling.

**Balance Philosophy:**
- Early upgrades should feel impactful
- Mid-game should require strategic choices
- Late-game should be about optimization
- No single upgrade should dominate
- All upgrades should remain useful throughout

**Cost Scaling Examples:**
```
Level  | 1.15x  | 1.2x   | 1.5x   | 2.0x
-------|--------|--------|--------|--------
1      | 100    | 100    | 100    | 100
5      | 175    | 207    | 506    | 1,600
10     | 405    | 619    | 5,767  | 51,200
20     | 1,637  | 3,834  | 332K   | 52M
```

Choose multipliers that create desired progression pace.

**Future Enhancements:**
- Prestige system (reset for permanent bonuses)
- Upgrade synergies (combos between upgrades)
- Temporary power-ups (time-limited boosts)
- Upgrade trees (branching paths)
- Special upgrades (unique effects)
- Upgrade refund system