# Trojans Rugby Hub - Backend API

Spring Boot REST API for the Trojans Rugby Hub website.

## Tech Stack

- Java 17+
- Spring Boot 3.2
- MariaDB (or SQLite for local dev)
- JWT Authentication
- Spring Security

## Quick Start (Local Development)

### With Docker

```bash
docker-compose up -d --build
```

The API will be available at `http://localhost:8080`

### Without Docker

```bash
# Install Maven first
./mvnw clean package -DskipTests

# Run
java -jar target/trojans-backend-1.0.0.jar
```

Note: Uses SQLite by default when running without Docker.

## Configuration

Set environment variables:

```properties
# Database (MariaDB)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=trojans
DB_USER=root
DB_PASSWORD=yourpassword

# JWT
JWT_SECRET=your-super-secret-key-minimum-256-bits

# CORS
CORS_ORIGINS=http://localhost:5173,https://your-domain.vercel.app
```

## Default Credentials

- Admin username: `admin`
- Admin password: `trojans2026`

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | Login | Public |
| POST | `/api/auth/register` | Register | Public |
| GET | `/api/players` | Get all players | Public |
| POST | `/api/players` | Create player | Admin |
| PUT | `/api/players/{id}` | Update player | Admin |
| DELETE | `/api/players/{id}` | Delete player | Admin |
| GET | `/api/news` | Get all news | Public |
| POST | `/api/news` | Create news | Admin |
| POST | `/api/images/upload` | Upload image | Public |
| GET | `/api/images/{filename}` | Get image | Public |

## Deployment Options

### Option 1: Railway (Recommended)

1. Create account at https://railway.app
2. Create new project → "New GitHub Repo"
3. Add MariaDB plugin to project
4. Set environment variables:
   - `DB_HOST` = the MariaDB hostname from Railway
   - `DB_PASSWORD` = your MariaDB password
   - `JWT_SECRET` = create a secure random string
   - `CORS_ORIGINS` = your Vercel frontend URL

```bash
railway init
railway deploy
```

### Option 2: Render

1. Create account at https://render.com
2. Create new Web Service
3. Connect to GitHub repository
4. Set environment variables
5. Build command: `./mvnw clean package -DskipTests`
6. Start command: `java -jar target/trojans-backend-1.0.0.jar`

### Option 3: Docker on any VPS

```bash
docker build -t trojans-backend .
docker run -d -p 8080:8080 \
  -e DB_HOST=your-db-host \
  -e DB_PASSWORD=your-password \
  -e JWT_SECRET=your-secret \
  trojans-backend
```

---

**Note:** Use `spring.jpa.hibernate.ddl-auto=update` for development. Change to `validate` for production.