-- TenantScore MVP Database Schema
-- Create tables for tenant rent-worthiness registry with National ID as primary identifier

-- Users table (both tenants and landlords)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- National ID/Passport as primary unique identifier
    national_id VARCHAR(20) UNIQUE NOT NULL, -- National ID or Passport Number (encrypted)
    tenant_score_id VARCHAR(64) UNIQUE NOT NULL, -- Hashed/pseudonymized ID for external use
    full_name VARCHAR(100) NOT NULL,
    user_type VARCHAR(10) CHECK (user_type IN ('tenant', 'landlord', 'admin')) NOT NULL,
    email VARCHAR(100),
    -- ID document storage and verification
    id_document_url TEXT, -- Encrypted URL to uploaded ID document
    id_document_type VARCHAR(10) CHECK (id_document_type IN ('national_id', 'passport')) NOT NULL,
    selfie_url TEXT, -- Optional selfie for KYC verification
    kyc_status VARCHAR(20) DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_verified BOOLEAN DEFAULT FALSE
);

-- Phone numbers table (multiple per user)
CREATE TABLE IF NOT EXISTS user_phone_numbers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    phone_number VARCHAR(15) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_code VARCHAR(6),
    verification_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(phone_number)
);

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    landlord_id UUID REFERENCES users(id) ON DELETE CASCADE,
    property_name VARCHAR(200) NOT NULL,
    location VARCHAR(200) NOT NULL,
    monthly_rent DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tenancy agreements
CREATE TABLE IF NOT EXISTS tenancies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE,
    monthly_rent DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'ended', 'disputed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rent payments
CREATE TABLE IF NOT EXISTS rent_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenancy_id UUID REFERENCES tenancies(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    due_date DATE NOT NULL,
    mpesa_transaction_id VARCHAR(50),
    payment_method VARCHAR(20) DEFAULT 'mpesa',
    status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'disputed')),
    days_late INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tenant scores
CREATE TABLE IF NOT EXISTS tenant_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES users(id) ON DELETE CASCADE,
    score INTEGER CHECK (score >= 0 AND score <= 1000) DEFAULT 500,
    total_payments INTEGER DEFAULT 0,
    on_time_payments INTEGER DEFAULT 0,
    late_payments INTEGER DEFAULT 0,
    total_rent_paid DECIMAL(12,2) DEFAULT 0,
    average_days_late DECIMAL(5,2) DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id)
);

-- Admin logs for dispute resolution
CREATE TABLE IF NOT EXISTS admin_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES users(id),
    action_type VARCHAR(50) NOT NULL,
    target_user_id UUID REFERENCES users(id),
    target_payment_id UUID REFERENCES rent_payments(id),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_national_id ON users(national_id);
CREATE INDEX IF NOT EXISTS idx_users_tenant_score_id ON users(tenant_score_id);
CREATE INDEX IF NOT EXISTS idx_users_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_phone_numbers_phone ON user_phone_numbers(phone_number);
CREATE INDEX IF NOT EXISTS idx_phone_numbers_user ON user_phone_numbers(user_id);
CREATE INDEX IF NOT EXISTS idx_tenancies_tenant ON tenancies(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenancies_property ON tenancies(property_id);
CREATE INDEX IF NOT EXISTS idx_payments_tenancy ON rent_payments(tenancy_id);
CREATE INDEX IF NOT EXISTS idx_payments_date ON rent_payments(payment_date);
CREATE INDEX IF NOT EXISTS idx_scores_tenant ON tenant_scores(tenant_id);
