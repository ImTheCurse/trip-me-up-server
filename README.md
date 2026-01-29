```markdown
# Trip Me Up ✈️ - Backend (Node.js API)

This is the server-side API for the Trip Me Up application, handling data persistence, authentication, and external API integrations.

---

## ⚙️ Core Features
- **RESTful API**: Clean endpoints for managing routes, users, and places.
- **Database**: PostgreSQL hosted on **Neon.tech**.
- **Authentication**: Secure login/register flow with session-based credentials.
- **External Integrations**: OpenAI for smart chat and Google Places API for location data.
- **Validation**: Server-side checks for data integrity.

---

## 📂 API Endpoints

### Auth
- `POST /login` - User authentication.
- `POST /register` - New user creation.
- `GET /logout` - Clearing session.

### Routes
- `GET /route/:id` - Fetching a specific trip route.
- `PUT /route/update` - Updating trip stops and notes.
- `GET /history` - Fetching all routes for the logged-in user.

---

## 💻 How to Run

1. **Install dependencies:**
   ```bash
   bun install
2. **Environment Variables:**
    Create a .env file in the root directory:

    DATABASE_URL=my_postgresql_connection_string
    PORT=5000
    OPENAI_API_KEY=my_key

3. **Start the server:**

   node index.js

   Tech Stack
    Node.js, Express, PostgreSQL (Neon), Bun.
