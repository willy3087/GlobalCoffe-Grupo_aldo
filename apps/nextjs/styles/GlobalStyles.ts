import { createGlobalStyle } from 'styled-components';
import designTokens from './designTokens';

const { colors, typography, spacing, borders, shadows, transitions } = designTokens;

const GlobalStyles = createGlobalStyle`
  /* Reset CSS */
  *, *::before, *::after {
    box-sizing: border-box;
  }
  html, body, #root {
    margin: 0;
    padding: 0;
    height: 100%;
    font-family: ${typography.fontFamilyBase};
    font-size: ${typography.fontSizeBase};
    line-height: ${typography.lineHeightBase};
    color: ${colors.textPrimary};
    background-color: ${colors.background};
  }
  /* Remove default margin for headings and paragraphs */
  h1, h2, h3, h4, h5, h6, p {
    margin: 0 0 ${spacing.md} 0;
    font-weight: ${typography.fontWeightRegular};
  }
  /* Headings sizes */
  h1 { font-size: ${typography.headings.h1}; font-weight: ${typography.fontWeightBold}; }
  h2 { font-size: ${typography.headings.h2}; font-weight: ${typography.fontWeightMedium}; }
  h3 { font-size: ${typography.headings.h3}; font-weight: ${typography.fontWeightMedium}; }
  h4 { font-size: ${typography.headings.h4}; font-weight: ${typography.fontWeightMedium}; }
  h5 { font-size: ${typography.headings.h5}; font-weight: ${typography.fontWeightMedium}; }
  h6 { font-size: ${typography.headings.h6}; font-weight: ${typography.fontWeightMedium}; }

  /* Links */
  a {
    color: ${colors.primary};
    text-decoration: none;
    transition: color 0.2s ease-in-out;
  }
  a:hover,
  a:focus {
    color: ${colors.primaryLight};
    outline: none;
  }

  /* Buttons and interactive elements focus */
  button, input, select, textarea, a {
    &:focus-visible {
      outline: 3px solid ${colors.secondary};
      outline-offset: 2px;
    }
  }

  /* Form elements base */
  input, select, textarea, button {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    border-radius: ${borders.radiusSmall};
    border: ${borders.widthThin} solid ${colors.surface};
    padding: ${spacing.sm} ${spacing.md};
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }
  input:focus, select:focus, textarea:focus, button:focus {
    border-color: ${colors.primaryLight};
    box-shadow: 0 0 0 3px rgba(10, 147, 150, 0.3);
    outline: none;
  }

  /* Responsive layout base */
  @media (max-width: 768px) {
    body {
      font-size: 14px;
    }
  }

  /* Utility classes */
  .sr-only {
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    white-space: nowrap !important;
    border: 0 !important;
  }
`;

export default GlobalStyles;