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
import { LanguageForm } from './forms/LanguageForm';

interface Language {
  id: string;
  name: string;
  proficiency: string;
  order: number;
  isVisible: boolean;
  updatedAt: string;
}

export function LanguagesSection() {
  const { request } = useCmsApi();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);

  const loadLanguages = useCallback(async () => {
    setIsLoading(true);
    const data = await request<Language[]>('/api/portfolio/languages?include_hidden=true');
    if (Array.isArray(data)) {
      setLanguages(data);
    }
    setIsLoading(false);
  }, [request]);

  useEffect(() => {
    loadLanguages();
  }, [loadLanguages]);

  const filtered = languages.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus bahasa ini?')) return;
    
    const result = await request('/api/portfolio/languages/' + id, {
      method: 'DELETE',
    });
    
    if (result) {
      setLanguages(languages.filter(l => l.id !== id));
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedLanguage(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    loadLanguages();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Cari bahasa..."
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
            <p className="text-gray-500">Tidak ada bahasa</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((lang) => (
            <Card key={lang.id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{lang.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{lang.proficiency}</p>
                    </div>
                    <Badge className={lang.isVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {lang.isVisible ? 'Terlihat' : 'Tersembunyi'}
                    </Badge>
                  </div>
                  <div className="flex gap-2 pt-2 border-t">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setSelectedLanguage(lang);
                        setIsFormOpen(true);
                      }}
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDelete(lang.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2 text-red-600" />
                      Hapus
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isFormOpen && (
        <LanguageForm 
          language={selectedLanguage}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}
