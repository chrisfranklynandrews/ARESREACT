# Story 25: Save/Load System (Persistent Progress)

## Objective
Implement a save/load system using shared_preferences to persist player progress, upgrades, statistics, and game state between sessions.

## Prerequisites
- Story 24 completed (background)
- Understanding of data persistence
- Knowledge of JSON serialization

## Concepts Covered
- SharedPreferences for local storage
- Data serialization/deserialization
- Save game architecture
- Auto-save functionality
- Data migration and versioning

## Implementation Steps

### Step 1: Understand Save System Requirements
The save system must persist:
- **Upgrades**: All 6 upgrade levels
- **Money**: Current money amount
- **Statistics**: Total kills, highest wave, total money earned
- **Settings**: Audio preferences, tutorial completion
- **Timestamps**: Last played, total play time

This enables the "WelcomeBack" state showing previous progress.

### Step 2: Add SharedPreferences Dependency
In `pubspec.yaml`, add shared_preferences:
```yaml
dependencies:
  shared_preferences: ^2.2.0
```

Run `flutter pub get` to install the package.

SharedPreferences provides simple key-value storage that persists across app sessions.

### Step 3: Create Save Data Model
Create `lib/data/save_data.dart` with a SaveData class:

```dart
class SaveData {
  // Upgrades
  int fireRateLevel = 0
  int bulletPowerLevel = 0
  int shipLevel = 0
  int interestLevel = 0
  int cashBoostLevel = 0
  int shieldLevel = 0
  
  // Currency
  int currentMoney = 0
  
  // Statistics
  int totalKills = 0
  int highestWave = 0
  int totalMoneyEarned = 0
  int gamesPlayed = 0
  
  // Settings
  bool tutorialCompleted = false
  bool soundEnabled = true
  bool musicEnabled = true
  
  // Timestamps
  DateTime lastPlayed
  int totalPlayTimeSeconds = 0
  
  // Version for data migration
  int saveVersion = 1
}
```

### Step 4: Implement Serialization
Add methods to convert SaveData to/from JSON:

```dart
class SaveData {
  // ... properties ...
  
  Map<String, dynamic> toJson() {
    return {
      'fireRateLevel': fireRateLevel,
      'bulletPowerLevel': bulletPowerLevel,
      'shipLevel': shipLevel,
      'interestLevel': interestLevel,
      'cashBoostLevel': cashBoostLevel,
      'shieldLevel': shieldLevel,
      'currentMoney': currentMoney,
      'totalKills': totalKills,
      'highestWave': highestWave,
      'totalMoneyEarned': totalMoneyEarned,
      'gamesPlayed': gamesPlayed,
      'tutorialCompleted': tutorialCompleted,
      'soundEnabled': soundEnabled,
      'musicEnabled': musicEnabled,
      'lastPlayed': lastPlayed.toIso8601String(),
      'totalPlayTimeSeconds': totalPlayTimeSeconds,
      'saveVersion': saveVersion,
    };
  }
  
  factory SaveData.fromJson(Map<String, dynamic> json) {
    return SaveData()
      ..fireRateLevel = json['fireRateLevel'] ?? 0
      ..bulletPowerLevel = json['bulletPowerLevel'] ?? 0
      ..shipLevel = json['shipLevel'] ?? 0
      ..interestLevel = json['interestLevel'] ?? 0
      ..cashBoostLevel = json['cashBoostLevel'] ?? 0
      ..shieldLevel = json['shieldLevel'] ?? 0
      ..currentMoney = json['currentMoney'] ?? 0
      ..totalKills = json['totalKills'] ?? 0
      ..highestWave = json['highestWave'] ?? 0
      ..totalMoneyEarned = json['totalMoneyEarned'] ?? 0
      ..gamesPlayed = json['gamesPlayed'] ?? 0
      ..tutorialCompleted = json['tutorialCompleted'] ?? false
      ..soundEnabled = json['soundEnabled'] ?? true
      ..musicEnabled = json['musicEnabled'] ?? true
      ..lastPlayed = DateTime.parse(json['lastPlayed'] ?? DateTime.now().toIso8601String())
      ..totalPlayTimeSeconds = json['totalPlayTimeSeconds'] ?? 0
      ..saveVersion = json['saveVersion'] ?? 1;
  }
}
```

### Step 5: Create Save Manager
Create `lib/data/save_manager.dart` to handle save/load operations:

```dart
class SaveManager {
  static const String SAVE_KEY = 'ares_save_data';
  
  Future<void> save(SaveData data) async {
    final prefs = await SharedPreferences.getInstance();
    
    // Update last played timestamp
    data.lastPlayed = DateTime.now();
    
    // Convert to JSON string
    final jsonString = jsonEncode(data.toJson());
    
    // Save to SharedPreferences
    await prefs.setString(SAVE_KEY, jsonString);
  }
  
  Future<SaveData?> load() async {
    final prefs = await SharedPreferences.getInstance();
    
    // Get saved JSON string
    final jsonString = prefs.getString(SAVE_KEY);
    
    if (jsonString == null) {
      return null; // No save data exists
    }
    
    try {
      // Parse JSON and create SaveData
      final json = jsonDecode(jsonString);
      return SaveData.fromJson(json);
    } catch (e) {
      print('Error loading save data: $e');
      return null;
    }
  }
  
  Future<bool> hasSaveData() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.containsKey(SAVE_KEY);
  }
  
  Future<void> deleteSave() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(SAVE_KEY);
  }
}
```

### Step 6: Implement Auto-Save
Add auto-save functionality that saves periodically:

```dart
class AutoSaveManager {
  Timer? _autoSaveTimer;
  final SaveManager saveManager;
  final SaveData saveData;
  
  void startAutoSave({Duration interval = const Duration(seconds: 30)}) {
    _autoSaveTimer?.cancel();
    
    _autoSaveTimer = Timer.periodic(interval, (timer) {
      saveManager.save(saveData);
    });
  }
  
  void stopAutoSave() {
    _autoSaveTimer?.cancel();
    _autoSaveTimer = null;
  }
  
  Future<void> saveNow() async {
    await saveManager.save(saveData);
  }
}
```

Auto-save every 30 seconds prevents progress loss if app crashes.

### Step 7: Integrate with Game
Load save data on game start:

```dart
class AresGame extends FlameGame {
  SaveData saveData = SaveData();
  SaveManager saveManager = SaveManager();
  AutoSaveManager? autoSaveManager;
  
  @override
  Future<void> onLoad() async {
    // Try to load existing save
    final loadedData = await saveManager.load();
    
    if (loadedData != null) {
      saveData = loadedData;
      
      // Show WelcomeBack screen
      changeState(GameState.WelcomeBack);
      
      // Apply saved upgrades
      applyUpgrades(saveData);
    } else {
      // New game - show Start screen
      changeState(GameState.Start);
    }
    
    // Start auto-save
    autoSaveManager = AutoSaveManager(saveManager, saveData);
    autoSaveManager!.startAutoSave();
  }
  
  void applyUpgrades(SaveData data) {
    // Apply all saved upgrade levels
    upgradeManager.setLevel(UpgradeType.FireRate, data.fireRateLevel);
    upgradeManager.setLevel(UpgradeType.BulletPower, data.bulletPowerLevel);
    upgradeManager.setLevel(UpgradeType.ShipLevel, data.shipLevel);
    upgradeManager.setLevel(UpgradeType.Interest, data.interestLevel);
    upgradeManager.setLevel(UpgradeType.CashBoost, data.cashBoostLevel);
    upgradeManager.setLevel(UpgradeType.Shield, data.shieldLevel);
    
    // Set current money
    money = data.currentMoney;
  }
}
```

### Step 8: Update Save Data During Gameplay
Update save data as game progresses:

```dart
// When upgrade purchased
onUpgradePurchased(UpgradeType type) {
  switch (type) {
    case UpgradeType.FireRate:
      saveData.fireRateLevel++;
      break;
    case UpgradeType.BulletPower:
      saveData.bulletPowerLevel++;
      break;
    // ... other upgrades ...
  }
}

// When enemy killed
onEnemyKilled(int moneyReward) {
  saveData.totalKills++;
  saveData.currentMoney += moneyReward;
  saveData.totalMoneyEarned += moneyReward;
}

// When wave completed
onWaveCompleted(int waveNumber) {
  if (waveNumber > saveData.highestWave) {
    saveData.highestWave = waveNumber;
  }
}

// When game over
onGameOver() {
  saveData.gamesPlayed++;
  autoSaveManager.saveNow(); // Save immediately
}
```

### Step 9: Implement Data Migration
Handle save data version changes:

```dart
class SaveDataMigration {
  static SaveData migrate(SaveData data) {
    if (data.saveVersion < 2) {
      // Migrate from version 1 to 2
      data = migrateV1toV2(data);
    }
    
    if (data.saveVersion < 3) {
      // Migrate from version 2 to 3
      data = migrateV2toV3(data);
    }
    
    return data;
  }
  
  static SaveData migrateV1toV2(SaveData data) {
    // Example: Add new field with default value
    // data.newField = defaultValue;
    data.saveVersion = 2;
    return data;
  }
}
```

### Step 10: Add Save/Load UI Feedback
Show feedback when saving/loading:

```dart
// Show loading indicator
showLoadingIndicator() {
  // Display "Loading..." overlay
}

// Show save confirmation
showSaveConfirmation() {
  // Brief "Game Saved" message
  // Fade out after 2 seconds
}

// Handle load errors
showLoadError() {
  // Display "Failed to load save data"
  // Offer to start new game
}
```

## Success Criteria
- [ ] SharedPreferences dependency added
- [ ] SaveData model created with all necessary fields
- [ ] Serialization/deserialization implemented
- [ ] SaveManager handles save/load operations
- [ ] Auto-save runs every 30 seconds
- [ ] Save data loads on game start
- [ ] Upgrades persist between sessions
- [ ] Statistics track correctly
- [ ] WelcomeBack screen shows for returning players
- [ ] Data migration system in place

## Testing
Test the save/load system:
1. Start new game, make progress
2. Purchase upgrades
3. Kill enemies, advance waves
4. Close app completely
5. Reopen app
6. Verify upgrades are restored
7. Verify money is correct
8. Verify statistics are accurate
9. Verify WelcomeBack screen appears
10. Test with no save data (new player)
11. Test data corruption handling

Test on multiple devices and after app updates.

## Next Steps
In Story 26, we'll implement the tutorial system with 7 steps that teach new players the game mechanics progressively.

## Notes

**Common Pitfalls:**
- Not handling null/missing save data
- Forgetting to save on app close
- Not versioning save data (breaks on updates)
- Saving too frequently (performance)
- Not handling corrupted save data

**Flutter/Flame Tips:**
- Use `async/await` for SharedPreferences operations
- Handle exceptions when loading save data
- Test save/load on different platforms
- Consider using `flutter_secure_storage` for sensitive data
- Profile save operations if performance issues

**Performance Considerations:**
- SharedPreferences operations are async but fast
- Auto-save every 30s is reasonable
- JSON serialization is lightweight
- Don't save every frame (use auto-save)
- Profile if save operations cause stuttering

**Reference to Original:**
The React version used localStorage for persistence. Upgrades, money, and stats were saved. WelcomeBack screen showed for returning players. We're implementing the same with SharedPreferences.

**Save Data Size:**
```
Typical save data: ~1-2 KB
SharedPreferences limit: ~1 MB
Our data is well within limits
```

**Auto-Save Strategy:**
- Save every 30 seconds during gameplay
- Save immediately on game over
- Save immediately on app pause/close
- Don't save during tutorial (until completed)

**Data Validation:**
```dart
bool validateSaveData(SaveData data) {
  // Check for reasonable values
  if (data.currentMoney < 0) return false;
  if (data.fireRateLevel < 0 || data.fireRateLevel > 100) return false;
  // ... validate other fields ...
  return true;
}
```

**Future Enhancements:**
- Cloud save (sync across devices)
- Multiple save slots
- Save data export/import
- Save data backup
- Achievements system
- Leaderboards
- Save data encryption
- Save data compression