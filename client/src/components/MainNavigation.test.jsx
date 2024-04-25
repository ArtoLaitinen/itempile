import React from "react";
import { describe, expect, test, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AuthContext from "../utils/AuthContext";
import MainNavigation from "./MainNavigation";

describe("MainNavigation", () => {
  test("renders logo with correct link", () => {
    render(
      <BrowserRouter>
        <MainNavigation />
      </BrowserRouter>,
    );

    const logoLink = screen.getByText("Itempile");
    expect(logoLink).toHaveAttribute("href", "/");
  });

  test("renders correct links when user is logged in", () => {
    const authValue = {
      isLoggedIn: true,
    };

    render(
      <BrowserRouter>
        <AuthContext.Provider value={authValue}>
          <MainNavigation />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    const addAnItemLink = screen.getByText("Add an Item");
    expect(addAnItemLink).toBeInTheDocument();
    expect(addAnItemLink).toHaveAttribute("href", "/add");

    const myItemsLink = screen.getByText("My Items");
    expect(myItemsLink).toBeInTheDocument();
    expect(myItemsLink).toHaveAttribute("href", "/myitems");

    const logoutButton = screen.getByText("Log out", { selector: "button" });
    expect(logoutButton).toBeInTheDocument();
  });

  test("renders authentication link when user is not logged in", () => {
    const authValue = {
      isLoggedIn: false,
    };

    render(
      <BrowserRouter>
        <AuthContext.Provider value={authValue}>
          <MainNavigation />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    const authLink = screen.getByText("Authenticate");
    expect(authLink).toBeInTheDocument();
    expect(authLink).toHaveAttribute("href", "/auth");
  });

  test("logs out user when log out button is clicked", () => {
    const authValue = {
      isLoggedIn: true,
      logout: vi.fn(),
    };

    render(
      <BrowserRouter>
        <AuthContext.Provider value={authValue}>
          <MainNavigation />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    const logoutButton = screen.getByText("Log out", { selector: "button" });
    fireEvent.click(logoutButton);

    expect(authValue.logout).toHaveBeenCalled();
  });
});
