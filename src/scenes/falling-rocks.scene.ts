import { Player } from "../entities/player";
import {
  SPRITES,
  PATH_ASSETS,
  SIZES,
  TILES,
  LAYERS,
  KEYS,
  TEXT,
  STYLE,
  GAME_OVER,
} from "../utils/constants";
import fallingRocksJSON from "../assets/falling-rocks.json";
import { SETTINGS } from "../utils/settings";

export class FallingRocksScene extends Phaser.Scene {
  private player?: Player;
  private rocks: Phaser.Physics.Matter.Sprite[] = [];
  private timer: number = SETTINGS.FALLING_ROCKS.TIMER;
  private lives: number = SETTINGS.FALLING_ROCKS.LIVES;
  private gameOver: "win" | "loss" | "";
  private timerText: Phaser.GameObjects.Text;
  private livesText: Phaser.GameObjects.Text;
  private restartButton: Phaser.GameObjects.Text;

  constructor() {
    super(KEYS.SCENES.FALLING_ROCKS);
  }

  preload() {
    this.load.tilemapTiledJSON(
      KEYS.MAPS.FALLING_ROCKS,
      PATH_ASSETS + "falling-rocks.json"
    );
    this.load.image(TILES.WINTER, PATH_ASSETS + "winter.png");
    this.load.image(TILES.ROCK, PATH_ASSETS + `rock.png`);
    this.load.spritesheet(
      SPRITES.PLAYER,
      PATH_ASSETS + `characters/${this.registry.get("character")}.png`,
      {
        frameWidth: SIZES.FRAME.WIDTH,
        frameHeight: SIZES.FRAME.HEIGHT,
      }
    );
  }

  create() {
    const map = this.make.tilemap({ key: KEYS.MAPS.FALLING_ROCKS });
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
      SETTINGS.FALLING_ROCKS.PLAYER.COORDINATES.X,
      map.heightInPixels,
      SPRITES.PLAYER,
      SETTINGS.FALLING_ROCKS.PLAYER.INPUT_CONFIG,
      SETTINGS.FALLING_ROCKS.PLAYER.BODY_SIZE,
      SETTINGS.FALLING_ROCKS.PLAYER.MOVE_SPEED,
      SETTINGS.FALLING_ROCKS.PLAYER.SCALE
    );
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.timerText = this.add.text(
      16,
      16,
      `Осталось продержаться: ${this.timer} секунд`,
      {
        fontSize: STYLE.FONT_SIZE[32],
        color: STYLE.COLOR.WHITE,
      }
    );

    this.livesText = this.add.text(16, 50, `Количество жизней: ${this.lives}`, {
      fontSize: STYLE.FONT_SIZE[32],
      color: STYLE.COLOR.WHITE,
    });

    this.restartButton = this.add
      .text(400, 400, TEXT.RESTART, {
        fontSize: STYLE.FONT_SIZE[32],
        color: STYLE.COLOR.WHITE,
        padding: STYLE.PADDING,
        align: STYLE.ALIGN.CENTER,
      })
      .setOrigin(0.5)
      .setInteractive()
      .setVisible(false);

    this.restartButton.on("pointerover", () => {
      this.restartButton.setStyle({ color: STYLE.COLOR.LIGHT_YELLOW });
      this.input.setDefaultCursor(STYLE.CURSOR.POINTER);
    });

    this.restartButton.on("pointerout", () => {
      this.restartButton.setStyle({ color: STYLE.COLOR.WHITE });
      this.input.setDefaultCursor(STYLE.CURSOR.DEFAULT);
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
    if (this.gameOver === GAME_OVER.WIN) {
      return this.player.update(delta);
    } else if (this.gameOver === GAME_OVER.LOSS) {
      return;
    }

    this.player.update(delta);

    if (Math.random() < SETTINGS.FALLING_ROCKS.ROCK.PROBABILITY_FALLING) {
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
      .sprite(
        Phaser.Math.Between(0, this.cameras.main.width),
        SETTINGS.FALLING_ROCKS.ROCK.COORDINATES.Y,
        TILES.ROCK
      )
      .setScale(SETTINGS.FALLING_ROCKS.ROCK.SCALE)
      .setBody(SETTINGS.FALLING_ROCKS.ROCK.BODY)
      .setFixedRotation()
      .setFrictionAir(SETTINGS.FALLING_ROCKS.ROCK.FRICTION_AIR)
      .setVelocityY(
        Phaser.Math.Between(
          SETTINGS.FALLING_ROCKS.ROCK.MIN_VELOCITY_Y,
          SETTINGS.FALLING_ROCKS.ROCK.MAX_VELOCITY_Y
        )
      )
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
      this.gameOver = GAME_OVER.LOSS;
      this.showGameOver(TEXT.LOSS);
    }
  }

  win() {
    this.gameOver = GAME_OVER.WIN;
    this.showGameOver(TEXT.WIN);
  }

  showGameOver(message: string) {
    this.add
      .text(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2,
        message,
        {
          fontSize: STYLE.FONT_SIZE[48],
          color: STYLE.COLOR.WHITE,
        }
      )
      .setOrigin(0.5);

    this.restartButton.setVisible(true);
  }

  restartScene() {
    this.lives = SETTINGS.FALLING_ROCKS.LIVES;
    this.timer = SETTINGS.FALLING_ROCKS.TIMER;
    this.gameOver = "";
    this.rocks = [];
    this.input.setDefaultCursor(STYLE.CURSOR.DEFAULT);
    this.scene.restart();
  }
}
