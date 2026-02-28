# SaleManager Security Guide

> **Version**: 1.0.0
> **Last Updated**: 2026-02-28

---

## Table of Contents

1. [Security Overview](#security-overview)
2. [Authentication & Authorization](#authentication--authorization)
3. [Input Validation](#input-validation)
4. [Data Protection](#data-protection)
5. [API Security](#api-security)
6. [Frontend Security](#frontend-security)
7. [Deployment Security](#deployment-security)
8. [Security Best Practices](#security-best-practices)

---

## Security Overview

### Security Posture

SaleManager implements a comprehensive security approach with multiple layers of protection:

| Layer | Implementation | Status |
|-------|---------------|--------|
| **Authentication** | JWT-based auth with bcrypt password hashing | ✅ Implemented |
| **Input Validation** | express-validator on all endpoints | ✅ Implemented |
| **SQL Injection** | Prisma ORM + input sanitization | ✅ Protected |
| **XSS** | React built-in + HTML escaping | ✅ Protected |
| **CSRF** | CORS restrictions + SameSite cookies | ✅ Protected |
| **Rate Limiting** | Recommended for production | ⚠️ TODO |
| **HTTPS** | Required for production | ⚠️ TODO |

---

## Authentication & Authorization

### JWT Token Implementation

**Token Configuration:**
```typescript
{
  secret: process.env.JWT_SECRET,  // Must be 32+ characters
  expiresIn: '7d'                 // Token validity period
}
```

**Security Measures:**
- Passwords hashed with bcryptjs (salt rounds: 10)
- JWT tokens signed with HS256 algorithm
- Token payload includes: userId, email, role
- Tokens sent via Authorization header: `Bearer <token>`

### Protected Routes

All API endpoints require authentication except:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /health` - Health check

### Role-Based Access Control (Future)

Current implementation supports single user role. Future versions will include:
- Admin role: Full access
- User role: Limited access
- Role-based route protection

---

## Input Validation

### Validation Rules by Entity

**Customer:**
```typescript
{
  name: "1-100 characters, required",
  email: "Valid email format, optional",
  phone: "Valid phone format, optional",
  status: "active|inactive enum"
}
```

**Lead:**
```typescript
{
  name: "1-100 characters, required",
  email: "Valid email format, optional",
  phone: "Valid phone format, optional",
  source: "website|referral|event|cold_call|other enum",
  status: "new|contacted|qualified|converted|lost enum"
}
```

**Pagination:**
```typescript
{
  page: "Integer >= 1, default: 1",
  limit: "Integer 1-100, default: 20",
  search: "Max 100 characters"
}
```

### SQL Injection Prevention

**Automatic Protection:**
- Prisma ORM uses parameterized queries
- No raw SQL queries in codebase

**Additional Sanitization:**
```typescript
// Search input sanitization
sanitizeSearchInput(input) {
  return input
    .replace(/\\/g, '\\\\')  // Escape backslashes
    .replace(/%/g, '\\%')    // Escape LIKE wildcards
    .replace(/_/g, '\\_');   // Escape LIKE wildcards
}
```

---

## Data Protection

### Password Storage

```
Plain Password → bcrypt (salt rounds: 10) → Hashed Password
```

**Never store plain text passwords!**

### Sensitive Data Logging

**Production Logging:**
```typescript
// Logs environment only
- Error codes
- Sanitized error messages
- No request bodies
- No user data

// Development Logging
- Full error details
- Stack traces
- Request/response data
```

### Error Messages

**Public Error Messages:**
- Generic messages for production
- No database schema exposure
- No internal paths revealed

**Example:**
```typescript
// Production
"리소스를 찾을 수 없습니다"

// Development
"'GET /api/customers/123' 엔드포인트를 찾을 수 없습니다"
```

---

## API Security

### CORS Configuration

**Current Settings:**
```typescript
// Development
CORS_ORIGIN=http://localhost:5173

// Production
CORS_ORIGIN=https://your-domain.com
```

**Deployment:**
1. Add your frontend domain to `CORS_ORIGIN`
2. Use comma separation for multiple domains
3. Never use `*` in production

### Rate Limiting (Recommended)

**Not yet implemented** - Add for production:

```javascript
// Install: npm install express-rate-limit
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### Security Headers

**Implemented Headers:**
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'
```

---

## Frontend Security

### XSS Prevention

**React Built-in Protections:**
- Auto-escaping of JSX expressions
- `dangerouslySetInnerHTML` not used

**Additional Measures:**
```typescript
// Email template HTML escaping
sanitizeTemplateValue(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
```

### Token Storage

**Implementation:**
```typescript
// Stored in localStorage
localStorage.setItem('salemanager_token', token);

// Auto-included in API requests
apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

**Security Notes:**
- Tokens accessible to JavaScript
- Consider httpOnly cookies for better security
- Implement refresh token rotation for production

### 401 Error Handling

**Automatic Redirect:**
```typescript
// On 401 response
if (error.response?.status === 401) {
  localStorage.removeItem('salemanager_token');
  window.location.href = '/login';
}
```

---

## Deployment Security

### Environment Variables

**Required Variables:**

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `PORT` | No | Server port | `3000` |
| `NODE_ENV` | No | Environment | `production` |
| `DATABASE_URL` | Yes | Database path | `file:./prisma/salemanager.db` |
| `CORS_ORIGIN` | Yes | Allowed origins | `https://yourapp.com` |
| `JWT_SECRET` | Yes | JWT signing key | `32+ character random string` |
| `JWT_EXPIRES_IN` | No | Token lifetime | `7d` |

**Production Validation:**
```typescript
// In production, these throw errors if missing:
- DATABASE_URL
- CORS_ORIGIN
- JWT_SECRET (must be 32+ characters)
```

### HTTPS Requirements

**Production MUST use HTTPS:**
- Protects data in transit
- Required for modern web APIs
- Enables HSTS header

**Certificate Providers:**
- Let's Encrypt (Free)
- Cloudflare (Free SSL)
- AWS Certificate Manager

### Database Security

**SQLite (Current):**
```bash
# File permissions
chmod 600 salemanager.db

# Backup regularly
cp salemanager.db backup/salemanager.db.$(date +%Y%m%d)
```

**PostgreSQL (Recommended for Production):**
- SSL connection required
- Separate database user per service
- Regular backups implemented

---

## Security Best Practices

### Development vs Production

| Practice | Development | Production |
|----------|-------------|------------|
| JWT Secret | Default allowed | Custom 32+ chars required |
| Error Details | Full stack trace | Sanitized messages |
| CORS | Localhost only | Specific domains |
| HTTPS | Optional | Required |
| Logging | Verbose | Security-focused |

### Regular Security Tasks

**Weekly:**
- Review access logs
- Check for failed authentication attempts
- Monitor for unusual API usage

**Monthly:**
- Update dependencies (`npm audit fix`)
- Review and rotate secrets
- Test backup restoration

**Quarterly:**
- Security audit
- Penetration testing
- Review user access levels

### Dependency Management

**Audit Command:**
```bash
npm audit
npm audit fix

# For production
npm audit --audit-level=moderate
npm audit fix --force
```

---

## Security Checklist

### Pre-Deployment Checklist

- [ ] JWT_SECRET changed from default
- [ ] CORS_ORIGIN set to production domain
- [ ] HTTPS enabled
- [ ] Database credentials secured
- [ ] Error logging sanitized
- [ ] Rate limiting configured
- [ ] Security headers verified
- [ ] Input validation tested
- [ ] XSS prevention tested
- [ ] SQL injection tested
- [ ] Authentication flow tested

---

## Reporting Security Issues

### Found a Vulnerability?

**Internal Process:**
1. Do NOT commit to repository
2. Report to security team privately
3. Create security advisory
4. Coordinate fix disclosure

**Contact:**
- Create GitHub Issue with `security` label
- Email: security@yourdomain.com

---

**Document Version**: 1.0.0
**Last Updated**: 2026-02-28
**Next Review**: 2026-05-28
