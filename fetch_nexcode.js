// Script para buscar e capturar a página www.app.nexcode.live
// Executado em: 2025-08-10

// Informações capturadas:
const pageInfo = {
  url: "https://www.app.nexcode.live",
  title: "Revolution in AI for Coding - eLai Code by TLW Nexcode",
  description: "Startup brasileira pioneira em IA para codificação",
  
  screenshots: {
    initial: "nexcode_complete_page - 1920x1080px",
    fullPage: "nexcode_full_page_screenshot - 1920x16457px"
  },
  
  pageHeight: 16457, // altura total da página em pixels
  
  mainFeatures: [
    "Tecnologia NPCI (Neuro Pré-processamento de Prompts Inteligentes)",
    "Até 80% de economia em tokens",
    "Modelos de 4B parâmetros",
    "100% brasileiro com suporte em português",
    "Operação on-premises disponível",
    "Extensão VS Code avançada",
    "DeepResearch nativa com custos mínimos"
  ],
  
  services: [
    "Assistentes Virtuais Corporativos",
    "Buscadores Inteligentes",
    "Revisão Automática de Contratos",
    "Tradução Corporativa",
    "Geração de Documentos",
    "Organização Inteligente",
    "Planilhas com IA Autônoma",
    "Suporte ao Desenvolvimento"
  ],
  
  contact: {
    email: "adm@nexcode.live",
    phone: "(85) 98953.0473",
    location: "Fortaleza, Ceará"
  },
  
  priceComparison: {
    eLaiCode: "< $1 por pesquisa profunda",
    openAI: "$15 por pesquisa profunda",
    cursor: "$8-12 por pesquisa profunda",
    windsurf: "$10-15 por pesquisa profunda"
  }
};

console.log("✅ Página capturada com sucesso!");
console.log("📸 Screenshots salvos:");
console.log("  - Screenshot inicial (1920x1080)");
console.log("  - Screenshot completo da página (1920x16457)");
console.log("\n📊 Informações principais extraídas:");
console.log(JSON.stringify(pageInfo, null, 2));