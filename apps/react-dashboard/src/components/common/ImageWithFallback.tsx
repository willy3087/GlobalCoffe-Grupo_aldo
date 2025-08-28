import React, { useState } from 'react';
import { Box, Image as ChakraImage, ImageProps, Flex, Icon, Text, VStack } from '@chakra-ui/react';
import { Image as ImageIcon } from 'react-feather';
import { useThemeContext } from '../../contexts/ThemeContext';

interface ImageWithFallbackProps extends ImageProps {
  showEmptyText?: boolean;
  emptyText?: string;
  fallbackHeight?: string | number;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  showEmptyText = false,
  emptyText = 'Imagem não disponível',
  fallbackHeight = '100%',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { currentTheme } = useThemeContext();

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (hasError || !src) {
    return (
      <Flex
        align="center"
        justify="center"
        bg={currentTheme.colors.background.tertiary}
        borderRadius="16px"
        w={props.w || props.width || props.boxSize || '100%'}
        h={props.h || props.height || props.boxSize || fallbackHeight}
        minW={props.minW || props.minWidth || props.boxSize}
        minH={props.minH || props.minHeight || props.boxSize}
        maxW={props.maxW || props.maxWidth || props.boxSize}
        maxH={props.maxH || props.maxHeight || props.boxSize}
        flexShrink={0}
        position="relative"
        overflow="hidden"
        objectFit={props.objectFit}
      >
        <VStack spacing={2} opacity={0.5}>
          <Icon 
            as={ImageIcon} 
            boxSize={6} 
            color={currentTheme.colors.text.tertiary}
          />
          {showEmptyText && (
            <Text 
              fontSize="xs" 
              color={currentTheme.colors.text.tertiary}
              textAlign="center"
              px={2}
            >
              {emptyText}
            </Text>
          )}
        </VStack>
      </Flex>
    );
  }

  return (
    <Box 
      position="relative" 
      w={props.w || props.width || props.boxSize} 
      h={props.h || props.height || props.boxSize}
      minW={props.minW || props.minWidth || props.boxSize}
      minH={props.minH || props.minHeight || props.boxSize}
      maxW={props.maxW || props.maxWidth || props.boxSize}
      maxH={props.maxH || props.maxHeight || props.boxSize}
      flexShrink={0}
    >
      {isLoading && (
        <Flex
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          align="center"
          justify="center"
          bg={currentTheme.colors.background.tertiary}
          borderRadius="16px"
          zIndex={1}
        >
          <Box
            className="image-loading-spinner"
            w={6}
            h={6}
            border={`3px solid ${currentTheme.colors.border.primary}`}
            borderTopColor={currentTheme.colors.primary}
            borderRadius="16px"
            animation="spin 1s linear infinite"
            sx={{
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              },
            }}
          />
        </Flex>
      )}
      <ChakraImage
        {...props}
        src={src}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        display={hasError ? 'none' : 'block'}
        w="100%"
        h="100%"
      />
    </Box>
  );
};

export default ImageWithFallback;