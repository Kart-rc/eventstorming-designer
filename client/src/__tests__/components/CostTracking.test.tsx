import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CostTracking from '../../components/CostTracking';
import { SessionProvider } from '../../context/SessionContext';

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: any) => <div>{children}</div>,
  Routes: ({ children }: any) => <div>{children}</div>,
  Route: ({ children }: any) => <div>{children}</div>,
}));

describe('CostTracking', () => {
  it('renders cost tracking headers', () => {
    render(
      <SessionProvider>
        <CostTracking />
      </SessionProvider>
    );

    expect(screen.getByText(/Total Cost/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Tokens/i)).toBeInTheDocument();
    const apiCallsElements = screen.getAllByText(/API Calls/i);
    expect(apiCallsElements.length).toBeGreaterThan(0);
  });

  it('displays initial cost as zero', () => {
    render(
      <SessionProvider>
        <CostTracking />
      </SessionProvider>
    );

    // Should show $0.000000 initially
    const costElements = screen.getAllByText(/\$0\.000000/);
    expect(costElements.length).toBeGreaterThan(0);
  });

  it('shows message when no API calls made', () => {
    render(
      <SessionProvider>
        <CostTracking />
      </SessionProvider>
    );

    expect(screen.getByText(/No API calls made yet/i)).toBeInTheDocument();
  });

  it('renders cost breakdown section', () => {
    render(
      <SessionProvider>
        <CostTracking />
      </SessionProvider>
    );

    expect(screen.getByText(/Cost Breakdown/i)).toBeInTheDocument();
  });

  it('displays informational note about costs', () => {
    render(
      <SessionProvider>
        <CostTracking />
      </SessionProvider>
    );

    expect(screen.getByText(/Anthropic Claude API pricing/i)).toBeInTheDocument();
  });
});
