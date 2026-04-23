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
import { CertificationForm } from './forms/CertificationForm';

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

  const loadCertifications = useCallback(async () => {
    setIsLoading(true);
    const data = await request<Certification[]>('/api/portfolio/certifications?include_hidden=true');
    if (Array.isArray(data)) {
      setCertifications(data);
    }
    setIsLoading(false);
  }, [request]);

  useEffect(() => {
    loadCertifications();
  }, [loadCertifications]);

  const filtered = certifications.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.issuer.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'short',
    }).format(new Date(date));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus sertifikat ini?')) return;
    
    const result = await request('/api/portfolio/certifications/' + id, {
      method: 'DELETE',
    });
    
    if (result) {
      setCertifications(certifications.filter(c => c.id !== id));
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedCert(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    loadCertifications();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Cari sertifikat..."
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
            <p className="text-gray-500">Tidak ada sertifikat</p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
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
                  <TableCell className="text-sm text-gray-600">
                    {formatDate(cert.issueDate)}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {cert.expiryDate ? formatDate(cert.expiryDate) : 'Seumur hidup'}
                  </TableCell>
                  <TableCell>
                    <Badge className={cert.isVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {cert.isVisible ? 'Terlihat' : 'Tersembunyi'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedCert(cert);
                          setIsFormOpen(true);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(cert.id)}
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
        <CertificationForm 
          certification={selectedCert}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}
