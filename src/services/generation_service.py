from src.prompts import SystemPrompts


def generate_content(prompt, field_name=None, system_instruction=None, context=None):
    if system_instruction is None and field_name:
        system_instruction = SystemPrompts.get_prompt(field_name)
    elif system_instruction is None:
        system_instruction = SystemPrompts.DEFAULT
    
    if context:
        enhanced_prompt = f"Kontext:\n{context}\n\nAufgabe:\n{prompt}"
    else:
        enhanced_prompt = prompt
    
    return f"Generierter Text basierend auf: {enhanced_prompt}"