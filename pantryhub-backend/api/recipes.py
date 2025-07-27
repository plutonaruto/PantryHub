import os
import json
import random
import time

from flask import Blueprint, request, jsonify
import requests

recipes_bp = Blueprint("recipes", __name__)

@recipes_bp.route('/api/generate-recipes', methods=['POST'])
def generate_recipes():
    data = request.get_json()
    ingredients = data.get('ingredients')

    if not ingredients:
        return jsonify({"error": "No ingredients provided"}), 400

    recipes = None

    recipes = try_together_ai_with_retry(ingredients, max_retries=3)
    if recipes:
        return jsonify({"recipes": recipes, "source": "together"})
    
    # fallback, use template recipes
    recipes = create_fallback_recipes(ingredients)
    return jsonify({"recipes": recipes, "source": "fallback"})

def try_together_ai_with_retry(ingredients, max_retries=3, base_delay=1):
    for attempt in range(max_retries):
        print(f"Together AI attempt {attempt + 1}/{max_retries}")
        
        recipes = try_together_ai(ingredients)
        if recipes:
            return recipes
        
        #wait before retrying
        if attempt < max_retries - 1:
            delay = base_delay * (2 ** attempt) + random.uniform(0, 1)
            print(f"Retrying in {delay:.2f} seconds...")
            time.sleep(delay)
    
    print(f"All {max_retries} attempts failed")
    return None

def try_together_ai(ingredients):
    api_key = os.environ.get('TOGETHER_API_KEY')
    if not api_key:
        return None
    
    try:
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
            "messages": [
                {
                    "role": "system",
                    "content": (
                        "You are a recipe generator. Return only valid, compact JSON. "
                        "Each recipe must have: name (string), ingredients (list of strings), and instructions (string). "
                        "Return an array of 5 complete recipes. No extra text or explanation."
                    )
                },
                {
                "role": "user",
                "content": (
                    f"Generate 5 simple recipes using: {', '.join(ingredients)}. "
                    "Each recipe must include:\n"
                    "- name (string)\n"
                    "- ingredients (list of strings with measurements)\n"
                    "- instructions (string with step-by-step cooking instructions)\n\n"
                    "Respond in JSON array format like:\n"
                    "[{\"name\": ..., \"ingredients\": [...], \"instructions\": \"...\"}]"
                )
                }
            ],
            "max_tokens": 800,
            "temperature": 0.7
        }
        
        response = requests.post(
            "https://api.together.xyz/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=30
        )
        
        print(f"Together AI Response Status: {response.status_code}")
        print(f"Together AI Response: {response.text}")
        
        if response.status_code == 200:
            result = response.json()
            content = result['choices'][0]['message']['content']
            
            # extract JSON 
            start_idx = content.find('[')
            end_idx = content.rfind(']') + 1
            if start_idx != -1 and end_idx != 0:
                json_str = content[start_idx:end_idx]
                return json.loads(json_str)
                
    except Exception as e:
        print(f"Together AI error: {e}")
        return None

def create_fallback_recipes(ingredients):
    if not ingredients:
        return []
    
    primary_ingredient = ingredients[0].title()
    
    recipe_templates = [
        {
            "name": f"Simple {primary_ingredient} Stir-fry",
            "ingredients": ingredients[:3] + ["vegetable oil", "salt", "black pepper", "garlic"],
            "instructions": f"1. Heat vegetable oil in a pan.\n"
                            f"2. Add garlic and sauté until fragrant.\n"
                            f"3. Add {primary_ingredient} and other ingredients.\n"
                            f"4. Stir-fry for 5–7 minutes until cooked.\n"
                            f"5. Season with salt and pepper to taste."
        },
        {
            "name": f"Fresh {primary_ingredient} Salad", 
            "ingredients": ingredients[:2] + ["mixed greens", "olive oil", "lemon juice"],
            "instructions": f"1. Wash and chop {primary_ingredient} and other vegetables.\n"
                            f"2. Toss with mixed greens in a large bowl.\n"
                            f"3. Drizzle with olive oil and lemon juice.\n"
                            f"4. Add salt and pepper if desired.\n"
                            f"5. Serve chilled."
        },
        {
            "name": f"Grilled {primary_ingredient}",
            "ingredients": ingredients[:2] + ["olive oil", "herbs", "salt", "pepper"],
            "instructions": f"1. Marinate {primary_ingredient} with olive oil, herbs, salt, and pepper.\n"
                            f"2. Preheat the grill to medium-high heat.\n"
                            f"3. Grill {primary_ingredient} for 4–5 minutes on each side.\n"
                            f"4. Serve hot with a side of greens or rice."
        },
        {
            "name": f"Hearty {primary_ingredient} Soup",
            "ingredients": ingredients[:3] + ["vegetable broth", "onion", "carrots"],
            "instructions": f"1. In a pot, sauté onions and carrots until soft.\n"
                            f"2. Add {primary_ingredient} and stir for 2 minutes.\n"
                            f"3. Pour in vegetable broth and bring to a boil.\n"
                            f"4. Reduce heat and simmer for 15–20 minutes.\n"
                            f"5. Season to taste and serve warm."
        },
        {
            "name": f"Baked {primary_ingredient} Delight",
            "ingredients": ingredients[:2] + ["butter", "seasoning blend", "breadcrumbs"],
            "instructions": f"1. Preheat oven to 180°C (350°F).\n"
                            f"2. Coat {primary_ingredient} in melted butter and seasoning.\n"
                            f"3. Roll in breadcrumbs for a crispy coating.\n"
                            f"4. Place on baking tray and bake for 20–25 minutes.\n"
                            f"5. Let cool slightly before serving."
        }
    ]
    
    return recipe_templates

# Test endp
# oint
@recipes_bp.route('/api/test-apis', methods=['GET'])
def test_apis():
    results = {}
    
    if os.environ.get('TOGETHER_API_KEY'):
        results['together'] = 'API key present'
    else:
        results['together'] = 'No API key'
    
    return jsonify(results)

# no AI

@recipes_bp.route('/api/generate-recipes-template', methods=['POST', 'OPTIONS'])
def generate_recipes_simple():
    if request.method == 'OPTIONS':
        return '', 200
        
    data = request.get_json(force=True)  
    ingredients = data.get('ingredients', []) if data else []
    
    if not ingredients:
        return jsonify({"error": "No ingredients provided"}), 400
    
    recipes = create_fallback_recipes(ingredients)
    return jsonify({"recipes": recipes, "source": "template"})