'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Briefcase,
  FolderKanban,
  BookOpen,
  Award,
  Users,
  Code2,
  MessageSquare,
} from 'lucide-react';
import { useCmsApi } from '@/hooks/useCmsApi';
import { Skeleton } from '@/components/ui/skeleton';

interface Stats {
  projects: number;
  experience: number;
  education: number;
  skills: number;
  certifications: number;
  languages: number;
  testimonials: number;
}

const statConfig = [
  { key: 'projects', label: 'Projects', icon: FolderKanban, color: 'bg-blue-500/10 text-blue-500' },
  { key: 'experience', label: 'Experience', icon: Briefcase, color: 'bg-violet-500/10 text-violet-500' },
  { key: 'education', label: 'Education', icon: BookOpen, color: 'bg-emerald-500/10 text-emerald-500' },
  { key: 'skills', label: 'Skills', icon: Code2, color: 'bg-amber-500/10 text-amber-500' },
  { key: 'certifications', label: 'Certifications', icon: Award, color: 'bg-pink-500/10 text-pink-500' },
  { key: 'languages', label: 'Languages', icon: Users, color: 'bg-indigo-500/10 text-indigo-500' },
  { key: 'testimonials', label: 'Testimonials', icon: MessageSquare, color: 'bg-rose-500/10 text-rose-500' },
] as const;

export function PortfolioManager() {
  const { request } = useCmsApi();
  const [stats, setStats] = useState<Stats>({
    projects: 0, experience: 0, education: 0, skills: 0,
    certifications: 0, languages: 0, testimonials: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true);
      const [projects, experience, education, skills, certifications, languages, testimonials] = await Promise.all([
        request('/api/portfolio/projects?include_hidden=true'),
        request('/api/portfolio/experience?include_hidden=true'),
        request('/api/portfolio/education?include_hidden=true'),
        request('/api/portfolio/skills?include_hidden=true'),
        request('/api/portfolio/certifications?include_hidden=true'),
        request('/api/portfolio/languages?include_hidden=true'),
        request('/api/portfolio/testimonials?include_hidden=true'),
      ]);

      setStats({
        projects: Array.isArray(projects) ? projects.length : 0,
        experience: Array.isArray(experience) ? experience.length : 0,
        education: Array.isArray(education) ? education.length : 0,
        skills: Array.isArray(skills) ? skills.length : 0,
        certifications: Array.isArray(certifications) ? certifications.length : 0,
        languages: Array.isArray(languages) ? languages.length : 0,
        testimonials: Array.isArray(testimonials) ? testimonials.length : 0,
      });
      setIsLoading(false);
    };

    loadStats();
  }, [request]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Portfolio</h1>
        <p className="text-muted-foreground mt-1">Overview of all portfolio sections</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statConfig.map(({ key, label, icon: Icon, color }) => (
          <Card key={key}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{label}</p>
                  {isLoading ? (
                    <Skeleton className="mt-2 h-8 w-12" />
                  ) : (
                    <p className="mt-2 text-3xl font-bold">{stats[key]}</p>
                  )}
                </div>
                <div className={`rounded-lg p-2 ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
