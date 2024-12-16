import { scenes } from "../scenes";

export const phaserConfig = {
  width: 800,
  height: 640,
  title: "Game",
  url: import.meta.env.URL || "",
  version: import.meta.env.VERSION || "0.0.1",
  backgroundColor: "#000",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "matter",
    matter: {
      gravity: { x: 0, y: 0 },
      debug: true,
    },
  },
  pixelArt: true,
  scene: scenes,
};
