import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, TrendingUp, User, Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";

const colorClasses = {
  blue: { bg: "bg-blue-50", text: "text-blue-600" },
  green: { bg: "bg-green-50", text: "text-green-600" },
  purple: { bg: "bg-purple-50", text: "text-purple-600" },
  orange: { bg: "bg-orange-50", text: "text-orange-600" },
  teal: { bg: "bg-teal-50", text: "text-teal-600" }
};

// Helper to get/set reading history from localStorage
const getReadingHistory = () => {
  try {
    const history = localStorage.getItem('articleReadingHistory');
    return history ? JSON.parse(history) : [];
  } catch {
    return [];
  }
};

const updateReadingHistory = (articleId) => {
  try {
    let history = getReadingHistory();
    // Remove if already exists and add to front
    history = history.filter(id => id !== articleId);
    history.unshift(articleId);
    // Keep only last 10 articles
    history = history.slice(0, 10);
    localStorage.setItem('articleReadingHistory', JSON.stringify(history));
  } catch (e) {
    console.error('Failed to update reading history:', e);
  }
};

// Helper to track article views for popularity
const trackArticleView = (articleId) => {
  try {
    const views = JSON.parse(localStorage.getItem('articleViews') || '{}');
    views[articleId] = (views[articleId] || 0) + 1;
    localStorage.setItem('articleViews', JSON.stringify(views));
  } catch (e) {
    console.error('Failed to track view:', e);
  }
};

const getPopularArticles = (allArticles, limit = 6) => {
  try {
    const views = JSON.parse(localStorage.getItem('articleViews') || '{}');
    return allArticles
      .map(article => ({
        ...article,
        viewCount: views[article.id] || 0
      }))
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, limit)
      .map(a => a.id);
  } catch {
    return [];
  }
};

export default function ArticleRecommendations({ currentArticle, allArticles }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendationType, setRecommendationType] = useState('ai'); // 'ai', 'history', 'popular'

  useEffect(() => {
    // Track current article view
    if (currentArticle?.id) {
      trackArticleView(currentArticle.id);
      updateReadingHistory(currentArticle.id);
      
      // Generate recommendations
      generateRecommendations();
    }
  }, [currentArticle?.id]);

  const generateRecommendations = async () => {
    setLoading(true);
    
    try {
      // Get reading history and popular articles
      const readingHistory = getReadingHistory().filter(id => id !== currentArticle.id);
      const popularIds = getPopularArticles(allArticles, 6).filter(id => id !== currentArticle.id);
      
      // Use AI to analyze content and generate smart recommendations
      const prompt = `You are an expert content recommendation system for electricity and energy articles.

Current article being read:
- ID: ${currentArticle.id}
- Title: "${currentArticle.title}"
- Category: ${currentArticle.category}
- Keywords: ${currentArticle.keywords?.join(', ') || 'N/A'}
- Description: ${currentArticle.description}

User's recent reading history (article IDs): ${readingHistory.length > 0 ? readingHistory.slice(0, 5).join(', ') : 'None'}

Popular articles (IDs): ${popularIds.length > 0 ? popularIds.slice(0, 5).join(', ') : 'None'}

Available articles to recommend from:
${allArticles.filter(a => a.id !== currentArticle.id).map(a => 
  `- ID ${a.id}: "${a.title}" (Category: ${a.category}, Keywords: ${a.keywords?.join(', ') || 'N/A'})`
).join('\n')}

Based on the current article content, user's reading history, and popular articles, recommend exactly 3-6 article IDs that would be most valuable for this reader.

Consider:
1. Content relevance - Similar topics, complementary information
2. Natural reading progression - What would logically come next
3. User's demonstrated interests from reading history
4. Popular articles that align with current content
5. Diversity - Mix of categories if appropriate

Return ONLY a JSON array of recommended article IDs in order of relevance, like: [14, 11, 2, 15]`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        response_json_schema: {
          type: "object",
          properties: {
            recommended_ids: {
              type: "array",
              items: { type: "number" },
              description: "Array of 3-6 article IDs ordered by relevance"
            },
            reasoning: {
              type: "string",
              description: "Brief explanation of recommendation strategy"
            }
          }
        }
      });

      if (response.recommended_ids && Array.isArray(response.recommended_ids)) {
        // Get full article objects for recommended IDs
        const recommendedArticles = response.recommended_ids
          .map(id => allArticles.find(a => a.id === id))
          .filter(a => a !== undefined)
          .slice(0, 6); // Max 6 recommendations

        setRecommendations(recommendedArticles);
        setRecommendationType('ai');
      } else {
        // Fallback to static recommendations
        fallbackToStaticRecommendations();
      }
    } catch (error) {
      console.error('AI recommendations failed, using fallback:', error);
      // Fallback to static recommendations
      fallbackToStaticRecommendations();
    } finally {
      setLoading(false);
    }
  };

  const fallbackToStaticRecommendations = () => {
    // Fallback: Use static related articles or similar category articles
    const relatedIds = currentArticle.relatedArticles || [];
    let recommended = relatedIds
      .map(id => allArticles.find(a => a.id === id))
      .filter(a => a !== undefined);

    // If not enough, add same category articles
    if (recommended.length < 3) {
      const sameCategoryArticles = allArticles
        .filter(a => a.id !== currentArticle.id && a.category === currentArticle.category)
        .slice(0, 6 - recommended.length);
      recommended = [...recommended, ...sameCategoryArticles];
    }

    // If still not enough, add popular articles
    if (recommended.length < 3) {
      const popularIds = getPopularArticles(allArticles, 6);
      const popularArticles = popularIds
        .map(id => allArticles.find(a => a.id === id))
        .filter(a => a && a.id !== currentArticle.id && !recommended.find(r => r.id === a.id))
        .slice(0, 6 - recommended.length);
      recommended = [...recommended, ...popularArticles];
    }

    setRecommendations(recommended.slice(0, 6));
    setRecommendationType('static');
  };

  const getRecommendationBadge = () => {
    if (recommendationType === 'ai') {
      return (
        <div className="flex items-center gap-2 text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          AI-Powered Recommendations
        </div>
      );
    } else if (recommendationType === 'history') {
      return (
        <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full text-xs font-semibold">
          <User className="w-3.5 h-3.5" />
          Based on Your Reading
        </div>
      );
    } else if (recommendationType === 'popular') {
      return (
        <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full text-xs font-semibold">
          <TrendingUp className="w-3.5 h-3.5" />
          Popular Articles
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recommended For You</h2>
          <div className="animate-pulse bg-gray-200 h-6 w-32 rounded-full"></div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-40 rounded-t-xl"></div>
              <div className="bg-white border border-gray-200 rounded-b-xl p-4">
                <div className="bg-gray-200 h-4 w-3/4 mb-2 rounded"></div>
                <div className="bg-gray-200 h-3 w-1/2 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Recommended For You</h2>
        {getRecommendationBadge()}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {recommendations.map((article) => {
          const Icon = article.icon;
          const colors = colorClasses[article.color];
          return (
            <a key={article.id} href={createPageUrl("ArticleDetail") + `?id=${article.id}`}>
              <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-[#0A5C8C] h-full">
                <div className="relative h-32 sm:h-40 overflow-hidden rounded-t-xl">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className={`absolute top-2 left-2 px-2 py-0.5 ${colors.bg} ${colors.text} rounded-full text-xs font-bold`}>
                    {article.category}
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center mb-3`}>
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 hover:text-[#0A5C8C] transition-colors">
                    {article.title}
                  </h3>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </span>
                </CardContent>
              </Card>
            </a>
          );
        })}
      </div>
    </div>
  );
}

// Export helper functions for use in other components
export { updateReadingHistory, trackArticleView, getReadingHistory, getPopularArticles };