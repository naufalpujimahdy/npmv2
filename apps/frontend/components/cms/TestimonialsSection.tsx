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
import { TestimonialForm } from './forms/TestimonialForm';

interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  content: string;
  avatarUrl?: string;
  isVisible: boolean;
  order: number;
  updatedAt: string;
}

export function TestimonialsSection() {
  const { request } = useCmsApi();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  const loadTestimonials = useCallback(async () => {
    setIsLoading(true);
    const data = await request<Testimonial[]>('/api/portfolio/testimonials?include_hidden=true');
    if (Array.isArray(data)) {
      setTestimonials(data);
    }
    setIsLoading(false);
  }, [request]);

  useEffect(() => {
    loadTestimonials();
  }, [loadTestimonials]);

  const filtered = testimonials.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.company.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus testimoni ini?')) return;
    
    const result = await request('/api/portfolio/testimonials/' + id, {
      method: 'DELETE',
    });
    
    if (result) {
      setTestimonials(testimonials.filter(t => t.id !== id));
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedTestimonial(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    loadTestimonials();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Cari testimoni..."
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
            <p className="text-gray-500">Tidak ada testimoni</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((testimonial) => (
            <Card key={testimonial.id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm italic text-gray-600">"{testimonial.content.substring(0, 150)}..."</p>
                  </div>
                  <div className="border-t pt-4">
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-gray-600">{testimonial.position} @ {testimonial.company}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className={testimonial.isVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {testimonial.isVisible ? 'Terlihat' : 'Tersembunyi'}
                    </Badge>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedTestimonial(testimonial);
                          setIsFormOpen(true);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(testimonial.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isFormOpen && (
        <TestimonialForm 
          testimonial={selectedTestimonial}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}
