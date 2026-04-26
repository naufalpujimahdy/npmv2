'use client';

import { useEffect, useState } from 'react';
import { Popover } from 'radix-ui';
import { Check, ChevronsUpDown, Search, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';

interface Skill {
  id: string;
  name: string;
  category: string;
}

interface SkillMultiSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function SkillMultiSelect({
  value,
  onChange,
  placeholder = 'Pilih teknologi...',
  disabled,
}: SkillMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [search, setSearch] = useState('');

  const selected = value
    ? value.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  useEffect(() => {
    fetch(`${API_BASE}/api/portfolio/skills`, {
      headers: { 'x-api-key': API_KEY },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.ok && Array.isArray(json.data)) setSkills(json.data);
      })
      .catch(() => {});
  }, []);

  const toggle = (name: string) => {
    const next = selected.includes(name)
      ? selected.filter((s) => s !== name)
      : [...selected, name];
    onChange(next.join(', '));
  };

  const remove = (name: string) => {
    onChange(selected.filter((s) => s !== name).join(', '));
  };

  const filtered = skills.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filtered.reduce<Record<string, Skill[]>>((acc, skill) => {
    (acc[skill.category] ??= []).push(skill);
    return acc;
  }, {});

  return (
    <div className="space-y-2">
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              'flex min-h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
          >
            <span className={selected.length === 0 ? 'text-muted-foreground' : 'text-foreground'}>
              {selected.length === 0
                ? placeholder
                : `${selected.length} teknologi dipilih`}
            </span>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={4}
            style={{ width: 'var(--radix-popover-trigger-width)' }}
            className="z-50 rounded-md border bg-popover p-0 shadow-md outline-none animate-in fade-in-0 zoom-in-95"
          >
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <input
                className="flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                placeholder="Cari teknologi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="max-h-60 overflow-y-auto p-1">
              {Object.keys(grouped).length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  {skills.length === 0
                    ? 'Belum ada skill yang ditambahkan'
                    : 'Tidak ditemukan'}
                </p>
              ) : (
                Object.entries(grouped).map(([category, items]) => (
                  <div key={category}>
                    <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      {category}
                    </p>
                    {items.map((skill) => {
                      const isSelected = selected.includes(skill.name);
                      return (
                        <button
                          key={skill.id}
                          type="button"
                          onClick={() => toggle(skill.name)}
                          className={cn(
                            'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground',
                            isSelected && 'bg-accent/40'
                          )}
                        >
                          <Check
                            className={cn(
                              'h-4 w-4 shrink-0',
                              isSelected ? 'opacity-100' : 'opacity-0'
                            )}
                          />
                          {skill.name}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selected.map((name) => (
            <Badge key={name} variant="secondary" className="gap-1 pr-1">
              {name}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => remove(name)}
                  className="ml-0.5 rounded-full hover:bg-muted-foreground/20 p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
