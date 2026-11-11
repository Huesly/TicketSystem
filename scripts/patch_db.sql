-- Alter table profiles para contraseña
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS hashed_password VARCHAR(255);

-- Actualizar contraseñas encriptadas
UPDATE profiles 
SET hashed_password = '$2b$12$50wil2tklZRf6kCAXUTbL.40v4WSwTKH/pbzHIZ9d0wh.xgH5fWf.'
WHERE email = 'camila.rodriguez@email.com';

UPDATE profiles 
SET hashed_password = '$2b$12$Z9myUvGFHY9x/bNRebCzX.xHqDruzG38ty5qh/t/FnwkLFrY6B9z6'
WHERE email = 'cajero.cabecera@confy.com.co';

-- Cortesía activa disponible para Camila lista para redimir en el POS
INSERT INTO customer_rewards (id, customer_id, definition_id, card_id, status, issued_at, expires_at)
VALUES (
    'd57b61d8-0e02-482d-9548-9cddba248f26',
    '00000000-0000-0000-0000-000000000001',
    '33333333-4444-5555-6666-777777777777',
    '44444444-5555-6666-7777-888888888888',
    'AVAILABLE',
    NOW() - INTERVAL '2 days',
    NOW() + INTERVAL '28 days'
) ON CONFLICT (id) DO UPDATE SET status = 'AVAILABLE';
