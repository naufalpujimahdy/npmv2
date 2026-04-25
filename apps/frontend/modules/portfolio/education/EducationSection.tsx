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
import { EducationForm } from './EducationForm';

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location?: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  isVisible: boolean;
  order: number;
  updatedAt: string;
}

export function EducationSection() {
  const { request } = useCmsApi();
  const [educations, setEducations] = useState<Education[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState<Education | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Education | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadEducations = useCallback(async () => {
    setIsLoading(true);
    const data = await request<Education[]>('/api/portfolio/education?include_hidden=true');
    if (Array.isArray(data)) setEducations(data);
    setIsLoading(false);
  }, [request]);

  useEffect(() => { loadEducations(); }, [loadEducations]);

  const filtered = educations.filter((e) =>
    e.institution.toLowerCase().includes(search.toLowerCase()) ||
    e.degree.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat('id-ID', { dateStyle: 'short' }).format(new Date(date));

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const result = await request(`/api/portfolio/education/${deleteTarget.id}`, { method: 'DELETE' });
    if (result) {
      setEducations(prev => prev.filter(e => e.id !== deleteTarget.id));
      toast.success('Pendidikan berhasil dihapus');
    } else {
      toast.error('Gagal menghapus pendidikan');
    }
    setIsDeleting(false);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Cari pendidikan..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
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
        <Card><CardContent className="py-12 text-center text-muted-foreground">Tidak ada riwayat pendidikan</CardContent></Card>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Institusi</TableHead>
                <TableHead>Gelar</TableHead>
                <TableHead>Bidang Studi</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((edu) => (
                <TableRow key={edu.id}>
                  <TableCell className="font-medium">{edu.institution}</TableCell>
                  <TableCell>{edu.degree}</TableCell>
                  <TableCell>{edu.field}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Sekarang'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={edu.isVisible ? 'default' : 'outline'}>
                      {edu.isVisible ? 'Terlihat' : 'Tersembunyi'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon-sm" onClick={() => { setSelectedEducation(edu); setIsFormOpen(true); }}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(edu)}>
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
        <EducationForm
          education={selectedEducation}
          onClose={() => { setIsFormOpen(false); setSelectedEducation(null); }}
          onSuccess={() => { setIsFormOpen(false); setSelectedEducation(null); loadEducations(); }}
        />
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pendidikan</AlertDialogTitle>
            <AlertDialogDescription>
              Yakin ingin menghapus riwayat pendidikan di <strong>{deleteTarget?.institution}</strong>? Tindakan ini tidak bisa dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive text-white hover:bg-destructive/90">
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
