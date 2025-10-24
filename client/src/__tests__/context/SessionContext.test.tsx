import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SessionProvider, useSession } from '../../context/SessionContext';
import { ReactNode } from 'react';

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: any) => <div>{children}</div>,
}));

const wrapper = ({ children }: { children: ReactNode }) => (
  <SessionProvider>{children}</SessionProvider>
);

describe('SessionContext', () => {
  it('provides initial session state', () => {
    const { result } = renderHook(() => useSession(), { wrapper });

    expect(result.current.sessionId).toBeTruthy();
    expect(result.current.currentStep).toBe(0);
    expect(result.current.domainEvents).toEqual([]);
    expect(result.current.commands).toEqual([]);
    expect(result.current.aggregates).toEqual([]);
    expect(result.current.boundedContexts).toEqual([]);
  });

  it('updates current step', () => {
    const { result } = renderHook(() => useSession(), { wrapper });

    act(() => {
      result.current.setCurrentStep(2);
    });

    expect(result.current.currentStep).toBe(2);
  });

  it('sets business requirement', () => {
    const { result } = renderHook(() => useSession(), { wrapper });

    const mockRequirement = {
      id: 'test-req',
      title: 'Test Project',
      description: 'Test description',
      stakeholders: [],
      goals: [],
      constraints: [],
      createdAt: new Date().toISOString(),
    };

    act(() => {
      result.current.setBusinessRequirement(mockRequirement);
    });

    expect(result.current.businessRequirement).toEqual(mockRequirement);
  });

  it('adds domain events', () => {
    const { result } = renderHook(() => useSession(), { wrapper });

    const mockEvents = [
      {
        id: 'event-1',
        name: 'Order Placed',
        description: 'An order was placed',
        color: '#ffd700',
        position: { x: 0, y: 0 },
      },
    ];

    act(() => {
      result.current.setDomainEvents(mockEvents);
    });

    expect(result.current.domainEvents).toEqual(mockEvents);
  });

  it('adds cost tracking', () => {
    const { result } = renderHook(() => useSession(), { wrapper });

    act(() => {
      result.current.addCost('Test Step', 100, 0.01);
    });

    expect(result.current.costTracking.totalTokensUsed).toBe(100);
    expect(result.current.costTracking.totalCost).toBe(0.01);
    expect(result.current.costTracking.breakdown).toHaveLength(1);
    expect(result.current.costTracking.breakdown[0].step).toBe('Test Step');
  });

  it('resets session', () => {
    const { result } = renderHook(() => useSession(), { wrapper });

    // Set some data
    act(() => {
      result.current.setCurrentStep(2);
      result.current.addCost('Test', 100, 0.01);
    });

    // Reset
    act(() => {
      result.current.resetSession();
    });

    expect(result.current.currentStep).toBe(0);
    expect(result.current.costTracking.totalCost).toBe(0);
    expect(result.current.costTracking.breakdown).toHaveLength(0);
  });

  it('accumulates multiple costs', () => {
    const { result } = renderHook(() => useSession(), { wrapper });

    act(() => {
      result.current.addCost('Step 1', 100, 0.01);
      result.current.addCost('Step 2', 150, 0.015);
    });

    expect(result.current.costTracking.totalTokensUsed).toBe(250);
    expect(result.current.costTracking.totalCost).toBe(0.025);
    expect(result.current.costTracking.breakdown).toHaveLength(2);
  });
});
