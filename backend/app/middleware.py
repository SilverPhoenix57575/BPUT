from fastapi import Request
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
            return {"error": "Rate limit exceeded. Try again later."}
        
        self.clients[client_ip].append(current_time)
        response = await call_next(request)
        return response

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        logger.info(f"Request: {request.method} {request.url.path}")
        
        response = await call_next(request)
        
        process_time = time.time() - start_time
        logger.info(f"Response: {response.status_code} - {process_time:.2f}s")
        
        return response
