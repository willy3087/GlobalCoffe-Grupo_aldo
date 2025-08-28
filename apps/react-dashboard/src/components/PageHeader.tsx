import React from 'react';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Container,
  Heading,
  HStack,
  Text,
  Icon,
  Flex,
  Spacer,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Home } from 'react-feather';
import { useThemeContext } from '../contexts/ThemeContext';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: any;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, icon, breadcrumbs, actions }) => {
  const location = useLocation();
  const { currentTheme } = useThemeContext();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  // Generate default breadcrumbs if not provided
  const defaultBreadcrumbs = React.useMemo(() => {
    if (breadcrumbs) return breadcrumbs;

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const crumbs: Array<{ label: string; href?: string }> = [{ label: 'Home', href: '/' }];

    // Map common routes to friendly names
    const routeNames: { [key: string]: string } = {
      dashboard: 'Dashboard',
      mercado: 'Mercado',
      analysis: 'Análise',
      weather: 'Clima',
      features: 'Recursos',
      pricing: 'Preços',
      login: 'Login',
      negocios: 'Negócios',
      kpi: 'KPI',
      'producer-data': 'Produtor',
      'producer-signup': 'Cadastro Produtor',
      profile: 'Perfil',
    };

    pathSegments.forEach((segment, index) => {
      const href = '/' + pathSegments.slice(0, index + 1).join('/');
      const label = routeNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      crumbs.push({ label, href: index === pathSegments.length - 1 ? undefined : href });
    });

    return crumbs;
  }, [location.pathname, breadcrumbs]);

  return (
    <Box
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      py={4}
      mb={8}
    >
      <Container maxW="container.2xl">
        <Box>
          {/* Title, Subtitle and Actions */}
          <Flex align="start" mb={3}>
            <HStack spacing={3} align="center">
              {icon && <Icon as={icon} boxSize={7} color={currentTheme.colors.primary} />}
              <Box>
                <Heading size="lg" color={useColorModeValue('gray.800', 'white')}>
                  {title}
                </Heading>
                {subtitle && (
                  <Text fontSize="md" color={textColor} mt={1}>
                    {subtitle}
                  </Text>
                )}
              </Box>
            </HStack>
            <Spacer />
            {actions && <Box>{actions}</Box>}
          </Flex>

          {/* Breadcrumb */}
          <Breadcrumb
            spacing={2}
            separator={<Text color={textColor} fontSize="sm">{'>'}</Text>}
            fontSize="sm"
          >
            {defaultBreadcrumbs.map((crumb, index) => (
              <BreadcrumbItem key={index} isCurrentPage={!crumb.href}>
                {crumb.href ? (
                  <BreadcrumbLink
                    as={RouterLink}
                    to={crumb.href}
                    color={textColor}
                    textDecoration="underline"
                    _hover={{ color: currentTheme.colors.primary }}
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >
                    {index === 0 && <Home size={14} />}
                    {crumb.label}
                  </BreadcrumbLink>
                ) : (
                  <Text color={currentTheme.colors.primary} fontWeight="medium" textDecoration="underline">
                    {crumb.label}
                  </Text>
                )}
              </BreadcrumbItem>
            ))}
          </Breadcrumb>
        </Box>
      </Container>
    </Box>
  );
};

export default PageHeader;