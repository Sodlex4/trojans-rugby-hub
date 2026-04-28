import { useState } from "react";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import type { NewsItem } from "@/data/news";

interface NewsTabProps {
  newsItems: NewsItem[];
  onSaveNews: (news: Partial<NewsItem>) => void;
  onDeleteNews: (id: number, title: string) => void;
}

const NewsTab = ({ newsItems, onSaveNews, onDeleteNews }: NewsTabProps) => {
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [editingNews, setEditingNews] = useState<Partial<NewsItem> | null>(null);
  const [newsSearchQuery, setNewsSearchQuery] = useState("");

  const filteredNews = newsSearchQuery
    ? newsItems.filter(n =>
        n.title.toLowerCase().includes(newsSearchQuery.toLowerCase()) ||
        n.description.toLowerCase().includes(newsSearchQuery.toLowerCase())
      )
    : newsItems;

  const handleSaveNews = () => {
    if (!editingNews?.title || !editingNews?.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    onSaveNews(editingNews);
    setEditingNews(null);
    setShowNewsForm(false);
  };

  const handleAddNew = () => {
    setEditingNews({});
    setShowNewsForm(true);
  };

  const handleEdit = (news: NewsItem) => {
    setEditingNews(news);
    setShowNewsForm(true);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-foreground">News Management</h2>
        <button 
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-semibold hover:bg-trojan-green-dark transition-colors"
        >
          <Plus size={18} />
          Add News
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
        <input
          type="text"
          placeholder="Search news by title..."
          value={newsSearchQuery}
          onChange={(e) => setNewsSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
        />
      </div>

      {/* News Form Modal */}
      {showNewsForm && (
        <motion.div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div 
            className="bg-card rounded-2xl w-full max-w-lg p-6 my-8 shadow-2xl"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <h3 className="text-xl font-bold text-foreground mb-4">
              {editingNews?.id ? "Edit News" : "Add News Item"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Title *</label>
                <input
                  type="text"
                  value={editingNews?.title || ""}
                  onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="News title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Description *</label>
                <textarea
                  value={editingNews?.description || ""}
                  onChange={(e) => setEditingNews({ ...editingNews, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 h-32 resize-none"
                  placeholder="News description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Image URL</label>
                <input
                  type="text"
                  value={editingNews?.image || ""}
                  onChange={(e) => setEditingNews({ ...editingNews, image: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={handleSaveNews}
                className="flex-1 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-semibold hover:bg-trojan-green-dark transition-colors"
              >
                {editingNews?.id ? "Update News" : "Add News"}
              </button>
              <button 
                onClick={() => { setShowNewsForm(false); setEditingNews(null); }}
                className="bg-muted text-foreground px-4 py-2.5 rounded-lg font-semibold hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* News List */}
      <div className="space-y-4">
        {filteredNews.map((news) => (
          <div 
            key={news.id} 
            className="bg-card rounded-xl p-4 border border-border hover:border-primary/30 transition-all hover:shadow-md flex gap-4"
          >
            <img
              src={news.image}
              alt={news.title}
              className="w-24 h-20 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground truncate">{news.title}</h4>
              <p className="text-sm text-muted-foreground mb-2">{news.date}</p>
              <p className="text-sm text-muted-foreground line-clamp-2">{news.description}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => handleEdit(news)}
                className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => onDeleteNews(news.id, news.title)}
                className="p-2 text-accent hover:bg-accent/10 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No news found</p>
        </div>
      )}
    </motion.div>
  );
};

export default NewsTab;
