import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { useMutation } from "react-query";
import "react-toastify/dist/ReactToastify.css";
import Authenticate from "./Authenticate";

describe("Authenticate", () => {
  vi.mock("react-query");

  beforeEach(() => {
    vi.stubGlobal("scrollTo", vi.fn());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("renders login form by default", () => {
    render(
      <BrowserRouter>
        <Authenticate />
      </BrowserRouter>,
    );

    const loginTitle = screen.getByText("Login", { selector: "h1" });
    expect(loginTitle).toBeInTheDocument();
  });

  test("renders signup form when switch button is clicked", () => {
    render(
      <BrowserRouter>
        <Authenticate />
      </BrowserRouter>,
    );

    const switchButton = screen.getByText("Sign up instead?", {
      selector: "button",
    });

    fireEvent.click(switchButton);

    const signupTitle = screen.getByText("Sign Up", { selector: "h1" });
    expect(signupTitle).toBeInTheDocument();
  });

  test("submits login form correctly", async () => {
    const loginUserMock = vi.fn();

    const mockMutation = {
      mutate: loginUserMock,
    };

    const useMutationMock = vi.fn(() => mockMutation);
    useMutation.mockImplementation(useMutationMock);

    render(
      <BrowserRouter>
        <Authenticate />
      </BrowserRouter>,
    );

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const loginButton = screen.getByText("Login", { selector: "button" });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(loginUserMock).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  test("submits signup form correctly", async () => {
    const signupUserMock = vi.fn();

    const mockMutation = {
      mutate: signupUserMock,
    };

    const useMutationMock = vi.fn(() => mockMutation);
    useMutation.mockImplementation(useMutationMock);

    render(
      <BrowserRouter>
        <Authenticate />
      </BrowserRouter>,
    );

    const switchButton = screen.getByText("Sign up instead?", {
      selector: "button",
    });

    fireEvent.click(switchButton);

    const nameInput = screen.getByLabelText("Name");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const signupButton = screen.getByText("Sign up", { selector: "button" });

    fireEvent.change(nameInput, { target: { value: "tester" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(signupButton);

    await waitFor(() => {
      expect(signupUserMock).toHaveBeenCalledWith({
        name: "tester",
        email: "test@example.com",
        password: "password123",
      });
    });
  });
});
