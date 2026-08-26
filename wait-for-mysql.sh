#!/bin/sh

echo "⏳ Waiting for MySQL..."

while ! nc -z game_store_db 3306; do
  sleep 1
done

echo "✅ MySQL is ready!"