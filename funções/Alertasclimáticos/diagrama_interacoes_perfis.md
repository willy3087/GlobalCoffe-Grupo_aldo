```mermaid
flowchart TD
    subgraph Perfis_de_Usuario
        direction TB
        Produtor[Produtor]
        Cooperativa[Cooperativa]
        Trader[Trader]
    end    subgraph Interacoes_Produtor
        direction TB
        P_Login[Login na plataforma]
        P_Dashboard[Dashboard Principal]
        P_Recebe_Alertas[Recebe alertas personalizados]
        P_Visualiza_Alertas[Visualiza alertas e notificações]
        P_Configura[Configura preferências de alerta]
        P_Reage[Reage a alertas críticos]        Produtor --> P_Login --> P_Dashboard
        P_Dashboard --> P_Recebe_Alertas --> P_Visualiza_Alertas
        P_Dashboard --> P_Configura
        P_Dashboard --> P_Reage
    end    subgraph Interacoes_Cooperativa
        direction TB
        C_Login[Login na plataforma]
        C_Dashboard[Dashboard Principal]
        C_Recebe_Alertas[Recebe alertas segmentados por região]
        C_Visualiza_Relatorios[Visualiza relatórios consolidados]
        C_Comunica_Produtores[Comunica produtores sobre riscos]
        C_Adapta_Estrategias[Adapta estratégias de cultivo]        Cooperativa --> C_Login --> C_Dashboard
        C_Dashboard --> C_Recebe_Alertas --> C_Visualiza_Relatorios
        C_Dashboard --> C_Comunica_Produtores
        C_Dashboard --> C_Adapta_Estrategias
    end    subgraph Interacoes_Trader
        direction TB
        T_Login[Login na plataforma]
        T_Dashboard[Dashboard Principal]
        T_Recebe_Alertas[Recebe alertas de mercado e clima]
        T_Monitora[Monitora volatilidade e volume de trading]
        T_Decide_Operacoes[Decide operações de compra e venda]
        T_Configura_Notificacoes[Configura canais de notificação]        Trader --> T_Login --> T_Dashboard
        T_Dashboard --> T_Recebe_Alertas --> T_Monitora
        T_Dashboard --> T_Decide_Operacoes
        T_Dashboard --> T_Configura_Notificacoes
    end
```
