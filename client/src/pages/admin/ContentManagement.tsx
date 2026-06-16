import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Edit2, Trash2, FileText, X, Check } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Loader } from '@/components/common/Loader';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { adminService } from '@/services/adminService';
import type { Content } from '@/types';

export const ContentManagement: React.FC = () => {
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<'all' | 'wellness_tip' | 'relaxation' | 'education'>('all');
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  // Modal / Form state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Content | null>(null);
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'wellness_tip' | 'relaxation' | 'education'>('wellness_tip');
  const [description, setDescription] = useState('');
  const [richContent, setRichContent] = useState('');
  const [isPublished, setIsPublished] = useState(false);

  const [saving, setSaving] = useState(false);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const data = await adminService.getContent();
      setContent(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setTitle('');
    setCategory('wellness_tip');
    setDescription('');
    setRichContent('');
    setIsPublished(false);
    setModalOpen(true);
  };

  const handleOpenEdit = (item: Content) => {
    setEditingItem(item);
    setTitle(item.title);
    setCategory(item.category);
    setDescription(item.description);
    setRichContent(item.content);
    setIsPublished(item.isPublished);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;
    try {
      await adminService.deleteContent(id);
      setContent(prev => prev.filter(c => c._id !== id));
    } catch {
      // ignore
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const contentPayload = {
      title,
      category,
      description,
      content: richContent,
      isPublished,
    };
    try {
      if (editingItem) {
        const updated = await adminService.updateContent(editingItem._id, contentPayload);
        setContent(prev => prev.map(c => (c._id === editingItem._id ? updated : c)));
      } else {
        const created = await adminService.createContent(contentPayload);
        setContent(prev => [created, ...prev]);
      }
      setModalOpen(false);
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  const filteredContent = (activeCategory === 'all' ? content : content.filter(c => c.category === activeCategory))
    .filter(c =>
      !searchQuery ||
      c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.content?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const categories = [
    { id: 'all', label: 'All Articles' },
    { id: 'wellness_tip', label: 'Wellness Tips' },
    { id: 'relaxation', label: 'Relaxation' },
    { id: 'education', label: 'Education Hub' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-800 flex items-center gap-2">
            <FileText className="w-8 h-8 text-rose-500" /> Content Management
          </h1>
          <p className="text-gray-500">
            Publish educational guides, dynamic relaxation notes, or tips for users.
          </p>
        </div>
        <Button onClick={handleOpenAdd} className="self-start sm:self-auto">
          <Plus className="w-5 h-5" /> Add Content
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-100/60">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeCategory === cat.id
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-rose-50/40'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {searchQuery && (
        <div className="bg-rose-50/70 border border-rose-100/60 rounded-2xl px-5 py-4 flex items-center justify-between shadow-sm">
          <span className="text-sm text-rose-700 font-semibold">
            Showing search results for "<span className="italic">{searchQuery}</span>"
          </span>
          <button
            onClick={() => {
              searchParams.delete('search');
              setSearchParams(searchParams);
            }}
            className="text-xs bg-rose-500 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-rose-600 transition-colors"
          >
            Clear Filter
          </button>
        </div>
      )}

      {loading ? (
        <Loader />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((item) => (
            <Card
              key={item._id}
              title={item.title}
              subtitle={item.description}
              className="flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-2 mt-4 pt-4 border-t border-gray-100/60 w-full">
                <div className="flex gap-2 items-center">
                  <span className={`capitalize text-xs font-semibold px-2 py-0.5 rounded-full ${
                    item.category === 'wellness_tip' ? 'bg-rose-100 text-rose-700' :
                    item.category === 'relaxation' ? 'bg-lavender-100 text-lavender-700' :
                    'bg-sage-100 text-sage-700'
                  }`}>
                    {item.category.replace('_', ' ')}
                  </span>
                  {item.isPublished ? (
                    <span className="badge-sage">Published</span>
                  ) : (
                    <span className="badge bg-gray-100 text-gray-700">Draft</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 text-gray-500 hover:bg-rose-50 hover:text-rose-500 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingItem ? 'Edit Content Article' : 'Create Wellness Content'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Article Title"
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Magnesium for Cramps"
              required
            />

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl bg-white border border-rose-100/60 focus:outline-none focus:ring-2 focus:ring-rose-300/50"
              >
                <option value="wellness_tip">Wellness Tip</option>
                <option value="relaxation">Relaxation Guide</option>
                <option value="education">Education Article</option>
              </select>
            </div>

            <Input
              label="Brief Summary/Description"
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Brief summary showing on preview cards..."
              required
            />

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Detailed Content</label>
              <textarea
                value={richContent}
                onChange={e => setRichContent(e.target.value)}
                placeholder="Full article content (markdown or rich text supported)..."
                rows={5}
                required
                className="w-full px-4 py-3 rounded-xl bg-white border border-rose-100/60 focus:outline-none focus:ring-2 focus:ring-rose-300/50"
              />
            </div>

            <div className="flex items-center gap-2 py-2">
              <input
                type="checkbox"
                id="isPublished"
                checked={isPublished}
                onChange={e => setIsPublished(e.target.checked)}
                className="w-5 h-5 text-rose-500 rounded focus:ring-rose-400"
              />
              <label htmlFor="isPublished" className="text-sm font-semibold text-gray-700">
                Publish immediately to users
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={saving}>
                {editingItem ? 'Save Changes' : 'Create'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
export default ContentManagement;
