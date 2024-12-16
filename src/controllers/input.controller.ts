export class InputController {
  keys: {
    up?: Phaser.Input.Keyboard.Key;
    down?: Phaser.Input.Keyboard.Key;
    left?: Phaser.Input.Keyboard.Key;
    right?: Phaser.Input.Keyboard.Key;
  };

  constructor(
    scene: Phaser.Scene,
    inputConfig: { up?: string; down?: string; left?: string; right?: string }
  ) {
    this.keys = {};

    if (inputConfig.up) {
      this.keys.up = scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes[inputConfig.up]
      );
    }

    if (inputConfig.down) {
      this.keys.down = scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes[inputConfig.down]
      );
    }

    if (inputConfig.left) {
      this.keys.left = scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes[inputConfig.left]
      );
    }

    if (inputConfig.right) {
      this.keys.right = scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes[inputConfig.right]
      );
    }
  }

  getInputState() {
    return {
      up: this.keys.up ? this.keys.up.isDown : false,
      down: this.keys.down ? this.keys.down.isDown : false,
      left: this.keys.left ? this.keys.left.isDown : false,
      right: this.keys.right ? this.keys.right.isDown : false,
    };
  }
}
