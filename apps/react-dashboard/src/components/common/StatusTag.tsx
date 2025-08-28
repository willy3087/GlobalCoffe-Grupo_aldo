import React from 'react';
import { Badge, BadgeProps } from '@chakra-ui/react';
import { useThemeContext } from '../../contexts/ThemeContext';

// Tags são para categorias/tipos/labels
// Características: formato levemente arredondado, fundo mais sólido que pills, sem borda

export type TagCategory = 'market' | 'climate' | 'technology' | 'export' | 'sustainability' | 'politics' | 'research' | 'default';
export type TagSize = 'sm' | 'md';

interface StatusTagProps extends Omit<BadgeProps, 'variant' | 'size'> {
  category: TagCategory;
  size?: TagSize;
  children: React.ReactNode;
}

const StatusTag: React.FC<StatusTagProps> = ({
  category,
  size = 'sm',
  children,
  ...props
}) => {
  const { currentTheme } = useThemeContext();

  // Tags usam o mesmo sistema de cores das pills mas mantêm formato característico
  // Estilo consistente com pills mas com formato retangular e texto uppercase
  const getTagStyles = () => {
    const baseStyles = {
      borderRadius: "24px", // Menos arredondado que pills - mantém formato de tag
      fontWeight: '600',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em',
      borderWidth: '1px', // Borda sutil como nas pills
      transition: 'all 0.2s',
    };

    const sizeStyles = size === 'md'
      ? { px: 3, py: 1, fontSize: 'xs' }
      : { px: 2, py: 0.5, fontSize: '2xs' };

    // Mapeamento usando as mesmas cores semânticas das pills
    switch (category) {
      case 'market':
        return {
          ...baseStyles,
          ...sizeStyles,
          bg: currentTheme.colors.status.info + '20',
          color: currentTheme.colors.status.info,
          borderColor: currentTheme.colors.status.info + '40',
        };
      case 'climate':
        return {
          ...baseStyles,
          ...sizeStyles,
          bg: currentTheme.colors.status.info + '15',
          color: currentTheme.colors.status.info,
          borderColor: currentTheme.colors.status.info + '30',
        };
      case 'technology':
        return {
          ...baseStyles,
          ...sizeStyles,
          bg: currentTheme.colors.secondary + '20',
          color: currentTheme.colors.secondary,
          borderColor: currentTheme.colors.secondary + '40',
        };
      case 'export':
        return {
          ...baseStyles,
          ...sizeStyles,
          bg: currentTheme.colors.status.warning + '20',
          color: currentTheme.colors.status.warning,
          borderColor: currentTheme.colors.status.warning + '40',
        };
      case 'sustainability':
        return {
          ...baseStyles,
          ...sizeStyles,
          bg: currentTheme.colors.status.success + '20',
          color: currentTheme.colors.status.success,
          borderColor: currentTheme.colors.status.success + '40',
        };
      case 'politics':
        return {
          ...baseStyles,
          ...sizeStyles,
          bg: currentTheme.colors.status.warning + '15',
          color: currentTheme.colors.status.warning,
          borderColor: currentTheme.colors.status.warning + '30',
        };
      case 'research':
        return {
          ...baseStyles,
          ...sizeStyles,
          bg: currentTheme.colors.primary + '20',
          color: currentTheme.colors.primary,
          borderColor: currentTheme.colors.primary + '40',
        };
      default:
        return {
          ...baseStyles,
          ...sizeStyles,
          bg: currentTheme.colors.text.secondary + '15',
          color: currentTheme.colors.text.secondary,
          borderColor: currentTheme.colors.text.secondary + '30',
        };
    }
  };

  return (
    <Badge
      {...getTagStyles()}
      display="inline-block"
      w="fit-content"
      {...props}
    >
      {children}
    </Badge>
  );
};

// Removido: Helper functions de manipulação de hex/rgb (não são mais necessários)

// Helper function para mapear categorias em português
export const getTagCategory = (category: string): TagCategory => {
  const normalized = category.toLowerCase();
  
  if (normalized === 'mercado' || normalized === 'market') return 'market';
  if (normalized === 'clima' || normalized === 'climate' || normalized === 'weather') return 'climate';
  if (normalized === 'tecnologia' || normalized === 'technology' || normalized === 'tech') return 'technology';
  if (normalized === 'exportação' || normalized === 'export') return 'export';
  if (normalized === 'sustentabilidade' || normalized === 'sustainability') return 'sustainability';
  if (normalized === 'política' || normalized === 'politics' || normalized === 'policy') return 'politics';
  if (normalized === 'pesquisa' || normalized === 'research') return 'research';
  
  return 'default';
};

export default StatusTag;