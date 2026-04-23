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
import { Card, CardContent } from '@/components/ui/card';
import { useCmsApi } from '@/hooks/useCmsApi';
import { EducationForm } from './forms/EducationForm';

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

  const loadEducations = useCallback(async () => {
    setIsLoading(true);
    const data = await request<Education[]>('/api/portfolio/education?include_hidden=true');
    if (Array.isArray(data)) {
      setEducations(data);
    }
    setIsLoading(false);
  }, [request]);

  useEffect(() => {
    loadEducations();
  }, [loadEducations]);

  const filtered = educations.filter((e) =>
    e.institution.toLowerCase().includes(search.toLowerCase()) ||
    e.degree.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'short',
    }).format(new Date(date));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus pendidikan ini?')) return;
    
    const result = await request('/api/portfolio/education/' + id, {
      method: 'DELETE',
    });
    
    if (result) {
      setEducations(educations.filter(e => e.id !== id));
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedEducation(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    loadEducations();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Cari pendidikan..."
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
            <p className="text-gray-500">Tidak ada riwayat pendidikan</p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
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
                  <TableCell className="text-sm text-gray-600">
                    {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Sekarang'}
                  </TableCell>
                  <TableCell>
                    <Badge className={edu.isVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {edu.isVisible ? 'Terlihat' : 'Tersembunyi'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedEducation(edu);
                          setIsFormOpen(true);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(edu.id)}
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
        <EducationForm 
          education={selectedEducation}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}
