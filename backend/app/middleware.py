from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
import time
import logging

logger = logging.getLogger(__name__)

class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, calls: int = 100, period: int = 60):
        super().__init__(app)
        self.calls = calls
        self.period = period
        self.clients = {}
    
    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host
        current_time = time.time()
        
        if client_ip not in self.clients:
            self.clients[client_ip] = []
        
        self.clients[client_ip] = [
            req_time for req_time in self.clients[client_ip]
            if current_time - req_time < self.period
        ]
        
        if len(self.clients[client_ip]) >= self.calls:
            logger.warning(f"Rate limit exceeded for {client_ip}")
            return JSONResponse(
                status_code=429,
                content={"success": False, "error": "Rate limit exceeded. Please try again later."}
            )
        
        self.clients[client_ip].append(current_time)
        response = await call_next(request)
        return response

class AIRateLimitMiddleware(BaseHTTPMiddleware):
    """Stricter rate limiting for AI endpoints"""
    def __init__(self, app, calls: int = 20, period: int = 60):
        super().__init__(app)
        self.calls = calls
        self.period = period
        self.clients = {}
    
    async def dispatch(self, request: Request, call_next):
        if not request.url.path.startswith("/api/v1/ai") and not request.url.path.startswith("/api/ai"):
            return await call_next(request)
        
        client_ip = request.client.host
        current_time = time.time()
        
        if client_ip not in self.clients:
            self.clients[client_ip] = []
        
        self.clients[client_ip] = [
            req_time for req_time in self.clients[client_ip]
            if current_time - req_time < self.period
        ]
        
        if len(self.clients[client_ip]) >= self.calls:
            logger.warning(f"AI rate limit exceeded for {client_ip}")
            return JSONResponse(
                status_code=429,
                content={"success": False, "error": "Too many AI requests. Please wait before trying again."}
            )
        
        self.clients[client_ip].append(current_time)
        response = await call_next(request)
        return response

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        logger.info(f"Request: {request.method} {request.url.path}")
        
        try:
            response = await call_next(request)
            process_time = time.time() - start_time
            logger.info(f"Response: {response.status_code} - {process_time:.2f}s")
            return response
        except Exception as e:
            process_time = time.time() - start_time
            logger.error(f"Error: {str(e)} - {process_time:.2f}s")
            return JSONResponse(
                status_code=500,
                content={"success": False, "error": "Internal server error"}
            )
