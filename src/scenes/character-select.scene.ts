import { CHARACTERS, KEYS, PATH_ASSETS, STYLE, TEXT } from "../utils/constants";

export class CharacterSelectScene extends Phaser.Scene {
  private selectedCharacter: string;
  constructor() {
    super(KEYS.SCENES.CHARACTER_SELECT);
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
      this.input.setDefaultCursor(STYLE.CURSOR.POINTER);
      character.setScale(0.31);
    });

    character.on("pointerout", () => {
      this.input.setDefaultCursor(STYLE.CURSOR.DEFAULT);
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
        button.setStyle({ backgroundColor: STYLE.COLOR.DARK_BLUE });
        this.input.setDefaultCursor(STYLE.CURSOR.POINTER);
      } else {
        this.input.setDefaultCursor(STYLE.CURSOR.DEFAULT);
      }
    });

    button.on("pointerout", () => {
      button.setStyle({ backgroundColor: STYLE.COLOR.BLUE });
      this.input.setDefaultCursor(STYLE.CURSOR.DEFAULT);
    });

    button.on("pointerdown", () => {
      if (this.selectedCharacter) {
        this.registry.set("character", this.selectedCharacter);
        this.input.setDefaultCursor(STYLE.CURSOR.DEFAULT);
        this.scene.start(KEYS.SCENES.MAIN);
      }
    });
  }

  create() {
    this.selectedCharacter = null;
    this.cameras.main.setBackgroundColor(STYLE.COLOR.GREEN_GRAY);

    const button = this.add
      .text(400, 450, TEXT.PLAY, {
        fontSize: STYLE.FONT_SIZE[32],
        color: STYLE.COLOR.WHITE,
        backgroundColor: STYLE.COLOR.BLUE,
        padding: STYLE.PADDING,
        align: STYLE.ALIGN.CENTER,
      })
      .setOrigin(0.5);

    this.add
      .text(400, 50, TEXT.SELECT_CHARACTER, {
        fontSize: STYLE.FONT_SIZE[64],
        color: STYLE.COLOR.WHITE,
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
