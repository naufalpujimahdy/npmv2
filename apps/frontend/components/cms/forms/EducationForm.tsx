'use client';

import { useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCmsApi } from '@/hooks/useCmsApi';

interface Education {
  id?: string;
  institution: string;
  degree: string;
  field: string;
  location?: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  description?: string;
  achievements?: string;
  institutionUrl?: string;
  order: number;
  isVisible: boolean;
}

interface EducationFormProps {
  education?: Education | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function EducationForm({ education, onClose, onSuccess }: EducationFormProps) {
  const { request } = useCmsApi();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Education>(
    education || {
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      gpa: '',
      description: '',
      achievements: '',
      institutionUrl: '',
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
      const url = education?.id 
        ? `/api/portfolio/education/${education.id}`
        : '/api/portfolio/education';

      const result = await request(url, {
        method: education?.id ? 'PUT' : 'POST',
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
          <CardTitle>{education?.id ? 'Edit Pendidikan' : 'Tambah Pendidikan'}</CardTitle>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Institusi *</label>
              <Input
                type="text"
                name="institution"
                value={formData.institution}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gelar *</label>
                <Input
                  type="text"
                  name="degree"
                  value={formData.degree}
                  onChange={handleInputChange}
                  placeholder="e.g., Bachelor, Master"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bidang Studi *</label>
                <Input
                  type="text"
                  name="field"
                  value={formData.field}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Institusi</label>
              <Input
                type="url"
                name="institutionUrl"
                value={formData.institutionUrl || ''}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai</label>
                <Input
                  type="date"
                  name="endDate"
                  value={formData.endDate || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GPA</label>
              <Input
                type="text"
                name="gpa"
                value={formData.gpa || ''}
                onChange={handleInputChange}
                placeholder="e.g., 3.8/4.0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
