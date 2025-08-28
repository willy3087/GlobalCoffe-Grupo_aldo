import React from 'react';
import {
  Box,
  Button as ChakraButton,
  Grid as ChakraGrid,
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Table as ChakraTable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useBreakpointValue,
} from '@chakra-ui/react';

// Card Component
export interface CardProps {
  'aria-label': string;
  children: React.ReactNode;
  tabIndex?: number;
  style?: React.CSSProperties;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, 'aria-label': ariaLabel, tabIndex, style, className }) => {
  return (
    <Box
      role="group"
      aria-label={ariaLabel}
      borderWidth="1px"
      borderRadius="16px"
      p={4}
      boxShadow="md"
      _hover={{ boxShadow: 'lg' }}
      tabIndex={tabIndex}
      style={style}
      className={className}
    >
      {children}
    </Box>
  );
};

// Grid Component
export interface GridProps {
  children: React.ReactNode;
  'aria-label'?: string;
  className?: string;
}

export const Grid: React.FC<GridProps> = ({ children, 'aria-label': ariaLabel, className }) => {
  const columns = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 4 });
  return (
    <ChakraGrid 
      templateColumns={`repeat(${columns}, 1fr)`} 
      gap={6} 
      aria-label={ariaLabel}
      className={className}
    >
      {children}
    </ChakraGrid>
  );
};

// Table Component
export interface TableProps {
  headers: string[];
  data: Array<Array<React.ReactNode>>;
  'aria-label': string;
  className?: string;
}

export const Table: React.FC<TableProps> = ({ headers, data, 'aria-label': ariaLabel, className }) => {
  return (
    <ChakraTable aria-label={ariaLabel} variant="striped" colorScheme="gray" className={className}>
      <Thead>
        <Tr>
          {headers.map((header, idx) => (
            <Th key={idx}>{header}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {data.map((row, rowIndex) => (
          <Tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <Td key={cellIndex}>{cell}</Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </ChakraTable>
  );
};

// Button Component
export interface ButtonProps {
  children: React.ReactNode;
  'aria-label'?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({ children, 'aria-label': ariaLabel, onClick, className, disabled, type }) => {
  return (
    <ChakraButton 
      aria-label={ariaLabel} 
      onClick={onClick}
      className={className}
      disabled={disabled}
      type={type}
    >
      {children}
    </ChakraButton>
  );
};

// Modal Component
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  initialFocusRef?: React.RefObject<any>;
  'aria-label'?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  initialFocusRef,
  'aria-label': ariaLabel,
}) => {
  return (
    <ChakraModal
      isOpen={isOpen}
      onClose={onClose}
      initialFocusRef={initialFocusRef}
      isCentered
      motionPreset="slideInBottom"
      aria-label={ariaLabel}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
        <ModalFooter>
          <Button onClick={onClose} aria-label="Close modal">Close</Button>
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
};