# AI Model Hub

Repositório público de modelos de IA com backend REST (Express + Prisma + PostgreSQL) e frontend SPA (React + Vite + Tailwind).

## Funcionalidades
- Cadastro/login com JWT (access token + refresh token)
- CRUD completo de modelos com upload múltiplo de arquivos
- Download individual e download em ZIP
- Página de perfil e listagem por usuário
- Página "Testar IA" com inferência simulada realista
- Segurança: rate limit, CORS, helmet, validação com Zod e sanitização de nomes de arquivos

## Estrutura
```
backend/
frontend/
docker-compose.yml
```

## Rodando com Docker Compose
Pré-requisito: Docker + Docker Compose.

```bash
docker-compose up --build
```

A aplicação ficará em:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000/api

## Variáveis de ambiente
### Backend
Use `backend/.env.example` como base:
- `PORT`
- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `CORS_ORIGIN`

### Frontend
Use `frontend/.env.example` como base:
- `VITE_API_URL`

## Endpoints principais
### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`

### Modelos
- `GET /api/models`
- `GET /api/models/:id`
- `GET /api/models/:id/download/:fileId`
- `GET /api/models/:id/download-all`
- `POST /api/models` (privada)
- `PUT /api/models/:id` (privada)
- `DELETE /api/models/:id` (privada)
- `POST /api/models/:id/files` (privada)
- `DELETE /api/models/:id/files/:fileId` (privada)

### Usuário
- `GET /api/users/me` (privada)
- `PUT /api/users/me` (privada)
- `GET /api/users/:userId/models`

## Desenvolvimento local sem Docker (opcional)
Backend:
```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```
