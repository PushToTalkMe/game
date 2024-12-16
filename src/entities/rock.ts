import { Entity } from "./entity";

export class Rock extends Entity {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    scale: number,
    bodyConfig: Phaser.Types.Physics.Matter.MatterSetBodyConfig,
    frictionAir: number,
    velocityY: number
  ) {
    super(scene, x, y, texture);

    this.setScale(scale);
    this.setBody(bodyConfig);
    this.setFixedRotation();
    this.setFrictionAir(frictionAir);
    this.setVelocityY(velocityY);
    this.setCollidesWith([]);
  }
}
