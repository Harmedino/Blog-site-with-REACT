import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/render";
import AuthPage from "./AuthPage";

describe("AuthPage", () => {
  it("validates the login form before calling the API", async () => {
    renderWithProviders(<AuthPage />, { path: "/auth", route: "/auth?mode=login" });
    await userEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(await screen.findByText("Enter a valid email address")).toBeInTheDocument();
    expect(screen.getByText("Enter your password")).toBeInTheDocument();
  });

  it("shows signup fields and enforces username and password rules", async () => {
    renderWithProviders(<AuthPage />, { path: "/auth", route: "/auth?mode=signup" });
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Username"), "a b");
    await user.type(screen.getByLabelText("Password"), "short");
    await user.click(screen.getByRole("button", { name: "Create account" }));
    expect(await screen.findByText("Letters, numbers, dots and underscores only")).toBeInTheDocument();
    expect(screen.getByText("Use at least 8 characters")).toBeInTheDocument();
  });

  it("switches between modes", async () => {
    renderWithProviders(<AuthPage />, { path: "/auth", route: "/auth?mode=login" });
    expect(screen.queryByLabelText("Username")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("tab", { name: "Create account" }));
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
  });
});
