# Trojans Rugby Hub - Backend API

Spring Boot REST API for the Trojans Rugby Hub website.

## Tech Stack

- Java 17+
- Spring Boot 3.2
- MariaDB
- JWT Authentication
- Spring Security

## Quick Start

### Prerequisites

- Java 17+
- Maven 3.8+
- MariaDB 10.6+

### Build & Run

```bash
# Build
mvn clean package -DskipTests

# Run
java -jar target/trojans-backend-1.0.0.jar
```

Or with Maven:

```bash
mvn spring-boot:run
```

## Configuration

Set environment variables or edit `src/main/resources/application.properties`:

```properties
# Database
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

## Deployment

### Railway (Recommended)

1. Create new project on Railway
2. Add MariaDB plugin
3. Deploy with Railway CLI:

```bash
railway init
railway deploy
```

Environment variables on Railway:
- `DB_HOST` - Database host
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - Your secret key
- `CORS_ORIGINS` - Your Vercel domain

### Render

1. Create new Web Service
2. Connect to repository
3. Set environment variables

---

**Note:** Use `spring.jpa.hibernate.ddl-auto=update` for development. Change to `validate` for production.