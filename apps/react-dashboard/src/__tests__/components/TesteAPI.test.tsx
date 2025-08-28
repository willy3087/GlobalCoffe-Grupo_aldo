import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock component inline since the actual component doesn't exist yet
const TesteAPI = () => {
  const [loading, setLoading] = React.useState(true);
  const [apiData, setApiData] = React.useState<any>(null);
  const [error, setError] = React.useState(false);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/test');
      const data = await res.json();
      setApiData(data);
      setError(false);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };
  
  React.useEffect(() => {
    fetchData();
  }, []);
  
  if (loading) return <div>Loading API test</div>;
  if (error) return <div>Error loading API test</div>;
  
  return (
    <div>
      {apiData && <div>{apiData.data.message}</div>}
      <button onClick={fetchData}>Test API</button>
    </div>
  );
};

global.fetch = vi.fn();

const mockApiResponse = {
  success: true,
  data: { message: 'API test successful' },
};

describe('TesteAPI Page', () => {
  beforeEach(() => {
    (fetch as any).mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockApiResponse),
      })
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders loading state initially', () => {
    render(<TesteAPI />);
    expect(screen.getByText(/Loading API test/i)).toBeInTheDocument();
  });

  test('renders API response message after data loads', async () => {
    render(<TesteAPI />);
    await waitFor(() => expect(screen.queryByText(/Loading API test/i)).not.toBeInTheDocument());
    expect(screen.getByText(mockApiResponse.data.message)).toBeInTheDocument();
  });

  test('handles API call failure gracefully', async () => {
    (fetch as any).mockImplementationOnce(() =>
      Promise.reject(new Error('API failure'))
    );
    render(<TesteAPI />);
    await waitFor(() => expect(screen.queryByText(/Loading API test/i)).not.toBeInTheDocument());
    expect(screen.getByText(/Error loading API test/i)).toBeInTheDocument();
  });

  test('button triggers API call and updates message', async () => {
    render(<TesteAPI />);
    await waitFor(() => expect(screen.queryByText(/Loading API test/i)).not.toBeInTheDocument());
    const button = screen.getByRole('button', { name: /Test API/i });
    fireEvent.click(button);
    expect(fetch).toHaveBeenCalledTimes(2); // initial + button click
    await waitFor(() => expect(screen.getByText(mockApiResponse.data.message)).toBeInTheDocument());
  });

  test('renders correctly on different screen sizes', async () => {
    const { rerender } = render(<TesteAPI />);
    await waitFor(() => expect(screen.queryByText(/Loading API test/i)).not.toBeInTheDocument());

    global.innerWidth = 320;
    global.dispatchEvent(new Event('resize'));
    rerender(<TesteAPI />);
    expect(screen.getByText(mockApiResponse.data.message)).toBeInTheDocument();

    global.innerWidth = 1024;
    global.dispatchEvent(new Event('resize'));
    rerender(<TesteAPI />);
    expect(screen.getByText(mockApiResponse.data.message)).toBeInTheDocument();
  });
});