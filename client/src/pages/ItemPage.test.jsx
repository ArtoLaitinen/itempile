import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { useQuery } from "react-query";
import ItemPage from "./ItemPage";

describe("ItemPage", () => {
  vi.mock("react-query");

  const mockItemData = {
    title: "Test Item",
    image: "test.jpg",
    price: 20,
    description: "Test description",
    user_name: "Test User",
    user_email: "test@example.com",
  };

  test("renders error message when data fetching fails", async () => {
    const errorMessage = "Failed to fetch item";

    useQuery.mockReturnValue({
      isLoading: false,
      error: { message: errorMessage },
      data: null,
    });

    render(<ItemPage />);

    const errorText = await screen.findByText(
      `An error has occurred, please try again`,
    );
    expect(errorText).toBeInTheDocument();
  });

  test("renders item details when data fetching succeeds", async () => {
    useQuery.mockReturnValue({
      isLoading: false,
      error: null,
      data: mockItemData,
    });

    render(<ItemPage />);

    const itemTitle = screen.getByText(mockItemData.title);
    const itemImage = screen.getByAltText(mockItemData.image);
    const itemPrice = screen.getByText(`${mockItemData.price} €`);
    const itemDescription = screen.getByText(mockItemData.description);
    const sellerName = screen.getByText(mockItemData.user_name);
    const sellerEmail = screen.getByText(mockItemData.user_email);

    expect(itemTitle).toBeInTheDocument();
    expect(itemImage).toBeInTheDocument();
    expect(itemImage.getAttribute("src")).toBe("test.jpg");
    expect(itemPrice).toBeInTheDocument();
    expect(itemDescription).toBeInTheDocument();
    expect(sellerName).toBeInTheDocument();
    expect(sellerEmail).toBeInTheDocument();
  });
});
