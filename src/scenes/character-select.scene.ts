import { CHARACTERS, PATH_ASSETS } from "../utils/constants";

export class CharacterSelectScene extends Phaser.Scene {
  selectedCharacter: string;
  constructor() {
    super("CharacterSelectScene");
  }

  preload() {
    this.load.image(CHARACTERS.MAN, PATH_ASSETS + "characters/man-preview.png");
    this.load.image(
      CHARACTERS.WOMAN,
      PATH_ASSETS + "characters/woman-preview.png"
    );
  }

  makeInteractive(
    character: Phaser.GameObjects.Image,
    name: string,
    selectionBox: Phaser.GameObjects.Rectangle
  ) {
    character.setInteractive();

    character.on("pointerover", () => {
      this.input.setDefaultCursor("pointer");
      character.setScale(0.31);
    });

    character.on("pointerout", () => {
      this.input.setDefaultCursor("default");
      character.setScale(0.3);
    });

    character.on("pointerdown", () => {
      this.selectedCharacter = name;
      character.setScale(0.31);
      selectionBox.setPosition(character.x, character.y).setVisible(true);
    });
  }

  play(button: Phaser.GameObjects.Text) {
    button.setInteractive();

    button.on("pointerover", () => {
      if (this.selectedCharacter) {
        button.setStyle({ backgroundColor: "#0056b3" });
        this.input.setDefaultCursor("pointer");
      } else {
        this.input.setDefaultCursor("default");
      }
    });

    button.on("pointerout", () => {
      button.setStyle({ backgroundColor: "#007BFF" });
      this.input.setDefaultCursor("default");
    });

    button.on("pointerdown", () => {
      if (this.selectedCharacter) {
        this.registry.set("character", this.selectedCharacter);
        this.input.setDefaultCursor("default");
        this.scene.start("MainScene");
      }
    });
  }

  create() {
    this.selectedCharacter = null;
    this.cameras.main.setBackgroundColor("#c6c2ba");

    const button = this.add
      .text(400, 450, "Играть", {
        fontSize: "32px",
        color: "#ffffff",
        backgroundColor: "#007BFF",
        padding: { x: 10, y: 5 },
        align: "center",
      })
      .setOrigin(0.5);

    this.add
      .text(400, 50, "Выберите персонажа", {
        fontSize: "64px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    const man = this.add.image(200, 250, CHARACTERS.MAN).setScale(0.3, 0.3);
    const woman = this.add.image(600, 250, CHARACTERS.WOMAN).setScale(0.3, 0.3);

    const selectionBox = this.add
      .rectangle(0, 0, 310, 320)
      .setStrokeStyle(2, 0x00ff00)
      .setVisible(false);

    this.makeInteractive(man, CHARACTERS.MAN, selectionBox);
    this.makeInteractive(woman, CHARACTERS.WOMAN, selectionBox);
    this.play(button);
  }
}
