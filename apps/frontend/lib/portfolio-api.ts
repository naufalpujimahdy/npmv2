const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface PortfolioResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
  details?: any;
}

// Personal Info
export async function getPersonalInfo(): Promise<any> {
  const res = await fetch(`${API_URL}/api/portfolio/personal`, {
    next: { revalidate: 3600 },
  });
  const data: PortfolioResponse<any> = await res.json();
  return data.ok ? data.data : null;
}

// Skills
export async function getSkills(category?: string, includeHidden = false): Promise<any[]> {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (includeHidden) params.append('include_hidden', 'true');

  const res = await fetch(`${API_URL}/api/portfolio/skills?${params}`, {
    next: { revalidate: 3600 },
  });
  const data: PortfolioResponse<any[]> = await res.json();
  return data.ok ? data.data || [] : [];
}

// Experience
export async function getExperience(includeHidden = false): Promise<any[]> {
  const params = new URLSearchParams();
  if (includeHidden) params.append('include_hidden', 'true');

  const res = await fetch(`${API_URL}/api/portfolio/experience?${params}`, {
    next: { revalidate: 3600 },
  });
  const data: PortfolioResponse<any[]> = await res.json();
  return data.ok ? data.data || [] : [];
}

// Education
export async function getEducation(includeHidden = false): Promise<any[]> {
  const params = new URLSearchParams();
  if (includeHidden) params.append('include_hidden', 'true');

  const res = await fetch(`${API_URL}/api/portfolio/education?${params}`, {
    next: { revalidate: 3600 },
  });
  const data: PortfolioResponse<any[]> = await res.json();
  return data.ok ? data.data || [] : [];
}

// Projects
export async function getProjects(featured = false, includeHidden = false): Promise<any[]> {
  const params = new URLSearchParams();
  if (featured) params.append('featured', 'true');
  if (includeHidden) params.append('include_hidden', 'true');

  const res = await fetch(`${API_URL}/api/portfolio/projects?${params}`, {
    next: { revalidate: 3600 },
  });
  const data: PortfolioResponse<any[]> = await res.json();
  return data.ok ? data.data || [] : [];
}

// Certifications
export async function getCertifications(includeHidden = false): Promise<any[]> {
  const params = new URLSearchParams();
  if (includeHidden) params.append('include_hidden', 'true');

  const res = await fetch(`${API_URL}/api/portfolio/certifications?${params}`, {
    next: { revalidate: 3600 },
  });
  const data: PortfolioResponse<any[]> = await res.json();
  return data.ok ? data.data || [] : [];
}

// Languages
export async function getLanguages(includeHidden = false): Promise<any[]> {
  const params = new URLSearchParams();
  if (includeHidden) params.append('include_hidden', 'true');

  const res = await fetch(`${API_URL}/api/portfolio/languages?${params}`, {
    next: { revalidate: 3600 },
  });
  const data: PortfolioResponse<any[]> = await res.json();
  return data.ok ? data.data || [] : [];
}

// Testimonials
export async function getTestimonials(includeHidden = false): Promise<any[]> {
  const params = new URLSearchParams();
  if (includeHidden) params.append('include_hidden', 'true');

  const res = await fetch(`${API_URL}/api/portfolio/testimonials?${params}`, {
    next: { revalidate: 3600 },
  });
  const data: PortfolioResponse<any[]> = await res.json();
  return data.ok ? data.data || [] : [];
}

// Contact Messages
export async function submitContactMessage(formData: any): Promise<PortfolioResponse<any>> {
  const res = await fetch(`${API_URL}/api/portfolio/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  return res.json();
}

export async function getContactMessages(): Promise<any[]> {
  const res = await fetch(`${API_URL}/api/portfolio/contact`, {
    cache: 'no-store',
  });
  const data: PortfolioResponse<any[]> = await res.json();
  return data.ok ? data.data || [] : [];
}
