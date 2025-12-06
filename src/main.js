/**
 * Main Game Entry Point
 * 
 * This file initializes the Phaser game instance with all configurations.
 */

// Phaser game configuration
const config = {
    type: Phaser.AUTO,
    width: GameConfig.world.width,
    height: GameConfig.world.height,
    parent: 'game-container',
    backgroundColor: '#D4A574',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false // Set to true to see collision boxes
        }
    },
    scene: [
        BootScene,
        GameScene,
        UIScene,
        CompleteScene
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

// Initialize the game
const game = new Phaser.Game(config);

// Log game info
console.log('Kurdish Runner - Phaser 3 Game');
console.log('Game Configuration:', GameConfig);

