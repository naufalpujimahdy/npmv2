# 📚 Quick Reference - API Endpoints

## Base URL

```
http://localhost:3000
```

## All Endpoints Summary

| Method | Endpoint                        | Purpose                |
| ------ | ------------------------------- | ---------------------- |
| GET    | `/api/portfolio/personal`       | Get personal info      |
| PUT    | `/api/portfolio/personal`       | Update personal info   |
| GET    | `/api/portfolio/skills`         | Get all skills         |
| POST   | `/api/portfolio/skills`         | Create skill           |
| GET    | `/api/portfolio/experience`     | Get all experiences    |
| POST   | `/api/portfolio/experience`     | Create experience      |
| GET    | `/api/portfolio/education`      | Get all education      |
| POST   | `/api/portfolio/education`      | Create education       |
| GET    | `/api/portfolio/projects`       | Get all projects       |
| POST   | `/api/portfolio/projects`       | Create project         |
| GET    | `/api/portfolio/certifications` | Get all certifications |
| POST   | `/api/portfolio/certifications` | Create certification   |
| GET    | `/api/portfolio/languages`      | Get all languages      |
| POST   | `/api/portfolio/languages`      | Create language        |
| GET    | `/api/portfolio/testimonials`   | Get all testimonials   |
| POST   | `/api/portfolio/testimonials`   | Create testimonial     |
| GET    | `/api/portfolio/contact`        | Get all messages       |
| POST   | `/api/portfolio/contact`        | Submit contact form    |

---

## Endpoint Details

### Personal Info

**GET** `/api/portfolio/personal`

```bash
curl http://localhost:3000/api/portfolio/personal

Response:
{
  "ok": true,
  "data": {
    "id": "...",
    "fullName": "Naufal Puji Mahdy",
    "title": "Full Stack Web Developer",
    "bio": "...",
    "email": "naufalpm230800@gmail.com",
    "phone": "082391782895",
    "location": "Jakarta Selatan, DKI Jakarta, Indonesia",
    "websiteUrl": "https://naufalpujimahdy.id",
    "linkedinUrl": "https://linkedin.com/in/naufalpujimahdy",
    "githubUrl": "https://github.com/naufalpujimahdy",
    "avatarUrl": null,
    "resumeUrl": null
  }
}
```

**PUT** `/api/portfolio/personal`

```bash
curl -X PUT http://localhost:3000/api/portfolio/personal \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Naufal Puji Mahdy",
    "title": "Senior Full Stack Developer",
    "bio": "Updated bio...",
    "email": "naufalpm230800@gmail.com",
    "phone": "082391782895",
    "location": "Jakarta Selatan, DKI Jakarta, Indonesia",
    "websiteUrl": "https://naufalpujimahdy.id"
  }'
```

---

### Skills

**GET** `/api/portfolio/skills`

```bash
# Get all skills
curl http://localhost:3000/api/portfolio/skills

# Filter by category
curl "http://localhost:3000/api/portfolio/skills?category=Backend"

# Include hidden skills (admin only)
curl "http://localhost:3000/api/portfolio/skills?include_hidden=true"

Response:
{
  "ok": true,
  "data": [
    {
      "id": "skill-...",
      "name": "Laravel",
      "category": "Backend",
      "proficiency": "Expert",
      "iconUrl": null,
      "order": 1,
      "isVisible": true
    },
    ...
  ]
}
```

**POST** `/api/portfolio/skills`

```bash
curl -X POST http://localhost:3000/api/portfolio/skills \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Python",
    "category": "Backend",
    "proficiency": "Intermediate",
    "order": 19,
    "isVisible": true
  }'
```

---

### Experience

**GET** `/api/portfolio/experience`

```bash
curl http://localhost:3000/api/portfolio/experience

Response:
{
  "ok": true,
  "data": [
    {
      "id": "exp-...",
      "company": "PT Lawencon Internasional",
      "position": "PHP Developer",
      "location": "Jakarta, Indonesia",
      "startDate": "2025-07-01T00:00:00.000Z",
      "endDate": null,
      "isCurrent": true,
      "description": "...",
      "technologies": "[\"Laravel\", \"MySQL\", \"REST API\"]",
      "achievements": "[\"Implementasi 5 modules...\"]",
      "order": 1,
      "isVisible": true
    }
  ]
}
```

**POST** `/api/portfolio/experience`

```bash
curl -X POST http://localhost:3000/api/portfolio/experience \
  -H "Content-Type: application/json" \
  -d '{
    "company": "New Company",
    "position": "Developer",
    "location": "Jakarta",
    "startDate": "2025-01-01",
    "endDate": null,
    "isCurrent": true,
    "description": "Description here",
    "technologies": "[\"React\", \"Node.js\"]",
    "achievements": "[\"Achievement 1\"]",
    "order": 1
  }'
```

---

### Projects

**GET** `/api/portfolio/projects`

```bash
# Get all projects
curl http://localhost:3000/api/portfolio/projects

# Get only featured projects
curl "http://localhost:3000/api/portfolio/projects?featured=true"

# Include hidden projects
curl "http://localhost:3000/api/portfolio/projects?include_hidden=true"

Response:
{
  "ok": true,
  "data": [
    {
      "id": "proj-...",
      "title": "Aplikasi Pengenalan Objek Wisata",
      "slug": "aplikasi-wisata-siak",
      "description": "...",
      "technologies": "[\"React Native\", \"Firebase\"]",
      "images": "[\"url1\", \"url2\"]",
      "demoUrl": null,
      "sourceUrl": null,
      "featured": true,
      "status": "completed",
      "order": 1
    }
  ]
}
```

**POST** `/api/portfolio/projects`

```bash
curl -X POST http://localhost:3000/api/portfolio/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Project",
    "slug": "new-project",
    "description": "Project description",
    "longDescription": "Longer description...",
    "technologies": "[\"React\", \"Node.js\"]",
    "images": "[\"image_url\"]",
    "demoUrl": "https://demo.com",
    "sourceUrl": "https://github.com/user/project",
    "featured": true,
    "status": "completed",
    "order": 1
  }'
```

---

### Education

**GET** `/api/portfolio/education`

```bash
curl http://localhost:3000/api/portfolio/education
```

**POST** `/api/portfolio/education`

```bash
curl -X POST http://localhost:3000/api/portfolio/education \
  -H "Content-Type: application/json" \
  -d '{
    "institution": "University Name",
    "degree": "S1",
    "field": "Computer Science",
    "location": "City",
    "startDate": "2020-09-01",
    "endDate": "2024-08-31",
    "gpa": "3.50",
    "description": "...",
    "achievements": "[\"Achievement 1\"]",
    "order": 1
  }'
```

---

### Certifications

**GET** `/api/portfolio/certifications`

```bash
curl http://localhost:3000/api/portfolio/certifications
```

**POST** `/api/portfolio/certifications`

```bash
curl -X POST http://localhost:3000/api/portfolio/certifications \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Certification Name",
    "issuer": "Issuer Name",
    "issueDate": "2021-09-01",
    "expiryDate": null,
    "credentialId": "123456",
    "credentialUrl": "https://...",
    "description": "...",
    "order": 1
  }'
```

---

### Languages

**GET** `/api/portfolio/languages`

```bash
curl http://localhost:3000/api/portfolio/languages
```

**POST** `/api/portfolio/languages`

```bash
curl -X POST http://localhost:3000/api/portfolio/languages \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Japanese",
    "proficiency": "Beginner",
    "order": 3
  }'
```

---

### Testimonials

**GET** `/api/portfolio/testimonials`

```bash
curl http://localhost:3000/api/portfolio/testimonials
```

**POST** `/api/portfolio/testimonials`

```bash
curl -X POST http://localhost:3000/api/portfolio/testimonials \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Client Name",
    "position": "Project Manager",
    "company": "Company Name",
    "content": "Great work on the project...",
    "avatarUrl": null,
    "linkedinUrl": null,
    "order": 1
  }'
```

---

### Contact Messages

**GET** `/api/portfolio/contact`

```bash
curl http://localhost:3000/api/portfolio/contact

Response:
{
  "ok": true,
  "data": [
    {
      "id": "msg-...",
      "name": "John Doe",
      "email": "john@example.com",
      "subject": "Project Inquiry",
      "message": "I would like to discuss...",
      "isRead": false,
      "createdAt": "2024-04-21T10:00:00.000Z"
    }
  ]
}
```

**POST** `/api/portfolio/contact`

```bash
curl -X POST http://localhost:3000/api/portfolio/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Project Inquiry",
    "message": "I would like to discuss a potential project"
  }'

Response:
{
  "ok": true,
  "data": {
    "id": "msg-...",
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Project Inquiry",
    "message": "...",
    "isRead": false,
    "createdAt": "2024-04-21T10:00:00.000Z"
  }
}
```

---

## Query Parameters Reference

### Common Query Parameters

| Parameter        | Type    | Description           | Example                |
| ---------------- | ------- | --------------------- | ---------------------- |
| `category`       | string  | Filter by category    | `?category=Backend`    |
| `featured`       | boolean | Filter featured items | `?featured=true`       |
| `include_hidden` | boolean | Include hidden items  | `?include_hidden=true` |
| `take`           | number  | Limit results         | `?take=10`             |
| `skip`           | number  | Offset results        | `?skip=20`             |

---

## Error Responses

### Validation Error (400)

```json
{
  "ok": false,
  "error": "Validation failed",
  "details": [
    {
      "code": "too_small",
      "minimum": 3,
      "type": "string",
      "path": ["name"],
      "message": "String must contain at least 3 character(s)"
    }
  ]
}
```

### Not Found (404)

```json
{
  "ok": false,
  "error": "Personal info not found"
}
```

### Server Error (500)

```json
{
  "ok": false,
  "error": "Internal server error"
}
```

---

## HTTP Status Codes

| Status | Meaning        | When               |
| ------ | -------------- | ------------------ |
| 200    | OK             | GET/PUT successful |
| 201    | Created        | POST successful    |
| 400    | Bad Request    | Validation error   |
| 404    | Not Found      | Resource not found |
| 500    | Internal Error | Server error       |

---

## Frontend Usage Example

```typescript
// In React component
import {
  getPersonalInfo,
  getSkills,
  getProjects
} from '@/lib/portfolio-api';

export default function Portfolio() {
  const [personal, setPersonal] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await getPersonalInfo();
      setPersonal(data);
    };
    loadData();
  }, []);

  return <div>{personal?.fullName}</div>;
}
```

---

## Testing Endpoints

### Using Postman

1. Import BASE_URL: `http://localhost:3000`
2. Create requests for each endpoint
3. Save responses for reference

### Using Insomnia

```yaml
_type: export
__export_format: 4
__export_date: 2024-04-21
resources:
  - _id: req_portfolio
    _type: request
    name: Get Skills
    method: GET
    url: http://localhost:3000/api/portfolio/skills
```

### Using cURL Scripts

```bash
#!/bin/bash
BASE_URL="http://localhost:3000"

echo "=== Getting Personal Info ==="
curl $BASE_URL/api/portfolio/personal | jq

echo "\n=== Getting Skills ==="
curl "$BASE_URL/api/portfolio/skills?category=Backend" | jq

echo "\n=== Getting Projects ==="
curl "$BASE_URL/api/portfolio/projects?featured=true" | jq
```

---

**Last Updated**: April 21, 2026
**API Version**: 1.0.0
**Status**: Production Ready ✅
