# Kurdish Runner - Phaser 3 Game

An endless runner game built with Phaser 3 where players collect target letters while avoiding obstacles.

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher) - Download from https://nodejs.org/
- npm (comes with Node.js)

### Installation

1. Navigate to the project directory:
   ```bash
   cd path/to/project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:3000`)

The game should now be running in your browser.

### Alternative: Run Without Server

You can also open `index.html` directly in your browser, though some features may be limited.

## Game Overview

Kurdish Runner is an endless runner game where you control a character moving through lanes. Your goal is to collect target letters (و and م) while avoiding obstacles and ignoring distractor letters.

### Controls

- Arrow Keys: Left/Right to switch lanes
- Touch/Mouse: Tap left/right side of screen to switch lanes

### Objective

Collect 4 of each target letter:
- 4x و (blue)
- 4x م (green)

### Game Rules

- **Target Items**: Blue and green glowing letters that count toward your goal
- **Distractor Items**: Red letters that should be ignored
- **Obstacles**: Bombs that create visual feedback on collision
- **Win**: Collect all required items to complete the level

## Project Structure

```
kurdish-runner/
├── index.html          # Entry point
├── package.json        # Dependencies
├── README.md           # This file
└── src/
    ├── main.js         # Game initialization
    ├── config/
    │   └── gameConfig.js    # Game configuration
    ├── systems/
    │   └── EventBus.js      # Event system
    └── scenes/
        ├── BootScene.js     # Loading scene
        ├── GameScene.js     # Main gameplay
        ├── UIScene.js       # UI overlay
        └── CompleteScene.js # Victory screen
```

## Configuration

Game parameters can be modified in `src/config/gameConfig.js`:

- Target letters and quantities
- Distractor letters
- Spawn rates and probabilities
- Movement speeds
- Lane configuration

## Technologies Used

- Phaser 3.70.0 - Game framework
- JavaScript (ES6+)
- HTML5 Canvas
- Node.js - Development server

## Troubleshooting

**Game doesn't load:**
- Check browser console (F12) for errors
- Make sure all files are in correct locations
- Verify internet connection (Phaser loads from CDN)

**Server won't start:**
- Check Node.js is installed: `node --version`
- Try deleting `node_modules` and running `npm install` again

**Items not spawning:**
- Check `spawnInterval` in `gameConfig.js`
- Verify probabilities in config file
