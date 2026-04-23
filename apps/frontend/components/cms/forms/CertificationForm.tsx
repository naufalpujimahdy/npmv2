'use client';

import { useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCmsApi } from '@/hooks/useCmsApi';

interface Certification {
  id?: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  imageUrl?: string;
  order: number;
  isVisible: boolean;
}

interface CertificationFormProps {
  certification?: Certification | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function CertificationForm({ certification, onClose, onSuccess }: CertificationFormProps) {
  const { request } = useCmsApi();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Certification>(
    certification || {
      name: '',
      issuer: '',
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      credentialId: '',
      credentialUrl: '',
      description: '',
      imageUrl: '',
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
      const url = certification?.id 
        ? `/api/portfolio/certifications/${certification.id}`
        : '/api/portfolio/certifications';

      const result = await request(url, {
        method: certification?.id ? 'PUT' : 'POST',
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
          <CardTitle>{certification?.id ? 'Edit Sertifikat' : 'Tambah Sertifikat'}</CardTitle>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Sertifikat *</label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Penerbit *</label>
              <Input
                type="text"
                name="issuer"
                value={formData.issuer}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Penerbitan *</label>
                <Input
                  type="date"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Berakhir</label>
                <Input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID Kredensial</label>
              <Input
                type="text"
                name="credentialId"
                value={formData.credentialId || ''}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Kredensial</label>
              <Input
                type="url"
                name="credentialUrl"
                value={formData.credentialUrl || ''}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Gambar</label>
              <Input
                type="url"
                name="imageUrl"
                value={formData.imageUrl || ''}
                onChange={handleInputChange}
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
