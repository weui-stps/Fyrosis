
let player, cursors, platforms, enemies, fireballs;
let leftBtn = false, rightBtn = false, jumpBtn = false, fireBtn = false;

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 500 }, debug: false }
    },
    scene: { preload, create, update }
};

new Phaser.Game(config);

function preload() {
    this.load.image('sky', 'https://labs.phaser.io/assets/skies/space3.png');
    this.load.image('ground', 'https://labs.phaser.io/assets/sprites/platform.png');
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
    this.load.image('enemy', 'https://labs.phaser.io/assets/sprites/baddie.png');
    this.load.image('fireball', 'https://labs.phaser.io/assets/sprites/ball.png');
}

function create() {
    this.add.image(400, 300, 'sky');

    platforms = this.physics.add.staticGroup();
    platforms.create(400, 584, 'ground').setScale(2).refreshBody();

    player = this.physics.add.sprite(100, 450, 'player');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    cursors = this.input.keyboard.createCursorKeys();

    fireballs = this.physics.add.group();

    enemies = this.physics.add.group();
    const enemy = enemies.create(600, 450, 'enemy');
    enemy.setBounce(0.2);
    enemy.setCollideWorldBounds(true);
    enemy.setVelocityX(-50);

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(enemies, platforms);
    this.physics.add.collider(fireballs, platforms, (fireball) => fireball.destroy());
    this.physics.add.collider(fireballs, enemies, (fireball, enemy) => {
        fireball.destroy();
        enemy.destroy();
    });

    // Mobile buttons
    document.getElementById('left').addEventListener('touchstart', () => leftBtn = true);
    document.getElementById('left').addEventListener('touchend', () => leftBtn = false);
    document.getElementById('right').addEventListener('touchstart', () => rightBtn = true);
    document.getElementById('right').addEventListener('touchend', () => rightBtn = false);
    document.getElementById('jump').addEventListener('touchstart', () => jumpBtn = true);
    document.getElementById('jump').addEventListener('touchend', () => jumpBtn = false);
    document.getElementById('fire').addEventListener('touchstart', () => fireBtn = true);
    document.getElementById('fire').addEventListener('touchend', () => fireBtn = false);
}

function update() {
    // Movement
    const isLeft = cursors.left.isDown || leftBtn;
    const isRight = cursors.right.isDown || rightBtn;
    const isJump = cursors.up.isDown || jumpBtn;

    if (isLeft) {
        player.setVelocityX(-160);
    } else if (isRight) {
        player.setVelocityX(160);
    } else {
        player.setVelocityX(0);
    }

    if (isJump && player.body.touching.down) {
        player.setVelocityY(-330);
    }

    // Fireball
    if ((cursors.space && Phaser.Input.Keyboard.JustDown(cursors.space)) || fireBtn) {
        const fireball = fireballs.create(player.x, player.y, 'fireball');
        fireball.setVelocityX(300);
        fireBtn = false;
    }
}
