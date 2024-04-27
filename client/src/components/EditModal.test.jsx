import React from "react";
import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { useMutation } from "react-query";
import AuthContext from "../utils/AuthContext";
import EditModalContext from "../utils/EditModalContext";
import EditModal from "./EditModal";

describe("EditModal component", () => {
  vi.mock("react-query");

  const updateEditModalStateMock = vi.fn();
  const refetchMock = vi.fn();

  const authValue = {
    userId: "123",
    token: "456",
  };

  const mockItem = {
    id: 1,
    title: "Test Item",
    image: "test.jpg",
    price: 20,
    description: "Test description",
    category: "Electronics",
    user_name: "Test User",
    user_email: "test@example.com",
  };

  test("renders the correct form with the right values", async () => {
    render(
      <AuthContext.Provider value={authValue}>
        <EditModalContext.Provider
          value={[
            { isEditModalOpen: true, item: mockItem },
            updateEditModalStateMock,
          ]}
        >
          <EditModal refetch={refetchMock} />
        </EditModalContext.Provider>
      </AuthContext.Provider>,
    );

    await waitFor(() => {
      const titleInput = screen.getByLabelText("Title");
      const descriptionInput = screen.getByLabelText("Description");
      const imageInput = screen.getByLabelText("Image");
      const categoryInput = screen.getByLabelText("Category");
      const electronicsOption = screen.getByText("Electronics");
      const priceInput = screen.getByLabelText("Price");

      expect(titleInput).toBeInTheDocument();
      expect(titleInput).toHaveValue(mockItem.title);

      expect(descriptionInput).toBeInTheDocument();
      expect(descriptionInput).toHaveValue(mockItem.description);

      expect(imageInput).toBeInTheDocument();
      expect(imageInput).toHaveValue(mockItem.image);

      expect(categoryInput).toBeInTheDocument();
      expect(electronicsOption).toBeInTheDocument();

      expect(priceInput).toBeInTheDocument();
      expect(priceInput).toHaveValue(mockItem.price);
    });
  });

  test("update button updates item, closes modal and refetches myItems", async () => {
    const updateItemMock = vi.fn();

    const mockMutation = {
      mutateAsync: updateItemMock,
    };

    const useMutationMock = vi.fn(() => mockMutation);
    useMutation.mockImplementation(useMutationMock);

    render(
      <AuthContext.Provider value={authValue}>
        <EditModalContext.Provider
          value={[
            { isEditModalOpen: true, item: mockItem },
            updateEditModalStateMock,
          ]}
        >
          <EditModal refetch={refetchMock} />
        </EditModalContext.Provider>
      </AuthContext.Provider>,
    );

    await waitFor(() => {
      const titleInput = screen.getByLabelText("Title");
      const updateButton = screen.getByText("Update", { selector: "button" });

      fireEvent.change(titleInput, { target: { value: "new title" } });

      fireEvent.click(updateButton);

      expect(updateItemMock).toHaveBeenCalledWith({
        itemId: mockItem.id,
        title: "new title",
        description: mockItem.description,
        image: mockItem.image,
        category: mockItem.category,
        price: mockItem.price.toString(),
        token: authValue.token,
      });

      expect(updateEditModalStateMock).toHaveBeenCalledWith({
        isEditModalOpen: false,
        item: {
          title: "",
          description: "",
          image: "",
          category: "",
          price: "",
        },
      });

      expect(refetchMock).toHaveBeenCalled();
    });
  });

  test("cancel button closes the modal and doesnt update item", async () => {
    const updateItemMock = vi.fn();

    const mockMutation = {
      mutateAsync: updateItemMock,
    };

    const useMutationMock = vi.fn(() => mockMutation);
    useMutation.mockImplementation(useMutationMock);

    render(
      <AuthContext.Provider value={authValue}>
        <EditModalContext.Provider
          value={[
            { isEditModalOpen: true, item: mockItem },
            updateEditModalStateMock,
          ]}
        >
          <EditModal refetch={refetchMock} />
        </EditModalContext.Provider>
      </AuthContext.Provider>,
    );

    await waitFor(() => {
      const cancelButton = screen.getByText("Cancel", { selector: "button" });

      fireEvent.click(cancelButton);

      expect(updateItemMock).not.toHaveBeenCalled();

      expect(updateEditModalStateMock).toHaveBeenCalledWith({
        isEditModalOpen: false,
        item: {
          title: "",
          description: "",
          image: "",
          category: "",
          price: "",
        },
      });
    });
  });
});
