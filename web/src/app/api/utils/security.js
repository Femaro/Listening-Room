// Security utilities for ListeningRoom platform
import { ratelimit } from './ratelimit';

// Environment check
const isProduction = process.env.NODE_ENV === 'production';

// Secure logging that prevents sensitive data leakage
export function secureLog(level, message, data = {}) {
  if (isProduction) {
    // In production, only log essential information without sensitive data
    const sanitizedData = sanitizeLogData(data);
    console[level](`[${new Date().toISOString()}] ${message}`, sanitizedData);
  } else {
    // In development, log everything for debugging
    console[level](`[${new Date().toISOString()}] ${message}`, data);
  }
}

// Remove sensitive information from log data
function sanitizeLogData(data) {
  const sensitiveFields = ['password', 'token', 'email', 'key', 'secret', 'authorization'];
  const sanitized = { ...data };
  
  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  }
  
  return sanitized;
}

// Input validation utilities
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

export function validateUsername(username) {
  // Allow alphanumeric, underscores, hyphens, 3-50 characters
  const usernameRegex = /^[a-zA-Z0-9_-]{3,50}$/;
  return usernameRegex.test(username);
}

export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  // Remove potentially dangerous characters
  return input
    .replace(/[<>'"&]/g, '') // Remove HTML/JS injection chars
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .trim()
    .substring(0, 1000); // Limit length
}

export function validateUserType(userType) {
  return ['seeker', 'volunteer', 'admin'].includes(userType);
}

export function validateLanguage(language) {
  const supportedLanguages = ['en', 'es', 'fr', 'de', 'zh', 'ja', 'ko'];
  return supportedLanguages.includes(language);
}

export function validateSessionType(sessionType) {
  return ['one_on_one', 'group'].includes(sessionType);
}

// Rate limiting middleware
export async function applyRateLimit(request, identifier = null) {
  try {
    const ip = identifier || request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 'unknown';
    
    const { success, limit, reset, remaining } = await ratelimit.limit(ip);
    
    if (!success) {
      return new Response(
        JSON.stringify({ 
          error: 'Too many requests', 
          retryAfter: Math.round((reset - Date.now()) / 1000) 
        }), 
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': new Date(reset).toISOString(),
            'Retry-After': Math.round((reset - Date.now()) / 1000).toString()
          }
        }
      );
    }
    
    return null; // Success, continue processing
  } catch (error) {
    secureLog('error', 'Rate limiting error', { error: error.message });
    // Don't block on rate limiting errors
    return null;
  }
}

// CORS headers
export function addSecurityHeaders(response) {
  const headers = new Headers(response.headers);
  
  // Security headers
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-XSS-Protection', '1; mode=block');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  if (isProduction) {
    headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

// Error response utilities
export function createErrorResponse(message, status = 500, details = null) {
  const errorData = { error: message };
  
  if (!isProduction && details) {
    errorData.details = details;
  }
  
  return Response.json(errorData, { status });
}

// Session validation
export function validateSession(session) {
  if (!session?.user?.id) {
    throw new Error('Invalid session');
  }
  
  // Check session expiry if needed
  if (session.expires && new Date(session.expires) < new Date()) {
    throw new Error('Session expired');
  }
  
  return true;
}

// Data encryption utilities (for future use)
export function hashSensitiveData(data) {
  // Placeholder for future encryption implementation
  // For now, we rely on database-level encryption
  return data;
}

// Privacy utilities
export function anonymizeUserData(userData) {
  return {
    id: userData.id,
    userType: userData.user_type,
    language: userData.preferred_language,
    isActive: userData.is_active,
    createdAt: userData.created_at,
    // Remove identifying information
    username: userData.username ? `User_${userData.id}` : null
  };
}