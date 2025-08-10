#!/usr/bin/env bash
set -euo pipefail

BASE="${BASE:-http://localhost:3000}"
ROLE="${ROLE:-CLIENT}" # ou PROVIDER
EMAIL="u$(date +%s)@t.io"
PASS="Passw0rd!"
DOCNUM="CINTEST12345678"

echo "== 0) Prépare 2 admins dev =="
npm run admin:ensure:dev >/dev/null

echo "== 1) Register user ($ROLE) =="
curl -s -X POST "$BASE/api/auth/register" -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASS\",\"firstName\":\"Test\",\"lastName\":\"User\",\"role\":\"$ROLE\"}" >/dev/null

echo "== 2) Login user =="
LOGIN=$(curl -s -X POST "$BASE/api/auth/login" -H "Content-Type: application/json" -d "{\"email\":\"$EMAIL\",\"password\":\"$PASS\"}")
TOKEN=$(echo "$LOGIN" | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{try{let j=JSON.parse(s);console.log(j.data.tokens.access)}catch{}})")
USER_ID=$(echo "$LOGIN" | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{try{let j=JSON.parse(s);console.log(j.data.user.id)}catch{}})")
echo "UserID=$USER_ID"

echo "== 3) Créer session KYC =="
SESS=$(curl -s -X POST "$BASE/api/kyc/session" -H "Authorization: Bearer $TOKEN")
EXTERNAL_ID=$(echo "$SESS" | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{try{let j=JSON.parse(s);console.log(j.data.externalId)}catch{}})")
echo "externalId=$EXTERNAL_ID"

echo "== 4) Simuler webhook verified (avec docNumber) =="
curl -s -X POST "$BASE/api/kyc/webhook" -H "Content-Type: application/json" \
  -d "{\"type\":\"identity.verification_session.verified\",\"data\":{\"object\":{\"id\":\"$EXTERNAL_ID\",\"metadata\":{\"userId\":$USER_ID},\"last_verification_report\":{\"document\":{\"type\":\"id_card\"},\"id\":\"rep_1\"},\"docNumber\":\"$DOCNUM\"}}}" >/dev/null

echo "== 5) Vérifier KycVault (chiffré) =="
npm run -s vault:check -- $USER_ID

echo "== 6) Admin A login =="
ALOG=$(curl -s -X POST "$BASE/api/auth/login" -H "Content-Type: application/json" -d '{"email":"adminA@khadamat.test","password":"ChangeMe_1!"}')
ATOK=$(echo "$ALOG" | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{try{let j=JSON.parse(s);console.log(j.data.tokens.access)}catch{}})")

echo "== 7) Admin B login =="
BLOG=$(curl -s -X POST "$BASE/api/auth/login" -H "Content-Type: application/json" -d '{"email":"adminB@khadamat.test","password":"ChangeMe_1!"}')
BTOK=$(echo "$BLOG" | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{try{let j=JSON.parse(s);console.log(j.data.tokens.access)}catch{}})")

echo "== 8) Admin A demande disclosure =="
DR=$(curl -s -X POST "$BASE/api/admin/disclosures" -H "Authorization: Bearer $ATOK" -H "Content-Type: application/json" \
  -d "{\"targetUserId\":$USER_ID,\"justification\":\"Réquisition de test\"}")
REQ_ID=$(echo "$DR" | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{try{let j=JSON.parse(s);console.log(j.data.id)}catch{}})")
echo "requestId=$REQ_ID"

echo "== 9) Admin B approuve =="
curl -s -X PUT "$BASE/api/admin/disclosures/$REQ_ID/approve" -H "Authorization: Bearer $BTOK" >/dev/null

echo "== 10) Export légal (IP allowlist requis) =="
EXP=$(curl -s -X GET "$BASE/api/admin/export/$USER_ID?requestId=$REQ_ID" -H "Authorization: Bearer $BTOK")
echo "$EXP" | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{try{let j=JSON.parse(s);console.log({last4:j.data?.document?.last4, number: j.data?.document?.number})}catch(e){console.log(s)}})"

echo "== 11) (Option) Rotation clé – prépare KYC_ENC_KEYRING_JSON avec k2 et KYC_ENC_ACTIVE_KEY_ID=k2 puis lance le script de ré-encryption si dispo =="

echo "== 12) (Option) Rétention – simule ancienneté et purge =="
# Exemple: mets à la main updatedAt en DB puis:
npm run -s kyc:retention:run

echo "OK ✅"
