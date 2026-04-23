'use client';

import { useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCmsApi } from '@/hooks/useCmsApi';

interface Experience {
  id?: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  achievements?: string;
  technologies?: string;
  companyUrl?: string;
  order: number;
  isVisible: boolean;
}

interface ExperienceFormProps {
  experience?: Experience | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function ExperienceForm({ experience, onClose, onSuccess }: ExperienceFormProps) {
  const { request } = useCmsApi();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Experience>(
    experience || {
      company: '',
      position: '',
      location: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      isCurrent: true,
      description: '',
      achievements: '',
      technologies: '',
      companyUrl: '',
      order: 0,
      isVisible: true,
    }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const url = experience?.id 
        ? `/api/portfolio/experience/${experience.id}`
        : '/api/portfolio/experience';

      const result = await request(url, {
        method: experience?.id ? 'PUT' : 'POST',
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
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>{experience?.id ? 'Edit Pengalaman' : 'Tambah Pengalaman Kerja'}</CardTitle>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Perusahaan *</label>
                <Input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Posisi *</label>
                <Input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
              <Input
                type="text"
                name="location"
                value={formData.location || ''}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Perusahaan</label>
              <Input
                type="url"
                name="companyUrl"
                value={formData.companyUrl || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai *</label>
                <Input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Berakhir</label>
                <Input
                  type="date"
                  name="endDate"
                  value={formData.endDate || ''}
                  onChange={handleInputChange}
                  disabled={formData.isCurrent}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isCurrent"
                name="isCurrent"
                checked={formData.isCurrent}
                onChange={handleInputChange}
                className="rounded border-gray-300"
              />
              <label htmlFor="isCurrent" className="text-sm font-medium text-gray-700">
                Saat ini bekerja di sini
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pencapaian</label>
              <textarea
                name="achievements"
                value={formData.achievements || ''}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teknologi (dipisahkan koma)</label>
              <textarea
                name="technologies"
                value={formData.technologies || ''}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
