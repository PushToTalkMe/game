import { InputController } from "../controllers/input.controller";
import { Entity } from "./entity";

export class Player extends Entity {
  textureKey: string;
  private moveSpeed: number;
  private inputController: InputController;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    inputConfig: { up?: string; down?: string; left?: string; right?: string },
    bodySize: { width: number; height: number },
    moveSpeed: number,
    scale: number
  ) {
    super(scene, x, y, texture);

    const anims = this.scene.anims;
    const animsFrameRate = 9;
    this.textureKey = texture;
    this.moveSpeed = moveSpeed;
    this.inputController = new InputController(scene, inputConfig);

    this.setBody({
      type: "rectangle",
      width: bodySize.width,
      height: bodySize.height,
    });
    this.setOrigin(0.5, 0.5);
    this.setScale(scale);
    this.setFixedRotation();

    this.createAnimation("down", texture, 0, 2, anims, animsFrameRate);
    this.createAnimation("left", texture, 12, 14, anims, animsFrameRate);
    this.createAnimation("right", texture, 24, 26, anims, animsFrameRate);
    this.createAnimation("up", texture, 36, 38, anims, animsFrameRate);
  }

  private createAnimation(
    key: string,
    textureKey: string,
    start: number,
    end: number,
    anims: Phaser.Animations.AnimationManager,
    frameRate: number,
    repeat: number = -1
  ) {
    anims.create({
      key,
      frames: anims.generateFrameNumbers(textureKey, { start, end }),
      frameRate,
      repeat,
    });
  }

  update(delta: number) {
    const keys = this.inputController.getInputState();

    if (keys.up) {
      this.play("up", true);
      this.setVelocity(0, -delta * this.moveSpeed);
    } else if (keys.down) {
      this.play("down", true);
      this.setVelocity(0, delta * this.moveSpeed);
    } else if (keys.left) {
      this.play("left", true);
      this.setVelocity(-delta * this.moveSpeed, 0);
    } else if (keys.right) {
      this.play("right", true);
      this.setVelocity(delta * this.moveSpeed, 0);
    } else {
      this.setVelocity(0, 0);
      this.stop();
    }
  }
}
