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
import { ExperienceForm } from './ExperienceForm';

interface Experience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  achievements?: string;
  technologies?: string;
  companyUrl?: string;
  isVisible: boolean;
  order: number;
  updatedAt: string;
}

export function ExperienceSection() {
  const { request } = useCmsApi();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Experience | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadExperiences = useCallback(async () => {
    setIsLoading(true);
    const data = await request<Experience[]>('/api/portfolio/experience?include_hidden=true');
    if (Array.isArray(data)) setExperiences(data);
    setIsLoading(false);
  }, [request]);

  useEffect(() => { loadExperiences(); }, [loadExperiences]);

  const filtered = experiences.filter((e) =>
    e.company.toLowerCase().includes(search.toLowerCase()) ||
    e.position.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat('id-ID', { dateStyle: 'short' }).format(new Date(date));

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const result = await request(`/api/portfolio/experience/${deleteTarget.id}`, { method: 'DELETE' });
    if (result) {
      setExperiences(prev => prev.filter(e => e.id !== deleteTarget.id));
      toast.success('Pengalaman kerja berhasil dihapus');
    } else {
      toast.error('Gagal menghapus pengalaman kerja');
    }
    setIsDeleting(false);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Cari pengalaman kerja..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
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
        <Card><CardContent className="py-12 text-center text-muted-foreground">Tidak ada pengalaman kerja</CardContent></Card>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Perusahaan</TableHead>
                <TableHead>Posisi</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((exp) => (
                <TableRow key={exp.id}>
                  <TableCell className="font-medium">{exp.company}</TableCell>
                  <TableCell>{exp.position}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(exp.startDate)} {exp.endDate
                      ? `- ${exp.isCurrent ? 'Sekarang' : formatDate(exp.endDate)}`
                      : '- Sekarang'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={exp.isVisible ? 'default' : 'outline'}>
                      {exp.isVisible ? 'Terlihat' : 'Tersembunyi'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon-sm" onClick={() => { setSelectedExperience(exp); setIsFormOpen(true); }}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(exp)}>
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
        <ExperienceForm
          experience={selectedExperience}
          onClose={() => { setIsFormOpen(false); setSelectedExperience(null); }}
          onSuccess={() => { setIsFormOpen(false); setSelectedExperience(null); loadExperiences(); }}
        />
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pengalaman Kerja</AlertDialogTitle>
            <AlertDialogDescription>
              Yakin ingin menghapus pengalaman di <strong>{deleteTarget?.company}</strong>? Tindakan ini tidak bisa dibatalkan.
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
