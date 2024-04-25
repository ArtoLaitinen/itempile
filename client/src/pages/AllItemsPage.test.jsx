import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import * as router from "react-router";
import { useQuery } from "react-query";
import AllItemsPage from "./AllItemsPage";

describe("AllItemsPage", () => {
  vi.mock("react-query");

  test("renders error message when data fetching fails", async () => {
    const errorMessage = "Failed to fetch items";

    useQuery.mockReturnValue({
      isLoading: false,
      error: { message: errorMessage },
      data: null,
    });

    render(
      <BrowserRouter>
        <AllItemsPage />
      </BrowserRouter>,
    );

    const errorText = await screen.findByText(
      `An error has occurred: ${errorMessage}`,
    );
    expect(errorText).toBeInTheDocument();
  });

  test("renders the correct amount of items when data fetching succeeds", async () => {
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
        <AllItemsPage />
      </BrowserRouter>,
    );

    await waitFor(() => {
      const items = screen.getAllByTestId("item");
      expect(items.length).toEqual(mockItems.length);
    });
  });

  test("navigates to item details page when an item is clicked", async () => {
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
        <AllItemsPage />
      </BrowserRouter>,
    );

    const item1 = await screen.findByText("Item 1");
    const item2 = await screen.findByText("Item 2");

    fireEvent.click(item1);
    expect(mockedUseNavigate).toHaveBeenCalledWith("/item/1");

    fireEvent.click(item2);
    expect(mockedUseNavigate).toHaveBeenCalledWith("/item/2");
  });
});
