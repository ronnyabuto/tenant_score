-- Seed data for TenantScore MVP testing

-- Insert sample landlords
INSERT INTO users (phone_number, full_name, user_type, id_number, email) VALUES
('254712345678', 'John Mwangi', 'landlord', '12345678', 'john.mwangi@email.com'),
('254723456789', 'Mary Wanjiku', 'landlord', '23456789', 'mary.wanjiku@email.com');

-- Insert sample tenants
INSERT INTO users (phone_number, full_name, user_type, id_number, email) VALUES
('254734567890', 'Peter Kiprotich', 'tenant', '34567890', 'peter.k@email.com'),
('254745678901', 'Grace Achieng', 'tenant', '45678901', 'grace.a@email.com'),
('254756789012', 'David Mutua', 'tenant', '56789012', 'david.m@email.com');

-- Insert sample properties
INSERT INTO properties (landlord_id, property_name, location, monthly_rent) VALUES
((SELECT id FROM users WHERE phone_number = '254712345678'), 'Sunrise Apartments Unit 2B', 'Westlands, Nairobi', 45000.00),
((SELECT id FROM users WHERE phone_number = '254723456789'), 'Green Valley House', 'Karen, Nairobi', 65000.00);

-- Insert sample tenancies
INSERT INTO tenancies (tenant_id, property_id, start_date, monthly_rent) VALUES
((SELECT id FROM users WHERE phone_number = '254734567890'), 
 (SELECT id FROM properties WHERE property_name = 'Sunrise Apartments Unit 2B'), 
 '2024-01-01', 45000.00),
((SELECT id FROM users WHERE phone_number = '254745678901'), 
 (SELECT id FROM properties WHERE property_name = 'Green Valley House'), 
 '2024-02-01', 65000.00);

-- Initialize tenant scores
INSERT INTO tenant_scores (tenant_id) VALUES
((SELECT id FROM users WHERE phone_number = '254734567890')),
((SELECT id FROM users WHERE phone_number = '254745678901')),
((SELECT id FROM users WHERE phone_number = '254756789012'));
