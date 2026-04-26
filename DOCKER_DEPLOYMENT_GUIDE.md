# Docker Deployment Guide untuk VPS

## 📋 Prerequisites

Pastikan VPS Anda sudah memiliki:

- Docker (versi 20.10 atau lebih tinggi)
- Docker Compose (versi 2.0 atau lebih tinggi)
- Git (untuk clone repository)
- Domain sudah dikonfigurasi DNS pointing ke IP VPS

## 🚀 Setup Langkah-demi-Langkah

### 1. Prepare Environment File

```bash
# Login ke VPS Anda
ssh user@your-vps-ip

# Clone repository
git clone https://github.com/your-username/npmv2.git
cd npmv2

# Copy environment template
cp .env.docker.example .env.docker

# Edit environment file dengan nilai yang sesuai
nano .env.docker
```

**Isi file `.env.docker` dengan:**

```
DOMAIN=naufalpujimahdy.id
DB_ROOT_PASSWORD=ganti-dengan-password-kuat
DB_NAME=portfolio_db
DB_USER=portfolio_user
DB_PASSWORD=ganti-dengan-password-kuat
JWT_SECRET=ganti-dengan-secret-yang-sangat-kuat-minimal-32-karakter
NODE_ENV=production
```

### 2. Build Docker Images

```bash
# Build semua images
docker-compose build

# Atau build specific service
docker-compose build backend
docker-compose build frontend
```

### 3. Start Services

```bash
# Start semua services di background
docker-compose up -d

# Lihat logs
docker-compose logs -f

# Lihat logs specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
docker-compose logs -f caddy
```

### 4. Run Database Migrations

```bash
# Migrations akan otomatis jalan saat backend start
# Tapi jika perlu manual, jalankan:
docker-compose exec backend pnpm exec prisma migrate deploy --schema apps/backend/prisma/schema.prisma
```

### 5. Verify Services

```bash
# Check semua containers running
docker-compose ps

# Test API endpoint
curl https://naufalpujimahdy.id/api/health

# Test Frontend
curl https://naufalpujimahdy.id
```

## 📁 Architecture

```
┌─────────────────────────────────────────────┐
│           naufalpujimahdy.id                │
│              (Caddy Proxy)                  │
├─────────────────────────────────────────────┤
│   https://naufalpujimahdy.id                │
│           ↓                                 │
│       Frontend Container                    │
│       (Next.js port 3001)                   │
├─────────────────────────────────────────────┤
│   https://naufalpujimahdy.id/api            │
│           ↓                                 │
│       Backend Container                     │
│       (Next.js port 3000)                   │
│           ↓                                 │
│       MySQL Container                       │
│       (Port 3306)                           │
└─────────────────────────────────────────────┘
```

## 🛠️ Common Commands

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f caddy
docker-compose logs -f db
```

### Stop Services

```bash
# Stop without removing
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove everything including volumes (⚠️ DANGER - deletes data)
docker-compose down -v
```

### Restart Services

```bash
# Restart all
docker-compose restart

# Restart specific
docker-compose restart backend
docker-compose restart frontend
```

### Execute Commands

```bash
# Connect to backend container
docker-compose exec backend sh

# Connect to database
docker-compose exec db mysql -u portfolio_user -p

# Check database
docker-compose exec db mysql -u portfolio_user -p portfolio_db -e "SHOW TABLES;"

# Seed database
docker-compose exec backend pnpm seed
```

### View Database

```bash
# Access MySQL CLI
docker-compose exec db mysql -u portfolio_user -p

# Query database
USE portfolio_db;
SHOW TABLES;
DESC users;
```

### Rebuild After Code Changes

```bash
# Rebuild images
docker-compose build

# Restart services
docker-compose up -d

# View logs to confirm
docker-compose logs -f
```

## 🔧 SSL/TLS Configuration

Caddy automatically handles SSL/TLS certificates using Let's Encrypt:

- Certificate auto-renewal
- HTTP to HTTPS redirect
- www subdomain redirect

No manual configuration needed!

## 📊 Monitoring

### CPU & Memory Usage

```bash
docker stats
```

### Disk Space

```bash
docker system df

# Cleanup unused images/volumes
docker system prune -a
```

### Database Backups

```bash
# Backup database
docker-compose exec db mysqldump -u portfolio_user -p portfolio_db > backup.sql

# Restore database
cat backup.sql | docker-compose exec -T db mysql -u portfolio_user -p portfolio_db
```

## 🚨 Troubleshooting

### Container not starting?

```bash
# Check logs
docker-compose logs -f service-name

# Rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Database connection error?

```bash
# Check if db is healthy
docker-compose ps

# Restart db
docker-compose restart db

# Check database from container
docker-compose exec db mysql -u root -p -e "SHOW DATABASES;"
```

### Caddy SSL certificate issues?

```bash
# Check Caddy logs
docker-compose logs caddy

# Verify domain DNS
nslookup naufalpujimahdy.id

# Remove Caddy data and restart (will regenerate certificates)
docker-compose down
rm -rf caddy_data caddy_config
docker-compose up -d caddy
```

### API not responding?

```bash
# Check backend container
docker-compose logs backend

# Test connection
docker-compose exec backend wget -O- http://localhost:3000/api/health

# Verify environment variables
docker-compose config
```

## 🔐 Security Best Practices

1. **Environment Variables**: Jangan commit `.env.docker` ke git, gunakan `.env.docker.example`
2. **Passwords**: Gunakan password yang kuat dan random
3. **JWT Secret**: Minimal 32 karakter, random
4. **Database**: Backup regular database
5. **Firewall**: Hanya expose port 80 dan 443
6. **Updates**: Regularly update Docker images

## 📈 Performance Tips

1. **Set resource limits** di docker-compose.yml:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: "1"
          memory: 1G
```

2. **Enable compression** di Caddy
3. **Use CDN** untuk static files
4. **Monitor disk space** untuk database growth

## 🔄 Update Process

Untuk update code:

```bash
# Pull latest code
git pull origin main

# Rebuild images
docker-compose build

# Restart services
docker-compose up -d

# View logs
docker-compose logs -f
```

## 📞 Support

Jika ada masalah:

1. Check logs: `docker-compose logs -f`
2. Verify environment variables: `docker-compose config`
3. Restart services: `docker-compose restart`
4. Rebuild if needed: `docker-compose build && docker-compose up -d`

---

**Happy Deploying! 🚀**
