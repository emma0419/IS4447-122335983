import { render } from "@testing-library/react-native";
import React from "react";

jest.mock("../src/db/init", () => ({
  initDatabase: jest.fn(),
}));

jest.mock("../src/db/seed", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

import IndexScreen from "../app/(tabs)/index";

describe("IndexScreen", () => {
  it("renders without crashing", () => {
    const { toJSON } = render(<IndexScreen />);
    expect(toJSON()).toBeTruthy();
  });
});