# Centralized constants to avoid hardcoded values

# API Configuration
API_TIMEOUT = 30  # seconds
API_RETRY_COUNT = 3
API_RETRY_DELAY = 1  # seconds

# File Upload Configuration
ALLOWED_EXTENSIONS = {'.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg', '.txt'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
UPLOAD_DIR = "uploads"

# AI Service Configuration
GEMINI_MODEL = "gemini-2.0-flash"
MAX_CHAT_HISTORY = 10
MAX_QUIZ_QUESTIONS = 20
DEFAULT_QUIZ_QUESTIONS = 5

# BKT Parameters
BKT_INITIAL_KNOWLEDGE = 0.3
BKT_LEARNING_RATE = 0.2
BKT_GUESS_PROBABILITY = 0.25
BKT_SLIP_PROBABILITY = 0.1

# JWT Configuration
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Validation Limits
MIN_PASSWORD_LENGTH = 8
MAX_TEXT_LENGTH = 50000
MIN_QUESTION_LENGTH = 3
MIN_ENHANCE_TEXT_LENGTH = 10
MAX_ENHANCE_TEXT_LENGTH = 10000
