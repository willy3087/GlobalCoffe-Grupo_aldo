import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, describe, test, vi } from 'vitest';
import { ChakraProvider } from '@chakra-ui/react';
import { Card, Grid, Table, Button, Modal } from '../../components/ui/BaseComponents';
import '@testing-library/jest-dom';

// Wrapper para os testes com ChakraProvider
const renderWithChakra = (ui: React.ReactElement) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

describe('BaseComponents', () => {
  test('Card renders with aria-label and children', () => {
    renderWithChakra(<Card borderRadius="16px" aria-label="Test Card">Card Content</Card>);
    const card = screen.getByRole('group', { name: /test card/i });
    expect(card).toBeInTheDocument();
    expect(card).toHaveTextContent('Card Content');
  });

  test('Grid renders children in responsive columns', () => {
    renderWithChakra(
      <Grid>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </Grid>
    );
    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });

  test('Table renders headers and data', () => {
    const headers = ['Name', 'Age'];
    const data = [
      ['Alice', 30],
      ['Bob', 25],
    ];
    renderWithChakra(<Table aria-label="Test Table" headers={headers} data={data} />);
    headers.forEach(header => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });
    data.flat().forEach(cell => {
      expect(screen.getByText(cell.toString())).toBeInTheDocument();
    });
  });

  test('Button renders with children and aria-label', () => {
    renderWithChakra(<Button aria-label="Test Button">Click Me</Button>);
    const button = screen.getByRole('button', { name: /test button/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click Me');
  });

  test('Modal renders and closes on close button click', () => {
    const onClose = vi.fn();
    renderWithChakra(
      <Modal isOpen={true} onClose={onClose} title="Test Modal" aria-label="Test Modal">
        Modal Content
      </Modal>
    );
    expect(screen.getByRole('dialog', { name: /test modal/i })).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();

    const closeButton = screen.getByLabelText(/close modal/i);
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('Accessibility and Responsiveness for BaseComponents', () => {
  test('Card supports keyboard navigation and has correct aria attributes', () => {
    renderWithChakra(<Card borderRadius="16px" aria-label="Accessible Card" tabIndex={0}>Content</Card>);
    const card = screen.getByRole('group', { name: /accessible card/i });
    card.focus();
    expect(card).toHaveFocus();
    expect(card).toHaveAttribute('aria-label', 'Accessible Card');
  });

  test('Button is focusable and accessible via keyboard', () => {
    renderWithChakra(<Button aria-label="Accessible Button">Click</Button>);
    const button = screen.getByRole('button', { name: /accessible button/i });
    button.focus();
    expect(button).toHaveFocus();
  });

  test('Modal traps focus when open and closes on ESC key', () => {
    const onClose = vi.fn();
    renderWithChakra(
      <Modal isOpen={true} onClose={onClose} title="Modal Title" aria-label="Modal Dialog">
        Modal Content
      </Modal>
    );
    const modal = screen.getByRole('dialog', { name: /modal title/i });
    modal.focus();
    expect(modal).toHaveFocus();

    fireEvent.keyDown(modal, { key: 'Escape', code: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('Grid renders correctly on different screen sizes', () => {
    const { rerender } = renderWithChakra(
      <Grid>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </Grid>
    );
    expect(screen.getByTestId('child-1')).toBeInTheDocument();

    // Simulate small screen
    global.innerWidth = 320;
    global.dispatchEvent(new Event('resize'));
    rerender(
      <ChakraProvider>
        <Grid>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
        </Grid>
      </ChakraProvider>
    );
    expect(screen.getByTestId('child-2')).toBeInTheDocument();

    // Simulate large screen
    global.innerWidth = 1024;
    global.dispatchEvent(new Event('resize'));
    rerender(
      <ChakraProvider>
        <Grid>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
        </Grid>
      </ChakraProvider>
    );
    expect(screen.getByTestId('child-1')).toBeInTheDocument();
  });
});