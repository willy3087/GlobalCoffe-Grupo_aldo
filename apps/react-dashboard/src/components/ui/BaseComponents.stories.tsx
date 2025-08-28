import type { Meta, StoryObj } from '@storybook/react';
import { Button, Card, Modal, Table, Grid } from './BaseComponents';
import { useState } from 'react';

const meta: Meta<typeof Button> = {
  title: 'UI/BaseComponents',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Componentes base reutilizáveis da aplicação GlobalCoffee utilizando Chakra UI.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;

// Button Stories
export const ButtonDefault: StoryObj<typeof Button> = {
  name: 'Button - Default',
  render: (args) => <Button {...args}>Clique aqui</Button>,
  args: {
    disabled: false,
  },
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Estado desabilitado do botão',
    },
    onClick: {
      action: 'clicked',
      description: 'Função chamada no click',
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: 'Tipo do botão',
    },
  },
};

export const ButtonStates: StoryObj = {
  name: 'Button - Estados',
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button>Normal</Button>
      <Button disabled>Desabilitado</Button>
    </div>
  ),
};

// Card Stories
export const CardDefault: StoryObj<typeof Card> = {
  name: 'Card - Default',
  render: (args) => (
    <Card borderRadius="16px" {...args}>
      <h3 style={{ margin: '0 0 1rem 0' }}>Título do Card</h3>
      <p style={{ margin: 0 }}>
        Este é o conteúdo do card. Pode conter qualquer elemento React.
      </p>
    </Card>
  ),
  args: {
    'aria-label': 'Card exemplo',
  },
  argTypes: {
    'aria-label': {
      control: 'text',
      description: 'Label de acessibilidade para o card',
    },
    tabIndex: {
      control: 'number',
      description: 'Índice de tabulação',
    },
  },
};

export const CardVariants: StoryObj = {
  name: 'Card - Variações',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
      <Card borderRadius="16px" aria-label="Card de preços">
        <h4>Preço do Café</h4>
        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'orange.900' }}>
          R$ 650,00
        </p>
        <p style={{ color: 'green.500' }}>+3,5%</p>
      </Card>
      <Card borderRadius="16px" aria-label="Card de volume">
        <h4>Volume de Negócios</h4>
        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'orange.900' }}>
          2.450 sacas
        </p>
        <p style={{ color: 'gray.600' }}>Estável</p>
      </Card>
      <Card borderRadius="16px" aria-label="Card de qualidade">
        <h4>Qualidade Premium</h4>
        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'orange.900' }}>
          Tipo 2
        </p>
        <p style={{ color: 'green.500' }}>Certificado</p>
      </Card>
    </div>
  ),
};

// Grid Stories
export const GridDefault: StoryObj<typeof Grid> = {
  name: 'Grid - Responsivo',
  render: () => (
    <Grid aria-label="Grid de produtos de café">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
        <Card borderRadius="16px" key={item} aria-label={`Produto ${item}`}>
          <h4>Produto {item}</h4>
          <p>Descrição do produto de café {item}</p>
          <Button>Ver detalhes</Button>
        </Card>
      ))}
    </Grid>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Grid responsivo que se adapta aos breakpoints (1 coluna no mobile, 2 no tablet, 3 no desktop, 4 em telas grandes).',
      },
    },
  },
};

// Table Stories
export const TableDefault: StoryObj<typeof Table> = {
  name: 'Table - Preços do Café',
  render: () => (
    <Table
      aria-label="Tabela de preços do café por região"
      headers={['Região', 'Preço (R$/saca)', 'Variação', 'Volume']}
      data={[
        ['Cerrado Mineiro', 'R$ 650,00', '+3,5%', '1.200 sacas'],
        ['Sul de Minas', 'R$ 645,00', '+2,8%', '850 sacas'],
        ['Mogiana', 'R$ 655,00', '+4,1%', '950 sacas'],
        ['Matas de Minas', 'R$ 640,00', '+1,9%', '720 sacas'],
      ]}
    />
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Tabela com dados do mercado de café por região.',
      },
    },
  },
};

// Modal Stories
export const ModalExample: StoryObj = {
  name: 'Modal - Exemplo',
  render: () => {
    const ModalExample = () => {
      const [isOpen, setIsOpen] = useState(false);
      
      return (
        <>
          <Button onClick={() => setIsOpen(true)}>Abrir Modal</Button>
          <Modal 
            isOpen={isOpen} 
            onClose={() => setIsOpen(false)} 
            title="Calculadora de Preços"
            aria-label="Modal da calculadora de preços"
          >
            <div>
              <p>Configure os parâmetros para calcular o preço do seu café:</p>
              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label>
                  Quantidade (kg):
                  <input type="number" style={{ marginLeft: '0.5rem', padding: '0.25rem' }} />
                </label>
                <label>
                  Qualidade:
                  <select style={{ marginLeft: '0.5rem', padding: '0.25rem' }}>
                    <option>Tipo 2</option>
                    <option>Tipo 4</option>
                    <option>Tipo 6</option>
                  </select>
                </label>
              </div>
            </div>
          </Modal>
        </>
      );
    };
    
    return <ModalExample />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Exemplo de uso do componente Modal para calculadora de preços.',
      },
    },
  },
};

// Composite Example
export const CompositeExample: StoryObj = {
  name: 'Exemplo Completo - Dashboard',
  render: () => (
    <div style={{ padding: '1rem' }}>
      <h2 style={{ marginBottom: '1rem' }}>Dashboard do Produtor</h2>
      
      <Grid aria-label="Métricas principais">
        <Card borderRadius="16px" aria-label="Preço atual">
          <h3>Preço Atual</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'orange.900' }}>
            R$ 650,00
          </p>
          <Button>Ver histórico</Button>
        </Card>
        
        <Card borderRadius="16px" aria-label="Volume hoje">
          <h3>Volume Hoje</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'orange.900' }}>
            2.450 sacas
          </p>
          <Button>Ver detalhes</Button>
        </Card>
        
        <Card borderRadius="16px" aria-label="Margem de lucro">
          <h3>Margem</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'green.500' }}>
            18,5%
          </p>
          <Button>Calcular</Button>
        </Card>
        
        <Card borderRadius="16px" aria-label="Alerta de mercado">
          <h3>Status</h3>
          <p style={{ color: 'yellow.500' }}>Alta volatilidade</p>
          <Button>Ver alertas</Button>
        </Card>
      </Grid>
      
      <div style={{ marginTop: '2rem' }}>
        <Table
          aria-label="Últimas transações"
          headers={['Hora', 'Tipo', 'Quantidade', 'Preço']}
          data={[
            ['14:30', 'Arábica Premium', '500 kg', 'R$ 650,00'],
            ['14:15', 'Robusta', '300 kg', 'R$ 580,00'],
            ['13:45', 'Arábica Tipo 2', '750 kg', 'R$ 645,00'],
          ]}
        />
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Exemplo completo de dashboard combinando Grid, Cards, Table e Buttons.',
      },
    },
  },
};