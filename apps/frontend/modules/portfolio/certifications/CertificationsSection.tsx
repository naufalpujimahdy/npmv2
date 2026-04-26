'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Loader2, Search } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useCmsApi } from '@/hooks/useCmsApi';
import { CertificationForm } from './CertificationForm';

interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  isVisible: boolean;
  order: number;
  updatedAt: string;
}

export function CertificationsSection() {
  const { request } = useCmsApi();
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Certification | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadCertifications = useCallback(async () => {
    setIsLoading(true);
    const data = await request<Certification[]>('/api/portfolio/certifications?include_hidden=true');
    if (Array.isArray(data)) setCertifications(data);
    setIsLoading(false);
  }, [request]);

  useEffect(() => { loadCertifications(); }, [loadCertifications]);

  const filtered = certifications.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.issuer.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat('id-ID', { dateStyle: 'short' }).format(new Date(date));

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const result = await request(`/api/portfolio/certifications/${deleteTarget.id}`, { method: 'DELETE' });
    if (result) {
      setCertifications(prev => prev.filter(c => c.id !== deleteTarget.id));
      toast.success('Sertifikat berhasil dihapus');
    } else {
      toast.error('Gagal menghapus sertifikat');
    }
    setIsDeleting(false);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari sertifikat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4" />
          Tambah
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Tidak ada sertifikat
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sertifikat</TableHead>
                <TableHead>Penerbit</TableHead>
                <TableHead>Tanggal Penerbitan</TableHead>
                <TableHead>Berlaku Hingga</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((cert) => (
                <TableRow key={cert.id}>
                  <TableCell className="font-medium">{cert.name}</TableCell>
                  <TableCell>{cert.issuer}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(cert.issueDate)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {cert.expiryDate ? formatDate(cert.expiryDate) : 'Seumur hidup'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={cert.isVisible ? 'default' : 'outline'}>
                      {cert.isVisible ? 'Terlihat' : 'Tersembunyi'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon-sm" onClick={() => { setSelectedCert(cert); setIsFormOpen(true); }}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(cert)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {isFormOpen && (
        <CertificationForm
          certification={selectedCert}
          onClose={() => { setIsFormOpen(false); setSelectedCert(null); }}
          onSuccess={() => { setIsFormOpen(false); setSelectedCert(null); loadCertifications(); }}
        />
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Sertifikat</AlertDialogTitle>
            <AlertDialogDescription>
              Yakin ingin menghapus sertifikat <strong>{deleteTarget?.name}</strong>? Tindakan ini tidak bisa dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
