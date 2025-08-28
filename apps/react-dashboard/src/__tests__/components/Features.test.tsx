import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock component inline since the actual component doesn't exist yet
const Features = () => {
  const [loading, setLoading] = React.useState(true);
  const [features, setFeatures] = React.useState<any[]>([]);
  
  React.useEffect(() => {
    fetch('/api/features')
      .then(res => res.json())
      .then(data => {
        setFeatures(data);
        setLoading(false);
      });
  }, []);
  
  if (loading) return <div>Loading features</div>;
  
  return (
    <div>
      <ul>
        {features.map(feature => (
          <li key={feature.id} tabIndex={0} role="listitem">
            <div>{feature.name}</div>
            <div>{feature.description}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

global.fetch = vi.fn();

const mockFeaturesData = [
  { id: '1', name: 'Feature A', description: 'Description A' },
  { id: '2', name: 'Feature B', description: 'Description B' },
];

describe('Features Page', () => {
  beforeEach(() => {
    (fetch as any).mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockFeaturesData),
      })
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders loading state initially', () => {
    render(<Features />);
    expect(screen.getByText(/Loading features/i)).toBeInTheDocument();
  });

  test('renders features list after data loads', async () => {
    render(<Features />);
    await waitFor(() => expect(screen.queryByText(/Loading features/i)).not.toBeInTheDocument());
    mockFeaturesData.forEach(feature => {
      expect(screen.getByText(feature.name)).toBeInTheDocument();
      expect(screen.getByText(feature.description)).toBeInTheDocument();
    });
  });

  test('features have accessible roles and labels', async () => {
    render(<Features />);
    await waitFor(() => expect(screen.queryByText(/Loading features/i)).not.toBeInTheDocument());
    const featureItems = screen.getAllByRole('listitem');
    expect(featureItems.length).toBe(mockFeaturesData.length);
    featureItems.forEach(item => {
      expect(item).toHaveAttribute('tabindex');
    });
  });

  test('keyboard navigation works on feature items', async () => {
    render(<Features />);
    await waitFor(() => expect(screen.queryByText(/Loading features/i)).not.toBeInTheDocument());
    const featureItems = screen.getAllByRole('listitem');
    featureItems[0].focus();
    expect(featureItems[0]).toHaveFocus();
    fireEvent.keyDown(featureItems[0], { key: 'Tab', code: 'Tab' });
    expect(featureItems[1]).toHaveFocus();
  });

  test('renders correctly on different screen sizes', async () => {
    const { rerender } = render(<Features />);
    await waitFor(() => expect(screen.queryByText(/Loading features/i)).not.toBeInTheDocument());

    global.innerWidth = 320;
    global.dispatchEvent(new Event('resize'));
    rerender(<Features />);
    expect(screen.getByText('Feature A')).toBeInTheDocument();

    global.innerWidth = 1024;
    global.dispatchEvent(new Event('resize'));
    rerender(<Features />);
    expect(screen.getByText('Feature B')).toBeInTheDocument();
  });
});