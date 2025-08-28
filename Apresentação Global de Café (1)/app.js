// Global Coffee - Sistema de Apresentação Completo - VERSÃO CORRIGIDA
class GlobalCoffeePresentation {
  constructor() {
    this.currentSlide = 1;
    this.totalSlides = 10;
    this.charts = {};
    this.isInitialized = false;
    this.init();
  }

  init() {
    // Aguardar DOM estar completamente carregado
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.initializeApp());
    } else {
      this.initializeApp();
    }
  }

  initializeApp() {
    this.setupNavigation();
    this.showSlide(1);
    this.setupKeyboardNavigation();
    this.setupAnimations();
    this.isInitialized = true;
    console.log("✅ Global Coffee Presentation initialized successfully");
  }

  // Sistema de Navegação Corrigido
  setupNavigation() {
    // Remover listeners anteriores se existirem
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.replaceWith(link.cloneNode(true));
    });

    // Adicionar novos listeners corretos
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const slideNumber = parseInt(link.getAttribute("data-slide"));
        if (slideNumber >= 1 && slideNumber <= this.totalSlides) {
          this.goToSlide(slideNumber);
        }
      });
    });
  }

  setupKeyboardNavigation() {
    // Remover listener anterior se existir
    document.removeEventListener("keydown", this.keyboardHandler);

    // Adicionar novo listener
    this.keyboardHandler = (e) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        this.nextSlide();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        this.previousSlide();
      }
    };

    document.addEventListener("keydown", this.keyboardHandler);
  }

  goToSlide(slideNumber) {
    if (slideNumber < 1 || slideNumber > this.totalSlides) return;

    console.log(`🎯 Navegando para slide ${slideNumber}`);

    // Ocultar slide atual
    const currentSlideElement = document.querySelector(".slide.active");
    if (currentSlideElement) {
      currentSlideElement.classList.remove("active");
    }

    // Mostrar novo slide
    const newSlideElement = document.getElementById(`slide-${slideNumber}`);
    if (newSlideElement) {
      newSlideElement.classList.add("active");
      this.currentSlide = slideNumber;
      this.updateNavigation();
      this.initializeChartsForSlide(slideNumber);
      this.triggerSlideAnimations(slideNumber);
    }
  }

  showSlide(slideNumber) {
    this.goToSlide(slideNumber);
  }

  nextSlide() {
    if (this.currentSlide < this.totalSlides) {
      this.goToSlide(this.currentSlide + 1);
    }
  }

  previousSlide() {
    if (this.currentSlide > 1) {
      this.goToSlide(this.currentSlide - 1);
    }
  }

  updateNavigation() {
    // Atualizar links ativos
    document.querySelectorAll(".nav-link").forEach((link) => {
      const slideNumber = parseInt(link.getAttribute("data-slide"));
      if (slideNumber === this.currentSlide) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  // Inicialização de Gráficos por Slide
  initializeChartsForSlide(slideNumber) {
    switch (slideNumber) {
      case 3:
        this.createGrowthChart();
        this.createDigitalizationChart();
        break;
      case 6:
        this.createInvestmentChart();
        break;
      case 7:
        this.createAlertTypesChart();
        break;
      case 9:
        this.createRevenueChart();
        break;
    }
  }

  // Criação de Gráficos
  createGrowthChart() {
    const ctx = document.getElementById("growthChart");
    if (!ctx || this.charts.growthChart) return;

    const data = {
      labels: [
        "Café Especial",
        "Roasters/Marcas",
        "Cooperativas",
        "Traders/Export.",
        "Commodity",
      ],
      datasets: [
        {
          label: "Crescimento (%)",
          data: [12, 8.1, 6.5, 4.2, 2.5],
          backgroundColor: [
            "#1FB8CD",
            "#FFC185",
            "#B4413C",
            "#ECEBD5",
            "#5D878F",
          ],
          borderColor: "#8B4513",
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    };

    this.charts.growthChart = new Chart(ctx, {
      type: "bar",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#8B4513",
            titleColor: "#fff",
            bodyColor: "#fff",
            borderColor: "#D2691E",
            borderWidth: 1,
            cornerRadius: 8,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 15,
            ticks: {
              callback: function (value) {
                return value + "%";
              },
              color: "#8B4513",
            },
            grid: { color: "rgba(139, 69, 19, 0.1)" },
          },
          x: {
            ticks: { color: "#8B4513" },
            grid: { display: false },
          },
        },
      },
    });
  }

  createDigitalizationChart() {
    const ctx = document.getElementById("digitalizationChart");
    if (!ctx || this.charts.digitalizationChart) return;

    const data = {
      labels: [
        "Roasters/Marcas",
        "Traders/Export.",
        "Café Especial",
        "Cooperativas",
        "Commodity",
      ],
      datasets: [
        {
          label: "Digitalização (%)",
          data: [70, 55, 45, 30, 25],
          backgroundColor: [
            "#DB4545",
            "#D2BA4C",
            "#964325",
            "#944454",
            "#13343B",
          ],
          borderColor: "#8B4513",
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    };

    this.charts.digitalizationChart = new Chart(ctx, {
      type: "bar",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y",
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#8B4513",
            titleColor: "#fff",
            bodyColor: "#fff",
            borderColor: "#D2691E",
            borderWidth: 1,
            cornerRadius: 8,
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 80,
            ticks: {
              callback: function (value) {
                return value + "%";
              },
              color: "#8B4513",
            },
            grid: { color: "rgba(139, 69, 19, 0.1)" },
          },
          y: {
            ticks: { color: "#8B4513" },
            grid: { display: false },
          },
        },
      },
    });
  }

  createInvestmentChart() {
    const ctx = document.getElementById("investmentChart");
    if (!ctx || this.charts.investmentChart) return;

    const data = {
      labels: [
        "EUDR Compliance Scanner",
        "App Mobile Offline-First",
        "Blockchain QR Code",
        "API Preços Real-time",
        "Integração PIX",
        "Sistema Assinatura",
      ],
      datasets: [
        {
          data: [300, 200, 200, 150, 100, 50],
          backgroundColor: [
            "#1FB8CD",
            "#FFC185",
            "#B4413C",
            "#ECEBD5",
            "#5D878F",
            "#DB4545",
          ],
          borderColor: "#8B4513",
          borderWidth: 2,
          hoverOffset: 4,
        },
      ],
    };

    this.charts.investmentChart = new Chart(ctx, {
      type: "pie",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#8B4513",
              font: { size: 12 },
              padding: 15,
            },
          },
          tooltip: {
            backgroundColor: "#8B4513",
            titleColor: "#fff",
            bodyColor: "#fff",
            borderColor: "#D2691E",
            borderWidth: 1,
            cornerRadius: 8,
            callbacks: {
              label: function (context) {
                return (
                  context.label +
                  ": USD " +
                  context.parsed.toLocaleString() +
                  "k"
                );
              },
            },
          },
        },
      },
    });
  }

  createAlertTypesChart() {
    const ctx = document.getElementById("alertTypesChart");
    if (!ctx || this.charts.alertTypesChart) return;

    const data = {
      labels: [
        "Volatilidade Preços",
        "Impacto Notícias",
        "Eventos Climáticos",
        "Análise Sentimento",
        "Atualizações Comerciais",
      ],
      datasets: [
        {
          label: "Percentual",
          data: [35, 25, 18, 12, 10],
          backgroundColor: [
            "#D2BA4C",
            "#964325",
            "#944454",
            "#13343B",
            "#1FB8CD",
          ],
          borderColor: "#8B4513",
          borderWidth: 2,
          hoverOffset: 4,
        },
      ],
    };

    this.charts.alertTypesChart = new Chart(ctx, {
      type: "doughnut",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "60%",
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#8B4513",
              font: { size: 12 },
              padding: 15,
            },
          },
          tooltip: {
            backgroundColor: "#8B4513",
            titleColor: "#fff",
            bodyColor: "#fff",
            borderColor: "#D2691E",
            borderWidth: 1,
            cornerRadius: 8,
            callbacks: {
              label: function (context) {
                return context.label + ": " + context.parsed + "%";
              },
            },
          },
        },
      },
    });
  }

  createRevenueChart() {
    const ctx = document.getElementById("revenueChart");
    if (!ctx || this.charts.revenueChart) return;

    const data = {
      labels: [
        "Sprint 1-2",
        "Sprint 3-4",
        "Sprint 5-6",
        "Sprint 7-8",
        "Sprint 9-10",
        "Sprint 11-12",
      ],
      datasets: [
        {
          label: "Receita (USD)",
          data: [0, 2000, 8000, 25000, 50000, 100000],
          backgroundColor: "rgba(139, 69, 19, 0.1)",
          borderColor: "#8B4513",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#D2691E",
          pointBorderColor: "#8B4513",
          pointBorderWidth: 2,
          pointRadius: 6,
        },
        {
          label: "Usuários",
          data: [100, 500, 1000, 2000, 5000, 10000],
          backgroundColor: "rgba(31, 33, 33, 0.8)",
          borderColor: "#1f2121",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#1f2121",
          pointBorderColor: "#1f2121",
          pointBorderWidth: 2,
          pointRadius: 6,
          yAxisID: "y1",
        },
      ],
    };

    this.charts.revenueChart = new Chart(ctx, {
      type: "line",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          legend: {
            labels: { color: "#8B4513" },
          },
          tooltip: {
            backgroundColor: "#8B4513",
            titleColor: "#fff",
            bodyColor: "#fff",
            borderColor: "#D2691E",
            borderWidth: 1,
            cornerRadius: 8,
          },
        },
        scales: {
          x: {
            ticks: { color: "#8B4513" },
            grid: { color: "rgba(139, 69, 19, 0.1)" },
          },
          y: {
            type: "linear",
            display: true,
            position: "left",
            ticks: {
              color: "#8B4513",
              callback: function (value) {
                return "USD " + value.toLocaleString();
              },
            },
            grid: { color: "rgba(139, 69, 19, 0.1)" },
          },
          y1: {
            type: "linear",
            display: true,
            position: "right",
            ticks: {
              color: "#D2691E",
              callback: function (value) {
                return value.toLocaleString() + " users";
              },
            },
            grid: { drawOnChartArea: false },
          },
        },
      },
    });
  }

  // Animações
  setupAnimations() {
    this.animateCounters();
    this.setupHoverEffects();
  }

  triggerSlideAnimations(slideNumber) {
    const activeSlide = document.getElementById(`slide-${slideNumber}`);
    if (!activeSlide) return;

    // Animar cards com delay
    const cards = activeSlide.querySelectorAll(
      ".segment-card, .feature-card, .hypothesis-card, .action-card"
    );
    cards.forEach((card, index) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(20px)";

      setTimeout(() => {
        card.style.transition = "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, index * 100);
    });
  }

  animateCounters() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.animated) {
          this.animateValue(entry.target);
          entry.target.animated = true;
        }
      });
    });

    document
      .querySelectorAll(
        ".metric-value, .kpi-value, .dashboard-metric .metric-value"
      )
      .forEach((counter) => {
        observer.observe(counter);
      });
  }

  animateValue(element) {
    const text = element.textContent;
    const finalValue = parseInt(text.replace(/[^\d]/g, "")) || 0;

    if (finalValue === 0) return;

    const duration = 1500;
    const start = performance.now();

    function animate(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(finalValue * progress);

      let displayValue = current.toString();

      if (text.includes(",") && current >= 1000) {
        displayValue = current.toLocaleString();
      }

      if (text.includes("USD")) {
        displayValue = "USD " + displayValue;
        if (text.includes("Bi")) displayValue += "Bi";
        if (text.includes("k")) displayValue += "k";
      }

      if (text.includes("%")) displayValue += "%";
      if (text.includes("ms")) displayValue += "ms";

      element.textContent = displayValue;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.textContent = text;
      }
    }

    requestAnimationFrame(animate);
  }

  setupHoverEffects() {
    const cards = document.querySelectorAll(
      ".segment-card, .feature-card, .hypothesis-card, .action-card"
    );

    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        card.style.transform = "translateY(-4px)";
        card.style.boxShadow = "0 20px 40px rgba(139, 69, 19, 0.15)";
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0)";
        card.style.boxShadow = "";
      });
    });
  }

  // Limpeza
  destroy() {
    Object.values(this.charts).forEach((chart) => {
      if (chart && typeof chart.destroy === "function") {
        chart.destroy();
      }
    });

    if (this.keyboardHandler) {
      document.removeEventListener("keydown", this.keyboardHandler);
    }
  }
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  window.globalCoffeePresentation = new GlobalCoffeePresentation();

  // Menu mobile
  if (window.innerWidth <= 768) {
    const sidebar = document.querySelector(".sidebar-nav");
    const mobileToggle = document.createElement("button");
    mobileToggle.innerHTML = "☰";
    mobileToggle.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1001;
            background: #8B4513;
            color: white;
            border: none;
            padding: 12px;
            border-radius: 8px;
            font-size: 18px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;

    document.body.appendChild(mobileToggle);

    mobileToggle.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });

    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        sidebar.classList.remove("open");
      });
    });
  }

  console.log("🎯 Global Coffee - Discovery Completo");
  console.log("📊 Apresentação carregada com sucesso!");
});

// Limpeza ao fechar
window.addEventListener("beforeunload", () => {
  if (window.globalCoffeePresentation) {
    window.globalCoffeePresentation.destroy();
  }
});

// Monitoramento de performance
window.addEventListener("load", () => {
  const loadTime = performance.now();
  console.log(`⚡ Apresentação carregada em ${Math.round(loadTime)}ms`);
});
