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

interface Skill {
  id: number;
  name: string;
  category?: string;
  level?: string;
  hidden?: boolean;
  updatedAt: string;
}

export function SkillsSection() {
  const { request } = useCmsApi();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadSkills = useCallback(async () => {
    setIsLoading(true);
    const data = await request<Skill[]>('/api/portfolio/skills?include_hidden=true');
    if (Array.isArray(data)) {
      setSkills(data);
    }
    setIsLoading(false);
  }, [request]);

  useEffect(() => {
    loadSkills();
  }, [loadSkills]);

  const filtered = skills.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'short',
    }).format(new Date(date));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Skill
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No skills found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((skill) => (
            <Card key={skill.id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{skill.name}</h3>
                      {skill.category && (
                        <p className="text-sm text-gray-600">{skill.category}</p>
                      )}
                    </div>
                    <Badge
                      className={
                        skill.hidden
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-green-100 text-green-800'
                      }
                    >
                      {skill.hidden ? 'Hidden' : 'Visible'}
                    </Badge>
                  </div>
                  {skill.level && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Level:</span>
                      <Badge variant="outline">{skill.level}</Badge>
                    </div>
                  )}
                  <div className="flex gap-2 border-t pt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
