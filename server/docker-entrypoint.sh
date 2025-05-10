#!/bin/sh
set -e

echo "Waiting for MySQL to be ready..."
while ! nc -z mysql 3306; do
  sleep 1
done
echo "MySQL is ready!"

echo "Running database migrations..."
npx prisma migrate deploy

echo "Starting application..."
exec "$@"