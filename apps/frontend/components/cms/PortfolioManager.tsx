'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Briefcase,
  FolderKanban,
  BookOpen,
  Award,
  Users,
  Code,
  MessageSquare,
  User,
} from 'lucide-react';
import { useCmsApi } from '@/hooks/useCmsApi';

import { ProjectsSection } from './ProjectsSection';
import { SkillsSection } from './SkillsSection';
import { ExperienceSection } from './ExperienceSection';
import { EducationSection } from './EducationSection';
import { CertificationsSection } from './CertificationsSection';
import { LanguagesSection } from './LanguagesSection';
import { TestimonialsSection } from './TestimonialsSection';
import { PersonalInfoSection } from './PersonalInfoSection';

export function PortfolioManager() {
  const { request } = useCmsApi();
  const [stats, setStats] = useState({
    projects: 0,
    experience: 0,
    education: 0,
    skills: 0,
    certifications: 0,
    languages: 0,
    testimonials: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
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
    };

    loadStats();
  }, [request]);

  const statCards = [
    { label: 'Proyek', value: stats.projects, icon: FolderKanban, color: 'bg-blue-100 text-blue-700' },
    { label: 'Pengalaman', value: stats.experience, icon: Briefcase, color: 'bg-purple-100 text-purple-700' },
    { label: 'Pendidikan', value: stats.education, icon: BookOpen, color: 'bg-green-100 text-green-700' },
    { label: 'Keahlian', value: stats.skills, icon: Code, color: 'bg-yellow-100 text-yellow-700' },
    { label: 'Sertifikat', value: stats.certifications, icon: Award, color: 'bg-pink-100 text-pink-700' },
    { label: 'Bahasa', value: stats.languages, icon: Users, color: 'bg-indigo-100 text-indigo-700' },
    { label: 'Testimoni', value: stats.testimonials, icon: MessageSquare, color: 'bg-red-100 text-red-700' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manajemen Portfolio</h1>
        <p className="text-gray-600">Kelola semua bagian portfolio Anda</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="mt-2 text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`rounded-lg p-2 ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-4 gap-0 lg:grid-cols-8 overflow-x-auto">
          <TabsTrigger value="personal" className="text-xs">Info</TabsTrigger>
          <TabsTrigger value="projects" className="text-xs">Proyek</TabsTrigger>
          <TabsTrigger value="experience" className="text-xs">Kerja</TabsTrigger>
          <TabsTrigger value="education" className="text-xs">Pendidikan</TabsTrigger>
          <TabsTrigger value="skills" className="text-xs">Keahlian</TabsTrigger>
          <TabsTrigger value="certifications" className="text-xs">Sertifikat</TabsTrigger>
          <TabsTrigger value="languages" className="text-xs">Bahasa</TabsTrigger>
          <TabsTrigger value="testimonials" className="text-xs">Testimoni</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-6">
          <PersonalInfoSection />
        </TabsContent>

        <TabsContent value="projects" className="mt-6">
          <ProjectsSection />
        </TabsContent>

        <TabsContent value="experience" className="mt-6">
          <ExperienceSection />
        </TabsContent>

        <TabsContent value="education" className="mt-6">
          <EducationSection />
        </TabsContent>

        <TabsContent value="skills" className="mt-6">
          <SkillsSection />
        </TabsContent>

        <TabsContent value="certifications" className="mt-6">
          <CertificationsSection />
        </TabsContent>

        <TabsContent value="languages" className="mt-6">
          <LanguagesSection />
        </TabsContent>

        <TabsContent value="testimonials" className="mt-6">
          <TestimonialsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
