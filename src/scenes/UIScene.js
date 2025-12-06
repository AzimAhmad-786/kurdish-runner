/**
 * UIScene - Heads-Up Display (HUD)
 * 
 * This scene runs in parallel with GameScene and displays:
 * - Collection progress counters
 * - Game title
 * - Any other UI elements
 * 
 * It listens to events from the EventBus to update the UI.
 */

class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene' });
        this.counters = {};
    }

    create() {
        this.createUI();
        this.setupEventListeners();
    }

    createUI() {
        const { width, height } = this.cameras.main;

        // Game Title (top right) - matching reference style
        this.add.text(width - 20, 20, 'Kurdish Runner', {
            fontSize: '36px',
            fill: '#000000',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            stroke: '#FFFFFF',
            strokeThickness: 3
        }).setOrigin(1, 0);

        // Collection Progress Container (top left)
        this.createCollectionCounters();

        // "Collect Targets" label (matching reference style)
        const labelBg = this.add.rectangle(20, 140, 150, 30, 0x666666, 0.9)
            .setOrigin(0, 0);
        this.add.text(95, 155, 'Collect Targets', {
            fontSize: '18px',
            fill: '#fff',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 1
        }).setOrigin(0.5);
    }

    createCollectionCounters() {
        const startX = 20;
        const startY = 20;
        const spacing = 50;
        
        const progress = this.registry.get('collectionProgress');
        
        let yOffset = 0;
        Object.entries(progress).forEach(([character, data], index) => {
            const y = startY + yOffset;
            
            // Background box with colored background (matching reference)
            const bgColor = Phaser.Display.Color.HexStringToColor(data.color).color;
            const bg = this.add.rectangle(startX, y, 150, 45, bgColor, 0.85)
                .setOrigin(0, 0);
            
            // Add subtle border
            const border = this.add.rectangle(startX, y, 150, 45, 0xFFFFFF, 0.3)
                .setOrigin(0, 0)
                .setStrokeStyle(2, 0xFFFFFF, 0.5);

            // Character (larger, more prominent)
            const charText = this.add.text(
                startX + 25,
                y + 22,
                character,
                {
                    fontSize: '28px',
                    fill: '#FFFFFF',
                    fontFamily: 'Arial',
                    fontStyle: 'bold',
                    stroke: '#000000',
                    strokeThickness: 2
                }
            ).setOrigin(0.5);

            // Progress text (format: "1/4" or "3/4")
            const progressText = this.add.text(
                startX + 100,
                y + 22,
                `${data.current}/${data.required}`,
                {
                    fontSize: '22px',
                    fill: '#FFFFFF',
                    fontFamily: 'Arial',
                    fontStyle: 'bold',
                    stroke: '#000000',
                    strokeThickness: 2
                }
            ).setOrigin(0.5);

            // Store references
            this.counters[character] = {
                background: bg,
                border: border,
                charText: charText,
                progressText: progressText,
                data: data
            };

            yOffset += spacing;
        });
    }

    setupEventListeners() {
        // Listen for collection events
        window.EventBus.on(window.GameEvents.ITEM_COLLECTED, this.onItemCollected, this);
        window.EventBus.on(window.GameEvents.COUNTER_COMPLETE, this.onCounterComplete, this);
    }

    /**
     * Handle item collection event
     * @param {Object} data - { character: string }
     */
    onItemCollected(data) {
        const { character } = data;
        const progress = this.registry.get('collectionProgress');
        
        if (progress[character]) {
            // Only count if not already completed (don't go over required amount)
            if (progress[character].current >= progress[character].required) {
                // Already completed - ignore additional collections
                return;
            }
            
            // Update progress
            progress[character].current++;
            
            // Check if completed
            if (progress[character].current >= progress[character].required) {
                progress[character].completed = true;
                window.EventBus.emit(window.GameEvents.COUNTER_COMPLETE, { character });
            }
            
            // Update registry
            this.registry.set('collectionProgress', progress);
            
            // Update UI
            this.updateCounter(character, progress[character]);
            
            // Check if all targets are collected
            this.checkLevelComplete();
        }
    }

    /**
     * Update a specific counter in the UI
     */
    updateCounter(character, data) {
        const counter = this.counters[character];
        if (counter) {
            // Update progress text
            counter.progressText.setText(`${data.current}/${data.required}`);
            
            // Pulse animation on both text elements
            this.tweens.add({
                targets: [counter.charText, counter.progressText],
                scale: { from: 1.2, to: 1 },
                duration: 200,
                ease: 'Back.easeOut'
            });
        }
    }

    /**
     * Handle counter completion
     */
    onCounterComplete(data) {
        const { character } = data;
        const counter = this.counters[character];
        
        if (counter) {
            // Change background to bright green (completion color)
            counter.background.setFillStyle(0x7ED321, 0.95);
            
            // Add a celebratory pulse
            this.tweens.add({
                targets: [counter.background, counter.charText, counter.progressText],
                scale: { from: 1.1, to: 1 },
                duration: 300,
                ease: 'Bounce.easeOut'
            });
        }
    }

    /**
     * Check if all collection targets are met
     */
    checkLevelComplete() {
        const progress = this.registry.get('collectionProgress');
        const allComplete = Object.values(progress).every(p => p.completed);
        
        if (allComplete) {
            // Emit level complete event
            window.EventBus.emit(window.GameEvents.LEVEL_COMPLETE);
        }
    }

    shutdown() {
        // Clean up event listeners when scene shuts down
        window.EventBus.off(window.GameEvents.ITEM_COLLECTED, this.onItemCollected, this);
        window.EventBus.off(window.GameEvents.COUNTER_COMPLETE, this.onCounterComplete, this);
    }
}

