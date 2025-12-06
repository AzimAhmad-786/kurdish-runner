/**
 * CompleteScene - Level Complete Screen
 * 
 * Displayed when the player successfully collects all required items.
 * Shows celebration and option to play again.
 */

class CompleteScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CompleteScene' });
    }

    create() {
        const { width, height } = this.cameras.main;
        
        // Background with gradient effect
        const bg = this.add.rectangle(0, 0, width, height, 0x1a1a1a, 0.95).setOrigin(0);
        
        // Main title
        const title = this.add.text(
            width / 2,
            height / 3,
            'Level Complete!',
            {
                fontSize: '64px',
                fill: '#FFD700',
                fontFamily: 'Arial',
                fontStyle: 'bold',
                stroke: '#000',
                strokeThickness: 6
            }
        ).setOrigin(0.5);

        // Animate title
        title.setScale(0);
        this.tweens.add({
            targets: title,
            scale: 1,
            duration: 500,
            ease: 'Back.easeOut'
        });

        // Success message
        const message = this.add.text(
            width / 2,
            height / 2,
            'You collected all target letters!',
            {
                fontSize: '24px',
                fill: '#fff',
                fontFamily: 'Arial'
            }
        ).setOrigin(0.5);

        message.setAlpha(0);
        this.tweens.add({
            targets: message,
            alpha: 1,
            duration: 500,
            delay: 300
        });

        // Display collected items
        this.displayCollectedItems(width / 2, height / 2 + 60);

        // Play again button
        const playAgainBtn = this.add.text(
            width / 2,
            height - 100,
            'Play Again',
            {
                fontSize: '32px',
                fill: '#fff',
                fontFamily: 'Arial',
                backgroundColor: '#4A90E2',
                padding: { x: 30, y: 15 }
            }
        ).setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        // Button animations
        playAgainBtn.on('pointerover', () => {
            playAgainBtn.setScale(1.1);
        });

        playAgainBtn.on('pointerout', () => {
            playAgainBtn.setScale(1);
        });

        playAgainBtn.on('pointerdown', () => {
            this.restartGame();
        });

        // Particle celebration effect
        this.createCelebrationParticles();
    }

    displayCollectedItems(x, y) {
        const progress = this.registry.get('collectionProgress');
        
        let xOffset = -80;
        Object.entries(progress).forEach(([character, data]) => {
            const item = this.add.text(
                x + xOffset,
                y,
                `${data.current}/${data.required} ${character}`,
                {
                    fontSize: '28px',
                    fill: data.color,
                    fontFamily: 'Arial',
                    fontStyle: 'bold'
                }
            ).setOrigin(0.5);

            // Checkmark
            const check = this.add.text(
                x + xOffset + 60,
                y,
                '✓',
                {
                    fontSize: '32px',
                    fill: '#00FF00',
                    fontFamily: 'Arial'
                }
            ).setOrigin(0.5);

            xOffset += 160;
        });
    }

    createCelebrationParticles() {
        const { width, height } = this.cameras.main;
        
        // Create simple particle effect
        for (let i = 0; i < 30; i++) {
            const x = Phaser.Math.Between(0, width);
            const y = Phaser.Math.Between(-50, height);
            
            const particle = this.add.circle(x, y, 4, Phaser.Display.Color.GetColor(
                Phaser.Math.Between(150, 255),
                Phaser.Math.Between(150, 255),
                Phaser.Math.Between(0, 100)
            ));

            this.tweens.add({
                targets: particle,
                y: height + 50,
                alpha: { from: 1, to: 0 },
                duration: Phaser.Math.Between(2000, 4000),
                delay: Phaser.Math.Between(0, 1000)
            });
        }
    }

    restartGame() {
        // Reset collection progress
        const progress = this.registry.get('collectionProgress');
        Object.keys(progress).forEach(character => {
            progress[character].current = 0;
            progress[character].completed = false;
        });
        this.registry.set('collectionProgress', progress);
        
        // Restart game
        this.scene.start('GameScene');
        this.scene.launch('UIScene');
    }
}

