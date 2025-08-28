# 📋 PLANO DETALHADO: Resolução e Finalização do Storybook GlobalCoffee

## 🔍 **ANÁLISE DO ESTADO ATUAL**

**✅ O que já está implementado:**
- Configuração básica do Storybook (`.storybook/main.ts`, `.storybook/preview.ts`)
- Theme decorator personalizado (`.storybook/ThemeDecorator.tsx`)
- Manager personalizado (`.storybook/manager.js`)
- Stories dos BaseComponents criadas (`src/components/ui/BaseComponents.stories.tsx`)
- Scripts npm configurados no `package.json`

**❌ PROBLEMAS IDENTIFICADOS:**

1. **Dependências Desalinhadas**: O package.json mostra `@storybook/react-vite: ^9.1.3` mas o módulo não está sendo encontrado
2. **Configuração Minimalista Demais**: A configuração atual tem addons vazios
3. **Stories Incompletas**: Apenas BaseComponents tem stories, faltam os demais componentes
4. **Chakra UI Integration**: O projeto usa Chakra UI mas não há provider no Storybook

## 🎯 **PLANO DE RESOLUÇÃO COMPLETO**

### **FASE 1: Resolução de Dependências** 
```bash
# 1.1 Limpar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install

# 1.2 Verificar se @storybook/react-vite está instalado
npm ls @storybook/react-vite

# 1.3 Se necessário, reinstalar dependências compatíveis
npm install --save-dev @storybook/addon-essentials@^9.1.3
```

### **FASE 2: Configuração Corrigida**
```typescript
// .storybook/main.ts - Versão funcional
addons: [
  '@storybook/addon-essentials',
  '@storybook/addon-a11y'
]

// .storybook/preview.ts - Com Chakra UI Provider
decorators: [withChakraUI, withTheme]
```

### **FASE 3: Integração Chakra UI**
```typescript
// ChakraDecorator.tsx - Novo decorator necessário
export const withChakraUI = (Story: any) => (
  <ChakraProvider theme={theme}>
    <Story />
  </ChakraProvider>
);
```

### **FASE 4: Stories Completas dos Componentes**

**4.1 Componentes Base (✅ Parcialmente feito)**
- [ ] Finalizar BaseComponents.stories.tsx com Chakra UI
- [ ] Adicionar exemplos específicos do mercado de café

**4.2 Componentes Comuns**
- [ ] `StatusPill.stories.tsx` - Pills de status do mercado
- [ ] `StatusTag.stories.tsx` - Tags removíveis de café
- [ ] `ImageWithFallback.stories.tsx` - Imagens com fallback

**4.3 Ícones Customizados**
- [ ] `CustomIcons.stories.tsx` - Ícones temáticos (café, trends, charts)
- [ ] `WeatherIcons.stories.tsx` - Ícones climáticos

**4.4 Layout Components**
- [ ] `Layout.stories.tsx` - Layout principal com navegação
- [ ] `PageHeader.stories.tsx` - Headers de página

**4.5 Home Components**
- [ ] `HeroSection.stories.tsx` - Seção hero responsiva
- [ ] `StatsBar.stories.tsx` - Barra de estatísticas
- [ ] `FeaturesSection.stories.tsx` - Seção de funcionalidades

### **FASE 5: Documentação e Exemplos**
```markdown
# 5.1 Documentação Introdutória
- Introduction.stories.mdx - Visão geral do sistema
- DesignTokens.stories.mdx - Tokens de design

# 5.2 Guias Especializados
- DevelopmentGuide.stories.mdx - Guia de desenvolvimento
- AccessibilityGuide.stories.mdx - Guia de acessibilidade
- CoffeeBusinessContext.stories.mdx - Contexto de negócio

# 5.3 Exemplos Compostos
- ComponentComposition.stories.tsx - Composições complexas
- DashboardExamples.stories.tsx - Exemplos de dashboard
- CoffeeMarketExamples.stories.tsx - Casos específicos do café
```

### **FASE 6: Testes e Validação**
```bash
# 6.1 Executar Storybook
npm run storybook

# 6.2 Build de produção
npm run build-storybook

# 6.3 Validar todas as stories
# 6.4 Testar responsividade
# 6.5 Verificar acessibilidade
```

## 📊 **CRONOGRAMA DE EXECUÇÃO**

| Fase | Tempo Estimado | Prioridade |
|------|---------------|------------|
| Fase 1: Dependências | 30 min | 🔥 Crítica |
| Fase 2: Configuração | 15 min | 🔥 Crítica |
| Fase 3: Chakra Integration | 30 min | ⚡ Alta |
| Fase 4: Stories Core | 2h | ⚡ Alta |
| Fase 5: Documentação | 1h | 📚 Média |
| Fase 6: Testes | 30 min | ✅ Importante |

## 🎨 **RESULTADO ESPERADO**

**Storybook Funcional com:**
- ✅ 15+ componentes documentados
- ✅ Exemplos específicos do mercado de café
- ✅ Sistema de design completo
- ✅ Guias de desenvolvimento e acessibilidade
- ✅ Integração completa com Chakra UI
- ✅ Responsividade em todos os dispositivos
- ✅ Casos de uso reais (dashboard KPIs, calculadora de preços)

## 🔧 **COMANDOS PRINCIPAIS APÓS RESOLUÇÃO**

```bash
# Desenvolvimento
npm run storybook

# Build
npm run build-storybook

# URL do Storybook
http://localhost:6006
```

## 🎯 **PRÓXIMOS PASSOS ESPECÍFICOS**

1. **Resolver dependências** - Limpar node_modules e reinstalar
2. **Corrigir configuração** - Adicionar addons essenciais
3. **Integrar Chakra UI** - Criar decorator para provider
4. **Completar stories** - Documentar todos os componentes
5. **Validar funcionamento** - Testar execução e build

Este plano resolve os problemas de dependências identificados e completa toda a implementação do Storybook com documentação abrangente focada no contexto específico da GlobalCoffee (mercado de café, produtores, cooperativas, etc.).

---

**Status**: Plano criado - Aguardando aprovação para implementação
**Data**: 26/01/2025
**Responsável**: Equipe de desenvolvimento GlobalCoffee