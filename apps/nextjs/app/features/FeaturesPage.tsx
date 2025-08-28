import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler
);

// Dados estáticos conforme original
const priceComponents = {
  production: {
    title: "Custo de Produção",
    value: 45,
    trend: "+2.3%",
    icon: "🌱",
  },
  logistics: {
    title: "Logística e Transporte",
    value: 15,
    trend: "+5.1%",
    icon: "🚚",
  },
  processing: {
    title: "Beneficiamento",
    value: 12,
    trend: "-1.2%",
    icon: "⚙️",
  },
  market: {
    title: "Margem de Mercado",
    value: 18,
    trend: "+3.7%",
    icon: "💹",
  },
  taxes: {
    title: "Impostos e Taxas",
    value: 10,
    trend: "0.0%",
    icon: "📋",
  },
};

const mainKPIs = [
  {
    icon: "☕",
    title: "Preço Atual (60kg)",
    value: "R$ 1.842",
    change: "+3.2%",
    positive: true,
  },
  {
    icon: "🌡️",
    title: "Índice Climático",
    value: "78/100",
    change: "Favorável",
    positive: true,
  },
  {
    icon: "📦",
    title: "Estoque Global",
    value: "158M sacas",
    change: "-2.1%",
    positive: false,
  },
  {
    icon: "🌍",
    title: "Demanda Mundial",
    value: "175M sacas",
    change: "+4.5%",
    positive: true,
  },
  {
    icon: "💱",
    title: "Taxa de Câmbio",
    value: "R$ 5.12",
    change: "+0.8%",
    positive: false,
  },
  {
    icon: "📊",
    title: "Volatilidade",
    value: "24.3%",
    change: "+8.2%",
    positive: false,
  },
];

const impactFactors = [
  { icon: "🌧️", name: "Clima", impact: "35%", color: "#2196F3" },
  { icon: "💵", name: "Câmbio", impact: "25%", color: "#4CAF50" },
  { icon: "📈", name: "Oferta/Demanda", impact: "20%", color: "#FF9800" },
  { icon: "⛽", name: "Combustível", impact: "10%", color: "#795548" },
  { icon: "🏛️", name: "Política", impact: "5%", color: "#9C27B0" },
  { icon: "🌐", name: "Outros", impact: "5%", color: "#607D8B" },
];

const mockNews = [
  {
    title: "Preços do café sobem 3% com preocupações climáticas",
    description:
      "Geadas no Sul de Minas Gerais elevam preocupações sobre a safra 2024/25, impulsionando os preços futuros.",
    date: "Há 2 horas",
    image:
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=150&h=100&fit=crop",
    relevance: "high",
    link: "#",
  },
  {
    title: "Exportações brasileiras de café crescem 12% em novembro",
    description:
      "Volume exportado atinge 3,5 milhões de sacas, superando expectativas do mercado.",
    date: "Há 5 horas",
    image:
      "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=150&h=100&fit=crop",
    relevance: "high",
    link: "#",
  },
  {
    title: "Colheita na Colômbia avança com boas condições",
    description:
      "Produtores colombianos relatam qualidade superior na safra atual, com produtividade acima da média.",
    date: "Há 8 horas",
    image:
      "https://images.unsplash.com/photo-1606791405792-1004f1718d0c?w=150&h=100&fit=crop",
    relevance: "medium",
    link: "#",
  },
  {
    title: "Demanda global por café premium aumenta 15%",
    description:
      "Consumidores em mercados desenvolvidos buscam cada vez mais cafés especiais e sustentáveis.",
    date: "Há 1 dia",
    image:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=150&h=100&fit=crop",
    relevance: "medium",
    link: "#",
  },
  {
    title: "Nova tecnologia promete aumentar produtividade em 20%",
    description:
      "Sistema de irrigação inteligente desenvolvido no Brasil pode revolucionar a cafeicultura.",
    date: "Há 2 dias",
    image:
      "https://images.unsplash.com/photo-1560707303-4e980ce876ad?w=150&h=100&fit=crop",
    relevance: "medium",
    link: "#",
  },
];

// Função para calcular probabilidades simuladas
function calculateProbabilities() {
  const factors = {
    climate: Math.random() * 0.3,
    exchange: Math.random() * 0.2,
    supply: Math.random() * 0.2,
    demand: Math.random() * 0.15,
    volatility: Math.random() * 0.15,
  };
  const baseProb =
    Object.values(factors).reduce((a, b) => a + b, 0) / Object.keys(factors).length;

  return {
    week: {
      up: Math.round((baseProb + Math.random() * 0.2) * 100),
      target: "R$ 1.880 - R$ 1.920",
    },
    month: {
      up: Math.round((baseProb + Math.random() * 0.15) * 100),
      target: "R$ 1.850 - R$ 1.950",
    },
    semester: {
      up: Math.round((baseProb + Math.random() * 0.1) * 100),
      target: "R$ 1.750 - R$ 2.100",
    },
  };
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1 },
  }),
};

const FeaturesPage: React.FC = () => {
  const [probabilities, setProbabilities] = useState(calculateProbabilities());

  useEffect(() => {
    const interval = setInterval(() => {
      setProbabilities(calculateProbabilities());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Dados para gráfico doughnut
  const doughnutData = {
    labels: Object.keys(priceComponents).map(
      (key) => priceComponents[key].title
    ),
    datasets: [
      {
        data: Object.keys(priceComponents).map(
          (key) => priceComponents[key].value
        ),
        backgroundColor: [
          "#4CAF50",
          "#2196F3",
          "#FF9800",
          "#9C27B0",
          "#607D8B",
        ],
        borderWidth: 2,
        borderColor: "#1a1a1a",
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          color: "#333",
          padding: 20,
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return context.label + ": " + context.parsed + "%";
          },
        },
      },
    },
  };

  return (
    <div className="features-page" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", backgroundColor: "#f4f6f8", color: "#333", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header
        className="app-header"
        style={{
          height: 60,
          backgroundColor: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          flexShrink: 0,
        }}
      >
        <div className="header-logo" style={{ display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: 24, fontWeight: "bold", color: "#3498db" }}>☕ GlobalCoffee</span>
        </div>
        <nav className="header-menu" aria-label="Menu principal">
          <ul style={{ listStyle: "none", display: "flex", margin: 0, padding: 0, gap: 24 }}>
            <li><a href="#home" style={{ textDecoration: "none", color: "#333", fontWeight: 600, fontSize: 16, padding: "8px 0", transition: "color 0.3s ease" }} onFocus={(e) => e.currentTarget.style.color = "#3498db"} onBlur={(e) => e.currentTarget.style.color = "#333"}>Home</a></li>
            <li><a href="features.html" style={{ textDecoration: "none", color: "#333", fontWeight: 600, fontSize: 16, padding: "8px 0", transition: "color 0.3s ease" }} onFocus={(e) => e.currentTarget.style.color = "#3498db"} onBlur={(e) => e.currentTarget.style.color = "#333"}>Features</a></li>
            <li><a href="pricing.html" style={{ textDecoration: "none", color: "#333", fontWeight: 600, fontSize: 16, padding: "8px 0", transition: "color 0.3s ease" }} onFocus={(e) => e.currentTarget.style.color = "#3498db"} onBlur={(e) => e.currentTarget.style.color = "#333"}>Pricing</a></li>
            <li><a href="#about" style={{ textDecoration: "none", color: "#333", fontWeight: 600, fontSize: 16, padding: "8px 0", transition: "color 0.3s ease" }} onFocus={(e) => e.currentTarget.style.color = "#3498db"} onBlur={(e) => e.currentTarget.style.color = "#333"}>About</a></li>
            <li><a href="dashboard_kpis.html" style={{ textDecoration: "none", color: "#333", fontWeight: 600, fontSize: 16, padding: "8px 0", transition: "color 0.3s ease" }} onFocus={(e) => e.currentTarget.style.color = "#3498db"} onBlur={(e) => e.currentTarget.style.color = "#333"}>Clima</a></li>
          </ul>
        </nav>
        <div className="header-actions" style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <button
            className="notification-button"
            aria-label="Notificações"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#333",
              padding: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "color 0.3s ease",
            }}
            onFocus={(e) => (e.currentTarget.style.color = "#3498db")}
            onBlur={(e) => (e.currentTarget.style.color = "#333")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4a1.5 1.5 0 0 0-3 0v.68C7.63 5.36 6 7.92 6 11v5l-1.99 2H20l-2-2z" />
            </svg>
          </button>
          <div className="user-avatar" style={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: 24 }} role="img" aria-label="Usuário">👤</span>
          </div>
        </div>
      </header>

      <main className="container" style={{ width: "100%", flex: 1, display: "flex", flexDirection: "column" }}>
        <h1 style={{ textAlign: "center", margin: "20px 0", padding: "0 20px", fontSize: 24, color: "#333" }}>
          📊 Análise de Componentes do Preço do Café
        </h1>

        <div
          className="main-container"
          style={{
            display: "flex",
            gap: 20,
            width: "100%",
            height: "100%",
            flex: 1,
            padding: 20,
            overflowY: "auto",
          }}
        >
          <section className="content-area" style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
            {/* KPI Cards Section */}
            <div
              className="kpi-grid"
              id="kpiGrid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: "1rem",
                marginBottom: "2rem",
              }}
              aria-label="Indicadores principais"
            >
              {mainKPIs.map((kpi, index) => (
                <motion.div
                  key={kpi.title}
                  className="kpi-card"
                  style={{
                    background: "white",
                    borderRadius: 8,
                    padding: "0.8rem",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    border: "1px solid #e0e0e0",
                    textAlign: "center",
                    cursor: "default",
                  }}
                  whileHover={{ y: -5, boxShadow: "0 8px 25px rgba(0,0,0,0.15)" }}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  variants={containerVariants}
                  tabIndex={0}
                  role="group"
                  aria-label={`${kpi.title}, valor ${kpi.value}, variação ${kpi.change}`}
                >
                  <div className="kpi-icon" style={{ fontSize: "1.5rem", marginBottom: "0.2rem" }} aria-hidden="true">
                    {kpi.icon}
                  </div>
                  <div className="kpi-title" style={{ color: "#7f8c8d", fontSize: "0.7rem", textTransform: "uppercase", marginBottom: "0.2rem", lineHeight: 1.2 }}>
                    {kpi.title}
                  </div>
                  <div className="kpi-value" style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#2c3e50", marginBottom: "0.2rem" }}>
                    {kpi.value}
                  </div>
                  <div
                    className={`kpi-change ${kpi.positive ? "positive" : "negative"}`}
                    style={{
                      fontSize: "0.75rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.2rem",
                      color: kpi.positive ? "#4CAF50" : "#f44336",
                    }}
                    aria-live="polite"
                  >
                    {kpi.positive ? "↑" : "↓"} {kpi.change}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Predictions Section */}
            <section
              className="predictions-section"
              style={{
                backgroundColor: "white",
                borderRadius: 8,
                padding: "1.5rem",
                marginBottom: "2rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
              aria-labelledby="predictions-header"
            >
              <div
                className="predictions-header"
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}
              >
                <h2 id="predictions-header" style={{ margin: 0, fontSize: "1.3rem", color: "#2c3e50" }}>
                  📊 Previsões de Mercado
                </h2>
                <span className="loading" aria-label="Carregando previsões" role="status" />
              </div>
              <div
                className="predictions-grid"
                id="predictionsGrid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "1.5rem",
                }}
              >
                {[
                  { name: "Próxima Semana", data: probabilities.week },
                  { name: "Próximo Mês", data: probabilities.month },
                  { name: "Próximo Semestre", data: probabilities.semester },
                ].map((period) => {
                  const upProb = period.data.up;
                  const downProb = 100 - upProb;
                  return (
                    <motion.div
                      key={period.name}
                      className="prediction-card"
                      style={{
                        backgroundColor: "#f8f9fa",
                        borderRadius: 6,
                        padding: "1rem",
                        border: "1px solid #e0e0e0",
                        cursor: "default",
                      }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      tabIndex={0}
                      role="group"
                      aria-label={`${period.name} - Probabilidade de alta ${upProb}%, probabilidade de baixa ${downProb}%, faixa prevista ${period.data.target}`}
                    >
                      <div className="prediction-title" style={{ fontSize: "1rem", marginBottom: "0.8rem", color: "#4CAF50" }}>
                        {period.name}
                      </div>

                      <div style={{ marginBottom: "1rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                          <span>Alta</span>
                          <span>{upProb}%</span>
                        </div>
                        <div
                          className="probability-bar"
                          style={{
                            backgroundColor: "#e9ecef",
                            height: 24,
                            borderRadius: 12,
                            marginBottom: "0.8rem",
                            position: "relative",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            className="probability-fill up-probability"
                            style={{
                              height: "100%",
                              borderRadius: 15,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontWeight: "bold",
                              transition: "width 1s ease-in-out",
                              width: `${upProb}%`,
                              background: "linear-gradient(90deg, #2e7d32 0%, #4CAF50 100%)",
                            }}
                          >
                            {upProb}%
                          </div>
                        </div>
                      </div>

                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                          <span>Baixa</span>
                          <span>{downProb}%</span>
                        </div>
                        <div
                          className="probability-bar"
                          style={{
                            backgroundColor: "#e9ecef",
                            height: 24,
                            borderRadius: 12,
                            marginBottom: "0.8rem",
                            position: "relative",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            className="probability-fill down-probability"
                            style={{
                              height: "100%",
                              borderRadius: 15,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontWeight: "bold",
                              transition: "width 1s ease-in-out",
                              width: `${downProb}%`,
                              background: "linear-gradient(90deg, #d32f2f 0%, #f44336 100%)",
                            }}
                          >
                            {downProb}%
                          </div>
                        </div>
                      </div>

                      <div
                        className="prediction-details"
                        style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "#6c757d" }}
                      >
                        <span>Faixa Prevista:</span>
                        <span style={{ color: "#4CAF50" }}>{period.data.target}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* Components Chart Section */}
            <section
              className="components-section"
              style={{
                backgroundColor: "white",
                borderRadius: 8,
                padding: "1.5rem",
                marginBottom: "2rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
              aria-labelledby="components-chart-title"
            >
              <h2 id="components-chart-title" style={{ color: "#2c3e50", marginBottom: "1rem", fontSize: "1.3rem" }}>
                📈 Composição do Preço do Café
              </h2>
              <div className="chart-container" style={{ position: "relative", height: 350, marginTop: "1.5rem" }}>
                <Doughnut data={doughnutData} options={doughnutOptions} aria-label="Gráfico de composição do preço do café" role="img" />
              </div>
            </section>

            {/* Impact Factors Section */}
            <section
              className="components-section"
              style={{
                backgroundColor: "white",
                borderRadius: 8,
                padding: "1.5rem",
                marginBottom: "2rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
              aria-labelledby="impact-factors-title"
            >
              <h2 id="impact-factors-title" style={{ color: "#2c3e50", marginBottom: "1rem", fontSize: "1.3rem" }}>
                ⚡ Fatores de Impacto
              </h2>
              <div
                className="factors-grid"
                id="factorsGrid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "1rem",
                  marginTop: "1rem",
                }}
              >
                {impactFactors.map((factor, index) => (
                  <motion.div
                    key={factor.name}
                    className="factor-item"
                    style={{
                      backgroundColor: "#f8f9fa",
                      borderRadius: 8,
                      padding: "1rem",
                      border: "1px solid #e0e0e0",
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      cursor: "default",
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    tabIndex={0}
                    role="group"
                    aria-label={`${factor.name} com impacto de ${factor.impact}`}
                  >
                    <div className="factor-icon" style={{ fontSize: "2rem" }} aria-hidden="true">
                      {factor.icon}
                    </div>
                    <div className="factor-info" style={{ flex: 1 }}>
                      <div className="factor-name" style={{ fontSize: "0.9rem", color: "#6c757d" }}>
                        {factor.name}
                      </div>
                      <div
                        className="factor-impact"
                        style={{ fontSize: "1.1rem", fontWeight: "bold", color: factor.color }}
                      >
                        {factor.impact}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </section>

          {/* News Sidebar */}
          <aside
            className="sidebar"
            style={{
              flex: "0 0 320px",
              background: "white",
              padding: 20,
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              height: "calc(100% - 20px)",
              overflowY: "auto",
            }}
            aria-label="Notícias do Mercado"
          >
            <div
              className="sidebar-header"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
                borderBottom: "2px solid #3498db",
                paddingBottom: 10,
              }}
            >
              <h2 style={{ margin: 0, color: "#2c3e50", fontSize: "1.2rem" }}>Notícias do Mercado</h2>
              <button
                className="refresh-btn"
                onClick={() => {
                  // Simular atualização embaralhando notícias
                  const shuffled = [...mockNews].sort(() => Math.random() - 0.5);
                  setNews(shuffled);
                }}
                aria-label="Atualizar notícias"
                style={{
                  background: "#3498db",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontSize: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#2980b9")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#3498db")}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <polyline points="23 4 23 10 17 10" />
                  <polyline points="1 20 1 14 7 14" />
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                </svg>
                Atualizar
              </button>
            </div>
            <div id="newsContainer">
              {news.map((item, index) => (
                <article
                  key={index}
                  className="news-item"
                  style={{
                    display: "flex",
                    gap: 12,
                    marginBottom: 20,
                    paddingBottom: 20,
                    borderBottom: index === news.length - 1 ? "none" : "1px solid #e0e0e0",
                    transition: "all 0.3s ease",
                    cursor: "default",
                  }}
                  tabIndex={0}
                  aria-label={`Notícia: ${item.title}, ${item.description}, relevância ${item.relevance}`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="news-thumb"
                    style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 6, flexShrink: 0 }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).onerror = null;
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA4MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRTBFMEUwIi8+CjxwYXRoIGQ9Ik00MCAyNUMzNy4yMzg2IDI1IDM1IDI3LjIzODYgMzUgMzBDMzUgMzIuNzYxNCAzNy4yMzg2IDM1IDQwIDM1QzQyLjc2MTQgMzUgNDUgMzIuNzYxNCA0NSAzMEM0NSAyNy4yMzg2IDQyLjc2MTQgMjUgNDAgMjVaIiBmaWxsPSIjOTk5OTk5Ii8+Cjwvc3ZnPg==";
                    }}
                  />
                  <div className="news-content" style={{ flex: 1, minWidth: 0 }}>
                    <h3
                      className="news-title"
                      style={{
                        fontWeight: 600,
                        fontSize: 14,
                        margin: "0 0 8px 0",
                        lineHeight: 1.3,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        lineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#2c3e50", textDecoration: "none" }}
                        onFocus={(e) => (e.currentTarget.style.color = "#3498db")}
                        onBlur={(e) => (e.currentTarget.style.color = "#2c3e50")}
                      >
                        {item.title}
                      </a>
                    </h3>
                    <p
                      className="news-description"
                      style={{
                        fontSize: 12,
                        color: "#666",
                        margin: "0 0 8px 0",
                        lineHeight: 1.4,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        lineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.description}
                    </p>
                    <div
                      className="news-meta"
                      style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, color: "#999" }}
                    >
                      <span
                        className={`news-relevance ${item.relevance}`}
                        style={{
                          background: item.relevance === "high" ? "#d4edda" : "#f0f0f0",
                          color: item.relevance === "high" ? "#155724" : "#856404",
                          padding: "2px 8px",
                          borderRadius: 12,
                          fontWeight: 500,
                        }}
                      >
                        {item.relevance === "high" ? "Alta relevância" : "Relevância média"}
                      </span>
                      <span className="news-date">{item.date}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default FeaturesPage;