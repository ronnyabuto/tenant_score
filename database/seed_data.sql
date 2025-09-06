-- TenantScore Sample Data
-- Run this after creating the schema

-- Insert sample users
INSERT INTO users (id, email, password_hash, role, name, phone) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'admin@tenantscore.com', '$2b$10$example_hash_admin', 'admin', 'System Administrator', '+254700000000'),
('550e8400-e29b-41d4-a716-446655440001', 'landlord@sunset.co.ke', '$2b$10$example_hash_landlord', 'landlord', 'John Landlord', '+254712345678'),
('550e8400-e29b-41d4-a716-446655440002', 'john.doe@email.com', '$2b$10$example_hash_tenant1', 'tenant', 'John Doe', '+254723456789'),
('550e8400-e29b-41d4-a716-446655440003', 'jane.smith@email.com', '$2b$10$example_hash_tenant2', 'tenant', 'Jane Smith', '+254734567890'),
('550e8400-e29b-41d4-a716-446655440004', 'mike.wilson@email.com', '$2b$10$example_hash_tenant3', 'tenant', 'Mike Wilson', '+254745678901');

-- Insert sample property
INSERT INTO properties (id, name, address, description, total_units, landlord_id) VALUES
('660e8400-e29b-41d4-a716-446655440000', 'Sunset Apartments', '123 Sunset Avenue, Westlands, Nairobi', 'Modern apartment complex with premium amenities', 50, '550e8400-e29b-41d4-a716-446655440001');

-- Insert sample units
INSERT INTO units (id, property_id, unit_number, floor, bedrooms, bathrooms, square_feet, rent_amount, deposit_amount, is_available, available_from, description, amenities, photos) VALUES
('770e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440000', '1A', 1, 2, 1, 850, 50000.00, 50000.00, false, '2024-01-01', 'Spacious 2-bedroom with garden view', ARRAY['Parking', '24/7 Security', 'Water Backup'], ARRAY['/units/1a_main.jpg', '/units/1a_bedroom.jpg']),
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440000', '1B', 1, 1, 1, 650, 42000.00, 42000.00, false, '2024-01-01', 'Cozy 1-bedroom apartment', ARRAY['Parking', '24/7 Security'], ARRAY['/units/1b_main.jpg']),
('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440000', '2A', 2, 2, 2, 900, 55000.00, 55000.00, false, '2024-01-01', '2-bedroom with balcony', ARRAY['Parking', '24/7 Security', 'Balcony'], ARRAY['/units/2a_main.jpg']),
('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440000', '2B', 2, 1, 1, 700, 48000.00, 48000.00, false, '2024-02-01', '1-bedroom with city view', ARRAY['Parking', '24/7 Security'], ARRAY['/units/2b_main.jpg']),
('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440000', '3A', 3, 3, 2, 1200, 75000.00, 75000.00, true, '2024-03-01', 'Penthouse 3-bedroom', ARRAY['Parking', '24/7 Security', 'Balcony', 'Premium View'], ARRAY['/units/3a_main.jpg']),
('770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440000', '3B', 3, 2, 1, 850, 58000.00, 58000.00, true, '2024-03-15', '2-bedroom top floor', ARRAY['Parking', '24/7 Security'], ARRAY['/units/3b_main.jpg']);

-- Insert sample tenants
INSERT INTO tenants (id, user_id, unit_id, national_id, date_of_birth, nationality, marital_status, emergency_contact_name, emergency_contact_phone, emergency_contact_relationship, move_in_date) VALUES
('880e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440000', '32567890', '1990-05-15', 'Kenyan', 'single', 'Mary Doe', '+254712000001', 'Mother', '2024-01-01'),
('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440001', '28934567', '1988-08-22', 'Kenyan', 'married', 'David Smith', '+254713000002', 'Husband', '2024-01-15'),
('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440002', '31245678', '1985-12-10', 'Kenyan', 'single', 'Sarah Wilson', '+254714000003', 'Sister', '2024-02-01');

-- Insert sample lease agreements
INSERT INTO lease_agreements (id, tenant_id, unit_id, status, lease_type, start_date, end_date, rent_amount, deposit_amount, late_fee_amount, grace_period_days, terms, tenant_signed, tenant_signed_at, landlord_signed, landlord_signed_at, lease_document_url, auto_renewal_enabled, created_by) VALUES
('990e8400-e29b-41d4-a716-446655440000', '880e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440000', 'active', 'fixed_term', '2024-01-01', '2024-12-31', 50000.00, 50000.00, 2500.00, 5, '{"petPolicy": "not_allowed", "smokingAllowed": false, "maxOccupants": 2, "utilitiesIncluded": ["water", "garbage"], "maintenanceResponsibility": "landlord", "parkingIncluded": true, "parkingSpaces": 1}', true, '2023-12-20 10:00:00+00', true, '2023-12-21 14:30:00+00', '/leases/LEASE_001.pdf', true, '550e8400-e29b-41d4-a716-446655440001'),
('990e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'active', 'fixed_term', '2024-01-15', '2025-01-14', 42000.00, 42000.00, 2100.00, 5, '{"petPolicy": "allowed", "petDeposit": 10000, "smokingAllowed": false, "maxOccupants": 2, "utilitiesIncluded": ["water"], "maintenanceResponsibility": "landlord", "parkingIncluded": true}', true, '2024-01-10 09:00:00+00', true, '2024-01-10 15:00:00+00', '/leases/LEASE_002.pdf', false, '550e8400-e29b-41d4-a716-446655440001'),
('990e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', 'sent_for_signature', 'fixed_term', '2024-03-01', '2025-02-28', 55000.00, 55000.00, 2750.00, 5, '{"petPolicy": "not_allowed", "smokingAllowed": false, "maxOccupants": 3, "utilitiesIncluded": ["water", "garbage"], "maintenanceResponsibility": "landlord", "parkingIncluded": true}', false, null, true, '2024-02-15 16:00:00+00', '/leases/LEASE_003.pdf', true, '550e8400-e29b-41d4-a716-446655440001');

-- Insert sample contractors
INSERT INTO contractors (id, name, phone, email, specialties, hourly_rate, is_active, rating, completed_jobs) VALUES
('aa0e8400-e29b-41d4-a716-446655440000', 'Mike''s Plumbing Services', '+254701234567', 'mike@plumbing.co.ke', ARRAY['plumbing', 'pipes', 'water_heating'], 1500.00, true, 4.8, 45),
('aa0e8400-e29b-41d4-a716-446655440001', 'PowerFix Electricals', '+254712345670', 'info@powerfix.co.ke', ARRAY['electrical', 'wiring', 'appliances'], 2000.00, true, 4.9, 67),
('aa0e8400-e29b-41d4-a716-446655440002', 'HandyMan Services', '+254734567890', 'contact@handyman.co.ke', ARRAY['general', 'painting', 'cleaning', 'structural'], 1200.00, true, 4.5, 32),
('aa0e8400-e29b-41d4-a716-446655440003', 'CleanPro Services', '+254745678901', 'hello@cleanpro.co.ke', ARRAY['cleaning', 'pest_control'], 800.00, true, 4.7, 28);

-- Insert sample maintenance requests
INSERT INTO maintenance_requests (id, tenant_id, unit_id, title, description, category, priority, status, photos, assigned_contractor_id, estimated_cost, admin_notes, submitted_at, acknowledged_at, started_at) VALUES
('bb0e8400-e29b-41d4-a716-446655440000', '880e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440000', 'Kitchen Sink Leak', 'The kitchen sink has been leaking from the faucet for 2 days. Water drips continuously.', 'plumbing', 'normal', 'in_progress', ARRAY['/maintenance/kitchen-leak-1.jpg', '/maintenance/kitchen-leak-2.jpg'], 'aa0e8400-e29b-41d4-a716-446655440000', 3500.00, 'Contractor scheduled for today morning', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day', NOW() - INTERVAL '4 hours'),
('bb0e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'Bathroom Light Not Working', 'The main bathroom light bulb went out and replacement doesn''t work either.', 'electrical', 'low', 'acknowledged', ARRAY['/maintenance/bathroom-light.jpg'], null, 1500.00, 'Will schedule electrician this week', NOW() - INTERVAL '1 day', NOW() - INTERVAL '12 hours', null),
('bb0e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', 'AC Unit Making Noise', 'Air conditioning unit is making loud rattling noises, especially at night.', 'appliances', 'normal', 'submitted', ARRAY['/maintenance/ac-noise.jpg'], null, null, null, NOW() - INTERVAL '6 hours', null, null);

-- Insert sample property inspections
INSERT INTO property_inspections (id, unit_id, tenant_id, inspection_type, status, scheduled_date, completed_date, inspector_name, purpose, checklist, overall_condition, move_in_ready, estimated_repair_cost, key_issues, recommendations, inspector_signed, inspector_signed_at, tenant_signed, tenant_signed_at, follow_up_required, follow_up_items, photos, report_summary, report_url, created_by) VALUES
('cc0e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440000', '880e8400-e29b-41d4-a716-446655440000', 'move_in', 'completed', '2024-01-01 10:00:00+00', '2024-01-01 11:30:00+00', 'Sarah Wilson', 'Pre-occupancy inspection for new tenant', '[{"category": "Living Room", "items": [{"id": "lr_walls", "description": "Walls and paint condition", "condition": "good", "notes": "Minor scuff marks on south wall", "photos": ["/inspections/1a_living_walls.jpg"], "requiresAttention": false}]}, {"category": "Kitchen", "items": [{"id": "k_appliances", "description": "All appliances functioning", "condition": "good", "notes": "Refrigerator door seal needs attention", "requiresAttention": true}]}]', 'good', true, 2500.00, ARRAY['Refrigerator door seal', 'Minor wall scuffs'], ARRAY['Schedule appliance maintenance', 'Touch up paint before next tenant'], true, '2024-01-01 11:30:00+00', true, '2024-01-01 11:45:00+00', true, '[{"description": "Replace refrigerator door seal", "priority": "medium", "estimatedCost": 1500, "targetDate": "2024-01-15"}, {"description": "Touch up wall paint in living room", "priority": "low", "estimatedCost": 1000, "targetDate": "2024-01-31"}]', '{"general": ["/inspections/1a_overview1.jpg", "/inspections/1a_overview2.jpg"], "issues": ["/inspections/1a_fridge_seal.jpg", "/inspections/1a_wall_scuffs.jpg"]}', 'Unit is in good overall condition and ready for occupancy with minor maintenance items.', '/reports/inspection_1a_20240101.pdf', '550e8400-e29b-41d4-a716-446655440001'),
('cc0e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', null, 'routine', 'scheduled', NOW() + INTERVAL '3 days', null, 'Mike Thompson', '6-month routine inspection', '[]', null, true, null, ARRAY[]::text[], ARRAY[]::text[], false, null, false, null, false, '[]', '{"general": [], "issues": []}', '', null, '550e8400-e29b-41d4-a716-446655440001');

-- Insert sample financial transactions
INSERT INTO financial_transactions (id, unit_id, tenant_id, type, category, description, amount, date, payment_method, status, is_recurring, tax_deductible, created_by) VALUES
('dd0e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440000', '880e8400-e29b-41d4-a716-446655440000', 'income', 'rent', 'January 2024 Rent Payment', 50000.00, '2024-01-01', 'mpesa', 'completed', true, false, '550e8400-e29b-41d4-a716-446655440001'),
('dd0e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440000', '880e8400-e29b-41d4-a716-446655440000', 'income', 'rent', 'February 2024 Rent Payment', 50000.00, '2024-02-01', 'mpesa', 'completed', true, false, '550e8400-e29b-41d4-a716-446655440001'),
('dd0e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'income', 'rent', 'January 2024 Rent Payment', 42000.00, '2024-01-15', 'mpesa', 'completed', true, false, '550e8400-e29b-41d4-a716-446655440001'),
('dd0e8400-e29b-41d4-a716-446655440003', null, null, 'expense', 'maintenance', 'Plumbing repair - Unit 1A', 3500.00, '2024-02-01', 'bank_transfer', 'completed', false, true, '550e8400-e29b-41d4-a716-446655440001'),
('dd0e8400-e29b-41d4-a716-446655440004', null, null, 'expense', 'utilities', 'Water bill - February 2024', 8500.00, '2024-02-05', 'bank_transfer', 'completed', true, true, '550e8400-e29b-41d4-a716-446655440001'),
('dd0e8400-e29b-41d4-a716-446655440005', null, null, 'expense', 'management', 'Property management fee', 15000.00, '2024-02-01', 'bank_transfer', 'completed', true, true, '550e8400-e29b-41d4-a716-446655440001');

-- Insert sample security deposits
INSERT INTO security_deposits (id, tenant_id, lease_id, amount, status, deductions, returned_amount) VALUES
('ee0e8400-e29b-41d4-a716-446655440000', '880e8400-e29b-41d4-a716-446655440000', '990e8400-e29b-41d4-a716-446655440000', 50000.00, 'held', '[]', 0.00),
('ee0e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', 42000.00, 'held', '[]', 0.00),
('ee0e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440002', 55000.00, 'held', '[]', 0.00);

-- Insert sample documents
INSERT INTO documents (id, name, type, category, file_path, tenant_id, unit_id, lease_id, is_verified, signature_required, uploaded_by) VALUES
('ff0e8400-e29b-41d4-a716-446655440000', 'John Doe - National ID', 'id_document', 'tenant_documents', '/documents/john_doe_id.pdf', '880e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440000', null, true, false, '880e8400-e29b-41d4-a716-446655440000'),
('ff0e8400-e29b-41d4-a716-446655440001', 'Lease Agreement - Unit 1A', 'lease_agreement', 'property_documents', '/documents/lease_1a.pdf', '880e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440000', '990e8400-e29b-41d4-a716-446655440000', true, true, '550e8400-e29b-41d4-a716-446655440001'),
('ff0e8400-e29b-41d4-a716-446655440002', 'Jane Smith - Payslips', 'receipt', 'tenant_documents', '/documents/jane_smith_payslips.pdf', '880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', null, true, false, '880e8400-e29b-41d4-a716-446655440001');

-- Insert sample communication log
INSERT INTO communication_log (id, recipient_phone, recipient_name, message, type, status, tenant_id, sent_by) VALUES
('110e8400-e29b-41d4-a716-446655440000', '+254723456789', 'John Doe', 'RENT REMINDER\nUnit: 1A\nDue Date: March 1, 2024\nAmount: KES 50,000\nPay via M-Pesa: Paybill 174379, Account: 1A\n\nSunset Apartments', 'rent_reminder', 'sent', '880e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001'),
('110e8400-e29b-41d4-a716-446655440001', '+254734567890', 'Jane Smith', 'MAINTENANCE UPDATE\nUnit: 1B\nIssue: Bathroom Light Not Working\nStatus: ACKNOWLEDGED\n\nWe have received your maintenance request and will schedule a repair soon.\n\nSunset Apartments', 'maintenance', 'sent', '880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001');

-- Insert sample tenant application
INSERT INTO tenant_applications (id, unit_id, status, first_name, last_name, email, phone, date_of_birth, id_number, id_type, marital_status, nationality, emergency_contact_name, emergency_contact_phone, emergency_contact_relationship, employment_status, employer, job_title, monthly_income, employment_length, bank_name, account_type, credit_score, monthly_expenses, other_income, has_existing_loans, can_pay_deposit, preferred_move_in_date, credit_check_status, credit_check_score, background_check_status, income_verification_status, reference_check_status, overall_risk, recommended_action, screening_notes, documents, submitted_at, reviewed_at, reviewed_by) VALUES
('120e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440004', 'under_review', 'Sarah', 'Johnson', 'sarah.johnson@email.com', '+254722334455', '1990-03-15', '32567890', 'national_id', 'single', 'Kenyan', 'Mary Johnson', '+254733445566', 'Mother', 'employed', 'Tech Solutions Ltd', 'Software Developer', 85000.00, '2 years', 'KCB Bank', 'savings', 720, 35000.00, 10000.00, false, true, '2024-04-01', 'completed', 720, 'completed', 'verified', 'completed', 'low', 'approve', 'Excellent candidate with strong financial background and good references.', '{"idCopy": "/documents/sarah_id.pdf", "payslips": ["/documents/sarah_payslip_1.pdf", "/documents/sarah_payslip_2.pdf"], "bankStatements": ["/documents/sarah_bank_stmt.pdf"], "employmentLetter": "/documents/sarah_employment.pdf", "passportPhoto": "/documents/sarah_photo.jpg"}', NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 day', '550e8400-e29b-41d4-a716-446655440001');

-- Insert sample lease renewal
INSERT INTO lease_renewals (id, current_lease_id, status, proposed_start_date, proposed_end_date, proposed_rent_amount, rent_increase, rent_increase_percentage, proposal_sent_at, response_deadline, auto_generated) VALUES
('130e8400-e29b-41d4-a716-446655440000', '990e8400-e29b-41d4-a716-446655440000', 'pending', '2025-01-01', '2025-12-31', 52500.00, 2500.00, 5.0, '2024-11-01 10:00:00+00', '2024-11-30 23:59:59+00', true);

-- Update unit availability based on tenants
UPDATE units SET is_available = false WHERE id IN (
    SELECT unit_id FROM tenants WHERE unit_id IS NOT NULL
);

COMMIT;