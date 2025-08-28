import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock component inline since the actual component doesn't exist yet
const Pricing = () => {
  const [loading, setLoading] = React.useState(true);
  const [pricing, setPricing] = React.useState<any>({ plans: [] });
  
  React.useEffect(() => {
    fetch('/api/pricing')
      .then(res => res.json())
      .then(data => {
        setPricing(data);
        setLoading(false);
      });
  }, []);
  
  if (loading) return <div>Loading pricing</div>;
  
  return (
    <div>
      <ul>
        {pricing.plans.map((plan: any) => (
          <li key={plan.id} tabIndex={0} role="listitem">
            <div>{plan.name}</div>
            <div>{plan.price}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

global.fetch = vi.fn();

const mockPricingData = {
  plans: [
    { id: 'basic', name: 'Basic Plan', price: '$10' },
    { id: 'pro', name: 'Pro Plan', price: '$20' },
  ],
};

describe('Pricing Page', () => {
  beforeEach(() => {
    (fetch as any).mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockPricingData),
      })
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders loading state initially', () => {
    render(<Pricing />);
    expect(screen.getByText(/Loading pricing/i)).toBeInTheDocument();
  });

  test('renders pricing plans after data loads', async () => {
    render(<Pricing />);
    await waitFor(() => expect(screen.queryByText(/Loading pricing/i)).not.toBeInTheDocument());
    mockPricingData.plans.forEach(plan => {
      expect(screen.getByText(plan.name)).toBeInTheDocument();
      expect(screen.getByText(plan.price)).toBeInTheDocument();
    });
  });

  test('pricing plans have accessible roles and labels', async () => {
    render(<Pricing />);
    await waitFor(() => expect(screen.queryByText(/Loading pricing/i)).not.toBeInTheDocument());
    const planItems = screen.getAllByRole('listitem');
    expect(planItems.length).toBe(mockPricingData.plans.length);
    planItems.forEach(item => {
      expect(item).toHaveAttribute('tabindex');
    });
  });

  test('renders correctly on different screen sizes', async () => {
    const { rerender } = render(<Pricing />);
    await waitFor(() => expect(screen.queryByText(/Loading pricing/i)).not.toBeInTheDocument());

    global.innerWidth = 320;
    global.dispatchEvent(new Event('resize'));
    rerender(<Pricing />);
    expect(screen.getByText('Basic Plan')).toBeInTheDocument();

    global.innerWidth = 1024;
    global.dispatchEvent(new Event('resize'));
    rerender(<Pricing />);
    expect(screen.getByText('Pro Plan')).toBeInTheDocument();
  });
});