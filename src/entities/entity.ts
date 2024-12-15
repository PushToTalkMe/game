export class Entity extends Phaser.Physics.Matter.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    type?: string
  ) {
    super(scene.matter.world, x, y, texture);

    this.scene = scene;
    this.scene.add.existing(this);
  }
}
