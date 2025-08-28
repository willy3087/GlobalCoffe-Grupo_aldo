import React, { useEffect, useState } from 'react';
import { Card, Grid } from './ui/BaseComponents';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { MapContainer, TileLayer, LayersControl, LayerGroup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement);

interface ClimateData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    fill?: boolean;
  }>;
}

interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: string;
}

const climateApiUrl = 'https://api.example.com/climate'; // Placeholder
const newsApiUrl = 'https://api.example.com/news'; // Placeholder

const DashboardKPIs: React.FC = () => {
  const [climateData, setClimateData] = useState<ClimateData | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loadingClimate, setLoadingClimate] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    // Fetch climate data
    async function fetchClimateData() {
      try {
        const response = await fetch(climateApiUrl);
        const data = await response.json();
        // Assuming API returns data in correct format
        setClimateData(data);
      } catch (error) {
        console.error('Error fetching climate data:', error);
      } finally {
        setLoadingClimate(false);
      }
    }

    // Fetch news data
    async function fetchNews() {
      try {
        const response = await fetch(newsApiUrl);
        const data = await response.json();
        // Assuming API returns array of news items
        setNews(data.articles || []);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoadingNews(false);
      }
    }

    fetchClimateData();
    fetchNews();
  }, []);

  // Chart options for accessibility and responsiveness
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: { size: 14 },
        },
      },
      title: {
        display: true,
        text: 'Climate Data Overview',
        font: { size: 18 },
      },
      tooltip: {
        enabled: true,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <Grid aria-label="Dashboard KPIs grid">
      {/* Climate Chart Card */}
      <Card borderRadius="16px" aria-label="Climate data chart" tabIndex={0}>
        {loadingClimate ? (
          <p>Loading climate data...</p>
        ) : climateData ? (
          <div style={{ height: 300 }}>
            <Bar options={chartOptions} data={climateData} aria-label="Climate bar chart" />
          </div>
        ) : (
          <p>No climate data available.</p>
        )}
      </Card>

      {/* Interactive Map Card */}
      <Card borderRadius="16px" aria-label="Interactive climate map" tabIndex={0} style={{ height: 400 }}>
        <MapContainer center={[-15.7801, -47.9292]} zoom={4} style={{ height: '100%', width: '100%' }} aria-label="Climate interactive map">
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="OpenStreetMap">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
            </LayersControl.BaseLayer>
            <LayersControl.Overlay name="Temperature Layer">
              <LayerGroup>
                {/* Placeholder for climate layers */}
                <TileLayer
                  url="https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=YOUR_API_KEY"
                  attribution="&copy; OpenWeatherMap"
                />
              </LayerGroup>
            </LayersControl.Overlay>
            <LayersControl.Overlay name="Precipitation Layer">
              <LayerGroup>
                <TileLayer
                  url="https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=YOUR_API_KEY"
                  attribution="&copy; OpenWeatherMap"
                />
              </LayerGroup>
            </LayersControl.Overlay>
          </LayersControl>
        </MapContainer>
      </Card>

      {/* News Sidebar Card */}
      <Card borderRadius="16px" aria-label="News sidebar" tabIndex={0} style={{ overflowY: 'auto', maxHeight: 400 }}>
        <h2 tabIndex={-1}>Latest Climate News</h2>
        {loadingNews ? (
          <p>Loading news...</p>
        ) : news.length > 0 ? (
          <ul>
            {news.map((item) => (
              <li key={item.id}>
                <a href={item.url} target="_blank" rel="noopener noreferrer" aria-label={`Read news: ${item.title}`}>
                  {item.title}
                </a>
                <p>
                  <small>
                    {item.source} - {new Date(item.publishedAt).toLocaleDateString()}
                  </small>
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No news available.</p>
        )}
      </Card>
    </Grid>
  );
};

export default DashboardKPIs;