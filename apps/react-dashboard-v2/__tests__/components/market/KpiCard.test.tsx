import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { FaDollarSign } from 'react-icons/fa';

import { KpiCard, KpiCardProps } from '../../../presentation/components/market/KpiCard';

// Test wrapper com Chakra UI
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ChakraProvider>{children}</ChakraProvider>
);

const mockPriceKPI: KpiCardProps = {
  id: 'price',
  title: 'Preço Médio Hoje',
  value: 'R$ 650,00',
  variation: '+3,5%',
  variationType: 'positive',
  icon: FaDollarSign,
  tooltip: 'Preço médio do café tipo 2 no mercado nacional'
};

describe('KpiCard', () => {
  it('should render price KPI correctly', () => {
    render(
      <TestWrapper>
        <KpiCard {...mockPriceKPI} />
      </TestWrapper>
    );

    expect(screen.getByText('Preço Médio Hoje')).toBeInTheDocument();
    expect(screen.getByText('R$ 650,00')).toBeInTheDocument();
    expect(screen.getByText('+3,5%')).toBeInTheDocument();
  });

  it('should show loading skeleton when loading', () => {
    render(
      <TestWrapper>
        <KpiCard {...mockPriceKPI} isLoading />
      </TestWrapper>
    );

    // Verifica se elementos de skeleton estão presentes
    expect(screen.queryByText('Preço Médio Hoje')).not.toBeInTheDocument();
    expect(screen.queryByText('R$ 650,00')).not.toBeInTheDocument();
  });

  it('should handle click events', () => {
    const onClickMock = jest.fn();
    
    render(
      <TestWrapper>
        <KpiCard {...mockPriceKPI} onClick={onClickMock} />
      </TestWrapper>
    );

    const card = screen.getByRole('button');
    fireEvent.click(card);
    
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('should handle keyboard navigation', () => {
    const onClickMock = jest.fn();
    
    render(
      <TestWrapper>
        <KpiCard {...mockPriceKPI} onClick={onClickMock} />
      </TestWrapper>
    );

    const card = screen.getByRole('button');
    
    // Testar Enter
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(onClickMock).toHaveBeenCalledTimes(1);
    
    // Testar Space
    fireEvent.keyDown(card, { key: ' ' });
    expect(onClickMock).toHaveBeenCalledTimes(2);
  });

  it('should display tooltip when provided', () => {
    render(
      <TestWrapper>
        <KpiCard {...mockPriceKPI} />
      </TestWrapper>
    );

    // Verifica se ícone de info está presente (indica tooltip)
    const infoIcon = screen.getByRole('img', { hidden: true });
    expect(infoIcon).toBeInTheDocument();
  });

  it('should apply correct color scheme for positive variation', () => {
    render(
      <TestWrapper>
        <KpiCard {...mockPriceKPI} variationType="positive" />
      </TestWrapper>
    );

    const variationText = screen.getByText('+3,5%');
    expect(variationText).toHaveStyle({ color: 'var(--chakra-colors-green-500)' });
  });

  it('should apply correct color scheme for negative variation', () => {
    const negativeKPI = {
      ...mockPriceKPI,
      variation: '-2,1%',
      variationType: 'negative' as const
    };

    render(
      <TestWrapper>
        <KpiCard {...negativeKPI} />
      </TestWrapper>
    );

    const variationText = screen.getByText('-2,1%');
    expect(variationText).toHaveStyle({ color: 'var(--chakra-colors-red-500)' });
  });

  it('should not be clickable when no onClick handler provided', () => {
    render(
      <TestWrapper>
        <KpiCard {...mockPriceKPI} onClick={undefined} />
      </TestWrapper>
    );

    // Não deve ter role="button" quando não é clicável
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    const onClickMock = jest.fn();
    
    render(
      <TestWrapper>
        <KpiCard {...mockPriceKPI} onClick={onClickMock} />
      </TestWrapper>
    );

    const card = screen.getByRole('button');
    expect(card).toHaveAttribute('aria-label', 'Ver detalhes de Preço Médio Hoje');
    expect(card).toHaveAttribute('tabIndex', '0');
  });
});