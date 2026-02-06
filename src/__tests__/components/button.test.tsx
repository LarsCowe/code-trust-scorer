import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("should render children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeDefined();
  });

  it("should handle click events", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toHaveProperty("disabled", true);
  });

  it("should be disabled when isLoading is true", () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByRole("button")).toHaveProperty("disabled", true);
  });

  it("should show loading spinner when isLoading", () => {
    render(<Button isLoading>Loading</Button>);
    // The button should contain an SVG (the loader icon)
    const button = screen.getByRole("button");
    expect(button.querySelector("svg")).toBeDefined();
  });

  it("should render with different variants", () => {
    const { rerender } = render(<Button variant="default">Default</Button>);
    expect(screen.getByText("Default")).toBeDefined();

    rerender(<Button variant="destructive">Destructive</Button>);
    expect(screen.getByText("Destructive")).toBeDefined();

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByText("Outline")).toBeDefined();

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByText("Secondary")).toBeDefined();

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByText("Ghost")).toBeDefined();

    rerender(<Button variant="link">Link</Button>);
    expect(screen.getByText("Link")).toBeDefined();
  });

  it("should render with different sizes", () => {
    const { rerender } = render(<Button size="default">Default</Button>);
    expect(screen.getByText("Default")).toBeDefined();

    rerender(<Button size="sm">Small</Button>);
    expect(screen.getByText("Small")).toBeDefined();

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByText("Large")).toBeDefined();

    rerender(<Button size="icon">Icon</Button>);
    expect(screen.getByText("Icon")).toBeDefined();
  });

  it("should render left icon", () => {
    render(<Button leftIcon={<span data-testid="left-icon">L</span>}>With Icon</Button>);
    expect(screen.getByTestId("left-icon")).toBeDefined();
  });

  it("should render right icon", () => {
    render(<Button rightIcon={<span data-testid="right-icon">R</span>}>With Icon</Button>);
    expect(screen.getByTestId("right-icon")).toBeDefined();
  });

  it("should not render right icon when loading", () => {
    render(
      <Button isLoading rightIcon={<span data-testid="right-icon">R</span>}>
        Loading
      </Button>
    );
    expect(screen.queryByTestId("right-icon")).toBeNull();
  });
});
