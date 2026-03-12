-- Создаем пользователя если не существует
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles WHERE rolname = 'math_user'
   ) THEN
      CREATE USER math_user WITH PASSWORD 'math_password_change_me';
   END IF;
END
$do$;

-- Создаем базу данных если не существует
SELECT 'CREATE DATABASE math_graphics'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'math_graphics')\gexec

-- Даем права
GRANT ALL PRIVILEGES ON DATABASE math_graphics TO math_user;