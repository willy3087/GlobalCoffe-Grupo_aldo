# PLANO ARQUITETURAL DETALHADO - MIGRAÇÃO DDD GLOBAL COFFEE

## 📋 ANÁLISE DA ARQUITETURA ATUAL

**Estrutura Atual (apps/react-dashboard/):**
```
src/
├── components/ (UI genéricos + domain-specific misturados)
├── pages/ (Lógica de apresentação + business logic)
├── services/ (Vazio - APIs não implementadas)
├── contexts/ (Estado global da aplicação)
├── hooks/ (Custom hooks misturados)
└── utils/ (Utilitários diversos)
```

### 🚨 Problemas Identificados na Arquitetura Atual:

1. **❌ Business Logic Misturada com Apresentação**
   - `KPIsProdutor.tsx` (1.132 linhas) contém:
     - Cálculos de preços (linhas 148-160)
     - Lógica de negócio de cenários (linhas 169-173)
     - Dados mockados hardcoded (linhas 162-167)

2. **❌ Ausência de Separação de Domínios**
   - Componentes misturados sem organização por contexto
   - Lógica de café, trading e clima em um único arquivo

3. **❌ Violação do Princípio de Responsabilidade Única**
   - Componente React fazendo cálculos financeiros
   - UI gerenciando estado de negócio

4. **❌ Dependências Invertidas**
   - Apresentação conhece detalhes de implementação
   - Ausência de abstrações para APIs externas

## 🏗️ NOVA ARQUITETURA DDD (apps/react-dashboard-v2/)

### Estrutura Obrigatória Conforme Especificação:

```
📁 apps/react-dashboard-v2/
├── 📁 domains/
│   ├── 📁 coffee-market/           # DOMÍNIO CENTRAL
│   │   ├── 📁 entities/
│   │   │   ├── Coffee.ts          # Entidade raiz do agregado
│   │   │   ├── Market.ts          # Estado do mercado
│   │   │   └── Producer.ts        # Entidade do produtor
│   │   ├── 📁 value-objects/
│   │   │   ├── CoffeeGrade.ts     # Tipos e qualidade (Tipo 2, 4, 6, 8)
│   │   │   ├── Price.ts           # Valor monetário com moeda
│   │   │   └── Origin.ts          # Origem geográfica
│   │   └── 📁 services/
│   │       ├── QualityAssessment.ts  # Avaliação de qualidade SCA
│   │       └── ClimateIndex.ts       # Índices climáticos OpenWeather
│   ├── 📁 trading/                 # DOMÍNIO DE NEGOCIAÇÃO
│   │   ├── 📁 entities/
│   │   │   ├── Trade.ts           # Operação de compra/venda
│   │   │   ├── Position.ts        # Posição no mercado
│   │   │   └── Contract.ts        # Contratos futuros BMF/ICE
│   │   └── 📁 services/
│   │       ├── MonteCarloSimulation.ts   # Simulações de cenário
│   │       └── HedgeRecommendation.ts    # Recomendações de hedge
│   ├── 📁 hedge/                   # DOMÍNIO DE PROTEÇÃO/RISCO
│   │   ├── 📁 entities/
│   │   │   ├── HedgeStrategy.ts   # Estratégias de proteção
│   │   │   └── RiskAssessment.ts  # Avaliação de riscos
│   │   └── 📁 services/
│   │       └── RiskCalculation.ts # Cálculos de risco
│   └── 📁 climate/                # DOMÍNIO CLIMÁTICO
│       ├── 📁 entities/
│       │   └── WeatherData.ts     # Dados meteorológicos
│       └── 📁 services/
│           └── ClimateAnalysis.ts # Análise climática
├── 📁 application/
│   ├── 📁 use-cases/
│   │   ├── 📁 trading/
│   │   │   ├── SimulateVenda.ts      # UC: Simular venda
│   │   │   └── CalculatePrice.ts     # UC: Calcular preços
│   │   ├── 📁 market/
│   │   │   ├── GetMarketKPIs.ts      # UC: Obter KPIs
│   │   │   └── GenerateInsights.ts   # UC: Gerar insights
│   │   └── 📁 hedge/
│   │       └── CalculateHedgeRecommendation.ts
│   └── 📁 dtos/                 # Objetos de transferência
│       ├── MarketKPIsDTO.ts
│       ├── TradeSimulationDTO.ts
│       └── HedgeRecommendationDTO.ts
├── 📁 infrastructure/
│   ├── 📁 external-apis/        # Integrações conforme CLAUDE.md
│   │   ├── CommoditiesAPI.ts    # Commodities-API
│   │   ├── OpenWeatherAPI.ts    # OpenWeatherMap
│   │   ├── AlphaVantageAPI.ts   # Alpha Vantage
│   │   ├── ICEMarketDataAPI.ts  # ICE Market Data
│   │   └── YahooFinanceAPI.ts   # Yahoo Finance
│   ├── 📁 repositories/         # Padrão Repository
│   │   ├── MarketDataRepository.ts
│   │   └── CoffeeRepository.ts
│   └── 📁 web-scraping/        # Web scraping conforme spec
│       ├── CEPEAScraper.ts      # CEPEA/ESALQ
│       ├── CONABScraper.ts      # CONAB
│       ├── SCAScraper.ts        # SCA Coffee
│       └── IBGEScraper.ts       # IBGE
└── 📁 presentation/
    ├── 📁 components/
    │   ├── 📁 market/          # Componentes do domínio market
    │   │   ├── KpiCard.tsx
    │   │   └── MarketOverview.tsx
    │   ├── 📁 trading/         # Componentes do domínio trading
    │   │   ├── ScenarioCard.tsx
    │   │   └── PriceCalculator.tsx
    │   └── 📁 shared/          # Componentes reutilizáveis
    │       ├── Loading.tsx
    │       └── ErrorBoundary.tsx
    ├── 📁 hooks/               # Custom hooks por domínio
    │   ├── useMarketData.ts
    │   └── useTradingSimulation.ts
    └── 📁 pages/               # Páginas da aplicação
        └── KPIsProdutor.tsx
```

## 🎯 MAPEAMENTO DE MIGRAÇÃO ESPECÍFICO

### Do Componente Atual → Nova Estrutura DDD:

**ANTES (KPIsProdutor.tsx - Linha 148-160):**
```typescript
const calcularPrecoFinal = () => {
  const precoBase = 650;
  const ajusteQualidade = qualidade === 'tipo2' ? 1.0 : qualidade === 'tipo4' ? 0.95 : 0.85;
  const comissaoCanal = canal === 'cooperativa' ? 0.005 : 0.0075;
  // ... lógica de negócio misturada na UI
};
```

**DEPOIS (Separação DDD):**
```typescript
// Domain: domains/coffee-market/entities/Coffee.ts
export class Coffee {
  constructor(private grade: CoffeeGrade, private origin: Origin) {}
}

// Domain: domains/coffee-market/value-objects/Price.ts
export class Price {
  calculateAdjustedPrice(basePrice: number, grade: CoffeeGrade): number
}

// Use Case: application/use-cases/trading/CalculatePrice.ts
export class CalculatePriceUseCase {
  execute(input: CalculatePriceInput): CalculatePriceOutput
}

// Component: presentation/components/trading/PriceCalculator.tsx
export const PriceCalculator: FC<Props> = ({ onCalculate }) => {
  // Apenas UI, sem lógica de negócio
}
```

## 📐 CONFIGURAÇÕES TÉCNICAS OBRIGATÓRIAS

### 1. TypeScript Paths Mapping (tsconfig.json):
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "domains/*": ["./domains/*"],
      "application/*": ["./application/*"],
      "infrastructure/*": ["./infrastructure/*"],
      "presentation/*": ["./presentation/*"]
    }
  }
}
```

### 2. ESLint Rules DDD Enforcement:
```json
{
  "rules": {
    "@typescript-eslint/explicit-function-return-type": "error",
    "import/no-restricted-paths": [
      "error",
      {
        "zones": [
          {
            "target": "./domains",
            "from": ["./infrastructure", "./presentation"],
            "message": "Domain layer cannot depend on infrastructure or presentation"
          },
          {
            "target": "./application", 
            "from": ["./infrastructure", "./presentation"],
            "message": "Application layer cannot depend on infrastructure or presentation"
          }
        ]
      }
    ]
  }
}
```

### 3. Package.json Atualizado:
```json
{
  "name": "globalcoffe-react-app-v2",
  "version": "2.0.0",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:ddd": "eslint ./domains ./application --ext ts --max-warnings 0"
  }
}
```

## 🔄 ESTRATÉGIA DE MIGRAÇÃO

### Fase 1: Setup Estrutural (US-001)
1. ✅ Criar estrutura de diretórios DDD
2. ✅ Configurar path mappings 
3. ✅ Implementar ESLint rules
4. ✅ Criar arquivos base com exports

### Fase 2: Migração de Componentes Core
1. Extrair lógica de KPIsProdutor.tsx
2. Criar entities e value-objects
3. Implementar use-cases
4. Refatorar componentes de apresentação

### Fase 3: Integração de APIs
1. Substituir mocks por APIs reais
2. Implementar repositories
3. Configurar web scraping

## ⚡ DELIVERABLES CRÍTICOS DA US-001

✅ **P0 - Bloqueantes Absolutos:**
- Estrutura de diretórios DDD completa
- tsconfig.json com path mappings configurados
- package.json atualizado para v2
- ESLint rules DDD funcionando
- Build limpo sem erros

✅ **P1 - Essenciais:**
- README.md em cada domínio 
- Arquivos base com exports adequados
- Linting rules enforcement ativo
- Estrutura preparada para APIs reais

✅ **P2 - Importantes:**
- Migração inicial do KPIsProdutor.tsx
- Documentação de padrões
- Preparação para próximas user stories

## 🚀 PRÓXIMOS PASSOS

### Dependências da US-001:
- US-002: Implementação de Entities
- US-003: Implementação de Use Cases  
- US-004: Integração de APIs Externas
- US-005: Migração Completa de Componentes

### Estimativas:
- **US-001**: 89 story points (3 dias)
- **Total Épico**: 844 story points (28 user stories)

---

## ✅ APROVAÇÃO NECESSÁRIA

**Este plano arquitetural está alinhado com:**
- ✅ Especificação técnica do CLAUDE.md
- ✅ Estrutura DDD obrigatória
- ✅ Requirements da US-001
- ✅ Padrões de qualidade P0

**Aguardando aprovação para iniciar implementação no modo Code.**