# Database Setup Instructions

## Prerequisites

- PostgreSQL 12+ installed
- Database management tool (pgAdmin, DBeaver, or command line)

## Setup Steps

### 1. Create Database

```sql
CREATE DATABASE tenantscore;
```

### 2. Run Schema Script

Execute the `schema.sql` file in your SQL editor:
- This creates all tables, indexes, and triggers
- Sets up the complete database structure

### 3. Run Sample Data Script (Optional)

Execute the `seed_data.sql` file to populate with sample data:
- Creates sample users, properties, tenants, leases, etc.
- Useful for development and testing

### 4. Environment Variables

Create a `.env.local` file in your project root:

```bash
DATABASE_URL=postgresql://username:password@localhost:5432/tenantscore
```

Replace `username`, `password`, and connection details with your PostgreSQL credentials.

## Database Schema Overview

### Core Tables

- **users** - Authentication and user management
- **properties** - Property information
- **units** - Individual rental units
- **tenants** - Tenant information linked to users
- **lease_agreements** - Digital lease contracts
- **tenant_applications** - Application and screening data
- **maintenance_requests** - Maintenance and repair tracking
- **property_inspections** - Property inspection records
- **financial_transactions** - Income and expense tracking
- **contractors** - Service provider directory
- **documents** - File storage references
- **communication_log** - SMS and notification history

### Key Features

- **UUID Primary Keys** - For security and scalability
- **JSONB Fields** - For flexible data storage (terms, documents, etc.)
- **Automatic Timestamps** - Created/updated timestamps with triggers
- **Foreign Key Constraints** - Data integrity and relationships
- **Indexes** - Optimized for common queries

## Connection Setup

The app uses the configuration in `lib/db/config.ts`:

```typescript
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})
```

## Sample Login Credentials

After running the seed data:

- **Admin**: admin@tenantscore.com
- **Landlord**: landlord@sunset.co.ke  
- **Tenant**: john.doe@email.com

*Note: All passwords are hashed examples - implement proper authentication*

## Production Considerations

1. **Security**: Use environment variables for all credentials
2. **Backup**: Set up automated database backups
3. **SSL**: Enable SSL connections in production
4. **Connection Pooling**: Configure appropriate pool sizes
5. **Monitoring**: Set up query performance monitoring

## Migration Strategy

For production deployments:
1. Run schema migrations incrementally
2. Use transaction blocks for data migrations
3. Test migrations on staging environment first
4. Plan for zero-downtime deployments