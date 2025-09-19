import google.generativeai as genai
from app.secret_key import GOOGLE_API_KEY



genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

def generate_flashcards_from_photo(file):
    image_part = genai.Part(
        mime_type=file.content_type,
        data=file.read()
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
    response = model.generate_content([prompt, image_part])
    print(response.text)
    return response.text

