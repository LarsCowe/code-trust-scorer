import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TrustScoreDisplay, TrustScoreBar, TrustScoreBadge } from "@/components/trust-score-display";

describe("TrustScoreDisplay", () => {
  it("should render the trust score", () => {
    render(<TrustScoreDisplay score={85} animated={false} />);
    expect(screen.getByText("85")).toBeDefined();
  });

  it("should show 'Excellent' label for scores >= 90", () => {
    render(<TrustScoreDisplay score={95} animated={false} />);
    expect(screen.getByText("Excellent")).toBeDefined();
  });

  it("should show 'Good' label for scores >= 80", () => {
    render(<TrustScoreDisplay score={82} animated={false} />);
    expect(screen.getByText("Good")).toBeDefined();
  });

  it("should show 'Fair' label for scores >= 60", () => {
    render(<TrustScoreDisplay score={65} animated={false} />);
    expect(screen.getByText("Fair")).toBeDefined();
  });

  it("should show 'Poor' label for scores >= 40", () => {
    render(<TrustScoreDisplay score={45} animated={false} />);
    expect(screen.getByText("Poor")).toBeDefined();
  });

  it("should show 'Critical' label for scores < 40", () => {
    render(<TrustScoreDisplay score={25} animated={false} />);
    expect(screen.getByText("Critical")).toBeDefined();
  });

  it("should hide label when showLabel is false", () => {
    render(<TrustScoreDisplay score={85} showLabel={false} animated={false} />);
    expect(screen.queryByText("Trust Score")).toBeNull();
  });

  it("should render different sizes", () => {
    const { rerender } = render(<TrustScoreDisplay score={85} size="sm" animated={false} />);
    expect(screen.getByText("85")).toBeDefined();

    rerender(<TrustScoreDisplay score={85} size="lg" animated={false} />);
    expect(screen.getByText("85")).toBeDefined();

    rerender(<TrustScoreDisplay score={85} size="xl" animated={false} />);
    expect(screen.getByText("85")).toBeDefined();
  });
});

describe("TrustScoreBar", () => {
  it("should render the score bar", () => {
    render(<TrustScoreBar score={75} />);
    expect(screen.getByText("Trust Score")).toBeDefined();
    expect(screen.getByText("75%")).toBeDefined();
  });

  it("should hide value when showValue is false", () => {
    render(<TrustScoreBar score={75} showValue={false} />);
    expect(screen.queryByText("75%")).toBeNull();
  });
});

describe("TrustScoreBadge", () => {
  it("should render the badge with score", () => {
    render(<TrustScoreBadge score={90} />);
    expect(screen.getByText("90")).toBeDefined();
    expect(screen.getByText("/ 100")).toBeDefined();
  });
});
