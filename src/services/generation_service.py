from src.prompts import SystemPrompts
from src.config.config import Config
from mistralai import Mistral

client = Mistral(api_key=Config.MISTRAL_API_KEY)

def generate_content(prompt, field_name=None, system_instruction=None, context=None, timeout=30):
    if system_instruction is None and field_name:
        system_instruction = SystemPrompts.get_prompt(field_name)
    elif system_instruction is None:
        system_instruction = SystemPrompts.DEFAULT
    
    if context:
        enhanced_prompt = f"Kontext:\n{context}\n\nAufgabe:\n{prompt}"
    else:
        enhanced_prompt = prompt

    try:
        response = client.messages.create(
            model="mistral-large-latest",
            messages=[
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": enhanced_prompt}
            ],
            timeout=timeout
        )
        
        return response.choices[0].message.content
        
    except Exception as e:
        if "timeout" in str(e).lower():
            raise Exception("Die API-Anfrage hat zu lange gedauert. Bitte versuchen Sie es erneut.")
        elif "rate limit" in str(e).lower():
            raise Exception("Zu viele Anfragen. Bitte warten Sie einen Moment.")
        elif "api_key" in str(e).lower():
            raise Exception("API-Schlüssel ungültig.")
        else:
            raise Exception(f"API-Fehler: {str(e)}")