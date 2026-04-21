'use client';

import { useEffect, useState } from 'react';
import { getPersonalInfo, getSkills, getExperience, getEducation, getProjects } from '@/lib/portfolio-api';

export default function PortfolioHome() {
  const [personal, setPersonal] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [personalData, skillsData, expData, eduData, projectsData] = await Promise.all([
          getPersonalInfo(),
          getSkills(),
          getExperience(),
          getEducation(),
          getProjects(),
        ]);

        setPersonal(personalData);
        setSkills(skillsData);
        setExperience(expData);
        setEducation(eduData);
        setProjects(projectsData);
      } catch (error) {
        console.error('Error loading portfolio data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const skillsByCategory = skills.reduce((acc: any, skill: any) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          {personal?.avatarUrl && (
            <img
              src={personal.avatarUrl}
              alt={personal.fullName}
              className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-blue-500"
            />
          )}
          <h1 className="text-5xl font-bold text-white mb-4">{personal?.fullName}</h1>
          <p className="text-2xl text-blue-400 mb-4">{personal?.title}</p>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-6">{personal?.bio}</p>

          <div className="flex gap-4 justify-center flex-wrap">
            {personal?.email && (
              <a href={`mailto:${personal.email}`} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Email
              </a>
            )}
            {personal?.linkedinUrl && (
              <a href={personal.linkedinUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">
                LinkedIn
              </a>
            )}
            {personal?.githubUrl && (
              <a href={personal.githubUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">
                GitHub
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-12 text-center">Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {Object.entries(skillsByCategory).map(([category, categorySkills]: [string, any]) => (
            <div key={category}>
              <h3 className="text-2xl font-semibold text-blue-400 mb-6">{category}</h3>
              <div className="flex flex-wrap gap-3">
                {categorySkills.map((skill: any) => (
                  <span key={skill.id} className="px-4 py-2 bg-slate-700 text-slate-100 rounded-full text-sm font-medium hover:bg-blue-600 transition">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-12 text-center">Experience</h2>
        <div className="space-y-8">
          {experience.map((exp: any) => (
            <div key={exp.id} className="bg-slate-700 rounded-lg p-6 border border-slate-600 hover:border-blue-500 transition">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-2xl font-semibold text-blue-300">{exp.position}</h3>
                  <p className="text-lg text-slate-300">{exp.company}</p>
                </div>
                <span className="text-slate-400 text-sm">
                  {new Date(exp.startDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'short' })} 
                  {' - '}
                  {exp.isCurrent ? 'Present' : new Date(exp.endDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'short' })}
                </span>
              </div>
              <p className="text-slate-300 mb-4">{exp.description}</p>
              {exp.technologies && (
                <div className="flex flex-wrap gap-2">
                  {JSON.parse(exp.technologies).map((tech: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-slate-600 text-slate-200 rounded text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-12 text-center">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project: any) => (
            <div key={project.id} className="bg-slate-700 rounded-lg overflow-hidden border border-slate-600 hover:border-blue-500 transition group">
              {project.images && JSON.parse(project.images)[0] && (
                <img
                  src={JSON.parse(project.images)[0]}
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-blue-300 mb-2">{project.title}</h3>
                <p className="text-slate-300 text-sm mb-4">{project.description}</p>
                <div className="flex gap-2 flex-wrap">
                  {project.demoUrl && (
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                      Demo
                    </a>
                  )}
                  {project.sourceUrl && (
                    <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-slate-600 text-white rounded text-sm hover:bg-slate-500">
                      Source
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-6">Get In Touch</h2>
        <p className="text-slate-300 mb-8 text-lg">Feel free to reach out to me for any opportunities or questions.</p>
        {personal?.email && (
          <a href={`mailto:${personal.email}`} className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
            Send Email
          </a>
        )}
      </section>
    </main>
  );
}
