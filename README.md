# AI ITRI NTIC EVENT 2026

A full-stack web application for the AI ITRI NTIC EVENT 2026 in Tanger, Morocco.

## Tech Stack

- **Backend**: Laravel 10 (PHP)
- **Frontend**: React 18 with Vite
- **Database**: MySQL
- **Styling**: Tailwind CSS
- **Authentication**: Laravel Sanctum

## Features

### User (Attendee) Interface
- Home page with event info
- Speakers page (dynamic from database)
- Program/Schedule page (grouped by days)
- Seat reservation system with interactive seat selection
- PDF ticket generation with QR code

### Admin Dashboard
- Admin login with Sanctum authentication
- Statistics dashboard with charts
- Reservation management with filters
- Speaker management (CRUD)
- Program/Session management (CRUD)
- QR Code scanner for ticket validation
- Data export to CSV

## Setup Instructions

### Prerequisites
- PHP 8.1+
- Composer
- Node.js 18+
- MySQL

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install PHP dependencies:
```bash
composer install
```

3. Copy environment file:
```bash
cp .env.example .env
```

4. Configure your `.env` file with database credentials:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=itri_event
DB_USERNAME=root
DB_PASSWORD=your_password
```

5. Generate application key:
```bash
php artisan key:generate
```

6. Run migrations:
```bash
php artisan migrate
```

7. Seed the database:
```bash
php artisan db:seed
```

8. Create storage link:
```bash
php artisan storage:link
```

9. Start the server:
```bash
php artisan serve
```

The backend will run at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

The frontend will run at `http://localhost:3000`

## Default Admin Credentials

- **Email**: admin@itri.ma
- **Password**: password123

## API Endpoints

### Public Routes
- `GET /api/speakers` - Get all speakers
- `GET /api/programs` - Get program grouped by day
- `GET /api/seats?day=day1` - Get seats for a specific day
- `POST /api/reservations` - Create a reservation
- `GET /api/tickets/{code}/download` - Download ticket PDF

### Protected Routes (Admin)
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/statistics` - Dashboard statistics
- `GET /api/reservations` - List all reservations
- `POST /api/reservations/validate-qr` - Validate QR code
- CRUD operations for speakers and programs

## Color Palette

- Primary: #006AD7
- Secondary: #9AD9EA
- Dark: #21277B
- Light: #FFFFFF
- Muted: #5F83B1

## License

MIT License
