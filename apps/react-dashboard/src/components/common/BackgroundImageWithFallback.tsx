import React, { useState, useEffect } from 'react';
import { Box, BoxProps } from '@chakra-ui/react';
import { useThemeContext } from '../../contexts/ThemeContext';

interface BackgroundImageWithFallbackProps extends BoxProps {
  imageUrl?: string;
  fallbackColor?: string;
  overlayGradient?: string;
}

const BackgroundImageWithFallback: React.FC<BackgroundImageWithFallbackProps> = ({
  imageUrl,
  fallbackColor,
  overlayGradient,
  children,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const { currentTheme } = useThemeContext();

  useEffect(() => {
    if (!imageUrl) {
      setHasError(true);
      return;
    }

    // Preload image to check if it loads successfully
    const img = new Image();
    img.onload = () => setHasError(false);
    img.onerror = () => setHasError(true);
    img.src = imageUrl;
  }, [imageUrl]);

  const backgroundStyle = hasError || !imageUrl
    ? {
        background: fallbackColor || currentTheme.colors.primaryDark,
      }
    : {
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };

  return (
    <Box
      {...props}
      {...backgroundStyle}
      position="relative"
      _after={
        overlayGradient
          ? {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: overlayGradient,
            }
          : undefined
      }
    >
      {children}
    </Box>
  );
};

export default BackgroundImageWithFallback;