# Kurdish Runner - Phaser 3 Game Prototype

A configurable endless runner game built with Phaser 3, featuring collection-based gameplay mechanics where players collect target letters while avoiding obstacles and ignoring distractor letters.

---

## 🚀 Setup & Installation

### Prerequisites

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**

### Quick Start

1. **Navigate to the project directory:**
   ```bash
   cd path/to/your/project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   This will install:
   - Phaser 3 (v3.70.0)
   - Serve (development server)

3. **Start the local development server:**
   ```bash
   npm start
   ```
   or
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - The server will start on a port (typically `3000` or `64001`)
   - Navigate to the URL shown in the terminal (e.g., `http://localhost:3000`)
   - The game will load automatically

### Alternative: Run Without npm

If you prefer not to use a local server, you can open `index.html` directly in your browser, but some features may be limited due to browser security restrictions.

---

## 🎮 Game Overview

**Kurdish Runner** is an endless runner where players control a character who must collect specific target letters (و and م) while avoiding obstacles and ignoring distractor letters. The game demonstrates modular, data-driven game design principles.

### Project Status

- ✅ **Status:** Complete and Functional
- ✅ **Framework:** Phaser 3.70.0
- ✅ **Type:** Endless Runner / Collection Game
- ✅ **All Requirements:** Met

---

## ✨ Key Features

- **Configuration-Driven Design**: All game parameters (targets, distractors, spawn rates, etc.) are defined in a config file
- **Modular Architecture**: Clean separation of concerns with distinct scenes for Boot, Game, UI, and Completion
- **Event-Based Communication**: Scenes communicate through an EventBus system, avoiding tight coupling
- **Lane-Based Movement**: Player can switch between 3 lanes using keyboard or touch controls
- **Real-Time UI Updates**: Collection progress tracked and displayed with visual feedback
- **Win Condition**: Collect all required items to complete the level
- **Dynamic Spawning**: Probability-based item generation from config pools
- **Visual Feedback**: Glowing targets, animations, camera shake, and completion effects

---

## 🎯 Gameplay Mechanics

### Controls

- **Arrow Keys**: 
  - `←` Left Arrow - Move to left lane
  - `→` Right Arrow - Move to right lane
- **Touch/Mouse**: 
  - Tap/Click left side of screen - Move left
  - Tap/Click right side of screen - Move right

### Objective

Collect the required number of each target letter:
- **4x** the letter **و** (blue)
- **4x** the letter **م** (green)

### Rules

- **Target Items**: Glowing letters that count toward your goal
- **Distractor Items**: Red letters that should be ignored (they don't count)
- **Obstacles**: Bombs that create visual feedback on collision
- **Win Condition**: Collect all required items to see the "Level Complete" screen

### Game States

```
Loading → Playing → Complete → (Play Again → Playing)
```

---

## 📋 Game Flow

### High-Level Flow

```
Browser Opens index.html
    ↓
Load Scripts (Phaser → Config → Scenes → Main)
    ↓
BootScene (Initialize progress, load assets)
    ↓
GameScene (Main gameplay) ←→ UIScene (HUD - parallel)
    ↓
CompleteScene (Victory screen)
    ↓
Play Again (Restart loop)
```

### Detailed Flow

1. **BootScene**: Initializes collection progress from config, stores in registry
2. **GameScene**: 
   - Sets up world, lanes, player, background
   - Starts spawning items every 1.5 seconds
   - Handles collisions and movement
3. **UIScene** (runs parallel): 
   - Displays counters and progress
   - Listens for collection events
   - Updates UI in real-time
4. **CompleteScene**: Shows victory screen when all targets collected

### Spawning System

Every 1.5 seconds:
- **60% chance**: Spawn target item (و or م)
- **20% chance**: Spawn obstacle (bomb)
- **20% chance**: Spawn distractor (red letter)

### Collection & Win Condition

1. Player touches target item → Collision detected
2. Event emitted → UIScene updates counter
3. Counter reaches goal → Counter turns green
4. All targets complete → Level complete event
5. GameScene transitions to CompleteScene

---

## 📁 Project Structure

```
kurdish-runner/
├── index.html                    # Entry point with script loading
├── package.json                  # Dependencies and scripts
├── README.md                     # This file
├── PROJECT_SUMMARY.md            # Detailed project summary
├── GAME_FLOW.md                  # Complete game flow documentation
└── src/
    ├── main.js                   # Game initialization
    ├── config/
    │   └── gameConfig.js         # All game configuration
    ├── systems/
    │   └── EventBus.js           # Event communication system
    └── scenes/
        ├── BootScene.js          # Asset loading & initialization
        ├── GameScene.js          # Main gameplay logic
        ├── UIScene.js            # HUD overlay
        └── CompleteScene.js      # Win screen
```

**Total Code:** ~1,110 lines of clean, documented JavaScript

---

## ⚙️ Configuration

All game parameters can be modified in `src/config/gameConfig.js` **without changing any game logic code**.

### Collectible Targets

Define what items players need to collect:

```javascript
collectibles: {
    targets: [
        { character: 'و', required: 4, color: '#4A90E2' },
        { character: 'م', required: 4, color: '#7ED321' }
    ]
}
```

### Distractors

Define items that appear but don't count toward goals:

```javascript
distractors: [
    { character: 'ه', color: '#E74C3C' },
    { character: 'ع', color: '#E74C3C' }
]
```

### Gameplay Parameters

```javascript
gameplay: {
    playerSpeed: 300,              // Movement speed
    backgroundScrollSpeed: 100,    // Scroll rate
    laneCount: 3,                  // Number of lanes
    laneWidth: 150                 // Distance between lanes
}
```

### Spawning System

```javascript
spawning: {
    spawnInterval: 1500,           // ms between spawns
    targetProbability: 0.6,        // 60% chance for target
    obstacleProbability: 0.2       // 20% chance for obstacle
}
```

### Customization Examples

**Change collection goals:**
```javascript
collectibles: {
    targets: [
        { character: 'A', required: 5, color: '#FF0000' },
        { character: 'B', required: 2, color: '#00FF00' }
    ]
}
```

**Adjust difficulty:**
```javascript
gameplay: {
    playerSpeed: 400               // Faster movement
}

spawning: {
    spawnInterval: 1000,           // More frequent spawns
    targetProbability: 0.4,        // Fewer targets
    obstacleProbability: 0.3       // More obstacles
}
```

---

## 🏗️ Architecture Highlights

### 1. Modular Scene System

- **BootScene**: Handles asset loading and initialization
- **GameScene**: Core gameplay logic (spawning, collision, movement)
- **UIScene**: Separate HUD scene running in parallel
- **CompleteScene**: Victory screen with replay option

### 2. Event-Based Communication

Instead of direct scene coupling:

```javascript
// GameScene emits event
EventBus.emit(GameEvents.ITEM_COLLECTED, { character: 'و' });

// UIScene listens and updates
EventBus.on(GameEvents.ITEM_COLLECTED, this.onItemCollected, this);
```

**Benefits:**
- No tight coupling between scenes
- Easy to add new features
- Testable in isolation

### 3. Data-Driven Spawning

The spawning system reads from config to determine what to spawn:

```javascript
spawnTargetItem() {
    const progress = this.registry.get('collectionProgress');
    const incompleteTargets = GameConfig.collectibles.targets.filter(
        target => !progress[target.character].completed
    );
    // Spawn from incomplete targets only
}
```

### 4. Metadata Pattern

Items carry their own context:

```javascript
item.setData('character', 'و');
item.setData('isTarget', true);

// Handlers just read metadata
const isTarget = item.getData('isTarget');
```

---

## 🎨 Visual Design

### Color Scheme

- **Background:** Desert tan (#D4A574)
- **Target 1 (و):** Blue (#4A90E2)
- **Target 2 (م):** Green (#7ED321)
- **Distractors:** Red (#E74C3C)
- **Obstacles:** Black with orange sparks
- **UI:** Dark gray with white text

### Animations

- Item pulsing (targets only)
- Counter scaling on collection
- Completion bounce effect
- Camera shake on collision
- Celebration particles

---

## 🔧 Development Features

### Debug Mode

Enable collision box visualization in `src/main.js`:

```javascript
physics: {
    arcade: {
        debug: true  // Shows collision boundaries
    }
}
```

### Console Logging

The game logs configuration on startup. Check browser console (F12) for details.

### Technologies Used

- **Phaser 3.70.0** - Game framework (via CDN)
- **Arcade Physics** - Collision detection
- **JavaScript (ES6+)** - Modern syntax
- **HTML5 Canvas** - Rendering
- **Serve** - Development server

---

## 🧪 Testing

### Manual Testing Checklist

- [x] Game loads without errors
- [x] All scenes transition correctly
- [x] Items spawn at correct intervals
- [x] Collision detection works accurately
- [x] Counters update in real-time
- [x] Win condition triggers properly
- [x] Restart functionality works
- [x] Keyboard controls responsive
- [x] Touch controls responsive
- [x] Configuration changes take effect

### Browser Compatibility

Tested on:
- ✅ Chrome
- ✅ Firefox
- ✅ Edge

---

## 🔧 Troubleshooting

### Game doesn't load

- Check browser console (F12) for errors
- Ensure all files are in correct locations
- Verify Phaser CDN is accessible (check internet connection)
- Try clearing browser cache

### Server won't start

- Ensure Node.js is installed: `node --version`
- Try deleting `node_modules` folder and running `npm install` again
- Check if port is already in use (try a different port)

### Items not spawning

- Check `spawnInterval` in config (not too high, default is 1500ms)
- Verify `targetProbability` values sum to ≤ 1.0
- Check browser console for errors

### Collisions not working

- Enable debug mode to visualize collision boxes
- Check that item sizes match visual representations
- Verify physics groups are set up correctly

### Controls not responsive

- Check browser console for input errors
- Try refreshing the page
- On mobile, ensure touch events are enabled

---

## 📊 Technical Requirements Met

✅ **Phaser 3 Framework**: Built entirely with Phaser 3  
✅ **Modular Architecture**: Distinct scenes with clear responsibilities  
✅ **Configuration-Driven**: All parameters externalized to config file  
✅ **Event-Based Communication**: EventBus decouples scene interactions  
✅ **Spawning System**: Dynamic item generation from config pools  
✅ **Collision Detection**: Physics-based with metadata handling  
✅ **Real-Time UI**: Live counter updates with visual feedback  
✅ **Game States**: Start, gameplay, and win condition implemented  

---

## 🚀 Deployment

### Current Setup

- **Development Server:** Serve package
- **Port:** Auto-assigned (typically 3000 or 64001)
- **Hot Reload:** Manual (refresh browser)

### Production Deployment

The game can be deployed to:

- **Static hosting:** GitHub Pages, Netlify, Vercel
- **Web servers:** Apache, Nginx
- **CDN distribution**
- **Mobile app wrapper:** Cordova, Capacitor

### Deployment Steps

1. Copy all files to web server
2. Ensure Phaser CDN is accessible (or host Phaser locally)
3. No build step required (vanilla JS)
4. Works offline if Phaser is cached

---

## 🔮 Future Enhancements

### Easy Additions

- [ ] Sound effects (collect, obstacle, complete)
- [ ] Background music
- [ ] Particle effects on collection
- [ ] More obstacle types
- [ ] Power-ups

### Medium Complexity

- [ ] Multiple levels
- [ ] Progressive difficulty
- [ ] High score tracking
- [ ] Local storage persistence
- [ ] Pause menu

### Advanced Features

- [ ] Procedural level generation
- [ ] Multiplayer (race mode)
- [ ] Leaderboards (online)
- [ ] Achievement system
- [ ] Character customization

---

**Built with ❤️ using Phaser 3**

**Game URL:** http://localhost:3000 (or port shown in terminal after `npm start`)
