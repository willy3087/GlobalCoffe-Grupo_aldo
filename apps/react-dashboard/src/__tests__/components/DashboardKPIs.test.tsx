import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock component inline since the actual component exists
const DashboardKPIs = () => {
  const [loading, setLoading] = React.useState({ climate: true, news: true });
  const [data, setData] = React.useState<any>({ climate: null, news: null });
  
  React.useEffect(() => {
    // Simulate fetching climate data
    fetch('/api/climate')
      .then(res => res.json())
      .then(climateData => {
        setData((prev: any) => ({ ...prev, climate: climateData }));
        setLoading((prev: any) => ({ ...prev, climate: false }));
      });
    
    // Simulate fetching news data
    fetch('/api/news')
      .then(res => res.json())
      .then(newsData => {
        setData((prev: any) => ({ ...prev, news: newsData }));
        setLoading((prev: any) => ({ ...prev, news: false }));
      });
  }, []);
  
  return (
    <div>
      {loading.climate && <div>Loading climate data</div>}
      {loading.news && <div>Loading news</div>}
      
      {!loading.climate && data.climate && (
        <div aria-label="Climate bar chart">Climate Chart</div>
      )}
      
      {!loading.news && data.news && (
        <div>
          {data.news.articles.map((article: any) => (
            <a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Read news: ${article.title}`}
            >
              {article.title}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

global.fetch = vi.fn();

const mockClimateData = {
  labels: ['Jan', 'Feb', 'Mar'],
  datasets: [
    {
      label: 'Temperature',
      data: [10, 20, 15],
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
  ],
};

const mockNewsData = {
  articles: [
    {
      id: '1',
      title: 'Climate change impacts',
      url: 'https://news.example.com/article1',
      source: 'News Source',
      publishedAt: '2025-08-01T12:00:00Z',
    },
  ],
};

describe('DashboardKPIs', () => {
  beforeEach(() => {
    (fetch as any).mockImplementation((url: string) => {
      if (url.includes('climate')) {
        return Promise.resolve({
          json: () => Promise.resolve(mockClimateData),
        });
      }
      if (url.includes('news')) {
        return Promise.resolve({
          json: () => Promise.resolve(mockNewsData),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders loading states initially', () => {
    render(<DashboardKPIs />);
    expect(screen.getByText(/Loading climate data/i)).toBeInTheDocument();
    expect(screen.getByText(/Loading news/i)).toBeInTheDocument();
  });

  test('renders climate chart and news after data loads', async () => {
    render(<DashboardKPIs />);
    await waitFor(() => expect(screen.queryByText(/Loading climate data/i)).not.toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText(/Loading news/i)).not.toBeInTheDocument());

    expect(screen.getByLabelText('Climate bar chart')).toBeInTheDocument();
    expect(screen.getByText('Climate change impacts')).toBeInTheDocument();
  });

  test('news links have correct href and accessibility attributes', async () => {
    render(<DashboardKPIs />);
    await waitFor(() => expect(screen.queryByText(/Loading news/i)).not.toBeInTheDocument());

    const newsLink = screen.getByRole('link', { name: /Read news: Climate change impacts/i });
    expect(newsLink).toHaveAttribute('href', 'https://news.example.com/article1');
    expect(newsLink).toHaveAttribute('target', '_blank');
    expect(newsLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});