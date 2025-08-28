/**
 * Sistema de Reranking de Notícias baseado em Favoritação
 * Utiliza Wilson Score Interval para ranking inteligente
 */

interface NewsItem {
  id: string;
  title: string;
  views: number;
  favorites: number;
  shares: number;
  timestamp: Date;
  category: string;
  relevance?: number;
}

interface UserPreferences {
  favoriteCategories: string[];
  viewHistory: string[];
  favoritedNews: string[];
}

/**
 * Calcula o Wilson Score Interval
 * Balanceia proporção de interações positivas com tamanho da amostra
 * @param positive - Número de interações positivas (favoritos, shares)
 * @param total - Número total de visualizações
 * @param confidence - Nível de confiança (padrão 0.95)
 */
function wilsonScore(positive: number, total: number): number {
  if (total === 0) return 0;
  
  // Z-score para 95% de confiança
  const z = 1.96; // Para 95% de confiança
  
  const phat = positive / total;
  const denominator = 1 + z * z / total;
  const numerator = phat + z * z / (2 * total) - 
    z * Math.sqrt((phat * (1 - phat) + z * z / (4 * total)) / total);
  
  return numerator / denominator;
}

/**
 * Calcula score de frescor (freshness) para notícias
 * Notícias mais recentes recebem score maior
 */
function freshnessScore(timestamp: Date, halfLifeHours: number = 24): number {
  const now = new Date();
  const ageInHours = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60);
  
  // Decaimento exponencial baseado em meia-vida
  return Math.exp(-0.693 * ageInHours / halfLifeHours);
}

/**
 * Calcula score de personalização baseado nas preferências do usuário
 */
function personalizationScore(news: NewsItem, userPrefs: UserPreferences): number {
  let score = 0;
  
  // Boost para categorias favoritas
  if (userPrefs.favoriteCategories.includes(news.category)) {
    score += 0.3;
  }
  
  // Penalidade para notícias já vistas
  if (userPrefs.viewHistory.includes(news.id)) {
    score -= 0.5;
  }
  
  // Boost adicional se o usuário já favoritou notícias similares
  const categoryFavoriteCount = userPrefs.favoritedNews
    .filter(id => userPrefs.viewHistory.includes(id))
    .length;
  
  score += Math.min(categoryFavoriteCount * 0.1, 0.3);
  
  return Math.max(0, Math.min(1, score)); // Normaliza entre 0 e 1
}

/**
 * Algoritmo principal de reranking
 * Combina múltiplos fatores para gerar score final
 */
export function rerankNews(
  newsList: NewsItem[],
  userPrefs: UserPreferences,
  options: {
    freshnessWeight?: number;
    popularityWeight?: number;
    personalizationWeight?: number;
    diversityBoost?: boolean;
  } = {}
): NewsItem[] {
  const {
    freshnessWeight = 0.3,
    popularityWeight = 0.4,
    personalizationWeight = 0.3,
    diversityBoost = true
  } = options;
  
  // Calcula scores para cada notícia
  const scoredNews = newsList.map(news => {
    // Wilson Score para popularidade (favoritos + shares em relação a views)
    const interactions = news.favorites + news.shares * 0.5; // Shares valem metade
    const popularity = wilsonScore(interactions, news.views);
    
    // Score de frescor
    const freshness = freshnessScore(news.timestamp);
    
    // Score de personalização
    const personalization = personalizationScore(news, userPrefs);
    
    // Score combinado ponderado
    const finalScore = 
      popularity * popularityWeight +
      freshness * freshnessWeight +
      personalization * personalizationWeight;
    
    return {
      ...news,
      scores: {
        popularity,
        freshness,
        personalization,
        final: finalScore
      }
    };
  });
  
  // Ordena por score final
  scoredNews.sort((a, b) => b.scores.final - a.scores.final);
  
  // Aplica boost de diversidade se habilitado
  if (diversityBoost) {
    return applyDiversityBoost(scoredNews);
  }
  
  return scoredNews;
}

/**
 * Aplica boost de diversidade para evitar muitas notícias da mesma categoria
 */
function applyDiversityBoost(scoredNews: any[]): any[] {
  const reranked: any[] = [];
  const categoryCount = new Map<string, number>();
  const maxPerCategory = 2; // Máximo de notícias consecutivas da mesma categoria
  
  for (const news of scoredNews) {
    const count = categoryCount.get(news.category) || 0;
    
    if (count < maxPerCategory) {
      reranked.push(news);
      categoryCount.set(news.category, count + 1);
    } else {
      // Adiciona ao final se categoria já está saturada
      reranked.push(news);
      categoryCount.set(news.category, 0); // Reset contador
    }
  }
  
  return reranked;
}

/**
 * Atualiza preferências do usuário baseado em ações
 */
export function updateUserPreferences(
  userPrefs: UserPreferences,
  action: 'view' | 'favorite' | 'share',
  newsItem: NewsItem
): UserPreferences {
  const updated = { ...userPrefs };
  
  switch (action) {
    case 'view':
      if (!updated.viewHistory.includes(newsItem.id)) {
        updated.viewHistory.push(newsItem.id);
        // Mantém apenas últimas 100 visualizações
        if (updated.viewHistory.length > 100) {
          updated.viewHistory.shift();
        }
      }
      break;
      
    case 'favorite':
      if (!updated.favoritedNews.includes(newsItem.id)) {
        updated.favoritedNews.push(newsItem.id);
        
        // Atualiza categorias favoritas baseado em padrões
        const categoryFavorites = updated.favoritedNews
          .map(id => newsList.find(n => n.id === id)?.category)
          .filter(Boolean) as string[];
        
        // Conta frequência de categorias
        const categoryFreq = categoryFavorites.reduce((acc, cat) => {
          acc[cat] = (acc[cat] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        // Atualiza categorias favoritas (top 3)
        updated.favoriteCategories = Object.entries(categoryFreq)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(([cat]) => cat);
      }
      break;
      
    case 'share':
      // Shares também indicam interesse
      if (!updated.favoritedNews.includes(newsItem.id)) {
        updated.favoritedNews.push(newsItem.id);
      }
      break;
  }
  
  return updated;
}

/**
 * Exemplo de uso para notícias de café
 */
export function createCoffeeNewsRanker() {
  // Categorias específicas do domínio
  const COFFEE_CATEGORIES = {
    MARKET: 'mercado',
    WEATHER: 'clima',
    TECHNOLOGY: 'tecnologia',
    SUSTAINABILITY: 'sustentabilidade',
    EXPORT: 'exportação',
    RESEARCH: 'pesquisa'
  };
  
  // Pesos específicos para notícias de café
  const COFFEE_RANKING_WEIGHTS = {
    freshnessWeight: 0.35,      // Notícias de mercado precisam ser recentes
    popularityWeight: 0.35,     // Popularidade é importante
    personalizationWeight: 0.30 // Personalização baseada em preferências
  };
  
  return {
    rank: (news: NewsItem[], prefs: UserPreferences) => 
      rerankNews(news, prefs, COFFEE_RANKING_WEIGHTS),
    categories: COFFEE_CATEGORIES
  };
}

// Lista de notícias para exemplo (será substituída por dados reais)
const newsList: NewsItem[] = [];

export default {
  rerankNews,
  updateUserPreferences,
  wilsonScore,
  freshnessScore,
  createCoffeeNewsRanker
};