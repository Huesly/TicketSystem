-- =============================================================================
-- DATOS SEMILLA INICIALES - CONFYTICKETS
-- =============================================================================

-- 1. Negocio Principal
INSERT INTO businesses (id, name, legal_name, status, default_currency, timezone)
VALUES (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Café Confy',
    'Confy Tickets S.A.S.',
    'active',
    'COP',
    'America/Bogota'
) ON CONFLICT DO NOTHING;

-- 2. Sedes Físicas
INSERT INTO stores (id, business_id, code, name, address, city, department, country, latitude, longitude, geofence_radius_meters, phone, status)
VALUES 
(
    '87c69994-6e69-425b-8cb0-b08be5f97371',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'SEDE-01',
    'Sede Cabecera',
    'Carrera 35 # 48-12',
    'Bucaramanga',
    'Santander',
    'CO',
    7.1193,
    -73.1098,
    150,
    '+57 310 111 2233',
    'active'
),
(
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'SEDE-02',
    'Sede Centro',
    'Calle 36 # 15-20',
    'Bucaramanga',
    'Santander',
    'CO',
    7.1254,
    -73.1198,
    150,
    '+57 310 444 5566',
    'active'
),
(
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'SEDE-03',
    'Sede Cañaveral',
    'Centro Comercial Cañaveral Local 104',
    'Floridablanca',
    'Santander',
    'CO',
    7.0654,
    -73.1042,
    150,
    '+57 310 777 8899',
    'active'
) ON CONFLICT DO NOTHING;

-- 3. Programa de Fidelización (8 Sellos)
INSERT INTO loyalty_programs (id, business_id, name, status)
VALUES (
    '11111111-2222-3333-4444-555555555555',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Club Fidelidad Café Confy (8 Sellos)',
    'active'
) ON CONFLICT DO NOTHING;

-- 4. Versión 1 de Reglas Comerciales
INSERT INTO loyalty_program_versions (
    id, program_id, version_number, stamps_required, minimum_purchase, 
    amount_per_stamp, max_stamps_per_purchase, stamp_expiry_days, reward_expiry_days, effective_from
)
VALUES (
    '22222222-3333-4444-5555-666666666666',
    '11111111-2222-3333-4444-555555555555',
    1,
    8,
    10000,
    10000,
    3,
    180,
    30,
    NOW() - INTERVAL '30 days'
) ON CONFLICT DO NOTHING;

-- Asociar sedes al programa
INSERT INTO program_stores (program_id, store_id, active)
VALUES 
('11111111-2222-3333-4444-555555555555', '87c69994-6e69-425b-8cb0-b08be5f97371', TRUE),
('11111111-2222-3333-4444-555555555555', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', TRUE),
('11111111-2222-3333-4444-555555555555', 'cccccccc-cccc-cccc-cccc-cccccccccccc', TRUE)
ON CONFLICT DO NOTHING;

-- 5. Definición de Recompensa
INSERT INTO reward_definitions (id, business_id, name, description, reward_type, reward_value, status, starts_at)
VALUES (
    '33333333-4444-5555-6666-777777777777',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Café Americano 12oz de Cortesía',
    'Bebida caliente de cortesía al completar tu tarjeta de 8 sellos.',
    'product',
    'AMERICANO_12OZ',
    'active',
    NOW() - INTERVAL '30 days'
) ON CONFLICT DO NOTHING;

-- 6. Perfil de Cliente Demo (Camila Rodríguez)
INSERT INTO profiles (id, full_name, email, phone, status)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Camila Rodríguez',
    'camila.rodriguez@email.com',
    '+57 300 123 4567',
    'active'
) ON CONFLICT DO NOTHING;

-- 7. Perfil de Cajero Demo (Juan Pérez)
INSERT INTO profiles (id, full_name, email, phone, status)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'Juan Pérez',
    'cajero.cabecera@confy.com.co',
    '+57 312 987 6543',
    'active'
) ON CONFLICT DO NOTHING;

-- Membresía de Cajero
INSERT INTO business_memberships (id, business_id, user_id, role, status)
VALUES (
    '99999999-8888-7777-6666-555555555555',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    'CASHIER',
    'active'
) ON CONFLICT DO NOTHING;

-- Asignación del cajero a las sedes
INSERT INTO membership_store_assignments (membership_id, store_id)
VALUES 
('99999999-8888-7777-6666-555555555555', '87c69994-6e69-425b-8cb0-b08be5f97371'),
('99999999-8888-7777-6666-555555555555', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')
ON CONFLICT DO NOTHING;

-- 8. Tarjeta Activa de Camila (Ciclo 2 con 5 sellos acumulados)
INSERT INTO loyalty_cards (id, customer_id, program_id, program_version_id, cycle_number, stamps_required_snapshot, status, opened_at)
VALUES (
    '44444444-5555-6666-7777-888888888888',
    '00000000-0000-0000-0000-000000000001',
    '11111111-2222-3333-4444-555555555555',
    '22222222-3333-4444-5555-666666666666',
    2,
    8,
    'accumulating',
    NOW() - INTERVAL '5 days'
) ON CONFLICT DO NOTHING;

-- Movimientos de sellos de Camila (total 5 sellos)
INSERT INTO stamp_movements (card_id, quantity, movement_type, source_store_id, created_by, created_at)
VALUES 
('44444444-5555-6666-7777-888888888888', 3, 'EARN', '87c69994-6e69-425b-8cb0-b08be5f97371', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '3 days'),
('44444444-5555-6666-7777-888888888888', 2, 'EARN', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

-- 9. Los 5 Productos Destacados en Vitrina
INSERT INTO products (business_id, name, description, price, currency, featured_order, available)
VALUES 
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Cappuccino Vainilla Francesa', 'Espresso doble con leche texturizada y jarabe artesanal.', 12500, 'COP', 1, TRUE),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Cold Brew Caramelo Salado', 'Extracción en frío durante 18 horas con notas dulces.', 14000, 'COP', 2, TRUE),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Mocha Chocolate Belga', 'Café de especialidad con cacao al 70% y crema batida.', 13500, 'COP', 3, TRUE),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Croissant de Almendras', 'Hojaldre francés relleno de crema frangipane tostada.', 9500, 'COP', 4, TRUE),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Cheesecake de Frutos Rojos', 'Base crocante con coulis de mora silvestre y arándanos.', 11000, 'COP', 5, TRUE)
ON CONFLICT DO NOTHING;
