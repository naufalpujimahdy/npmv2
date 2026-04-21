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
} from 'lucide-react';
import { useCmsApi } from '@/hooks/useCmsApi';

import { ProjectsSection } from './ProjectsSection';
import { SkillsSection } from './SkillsSection';

export function PortfolioManager() {
  const { request, loading } = useCmsApi();
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
    { label: 'Projects', value: stats.projects, icon: FolderKanban, color: 'bg-blue-100 text-blue-700' },
    { label: 'Experience', value: stats.experience, icon: Briefcase, color: 'bg-purple-100 text-purple-700' },
    { label: 'Education', value: stats.education, icon: BookOpen, color: 'bg-green-100 text-green-700' },
    { label: 'Skills', value: stats.skills, icon: Code, color: 'bg-yellow-100 text-yellow-700' },
    { label: 'Certifications', value: stats.certifications, icon: Award, color: 'bg-pink-100 text-pink-700' },
    { label: 'Languages', value: stats.languages, icon: Users, color: 'bg-indigo-100 text-indigo-700' },
    { label: 'Testimonials', value: stats.testimonials, icon: MessageSquare, color: 'bg-red-100 text-red-700' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Portfolio Management</h1>
        <p className="text-gray-600">Manage your portfolio sections</p>
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

      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="grid grid-cols-4 lg:grid-cols-7">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="certifications">Certs</TabsTrigger>
          <TabsTrigger value="languages">Languages</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="mt-6">
          <ProjectsSection />
        </TabsContent>

        <TabsContent value="experience" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Experience management interface coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Education management interface coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="mt-6">
          <SkillsSection />
        </TabsContent>

        <TabsContent value="certifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Certifications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Certifications management interface coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="languages" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Languages</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Languages management interface coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testimonials" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Testimonials</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Testimonials management interface coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
