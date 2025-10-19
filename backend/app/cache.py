from functools import lru_cache
import hashlib
import json

class SimpleCache:
    def __init__(self, max_size=100):
        self.cache = {}
        self.max_size = max_size
    
    def get_key(self, *args, **kwargs):
        key_data = json.dumps({"args": args, "kwargs": kwargs}, sort_keys=True)
        return hashlib.md5(key_data.encode()).hexdigest()
    
    def get(self, key):
        return self.cache.get(key)
    
    def set(self, key, value):
        if len(self.cache) >= self.max_size:
            oldest_key = next(iter(self.cache))
            del self.cache[oldest_key]
        self.cache[key] = value
    
    def clear(self):
        self.cache.clear()

ai_cache = SimpleCache(max_size=50)
