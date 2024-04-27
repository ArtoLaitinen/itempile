import React from "react";
import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import * as router from "react-router";
import { useQuery, useMutation } from "react-query";
import AuthContext from "../utils/AuthContext";
import EditModalContext from "../utils/EditModalContext";
import MyItemsPage from "./MyItemsPage";

describe("MyItemsPage component", () => {
  vi.mock("react-query");

  const updateEditModalStateMock = vi.fn();

  const authValue = {
    userId: "123",
    token: "456",
  };

  const mockItem = {
    title: "Test Item",
    image: "test.jpg",
    price: 20,
    description: "Test description",
    category: "Test category",
    user_name: "Test User",
    user_email: "test@example.com",
  };

  beforeEach(() => {
    vi.stubGlobal("scrollTo", vi.fn());
    vi.stubGlobal("confirm", vi.fn());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("renders error message when fetching the users items fails", async () => {
    const errorMessage = "Failed to fetch items";

    useQuery.mockReturnValue({
      isLoading: false,
      error: { message: errorMessage },
      data: null,
    });

    render(
      <BrowserRouter>
        <AuthContext.Provider value={authValue}>
          <EditModalContext.Provider value={[{}, updateEditModalStateMock]}>
            <MyItemsPage />
          </EditModalContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    const errorText = await screen.findByText(errorMessage);
    expect(errorText).toBeInTheDocument();
  });

  test("renders the correct amount of items and buttons when data fetching succeeds", async () => {
    const mockItems = [
      { id: 1, title: "Item 1", price: 10 },
      { id: 2, title: "Item 2", price: 20 },
    ];

    useQuery.mockReturnValue({
      isLoading: false,
      error: null,
      data: mockItems,
    });

    render(
      <BrowserRouter>
        <AuthContext.Provider value={authValue}>
          <EditModalContext.Provider
            value={[
              { isEditModalOpen: false, item: mockItem },
              updateEditModalStateMock,
            ]}
          >
            <MyItemsPage />
          </EditModalContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    await waitFor(() => {
      const myItems = screen.getAllByTestId("myItem");
      const viewButton = screen.getAllByText("View", { selector: "button" });
      const editButton = screen.getAllByText("Edit", { selector: "button" });
      const deleteButton = screen.getAllByText("Delete", {
        selector: "button",
      });

      expect(myItems.length).toEqual(mockItems.length);
      expect(viewButton.length).toEqual(mockItems.length);
      expect(editButton.length).toEqual(mockItems.length);
      expect(deleteButton.length).toEqual(mockItems.length);
    });
  });

  test("navigates to item details page when view button is clicked", async () => {
    const mockItems = [
      { id: 1, title: "Item 1", price: 10 },
      { id: 2, title: "Item 2", price: 20 },
    ];

    const mockedUseNavigate = vi.fn();

    vi.spyOn(router, "useNavigate").mockImplementation(() => mockedUseNavigate);

    useQuery.mockReturnValue({
      isLoading: false,
      error: null,
      data: mockItems,
    });

    render(
      <BrowserRouter>
        <AuthContext.Provider value={authValue}>
          <EditModalContext.Provider
            value={[
              { isEditModalOpen: false, item: mockItem },
              updateEditModalStateMock,
            ]}
          >
            <MyItemsPage />
          </EditModalContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>,
    );
    const viewButtons = screen.getAllByText("View", { selector: "button" });

    fireEvent.click(viewButtons[0]);
    expect(mockedUseNavigate).toHaveBeenCalledWith("/item/1");
  });

  test("edit button opens editModal with the right id", async () => {
    const mockItems = [
      { id: 1, title: "Item 1", price: 10 },
      { id: 2, title: "Item 2", price: 20 },
    ];

    useQuery.mockReturnValue({
      isLoading: false,
      error: null,
      data: mockItems,
    });

    render(
      <BrowserRouter>
        <AuthContext.Provider value={authValue}>
          <EditModalContext.Provider
            value={[
              { isEditModalOpen: false, item: mockItem },
              updateEditModalStateMock,
            ]}
          >
            <MyItemsPage />
          </EditModalContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    await waitFor(() => {
      const editButtons = screen.getAllByText("Edit", { selector: "button" });

      fireEvent.click(editButtons[0]);

      expect(updateEditModalStateMock).toHaveBeenCalledWith({
        isEditModalOpen: true,
        item: mockItems[0],
      });
    });
  });

  test("delete button asks for confirmation and deletes item on confirm", async () => {
    const deleteItemMock = vi.fn();

    const mockMutation = {
      mutate: deleteItemMock,
    };

    const useMutationMock = vi.fn(() => mockMutation);
    useMutation.mockImplementation(useMutationMock);

    window.confirm.mockReturnValue(true);

    const mockItems = [
      { id: 1, title: "Item 1", price: 10 },
      { id: 2, title: "Item 2", price: 20 },
    ];

    useQuery.mockReturnValue({
      isLoading: false,
      error: null,
      data: mockItems,
    });

    render(
      <BrowserRouter>
        <AuthContext.Provider value={authValue}>
          <EditModalContext.Provider
            value={[
              { isEditModalOpen: false, item: mockItem },
              updateEditModalStateMock,
            ]}
          >
            <MyItemsPage />
          </EditModalContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    await waitFor(() => {
      const deleteButtons = screen.getAllByText("Delete", {
        selector: "button",
      });

      fireEvent.click(deleteButtons[0]);

      expect(window.confirm).toHaveBeenCalledOnce();
      expect(deleteItemMock).toHaveBeenCalledWith({
        itemId: mockItems[0].id,
        token: authValue.token,
      });
    });
  });

  test("on delete button confirmation cancel, doesnt delete item", async () => {
    const deleteItemMock = vi.fn();

    const mockMutation = {
      mutate: deleteItemMock,
    };

    const useMutationMock = vi.fn(() => mockMutation);
    useMutation.mockImplementation(useMutationMock);

    window.confirm.mockReturnValue(false);

    const mockItems = [
      { id: 1, title: "Item 1", price: 10 },
      { id: 2, title: "Item 2", price: 20 },
    ];

    useQuery.mockReturnValue({
      isLoading: false,
      error: null,
      data: mockItems,
    });

    render(
      <BrowserRouter>
        <AuthContext.Provider value={authValue}>
          <EditModalContext.Provider
            value={[
              { isEditModalOpen: false, item: mockItem },
              updateEditModalStateMock,
            ]}
          >
            <MyItemsPage />
          </EditModalContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    await waitFor(() => {
      const deleteButtons = screen.getAllByText("Delete", {
        selector: "button",
      });

      fireEvent.click(deleteButtons[0]);

      expect(window.confirm).toHaveBeenCalledOnce();
      expect(deleteItemMock).not.toHaveBeenCalled();
    });
  });
});
