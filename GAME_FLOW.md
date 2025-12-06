# Game Flow Diagram - Kurdish Runner

This document visualizes the complete game flow, from startup to completion.

## 🎮 High-Level Game Flow

```
┌─────────────┐
│   Browser   │
│   Opens     │
│  index.html │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────┐
│         Load Scripts in Order           │
├─────────────────────────────────────────┤
│ 1. Phaser 3 (CDN)                      │
│ 2. gameConfig.js                        │
│ 3. EventBus.js                          │
│ 4. BootScene.js                         │
│ 5. UIScene.js                           │
│ 6. GameScene.js                         │
│ 7. CompleteScene.js                     │
│ 8. main.js (starts game)                │
└──────────────┬──────────────────────────┘
               │
               ▼
        ┌─────────────┐
        │  BootScene  │
        │  (Loading)  │
        └──────┬──────┘
               │
               ▼
        ┌─────────────┐
        │  GameScene  │◄────────┐
        │  (Playing)  │         │
        └──────┬──────┘         │
               │                │
               ║ (parallel)     │
               ▼                │
        ┌─────────────┐         │
        │  UIScene    │         │
        │  (HUD)      │         │
        └──────┬──────┘         │
               │                │
               ▼                │
        ┌─────────────┐         │
        │ Complete    │         │
        │ Scene       │─────────┘
        │ (Victory)   │  "Play Again"
        └─────────────┘
```

## 📋 Detailed Scene Flow

### 1. BootScene Flow

```
START BootScene
    │
    ├─► Create loading screen
    │   └─► Show "Loading Kurdish Runner..."
    │
    ├─► Initialize collection progress
    │   └─► Read GameConfig.collectibles.targets
    │       └─► Create progress object
    │           └─► { 'و': {current: 0, required: 4}, ... }
    │
    ├─► Store in registry
    │   └─► registry.set('collectionProgress', progress)
    │
    └─► Transition to game
        ├─► scene.start('GameScene')
        └─► scene.launch('UIScene')
```

### 2. GameScene Flow

```
START GameScene
    │
    ├─► Setup World
    │   ├─► Calculate lane positions
    │   └─► Configure physics
    │
    ├─► Create Background
    │   ├─► Desert background
    │   ├─► Scrolling ground lines
    │   └─► Decorative rocks/dunes
    │
    ├─► Create Player
    │   ├─► Position in center lane
    │   └─► Enable physics
    │
    ├─► Setup Controls
    │   ├─► Keyboard (arrow keys)
    │   └─► Touch/Mouse (tap sides)
    │
    ├─► Start Spawning Timer
    │   └─► Every 1.5 seconds → spawnItem()
    │
    └─► Enter Update Loop
        ├─► Handle lane switching
        ├─► Scroll background
        ├─► Move items toward player
        └─► Clean up off-screen items
```

### 3. UIScene Flow

```
START UIScene (parallel with GameScene)
    │
    ├─► Create UI Elements
    │   ├─► Game title (top-right)
    │   ├─► Collection counters (top-left)
    │   └─► "Collect Targets" label
    │
    ├─► Setup Event Listeners
    │   ├─► Listen: ITEM_COLLECTED
    │   └─► Listen: COUNTER_COMPLETE
    │
    └─► Wait for Events
        │
        ├─► On ITEM_COLLECTED:
        │   ├─► Update counter
        │   ├─► Animate counter
        │   └─► Check if complete
        │
        ├─► On COUNTER_COMPLETE:
        │   ├─► Turn counter green
        │   └─► Pulse animation
        │
        └─► Check Win Condition:
            └─► If all complete → Emit LEVEL_COMPLETE
```

### 4. CompleteScene Flow

```
START CompleteScene
    │
    ├─► Create Victory Screen
    │   ├─► "Level Complete!" title
    │   ├─► Success message
    │   ├─► Display collected items
    │   └─► Celebration particles
    │
    ├─► Create "Play Again" Button
    │   └─► On click → restartGame()
    │
    └─► Wait for Input
        │
        └─► On "Play Again":
            ├─► Reset collection progress
            ├─► scene.start('GameScene')
            └─► scene.launch('UIScene')
```

## 🎯 Spawning System Flow

```
Every 1.5 seconds:
    │
    ▼
spawnItem()
    │
    ├─► Generate random number (0-1)
    │
    ├─► If < 0.6 (60%):
    │   └─► spawnTargetItem()
    │       ├─► Get incomplete targets from config
    │       ├─► Pick random incomplete target
    │       ├─► Choose random lane
    │       └─► Create glowing item
    │
    ├─► Else if < 0.8 (20%):
    │   └─► spawnObstacle()
    │       ├─► Choose random lane
    │       └─► Create bomb
    │
    └─► Else (20%):
        └─► spawnDistractorItem()
            ├─► Pick random distractor from config
            ├─► Choose random lane
            └─► Create red item
```

## 🎲 Collision Detection Flow

```
Player overlaps with Item:
    │
    ▼
handleItemCollision(player, item)
    │
    ├─► Read item metadata
    │   ├─► character = item.getData('character')
    │   └─► isTarget = item.getData('isTarget')
    │
    ├─► If isTarget:
    │   ├─► Emit ITEM_COLLECTED event
    │   │   └─► { character: 'و' }
    │   ├─► Animate item (scale + fade)
    │   └─► Destroy item
    │
    └─► Else (distractor):
        └─► Just destroy item
```

```
Player overlaps with Obstacle:
    │
    ▼
handleObstacleCollision(player, obstacle)
    │
    ├─► Emit OBSTACLE_HIT event
    ├─► Shake camera
    ├─► Flash player red
    └─► Destroy obstacle
```

## 📊 Collection Tracking Flow

```
ITEM_COLLECTED event emitted
    │
    ▼
UIScene.onItemCollected({ character })
    │
    ├─► Get collection progress from registry
    │
    ├─► Increment counter
    │   └─► progress[character].current++
    │
    ├─► Check if complete
    │   └─► If current >= required:
    │       ├─► Set completed = true
    │       └─► Emit COUNTER_COMPLETE
    │
    ├─► Update registry
    │   └─► registry.set('collectionProgress', progress)
    │
    ├─► Update UI counter text
    │   └─► "و : 3/4"
    │
    └─► Check win condition
        └─► If all targets completed:
            └─► Emit LEVEL_COMPLETE
```

## 🏆 Win Condition Flow

```
checkLevelComplete()
    │
    ├─► Get collection progress
    │
    ├─► Check each target
    │   └─► For each target:
    │       └─► Is completed = true?
    │
    ├─► If ALL completed:
    │   └─► Emit LEVEL_COMPLETE
    │
    └─► GameScene receives event:
        ├─► Stop spawning
        ├─► Set isGameActive = false
        └─► After 1 second:
            ├─► scene.start('CompleteScene')
            └─► scene.stop('UIScene')
```

## 🔄 Event Flow Diagram

```
┌─────────────┐
│  GameScene  │
└──────┬──────┘
       │
       │ Player collects target
       │
       ▼
┌─────────────────────────────────┐
│  EventBus.emit(ITEM_COLLECTED)  │
└─────────────┬───────────────────┘
              │
              ▼
       ┌─────────────┐
       │   UIScene   │
       └──────┬──────┘
              │
              │ Update counter
              │
              ▼
       ┌─────────────────────────┐
       │ Check if counter full   │
       └──────┬──────────────────┘
              │
              │ If full
              ▼
┌──────────────────────────────────┐
│ EventBus.emit(COUNTER_COMPLETE)  │
└──────┬───────────────────────────┘
       │
       ▼
┌─────────────┐
│   UIScene   │
└──────┬──────┘
       │
       │ Turn counter green
       │
       ▼
┌─────────────────────┐
│ Check win condition │
└──────┬──────────────┘
       │
       │ If all complete
       ▼
┌──────────────────────────────────┐
│ EventBus.emit(LEVEL_COMPLETE)    │
└──────┬───────────────────────────┘
       │
       ▼
┌─────────────┐
│  GameScene  │
└──────┬──────┘
       │
       │ Stop game
       │
       ▼
┌─────────────────┐
│ CompleteScene   │
└─────────────────┘
```

## 🎨 Update Loop Flow (60 FPS)

```
Every frame (~16ms):
    │
    ├─► GameScene.update()
    │   │
    │   ├─► If game not active → return
    │   │
    │   ├─► Handle lane input
    │   │   ├─► Check keyboard
    │   │   └─► If arrow pressed:
    │   │       └─► Tween player to new lane
    │   │
    │   ├─► Scroll background
    │   │   ├─► Move ground lines down
    │   │   └─► Move rocks down
    │   │
    │   ├─► Update items
    │   │   ├─► Move all items down
    │   │   └─► (Physics handles collision)
    │   │
    │   └─► Clean up items
    │       └─► Destroy off-screen items
    │
    └─► Phaser renders frame
```

## 🎯 Configuration Impact Flow

```
gameConfig.js
    │
    ├─► collectibles.targets
    │   ├─► BootScene: Initialize progress
    │   ├─► UIScene: Create counters
    │   └─► GameScene: Spawn targets
    │
    ├─► distractors
    │   └─► GameScene: Spawn distractors
    │
    ├─► gameplay
    │   ├─► playerSpeed → Item movement speed
    │   ├─► laneCount → Lane positions
    │   └─► laneWidth → Lane spacing
    │
    ├─► spawning
    │   ├─► spawnInterval → Timer delay
    │   ├─► targetProbability → Spawn chance
    │   └─► obstacleProbability → Spawn chance
    │
    └─► ui
        ├─► fontSize → Text size
        └─► colors → UI colors
```

## 🔄 Complete Game Cycle

```
1. Game Starts
   └─► BootScene initializes

2. Gameplay Begins
   ├─► GameScene spawns items
   ├─► UIScene shows counters
   └─► Player moves and collects

3. Collection Progress
   ├─► Counters update
   └─► Visual feedback

4. First Target Complete
   └─► Counter turns green

5. Second Target Complete
   └─► Counter turns green

6. Win Condition Met
   └─► Transition to victory

7. Victory Screen
   └─► Show celebration

8. Player Clicks "Play Again"
   └─► Return to step 2
```

## 📱 Input Flow

```
User Input
    │
    ├─► Keyboard
    │   ├─► LEFT arrow pressed
    │   │   └─► cursors.left.isDown
    │   │       └─► switchLane(-1)
    │   │
    │   └─► RIGHT arrow pressed
    │       └─► cursors.right.isDown
    │           └─► switchLane(1)
    │
    └─► Touch/Mouse
        ├─► Click left side
        │   └─► pointer.x < centerX
        │       └─► switchLane(-1)
        │
        └─► Click right side
            └─► pointer.x > centerX
                └─► switchLane(1)

switchLane(direction)
    │
    ├─► Calculate new lane
    │   └─► newLane = currentLane + direction
    │
    ├─► Clamp to bounds (0-2)
    │
    └─► Tween player to new position
        └─► Duration: 150ms
```

## 🎬 Animation Timeline

```
Item Collection:
0ms    │ Item exists
       │
100ms  │ Player touches item
       │ ├─► Event emitted
       │ └─► Item starts scaling + fading
       │
200ms  │ Item fully scaled/faded
       │ └─► Item destroyed
       │
300ms  │ Counter animates
       │ └─► Scale 1.2 → 1.0
       │
500ms  │ Animation complete

Counter Completion:
0ms    │ Counter reaches goal
       │
100ms  │ Background turns green
       │
400ms  │ Bounce animation complete

Level Complete:
0ms    │ Last item collected
       │
100ms  │ Win condition detected
       │
1000ms │ Transition starts
       │
1500ms │ CompleteScene appears
```

## 🎮 State Diagram

```
┌─────────┐
│ LOADING │
└────┬────┘
     │
     ▼
┌─────────┐
│ PLAYING │◄─────┐
└────┬────┘      │
     │           │
     │ All       │
     │ collected │
     │           │
     ▼           │
┌──────────┐    │
│ COMPLETE │────┘
└──────────┘ Play Again
```

---

This flow diagram shows how all components work together to create the complete game experience. Each section can be traced through the actual code in the corresponding scene files.

