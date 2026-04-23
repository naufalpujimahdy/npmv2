'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Loader2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCmsApi } from '@/hooks/useCmsApi';
import { ExperienceForm } from './forms/ExperienceForm';

interface Experience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
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

  const loadExperiences = useCallback(async () => {
    setIsLoading(true);
    const data = await request<Experience[]>('/api/portfolio/experience?include_hidden=true');
    if (Array.isArray(data)) {
      setExperiences(data);
    }
    setIsLoading(false);
  }, [request]);

  useEffect(() => {
    loadExperiences();
  }, [loadExperiences]);

  const filtered = experiences.filter((e) =>
    e.company.toLowerCase().includes(search.toLowerCase()) ||
    e.position.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'short',
    }).format(new Date(date));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus pengalaman ini?')) return;
    
    const result = await request('/api/portfolio/experience/' + id, {
      method: 'DELETE',
    });
    
    if (result) {
      setExperiences(experiences.filter(e => e.id !== id));
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedExperience(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    loadExperiences();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Cari pengalaman kerja..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button className="gap-2" onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4" />
          Tambah
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Tidak ada pengalaman kerja</p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
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
                  <TableCell>
                    <span className="font-medium">{exp.company}</span>
                  </TableCell>
                  <TableCell>{exp.position}</TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {formatDate(exp.startDate)} 
                    {exp.endDate ? ` - ${exp.isCurrent ? 'Sekarang' : formatDate(exp.endDate)}` : ' - Sekarang'}
                  </TableCell>
                  <TableCell>
                    <Badge className={exp.isVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {exp.isVisible ? 'Terlihat' : 'Tersembunyi'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedExperience(exp);
                          setIsFormOpen(true);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(exp.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
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
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}
