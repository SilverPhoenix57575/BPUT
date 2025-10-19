from PyPDF2 import PdfReader
from io import BytesIO

def extract_pdf_text(content: bytes) -> str:
    try:
        pdf_file = BytesIO(content)
        reader = PdfReader(pdf_file)
        
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        
        return text.strip()
    except Exception as e:
        return f"Error extracting PDF: {str(e)}"
