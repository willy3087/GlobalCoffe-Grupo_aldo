<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Referências de Design - Global Coffee v0.2</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      margin: 20px;
      background-color: #f9f9f9;
      color: #333;
    }
    h1, h2, h3, h4 {
      color: #4CAF50;
    }
    pre {
      background-color: #eee;
      padding: 10px;
      border-radius: 6px;
      overflow-x: auto;
    }
    code {
      font-family: monospace;
      color: #c7254e;
      background-color: #f9f2f4;
      padding: 2px 4px;
      border-radius: 4px;
    }
    a {
      color: #007acc;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    ul {
      margin-bottom: 1em;
    }
  </style>
</head>
<body>
  <h1>📚 Referências de Design - Global Coffee v0.2</h1>

  <h2>🎯 Insights da Pesquisa</h2>

  <h3>1. Princípios Fundamentais Identificados</h3>

  <h4>Mobile-First & Responsividade</h4>
  <ul>
    <li><strong>Prioridade absoluta</strong> para dispositivos móveis (smartphones de produtores rurais)</li>
    <li>Adaptação fluida entre 320px a 1920px</li>
    <li>Touch targets mínimos de 44x44px</li>
    <li>Navegação simplificada com gestos</li>
  </ul>

  <h4>Acessibilidade & Inclusão</h4>
  <ul>
    <li><strong>Contraste mínimo</strong>: 4.5:1 para texto normal, 3:1 para texto grande</li>
    <li><strong>Fonte base</strong>: 16px (mínimo) para legibilidade</li>
    <li><strong>ARIA labels</strong> completos para leitores de tela</li>
    <li><strong>Modo alto contraste</strong> disponível</li>
    <li><strong>Navegação por teclado</strong> em todos os elementos</li>
  </ul>

  <h4>Dashboard Centralizado</h4>
  <ul>
    <li><strong>Máximo 4-6 widgets</strong> principais na tela inicial</li>
    <li><strong>Hierarquia visual clara</strong> com cards diferenciados</li>
    <li><strong>Dados em tempo real</strong> com indicadores visuais</li>
    <li><strong>Customização</strong> por persona/perfil</li>
  </ul>

  <h3>2. Padrões de UI Específicos para AgriTech</h3>

  <h4>Cards de Informação</h4>
  <pre><code>/* Padrão identificado */
.info-card {
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.info-card:hover {
transform: translateY(-4px);
box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}
</code></pre>

  <h4>Sistema de Cores para Agricultura</h4>
  <ul>
    <li><strong>Verde Primário</strong>: #4CAF50 (crescimento, saúde)</li>
    <li><strong>Marrom Terra</strong>: #8B4513 (solo, café)</li>
    <li><strong>Azul Céu</strong>: #87CEEB (clima, água)</li>
    <li><strong>Amarelo Alerta</strong>: #FFC107 (avisos)</li>
    <li><strong>Vermelho Urgente</strong>: #F44336 (perigo)</li>
  </ul>

  <h4>Iconografia Intuitiva</h4>
  <ul>
    <li>Ícones grandes (mínimo 32x32px)</li>
    <li>Estilo filled para melhor visibilidade</li>
    <li>Legendas sempre presentes</li>
    <li>Cores consistentes por categoria</li>
  </ul>

  <h3>3. Referências Visuais Coletadas</h3>

  <h4>Farmzi UI (Figma)</h4>
  <p><a href="https://www.figma.com/community/file/1534534746004452093/farmzi-ui" target="_blank" rel="noopener noreferrer">https://www.figma.com/community/file/1534534746004452093/farmzi-ui</a></p>
  <ul>
    <li>Interface limpa e intuitiva</li>
    <li>Cards bem organizados</li>
    <li>Navegação bottom-bar para mobile</li>
    <li>Uso eficiente de espaço</li>
  </ul>

  <h4>Climate FieldView</h4>
  <p><a href="https://climate.com" target="_blank" rel="noopener noreferrer">https://climate.com</a></p>
  <ul>
    <li>Dashboard de dados agrícolas</li>
    <li>Mapas interativos</li>
    <li>Alertas meteorológicos integrados</li>
    <li>Visualização de dados em tempo real</li>
  </ul>

  <h4>AgriTech UX/UI Collection (Dribbble)</h4>
  <p><a href="https://dribbble.com/dvhb/collections/1441603-AgriTech-UX-UI" target="_blank" rel="noopener noreferrer">https://dribbble.com/dvhb/collections/1441603-AgriTech-UX-UI</a></p>
  <ul>
    <li>Gráficos simplificados</li>
    <li>Paleta de cores naturais</li>
    <li>Microinterações suaves</li>
    <li>Layout responsivo</li>
  </ul>

  <h3>4. Componentes Essenciais Identificados</h3>

  <h4>Para José Silva (Pequeno Produtor)</h4>
  <ol>
    <li>Botões Grandes com ícones e texto</li>
    <li>WhatsApp Integration sempre visível</li>
    <li>Alertas Simples com cores e ícones</li>
    <li>Modo Offline para consultas básicas</li>
  </ol>

  <h4>Para Roberto Santos (Médio Produtor)</h4>
  <ol>
    <li>Dashboard Customizável com KPIs</li>
    <li>Gráficos Interativos de produtividade</li>
    <li>Calendário Agrícola integrado</li>
    <li>Exportação de Dados em Excel/PDF</li>
  </ol>

  <h4>Para Ana Carolina (Jovem Inovadora)</h4>
  <ol>
    <li>Analytics Avançado com ML</li>
    <li>Social Features para networking</li>
    <li>API Integration para ferramentas externas</li>
    <li>Blockchain Tracking para certificações</li>
  </ol>

  <h3>5. Padrões de Notificação</h3>

  <h4>Alertas Climáticos</h4>
  <pre><code>// Estrutura identificada
{
  tipo: "clima",
  severidade: "alto|médio|baixo",
  cores: {
    alto: "#F44336",
    médio: "#FFC107",
    baixo: "#4CAF50"
  },
  icones: {
    chuva: "☔",
    sol: "☀️",
    geada: "❄️",
    vento: "💨"
  }
}
</code></pre>

  <h4>Sistema de Notificações</h4>
  <ul>
    <li>Push notifications para mobile</li>
    <li>In-app badges para desktop</li>
    <li>WhatsApp para produtores tradicionais</li>
    <li>Email digest para relatórios</li>
  </ul>

  <h3>6. Layout Patterns</h3>

  <h4>Mobile Layout (320-768px)</h4>
  <pre><code>┌─────────────────┐
│     Header      │ <- Logo + Menu hambúrguer
├─────────────────┤
│                 │
│   Alert Card    │ <- Alertas prioritários
│                 │
├─────────────────┤
│ ┌─────┬─────┐  │
│ │ KPI │ KPI │  │ <- Grid 2x2
│ ├─────┼─────┤  │
│ │ KPI │ KPI │  │
│ └─────┴─────┘  │
├─────────────────┤
│   Action Bar    │ <- Navegação fixa
└─────────────────┘
</code></pre>

  <h4>Desktop Layout (1024px+)</h4>
  <pre><code>┌──────────────────────────────────────┐
│            Header + Nav              │
├────────┬─────────────────────────────┤
│        │                             │
│  Side  │      Main Dashboard         │
│  Menu  │                             │
│        │   ┌──────┬──────┬──────┐   │
│        │   │ Card │ Card │ Card │   │
│        │   ├──────┴──────┴──────┤   │
│        │   │    Large Chart      │   │
│        │   └────────────────────┘   │
└────────┴─────────────────────────────┘
</code></pre>

  <h3>7. Microinterações Identificadas</h3>

  <h4>Hover States</h4>
  <ul>
    <li>Elevação sutil (2-4px)</li>
    <li>Mudança de sombra</li>
    <li>Transição suave (300ms)</li>
  </ul>

  <h4>Loading States</h4>
  <ul>
    <li>Skeleton screens</li>
    <li>Progressive loading</li>
    <li>Shimmer effects</li>
  </ul>

  <h4>Success/Error Feedback</h4>
  <ul>
    <li>Toast notifications</li>
    <li>Inline validation</li>
    <li>Color-coded borders</li>
  </ul>

  <h3>8. Typography Guidelines</h3>
  <pre><code>/* Sistema tipográfico */
:root {
  --font-heading: 'Inter', 'Segoe UI', sans-serif;
  --font-body: 'Inter', 'Arial', sans-serif;

/_ Escala modular _/
--text-xs: 0.75rem; /_ 12px _/
--text-sm: 0.875rem; /_ 14px _/
--text-base: 1rem; /_ 16px _/
--text-lg: 1.125rem; /_ 18px _/
--text-xl: 1.25rem; /_ 20px _/
--text-2xl: 1.5rem; /_ 24px _/
--text-3xl: 1.875rem; /_ 30px _/
}
</code></pre>

  <h3>9. Breakpoints Responsivos</h3>
  <pre><code>/* Mobile First Approach */
/* Extra Small: 320px - 479px (default) */
/* Small: 480px - 767px */
@media (min-width: 480px) { }

/_ Medium: 768px - 1023px _/
@media (min-width: 768px) { }

/_ Large: 1024px - 1279px _/
@media (min-width: 1024px) { }
</code></pre>

</body>
</html>
