'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getPersonalInfo, getSkills, getExperience, getProjects } from '@/lib/portfolio-api';

/* ── animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
  }),
};
const slideLeft  = { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } };
const slideRight = { hidden: { opacity: 0, x:  50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } };
const stagger    = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const pillVar    = { hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: 'backOut' } } };

function Divider() {
  return <div className="h-px bg-linear-to-r from-transparent via-gray-300 to-transparent my-16" />;
}

function TimelineDot() {
  return (
    <div className="hidden lg:flex justify-center items-center">
      <div className="relative z-10 w-4 h-4 bg-black border-4 border-white rounded-full shadow-lg ring-2 ring-black" />
    </div>
  );
}

function ExperienceCard({ exp, alignRight }: { exp: any; alignRight: boolean }) {
  const tags = exp.technologies ? exp.technologies.split(',').map((t: string) => t.trim()).filter(Boolean) : [];
  return (
    <div className={`bg-gray-50 border-2 border-gray-200 hover:border-black transition-colors rounded-2xl p-6 ${alignRight ? 'lg:text-right' : 'text-left'}`}>
      <p className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-2">
        {new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
        {' – '}
        {exp.isCurrent ? 'Present' : exp.endDate
          ? new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
          : ''}
      </p>
      <h3 className="text-xl font-black text-black mb-1">{exp.position}</h3>
      <p className="font-bold text-gray-600 mb-3">{exp.company}</p>
      <p className="text-sm leading-relaxed text-gray-600 mb-4">{exp.description}</p>
      {tags.length > 0 && (
        <div className={`flex flex-wrap gap-2 ${alignRight ? 'lg:justify-end' : 'justify-start'}`}>
          {tags.map((t: string, i: number) => (
            <span key={i} className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function BigProjectCard({ project, idx }: { project: any; idx: number }) {
  const tags = project.technologies ? project.technologies.split(',').map((t: string) => t.trim()).filter(Boolean) : [];
  const firstImage = project.images?.split(',')[0]?.trim();
  return (
    <div className="bg-black text-white p-8 h-full flex flex-col justify-between relative overflow-hidden rounded-2xl min-h-80">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full" />
      <div className="relative z-10 flex flex-col h-full gap-4">
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
          Project {String(idx + 1).padStart(2, '0')}
        </p>
        {firstImage && (
          <img src={firstImage} alt={project.title} className="w-full h-44 object-cover rounded-xl" />
        )}
        <h3 className="text-2xl lg:text-3xl font-black">{project.title}</h3>
        <p className="text-sm leading-relaxed text-gray-300 grow">{project.description}</p>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((t: string, i: number) => (
              <span key={i} className="bg-white/20 text-white px-3 py-1 rounded-lg text-xs font-bold">{t}</span>
            ))}
          </div>
        )}
        <div className="flex gap-2 pt-1">
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
              className="px-4 py-2 bg-white text-black rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors">
              Demo
            </a>
          )}
          {project.sourceUrl && (
            <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer"
              className="px-4 py-2 bg-white/20 text-white rounded-lg text-xs font-bold hover:bg-white/30 transition-colors">
              Source
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function SmallProjectCard({ project, idx }: { project: any; idx: number }) {
  const tags = project.technologies ? project.technologies.split(',').map((t: string) => t.trim()).filter(Boolean).slice(0, 3) : [];
  const firstImage = project.images?.split(',')[0]?.trim();
  return (
    <div className="bg-linear-to-br from-gray-100 to-gray-200 border-2 border-gray-300 hover:border-black transition-colors rounded-2xl p-6 flex flex-col">
      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-2">
        Project {String(idx + 1).padStart(2, '0')}
      </p>
      {firstImage && (
        <img src={firstImage} alt={project.title} className="w-full h-28 object-cover rounded-lg mb-3" />
      )}
      <h3 className="text-lg font-black text-black mb-2">{project.title}</h3>
      <p className="text-xs leading-relaxed text-gray-700 mb-4 grow">{project.description}</p>
      <div className="flex flex-wrap gap-1 mb-3">
        {tags.map((t: string, i: number) => (
          <span key={i} className="bg-black text-white px-2 py-1 rounded text-xs font-bold">{t}</span>
        ))}
      </div>
      <div className="flex gap-2">
        {project.demoUrl && (
          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
            className="px-3 py-1.5 bg-black text-white rounded text-xs font-bold hover:bg-gray-800 transition-colors">
            Demo
          </a>
        )}
        {project.sourceUrl && (
          <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer"
            className="px-3 py-1.5 border border-gray-400 text-gray-700 rounded text-xs font-bold hover:border-black hover:text-black transition-colors">
            Source
          </a>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════ */
export default function PortfolioHome() {
  const [personal,   setPersonal]   = useState<any>(null);
  const [skills,     setSkills]     = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [projects,   setProjects]   = useState<any[]>([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [p, s, e, pr] = await Promise.all([
          getPersonalInfo(), getSkills(), getExperience(), getProjects(),
        ]);
        setPersonal(p); setSkills(s); setExperience(e); setProjects(pr);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white text-gray-900 overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="px-6 lg:px-8 py-20 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <motion.div initial="hidden" animate="visible" variants={slideLeft}>
            <div className="mb-5">
              <div className="h-0.5 w-10 bg-black mb-3" />
              <p className="text-xs tracking-[2px] uppercase font-bold text-gray-500">Developer</p>
            </div>
            <h1 className="text-[56px] lg:text-[72px] font-black leading-[1.1] tracking-[-2px] mb-5">
              {personal?.fullName || 'Your Name'}
            </h1>
            {personal?.title && (
              <p className="text-xl font-semibold text-gray-500 mb-4">{personal.title}</p>
            )}
            <p className="text-base lg:text-lg leading-relaxed text-gray-500 mb-8 max-w-md">
              {personal?.bio || 'Transforming ideas into elegant digital solutions.'}
            </p>
            <div className="flex flex-wrap gap-3">
              {personal?.email && (
                <a href={`mailto:${personal.email}`}
                  className="px-7 py-3 bg-black text-white rounded-lg font-semibold text-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                  Contact Me
                </a>
              )}
              {personal?.resumeUrl && (
                <a href={personal.resumeUrl} target="_blank" rel="noopener noreferrer"
                  className="px-7 py-3 border-2 border-black text-black rounded-lg font-semibold text-sm hover:-translate-y-1 hover:bg-black hover:text-white transition-all duration-300">
                  Get CV
                </a>
              )}
            </div>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={slideRight} className="hidden lg:block">
            <div className="relative h-100">
              {personal?.avatarUrl ? (
                <img src={personal.avatarUrl} alt={personal.fullName}
                  className="w-full h-full object-cover rounded-3xl" />
              ) : (
                <>
                  <motion.div
                    className="absolute inset-0 bg-linear-to-br from-gray-100 to-gray-200 rounded-3xl"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.div className="absolute top-5 right-5 w-20 h-20 bg-black rounded-2xl opacity-80"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />
                  <motion.div className="absolute bottom-10 left-10 w-16 h-16 bg-gray-400 rounded-xl opacity-60"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }} />
                </>
              )}
            </div>
          </motion.div>

        </div>
      </section>

      <Divider />

      {/* ── ABOUT ── */}
      <section className="px-6 lg:px-8 py-16 max-w-4xl mx-auto">
        <motion.h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-10"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          About Me
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideLeft}>
            <p className="text-sm lg:text-base leading-relaxed text-gray-600 mb-5">
              {personal?.bio || 'Full stack developer with experience crafting digital products.'}
            </p>

            <div className="grid grid-cols-2 gap-6 p-6 bg-gray-50 rounded-xl border border-gray-200 mt-6">
              <div>
                <p className="text-3xl lg:text-4xl font-black text-black mb-1">{projects.length}+</p>
                <p className="text-xs uppercase tracking-wider font-bold text-gray-500">Projects</p>
              </div>
              <div>
                <p className="text-3xl lg:text-4xl font-black text-black mb-1">{experience.length}+</p>
                <p className="text-xs uppercase tracking-wider font-bold text-gray-500">Companies</p>
              </div>
            </div>
          </motion.div>

          <motion.div className="bg-gray-50 p-8 rounded-2xl border-2 border-gray-200"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideRight}>
            <h3 className="text-xs font-black tracking-[1.5px] uppercase text-black mb-7">Contact &amp; Links</h3>
            <div className="space-y-4">
              {[
                { label: personal?.email,       href: `mailto:${personal?.email}` },
                { label: personal?.location,    href: null },
                { label: 'LinkedIn',            href: personal?.linkedinUrl },
                { label: 'GitHub',              href: personal?.githubUrl },
                { label: 'Website',             href: personal?.websiteUrl },
              ].filter(item => item.label).map((item, i) =>
                item.href ? (
                  <a key={i} href={item.href} target={item.href.startsWith('mailto') ? undefined : '_blank'} rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-gray-600 hover:text-black transition-colors">
                    <span className="w-2 h-2 bg-black rounded-full shrink-0" />
                    {item.label}
                  </a>
                ) : (
                  <p key={i} className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="w-2 h-2 bg-gray-400 rounded-full shrink-0" />
                    {item.label}
                  </p>
                )
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <Divider />

      {/* ── SKILLS ── */}
      <section className="px-6 lg:px-8 py-16 max-w-4xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-2">Skills</h2>
          <p className="text-gray-500 font-medium mb-8 text-sm">Core technologies and tools I work with daily</p>
        </motion.div>

        <motion.div className="flex flex-wrap gap-2"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          {skills.length > 0
            ? skills.map((sk: any) => (
                <motion.span key={sk.id} variants={pillVar}
                  className="bg-black text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">
                  {sk.name}
                </motion.span>
              ))
            : <p className="text-gray-400">Belum ada data skill.</p>
          }
        </motion.div>
      </section>

      <Divider />

      {/* ── EXPERIENCE (tree timeline) ── */}
      <section className="px-6 lg:px-8 py-16 max-w-4xl mx-auto">
        <motion.h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-14"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          Professional Journey
        </motion.h2>

        <div className="relative py-4">
          {/* vertical line – desktop only */}
          <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-linear-to-b from-black via-gray-400 to-transparent" />

          <div className="space-y-10">
            {experience.length > 0 ? experience.map((exp: any, idx: number) => (
              <motion.div
                key={exp.id}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={idx % 2 === 0 ? slideLeft : slideRight}
              >
                {idx % 2 === 0 ? (
                  /* even → card LEFT (right-aligned), dot RIGHT */
                  <>
                    <ExperienceCard exp={exp} alignRight />
                    <TimelineDot />
                  </>
                ) : (
                  /* odd → dot LEFT, card RIGHT (left-aligned) */
                  <>
                    <TimelineDot />
                    <ExperienceCard exp={exp} alignRight={false} />
                  </>
                )}
              </motion.div>
            )) : (
              <p className="text-gray-400">Belum ada data pengalaman.</p>
            )}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── PROJECTS ── */}
      <section className="px-6 lg:px-8 py-16 max-w-4xl mx-auto">
        <motion.h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-12"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          Featured Works
        </motion.h2>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* tall dark card — first project */}
            {projects[0] && (
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={slideLeft} whileHover={{ y: -4, transition: { duration: 0.3 } }}>
                <BigProjectCard project={projects[0]} idx={0} />
              </motion.div>
            )}

            {/* stacked lighter cards — projects 2 & 3 */}
            <div className="flex flex-col gap-6">
              {projects.slice(1, 3).map((pr: any, i: number) => (
                <motion.div key={pr.id} initial="hidden" whileInView="visible"
                  viewport={{ once: true }} variants={fadeUp} custom={(i + 1) * 0.1}
                  whileHover={{ y: -4, transition: { duration: 0.3 } }}>
                  <SmallProjectCard project={pr} idx={i + 1} />
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-400">Belum ada data proyek.</p>
        )}
      </section>

      <Divider />

      {/* ── CTA ── */}
      <section className="px-6 lg:px-8 py-24 max-w-4xl mx-auto text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.h2 variants={fadeUp}
            className="text-5xl lg:text-6xl font-black tracking-[-1.5px] leading-tight mb-6">
            Let's Build Something<br />Extraordinary
          </motion.h2>
          <motion.p variants={fadeUp} className="text-base lg:text-lg text-gray-500 mb-10 max-w-lg mx-auto">
            Ready to turn your ideas into reality? Let's collaborate and create something amazing together.
          </motion.p>
          {personal?.email && (
            <motion.a variants={fadeUp} href={`mailto:${personal.email}`}
              className="inline-block px-10 py-4 bg-black text-white font-bold rounded-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              Start a Conversation
            </motion.a>
          )}
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-6 lg:px-8 py-12 border-t-2 border-gray-100 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-6">Connect With Me</p>
          <div className="flex justify-center gap-8 mb-8 flex-wrap">
            {personal?.email && (
              <a href={`mailto:${personal.email}`}
                className="text-xs uppercase tracking-wider font-bold text-gray-400 hover:text-black transition-colors">
                Email
              </a>
            )}
            {personal?.linkedinUrl && (
              <a href={personal.linkedinUrl} target="_blank" rel="noopener noreferrer"
                className="text-xs uppercase tracking-wider font-bold text-gray-400 hover:text-black transition-colors">
                LinkedIn
              </a>
            )}
            {personal?.githubUrl && (
              <a href={personal.githubUrl} target="_blank" rel="noopener noreferrer"
                className="text-xs uppercase tracking-wider font-bold text-gray-400 hover:text-black transition-colors">
                GitHub
              </a>
            )}
            {personal?.websiteUrl && (
              <a href={personal.websiteUrl} target="_blank" rel="noopener noreferrer"
                className="text-xs uppercase tracking-wider font-bold text-gray-400 hover:text-black transition-colors">
                Website
              </a>
            )}
          </div>
          <p className="text-xs text-gray-300">© {new Date().getFullYear()} {personal?.fullName || 'Portfolio'}</p>
        </div>
      </footer>

    </main>
  );
}
