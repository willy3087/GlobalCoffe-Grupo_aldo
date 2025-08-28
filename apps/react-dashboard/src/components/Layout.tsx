import React from 'react';
import { 
  Box, 
  Flex, 
  Link, 
  Spacer, 
  Button,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Text,
  Icon
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { ThemeSelector, useThemeContext } from '../contexts/ThemeContext';
import { FaUser, FaCog, FaSignOutAlt, FaChartLine } from 'react-icons/fa';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { currentTheme } = useThemeContext();
  
  // Mock user data - would come from auth context
  const user = {
    name: 'João Silva Santos',
    email: 'joao.silva@email.com',
    farmName: 'Fazenda Santa Rita'
  };

  const handleLogout = () => {
    // Handle logout logic
    navigate('/login');
  };

  return (
    <Box minH="100vh" bg={currentTheme.colors.background.primary}>
      <Flex 
        as="header" 
        bg={currentTheme.colors.primary} 
        color="white" 
        px={4} 
        h="56px" 
        align="center"
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={1000}
        boxShadow="md"
      >
        <Link as={RouterLink} to="/" fontSize="lg" fontWeight="bold" _hover={{ textDecoration: 'none' }}>
          GlobalCoffee
        </Link>
        <Spacer />
        <Flex gap={6} align="center">
          <Link as={RouterLink} to="/" fontSize="sm" _hover={{ textDecoration: 'underline' }}>
            Home
          </Link>
          <Link as={RouterLink} to="/negocios" fontSize="sm" _hover={{ textDecoration: 'underline' }}>
            Negócios
          </Link>
          <Link as={RouterLink} to="/kpi" fontSize="sm" _hover={{ textDecoration: 'underline' }}>
            KPI
          </Link>
          <Link as={RouterLink} to="/mercado" fontSize="sm" _hover={{ textDecoration: 'underline' }}>
            Mercado
          </Link>
          <Link as={RouterLink} to="/weather" fontSize="sm" _hover={{ textDecoration: 'underline' }}>
            Clima
          </Link>
          <Link as={RouterLink} to="/pricing" fontSize="sm" _hover={{ textDecoration: 'underline' }}>
            Preços
          </Link>
          <Link as={RouterLink} to="/producer-data" fontSize="sm" _hover={{ textDecoration: 'underline' }}>
            Produtor
          </Link>
          <ThemeSelector />
          
          {/* User Avatar Menu */}
          <Menu>
            <MenuButton as={Button} variant="ghost" p={0}>
              <Avatar 
                size="sm" 
                name={user.name} 
                bg={currentTheme.colors.secondary}
                color="white"
              />
            </MenuButton>
            <MenuList bg="white" borderColor={currentTheme.colors.border.primary}>
              <Box px={3} py={2}>
                <Text fontWeight="semibold" color={currentTheme.colors.text.primary}>
                  {user.name}
                </Text>
                <Text fontSize="sm" color={currentTheme.colors.text.secondary}>
                  {user.farmName}
                </Text>
                <Text fontSize="xs" color={currentTheme.colors.text.secondary}>
                  {user.email}
                </Text>
              </Box>
              <MenuDivider />
              <MenuItem 
                icon={<Icon as={FaUser} />}
                color={currentTheme.colors.text.primary}
                _hover={{ bg: currentTheme.colors.background.secondary }}
                onClick={() => navigate('/profile')}
              >
                Meu Perfil
              </MenuItem>
              <MenuItem 
                icon={<Icon as={FaChartLine} />}
                color={currentTheme.colors.text.primary}
                _hover={{ bg: currentTheme.colors.background.secondary }}
                onClick={() => navigate('/negocios')}
              >
                Meus KPIs
              </MenuItem>
              <MenuItem 
                icon={<Icon as={FaCog} />}
                color={currentTheme.colors.text.primary}
                _hover={{ bg: currentTheme.colors.background.secondary }}
                onClick={() => navigate('/producer-data')}
              >
                Configurações
              </MenuItem>
              <MenuDivider />
              <MenuItem 
                icon={<Icon as={FaSignOutAlt} />}
                color={currentTheme.colors.status.error}
                _hover={{ bg: currentTheme.colors.background.secondary }}
                onClick={handleLogout}
              >
                Sair
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
      
      <Box as="main" bg={currentTheme.colors.background.secondary} pt="56px">
        {children}
      </Box>
      
      <Box as="footer" bg={currentTheme.colors.secondary} color="white" p={4} textAlign="center" mt="auto">
        <p>© 2024 GlobalCoffee. Todos os direitos reservados.</p>
      </Box>
    </Box>
  );
};

export default Layout;