import mainJSON from "../assets/main.json";
import { Player } from "../entities/player";
import {
  KEYS,
  LAYERS,
  PATH_ASSETS,
  SIZES,
  SPRITES,
  STYLE,
  TEXT,
  TILES,
} from "../utils/constants";
import { SETTINGS } from "../utils/settings";

export class MainGameScene extends Phaser.Scene {
  private player?: Player;
  private isNearTarget: boolean;
  private targetZone: Phaser.GameObjects.Zone;
  private pressText: Phaser.GameObjects.Text;

  handleCollision(
    event: Phaser.Physics.Matter.Events.CollisionActiveEvent,
    isStart: boolean
  ) {
    for (const pair of event.pairs) {
      const { bodyA, bodyB } = pair;
      const gameObjectA = bodyA.gameObject;
      const gameObjectB = bodyB.gameObject;

      if (
        (gameObjectA === this.player && gameObjectB === this.targetZone) ||
        (gameObjectB === this.player && gameObjectA === this.targetZone)
      ) {
        this.pressText.setVisible(isStart);
        this.isNearTarget = isStart;
      }
    }
  }

  constructor() {
    super(KEYS.SCENES.MAIN);
    this.isNearTarget = false;
  }

  preload() {
    this.load.tilemapTiledJSON(KEYS.MAPS.MAIN, PATH_ASSETS + "main.json");

    this.load.image(TILES.WINTER, PATH_ASSETS + "winter.png");
    this.load.image(TILES.BALLISTA, PATH_ASSETS + "ballista.png");
    this.load.image(TILES.BATTLESHIP, PATH_ASSETS + "battleship.png");
    this.load.image(TILES.BUILDINGS, PATH_ASSETS + "buildings.png");

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
    const map = this.make.tilemap({ key: KEYS.MAPS.MAIN });

    const winter = map.addTilesetImage(
      mainJSON.tilesets[0].name,
      TILES.WINTER,
      SIZES.TILE,
      SIZES.TILE
    );
    const battleship = map.addTilesetImage(
      mainJSON.tilesets[1].name,
      TILES.BATTLESHIP,
      SIZES.TILE,
      SIZES.TILE
    );
    const ballista = map.addTilesetImage(
      mainJSON.tilesets[2].name,
      TILES.BALLISTA,
      SIZES.TILE,
      SIZES.TILE
    );
    const buildings = map.addTilesetImage(
      mainJSON.tilesets[3].name,
      TILES.BUILDINGS,
      SIZES.TILE,
      SIZES.TILE
    );

    map.createLayer(LAYERS.GROUND, [winter], 0, 0);
    const wallsLayer = map.createLayer(
      LAYERS.WALLS,
      [winter, ballista, battleship, buildings],
      0,
      0
    );
    wallsLayer.setCollisionByExclusion([-1]);

    this.matter.world.convertTilemapLayer(wallsLayer);
    this.matter.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.player = new Player(
      this,
      SETTINGS.MAIN.PLAYER.COORDINATES.X,
      SETTINGS.MAIN.PLAYER.COORDINATES.Y,
      SPRITES.PLAYER,
      SETTINGS.MAIN.PLAYER.INPUT_CONFIG,
      SETTINGS.MAIN.PLAYER.BODY_SIZE,
      SETTINGS.MAIN.PLAYER.MOVE_SPEED,
      SETTINGS.MAIN.PLAYER.SCALE
    );

    const interactiveObject = wallsLayer.findByIndex(65);
    this.targetZone = this.add.zone(
      interactiveObject.pixelX + SIZES.TILE,
      interactiveObject.pixelY + SIZES.TILE,
      interactiveObject.width * 2,
      interactiveObject.height
    );
    this.matter.add.gameObject(this.targetZone, {
      isSensor: true,
      isStatic: true,
    });

    this.pressText = this.add
      .text(this.player.x, this.player.y - 30, TEXT.PRESS, {
        fontSize: STYLE.FONT_SIZE[16],
        color: STYLE.COLOR.WHITE,
      })
      .setOrigin(0.5)
      .setVisible(false);

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.input.keyboard.on("keydown-X", () => {
      if (this.isNearTarget) {
        this.scene.start(KEYS.SCENES.FALLING_ROCKS);
      }
    });

    this.matter.world.on(
      "collisionstart",
      (event: Phaser.Physics.Matter.Events.CollisionActiveEvent) =>
        this.handleCollision(event, true)
    );

    this.matter.world.on(
      "collisionend",
      (event: Phaser.Physics.Matter.Events.CollisionActiveEvent) =>
        this.handleCollision(event, false)
    );
  }

  update(_: number, delta: number) {
    this.player.update(delta);
    this.pressText.setPosition(this.player.x, this.player.y - 30);
  }
}
