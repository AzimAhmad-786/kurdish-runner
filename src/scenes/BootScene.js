/**
 * BootScene - Asset Loading and Initialization
 * 
 * This scene is responsible for:
 * - Loading all game assets
 * - Showing a loading screen
 * - Transitioning to the game when ready
 */

class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Create loading bar
        this.createLoadingScreen();

        // Since we're using text-based items (Arabic/Kurdish letters), we don't need many image assets
        // We'll create most visuals procedurally using Phaser's graphics
        
        // Update loading bar
        this.load.on('progress', (value) => {
            this.loadingBar.clear();
            this.loadingBar.fillStyle(0x4A90E2, 1);
            this.loadingBar.fillRect(
                this.cameras.main.centerX - 150,
                this.cameras.main.centerY,
                300 * value,
                30
            );
        });

        this.load.on('complete', () => {
            this.loadingBar.destroy();
            this.loadingText.destroy();
        });
    }

    createLoadingScreen() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Background
        this.add.rectangle(0, 0, width, height, 0xD4A574).setOrigin(0);

        // Loading text
        this.loadingText = this.add.text(
            width / 2,
            height / 2 - 50,
            'Loading Kurdish Runner...',
            {
                fontSize: '28px',
                fill: '#fff',
                fontFamily: 'Arial',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);

        // Loading bar background
        const barWidth = 300;
        const barHeight = 30;
        this.add.rectangle(
            width / 2,
            height / 2,
            barWidth,
            barHeight,
            0x222222
        ).setOrigin(0.5);

        // Loading bar
        this.loadingBar = this.add.graphics();
    }

    create() {
        // Initialize game state
        this.registry.set('collectionProgress', this.initializeCollectionProgress());
        
        // Small delay before starting for smooth transition
        this.time.delayedCall(500, () => {
            // Start both GameScene and UIScene
            this.scene.start('GameScene');
            this.scene.launch('UIScene');
        });
    }

    /**
     * Initialize the collection progress tracking object
     */
    initializeCollectionProgress() {
        const progress = {};
        GameConfig.collectibles.targets.forEach(target => {
            progress[target.character] = {
                current: 0,
                required: target.required,
                completed: false,
                color: target.color
            };
        });
        return progress;
    }
}

