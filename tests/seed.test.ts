jest.mock("../src/db", () => ({
  db: {
    select: jest.fn(() => ({
      from: jest.fn().mockResolvedValue([]),
    })),
    insert: jest.fn(() => ({
      values: jest.fn().mockResolvedValue(undefined),
    })),
  },
}));

import seedDatabase from "../src/db/seed";

describe("seedDatabase", () => {
  it("runs without crashing", async () => {
    await expect(seedDatabase()).resolves.toBeUndefined();
  });
});