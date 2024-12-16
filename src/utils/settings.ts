export const SETTINGS = {
  MAIN: {
    PLAYER: {
      COORDINATES: { X: 200, Y: 150 },
      INPUT_CONFIG: {
        up: "W",
        down: "S",
        left: "A",
        right: "D",
      },
      BODY_SIZE: { width: 32, height: 32 },
      MOVE_SPEED: 0.5,
      SCALE: 0.8,
    },
  },
  FALLING_ROCKS: {
    TIMER: 60,
    LIVES: 3,
    ROCK: {
      COORDINATES: { Y: 0 },
      PROBABILITY_FALLING: 0.01,
      SCALE: 0.1,
      BODY: { type: "rectangle", width: 50, height: 48 },
      FRICTION_AIR: 0,
      MIN_VELOCITY_Y: 1,
      MAX_VELOCITY_Y: 3,
    },
    PLAYER: {
      COORDINATES: { X: 400 },
      INPUT_CONFIG: {
        left: "A",
        right: "D",
      },
      BODY_SIZE: { width: 32, height: 48 },
      MOVE_SPEED: 1.5,
      SCALE: 2,
    },
  },
};
