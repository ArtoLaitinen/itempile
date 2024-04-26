import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { useMutation } from "react-query";
import AuthContext from "../utils/AuthContext";
import AddItemPage from "./AddItemPage";

describe("AddItemPage", () => {
  vi.mock("react-query");
  const mockAddItemMutation = vi.fn();

  const authValue = {
    userId: "123",
    token: "456",
  };

  beforeEach(() => {
    vi.stubGlobal("scrollTo", vi.fn());

    const mockMutation = {
      mutateAsync: mockAddItemMutation,
    };

    const useMutationMock = vi.fn(() => mockMutation);
    useMutation.mockImplementation(useMutationMock);

    render(
      <BrowserRouter>
        <AuthContext.Provider value={authValue}>
          <AddItemPage />
        </AuthContext.Provider>
      </BrowserRouter>,
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("submits form with valid data", async () => {
    const titleInput = screen.getByLabelText("Title");
    const descriptionInput = screen.getByLabelText("Description");
    const imageInput = screen.getByLabelText("Image");
    const categoryInput = screen.getByLabelText("Category");
    const priceInput = screen.getByLabelText("Price");
    const addButton = screen.getByText("Add", { selector: "button" });

    fireEvent.change(titleInput, { target: { value: "Test Title" } });
    fireEvent.change(descriptionInput, {
      target: { value: "Test Description" },
    });
    fireEvent.change(imageInput, { target: { value: "test.jpg" } });

    // clicking the category input and selecting electronics
    fireEvent.mouseDown(categoryInput);
    const electronicsOption = screen.getByText("Electronics");
    fireEvent.click(electronicsOption);

    fireEvent.change(priceInput, { target: { value: "50" } });

    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockAddItemMutation).toHaveBeenCalledWith({
        title: "Test Title",
        description: "Test Description",
        image: "test.jpg",
        category: "Electronics",
        price: "50",
        owner_id: authValue.userId,
        token: authValue.token,
      });
    });
  });

  test("doesnt submit form with empty data", async () => {
    const addButton = screen.getByText("Add", { selector: "button" });

    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockAddItemMutation).not.toHaveBeenCalled();
    });
  });
});
