// Simple in-memory rate limiting for ListeningRoom
// In production, consider using Redis or a dedicated rate limiting service

class RateLimit {
  constructor(maxRequests = 100, windowMs = 60 * 1000) { // 100 requests per minute default
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
    
    // Clean up old entries every minute
    setInterval(() => this.cleanup(), 60 * 1000);
  }

  async limit(identifier) {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    if (!this.requests.has(identifier)) {
      this.requests.set(identifier, []);
    }
    
    const userRequests = this.requests.get(identifier);
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(timestamp => timestamp > windowStart);
    
    if (validRequests.length >= this.maxRequests) {
      const oldestRequest = Math.min(...validRequests);
      const reset = oldestRequest + this.windowMs;
      
      return {
        success: false,
        limit: this.maxRequests,
        remaining: 0,
        reset
      };
    }
    
    // Add current request
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    
    return {
      success: true,
      limit: this.maxRequests,
      remaining: this.maxRequests - validRequests.length,
      reset: now + this.windowMs
    };
  }
  
  cleanup() {
    const now = Date.now();
    const cutoff = now - this.windowMs;
    
    for (const [identifier, timestamps] of this.requests.entries()) {
      const validRequests = timestamps.filter(timestamp => timestamp > cutoff);
      
      if (validRequests.length === 0) {
        this.requests.delete(identifier);
      } else {
        this.requests.set(identifier, validRequests);
      }
    }
  }
}

// Create different rate limiters for different endpoints
export const ratelimit = new RateLimit(100, 60 * 1000); // General API: 100/minute
export const authRateLimit = new RateLimit(5, 60 * 1000); // Auth: 5/minute  
export const sessionRateLimit = new RateLimit(10, 60 * 1000); // Sessions: 10/minute
export const feedbackRateLimit = new RateLimit(3, 60 * 1000); // Feedback: 3/minute