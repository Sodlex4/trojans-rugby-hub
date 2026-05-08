import { useState } from "react";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import type { NewsItem } from "@/data/news";
import AdminModal from "./AdminModal";
import ConfirmDialog from "./ConfirmDialog";

interface NewsTabProps {
  newsItems: NewsItem[];
  onSaveNews: (news: Partial<NewsItem>) => void;
  onDeleteNews: (id: number, title: string) => void;
}

const NewsTab = ({ newsItems, onSaveNews, onDeleteNews }: NewsTabProps) => {
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [editingNews, setEditingNews] = useState<Partial<NewsItem> | null>(null);
  const [newsSearchQuery, setNewsSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; title: string } | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");

  const filteredNews = newsItems
    .filter(n => statusFilter === "all" || n.status === statusFilter)
    .filter(n =>
      !newsSearchQuery ||
      n.title.toLowerCase().includes(newsSearchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(newsSearchQuery.toLowerCase())
    );

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
    setEditingNews({ status: "draft" });
    setShowNewsForm(true);
  };

  const handleEdit = (news: NewsItem) => {
    setEditingNews(news);
    setShowNewsForm(true);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      onDeleteNews(deleteTarget.id, deleteTarget.title);
      setDeleteTarget(null);
    }
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

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            type="text"
            placeholder="Search news by title..."
            value={newsSearchQuery}
            onChange={(e) => setNewsSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "published", "draft"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <AdminModal
        isOpen={showNewsForm}
        onClose={() => { setShowNewsForm(false); setEditingNews(null); }}
        title={editingNews?.id ? "Edit News" : "Add News Item"}
      >
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
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Status</label>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="newsStatus"
                  checked={editingNews?.status !== "draft"}
                  onChange={() => setEditingNews({ ...editingNews, status: "published" })}
                  className="text-primary"
                />
                <span className="text-sm">Published</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="newsStatus"
                  checked={editingNews?.status === "draft"}
                  onChange={() => setEditingNews({ ...editingNews, status: "draft" })}
                  className="text-primary"
                />
                <span className="text-sm">Draft</span>
              </label>
            </div>
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
      </AdminModal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        title="Delete News"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
      />

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
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-foreground truncate">{news.title}</h4>
                {news.status === "draft" && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full">Draft</span>
                )}
              </div>
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
                onClick={() => setDeleteTarget({ id: news.id, title: news.title })}
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
