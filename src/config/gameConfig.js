/**
 * Game Configuration File
 * 
 * This file contains all configurable game parameters.
 * Modify values here to change game behavior without touching game logic.
 */

const GameConfig = {
    // Collection targets - what the player needs to collect to win
    collectibles: {
        targets: [
            { character: 'و', required: 4, color: '#4A90E2' },
            { character: 'م', required: 4, color: '#7ED321' }
        ]
    },

    // Distractor pool - characters that appear but don't count toward goals
    distractors: [
        { character: 'ه', color: '#E74C3C' },
        { character: 'ع', color: '#E74C3C' },
        { character: 'ز', color: '#E74C3C' },
        { character: 'ب', color: '#E74C3C' },
        { character: 'ن', color: '#E74C3C' }
    ],

    // Gameplay parameters
    gameplay: {
        playerSpeed: 300,           // Base player movement speed
        backgroundScrollSpeed: 100, // How fast the ground scrolls
        laneCount: 3,               // Number of lanes (left, center, right)
        laneWidth: 150,             // Width of each lane in pixels
        switchLaneSpeed: 200,       // Speed of lane switching
    },

    // Spawning system configuration
    spawning: {
        spawnInterval: 1500,        // Milliseconds between spawns
        spawnDistanceAhead: 600,    // Distance ahead of player to spawn items
        targetProbability: 0.6,     // 60% chance to spawn a target item
        obstacleProbability: 0.2,   // 20% chance to spawn an obstacle
        // Remaining 20% spawns a distractor
    },

    // Obstacle configuration
    obstacles: {
        enabled: true,
        types: ['bomb'],            // Types of obstacles
        damageOnHit: false,         // For now, obstacles just slow you down
        slowdownFactor: 0.5,        // Slowdown multiplier on collision
        slowdownDuration: 1000      // How long the slowdown lasts (ms)
    },

    // Visual/UI configuration
    ui: {
        fontSize: 24,
        fontFamily: 'Arial',
        counterBackgroundColor: 0x444444,
        counterBackgroundAlpha: 0.8,
        completedCounterColor: '#00FF00',
        progressCounterColor: '#FFFFFF'
    },

    // Game world configuration
    world: {
        width: 800,
        height: 600,
        gravity: 0                  // No gravity for runner-style game
    }
};

// Make it available globally
window.GameConfig = GameConfig;

