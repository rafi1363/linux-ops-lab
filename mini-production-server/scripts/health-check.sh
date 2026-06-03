#!/bin/bash

BASE_URL="http://localhost:8080"

echo "Checking NGINX reverse proxy..."
curl -i "$BASE_URL"

echo
echo "Checking backend health endpoint..."
curl -s "$BASE_URL/api/health"
echo

echo
echo "Checking PostgreSQL connection through backend..."
curl -s "$BASE_URL/api/db-test"
echo

echo
echo "Checking Redis connection through backend..."
curl -s "$BASE_URL/api/redis-test"
echo
