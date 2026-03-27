#!/bin/bash
# API Test Script for Person 1
# Run after: npm run dev

BASE_URL="http://localhost:5000/api"

echo "🧪 Testing Future Proof API..."
echo "================================"

# Test 1: Health Check
echo ""
echo "1️⃣ Testing Health Check..."
curl -s "$BASE_URL/health" | python -m json.tool

# Test 2: Register
echo ""
echo "2️⃣ Testing Registration..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test User"}')
echo $REGISTER_RESPONSE | python -m json.tool

# Test 3: Login
echo ""
echo "3️⃣ Testing Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@parent.com","password":"demo123"}')
echo $LOGIN_RESPONSE | python -m json.tool

TOKEN=$(echo $LOGIN_RESPONSE | python -c "import sys, json; print(json.load(sys.stdin)['token'])")

# Test 4: Get Profile
echo ""
echo "4️⃣ Testing Get Profile..."
curl -s "$BASE_URL/auth/me" \
  -H "Authorization: Bearer $TOKEN" | python -m json.tool

# Test 5: Get Children
echo ""
echo "5️⃣ Testing Get Children..."
curl -s "$BASE_URL/children" \
  -H "Authorization: Bearer $TOKEN" | python -m json.tool

echo ""
echo "================================"
echo "✅ API Tests Complete!"
echo "If you see data above, everything is working!"
