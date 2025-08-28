flowchart TD
    %% API Climática Integrada - Predição e Captação de Dados
    subgraph API_Climatica_Integrada
        direction TB
        CD[Coleta e Integração de Dados]
        PD[Processamento e Predição]
        API[API REST para Consulta]
        AL[Alertas Climáticos Personalizados]
        FI[Integração com Módulo Financeiro]
        DB[Dashboard Climático]
    end

    CD --> PD
    PD --> API
    API --> AL
    API --> FI
    PD --> DB
    AL --> DB

    %% Ajustes para clareza nas conexões dos perfis
    Produtor --> P_Login --> P_Dashboard
    P_Dashboard --> P_Recebe_Alertas --> P_Visualiza_Alertas
    P_Dashboard --> P_Configura
    P_Dashboard --> P_Reage

    Cooperativa --> C_Login --> C_Dashboard
    C_Dashboard --> C_Recebe_Alertas --> C_Visualiza_Relatorios
    C_Dashboard --> C_Comunica_Produtores
    C_Dashboard --> C_Adapta_Estrategias

    Trader --> T_Login --> T_Dashboard
    T_Dashboard --> T_Recebe_Alertas --> T_Monitora
    T_Dashboard --> T_Decide_Operacoes
    T_Dashboard --> T_Configura_Notificacoes

    %% Fontes de Dados
    subgraph Fontes_de_Dados
        direction LR
        API_Meteorologica[API Meteorológica]
        Bolsa_Cafe[Bolsas de Café]
        Noticias[Notícias e Mídias Sociais]
        Dados_Economicos[Dados Econômicos e Exportação]
    end

    API_Meteorologica --> CD
    Bolsa_Cafe --> CD
    Noticias --> CD
    Dados_Economicos --> CD

    %% Funcionalidades de Predição
    subgraph Funcionalidades_Predicao
        direction TB
        Normalizacao[Normalização e Limpeza]
        Anomalias[Detecção de Anomalias]
        Modelos[Modelos de Linguagem (LLM)]
        Scoring[Scoring de Impacto e Relevância]
    end

    CD --> Normalizacao
    Normalizacao --> Anomalias
    Anomalias --> Modelos
    Modelos --> Scoring
    Scoring --> PD

    %% Interações dos Perfis
    subgraph Perfis_de_Usuario
        direction TB
        Produtor[Produtor]
        Cooperativa[Cooperativa]
        Trader[Trader]
    end

    subgraph Interacoes_Produtor
        direction TB
        P_Login[Login na plataforma]
        P_Dashboard[Dashboard Principal]
        P_Recebe_Alertas[Recebe alertas personalizados]
        P_Visualiza_Alertas[Visualiza alertas e notificações]
        P_Configura[Configura preferências de alerta]
        P_Reage[Reage a alertas críticos]
    end

    Produtor --> P_Login --> P_Dashboard
    P_Dashboard --> P_Recebe_Alertas --> P_Visualiza_Alertas
    P_Dashboard --> P_Configura
    P_Dashboard --> P_Reage

    subgraph Interacoes_Cooperativa
        direction TB
        C_Login[Login na plataforma]
        C_Dashboard[Dashboard Principal]
        C_Recebe_Alertas[Recebe alertas segmentados por região]
        C_Visualiza_Relatorios[Visualiza relatórios consolidados]
        C_Comunica_Produtores[Comunica produtores sobre riscos]
        C_Adapta_Estrategias[Adapta estratégias de cultivo]
    end

    Cooperativa --> C_Login --> C_Dashboard
    C_Dashboard --> C_Recebe_Alertas --> C_Visualiza_Relatorios
    C_Dashboard --> C_Comunica_Produtores
    C_Dashboard --> C_Adapta_Estrategias

    subgraph Interacoes_Trader
        direction TB
        T_Login[Login na plataforma]
        T_Dashboard[Dashboard Principal]
        T_Recebe_Alertas[Recebe alertas de mercado e clima]
        T_Monitora[Monitora volatilidade e volume de trading]
        T_Decide_Operacoes[Decide operações de compra e venda]
        T_Configura_Notificacoes[Configura canais de notificação]
    end

    Trader --> T_Login --> T_Dashboard
    T_Dashboard --> T_Recebe_Alertas --> T_Monitora
    T_Dashboard --> T_Decide_Operacoes
    T_Dashboard --> T_Configura_Notificacoes

    %% Integrações com outros módulos do sistema Global Coffee
    subgraph Integracoes_API_Climatica
        direction TB
        API_Climatica[API Climática Integrada]
        Modulo_Financeiro[Módulo Financeiro em Nuvem]
        Rastreabilidade[Rastreabilidade QR-Code + Blockchain]
        Portal_Ofertas[Portal Web de Ofertas Spot]
        Alertas[Alertas Climáticos Simplificados]
        Dashboard_Geral[Dashboard Geral da Aplicação]
    end

    API_Climatica --> Modulo_Financeiro
    API_Climatica --> Alertas
    API_Climatica --> Dashboard_Geral
    Modulo_Financeiro --> Portal_Ofertas
    Modulo_Financeiro --> Rastreabilidade
    Alertas --> Dashboard_Geral

    %% Representar claramente funções de predição e captação da API climática
    CD -.-> API_Climatica
    PD -.-> API_Climatica
    API -.-> API_Climatica
    AL -.-> Alertas

    %% Interações dos perfis com a API climática
    Produtor -.-> API_Climatica
    Cooperativa -.-> API_Climatica
    Trader -.-> API_Climatica
