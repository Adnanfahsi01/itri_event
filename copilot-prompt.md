# AI ITRI NTIC EVENT 2026 – Full Stack Web Application Prompt

## IMPORTANT NOTE
The project folders are ALREADY CREATED.
DO NOT create new folders.
ONLY create and modify files inside the existing folders.

This project must be SIMPLE, CLEAN, and BEGINNER-FRIENDLY.

---

## GENERAL DESCRIPTION

Create a full-stack web application for an event called  
**“AI ITRI NTIC EVENT 2026”** using:

- Laravel (Backend – REST API)
- React (Frontend)
- MySQL (Database)
- Tailwind CSS (Design)

The application must have **TWO SEPARATE INTERFACES**:
1. User (Attendee)
2. Administrator (Admin Dashboard)

---

## 1. USER (ATTENDEE) INTERFACE

### Public Pages

#### Home Page
- Event title, description, objectives, slogan
- Location: Tanger, Morocco
- Event duration: 3 days

#### Speakers Page
- Display speakers dynamically from the database
- Show:
  - Name
  - Job title
  - Bio
  - Photo

#### Program Page
- Display program dynamically from the database
- Program grouped by:
  - Day 1
  - Day 2
  - Day 3
- Each session contains:
  - Title
  - Time
  - Speaker

---

### Reservation Page

#### Seat Selection
- Interactive seat selection system
- User selects a **specific seat for a specific day**
- Seat states:
  - Free
  - Selected
  - Reserved
  - VIP

#### Reservation Form Fields
- First Name
- Last Name
- Email
- Phone Number
- Role (Student or Employee)
- If role = Student → show extra field:
  - Institution Name
- Select Day:
  - Day 1
  - Day 2
  - Day 3
  - All 3 Days

#### After Reservation
- Save reservation in database
- Generate a **UNIQUE ticket code**
- Generate a **QR Code linked to the reservation**

---

### Ticket Download (PDF)

- User can download a **PDF ticket**
- The PDF ticket must contain:
  - Event name
  - User full name
  - Selected day(s)
  - Seat number
  - QR Code
- QR Code data must be stored in the database

---

## 2. ADMINISTRATOR INTERFACE

### Admin Authentication
- Dedicated Admin Login Page
- Login with Email + Password
- Admin routes protected by middleware
- Only authenticated admins can access the dashboard

---

### Admin Dashboard

#### Statistics
- Total reservations
- Reservations per day
- Students vs Employees
- Seat occupancy rate

#### Charts
- Bar chart
- Pie chart
- Line chart

---

### Reservation Management
- Table with filters:
  - Day
  - Role
  - Name
  - Email
- View reservation details

---

### Speaker Management (CRUD)
Admin can:
- Add speaker
- Edit speaker
- Delete speaker

Speaker fields:
- Name
- Job title
- Bio
- Photo upload

---

### Program Management (CRUD)
Admin can:
- Add sessions
- Edit sessions
- Delete sessions

Session fields:
- Title
- Day (Day 1, Day 2, Day 3)
- Time
- Speaker

---

### QR Code Validation (Admin)

- Admin has a **QR Scanner page**
- Admin scans QR code from ticket
- System checks:
  - If reservation exists
  - If QR code is valid
  - If ticket is already used
- Show result:
  - Valid ticket
  - Invalid ticket
  - Already used ticket
- After validation:
  - Mark ticket as **USED**

---

### Data Export
- Export reservation data to **Google Sheets**

---

## 3. DESIGN RULES (VERY IMPORTANT)

### Font
- Inter font family
  - Bold / SemiBold → titles
  - Regular → normal text

### Color Palette  
Use ONLY these colors (maximum two at a time):
- #006AD7
- #9AD9EA
- #21277B
- #FFFFFF
- #5F83B1

### Design Style
- Modern
- Clean
- Professional
- Fully responsive
- Smooth animations and hover effects
- Beautiful and attractive UI

---

## 4. TECHNICAL RULES

### Backend (Laravel)
- REST API
- Simple controllers
- Beginner-friendly validation
- Admin authentication (login + middleware)
- QR code generation
- PDF ticket generation
- Ticket status: used / unused

### Frontend (React)
- Functional components
- Axios for API requests
- Protected admin routes
- Camera-based QR scanner for admin

### Database (MySQL)
Tables:
- Admins
- Reservations
- Seats
- Speakers
- Programs (sessions)
- Tickets (qr_code, status)

---

## CODE QUALITY REQUIREMENTS
- Easy to read
- Well structured
- Well commented
- Suitable for a beginner student
