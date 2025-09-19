import google.generativeai as genai
from app.secret_key import GOOGLE_API_KEY

def get_picture_content(image_path):
    with open(image_path, "rb") as image_file:
        image_data = image_file.read()
    return image_data


genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-pro')

def generate_flashcards_from_photo(image_path):
    image_content = get_picture_content(image_path)
    prompt = f"Generate flashcards from this photo: {image_content}"
    response = model.generate_content(prompt)
    return response.text

