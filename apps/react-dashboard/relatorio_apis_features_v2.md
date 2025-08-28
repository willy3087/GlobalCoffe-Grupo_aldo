# Relatório de APIs e Fontes de Dados para Features V2

## 1. Análise de Requisitos da Tela Features V2

### Dados Necessários:

1. **Preços do Café**

   - Preço médio atual (R$/saca)
   - Preços por tipo (Arábica/Robusta)
   - Preços por qualidade (Tipo 2-8)
   - Preços mercado interno vs externo
   - Histórico de preços

2. **Classificação e Qualidade**

   - Tipos de café (defeitos)
   - Peneiras (tamanho do grão)
   - Bebida (mole, duro, riado, rio)
   - Impacto no preço por classificação

3. **Canais de Comercialização**

   - Volume via cooperativas
   - Volume via corretores
   - Comissões praticadas
   - Preferências regionais

4. **Mercados**

   - Volume mercado interno
   - Volume exportação
   - Principais compradores
   - Preços médios por destino

5. **Instrumentos Financeiros**

   - Cotações BMF (ICF)
   - Cotações NY (KC)
   - Percentual de hedge praticado

6. **Dados Climáticos**

   - Condições atuais das regiões produtoras
   - Previsões para safra
   - Alertas climáticos

## 2. Tabela de APIs e Dados Disponíveis

| Dado Necessário          | API Recomendada   | Custo        | Frequência | Cobertura  |
| ------------------------ | ----------------- | ------------ | ---------- | ---------- |
| **PREÇOS DO CAFÉ**       |                   |              |            |            |
| Preço spot atual         | CEPEA             | Gratuito\*   | Diário     | Brasil     |
| Preço Arábica/Robusta    | Commodities-API   | $49.99/mês   | Tempo real | Global     |
| Preços regionais         | Agro API          | ~$50/mês     | Diário     | Brasil     |
| Contratos futuros        | B3/BMF API        | Sob consulta | Tempo real | Brasil     |
| Preço NY (KC)            | Yahoo Finance     | Gratuito     | Tempo real | Global     |
| **DADOS CLIMÁTICOS**     |                   |              |            |            |
| Clima regiões produtoras | OpenWeatherMap    | $40/mês      | Horário    | Global     |
| Previsões detalhadas     | Tomorrow.io       | $99/mês      | Minuto     | Hiperlocal |
| Histórico climático      | Open-Meteo        | Gratuito     | Diário     | Global     |
| **INDICADORES TÉCNICOS** |                   |              |            |            |
| Análise técnica          | Alpha Vantage     | Gratuito\*   | Diário     | Global     |
| Volatilidade             | Trading Economics | Variável     | Diário     | Global     |

\*Com limitações de requisições

## 3. Dados NÃO Disponíveis nas APIs e Métodos de Captura Detalhados

### 3.1 CLASSIFICAÇÃO DE QUALIDADE DO CAFÉ

#### Tipos (Defeitos) - COB (Classificação Oficial Brasileira)

**Método 1: Web Scraping de Sites de Cooperativas**

```python
# Alvos principais:
- cooxupe.com.br/mercado/classificacao
- minasul.com.br/qualidade-cafe
- cooparaiso.com.br/servicos/classificacao

# Dados extraíveis:
- Tabela COB completa (Tipo 2 a 8)
- Número de defeitos por tipo
- Exemplos visuais de defeitos
```

**Método 2: OCR em Laudos de Classificação**

- Usar Tesseract OCR ou Google Vision API em PDFs de laudos
- Parceria com armazéns gerais que emitem laudos digitais
- Extração automática de: tipo, peneira, bebida, aspecto

**Método 3: API de Blockchain do Café (em desenvolvimento)**

- IBM Food Trust tem piloto com cooperativas brasileiras
- Farmer Connect blockchain inclui dados de qualidade
- Custo: Sob consulta, mas dados imutáveis

#### Peneiras (Tamanho do Grão)

**Método 1: Integração com Softwares de Beneficiamento**

```
Sistemas alvo:
- AGRIMANAGER (usado por 30% das cooperativas)
- SIAGRI (líder em gestão agrícola)
- Protocolo: REST API ou exportação CSV automatizada
```

**Método 2: Crowdsourcing via App Mobile**

- Produtor fotografa resultado da peneira
- IA classifica automaticamente (modelo treinado)
- Gamificação: pontos por contribuição = descontos em serviços

#### Bebida (Classificação Sensorial)

**Método 1: Parceria com Q-Graders Certificados**

- Brasil tem ~500 Q-graders certificados pela CQI
- Criar rede de avaliadores regionais
- Protocolo SCA (Specialty Coffee Association) digitalizado

**Método 2: Web Scraping de Leilões Online**

```python
# Sites de leilões com dados públicos:
- www.bsca.com.br/leiloes (Cup of Excellence)
- www.minasul.com.br/leilao-qualidade
- Dados: pontuação, descrição sensorial, preço final
```

### 3.2 CANAIS DE COMERCIALIZAÇÃO

#### Percentuais Cooperativa vs Corretor

**Método 1: Análise de Notas Fiscais Eletrônicas (NF-e)**

- Parceria com contadores rurais
- API SEFAZ (com autorização)
- Machine Learning para classificar vendedor

**Método 2: Web Scraping de Relatórios Públicos**

```python
# Fontes confirmadas:
- OCESP: www.ocesp.org.br/relatorios-anuais
- OCB: www.ocb.org.br/numeros-do-cooperativismo
- Extração: PyPDF2 + regex para tabelas
```

**Método 3: Surveys Automatizados via WhatsApp**

- Integração WhatsApp Business API
- Bot pergunta semanalmente: "Vendeu café? Para quem?"
- Incentivo: relatório personalizado de mercado

#### Comissões Praticadas

**Método 1: Mystery Shopping Digital**

- Criar perfis de produtores fictícios
- Solicitar cotações via email/WhatsApp
- Mapear comissões por região

**Método 2: Análise de Contratos Públicos**

- Contratos de cooperativas são públicos (Lei 5.764/71)
- Scraping de: Diário Oficial, sites de transparência
- Palavras-chave: "taxa administrativa", "comissão", "corretagem"

### 3.3 MERCADO INTERNO

#### Preços no Varejo

**Método 1: APIs de E-commerce**

```python
# Mercado Livre API (gratuita):
- Endpoint: /sites/MLB/search?q=cafe+graos
- Dados: preço, vendedor, localização, volume

# Web Scraping estruturado:
- Pão de Açúcar: www.paodeacucar.com
- Carrefour: www.carrefour.com.br
- Extra: www.extra.com.br
```

**Método 2: Nota Fiscal Paulista/Mineira**

- APIs estaduais de notas fiscais ao consumidor
- Análise de produtos com NCM 0901 (café)
- Preço médio por marca/tipo/região

**Método 3: Redes Sociais e Marketplaces**

```python
# Instagram Shopping:
- Hashtags: #cafesespeciais #vendadecafe
- Extração: Selenium + BeautifulSoup

# Facebook Marketplace:
- Graph API (com aprovação)
- Filtros: categoria café, localização
```

### 3.4 COMPONENTES DE CUSTO DETALHADOS

#### Custo de Produção Regionalizado

**Método 1: Integração com ERPs Agrícolas**

```
Parceiros potenciais:
- TOTVS Agro: API REST disponível
- Senior Agroindustrial: Webservice SOAP
- Protocolo: OAuth2, dados anonimizados
```

**Método 2: Análise de Licitações Públicas**

- Portal ComprasNet: www.comprasnet.gov.br
- Filtro: "insumos agrícolas", "defensivos café"
- Dados: preços de referência por região

**Método 3: Blockchain de Supply Chain**

- VeChain tem pilotos com café
- Hyperledger Fabric usado por cooperativas
- Dados: custos em cada etapa da cadeia

#### Custo de Logística

**Método 1: APIs de Transportadoras**

```python
# Correios (gratuita):
- Cálculo de frete para sacas
- API: apicorreios.com.br

# Tabelas ANTT:
- Web scraping: www.antt.gov.br/fretes
- Rotas específicas de regiões produtoras
```

**Método 2: Marketplaces de Frete**

- Fretebras API: www.fretebras.com.br/api
- TruckPad: desenvolvedores.truckpad.com.br
- Dados: preço por km, tipo de carga, sazonalidade

### 3.5 FERRAMENTAS E TECNOLOGIAS RECOMENDADAS

#### Stack de Web Scraping Robusto

```python
# Configuração anti-detecção:
from seleniumwire import webdriver
from fake_useragent import UserAgent
import undetected_chromedriver as uc

# Rotação de proxies:
proxies = ['luminati.io', 'smartproxy.com']

# Agendamento distribuído:
- Apache Airflow para orquestração
- Celery para tarefas assíncronas
- Redis para cache e filas
```

#### Machine Learning para Extração

```python
# NER (Named Entity Recognition) para contratos:
import spacy
nlp = spacy.load("pt_core_news_lg")

# Treinamento customizado para termos do café:
- "tipo 6 bebida dura": classificação
- "comissão 0,5%": taxa
- "FOB Santos": modalidade de venda
```

#### Compliance e Ética

1. **Robots.txt**: Sempre respeitar
2. **Rate Limiting**: Max 1 req/segundo
3. **User-Agent**: Identificar como bot
4. **Cache**: Mínimo 24h para dados estáticos
5. **LGPD**: Anonimização obrigatória

## 4. Plano de Implementação e Custos

### APIs Essenciais (Custo Mensal)

1. **CEPEA/B3**: Dados oficiais brasileiros - **Sob consulta** (~R$ 500-2000/mês)
2. **Commodities-API**: Preços globais - **$49.99/mês** (~R$ 250/mês)
3. **OpenWeatherMap**: Clima básico - **$40/mês** (~R$ 200/mês)
4. **Agro API**: Dados agrícolas BR - **~R$ 250/mês**

**Total APIs**: ~R$ 1.000-2.500/mês

### Desenvolvimento Adicional

1. **Web Scraping**
2. **Parcerias com Cooperativas**
3. **Entrada Manual de Dados**

### Fontes Gratuitas Recomendadas

1. **CONAB**: Custos de produção (relatórios PDF)
2. **CECAFÉ**: Volumes exportação (relatórios mensais)
3. **ABIC/ABICS**: Consumo interno (relatórios anuais)
4. **CNC**: Políticas e estatísticas do setor

## 5. Casos de Sucesso e Referências

### 5.1 Plataformas Similares no Mercado

1. **Safras & Mercado**: Usa web scraping + parcerias diretas
2. **Notícias Agrícolas**: Crowdsourcing via app mobile
3. **AgroLink**: APIs públicas + entrada manual verificada
4. **Coffee Network**: Blockchain para rastreabilidade

### 5.2 Métricas de Sucesso

- **Acurácia dos dados**: >95% para preços, >85% para classificação
- **Tempo de atualização**: <5 min para preços, <24h para qualidade
- **Cobertura geográfica**: 80% das regiões produtoras em 6 meses

## 6. Implementação Detalhada por Fonte de Dados

### 6.1 CONAB - Companhia Nacional de Abastecimento

**URL**: https://www.conab.gov.br/info-agro/safras/cafe

**Dados Disponíveis**:

- Custo de produção por região (PDF mensal)
- Estimativas de safra
- Balanço oferta/demanda

**Método de Extração**:

```python
import requests
from PyPDF2 import PdfReader
import pandas as pd

def extract_conab_data():
    # Download automático do boletim
    url = "https://www.conab.gov.br/info-agro/safras/cafe/boletim-da-safra-de-cafe"
    # Parse PDF com tabelas de custo
    # Regex para extrair valores R$/ha
    return structured_data
```

### 6.2 CECAFÉ - Conselho dos Exportadores de Café

**URL**: https://www.cecafe.com.br/dados-estatisticos/

**Dados Disponíveis**:

- Volume exportado por tipo
- Destinos de exportação
- Preços médios FOB

**Integração via Email Automático**:

- Assinar newsletter mensal
- Parser de email para extrair tabelas
- Validação cruzada com dados B3

### 6.3 Sistema de Cooperativas

#### COOXUPÉ (Maior cooperativa)

**Método de Parceria**:

1. Contato: comercial@cooxupe.com.br
2. Proposta de valor: Dashboard gratuito para cooperados
3. Contrapartida: Acesso a dados agregados anonimizados

**Dados Potenciais**:

- Classificação média mensal
- Volumes por canal
- Preços médios pagos

#### Sistema OCB/SESCOOP

**Portal**: https://www.ocb.org.br/numeros-cooperativismo

**Web Scraping Legal**:

```python
# Exemplo de scraping respeitando robots.txt
import time
from bs4 import BeautifulSoup

def scrape_ocb_data():
    headers = {'User-Agent': 'GlobalCoffee-Bot/1.0'}
    time.sleep(2)  # Rate limiting
    # Extrair tabelas de market share cooperativas
```

### 6.4 Marketplaces B2B de Café

#### ComexStat (Ministério da Economia)

**API Pública**: http://comexstat.mdic.gov.br/pt/home

**Dados**:

- NCM 0901: Todos os tipos de café
- Preços de exportação por porto
- Volume por país destino

**Implementação**:

```python
# API REST gratuita, sem limite
base_url = "http://api.comexstat.mdic.gov.br/v1"
params = {
    'ncm': '0901',
    'periodo': '202401-202412',
    'agregacao': 'municipio'
}
```

### 6.5 Inteligência de Mercado via Telegram/WhatsApp

#### Grupos de Produtores

**Estratégia**:

1. Bot observer em grupos públicos (com permissão)
2. NLP para extrair menções de preço/qualidade
3. Validação por múltiplas fontes

**Tecnologia**:

```python
from telethon import TelegramClient
import re

# Patterns para extrair dados
price_pattern = r'R\$?\s*(\d+[.,]\d+)'
quality_pattern = r'tipo\s*(\d+)|bebida\s*(\w+)'
```

### 6.6 Dados Governamentais Estaduais

#### IMA-MG (Instituto Mineiro de Agropecuária)

- Certificados de origem
- Qualidade média por município

#### Fundação SEADE (São Paulo)

- Preços no varejo
- Volume comercializado

#### EMATER (Vários estados)

- Assistência técnica = dados de campo
- Relatórios mensais por regional

## 7. Arquitetura de Dados Híbrida

### 7.1 Pipeline de Dados

```
1. COLETA
   ├── APIs Tempo Real (preços)
   ├── Web Scraping Diário (classificação)
   ├── Batch Semanal (relatórios PDF)
   └── Crowdsourcing Contínuo (app)

2. PROCESSAMENTO
   ├── Validação Cruzada
   ├── ML para Anomalias
   ├── Agregação Regional
   └── Cache Inteligente

3. ENTREGA
   ├── API GraphQL
   ├── WebSocket (real-time)
   ├── Push Notifications
   └── Relatórios PDF
```

### 7.2 Qualidade de Dados

- **Redundância**: Mínimo 3 fontes por dado crítico
- **Validação**: ML detecta outliers automáticos
- **Auditoria**: Blockchain para dados imutáveis
- **Feedback**: Produtores validam dados locais

### Diferenciais Competitivos

1. **Dados exclusivos** via parcerias diretas
2. **Atualização real-time** para preços
3. **Classificação automatizada** por IA
4. **Rede colaborativa** de produtores
5. **Transparência** via blockchain
