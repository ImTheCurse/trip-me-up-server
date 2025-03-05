export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.mjs$": "jest-esm-transformer",
  },
};
