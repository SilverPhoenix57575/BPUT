from docx import Document
from io import BytesIO

def extract_doc_text(content: bytes) -> str:
    try:
        doc_file = BytesIO(content)
        doc = Document(doc_file)
        
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        
        return text.strip()
    except Exception as e:
        return f"Error extracting DOC: {str(e)}"
