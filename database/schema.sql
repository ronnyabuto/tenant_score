-- TenantScore Database Schema
-- PostgreSQL Script

-- Create database (run this separately if needed)
-- CREATE DATABASE tenantscore;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table for authentication
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'landlord', 'tenant')),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Properties table
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    description TEXT,
    total_units INTEGER NOT NULL,
    landlord_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Units table
CREATE TABLE units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    unit_number VARCHAR(10) NOT NULL,
    floor INTEGER,
    bedrooms INTEGER DEFAULT 0,
    bathrooms INTEGER DEFAULT 0,
    square_feet INTEGER,
    rent_amount DECIMAL(10, 2) NOT NULL,
    deposit_amount DECIMAL(10, 2) NOT NULL,
    is_available BOOLEAN DEFAULT true,
    available_from DATE,
    description TEXT,
    amenities TEXT[], -- PostgreSQL array
    photos TEXT[], -- Array of photo URLs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(property_id, unit_number)
);

-- Tenants table
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    unit_id UUID REFERENCES units(id) ON DELETE SET NULL,
    national_id VARCHAR(20),
    date_of_birth DATE,
    nationality VARCHAR(100),
    marital_status VARCHAR(20),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relationship VARCHAR(100),
    move_in_date DATE,
    move_out_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tenant Applications table
CREATE TABLE tenant_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'lease_signed')),
    
    -- Personal Information
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    date_of_birth DATE NOT NULL,
    id_number VARCHAR(20) NOT NULL,
    id_type VARCHAR(20) NOT NULL,
    marital_status VARCHAR(20),
    nationality VARCHAR(100),
    
    -- Emergency Contact
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relationship VARCHAR(100),
    
    -- Employment
    employment_status VARCHAR(20),
    employer VARCHAR(255),
    job_title VARCHAR(255),
    monthly_income DECIMAL(10, 2) NOT NULL,
    employment_length VARCHAR(100),
    
    -- Financial Info
    bank_name VARCHAR(255),
    account_type VARCHAR(20),
    credit_score INTEGER,
    monthly_expenses DECIMAL(10, 2),
    other_income DECIMAL(10, 2),
    has_existing_loans BOOLEAN DEFAULT false,
    can_pay_deposit BOOLEAN DEFAULT false,
    preferred_move_in_date DATE,
    
    -- Screening Results
    credit_check_status VARCHAR(20) DEFAULT 'pending',
    credit_check_score INTEGER,
    background_check_status VARCHAR(20) DEFAULT 'pending',
    income_verification_status VARCHAR(20) DEFAULT 'pending',
    reference_check_status VARCHAR(20) DEFAULT 'pending',
    overall_risk VARCHAR(10) DEFAULT 'medium',
    recommended_action VARCHAR(30) DEFAULT 'review',
    screening_notes TEXT,
    
    -- Documents (JSON field for file paths)
    documents JSONB DEFAULT '{}',
    
    submitted_at TIMESTAMP WITH TIME ZONE,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Lease Agreements table
CREATE TABLE lease_agreements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'sent_for_signature', 'partially_signed', 'fully_signed', 'active', 'terminated', 'expired')),
    lease_type VARCHAR(20) NOT NULL CHECK (lease_type IN ('fixed_term', 'month_to_month', 'periodic')),
    
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    rent_amount DECIMAL(10, 2) NOT NULL,
    deposit_amount DECIMAL(10, 2) NOT NULL,
    late_fee_amount DECIMAL(10, 2) DEFAULT 0,
    grace_period_days INTEGER DEFAULT 5,
    
    -- Terms (JSON field)
    terms JSONB DEFAULT '{}',
    
    -- Signatures
    tenant_signed BOOLEAN DEFAULT false,
    tenant_signed_at TIMESTAMP WITH TIME ZONE,
    landlord_signed BOOLEAN DEFAULT false,
    landlord_signed_at TIMESTAMP WITH TIME ZONE,
    
    -- Documents
    lease_document_url TEXT,
    
    -- Auto Renewal Settings
    auto_renewal_enabled BOOLEAN DEFAULT false,
    notice_period_days INTEGER DEFAULT 30,
    
    -- Notifications
    renewal_reminder_sent BOOLEAN DEFAULT false,
    expiration_notice_sent BOOLEAN DEFAULT false,
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Lease Renewals table
CREATE TABLE lease_renewals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    current_lease_id UUID REFERENCES lease_agreements(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'tenant_accepted', 'tenant_declined', 'completed', 'expired')),
    
    proposed_start_date DATE NOT NULL,
    proposed_end_date DATE NOT NULL,
    proposed_rent_amount DECIMAL(10, 2) NOT NULL,
    rent_increase DECIMAL(10, 2) NOT NULL,
    rent_increase_percentage DECIMAL(5, 2) NOT NULL,
    
    proposal_sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    response_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    tenant_response VARCHAR(20),
    tenant_response_at TIMESTAMP WITH TIME ZONE,
    negotiation_notes TEXT,
    
    auto_generated BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Maintenance Requests table
CREATE TABLE maintenance_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN ('plumbing', 'electrical', 'appliances', 'structural', 'cleaning', 'other')),
    priority VARCHAR(10) NOT NULL CHECK (priority IN ('low', 'normal', 'urgent')),
    status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('submitted', 'acknowledged', 'in_progress', 'completed', 'cancelled')),
    
    photos TEXT[], -- Array of photo URLs
    
    assigned_contractor_id UUID,
    estimated_cost DECIMAL(10, 2),
    actual_cost DECIMAL(10, 2),
    admin_notes TEXT,
    tenant_rating INTEGER CHECK (tenant_rating >= 1 AND tenant_rating <= 5),
    
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Contractors table
CREATE TABLE contractors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    specialties TEXT[] NOT NULL,
    hourly_rate DECIMAL(8, 2),
    is_active BOOLEAN DEFAULT true,
    rating DECIMAL(2, 1) DEFAULT 0,
    completed_jobs INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Property Inspections table
CREATE TABLE property_inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
    inspection_type VARCHAR(20) NOT NULL CHECK (inspection_type IN ('move_in', 'move_out', 'routine', 'maintenance', 'emergency')),
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_date TIMESTAMP WITH TIME ZONE,
    inspector_name VARCHAR(255) NOT NULL,
    purpose TEXT,
    
    -- Checklist and results (JSON fields)
    checklist JSONB DEFAULT '[]',
    overall_condition VARCHAR(20),
    move_in_ready BOOLEAN DEFAULT true,
    estimated_repair_cost DECIMAL(10, 2),
    key_issues TEXT[],
    recommendations TEXT[],
    
    -- Signatures
    inspector_signed BOOLEAN DEFAULT false,
    inspector_signed_at TIMESTAMP WITH TIME ZONE,
    tenant_signed BOOLEAN DEFAULT false,
    tenant_signed_at TIMESTAMP WITH TIME ZONE,
    
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_items JSONB DEFAULT '[]',
    
    photos JSONB DEFAULT '{}', -- JSON object with categorized photos
    report_summary TEXT,
    report_url TEXT,
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Financial Transactions table
CREATE TABLE financial_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    date DATE NOT NULL,
    payment_method VARCHAR(30),
    status VARCHAR(20) DEFAULT 'completed',
    
    -- Additional fields
    is_recurring BOOLEAN DEFAULT false,
    tax_deductible BOOLEAN DEFAULT false,
    receipt_url TEXT,
    notes TEXT,
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Security Deposits table
CREATE TABLE security_deposits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    lease_id UUID REFERENCES lease_agreements(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'held' CHECK (status IN ('held', 'partially_returned', 'fully_returned', 'forfeited')),
    
    -- Deductions (JSON array)
    deductions JSONB DEFAULT '[]',
    returned_amount DECIMAL(10, 2) DEFAULT 0,
    return_date DATE,
    return_reason TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Documents table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(30) NOT NULL,
    category VARCHAR(30) NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    
    -- Related entities
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
    lease_id UUID REFERENCES lease_agreements(id) ON DELETE CASCADE,
    
    is_verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES users(id),
    
    signature_required BOOLEAN DEFAULT false,
    signed_by TEXT[], -- Array of user IDs who signed
    
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- SMS/Communication Log table
CREATE TABLE communication_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_phone VARCHAR(20) NOT NULL,
    recipient_name VARCHAR(255),
    message TEXT NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'rent_reminder', 'maintenance', etc.
    status VARCHAR(20) DEFAULT 'sent',
    
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    delivered_at TIMESTAMP WITH TIME ZONE,
    failed_reason TEXT,
    
    -- Related entities
    tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
    maintenance_request_id UUID REFERENCES maintenance_requests(id) ON DELETE SET NULL,
    
    sent_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_units_property_id ON units(property_id);
CREATE INDEX idx_tenants_user_id ON tenants(user_id);
CREATE INDEX idx_tenants_unit_id ON tenants(unit_id);
CREATE INDEX idx_tenant_applications_unit_id ON tenant_applications(unit_id);
CREATE INDEX idx_tenant_applications_status ON tenant_applications(status);
CREATE INDEX idx_lease_agreements_tenant_id ON lease_agreements(tenant_id);
CREATE INDEX idx_lease_agreements_unit_id ON lease_agreements(unit_id);
CREATE INDEX idx_lease_agreements_status ON lease_agreements(status);
CREATE INDEX idx_maintenance_requests_tenant_id ON maintenance_requests(tenant_id);
CREATE INDEX idx_maintenance_requests_unit_id ON maintenance_requests(unit_id);
CREATE INDEX idx_maintenance_requests_status ON maintenance_requests(status);
CREATE INDEX idx_property_inspections_unit_id ON property_inspections(unit_id);
CREATE INDEX idx_financial_transactions_unit_id ON financial_transactions(unit_id);
CREATE INDEX idx_financial_transactions_date ON financial_transactions(date);
CREATE INDEX idx_documents_tenant_id ON documents(tenant_id);
CREATE INDEX idx_communication_log_recipient_phone ON communication_log(recipient_phone);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_units_updated_at BEFORE UPDATE ON units FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tenant_applications_updated_at BEFORE UPDATE ON tenant_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lease_agreements_updated_at BEFORE UPDATE ON lease_agreements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lease_renewals_updated_at BEFORE UPDATE ON lease_renewals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_maintenance_requests_updated_at BEFORE UPDATE ON maintenance_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contractors_updated_at BEFORE UPDATE ON contractors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_property_inspections_updated_at BEFORE UPDATE ON property_inspections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_transactions_updated_at BEFORE UPDATE ON financial_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_security_deposits_updated_at BEFORE UPDATE ON security_deposits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();