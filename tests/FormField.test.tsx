import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import FormField from "../components/FormField";

describe("FormField", () => {
  it("renders label and handles input", () => {
    const mockChange = jest.fn();

    const { getByPlaceholderText } = render(
      <FormField
        label="Habit Name"
        placeholder="Enter habit name"
        value=""
        onChangeText={mockChange}
      />
    );

    fireEvent.changeText(
      getByPlaceholderText("Enter habit name"),
      "Drink Water"
    );

    expect(mockChange).toHaveBeenCalledWith("Drink Water");
  });
});