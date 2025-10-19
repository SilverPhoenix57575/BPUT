from ..utils.pdf_extractor import extract_pdf_text
from ..utils.doc_extractor import extract_doc_text
from ..utils.ocr_processor import extract_image_text
from ..utils.youtube_extractor import extract_youtube_transcript

class ContentProcessor:
    async def process_file(self, filename: str, content: bytes) -> str:
        if filename.endswith('.pdf'):
            return extract_pdf_text(content)
        elif filename.endswith(('.doc', '.docx')):
            return extract_doc_text(content)
        elif filename.endswith(('.png', '.jpg', '.jpeg')):
            return extract_image_text(content)
        else:
            return content.decode('utf-8', errors='ignore')
    
    async def process_youtube(self, url: str) -> str:
        return extract_youtube_transcript(url)
