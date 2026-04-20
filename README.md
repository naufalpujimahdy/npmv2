# npmv2

Monorepo sederhana dengan dua app:

- `apps/backend`: Next App Router untuk API backend di port `3000`
- `apps/frontend`: Next App Router untuk UI frontend di port `3001`

## Struktur

Best practice untuk struktur ini adalah:

- root repo dipakai sebagai workspace manager
- `app/` hanya ada di package yang benar-benar merupakan Next app
- karena itu, `app/*` di root memang tidak perlu dikembalikan
- App Router yang aktif ada di `apps/backend/app` dan `apps/frontend/app`

## Menjalankan project

Install dependency workspace:

```bash
pnpm install
```

Siapkan environment variable:

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env.local
```

Isi minimal:

```env
# apps/backend/.env
# Local MySQL:
DATABASE_URL=mysql://root:password@localhost:3306/npmv2
JWT_SECRET=change-me

# Remote MySQL example:
# DATABASE_URL=mysql://user:pass@host:3306/database_name
```

```env
# apps/frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Jalankan backend dan frontend di terminal terpisah:

```bash
pnpm dev:backend
pnpm dev:frontend
```

Lalu buka:

- Frontend: `http://localhost:3001`
- Backend health check: `http://localhost:3000/api/health`
