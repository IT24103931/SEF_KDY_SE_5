# CleanSL - Community Waste Reporting Platform

**Cleaner Communities Start With Reporting**

CleanSL is a small MERN-stack university hackathon prototype for reporting and discovering community waste problems in Sri Lanka. It is designed to help residents and communities organize information about issues such as illegal dumping, overflowing garbage, plastic waste, hazardous waste, and unmanaged waste near public places.

> CleanSL is a university hackathon prototype and is not an official government reporting service.

## Selected Problem

People may notice waste problems in their neighbourhoods but lack a simple way to record, find, and compare those issues. This can affect residents, students, commuters, businesses, local communities, and visitors, especially around public spaces, roads, schools, hospitals, drainage areas, and waterways.

## Proposed Solution

CleanSL provides a simple reporting form and a community reports directory. The backend validates each report and calculates a priority score from urgency, waste size, waste category, and whether the location is sensitive. Visitors can search, filter, sort, and inspect reports, while the home page presents live summary statistics.

## Main Features

- Submit a waste issue with friendly validation
- Backend priority score and priority level calculation
- Community report listing and details modal
- Search by area, district, description, or waste category
- Filter by district, category, priority, and status
- Sort by newest, oldest, or highest priority
- Live community statistics
- Responsive desktop, tablet, and mobile interface
- Fictional Sri Lankan district-based sample data
- Optional browser location capture using latitude and longitude

## Technologies Used

- React and Vite
- JavaScript
- React Router DOM
- Axios
- Lucide React
- Node.js and Express
- MongoDB Atlas and Mongoose
- Vercel for the frontend
- Render for the backend

## Project Structure

```text
CleanSL/
├── frontend/       React + Vite application
├── backend/        Express + MongoDB API
├── docs/           Project documentation and AI prompt log
├── .gitignore
└── README.md
```

## Installation

### Prerequisites

- Node.js 18 or newer
- npm
- A MongoDB Atlas database for backend development

### Backend

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and set the values:

```env
MONGODB_URI=your-mongodb-atlas-connection-string
CLIENT_URL=http://localhost:5173
PORT=5000
JWT_SECRET=replace-with-a-long-random-secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace-with-a-strong-local-password
```

Start the backend:

```bash
npm run dev
```

The API will run at `http://localhost:5000`.

To prepare the first local admin account, set `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in `backend/.env`, then run:

```bash
npm run seed:admin
```

Open `/admin/login` in the frontend to sign in. Never commit the admin password or JWT secret.

### Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Copy `.env.example` to `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The Vite development URL will normally be `http://localhost:5173`.

### MongoDB Setup

1. Create a MongoDB Atlas cluster.
2. Create a database user.
3. Allow the development machine IP in Atlas Network Access.
4. Put the connection string in `backend/.env`.
5. Never commit `.env` or database credentials.

## API Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Confirm that the API is running |
| `POST` | `/api/reports` | Validate and create a waste report |
| `GET` | `/api/reports` | List, search, filter, and sort reports |
| `GET` | `/api/reports/stats/summary` | Return homepage summary statistics |
| `GET` | `/api/reports/:id` | Return one report by ID |

## Priority Calculation

The final priority is calculated on the backend and cannot be supplied by the frontend.

```text
Urgency: Low 1, Medium 2, High 3
Size: Small 1, Medium 2, Large 3
Hazardous Waste: 3
Illegal Dumping, Construction Waste, Overflowing Garbage: 2
Plastic Waste, Organic Waste, Other: 1
Sensitive location: 2 when true, otherwise 0
```

Priority levels are `Low` for scores `0-4`, `Medium` for `5-7`, and `High` for `8` or above.

## Optional Location Capture

Reporters may choose **Use My Location** to share browser-provided latitude and longitude coordinates. Location is optional, requires browser permission, and is not needed to submit a report. The backend validates latitude from `-90` to `90` and longitude from `-180` to `180` before storing it.

## Team Members and Contributions

These details must be completed truthfully by the students.

### Member 1

- Name:
- Student ID:
- Contribution: Home, About, navigation, footer, statistics UI, and responsive design.

### Member 2

- Name:
- Student ID:
- Contribution: Report form, frontend validation, submission states, and API submission.

### Member 3

- Name:
- Student ID:
- Contribution: Express API, MongoDB model, validation, priority calculation, statistics, and seed data.

### Member 4

- Name:
- Student ID:
- Contribution: Community reports, search, filters, sorting, details modal, testing, and deployment support.

## Quality Verification

Before submission, the team should verify the following against the local or deployed URLs:

- Home, Report Issue, Community Reports, and About routes open correctly.
- Empty report submission shows friendly inline validation.
- A valid report is stored in MongoDB Atlas.
- The backend calculates the expected priority score and level.
- Search, district/category/priority/status filters, and all sorting modes work.
- Report details open and close correctly.
- Statistics reflect the stored report data.
- The mobile navigation works at approximately 375px wide.
- No horizontal scrolling appears on mobile.
- Refreshing a React route works on the deployed frontend.
- `.env` files and credentials are absent from the GitHub repository.

## Git Workflow

Use the following branch flow:

```text
feature/<area> -> develop -> main
```

Suggested branches:

- `feature/home-ui`
- `feature/report-submission`
- `feature/report-api`
- `feature/community-reports`

Make small, meaningful commits. Do not commit `.env`, credentials, or `node_modules`.

## Deployment

### Frontend - Vercel

Set this environment variable in Vercel:

```env
VITE_API_URL=https://your-render-backend-url/api
```

### Backend - Render

Set these environment variables in Render:

```env
MONGODB_URI=your-mongodb-atlas-connection-string
CLIENT_URL=https://your-vercel-frontend-url
PORT=5000
JWT_SECRET=your-long-random-secret
ADMIN_EMAIL=your-admin-email
ADMIN_PASSWORD=your-admin-password
```

Frontend: `[ADD DEPLOYED VERCEL URL]`

Backend: `[ADD DEPLOYED RENDER URL]`

Demonstration video: `[ADD VIDEO LINK]`

For Render, use the backend root directory `backend`, build command `npm install`, and start command `npm start`. For Vercel, set the frontend root directory to `frontend` and use the Vite framework preset.

The repository also includes [render.yaml](render.yaml) and [frontend/vercel.json](frontend/vercel.json). The Render file configures the backend health check and keeps all secrets as dashboard-managed environment variables. The Vercel rewrite ensures refreshing `/report`, `/reports`, `/about`, or `/admin/login` loads the React application instead of returning a 404.

## AI Usage Declaration

Replace this template with a truthful statement before submission:

> ChatGPT - assisted with [actual task]. The team reviewed, tested, and modified the generated output before including it in the final application.

The full prompt log is maintained in [docs/AI_PROMPT_LOG.md](docs/AI_PROMPT_LOG.md).

## Hackathon Demonstration Flow

1. Explain the Sri Lankan community waste problem.
2. Submit a report and demonstrate validation.
3. Show the backend-generated priority on the reports page.
4. Search, filter, sort, and open report details.
5. Show live statistics and responsive navigation.
6. Explain the community value and prototype disclaimer.
