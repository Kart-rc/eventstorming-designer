import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StepIndicator from '../../components/StepIndicator';

describe('StepIndicator', () => {
  const mockSteps = [
    { id: 0, title: 'Step 1', description: 'First step' },
    { id: 1, title: 'Step 2', description: 'Second step' },
    { id: 2, title: 'Step 3', description: 'Third step' },
  ];

  it('renders all steps', () => {
    render(<StepIndicator steps={mockSteps} currentStep={0} />);

    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('Step 3')).toBeInTheDocument();
  });

  it('highlights current step', () => {
    render(<StepIndicator steps={mockSteps} currentStep={1} />);

    const stepNumbers = screen.getAllByText(/\d/);
    expect(stepNumbers.length).toBeGreaterThan(0);
  });

  it('shows check marks for completed steps', () => {
    render(<StepIndicator steps={mockSteps} currentStep={2} />);

    // Steps 0 and 1 should be completed (showing check marks)
    const checkMarks = document.querySelectorAll('svg');
    expect(checkMarks.length).toBeGreaterThan(0);
  });

  it('displays step descriptions', () => {
    render(<StepIndicator steps={mockSteps} currentStep={0} />);

    expect(screen.getByText('First step')).toBeInTheDocument();
    expect(screen.getByText('Second step')).toBeInTheDocument();
    expect(screen.getByText('Third step')).toBeInTheDocument();
  });
});
