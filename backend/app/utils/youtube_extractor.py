from youtube_transcript_api import YouTubeTranscriptApi
import re

def extract_youtube_transcript(url: str) -> str:
    try:
        video_id_match = re.search(r'(?:v=|\/)([0-9A-Za-z_-]{11}).*', url)
        if not video_id_match:
            return "Invalid YouTube URL"
        
        video_id = video_id_match.group(1)
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        
        text = " ".join([entry['text'] for entry in transcript])
        return text
    except Exception as e:
        return f"Error extracting YouTube transcript: {str(e)}"
