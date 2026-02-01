# AI ITRI NTIC EVENT 2026 - Documentation

## Overview
This is a full-stack web application for managing the AI ITRI NTIC EVENT 2026 conference. The system provides event registration, seat management, QR code ticketing, and comprehensive admin tools for event management.

## Project Structure
```
itri_prj/
├── backend/                 # Laravel PHP Backend
│   ├── app/
│   │   ├── Http/Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── ReservationController.php
│   │   │   ├── SpeakerController.php
│   │   │   └── ProgramController.php
│   │   ├── Models/
│   │   │   ├── Admin.php
│   │   │   ├── Reservation.php
│   │   │   ├── Speaker.php
│   │   │   ├── Program.php
│   │   │   └── Seat.php
│   │   └── Http/Middleware/
│   ├── database/migrations/
│   ├── routes/api.php
│   └── config/
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── admin/     # Admin Dashboard Pages
│   │   │   └── home/      # Public Pages
│   │   ├── components/    # Reusable Components
│   │   └── utils/         # Utility Functions
│   └── public/
└── README.md
```

## Features

### Public Features
- **Event Information**: Display event details, speakers, and program schedule
- **Online Reservation**: Multi-day seat booking system with real-time availability
- **QR Code Tickets**: Automatic QR code generation for reservations
- **Responsive Design**: Mobile-friendly interface

### Admin Features
- **Dashboard**: Overview statistics and analytics
- **Reservation Management**: View, search, and manage all reservations
- **Speaker Management**: Add, edit, and remove speakers
- **Program Management**: Create and manage event schedule
- **QR Code Scanner**: Validate tickets with camera-based scanning
- **Scan Statistics**: Comprehensive analytics dashboard with:
  - Total scans and scan rates
  - Daily scan trends
  - Detailed scan history
  - Comparison charts

## Technology Stack

### Backend (Laravel 10)
- **Framework**: Laravel 10 (PHP 8.1+)
- **Database**: MySQL 8.0
- **Authentication**: Laravel Sanctum (API tokens)
- **API**: RESTful API with JSON responses
- **Rate Limiting**: Custom throttling for QR operations

### Frontend (React 18)
- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Charts**: Recharts for analytics
- **QR Scanning**: html5-qrcode library
- **Animations**: GSAP and custom CSS animations

### Database Schema

#### Admins Table
- id, email, password, name
- Authentication for admin users

#### Reservations Table
- Personal information (name, email, phone)
- Event details (days, seats, institution)
- Ticket information (ticket_code, qr_code)
- Status tracking (is_used, is_scanned, scan_count, scanned_at)

#### Speakers Table
- name, bio, image, position, company

#### Programs Table
- title, description, speaker_id, start_time, end_time, day

#### Seats Table
- seat_number, is_available, day

## API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/me` - Get admin profile

### Public Endpoints
- `GET /api/speakers` - Get all speakers
- `GET /api/programs` - Get program schedule
- `GET /api/seats/available` - Get available seats
- `POST /api/reservations` - Create reservation

### Admin Endpoints (Authenticated)
- `GET /api/reservations` - Get all reservations
- `GET /api/statistics` - Dashboard statistics
- `GET /api/scan-statistics` - Scan analytics
- `POST /api/reservations/validate-qr` - QR code validation
- `GET /api/reservations/export` - Export reservations

### CRUD Operations
- Speakers: GET, POST, PUT, DELETE `/api/speakers`
- Programs: GET, POST, PUT, DELETE `/api/programs`

## Security Features

### Authentication & Authorization
- Laravel Sanctum token-based authentication
- Admin-only access to management features
- Protected API routes with middleware

### Rate Limiting
- Standard API: 60 requests/minute
- QR Scanning: 200 requests/minute
- IP-based and user-based limiting

### Data Validation
- Server-side validation for all inputs
- Email format validation
- Seat availability checking
- Duplicate booking prevention

## QR Code System

### QR Code Generation
- Automatic generation on reservation creation
- Contains encrypted ticket information
- JSON format with ticket_code and email

### QR Code Validation
- Camera-based scanning with html5-qrcode
- Real-time validation against database
- Scan tracking and analytics
- Duplicate scan prevention

### Scan Analytics
- Track scan count per reservation
- Monitor daily scan trends
- Calculate scan rates and attendance
- Detailed audit trail

## Deployment Architecture

### Development Environment
- Backend: `php artisan serve` (localhost:8000)
- Frontend: `npm run dev` with Vite (localhost:5173)
- Database: Local MySQL server

### Production Considerations
- HTTPS required for camera access (QR scanning)
- Environment variables for sensitive data
- Database connection pooling
- CDN for static assets
- Process managers (PM2, Supervisor)

## Configuration Files

### Backend Configuration
- `.env` - Environment variables
- `config/database.php` - Database settings
- `config/sanctum.php` - Authentication settings
- `config/cors.php` - CORS configuration

### Frontend Configuration
- `vite.config.js` - Build configuration
- `tailwind.config.js` - Styling framework
- `package.json` - Dependencies and scripts

## Monitoring & Analytics

### Admin Dashboard Metrics
- Total reservations and attendance
- Daily/weekly trends
- Seat occupancy rates
- Role distribution (students vs employees)

### Scan Statistics
- Real-time scan monitoring
- Historical scan data
- Attendance tracking
- Performance analytics

## Troubleshooting

### Common Issues
1. **QR Scanner not working**: Check camera permissions and HTTPS
2. **Rate limiting errors**: Increase limits or implement retry logic
3. **Authentication failures**: Verify token validity and middleware
4. **Database connection**: Check credentials and server status

### Debug Tools
- Laravel logs: `storage/logs/laravel.log`
- Browser console for frontend errors
- Network tab for API debugging
- Database query logs

## Future Enhancements

### Planned Features
- Email notifications for reservations
- PDF ticket generation
- Multi-language support
- Advanced reporting dashboard
- Mobile app development

### Scalability Considerations
- Database indexing optimization
- Caching layer (Redis)
- Load balancing
- Microservices architecture
- Cloud deployment (AWS/Azure)

## Contributing

### Development Workflow
1. Clone repository
2. Set up environment (see quick_start.md)
3. Create feature branch
4. Make changes and test
5. Submit pull request

### Code Standards
- PHP: PSR-12 coding standard
- JavaScript: ESLint configuration
- CSS: Tailwind utility classes
- Database: Laravel migration files

## License
This project is proprietary software developed for the AI ITRI NTIC EVENT 2026.

## Support
For technical support or questions, contact the development team.