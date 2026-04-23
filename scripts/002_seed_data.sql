-- Seed data for testing
-- Note: Users should be created through Supabase Auth, then profiles are auto-created

-- Insert sample incidents (these will need valid reporter_id after users are created)
-- Run this after creating test users in Supabase Auth

-- Sample incidents data (you'll need to replace the UUIDs with actual user IDs)
-- This is a template - actual seeding happens through the app or Supabase dashboard

/*
To create test users, use the Supabase Auth dashboard or run:

INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
VALUES 
  (gen_random_uuid(), 'admin@company.com', crypt('admin123', gen_salt('bf')), NOW(), '{"name": "Admin User", "role": "ADMIN"}'::jsonb),
  (gen_random_uuid(), 'analyst@company.com', crypt('analyst123', gen_salt('bf')), NOW(), '{"name": "Security Analyst", "role": "ANALYST"}'::jsonb),
  (gen_random_uuid(), 'user@company.com', crypt('user123', gen_salt('bf')), NOW(), '{"name": "Regular User", "role": "EMPLOYEE"}'::jsonb);

After users are created, you can insert sample incidents:

INSERT INTO public.incidents (title, description, type, severity, status, source, affected_systems, reporter_id)
SELECT 
  'DDoS Attack on Web Server',
  'Multiple distributed denial of service attacks detected on main web server cluster. Traffic spike of 500% observed.',
  'DDOS',
  'CRITICAL',
  'IN_PROGRESS',
  'IDS Alert',
  'web-server-01, web-server-02, load-balancer',
  id
FROM public.profiles WHERE role = 'ANALYST' LIMIT 1;

INSERT INTO public.incidents (title, description, type, severity, status, source, affected_systems, reporter_id)
SELECT 
  'Phishing Email Campaign',
  'Several employees reported receiving phishing emails impersonating IT department.',
  'PHISHING',
  'HIGH',
  'NEW',
  'User Report',
  'Email System',
  id
FROM public.profiles WHERE role = 'EMPLOYEE' LIMIT 1;

INSERT INTO public.incidents (title, description, type, severity, status, source, affected_systems, reporter_id)
SELECT 
  'Malware Detection',
  'Antivirus detected potential malware on workstation WS-142.',
  'MALWARE',
  'MEDIUM',
  'RESOLVED',
  'Antivirus Alert',
  'WS-142',
  id
FROM public.profiles WHERE role = 'ANALYST' LIMIT 1;

INSERT INTO public.incidents (title, description, type, severity, status, source, affected_systems, reporter_id)
SELECT 
  'Unauthorized Access Attempt',
  'Multiple failed login attempts detected from external IP on admin portal.',
  'UNAUTHORIZED_ACCESS',
  'HIGH',
  'NEW',
  'SIEM',
  'Admin Portal',
  id
FROM public.profiles WHERE role = 'ADMIN' LIMIT 1;
*/

-- This query shows how to verify the setup
SELECT 
  'Tables created' as status,
  (SELECT COUNT(*) FROM public.profiles) as profiles_count,
  (SELECT COUNT(*) FROM public.incidents) as incidents_count;
