# KPIs para Dashboard da Cooperativa - Plataforma Global Coffee

## Introdução

Este documento detalha os Indicadores-Chave de Desempenho (KPIs) mais relevantes para o dashboard da cooperativa na plataforma Global Coffee, especificamente para o sistema de Alertas Climáticos Simplificados. Os KPIs foram organizados em 6 categorias principais, totalizando 24 indicadores essenciais para o monitoramento e gestão eficaz das operações cooperativas.

## Categorias de KPIs

### 1. KPIs Operacionais

#### 1.1 Taxa de Resposta aos Alertas
- **O que faz**: Monitora o engajamento dos produtores com o sistema de alertas
- **O que mostra**: Percentual de produtores que visualizam e respondem aos alertas enviados
- **Fonte de dados**:
  - Logs do sistema de notificações (Firebase, SMS, WhatsApp)
  - Registro de confirmações de leitura
  - Ações tomadas após recebimento do alerta
- **Fórmula**: (Nº de alertas respondidos / Nº total de alertas enviados) × 100

#### 1.2 Tempo Médio de Resposta
- **O que faz**: Mede a agilidade na tomada de decisão após recebimento de alertas
- **O que mostra**: Tempo decorrido entre o envio do alerta e a primeira ação registrada
- **Fonte de dados**:
  - Timestamp de envio do alerta
  - Timestamp da primeira interação/ação do produtor
  - Logs de atividade no sistema
- **Medida**: Horas ou minutos (dependendo da criticidade)

#### 1.3 Cobertura Regional
- **O que faz**: Avalia a abrangência geográfica do sistema de monitoramento
- **O que mostra**: Percentual de áreas produtivas com monitoramento ativo
- **Fonte de dados**:
  - Cadastro de propriedades e suas localizações GPS
  - APIs de dados meteorológicos com cobertura regional
  - Mapeamento de áreas produtivas via satélite
- **Fórmula**: (Área monitorada / Área total de produção) × 100

#### 1.4 Taxa de Engajamento do Dashboard
- **O que faz**: Monitora o uso efetivo da plataforma pelos gestores da cooperativa
- **O que mostra**: Frequência e profundidade de uso das funcionalidades do dashboard
- **Fonte de dados**:
  - Analytics da plataforma (Google Analytics ou similar)
  - Logs de acesso e navegação
  - Tempo de sessão e páginas visitadas
- **Métricas**: DAU/MAU (Daily/Monthly Active Users), tempo médio de sessão

### 2. KPIs de Gestão de Riscos

#### 2.1 Precisão dos Alertas
- **O que faz**: Valida a confiabilidade do sistema de alertas
- **O que mostra**: Percentual de alertas que se confirmaram como eventos reais
- **Fonte de dados**:
  - Feedback dos produtores sobre ocorrência real
  - Dados meteorológicos históricos para validação
  - Relatórios de campo pós-evento
- **Fórmula**: (Alertas confirmados / Total de alertas emitidos) × 100

#### 2.2 Taxa de Falsos Positivos
- **O que faz**: Identifica alertas desnecessários que podem causar "fadiga de alerta"
- **O que mostra**: Percentual de alertas emitidos sem ocorrência real do evento
- **Fonte de dados**:
  - Validação cruzada com estações meteorológicas locais
  - Feedback dos produtores
  - Análise pós-evento
- **Fórmula**: (Alertas não confirmados / Total de alertas) × 100

#### 2.3 Índice de Severidade Climática
- **O que faz**: Classifica e monitora a gravidade dos eventos climáticos
- **O que mostra**: Escala de impacto potencial dos eventos monitorados (1-10)
- **Fonte de dados**:
  - APIs meteorológicas (OpenWeather, NOAA, INMET)
  - Modelos de previsão climática
  - Histórico de impactos em safras anteriores
- **Escala**: 1-3 (baixo), 4-6 (médio), 7-10 (crítico)

#### 2.4 Tempo de Antecedência dos Alertas
- **O que faz**: Mede a eficácia do sistema em fornecer avisos com tempo hábil
- **O que mostra**: Período entre a emissão do alerta e a ocorrência do evento
- **Fonte de dados**:
  - Timestamp de geração do alerta
  - Registro da ocorrência real do evento
  - Dados de previsão vs. realização
- **Medida**: Horas ou dias de antecedência

### 3. KPIs Econômicos

#### 3.1 Perdas Evitadas
- **O que faz**: Quantifica o valor econômico das ações preventivas
- **O que mostra**: Estimativa de perdas que foram prevenidas por ações baseadas em alertas
- **Fonte de dados**:
  - Histórico de perdas em eventos similares sem alertas
  - Relatórios de salvamento de produção
  - Cotação do café no período
  - Volume de produção protegida
- **Cálculo**: (Produção salva × Preço médio) - Custo das ações preventivas

#### 3.2 ROI das Ações Preventivas
- **O que faz**: Avalia o retorno sobre investimento em medidas de mitigação
- **O que mostra**: Relação entre benefícios obtidos e custos das ações preventivas
- **Fonte de dados**:
  - Custos de implementação de medidas preventivas
  - Valor das perdas evitadas
  - Custos operacionais do sistema
- **Fórmula**: ((Ganhos - Investimento) / Investimento) × 100

#### 3.3 Custo por Alerta Processado
- **O que faz**: Monitora a eficiência operacional do sistema
- **O que mostra**: Custo médio para processar e distribuir cada alerta
- **Fonte de dados**:
  - Custos de infraestrutura (servidores, APIs)
  - Custos de comunicação (SMS, WhatsApp)
  - Custos de pessoal
  - Volume de alertas processados
- **Cálculo**: Custo total do sistema / Número de alertas processados

#### 3.4 Impacto na Produtividade
- **O que faz**: Mede a influência do sistema na produtividade geral
- **O que mostra**: Variação percentual na produção após implementação dos alertas
- **Fonte de dados**:
  - Dados históricos de produção pré-sistema
  - Dados de produção pós-implementação
  - Fatores de ajuste sazonal
- **Fórmula**: ((Produção atual - Produção baseline) / Produção baseline) × 100

### 4. KPIs de Sustentabilidade

#### 4.1 Pegada de Carbono
- **O que faz**: Monitora o impacto ambiental da produção
- **O que mostra**: Emissões de CO2 equivalente por saca de café produzida
- **Fonte de dados**:
  - Consumo de combustíveis e energia
  - Uso de fertilizantes e defensivos
  - Práticas de manejo do solo
  - Calculadoras de carbono específicas para agricultura
- **Medida**: kg CO2eq/saca

#### 4.2 Eficiência Hídrica
- **O que faz**: Acompanha o uso racional de recursos hídricos
- **O que mostra**: Volume de água utilizado por quilograma de café processado
- **Fonte de dados**:
  - Medidores de consumo de água
  - Volume de café processado
  - Dados de irrigação
  - Registros de processamento pós-colheita
- **Medida**: Litros/kg de café

#### 4.3 Índice de Conformidade ESG
- **O que faz**: Avalia a aderência aos critérios ambientais, sociais e de governança
- **O que mostra**: Score consolidado de práticas sustentáveis (0-100)
- **Fonte de dados**:
  - Auditorias de certificação
  - Checklist de práticas ESG
  - Indicadores sociais (trabalho, comunidade)
  - Práticas de governança cooperativa
- **Componentes**: 40% Ambiental, 30% Social, 30% Governança

#### 4.4 Taxa de Adoção de Práticas Sustentáveis
- **O que faz**: Mede a implementação efetiva de recomendações sustentáveis
- **O que mostra**: Percentual de produtores adotando práticas recomendadas
- **Fonte de dados**:
  - Relatórios de assistência técnica
  - Visitas de campo
  - Autoavaliações dos produtores
  - Registros de treinamentos
- **Fórmula**: (Produtores com práticas adotadas / Total de produtores) × 100

### 5. KPIs de Comunicação e Engajamento

#### 5.1 Taxa de Abertura de Alertas
- **O que faz**: Monitora a efetividade dos canais de comunicação
- **O que mostra**: Percentual de alertas que são efetivamente visualizados
- **Fonte de dados**:
  - Estatísticas de entrega (SMS, WhatsApp, Email)
  - Confirmações de leitura
  - Analytics de push notifications
- **Fórmula**: (Alertas abertos / Alertas enviados) × 100

#### 5.2 Tempo de Disseminação
- **O que faz**: Avalia a velocidade de propagação das informações
- **O que mostra**: Tempo médio para que um alerta alcance todos os destinatários
- **Fonte de dados**:
  - Logs de envio em massa
  - Timestamps de entrega por canal
  - Análise de latência de rede
- **Medida**: Minutos ou segundos

#### 5.3 Satisfação dos Produtores (NPS)
- **O que faz**: Mede a satisfação e lealdade ao sistema de alertas
- **O que mostra**: Net Promoter Score do sistema (escala -100 a +100)
- **Fonte de dados**:
  - Pesquisas periódicas de satisfação
  - Feedback espontâneo dos usuários
  - Avaliações no app/sistema
- **Cálculo**: % Promotores - % Detratores

#### 5.4 Taxa de Conversão de Alertas em Ações
- **O que faz**: Mede a efetividade dos alertas em gerar ações concretas
- **O que mostra**: Percentual de alertas que resultam em medidas práticas
- **Fonte de dados**:
  - Registro de ações tomadas no sistema
  - Relatórios de campo
  - Check-in de atividades pós-alerta
- **Fórmula**: (Alertas com ações registradas / Total de alertas) × 100

### 6. KPIs de Qualidade de Dados

#### 6.1 Acurácia dos Dados Meteorológicos
- **O que faz**: Valida a precisão das previsões meteorológicas
- **O que mostra**: Percentual de acerto nas previsões climáticas
- **Fonte de dados**:
  - Comparação entre previsão e ocorrência real
  - Dados de estações meteorológicas de referência
  - Validação com múltiplas fontes
- **Fórmula**: (Previsões corretas / Total de previsões) × 100

#### 6.2 Completude dos Dados
- **O que faz**: Monitora a integridade das informações no sistema
- **O que mostra**: Percentual de dados completos vs. dados faltantes
- **Fonte de dados**:
  - Análise de campos obrigatórios preenchidos
  - Validação de integridade de dados
  - Logs de erro de coleta
- **Fórmula**: (Dados disponíveis / Dados necessários) × 100

#### 6.3 Latência dos Dados
- **O que faz**: Mede o tempo de processamento e disponibilização
- **O que mostra**: Tempo entre coleta e visualização no dashboard
- **Fonte de dados**:
  - Timestamps de coleta de dados
  - Timestamps de disponibilização
  - Logs de processamento
- **Medida**: Segundos ou minutos

#### 6.4 Taxa de Disponibilidade do Sistema
- **O que faz**: Monitora a confiabilidade da infraestrutura
- **O que mostra**: Percentual de tempo que o sistema está operacional
- **Fonte de dados**:
  - Monitoramento de uptime (Pingdom, New Relic)
  - Logs de incidentes
  - Relatórios de manutenção
- **Fórmula**: (Tempo operacional / Tempo total) × 100
- **Meta**: ≥ 99.9%

## Implementação e Visualização

### Dashboard Principal

O dashboard deve apresentar os KPIs em diferentes níveis de visualização:

1. **Visão Executiva**: KPIs críticos em cards com indicadores visuais (verde/amarelo/vermelho)
2. **Visão Operacional**: Gráficos detalhados com séries temporais e comparativos
3. **Visão Analítica**: Tabelas e relatórios exportáveis com dados granulares

### Periodicidade de Atualização

- **Tempo Real**: KPIs operacionais e de qualidade de dados
- **Horária**: KPIs de gestão de riscos e comunicação
- **Diária**: KPIs econômicos e de engajamento
- **Mensal**: KPIs de sustentabilidade e satisfação

### Alertas e Notificações

O sistema deve gerar alertas automáticos quando:
- KPIs operacionais caem abaixo de limites críticos
- Taxa de falsos positivos excede 15%
- Disponibilidade do sistema cai abaixo de 99.9%
- ROI das ações preventivas se torna negativo

## Conclusão

Este conjunto de 24 KPIs fornece uma visão abrangente e integrada do desempenho do sistema de Alertas Climáticos para cooperativas de café. A implementação efetiva destes indicadores permitirá:

1. Tomada de decisão baseada em dados
2. Otimização contínua dos processos
3. Demonstração de valor para stakeholders
4. Melhoria da sustentabilidade e eficiência operacional
5. Aumento da resiliência climática dos produtores associados

A revisão periódica destes KPIs e seus limites é essencial para manter o sistema alinhado com os objetivos estratégicos da cooperativa e as necessidades em evolução do setor cafeeiro.
