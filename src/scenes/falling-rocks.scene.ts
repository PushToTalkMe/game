import { Player } from "../entities/player";
import { SPRITES, PATH_ASSETS, SIZES, TILES, LAYERS } from "../utils/constants";
import fallingRocksJSON from "../assets/falling-rocks.json";

export class FallingRocksScene extends Phaser.Scene {
  private player?: Player;
  private rocks: Phaser.Physics.Matter.Sprite[] = [];
  private timer: number = 60;
  private lives: number = 3;
  private gameOver: string;
  private timerText: Phaser.GameObjects.Text;
  private livesText: Phaser.GameObjects.Text;
  private restartButton: Phaser.GameObjects.Text;

  constructor() {
    super("FallingRocksScene");
  }

  preload() {
    this.load.tilemapTiledJSON(
      "fallingRocksMap",
      PATH_ASSETS + "falling-rocks.json"
    );
    this.load.image(TILES.WINTER, PATH_ASSETS + "winter.png");
    this.load.image("rock", PATH_ASSETS + `rock.png`);
    this.load.spritesheet(
      SPRITES.PLAYER,
      PATH_ASSETS + `characters/${this.registry.get("character")}.png`,
      {
        frameWidth: SIZES.PLAYER.WIDTH,
        frameHeight: SIZES.PLAYER.HEIGHT,
      }
    );
  }

  create() {
    const map = this.make.tilemap({ key: "fallingRocksMap" });
    const winter = map.addTilesetImage(
      fallingRocksJSON.tilesets[0].name,
      TILES.WINTER,
      SIZES.TILE,
      SIZES.TILE
    );
    map.createLayer(LAYERS.GROUND, [winter], 0, 0);
    this.matter.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.player = new Player(
      this,
      400,
      map.heightInPixels,
      SPRITES.PLAYER,
      {
        left: "A",
        right: "D",
      },
      { width: 32, height: 50 },
      1.5,
      2
    );
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.timerText = this.add.text(
      16,
      16,
      `Осталось продержаться: ${this.timer} секунд`,
      {
        fontSize: "32px",
        color: "#ffffff",
      }
    );

    this.livesText = this.add.text(16, 50, `Количество жизней: ${this.lives}`, {
      fontSize: "32px",
      color: "#ffffff",
    });

    this.restartButton = this.add
      .text(400, 400, "Restart", {
        fontSize: "32px",
        color: "#ffffff",
        padding: { x: 10, y: 5 },
        align: "center",
      })
      .setOrigin(0.5)
      .setInteractive()
      .setVisible(false);

    this.restartButton.on("pointerover", () => {
      this.restartButton.setStyle({ color: "#fffaaa" });
      this.input.setDefaultCursor("pointer");
    });

    this.restartButton.on("pointerout", () => {
      this.restartButton.setStyle({ color: "#ffffff" });
      this.input.setDefaultCursor("default");
    });

    this.restartButton.on("pointerdown", this.restartScene, this);

    this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });
  }

  update(_: number, delta: number) {
    if (this.gameOver === "win") {
      return this.player.update(delta);
    } else if (this.gameOver === "loss") {
      return;
    }

    this.player.update(delta);

    if (Math.random() < 0.01) {
      this.spawnRock();
    }

    this.rocks.forEach((rock, index) => {
      if (
        rock &&
        rock.getBounds &&
        rock.getBounds().contains(this.player.x, this.player.y)
      ) {
        this.loseLife();
        rock.destroy();
        this.rocks.splice(index, 1);
      }
    });
  }

  spawnRock() {
    const rock = this.matter.add
      .sprite(Phaser.Math.Between(0, this.cameras.main.width), 0, "rock")
      .setScale(0.1)
      .setBody({
        type: "rectangle",
        width: 50,
        height: 48,
      })
      .setFixedRotation()
      .setFrictionAir(0)
      .setVelocityY(Phaser.Math.Between(1, 3))
      .setCollidesWith([]);

    this.rocks.push(rock);

    this.time.addEvent({
      delay: 100,
      callback: () => {
        if (rock && rock.y > this.cameras.main.height) {
          rock.destroy();
          this.rocks = this.rocks.filter((r) => r !== rock);
        }
      },
      callbackScope: this,
    });
  }

  updateTimer() {
    if (this.gameOver) return;

    this.timer -= 1;
    this.timerText.setText(`Осталось продержаться: ${this.timer} секунд`);

    if (this.timer <= 0) {
      this.win();
    }
  }

  loseLife() {
    this.lives -= 1;
    this.livesText.setText(`Количество жизней: ${this.lives}`);

    if (this.lives <= 0) {
      this.gameOver = "loss";
      this.showGameOver("Поражение");
    }
  }

  win() {
    this.gameOver = "win";
    this.showGameOver("Победа");
  }

  showGameOver(message: string) {
    this.add
      .text(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2,
        message,
        {
          fontSize: "48px",
          color: "#ffffff",
        }
      )
      .setOrigin(0.5);

    this.restartButton.setVisible(true);
  }

  restartScene() {
    this.lives = 3;
    this.timer = 60;
    this.gameOver = "";
    this.rocks = [];
    this.input.setDefaultCursor("default");
    this.scene.restart();
  }
}
