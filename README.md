# Invoicely - Professional Invoice Management System

A complete full-stack invoice management application built with Flask (Python) backend and Next.js (TypeScript) frontend.

## Features

- **Complete Invoice Management**: Create, edit, send, and track invoices
- **Customer Management**: Maintain customer database with contact information
- **PDF Generation**: Automatic PDF generation for invoices
- **Email Integration**: Send invoices directly via email
- **Dashboard Analytics**: Overview of revenue, pending invoices, and statistics
- **Responsive Design**: Mobile-friendly interface
- **Professional Templates**: Clean, professional invoice templates

## Tech Stack

### Backend (Flask)
- **Framework**: Flask with SQLAlchemy ORM
- **Database**: MySQL with Flask-Migrate
- **PDF Generation**: FPDF2
- **Email**: SMTP integration
- **API**: RESTful API design
- **Authentication**: JWT ready (to be implemented)

### Frontend (Next.js)
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **State Management**: React hooks with custom API hooks

## Project Structure

```
invoicely/
├── backend/                      # Flask Backend
│   ├── app/
│   │   ├── __init__.py          # App factory
│   │   ├── models/              # Database models
│   │   ├── api/                 # API blueprints
│   │   ├── services/            # Business logic services
│   │   └── utils/               # Utilities and validators
│   ├── config.py                # Configuration
│   ├── requirements.txt         # Python dependencies
│   └── run.py                   # Application entry point
├── frontend/                     # Next.js Frontend
│   ├── src/
│   │   ├── app/                 # App Router pages
│   │   ├── components/          # React components
│   │   ├── lib/                 # API client and utilities
│   │   ├── types/               # TypeScript type definitions
│   │   └── hooks/               # Custom React hooks
│   ├── package.json             # Node.js dependencies
│   └── tailwind.config.js       # TailwindCSS configuration
└── README.md                    # This file
```

## Setup Instructions

### Backend Setup

1. **Create Virtual Environment**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Database Configuration**:
   - Create MySQL database: `invoicely_db`
   - Copy `.env.example` to `.env` and update database credentials
   
4. **Initialize Database**:
   ```bash
   flask db init
   flask db migrate -m "Initial migration"
   flask db upgrade
   ```

5. **Run Backend Server**:
   ```bash
   python run.py
   ```
   Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Variables**:
   Create `.env.local` file:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

3. **Run Frontend Server**:
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

## Environment Variables

### Backend (.env)
```bash
# Database
DATABASE_URL=mysql+pymysql://username:password@localhost/invoicely_db

# Flask
SECRET_KEY=your-secret-key-here
FLASK_ENV=development

# Email Configuration
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-email-password
FROM_EMAIL=your-email@gmail.com
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Invoices
- `GET /api/invoices` - List invoices
- `POST /api/invoices` - Create invoice
- `GET /api/invoices/{id}` - Get invoice details
- `PUT /api/invoices/{id}` - Update invoice
- `DELETE /api/invoices/{id}` - Delete invoice
- `POST /api/invoices/{id}/send` - Send invoice via email
- `GET /api/invoices/{id}/pdf` - Generate PDF

### Customers
- `GET /api/customers` - List customers
- `POST /api/customers` - Create customer
- `GET /api/customers/{id}` - Get customer details
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer

## Database Schema

### Users Table
- id, username, email, name, phone
- password_hash, company_name, company_address
- created_at, updated_at

### Customers Table
- id, name, email, phone, address
- tax_pin, company, user_id
- created_at, updated_at

### Invoices Table
- id, invoice_number, title, description
- issue_date, due_date, status
- subtotal, tax_rate, tax_amount
- discount_rate, discount_amount, total_amount
- notes, terms, user_id, customer_id
- created_at, updated_at

### Invoice Items Table
- id, description, quantity, rate, total
- invoice_id, created_at, updated_at

## Features in Development

- [ ] User Authentication & Authorization
- [ ] Payment Gateway Integration (Stripe/PayPal)
- [ ] Multi-currency Support
- [ ] Recurring Invoices
- [ ] Invoice Templates
- [ ] Advanced Reporting
- [ ] Multi-language Support
- [ ] Mobile App

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please create an issue in the GitHub repository.