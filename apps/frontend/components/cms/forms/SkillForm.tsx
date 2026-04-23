'use client';

import { useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCmsApi } from '@/hooks/useCmsApi';

interface Skill {
  id?: string;
  name: string;
  category: string;
  proficiency: string;
  iconUrl?: string;
  order: number;
  isVisible: boolean;
}

interface SkillFormProps {
  skill?: Skill | null;
  onClose: () => void;
  onSuccess: () => void;
}

const proficiencyLevels = [
  { value: 'Expert', label: 'Ahli' },
  { value: 'Advanced', label: 'Advanced' },
  { value: 'Intermediate', label: 'Menengah' },
  { value: 'Beginner', label: 'Pemula' },
];

const categories = [
  'Frontend',
  'Backend',
  'Database',
  'Tools',
  'DevOps',
  'Design',
  'Mobile',
  'Other',
];

export function SkillForm({ skill, onClose, onSuccess }: SkillFormProps) {
  const { request } = useCmsApi();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Skill>(
    skill || {
      name: '',
      category: 'Frontend',
      proficiency: 'Intermediate',
      iconUrl: '',
      order: 0,
      isVisible: true,
    }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const url = skill?.id 
        ? `/api/portfolio/skills/${skill.id}`
        : '/api/portfolio/skills';

      const result = await request(url, {
        method: skill?.id ? 'PUT' : 'POST',
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
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>{skill?.id ? 'Edit Keahlian' : 'Tambah Keahlian'}</CardTitle>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Keahlian *</label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., React, Python"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tingkat Keahlian *</label>
              <select
                name="proficiency"
                value={formData.proficiency}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {proficiencyLevels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icon URL</label>
              <Input
                type="url"
                name="iconUrl"
                value={formData.iconUrl || ''}
                onChange={handleInputChange}
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
