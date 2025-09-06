# TenantScore

TenantScore is a comprehensive property management platform that digitizes and automates rental property operations for landlords and property managers.

## Core Features

- **Tenant Management**: Digital applications, background screening, and tenant portals
- **Lease Management**: E-signature workflows, automated renewals, and digital contracts
- **Financial Tracking**: Rent collection, expense management, and P&L reporting
- **Maintenance**: Request tracking, contractor management, and property inspections
- **Analytics**: Market insights, occupancy forecasting, and performance metrics
- **Communication**: Automated SMS notifications and tenant messaging

## Key Benefits

- Streamlines entire rental lifecycle from application to move-out
- Mobile-first design for on-the-go property management
- Reduces paperwork and manual processes
- Provides data-driven insights for better investment decisions
- Integrates M-Pesa payments for Kenyan market

## Technology Stack

- **Frontend**: Next.js 13+ with TypeScript
- **UI**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context
- **Authentication**: Custom auth system
- **Database**: In-memory demo data (production-ready for database integration)

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                    # Next.js app router
├── components/            # Reusable UI components
│   ├── analytics/        # Property analytics dashboard
│   ├── documents/        # Document management
│   ├── financial/        # Financial reporting
│   ├── inspections/      # Property inspection system
│   ├── landlord/         # Main landlord dashboard
│   ├── lease/            # Lease management
│   ├── maintenance/      # Maintenance tracking
│   ├── screening/        # Tenant screening
│   └── tenant/           # Tenant portal
├── lib/                   # Utilities and services
│   └── services/         # Business logic and data services
└── contexts/             # React context providers
```

## Features Overview

The app transforms traditional property management from paper-based, reactive processes into a digital, proactive system that saves time, reduces costs, and improves tenant satisfaction.

### Landlord Dashboard
- Property overview and key metrics
- Quick access to all management tools
- Mobile-optimized interface

### Tenant Portal
- Rent payment history
- Maintenance request submission
- Document access
- Communication with property management

### Advanced Analytics
- Occupancy trend forecasting
- Market rate analysis
- Maintenance cost patterns
- Financial performance metrics

## License

This project is proprietary software.