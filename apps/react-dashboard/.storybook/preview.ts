import type { Preview } from '@storybook/react-vite';
import '../src/styles/global.css';
import { withTheme } from './ThemeDecorator';

const preview: Preview = {
  decorators: [withTheme],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'coffee-cream',
          value: '#FFEAA7',
        },
        {
          name: 'field-green', 
          value: '#E8F5E8',
        },
        {
          name: 'dark',
          value: '#1a202c',
        },
      ],
    },
    viewport: {
      viewports: {
        mobile1: {
          name: 'Mobile (José no campo)',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        mobile2: {
          name: 'Mobile Large',
          styles: {
            width: '414px', 
            height: '896px',
          },
        },
        tablet: {
          name: 'Tablet (Cooperativa)',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop (Trading)',
          styles: {
            width: '1280px',
            height: '720px',
          },
        },
        desktopLarge: {
          name: 'Desktop Large (Dashboard)',
          styles: {
            width: '1920px',
            height: '1080px',
          },
        },
      },
    },
  },
};

export default preview;