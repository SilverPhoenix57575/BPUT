from PIL import Image
from io import BytesIO
import pytesseract

def extract_image_text(content: bytes) -> str:
    try:
        image = Image.open(BytesIO(content))
        text = pytesseract.image_to_string(image)
        return text.strip()
    except Exception as e:
        return f"Error extracting text from image: {str(e)}. Note: Tesseract OCR must be installed."
