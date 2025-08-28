# Global Coffee - Workspace

Projeto Global Coffee organizado como monorepo com workspace para gerenciar múltiplas aplicações.

## 📁 Estrutura

```
GlobalCoffe-Grupo_aldo/
├── apps/
│   ├── nextjs/           # Aplicação Next.js (documentação/admin)
│   └── react-dashboard/  # Dashboard React/Vite (KPIs Produtor)
├── docs/                 # Documentação do projeto
├── scripts/              # Scripts utilitários
└── package.json         # Configuração do workspace
```

## 🚀 Como usar

### Instalar dependências
```bash
npm run install-all
```

### Desenvolvimento
```bash
# Dashboard React (KPIs)
npm run dev:react

# Aplicação Next.js
npm run dev:next
```

### Build
```bash
# Dashboard React
npm run build:react

# Aplicação Next.js  
npm run build:next
```

### Testes
```bash
# Testes do dashboard React
npm run test:react
```

### Limpeza
```bash
# Limpar node_modules e builds
npm run clean
```

## 📋 Aplicações

### React Dashboard (`apps/react-dashboard/`)
- **Tecnologia**: React + Vite + Chakra UI
- **Propósito**: Dashboard KPIs para produtores de café
- **Port**: 5173 (dev)
- **Features**: Análise mercado, simulação cenários, canais comercialização

### Next.js App (`apps/nextjs/`)
- **Tecnologia**: Next.js + React
- **Propósito**: Documentação, admin e landing pages
- **Port**: 3000 (dev)
- **Features**: Gestão documentos, visualizações, MCP integração

## 🔧 Configuração

O workspace está configurado para:
- ✅ Gerenciar dependências centralizadamente
- ✅ Evitar conflitos entre projetos
- ✅ Versionamento independente
- ✅ Scripts unificados
- ✅ TypeScript compartilhado
