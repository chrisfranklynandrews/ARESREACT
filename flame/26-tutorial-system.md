# Story 26: Tutorial System (7-Step Introduction)

## Objective
Implement a 7-step tutorial system that teaches new players the game mechanics progressively, matching the original ARES tutorial flow.

## Prerequisites
- Story 25 completed (save/load system)
- Understanding of tutorial design
- Knowledge of UI overlays

## Concepts Covered
- Progressive tutorial steps
- UI highlighting and tooltips
- Tutorial state management
- Player guidance
- Tutorial completion tracking

## Implementation Steps

### Step 1: Understand Tutorial Flow
The original ARES has 7 tutorial steps:
1. **Welcome**: Introduction to the game
2. **Movement**: Teach player ship control
3. **Shooting**: Explain auto-firing
4. **Enemies**: Introduce enemy types
5. **Money**: Explain money collection
6. **Upgrades**: Show upgrade system
7. **Complete**: Tutorial finished, start playing

Each step blocks progression until completed.

### Step 2: Create Tutorial State Enum
Define tutorial steps in `lib/data/tutorial_step.dart`:

```dart
enum TutorialStep {
  Welcome,      // Step 0: Introduction
  Movement,     // Step 1: Move your ship
  Shooting,     // Step 2: Bullets fire automatically
  Enemies,      // Step 3: Destroy enemies
  Money,        // Step 4: Collect money
  Upgrades,     // Step 5: Purchase upgrades
  Complete,     // Step 6: Tutorial complete
}
```

### Step 3: Create Tutorial Manager
Create `lib/game/tutorial_manager.dart`:

```dart
class TutorialManager {
  TutorialStep currentStep = TutorialStep.Welcome;
  bool isActive = false;
  bool isCompleted = false;
  
  // Completion conditions for each step
  Map<TutorialStep, bool> stepCompleted = {
    TutorialStep.Welcome: false,
    TutorialStep.Movement: false,
    TutorialStep.Shooting: false,
    TutorialStep.Enemies: false,
    TutorialStep.Money: false,
    TutorialStep.Upgrades: false,
    TutorialStep.Complete: false,
  };
  
  void start() {
    isActive = true;
    currentStep = TutorialStep.Welcome;
  }
  
  void completeCurrentStep() {
    stepCompleted[currentStep] = true;
    
    if (currentStep == TutorialStep.Complete) {
      finish();
    } else {
      // Advance to next step
      currentStep = TutorialStep.values[currentStep.index + 1];
    }
  }
  
  void finish() {
    isActive = false;
    isCompleted = true;
    
    // Save completion to save data
    saveData.tutorialCompleted = true;
    saveManager.save(saveData);
  }
  
  void skip() {
    finish();
  }
}
```

### Step 4: Create Tutorial Overlay UI
Create `lib/ui/tutorial_overlay.dart` for tutorial UI:

```dart
class TutorialOverlay extends StatelessWidget {
  final TutorialStep step;
  final VoidCallback onNext;
  final VoidCallback onSkip;
  
  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Semi-transparent overlay
        Container(
          color: Colors.black.withOpacity(0.7),
        ),
        
        // Tutorial content
        Center(
          child: Container(
            padding: EdgeInsets.all(20),
            margin: EdgeInsets.all(40),
            decoration: BoxDecoration(
              color: Colors.blue.shade900,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: Colors.cyan, width: 2),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Step title
                Text(
                  getTutorialTitle(step),
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                
                SizedBox(height: 20),
                
                // Step description
                Text(
                  getTutorialDescription(step),
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.white,
                  ),
                  textAlign: TextAlign.center,
                ),
                
                SizedBox(height: 30),
                
                // Buttons
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    // Skip button
                    ElevatedButton(
                      onPressed: onSkip,
                      child: Text('Skip Tutorial'),
                    ),
                    
                    // Next button
                    ElevatedButton(
                      onPressed: onNext,
                      child: Text(getButtonText(step)),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
```

### Step 5: Define Tutorial Content
Create content for each tutorial step:

```dart
String getTutorialTitle(TutorialStep step) {
  switch (step) {
    case TutorialStep.Welcome:
      return 'Welcome to ARES!';
    case TutorialStep.Movement:
      return 'Ship Movement';
    case TutorialStep.Shooting:
      return 'Auto-Fire System';
    case TutorialStep.Enemies:
      return 'Enemy Threats';
    case TutorialStep.Money:
      return 'Collect Money';
    case TutorialStep.Upgrades:
      return 'Upgrade Your Ship';
    case TutorialStep.Complete:
      return 'Tutorial Complete!';
  }
}

String getTutorialDescription(TutorialStep step) {
  switch (step) {
    case TutorialStep.Welcome:
      return 'You are the pilot of the ARES fighter. Defend against endless waves of enemies!';
    case TutorialStep.Movement:
      return 'Touch or drag anywhere on screen to move your ship. Try moving around!';
    case TutorialStep.Shooting:
      return 'Your ship fires automatically. Focus on positioning and dodging!';
    case TutorialStep.Enemies:
      return 'Enemies come in many types. Destroy them before they reach the bottom!';
    case TutorialStep.Money:
      return 'Enemies drop money when destroyed. Use it to purchase upgrades!';
    case TutorialStep.Upgrades:
      return 'Tap upgrade buttons on the right to improve your ship. Try buying one!';
    case TutorialStep.Complete:
      return 'You\'re ready! Survive as long as possible and reach the highest wave!';
  }
}
```

### Step 6: Implement Step Completion Detection
Add logic to detect when each step is completed:

```dart
class TutorialManager {
  // ... previous code ...
  
  void update(GameState gameState) {
    if (!isActive) return;
    
    switch (currentStep) {
      case TutorialStep.Welcome:
        // Auto-advance after player acknowledges
        break;
        
      case TutorialStep.Movement:
        // Complete when player moves ship
        if (playerHasMoved) {
          completeCurrentStep();
        }
        break;
        
      case TutorialStep.Shooting:
        // Complete when bullets fired
        if (bulletsFired > 0) {
          completeCurrentStep();
        }
        break;
        
      case TutorialStep.Enemies:
        // Complete when first enemy destroyed
        if (enemiesKilled > 0) {
          completeCurrentStep();
        }
        break;
        
      case TutorialStep.Money:
        // Complete when money collected
        if (moneyCollected > 0) {
          completeCurrentStep();
        }
        break;
        
      case TutorialStep.Upgrades:
        // Complete when first upgrade purchased
        if (upgradesPurchased > 0) {
          completeCurrentStep();
        }
        break;
        
      case TutorialStep.Complete:
        // Auto-advance to finish
        completeCurrentStep();
        break;
    }
  }
}
```

### Step 7: Add UI Highlighting
Highlight relevant UI elements during tutorial:

```dart
class TutorialHighlight extends StatelessWidget {
  final Rect targetRect;
  final String tooltip;
  
  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      painter: HighlightPainter(targetRect),
      child: Stack(
        children: [
          // Tooltip pointing to highlighted area
          Positioned(
            left: targetRect.left,
            top: targetRect.bottom + 10,
            child: Container(
              padding: EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: Colors.yellow,
                borderRadius: BorderRadius.circular(5),
              ),
              child: Text(
                tooltip,
                style: TextStyle(color: Colors.black),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class HighlightPainter extends CustomPainter {
  final Rect targetRect;
  
  HighlightPainter(this.targetRect);
  
  @override
  void paint(Canvas canvas, Size size) {
    // Draw dark overlay everywhere except target
    final path = Path()
      ..addRect(Rect.fromLTWH(0, 0, size.width, size.height))
      ..addRect(targetRect)
      ..fillType = PathFillType.evenOdd;
    
    canvas.drawPath(
      path,
      Paint()..color = Colors.black.withOpacity(0.7),
    );
    
    // Draw highlight border around target
    canvas.drawRect(
      targetRect,
      Paint()
        ..color = Colors.yellow
        ..style = PaintingStyle.stroke
        ..strokeWidth = 3,
    );
  }
  
  @override
  bool shouldRepaint(HighlightPainter oldDelegate) => true;
}
```

### Step 8: Integrate Tutorial with Game Flow
Add tutorial to game initialization:

```dart
class AresGame extends FlameGame {
  TutorialManager tutorialManager = TutorialManager();
  
  @override
  Future<void> onLoad() async {
    // Load save data
    final saveData = await saveManager.load();
    
    if (saveData == null || !saveData.tutorialCompleted) {
      // Start tutorial for new players
      changeState(GameState.Tutorial);
      tutorialManager.start();
    } else {
      // Skip tutorial for returning players
      changeState(GameState.WelcomeBack);
    }
  }
  
  @override
  void update(double dt) {
    super.update(dt);
    
    if (currentState == GameState.Tutorial) {
      tutorialManager.update(this);
    }
  }
}
```

### Step 9: Add Tutorial-Specific Game Behavior
Modify game behavior during tutorial:

```dart
void updateTutorialMode(double dt) {
  switch (tutorialManager.currentStep) {
    case TutorialStep.Movement:
      // No enemies, just let player move
      break;
      
    case TutorialStep.Shooting:
      // Enable shooting, no enemies yet
      break;
      
    case TutorialStep.Enemies:
      // Spawn single weak enemy
      if (enemies.isEmpty) {
        spawnTutorialEnemy();
      }
      break;
      
    case TutorialStep.Money:
      // Enemy drops money, highlight it
      break;
      
    case TutorialStep.Upgrades:
      // Highlight upgrade buttons
      // Give player enough money for one upgrade
      if (money < 100) {
        money = 100;
      }
      break;
  }
}

void spawnTutorialEnemy() {
  // Spawn weak, slow enemy for tutorial
  enemy = StandardEnemy()
    ..health = 1  // One-shot kill
    ..speed = 50  // Slow
    ..position = Vector2(gameWidth / 2, 0);
  
  add(enemy);
}
```

### Step 10: Add Tutorial Completion Rewards
Reward players for completing tutorial:

```dart
void onTutorialComplete() {
  // Give starting bonus
  money += 500;
  
  // Show completion message
  showMessage('Tutorial Complete! +500 Money Bonus');
  
  // Transition to normal gameplay
  changeState(GameState.Playing);
  
  // Start first wave
  waveManager.startWave(1);
}
```

## Success Criteria
- [ ] Tutorial system with 7 steps implemented
- [ ] Tutorial overlay UI displays correctly
- [ ] Each step has clear instructions
- [ ] Step completion detection works
- [ ] UI highlighting shows relevant elements
- [ ] Tutorial can be skipped
- [ ] Tutorial completion saves to data
- [ ] Returning players skip tutorial
- [ ] Game behavior adapts during tutorial
- [ ] Tutorial completion rewards player

## Testing
Test the tutorial system:
1. Start new game (no save data)
2. Tutorial should start automatically
3. Complete each step in sequence
4. Verify instructions are clear
5. Test skip functionality
6. Verify completion saves
7. Close and reopen app
8. Verify tutorial doesn't restart
9. Test with existing save data
10. Verify tutorial can be replayed (optional)

Test on new players to ensure clarity.

## Next Steps
In Story 27, we'll implement the menu screens (Start, WelcomeBack, Pause, GameOver) with proper UI, transitions, and player feedback.

## Notes

**Common Pitfalls:**
- Tutorial too long (players skip)
- Instructions unclear (confusion)
- No skip option (frustration)
- Tutorial blocks gameplay (annoying)
- Not saving completion (repeats)

**Flutter/Flame Tips:**
- Use overlays for tutorial UI
- Pause game during tutorial steps
- Highlight interactive elements
- Provide visual feedback
- Test with new players

**Performance Considerations:**
- Tutorial UI is lightweight
- Highlighting uses simple rendering
- No performance concerns
- Profile if complex animations added

**Reference to Original:**
The React version had 7 tutorial steps teaching movement, shooting, enemies, money, and upgrades. Steps were sequential and could be skipped. We're implementing the same flow.

**Tutorial Design Principles:**
- **Progressive**: One concept at a time
- **Interactive**: Learn by doing
- **Brief**: Short, clear instructions
- **Skippable**: Don't force experienced players
- **Rewarding**: Give bonus for completion

**Step Timing:**
```
Welcome: 5 seconds (auto-advance)
Movement: Until player moves
Shooting: Until bullets fired
Enemies: Until enemy killed
Money: Until money collected
Upgrades: Until upgrade purchased
Complete: 3 seconds (auto-advance)

Total: 1-2 minutes for engaged player
```

**Highlight Targets:**
- Movement: Player ship
- Shooting: Bullets
- Enemies: Enemy
- Money: Money counter
- Upgrades: Upgrade buttons

**Future Enhancements:**
- Animated tutorial characters
- Voice-over narration
- Video tutorials
- Advanced tips system
- Context-sensitive help
- Tutorial replay option
- Multiple difficulty tutorials
- Achievement for completion