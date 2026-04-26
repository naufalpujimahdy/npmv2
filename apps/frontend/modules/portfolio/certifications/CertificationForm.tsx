'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useCmsApi } from '@/hooks/useCmsApi';
import { ImageUpload } from '@/components/ui/image-upload';

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

  const toDateInput = (val?: string | null) =>
    val ? new Date(val).toISOString().split('T')[0] : '';

  const [formData, setFormData] = useState<Certification>(
    certification
      ? { ...certification, issueDate: toDateInput(certification.issueDate), expiryDate: toDateInput(certification.expiryDate) }
      : {
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

  const handleChange = (name: keyof Certification, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
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
        toast.success(certification?.id ? 'Sertifikat berhasil diperbarui' : 'Sertifikat berhasil ditambahkan');
        onSuccess();
      } else {
        toast.error('Gagal menyimpan sertifikat');
      }
    } catch {
      toast.error('Terjadi kesalahan saat menyimpan sertifikat');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{certification?.id ? 'Edit Sertifikat' : 'Tambah Sertifikat'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Sertifikat *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="issuer">Penerbit *</Label>
            <Input
              id="issuer"
              value={formData.issuer}
              onChange={(e) => handleChange('issuer', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issueDate">Tanggal Penerbitan *</Label>
              <Input
                id="issueDate"
                type="date"
                value={formData.issueDate}
                onChange={(e) => handleChange('issueDate', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Tanggal Berakhir</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate || ''}
                onChange={(e) => handleChange('expiryDate', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="credentialId">ID Kredensial</Label>
            <Input
              id="credentialId"
              value={formData.credentialId || ''}
              onChange={(e) => handleChange('credentialId', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="credentialUrl">URL Kredensial</Label>
            <Input
              id="credentialUrl"
              type="url"
              value={formData.credentialUrl || ''}
              onChange={(e) => handleChange('credentialUrl', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Gambar Sertifikat</Label>
            <ImageUpload
              value={formData.imageUrl || ''}
              onChange={(url) => handleChange('imageUrl', url)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="isVisible"
              checked={formData.isVisible}
              onCheckedChange={(checked) => handleChange('isVisible', Boolean(checked))}
            />
            <Label htmlFor="isVisible" className="cursor-pointer">Tampilkan di portfolio</Label>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSaving ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
