import React from "react";
import { describe, beforeEach, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Item from "./Item";

describe("Item", () => {
  const mockItem = {
    title: "test item 1",
    description: "test item 1 description",
    image: "image.jpg",
    category: "test category",
    price: "20",
    owner_id: "2bfd3e62-6fd4-48bf-be7e-f694f880b10e",
  };

  beforeEach(() => {
    render(<Item item={mockItem} />);
  });

  test("renders item title", () => {
    const itemTitle = screen.getByText("test item 1");
    expect(itemTitle).toBeInTheDocument();
  });

  test("renders item price", () => {
    const itemPrice = screen.getByText("20 €");
    expect(itemPrice).toBeInTheDocument();
  });

  test("renders item image", () => {
    const itemImage = screen.getByAltText("image.jpg");
    expect(itemImage).toBeInTheDocument();
    expect(itemImage.getAttribute("src")).toBe("image.jpg");
  });
});
