# Fluxo Detalhado do Perfil Produtor - Alertas Climáticos Simplificados

```mermaid
graph TD
  P[Produtor] -->|Login| P1[Login na plataforma Global Coffee]
  P1 -->|Acesso| P2[Dashboard Principal]
  P2 -->|Recebe| P3[Alertas personalizados]

  P3 -->|Visualiza| P3a[Notificação push ou alerta na tela]
  P3a -->|Clica| P3b[Alerta detalhado]

  P3b -->|Abre| P4[Detalhes do Alerta]
  P4 -->|Mostra| P4a[Informações do evento climático, impacto e recomendações]
  P4a -->|Opção| P4b[Marcar alerta como lido ou ignorar]
  P4a -->|Opção| P4c[Compartilhar alerta com cooperativa ou contatos]

  P2 -->|Configura| P5[Preferências de alerta]
  P5 -->|Clica| P5a["Configurações de Alertas"]
  P5a -->|Seleciona| P5b[Tipos de alertas (clima, mercado, notícias)]
  P5b -->|Define| P5c[Região e tipo de cultivo]
  P5c -->|Escolhe| P5d[Canais de notificação (push, SMS, WhatsApp, email)]
  P5d -->|Salva| P5e["Salvar Preferências"]
  P5e -->|Confirma| P5f[Confirmação de atualização]

  P2 -->|Visualiza| P6[Dashboard com insights climáticos]
  P6 -->|Mostra| P6a[Gráficos de tendências climáticas e riscos]
  P6a -->|Interage| P6b[Filtros por período, região e tipo de cultivo]
  P6b -->|Clica| P6c[Alertas críticos para detalhes]

  P2 -->|Reage| P7[Alertas críticos]
  P7 -->|Clica| P7a["Tomar Ação"]
  P7a -->|Seleciona| P7b[Ação recomendada (ex: ajustar irrigação)]
  P7b -->|Confirma| P7c[Confirma ação]
  P7c -->|Recebe| P7d[Feedback de registro da ação]
```

## Detalhes das Interações

- Login: input usuário e senha, autenticação.
- Alertas: notificação push ou dashboard.
- Configuração: checkboxes, dropdowns, botões.
- Dashboard: gráficos interativos, filtros.
- Reação: seleção e confirmação de ações, feedback.
