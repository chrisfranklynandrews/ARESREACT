# Story 27: Menu Screens (Start, WelcomeBack, Pause, GameOver)

## Objective
Implement all menu screens with proper UI, transitions, and player feedback for Start, WelcomeBack, Pause, and GameOver states.

## Prerequisites
- Story 26 completed (tutorial system)
- Understanding of UI design
- Knowledge of state transitions

## Concepts Covered
- Menu screen design
- UI overlays in Flame
- State-specific interfaces
- Button interactions
- Screen transitions

## Implementation Steps

### Step 1: Understand Menu Flow
ARES has four main menu screens:
- **Start**: First-time players, show title and play button
- **WelcomeBack**: Returning players, show previous stats
- **Pause**: During gameplay, show resume/quit options
- **GameOver**: After death, show final stats and restart

Each screen has specific information and actions.

### Step 2: Create Start Screen
Create `lib/ui/start_screen.dart`:

```dart
class StartScreen extends StatelessWidget {
  final VoidCallback onPlay;
  
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            Color(0xFF000033),
            Color(0xFF000066),
          ],
        ),
      ),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Game title
            Text(
              'ARES',
              style: TextStyle(
                fontSize: 72,
                fontWeight: FontWeight.bold,
                color: Colors.cyan,
                shadows: [
                  Shadow(
                    color: Colors.cyan,
                    blurRadius: 20,
                  ),
                ],
              ),
            ),
            
            SizedBox(height: 10),
            
            // Subtitle
            Text(
              'Idle Space Shooter',
              style: TextStyle(
                fontSize: 24,
                color: Colors.white70,
              ),
            ),
            
            SizedBox(height: 60),
            
            // Play button
            ElevatedButton(
              onPressed: onPlay,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.cyan,
                padding: EdgeInsets.symmetric(
                  horizontal: 60,
                  vertical: 20,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              child: Text(
                'PLAY',
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  color: Colors.black,
                ),
              ),
            ),
            
            SizedBox(height: 40),
            
            // Version info
            Text(
              'v1.0.0',
              style: TextStyle(
                fontSize: 14,
                color: Colors.white30,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
```

### Step 3: Create WelcomeBack Screen
Create `lib/ui/welcome_back_screen.dart`:

```dart
class WelcomeBackScreen extends StatelessWidget {
  final SaveData saveData;
  final VoidCallback onContinue;
  final VoidCallback onNewGame;
  
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            Color(0xFF000033),
            Color(0xFF000066),
          ],
        ),
      ),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Welcome back message
            Text(
              'Welcome Back, Pilot!',
              style: TextStyle(
                fontSize: 48,
                fontWeight: FontWeight.bold,
                color: Colors.cyan,
              ),
            ),
            
            SizedBox(height: 40),
            
            // Previous stats
            Container(
              padding: EdgeInsets.all(30),
              decoration: BoxDecoration(
                color: Colors.black.withOpacity(0.5),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: Colors.cyan, width: 2),
              ),
              child: Column(
                children: [
                  StatRow('Highest Wave', '${saveData.highestWave}'),
                  StatRow('Total Kills', '${saveData.totalKills}'),
                  StatRow('Money', '\$${saveData.currentMoney}'),
                  StatRow('Games Played', '${saveData.gamesPlayed}'),
                ],
              ),
            ),
            
            SizedBox(height: 40),
            
            // Continue button
            ElevatedButton(
              onPressed: onContinue,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.cyan,
                padding: EdgeInsets.symmetric(
                  horizontal: 50,
                  vertical: 15,
                ),
              ),
              child: Text(
                'CONTINUE',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Colors.black,
                ),
              ),
            ),
            
            SizedBox(height: 20),
            
            // New game button
            TextButton(
              onPressed: onNewGame,
              child: Text(
                'Start New Game',
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.white70,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class StatRow extends StatelessWidget {
  final String label;
  final String value;
  
  StatRow(this.label, this.value);
  
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: 18,
              color: Colors.white70,
            ),
          ),
          Text(
            value,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.cyan,
            ),
          ),
        ],
      ),
    );
  }
}
```

### Step 4: Create Pause Screen
Create `lib/ui/pause_screen.dart`:

```dart
class PauseScreen extends StatelessWidget {
  final VoidCallback onResume;
  final VoidCallback onQuit;
  
  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.black.withOpacity(0.8),
      child: Center(
        child: Container(
          padding: EdgeInsets.all(40),
          decoration: BoxDecoration(
            color: Color(0xFF000033),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: Colors.cyan, width: 2),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Pause title
              Text(
                'PAUSED',
                style: TextStyle(
                  fontSize: 48,
                  fontWeight: FontWeight.bold,
                  color: Colors.cyan,
                ),
              ),
              
              SizedBox(height: 40),
              
              // Resume button
              ElevatedButton(
                onPressed: onResume,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.cyan,
                  padding: EdgeInsets.symmetric(
                    horizontal: 50,
                    vertical: 15,
                  ),
                  minimumSize: Size(200, 50),
                ),
                child: Text(
                  'RESUME',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.black,
                  ),
                ),
              ),
              
              SizedBox(height: 20),
              
              // Quit button
              OutlinedButton(
                onPressed: onQuit,
                style: OutlinedButton.styleFrom(
                  side: BorderSide(color: Colors.red, width: 2),
                  padding: EdgeInsets.symmetric(
                    horizontal: 50,
                    vertical: 15,
                  ),
                  minimumSize: Size(200, 50),
                ),
                child: Text(
                  'QUIT',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.red,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

### Step 5: Create GameOver Screen
Create `lib/ui/game_over_screen.dart`:

```dart
class GameOverScreen extends StatelessWidget {
  final int finalWave;
  final int totalKills;
  final int moneyEarned;
  final VoidCallback onRestart;
  final VoidCallback onQuit;
  
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            Color(0xFF330000),
            Color(0xFF000000),
          ],
        ),
      ),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Game Over title
            Text(
              'GAME OVER',
              style: TextStyle(
                fontSize: 56,
                fontWeight: FontWeight.bold,
                color: Colors.red,
                shadows: [
                  Shadow(
                    color: Colors.red,
                    blurRadius: 20,
                  ),
                ],
              ),
            ),
            
            SizedBox(height: 40),
            
            // Final stats
            Container(
              padding: EdgeInsets.all(30),
              decoration: BoxDecoration(
                color: Colors.black.withOpacity(0.5),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: Colors.red, width: 2),
              ),
              child: Column(
                children: [
                  Text(
                    'Final Statistics',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  SizedBox(height: 20),
                  StatRow('Wave Reached', '$finalWave'),
                  StatRow('Enemies Killed', '$totalKills'),
                  StatRow('Money Earned', '\$$moneyEarned'),
                ],
              ),
            ),
            
            SizedBox(height: 40),
            
            // Restart button
            ElevatedButton(
              onPressed: onRestart,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.cyan,
                padding: EdgeInsets.symmetric(
                  horizontal: 50,
                  vertical: 15,
                ),
                minimumSize: Size(200, 50),
              ),
              child: Text(
                'PLAY AGAIN',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Colors.black,
                ),
              ),
            ),
            
            SizedBox(height: 20),
            
            // Quit button
            TextButton(
              onPressed: onQuit,
              child: Text(
                'Main Menu',
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.white70,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
```

### Step 6: Integrate Screens with Game
Add overlay management to game class:

```dart
class AresGame extends FlameGame {
  void showStartScreen() {
    overlays.add('start');
  }
  
  void showWelcomeBackScreen() {
    overlays.add('welcomeBack');
  }
  
  void showPauseScreen() {
    overlays.add('pause');
  }
  
  void showGameOverScreen() {
    overlays.add('gameOver');
  }
  
  void hideAllScreens() {
    overlays.clear();
  }
}
```

Register overlays in main.dart:

```dart
void main() {
  runApp(
    GameWidget<AresGame>.controlled(
      gameFactory: AresGame.new,
      overlayBuilderMap: {
        'start': (context, game) => StartScreen(
          onPlay: () {
            game.hideAllScreens();
            game.startGame();
          },
        ),
        'welcomeBack': (context, game) => WelcomeBackScreen(
          saveData: game.saveData,
          onContinue: () {
            game.hideAllScreens();
            game.continueGame();
          },
          onNewGame: () {
            game.hideAllScreens();
            game.startNewGame();
          },
        ),
        'pause': (context, game) => PauseScreen(
          onResume: () {
            game.hideAllScreens();
            game.resumeGame();
          },
          onQuit: () {
            game.hideAllScreens();
            game.quitToMenu();
          },
        ),
        'gameOver': (context, game) => GameOverScreen(
          finalWave: game.currentWave,
          totalKills: game.totalKills,
          moneyEarned: game.moneyThisRun,
          onRestart: () {
            game.hideAllScreens();
            game.restartGame();
          },
          onQuit: () {
            game.hideAllScreens();
            game.quitToMenu();
          },
        ),
      },
    ),
  );
}
```

### Step 7: Add Screen Transitions
Implement smooth transitions between screens:

```dart
class ScreenTransition {
  double opacity = 0.0;
  bool isTransitioning = false;
  
  void fadeIn(Duration duration, VoidCallback onComplete) {
    isTransitioning = true;
    
    // Animate opacity from 0 to 1
    Timer.periodic(Duration(milliseconds: 16), (timer) {
      opacity += 16 / duration.inMilliseconds;
      
      if (opacity >= 1.0) {
        opacity = 1.0;
        isTransitioning = false;
        timer.cancel();
        onComplete();
      }
    });
  }
  
  void fadeOut(Duration duration, VoidCallback onComplete) {
    isTransitioning = true;
    
    // Animate opacity from 1 to 0
    Timer.periodic(Duration(milliseconds: 16), (timer) {
      opacity -= 16 / duration.inMilliseconds;
      
      if (opacity <= 0.0) {
        opacity = 0.0;
        isTransitioning = false;
        timer.cancel();
        onComplete();
      }
    });
  }
}
```

### Step 8: Add Button Animations
Enhance buttons with hover/press effects:

```dart
class AnimatedGameButton extends StatefulWidget {
  final String text;
  final VoidCallback onPressed;
  final Color color;
  
  @override
  _AnimatedGameButtonState createState() => _AnimatedGameButtonState();
}

class _AnimatedGameButtonState extends State<AnimatedGameButton> {
  double scale = 1.0;
  
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => setState(() => scale = 0.95),
      onTapUp: (_) => setState(() => scale = 1.0),
      onTapCancel: () => setState(() => scale = 1.0),
      onTap: widget.onPressed,
      child: Transform.scale(
        scale: scale,
        child: Container(
          padding: EdgeInsets.symmetric(
            horizontal: 50,
            vertical: 15,
          ),
          decoration: BoxDecoration(
            color: widget.color,
            borderRadius: BorderRadius.circular(10),
            boxShadow: [
              BoxShadow(
                color: widget.color.withOpacity(0.5),
                blurRadius: 10,
                spreadRadius: 2,
              ),
            ],
          ),
          child: Text(
            widget.text,
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.black,
            ),
          ),
        ),
      ),
    );
  }
}
```

### Step 9: Add Sound Effects
Add sound effects for menu interactions:

```dart
class MenuSounds {
  static void playButtonClick() {
    // Play click sound
    FlameAudio.play('button_click.mp3');
  }
  
  static void playMenuOpen() {
    // Play menu open sound
    FlameAudio.play('menu_open.mp3');
  }
  
  static void playMenuClose() {
    // Play menu close sound
    FlameAudio.play('menu_close.mp3');
  }
  
  static void playGameOver() {
    // Play game over sound
    FlameAudio.play('game_over.mp3');
  }
}
```

### Step 10: Add Confirmation Dialogs
Add confirmation for destructive actions:

```dart
Future<bool> showConfirmDialog(
  BuildContext context,
  String title,
  String message,
) async {
  return await showDialog<bool>(
    context: context,
    builder: (context) => AlertDialog(
      backgroundColor: Color(0xFF000033),
      title: Text(
        title,
        style: TextStyle(color: Colors.white),
      ),
      content: Text(
        message,
        style: TextStyle(color: Colors.white70),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context, false),
          child: Text('Cancel'),
        ),
        ElevatedButton(
          onPressed: () => Navigator.pop(context, true),
          child: Text('Confirm'),
        ),
      ],
    ),
  ) ?? false;
}

// Usage:
onQuit: () async {
  final confirmed = await showConfirmDialog(
    context,
    'Quit Game?',
    'Your progress will be saved.',
  );
  
  if (confirmed) {
    game.quitToMenu();
  }
}
```

## Success Criteria
- [ ] Start screen displays for new players
- [ ] WelcomeBack screen shows previous stats
- [ ] Pause screen accessible during gameplay
- [ ] GameOver screen shows final statistics
- [ ] All buttons functional and responsive
- [ ] Screen transitions smooth
- [ ] Button animations provide feedback
- [ ] Sound effects play on interactions
- [ ] Confirmation dialogs prevent accidents
- [ ] All screens match game theme

## Testing
Test all menu screens:
1. Start new game → Start screen appears
2. Click Play → Game starts
3. Pause game → Pause screen appears
4. Resume → Game continues
5. Die → GameOver screen appears
6. Restart → New game starts
7. Close app, reopen → WelcomeBack screen
8. Test all button interactions
9. Verify stats display correctly
10. Test screen transitions
11. Verify sound effects play

Test on different screen sizes.

## Next Steps
In Story 28, we'll apply final polish including performance optimization, bug fixes, audio implementation, and overall game feel improvements.

## Notes

**Common Pitfalls:**
- Buttons too small for touch
- Text too small to read
- No feedback on button press
- Screens don't match theme
- Missing confirmation dialogs

**Flutter/Flame Tips:**
- Use overlays for menu screens
- Test on various screen sizes
- Ensure touch targets are 44x44 minimum
- Use consistent styling
- Profile UI rendering

**Performance Considerations:**
- Menu screens are lightweight
- Transitions should be smooth
- No performance concerns
- Profile if complex animations added

**Reference to Original:**
The React version had Start, WelcomeBack, Pause, and GameOver screens with stats display. We're implementing similar screens with Flutter's UI capabilities.

**UI Design Principles:**
- **Clarity**: Information easy to read
- **Consistency**: Matching visual style
- **Feedback**: Button interactions obvious
- **Accessibility**: Large touch targets
- **Polish**: Smooth animations

**Color Scheme:**
- Primary: Cyan (#00FFFF)
- Secondary: Dark Blue (#000033)
- Accent: White (#FFFFFF)
- Danger: Red (#FF0000)
- Background: Gradient blues

**Future Enhancements:**
- Settings screen (audio, graphics)
- Achievements screen
- Leaderboards
- Statistics screen (detailed stats)
- Credits screen
- Social sharing
- Daily challenges
- Season pass/battle pass