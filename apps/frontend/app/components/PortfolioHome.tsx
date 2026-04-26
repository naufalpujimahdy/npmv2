'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getPersonalInfo, getSkills, getExperience, getProjects } from '@/lib/portfolio-api';

const fadeUp    = { hidden: { opacity: 0, y: 24 }, visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: d } }) };
const slideLeft  = { hidden: { opacity: 0, x: -32 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } };
const slideRight = { hidden: { opacity: 0, x:  32 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } };
const stagger    = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const pillVar    = { hidden: { opacity: 0, scale: 0.85 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'backOut' } } };

const W = 'max-w-2xl mx-auto px-5';

function Divider() {
  return <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent my-10" />;
}

function TimelineDot() {
  return (
    <div className="hidden lg:flex justify-center items-center">
      <div className="relative z-10 w-3 h-3 bg-black border-2 border-white rounded-full shadow ring-1 ring-black" />
    </div>
  );
}

function ExperienceCard({ exp, alignRight }: { exp: any; alignRight: boolean }) {
  const tags = exp.technologies?.split(',').map((t: string) => t.trim()).filter(Boolean) ?? [];
  return (
    <div className={`bg-gray-50 border border-gray-200 hover:border-black transition-colors rounded-xl p-4 ${alignRight ? 'lg:text-right' : ''}`}>
      <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">
        {new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
        {' – '}
        {exp.isCurrent ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : ''}
      </p>
      <h3 className="text-sm font-black text-black mb-0.5">{exp.position}</h3>
      <p className="text-xs font-bold text-gray-500 mb-2">{exp.company}</p>
      <p className="text-xs leading-relaxed text-gray-600 mb-3">{exp.description}</p>
      {tags.length > 0 && (
        <div className={`flex flex-wrap gap-1 ${alignRight ? 'lg:justify-end' : ''}`}>
          {tags.map((t: string, i: number) => (
            <span key={i} className="bg-black text-white px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function BigProjectCard({ project, idx }: { project: any; idx: number }) {
  const tags = project.technologies?.split(',').map((t: string) => t.trim()).filter(Boolean) ?? [];
  const img  = project.images?.split(',')[0]?.trim();
  return (
    <div className="bg-black text-white p-5 h-full flex flex-col relative overflow-hidden rounded-xl">
      <div className="absolute -top-16 -right-16 w-40 h-40 bg-white/10 rounded-full" />
      <div className="relative z-10 flex flex-col h-full gap-3">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Project {String(idx + 1).padStart(2, '0')}</p>
        {img && <img src={img} alt={project.title} className="w-full h-32 object-cover rounded-lg" />}
        <h3 className="text-base font-black">{project.title}</h3>
        <p className="text-xs leading-relaxed text-gray-300 grow">{project.description}</p>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((t: string, i: number) => (
              <span key={i} className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold">{t}</span>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          {project.demoUrl   && <a href={project.demoUrl}   target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-white text-black rounded text-[10px] font-bold hover:bg-gray-100 transition-colors">Demo</a>}
          {project.sourceUrl && <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-white/20 rounded text-[10px] font-bold hover:bg-white/30 transition-colors">Source</a>}
        </div>
      </div>
    </div>
  );
}

function SmallProjectCard({ project, idx }: { project: any; idx: number }) {
  const tags = project.technologies?.split(',').map((t: string) => t.trim()).filter(Boolean).slice(0, 3) ?? [];
  const img  = project.images?.split(',')[0]?.trim();
  return (
    <div className="bg-linear-to-br from-gray-100 to-gray-200 border border-gray-300 hover:border-black transition-colors rounded-xl p-4 flex flex-col">
      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Project {String(idx + 1).padStart(2, '0')}</p>
      {img && <img src={img} alt={project.title} className="w-full h-20 object-cover rounded-lg mb-2" />}
      <h3 className="text-sm font-black text-black mb-1">{project.title}</h3>
      <p className="text-xs leading-relaxed text-gray-600 mb-3 grow">{project.description}</p>
      <div className="flex flex-wrap gap-1 mb-2">
        {tags.map((t: string, i: number) => <span key={i} className="bg-black text-white px-2 py-0.5 rounded text-[10px] font-bold">{t}</span>)}
      </div>
      <div className="flex gap-2">
        {project.demoUrl   && <a href={project.demoUrl}   target="_blank" rel="noopener noreferrer" className="px-2 py-1 bg-black text-white rounded text-[10px] font-bold hover:bg-gray-800 transition-colors">Demo</a>}
        {project.sourceUrl && <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer" className="px-2 py-1 border border-gray-400 text-gray-600 rounded text-[10px] font-bold hover:border-black hover:text-black transition-colors">Source</a>}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════ */
export default function PortfolioHome() {
  const [personal,   setPersonal]   = useState<any>(null);
  const [skills,     setSkills]     = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [projects,   setProjects]   = useState<any[]>([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [p, s, e, pr] = await Promise.all([getPersonalInfo(), getSkills(), getExperience(), getProjects()]);
        setPersonal(p); setSkills(s); setExperience(e); setProjects(pr);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-3" />
          <p className="text-gray-400 text-xs">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white text-gray-900 overflow-x-hidden">

      {/* ── HERO ── */}
      <section className={`${W} py-14`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div initial="hidden" animate="visible" variants={slideLeft}>
            <div className="mb-4">
              <div className="h-px w-8 bg-black mb-2" />
              <p className="text-[10px] tracking-[2px] uppercase font-bold text-gray-400">Developer</p>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black leading-tight tracking-tight mb-3">
              {personal?.fullName || 'Your Name'}
            </h1>
            {personal?.title && <p className="text-sm font-semibold text-gray-400 mb-3">{personal.title}</p>}
            <p className="text-xs leading-relaxed text-gray-500 mb-6 max-w-xs">
              {personal?.bio || 'Transforming ideas into elegant digital solutions.'}
            </p>
            <div className="flex flex-wrap gap-2">
              {personal?.email && (
                <a href={`mailto:${personal.email}`}
                  className="px-5 py-2 bg-black text-white rounded-lg font-semibold text-xs hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300">
                  Contact Me
                </a>
              )}
              {personal?.resumeUrl && (
                <a href={personal.resumeUrl} target="_blank" rel="noopener noreferrer"
                  className="px-5 py-2 border border-black text-black rounded-lg font-semibold text-xs hover:-translate-y-0.5 hover:bg-black hover:text-white transition-all duration-300">
                  Get CV
                </a>
              )}
            </div>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={slideRight} className="hidden lg:block">
            <div className="relative h-56">
              {personal?.avatarUrl ? (
                <img src={personal.avatarUrl} alt={personal.fullName} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <>
                  <motion.div className="absolute inset-0 bg-linear-to-br from-gray-100 to-gray-200 rounded-2xl"
                    animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />
                  <motion.div className="absolute top-4 right-4 w-12 h-12 bg-black rounded-xl opacity-80"
                    animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />
                  <motion.div className="absolute bottom-6 left-6 w-10 h-10 bg-gray-400 rounded-lg opacity-60"
                    animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }} />
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <Divider />

      {/* ── ABOUT ── */}
      <section className={`${W} py-10`}>
        <motion.h2 className="text-xl font-black tracking-tight mb-6"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          About Me
        </motion.h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideLeft}>
            <p className="text-xs leading-relaxed text-gray-600 mb-4">
              {personal?.bio || 'Full stack developer with experience crafting digital products.'}
            </p>
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div>
                <p className="text-2xl font-black text-black mb-0.5">{projects.length}+</p>
                <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Projects</p>
              </div>
              <div>
                <p className="text-2xl font-black text-black mb-0.5">{experience.length}+</p>
                <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Companies</p>
              </div>
            </div>
          </motion.div>

          <motion.div className="bg-gray-50 p-5 rounded-xl border border-gray-200"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideRight}>
            <h3 className="text-[10px] font-black tracking-widest uppercase text-black mb-4">Contact &amp; Links</h3>
            <div className="space-y-3">
              {[
                { label: personal?.email,    href: `mailto:${personal?.email}` },
                { label: personal?.location, href: null },
                { label: 'LinkedIn',         href: personal?.linkedinUrl },
                { label: 'GitHub',           href: personal?.githubUrl },
                { label: 'Website',          href: personal?.websiteUrl },
              ].filter(i => i.label).map((item, i) =>
                item.href ? (
                  <a key={i} href={item.href} target={item.href.startsWith('mailto') ? undefined : '_blank'} rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-gray-600 hover:text-black transition-colors">
                    <span className="w-1.5 h-1.5 bg-black rounded-full shrink-0" />{item.label}
                  </a>
                ) : (
                  <p key={i} className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full shrink-0" />{item.label}
                  </p>
                )
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <Divider />

      {/* ── SKILLS ── */}
      <section className={`${W} py-10`}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="text-xl font-black tracking-tight mb-1">Skills</h2>
          <p className="text-xs text-gray-400 mb-5">Core technologies I work with</p>
        </motion.div>
        <motion.div className="flex flex-wrap gap-1.5"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          {skills.length > 0
            ? skills.map((sk: any) => (
                <motion.span key={sk.id} variants={pillVar}
                  className="bg-black text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {sk.name}
                </motion.span>
              ))
            : <p className="text-gray-400 text-xs">Belum ada data skill.</p>
          }
        </motion.div>
      </section>

      <Divider />

      {/* ── EXPERIENCE ── */}
      <section className={`${W} py-10`}>
        <motion.h2 className="text-xl font-black tracking-tight mb-8"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          Professional Journey
        </motion.h2>

        <div className="relative py-2">
          <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-linear-to-b from-black via-gray-300 to-transparent" />
          <div className="space-y-6">
            {experience.length > 0 ? experience.map((exp: any, idx: number) => (
              <motion.div key={exp.id}
                className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-center"
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
                variants={idx % 2 === 0 ? slideLeft : slideRight}>
                {idx % 2 === 0
                  ? <><ExperienceCard exp={exp} alignRight /><TimelineDot /></>
                  : <><TimelineDot /><ExperienceCard exp={exp} alignRight={false} /></>
                }
              </motion.div>
            )) : <p className="text-xs text-gray-400">Belum ada data pengalaman.</p>}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── PROJECTS ── */}
      <section className={`${W} py-10`}>
        <motion.h2 className="text-xl font-black tracking-tight mb-6"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          Featured Works
        </motion.h2>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {projects[0] && (
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={slideLeft} whileHover={{ y: -3, transition: { duration: 0.25 } }}>
                <BigProjectCard project={projects[0]} idx={0} />
              </motion.div>
            )}
            <div className="flex flex-col gap-4">
              {projects.slice(1, 3).map((pr: any, i: number) => (
                <motion.div key={pr.id} initial="hidden" whileInView="visible"
                  viewport={{ once: true }} variants={fadeUp}
                  whileHover={{ y: -3, transition: { duration: 0.25 } }}>
                  <SmallProjectCard project={pr} idx={i + 1} />
                </motion.div>
              ))}
            </div>
          </div>
        ) : <p className="text-xs text-gray-400">Belum ada data proyek.</p>}
      </section>

      <Divider />

      {/* ── CTA ── */}
      <section className={`${W} py-14 text-center`}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.h2 variants={fadeUp} className="text-2xl lg:text-3xl font-black tracking-tight leading-tight mb-3">
            Let's Build Something<br />Extraordinary
          </motion.h2>
          <motion.p variants={fadeUp} className="text-xs text-gray-500 mb-6 max-w-xs mx-auto leading-relaxed">
            Ready to turn your ideas into reality? Let's collaborate and create something amazing.
          </motion.p>
          {personal?.email && (
            <motion.a variants={fadeUp} href={`mailto:${personal.email}`}
              className="inline-block px-7 py-3 bg-black text-white font-bold text-xs rounded-lg hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300">
              Start a Conversation
            </motion.a>
          )}
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-100 bg-gray-50 py-8">
        <div className={`${W} text-center`}>
          <p className="text-[10px] uppercase tracking-widest font-bold text-gray-300 mb-4">Connect</p>
          <div className="flex justify-center gap-6 mb-4 flex-wrap">
            {personal?.email      && <a href={`mailto:${personal.email}`} className="text-[10px] uppercase tracking-wider font-bold text-gray-400 hover:text-black transition-colors">Email</a>}
            {personal?.linkedinUrl && <a href={personal.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-wider font-bold text-gray-400 hover:text-black transition-colors">LinkedIn</a>}
            {personal?.githubUrl   && <a href={personal.githubUrl}   target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-wider font-bold text-gray-400 hover:text-black transition-colors">GitHub</a>}
            {personal?.websiteUrl  && <a href={personal.websiteUrl}  target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-wider font-bold text-gray-400 hover:text-black transition-colors">Website</a>}
          </div>
          <p className="text-[10px] text-gray-300">© {new Date().getFullYear()} {personal?.fullName || 'Portfolio'}</p>
        </div>
      </footer>

    </main>
  );
}
