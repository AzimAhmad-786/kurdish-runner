/**
 * GameScene - Main Gameplay
 * 
 * This scene handles:
 * - Player movement and controls
 * - Item spawning system
 * - Collision detection
 * - Game world scrolling
 */

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        this.setupWorld();
        this.createBackground();
        this.createPlayer();
        this.setupControls();
        this.setupSpawning();
        this.setupCollisionGroups();
        this.setupEventListeners();
        
        // Start the game
        this.isGameActive = true;
    }

    setupWorld() {
        const { width, height } = GameConfig.world;
        this.physics.world.setBounds(0, 0, width, height);
        
        // Calculate lane positions
        const centerX = width / 2;
        const laneWidth = GameConfig.gameplay.laneWidth;
        this.lanes = [
            centerX - laneWidth,  // Left lane
            centerX,              // Center lane
            centerX + laneWidth   // Right lane
        ];
        this.currentLane = 1; // Start in center lane
    }

    createBackground() {
        const { width, height } = this.cameras.main;
        
        // Sky/desert background gradient effect
        const skyColor = 0xF4E4BC; // Light sandy sky
        const groundColor = 0xD4A574; // Desert sand
        
        // Create gradient-like effect with multiple rectangles
        for (let i = 0; i < height; i += 20) {
            const ratio = i / height;
            const color = Phaser.Display.Color.Interpolate.ColorWithColor(
                Phaser.Display.Color.ValueToColor(skyColor),
                Phaser.Display.Color.ValueToColor(groundColor),
                100,
                ratio * 100
            );
            this.add.rectangle(0, i, width, 20, Phaser.Display.Color.GetColor(color.r, color.g, color.b)).setOrigin(0);
        }
        
        // Create scrolling ground effect with texture
        this.groundLines = this.add.group();
        for (let i = 0; i < 15; i++) {
            const line = this.add.rectangle(
                width / 2,
                i * 40,
                width * 0.9,
                3,
                0x9B7E56,
                0.4
            );
            this.groundLines.add(line);
        }

        // Add some decorative rocks/dunes
        this.createEnvironmentDecor();
    }

    createEnvironmentDecor() {
        const { width, height } = this.cameras.main;
        
        // Background dunes (rolling sand dunes in the distance)
        this.dunes = this.add.group();
        for (let i = 0; i < 5; i++) {
            const x = Phaser.Math.Between(0, width);
            const y = height - 80 - (i * 30);
            const size = Phaser.Math.Between(120, 200);
            
            // Create more realistic dune shape
            const dune = this.add.ellipse(x, y, size, size * 0.5, 0xB89968, 0.6);
            dune.setData('scrollSpeed', GameConfig.gameplay.backgroundScrollSpeed * 0.3);
            this.dunes.add(dune);
        }

        // Foreground rocks
        this.rocks = this.add.group();
        for (let i = 0; i < 8; i++) {
            this.createRock();
        }
    }

    createRock() {
        const { width, height } = this.cameras.main;
        const x = Phaser.Math.Between(0, width);
        const y = Phaser.Math.Between(-200, -50);
        const size = Phaser.Math.Between(20, 40);
        
        const rock = this.add.polygon(x, y, [0, size, size * 0.8, 0, size * 1.5, size * 0.9], 0x8B7355);
        rock.setData('scrollSpeed', GameConfig.gameplay.backgroundScrollSpeed);
        this.rocks.add(rock);
    }

    createPlayer() {
        const { width, height } = this.cameras.main;
        const startY = height - 150;
        
        // Create player sprite (Kurdish runner character)
        this.player = this.add.container(this.lanes[this.currentLane], startY);
        
        // Kurdish traditional attire character
        // Head covering (turban-like)
        const headCovering = this.add.ellipse(0, -40, 28, 20, 0x8B4513);
        
        // Head
        const head = this.add.circle(0, -35, 12, 0xE6A87C);
        
        // Vest/upper body
        const vest = this.add.rectangle(0, -15, 35, 25, 0x654321);
        const vestPattern = this.add.rectangle(0, -15, 30, 20, 0x8B4513, 0.3);
        
        // Shirt (visible under vest)
        const shirt = this.add.rectangle(0, -5, 32, 15, 0xF5DEB3);
        
        // Traditional baggy pants
        const leftLeg = this.add.rectangle(-8, 15, 14, 35, 0x8B4513);
        const rightLeg = this.add.rectangle(8, 15, 14, 35, 0x8B4513);
        
        // Pants pattern/details
        const leftPattern = this.add.rectangle(-8, 15, 10, 30, 0x654321, 0.4);
        const rightPattern = this.add.rectangle(8, 15, 10, 30, 0x654321, 0.4);
        
        // Feet
        const leftFoot = this.add.ellipse(-8, 32, 12, 6, 0x2F1B14);
        const rightFoot = this.add.ellipse(8, 32, 12, 6, 0x2F1B14);
        
        // Arms (running position)
        const leftArm = this.add.rectangle(-15, -5, 8, 20, 0x8B4513);
        const rightArm = this.add.rectangle(15, -5, 8, 20, 0x8B4513);
        
        this.player.add([
            leftLeg, rightLeg, leftPattern, rightPattern,
            leftFoot, rightFoot,
            leftArm, rightArm,
            shirt, vest, vestPattern,
            headCovering, head
        ]);
        
        // Enable physics
        this.physics.add.existing(this.player);
        this.player.body.setSize(50, 80);
        this.player.body.setCollideWorldBounds(true);
    }

    setupControls() {
        // Keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Track key press to avoid continuous lane switching
        this.lastLaneSwitch = 0;
        this.laneSwitchCooldown = 300; // ms
        
        // Touch/mouse controls
        this.input.on('pointerdown', (pointer) => {
            const centerX = this.cameras.main.centerX;
            if (pointer.x < centerX) {
                this.switchLane(-1); // Move left
            } else {
                this.switchLane(1); // Move right
            }
        });
    }

    setupSpawning() {
        this.items = this.physics.add.group();
        this.obstacles = this.physics.add.group();
        
        // Start spawning timer
        this.spawnTimer = this.time.addEvent({
            delay: GameConfig.spawning.spawnInterval,
            callback: this.spawnItem,
            callbackScope: this,
            loop: true
        });
    }

    setupCollisionGroups() {
        // Collision between player and items
        this.physics.add.overlap(
            this.player,
            this.items,
            this.handleItemCollision,
            null,
            this
        );

        // Collision between player and obstacles
        this.physics.add.overlap(
            this.player,
            this.obstacles,
            this.handleObstacleCollision,
            null,
            this
        );
    }

    setupEventListeners() {
        window.EventBus.on(window.GameEvents.LEVEL_COMPLETE, this.onLevelComplete, this);
    }

    update(time, delta) {
        if (!this.isGameActive) return;

        // Handle lane switching
        this.handleLaneInput(time);

        // Scroll background elements
        this.scrollBackground(delta);

        // Move items toward player
        this.updateItems(delta);
        
        // Clean up off-screen items
        this.cleanupItems();
    }

    handleLaneInput(time) {
        if (time - this.lastLaneSwitch < this.laneSwitchCooldown) return;

        if (this.cursors.left.isDown) {
            this.switchLane(-1);
            this.lastLaneSwitch = time;
        } else if (this.cursors.right.isDown) {
            this.switchLane(1);
            this.lastLaneSwitch = time;
        }
    }

    switchLane(direction) {
        const newLane = Phaser.Math.Clamp(
            this.currentLane + direction,
            0,
            this.lanes.length - 1
        );

        if (newLane !== this.currentLane) {
            this.currentLane = newLane;
            
            // Smooth transition to new lane
            this.tweens.add({
                targets: this.player,
                x: this.lanes[this.currentLane],
                duration: 150,
                ease: 'Sine.easeInOut'
            });
        }
    }

    scrollBackground(delta) {
        const scrollSpeed = GameConfig.gameplay.backgroundScrollSpeed * (delta / 1000);
        
        // Scroll ground lines
        this.groundLines.children.entries.forEach(line => {
            line.y += scrollSpeed;
            if (line.y > this.cameras.main.height) {
                line.y = -20;
            }
        });

        // Scroll dunes (slower, parallax effect)
        if (this.dunes) {
            this.dunes.children.entries.forEach(dune => {
                const duneSpeed = dune.getData('scrollSpeed') * (delta / 1000);
                dune.y += duneSpeed;
                if (dune.y > this.cameras.main.height + 50) {
                    dune.y = -100;
                    dune.x = Phaser.Math.Between(0, this.cameras.main.width);
                }
            });
        }

        // Scroll rocks
        this.rocks.children.entries.forEach(rock => {
            rock.y += scrollSpeed * 0.5;
            if (rock.y > this.cameras.main.height + 50) {
                rock.y = -50;
                rock.x = Phaser.Math.Between(0, this.cameras.main.width);
            }
        });
    }

    updateItems(delta) {
        const speed = GameConfig.gameplay.playerSpeed * (delta / 1000);
        
        // Move items down (toward player)
        this.items.children.entries.forEach(item => {
            item.y += speed;
        });

        this.obstacles.children.entries.forEach(obstacle => {
            obstacle.y += speed;
        });
    }

    cleanupItems() {
        const screenHeight = this.cameras.main.height;
        
        // Remove items that have passed the player
        this.items.children.entries.forEach(item => {
            if (item.y > screenHeight + 50) {
                item.destroy();
            }
        });

        this.obstacles.children.entries.forEach(obstacle => {
            if (obstacle.y > screenHeight + 50) {
                obstacle.destroy();
            }
        });
    }

    spawnItem() {
        if (!this.isGameActive) return;

        const rand = Math.random();
        
        if (rand < GameConfig.spawning.targetProbability) {
            // Spawn a target item
            this.spawnTargetItem();
        } else if (rand < GameConfig.spawning.targetProbability + GameConfig.spawning.obstacleProbability) {
            // Spawn an obstacle
            if (GameConfig.obstacles.enabled) {
                this.spawnObstacle();
            }
        } else {
            // Spawn a distractor
            this.spawnDistractorItem();
        }
    }

    spawnTargetItem() {
        const progress = this.registry.get('collectionProgress');
        
        // Filter targets that aren't complete yet
        const incompleteTargets = GameConfig.collectibles.targets.filter(
            target => !progress[target.character].completed
        );
        
        if (incompleteTargets.length === 0) return;
        
        // Pick a random incomplete target
        const target = Phaser.Utils.Array.GetRandom(incompleteTargets);
        
        this.createCollectibleItem(target.character, target.color, true);
    }

    spawnDistractorItem() {
        const distractor = Phaser.Utils.Array.GetRandom(GameConfig.distractors);
        this.createCollectibleItem(distractor.character, distractor.color, false);
    }

    createCollectibleItem(character, color, isTarget) {
        const lane = Phaser.Math.Between(0, this.lanes.length - 1);
        const x = this.lanes[lane];
        const y = -50; // Spawn above screen
        
        // Create item container
        const item = this.add.container(x, y);
        
        // Background glow (only for targets) - enhanced to match reference
        if (isTarget) {
            // Outer glow
            const outerGlow = this.add.circle(0, 0, 45, Phaser.Display.Color.HexStringToColor(color).color, 0.4);
            // Inner glow
            const innerGlow = this.add.circle(0, 0, 35, Phaser.Display.Color.HexStringToColor(color).color, 0.6);
            item.add([outerGlow, innerGlow]);
            
            // Pulsing animation for targets (more prominent)
            this.tweens.add({
                targets: [outerGlow, innerGlow],
                scale: { from: 1, to: 1.3 },
                alpha: { from: 0.4, to: 0.8 },
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
        
        // Character text (larger, more prominent)
        const text = this.add.text(0, 0, character, {
            fontSize: '56px',
            fill: isTarget ? '#FFFFFF' : color,
            fontFamily: 'Arial',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        item.add(text);
        
        // Store metadata
        item.setData('character', character);
        item.setData('isTarget', isTarget);
        item.setData('lane', lane);
        
        // Add physics
        this.physics.add.existing(item);
        item.body.setSize(60, 60);
        
        // Add to group
        this.items.add(item);
    }

    spawnObstacle() {
        const lane = Phaser.Math.Between(0, this.lanes.length - 1);
        const x = this.lanes[lane];
        const y = -50;
        
        // Create bomb obstacle
        const obstacle = this.add.container(x, y);
        
        // Bomb body
        const body = this.add.circle(0, 0, 25, 0x1a1a1a);
        const highlight = this.add.circle(-5, -5, 8, 0x333333);
        
        // Fuse
        const fuse = this.add.rectangle(0, -25, 3, 15, 0x8B4513);
        
        // Spark effect
        const spark = this.add.circle(0, -32, 4, 0xFF6600);
        
        obstacle.add([body, highlight, fuse, spark]);
        
        // Spark animation
        this.tweens.add({
            targets: spark,
            alpha: { from: 1, to: 0.3 },
            scale: { from: 1, to: 1.5 },
            duration: 400,
            yoyo: true,
            repeat: -1
        });
        
        // Store metadata
        obstacle.setData('type', 'bomb');
        obstacle.setData('lane', lane);
        
        // Add physics
        this.physics.add.existing(obstacle);
        obstacle.body.setSize(50, 50);
        
        // Add to group
        this.obstacles.add(obstacle);
    }

    handleItemCollision(player, item) {
        const character = item.getData('character');
        const isTarget = item.getData('isTarget');
        
        // Only collect if it's a target item
        if (isTarget) {
            // Immediately disable physics to prevent multiple collisions
            item.body.enable = false;
            
            // Emit collection event (only once now)
            window.EventBus.emit(window.GameEvents.ITEM_COLLECTED, { character });
            
            // Visual feedback
            this.tweens.add({
                targets: item,
                scale: 1.5,
                alpha: 0,
                duration: 200,
                onComplete: () => item.destroy()
            });
        } else {
            // Just destroy distractor without counting
            item.destroy();
        }
    }

    handleObstacleCollision(player, obstacle) {
        // Emit obstacle hit event
        window.EventBus.emit(window.GameEvents.OBSTACLE_HIT);
        
        // Visual feedback - shake camera
        this.cameras.main.shake(200, 0.01);
        
        // Flash player red
        const playerChildren = this.player.list;
        playerChildren.forEach(child => {
            if (child.fillColor !== undefined) {
                const originalColor = child.fillColor;
                child.setFillStyle(0xFF0000);
                this.time.delayedCall(100, () => {
                    child.setFillStyle(originalColor);
                });
            }
        });
        
        // Destroy obstacle
        obstacle.destroy();
    }

    onLevelComplete() {
        this.isGameActive = false;
        
        // Stop spawning
        if (this.spawnTimer) {
            this.spawnTimer.remove();
        }
        
        // Transition to complete scene
        this.time.delayedCall(1000, () => {
            this.scene.start('CompleteScene');
            this.scene.stop('UIScene');
        });
    }

    shutdown() {
        window.EventBus.off(window.GameEvents.LEVEL_COMPLETE, this.onLevelComplete, this);
    }
}

