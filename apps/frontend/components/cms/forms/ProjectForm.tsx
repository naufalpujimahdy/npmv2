'use client';

import { useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCmsApi } from '@/hooks/useCmsApi';

interface Project {
  id?: string;
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  technologies: string;
  images: string;
  demoUrl?: string;
  sourceUrl?: string;
  featured: boolean;
  status: string;
  startDate?: string;
  endDate?: string;
  order: number;
  isVisible: boolean;
}

interface ProjectFormProps {
  project?: Project | null;
  onClose: () => void;
  onSuccess: () => void;
}

const statusOptions = [
  { value: 'completed', label: 'Selesai' },
  { value: 'in-progress', label: 'Sedang Dikerjakan' },
  { value: 'planned', label: 'Direncanakan' },
];

export function ProjectForm({ project, onClose, onSuccess }: ProjectFormProps) {
  const { request } = useCmsApi();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Project>(
    project || {
      title: '',
      slug: '',
      description: '',
      longDescription: '',
      technologies: '',
      images: '',
      demoUrl: '',
      sourceUrl: '',
      featured: false,
      status: 'completed',
      startDate: '',
      endDate: '',
      order: 0,
      isVisible: true,
    }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleGenerateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setFormData(prev => ({ ...prev, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const url = project?.id 
        ? `/api/portfolio/projects/${project.id}`
        : '/api/portfolio/projects';

      const result = await request(url, {
        method: project?.id ? 'PUT' : 'POST',
        body: formData,
      });

      if (result) {
        onSuccess();
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>{project?.id ? 'Edit Proyek' : 'Tambah Proyek'}</CardTitle>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul Proyek *</label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                />
                <Button type="button" variant="outline" onClick={handleGenerateSlug}>
                  Generate
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Lengkap</label>
              <textarea
                name="longDescription"
                value={formData.longDescription || ''}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teknologi (dipisahkan koma) *</label>
              <textarea
                name="technologies"
                value={formData.technologies}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Gambar (dipisahkan koma)</label>
              <textarea
                name="images"
                value={formData.images}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Demo URL</label>
                <Input
                  type="url"
                  name="demoUrl"
                  value={formData.demoUrl || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source Code URL</label>
                <Input
                  type="url"
                  name="sourceUrl"
                  value={formData.sourceUrl || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
                <Input
                  type="date"
                  name="startDate"
                  value={formData.startDate || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai</label>
                <Input
                  type="date"
                  name="endDate"
                  value={formData.endDate || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="rounded border-gray-300"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                  Proyek Unggulan
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isVisible"
                  name="isVisible"
                  checked={formData.isVisible}
                  onChange={handleInputChange}
                  className="rounded border-gray-300"
                />
                <label htmlFor="isVisible" className="text-sm font-medium text-gray-700">
                  Tampilkan di portfolio
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" type="button" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  'Simpan'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
