'use client';

import { useRef, useState, DragEvent } from 'react';
import { Upload, X, ImageIcon, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  className?: string;
  disabled?: boolean;
}

async function uploadFile(file: File): Promise<string> {
  const form = new FormData();
  form.append('file', file);

  const res = await fetch(`${API_BASE}/api/upload`, {
    method: 'POST',
    headers: { 'x-api-key': API_KEY },
    body: form,
  });

  const json = await res.json();
  if (!res.ok || !json.ok) {
    throw new Error(json.error || 'Gagal mengupload gambar');
  }
  return json.data.url as string;
}

export function ImageUpload({ value, onChange, className, disabled }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleUpload = async (file: File) => {
    setError(null);
    setIsUploading(true);
    try {
      const url = await uploadFile(file);
      onChange(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Terjadi kesalahan saat mengupload');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    e.target.value = '';
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) handleUpload(file);
  };

  return (
    <div className={cn('space-y-2', className)}>
      {value ? (
        <div className="relative w-full h-40 rounded-md overflow-hidden border bg-muted">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          {!disabled && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-2 right-2 bg-background/80 hover:bg-background rounded-full p-1 border shadow-sm"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        <div
          onClick={() => !disabled && !isUploading && inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          className={cn(
            'flex flex-col items-center justify-center w-full h-40 rounded-md border-2 border-dashed cursor-pointer transition-colors select-none',
            isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/50',
            (disabled || isUploading) && 'opacity-60 cursor-not-allowed pointer-events-none'
          )}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <div className="h-6 w-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Mengupload...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <div className="p-2 rounded-full bg-muted">
                {isDragging ? <ImageIcon className="h-6 w-6" /> : <Upload className="h-6 w-6" />}
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">Klik atau drag & drop</p>
                <p className="text-xs">PNG, JPG, WebP, GIF — maks. 5MB</p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
      />
    </div>
  );
}

interface MultiImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export function MultiImageUpload({ value, onChange, className, disabled }: MultiImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const urls = value
    ? value.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const handleUpload = async (file: File) => {
    setError(null);
    setIsUploading(true);
    try {
      const url = await uploadFile(file);
      const next = [...urls, url];
      onChange(next.join(','));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Terjadi kesalahan saat mengupload');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (index: number) => {
    const next = urls.filter((_, i) => i !== index);
    onChange(next.join(','));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    e.target.value = '';
  };

  return (
    <div className={cn('space-y-2', className)}>
      {urls.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {urls.map((url, i) => (
            <div key={i} className="relative h-24 rounded-md overflow-hidden border bg-muted">
              <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemove(i)}
                  className="absolute top-1 right-1 bg-background/80 hover:bg-background rounded-full p-0.5 border shadow-sm"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => !disabled && !isUploading && inputRef.current?.click()}
        disabled={disabled || isUploading}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-md border border-dashed text-sm text-muted-foreground hover:bg-muted/50 transition-colors w-full justify-center',
          (disabled || isUploading) && 'opacity-60 cursor-not-allowed'
        )}
      >
        {isUploading ? (
          <>
            <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Mengupload...
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" />
            Tambah Gambar
          </>
        )}
      </button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
      />
    </div>
  );
}
