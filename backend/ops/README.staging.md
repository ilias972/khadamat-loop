# Staging Operations

1. **DNS**
2. **Docker services**: Postgres, Redis, ClamAV
3. **API**: start via PM2 or Docker
4. **Proxy TLS**
5. **Webhooks**: Stripe / KYC
6. **Tokens**
7. **Ops checks**
8. **Go-live**

## Plan B local

Use an HTTPS tunnel (ngrok or cloudflared) if remote services are unavailable. Be aware of tunnel rate limits and verify endpoints with the provided ops scripts.
