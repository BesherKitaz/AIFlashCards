from google import genai
from google.genai import types
import requests
from app.secret_key import GOOGLE_API_KEY
import json
import re




def generate_flashcards_from_photo(file):
    """
    Generate flashcards from a photo file using Google Gemini API.
    Args:
        file: A file-like object containing the image.
    :returns:
        A list of flashcards (dicts), where each flashcard is a dictionary with 'front' and 'back' keys.
    """
    image_bytes = file.read()  
    file.seek(0)  # reset pointer so you can use file again if needed

    image = types.Part.from_bytes(
    data=image_bytes, mime_type="image/jpeg"
    )
    prompt = (
    "Generate flashcards from this photo. The response should be a JSON array "
    "of objects, where each object has a 'front' and a 'back' field. "
    "Take whatever readable text you can find in the image and turn it into flashcards so it can be studied. "
    "The 'front' field should contain the question, and the 'back' "
    "field should contain the answer or definition. Please provide only the "
    "JSON output and nothing else.\n\n"
    "Example JSON format:\n"
    "[\n"
    "  {\n"
    "    \"front\": \"Example term\",\n"
    "    \"back\": \"Example definition\"\n"
    "  }\n"
    "]\n\n"
)
    
    client = genai.Client(api_key=GOOGLE_API_KEY)
    response = client.models.generate_content(
        model='gemini-1.5-flash',
        contents= [prompt, image],
    )
    processed_text = re.sub(r"^```json\s*|\s*```$", "", response.text.strip(), flags=re.DOTALL).strip()
    cards = json.loads(processed_text)
    return cards

