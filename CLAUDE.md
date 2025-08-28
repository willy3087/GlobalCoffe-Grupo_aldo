# Dashboard KPIs Produtor - Especificação Técnica Compacta

## 📊 APIs e Integrações Necessárias

### APIs Externas
- **Commodities-API** → Preços café USD/BRL
- **OpenWeatherMap** → Dados climáticos, Climate Index  
- **USDA FAS** → Volumes produção/exportação
- **Alpha Vantage** → Volatilidade, análise técnica
- **ICE Market Data** → Preços bolsa NY
- **Yahoo Finance** → Câmbio USD/BRL
- **NewsAPI** → Feed notícias

### Web Scraping
- **CEPEA/ESALQ** → Preços regionais, ajustes qualidade
- **CONAB** → Análise canais
- **SCA Coffee** → Scores qualidade
- **IBGE** → Custos produção

## 🔗 Mapeamento Simplificado

### KPIs Principais (linhas 160-165)
- **Preço Médio**: Commodities-API + Yahoo Finance
- **Tipo Valorizado**: SCA Score (scraping) 
- **Melhor Canal**: CONAB (scraping)
- **Clima Safra**: OpenWeatherMap (Climate Index)

### Cenários (linhas 167-171)
- Otimista: +15% (25% prob)
- Realista: +5% (60% prob)
- Pessimista: -10% (15% prob)

### Canais (linhas 493-553)
- **Cooperativa**: Segurança 95%, Comissão 0.5%
- **Corretor**: Flexibilidade 100%, Comissão 0.5-1%

### Componentes Preço (linhas 673-701)
- Produção 45% | Logística 20% | Benefício 15% | Mercado 12% | Taxas 8%

### Proteção (linhas 747-854)
- Contratos BMF/ICE (manual)
- Eficácia: Backtesting 5 anos
- Recomendações: IA/Algoritmos

## ⚠️ Status Atual
Todos valores são mocks em `KPIsProdutor.tsx`. Implementação real requer configuração das APIs e desenvolvimento dos algoritmos.