# Story 9: HUD Implementation

## Objective
Create the Heads-Up Display (HUD) showing money, kills, shields, wave information, and interactive UI buttons for pause and upgrades.

## Prerequisites
- Story 8 completed (game state management)
- Understanding of Flutter widgets and overlays
- Basic knowledge of UI layout and positioning

## Concepts Covered
- Flame overlays system
- Flutter widget integration with game
- Real-time UI updates
- Button handling and callbacks
- Responsive UI layout

## Implementation Steps

### Step 1: Understand Flame Overlays
Flame's overlay system allows you to add Flutter widgets on top of the game canvas:
- Overlays are standard Flutter widgets
- They can access game state through callbacks
- Multiple overlays can be active simultaneously
- Overlays are perfect for HUD, menus, and dialogs

Overlays bridge Flame's game world with Flutter's UI system, giving you the best of both worlds.

### Step 2: Create HUD Overlay Widget
Create `lib/ui/game_hud.dart` with a StatefulWidget for the HUD:
- Accept game reference as parameter
- Use `StreamBuilder` or `ValueNotifier` for reactive updates
- Layout UI elements using Flutter widgets
- Position elements at screen edges

The HUD should be transparent except for the UI elements, allowing the game to show through.

### Step 3: Display Money Counter
Add a money display in the top-left corner:
- Show current money amount
- Use a coin icon or "$" symbol
- Format large numbers (e.g., "1.2K" instead of "1200")
- Update in real-time as money changes
- Use bright color (gold/yellow) for visibility

Money is the primary currency for upgrades, so make it prominent.

### Step 4: Add Kill Counter
Display kill count in the top-center or top-right:
- Show total kills this run
- Include a skull icon or "Kills:" label
- Update immediately when enemy dies
- Consider showing kills needed for next wave

The kill counter helps players track progress toward wave completion (25 kills per wave).

### Step 5: Implement Shield Display
Show player shields in the bottom-left:
- Display as hearts, bars, or numeric value
- Show current/max shields (e.g., "3/5")
- Use color coding (green = healthy, red = low)
- Animate when taking damage
- Make it large enough to see during combat

Shields are critical information - players need to know their health at a glance.

### Step 6: Add Wave Information
Display current wave number prominently:
- Show wave number (e.g., "Wave 3")
- Indicate boss waves differently (every 3rd wave)
- Show progress to next wave (optional)
- Use larger text for boss wave announcements

Wave information helps players understand difficulty progression.

### Step 7: Create Pause Button
Add a pause button in the top-right corner:
- Use a pause icon (two vertical bars)
- Make it large enough for easy tapping
- Trigger pause state when pressed
- Show different icon when paused (play icon)

The pause button should be accessible but not intrusive.

### Step 8: Add Upgrade Buttons
Create upgrade buttons along the right edge:
- One button per upgrade type (6 total)
- Show upgrade name and cost
- Disable if player can't afford
- Highlight when affordable
- Show current level (e.g., "Fire Rate Lv.3")

Upgrades are core to the idle game progression, so make them easily accessible.

### Step 9: Implement Button Callbacks
Connect UI buttons to game logic:
- Pause button → change game state
- Upgrade buttons → purchase upgrade, deduct money
- Update button states based on game state
- Provide visual feedback on press
- Handle rapid clicking gracefully

Use Flutter's `onPressed` callbacks to communicate with the game.

### Step 10: Add Responsive Layout
Ensure HUD works on different screen sizes:
- Use `MediaQuery` for screen dimensions
- Position elements relative to screen size
- Scale text and icons appropriately
- Test on various aspect ratios
- Maintain readability on small screens

The HUD should adapt to different devices without overlapping or clipping.

## Success Criteria
- [ ] HUD overlay created and displays over game
- [ ] Money counter shows current money
- [ ] Kill counter updates when enemies die
- [ ] Shield display shows player health
- [ ] Wave number displays correctly
- [ ] Pause button toggles pause state
- [ ] Upgrade buttons show all 6 upgrades
- [ ] Buttons disabled when unaffordable
- [ ] UI updates in real-time
- [ ] Layout works on different screen sizes

## Testing
Run the game and verify:
1. All HUD elements visible and positioned correctly
2. Money increases when enemies die
3. Kill counter increments with each kill
4. Shield display decreases when player takes damage
5. Wave number updates every 25 kills
6. Pause button pauses/resumes game
7. Upgrade buttons show correct costs
8. Clicking upgrade deducts money and applies effect
9. Disabled buttons don't respond to clicks
10. HUD remains visible during all game states
11. No UI elements overlap or clip
12. Text is readable on all backgrounds

Test on different device sizes to ensure responsive layout works.

## Next Steps
In Story 10, we'll implement the upgrade system foundation with data structures, cost calculations, and effect application. This will make the upgrade buttons functional.

## Notes

**Common Pitfalls:**
- Not updating UI when game state changes
- Overlays blocking game input
- Text too small on mobile devices
- Buttons too small for touch input (minimum 44x44 pixels)
- UI elements overlapping game elements

**Flutter/Flame Tips:**
- Use `game.overlays.add('hudOverlay')` to show overlay
- Access game state through callbacks or streams
- Use `Positioned` or `Stack` for absolute positioning
- `SafeArea` widget prevents UI from being cut off by notches
- Consider using `Provider` or `Riverpod` for state management

**Performance Considerations:**
- Minimize widget rebuilds (use `const` where possible)
- Update only changed values, not entire HUD
- Use `RepaintBoundary` for static UI elements
- Avoid expensive operations in build method
- Profile UI performance with Flutter DevTools

**Reference to Original:**
The React version displayed money, kills, shields, and wave at screen edges. Upgrade buttons were on the right side. Pause button was in top-right. We're implementing the same layout optimized for mobile.

**UI Layout Design:**
```
[Money]              [Pause]
        [Kills] [Wave]

[Shields]            [Upgrades]
                     [Buttons]
                     [Along]
                     [Right]
                     [Edge]
```

**Upgrade Button Design:**
Each button should show:
- Upgrade icon/name
- Current level
- Cost to next level
- Visual state (affordable/not affordable)
- Tap feedback animation

**Color Scheme:**
- Money: Gold/Yellow (#FFD700)
- Kills: White/Light Gray
- Shields: Green (healthy) → Red (low)
- Wave: Cyan/Blue
- Buttons: Dark background, bright text
- Disabled: Gray/Transparent

**Future Enhancements:**
- Animated money/kill counters (count up effect)
- Floating damage numbers
- Combo counter for rapid kills
- Achievement notifications
- Buff/debuff indicators
- Mini-map (for larger levels)