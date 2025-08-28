import React from 'react';
import { Icon } from '@chakra-ui/react';

// Weather Icons
export const SunnyIcon = (props: any) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 1v6M12 17v6M20.66 7l-4.24 4.24M7.58 16.42l-4.24 4.24M23 12h-6M7 12H1M20.66 17l-4.24-4.24M7.58 7.58L3.34 3.34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
  </Icon>
);

export const MoonIcon = (props: any) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path fill="currentColor" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </Icon>
);

export const PartlyCloudyIcon = (props: any) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <circle cx="10" cy="9" r="3" opacity="0.8"/>
      <path d="M18.5 14.5a4.5 4.5 0 0 0-4.5-4.5c-1.452 0-2.742.688-3.566 1.757A5.998 5.998 0 0 0 5 17.5c0 3.314 2.686 6 6 6h7a3 3 0 0 0 0-6c-.176 0-.35.015-.519.044A4.493 4.493 0 0 0 18.5 14.5z"/>
    </g>
  </Icon>
);

export const RainIcon = (props: any) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <path d="M18.5 9.5a4.5 4.5 0 0 0-4.5-4.5c-1.452 0-2.742.688-3.566 1.757A5.998 5.998 0 0 0 5 12.5c0 3.314 2.686 6 6 6h7a3 3 0 0 0 0-6c-.176 0-.35.015-.519.044A4.493 4.493 0 0 0 18.5 9.5z"/>
      <path d="M8 19v2M8 23v2M12 20v2M12 24v2M16 19v2M16 23v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </g>
  </Icon>
);

export const ThunderstormIcon = (props: any) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <path d="M18.5 9.5a4.5 4.5 0 0 0-4.5-4.5c-1.452 0-2.742.688-3.566 1.757A5.998 5.998 0 0 0 5 12.5c0 3.314 2.686 6 6 6h7a3 3 0 0 0 0-6c-.176 0-.35.015-.519.044A4.493 4.493 0 0 0 18.5 9.5z"/>
      <path d="M13 16l-4 5h4l-2 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </g>
  </Icon>
);

export const SnowIcon = (props: any) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <path d="M18.5 9.5a4.5 4.5 0 0 0-4.5-4.5c-1.452 0-2.742.688-3.566 1.757A5.998 5.998 0 0 0 5 12.5c0 3.314 2.686 6 6 6h7a3 3 0 0 0 0-6c-.176 0-.35.015-.519.044A4.493 4.493 0 0 0 18.5 9.5z"/>
      <circle cx="8" cy="20" r="1"/>
      <circle cx="12" cy="22" r="1"/>
      <circle cx="16" cy="20" r="1"/>
      <circle cx="10" cy="24" r="1"/>
      <circle cx="14" cy="24" r="1"/>
    </g>
  </Icon>
);

export const FogIcon = (props: any) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <g fill="currentColor" opacity="0.6">
      <rect x="4" y="8" width="16" height="2" rx="1"/>
      <rect x="6" y="12" width="12" height="2" rx="1"/>
      <rect x="4" y="16" width="16" height="2" rx="1"/>
    </g>
  </Icon>
);

// Additional Weather-related Icons
export const HumidityIcon = (props: any) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path fill="currentColor" d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
  </Icon>
);

export const PressureIcon = (props: any) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 6v6l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </g>
  </Icon>
);

export const VisibilityIcon = (props: any) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
  </Icon>
);

export const UVIndexIcon = (props: any) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <circle cx="12" cy="12" r="5"/>
      <path d="M12 1v6M12 17v6M20.66 7l-4.24 4.24M7.58 16.42l-4.24 4.24M23 12h-6M7 12H1M20.66 17l-4.24-4.24M7.58 7.58L3.34 3.34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6"/>
    </g>
  </Icon>
);

// Helper function to get weather icon based on code
export const getWeatherIconComponent = (iconCode: string) => {
  const iconMap: { [key: string]: React.ComponentType<any> } = {
    '01d': SunnyIcon,
    '01n': MoonIcon,
    '02d': PartlyCloudyIcon,
    '02n': PartlyCloudyIcon,
    '03d': PartlyCloudyIcon,
    '03n': PartlyCloudyIcon,
    '04d': PartlyCloudyIcon,
    '04n': PartlyCloudyIcon,
    '09d': RainIcon,
    '09n': RainIcon,
    '10d': RainIcon,
    '10n': RainIcon,
    '11d': ThunderstormIcon,
    '11n': ThunderstormIcon,
    '13d': SnowIcon,
    '13n': SnowIcon,
    '50d': FogIcon,
    '50n': FogIcon,
  };
  return iconMap[iconCode] || PartlyCloudyIcon;
};