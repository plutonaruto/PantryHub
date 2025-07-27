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

    recipes = recipes = try_together_ai_with_retry(ingredients, max_retries=3)
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
            "Authorization": f"Bearer {
                api_key}",
            "Content-Type": "recipes_application/json"
        }
        
        payload = {
            "model": "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
            "messages": [
                {
                    "role": "system",
                    "content": "You are a recipe generator. Respond only with valid JSON array format. Include measurements for the ingredients"
                },
                {
                    "role": "user",
                    "content": (
                        f"Generate 5 simple recipes using: {', '.join(ingredients)}. "
                        "Each recipe must include:\n"
                        "- name (string)\n"
                        "- ingredients (list of strings)\n"
                        "- url (string, a link to a full recipe, use a valid link like https://example.com/recipe1)\n"
                        "Format: [{\"name\": ..., \"ingredients\": [...], \"url\": ...}]"
                    )
                }
            ],
            "max_tokens": 400,
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
    
    # Recipe templates 
    recipe_templates = [
        {
            "name": f"Simple {primary_ingredient} Stir-fry",
            "ingredients": ingredients[:3] + ["vegetable oil", "salt", "black pepper", "garlic"]
        },
        {
            "name": f"Fresh {primary_ingredient} Salad", 
            "ingredients": ingredients[:2] + ["mixed greens", "olive oil", "lemon juice"]
        },
        {
            "name": f"Grilled {primary_ingredient}",
            "ingredients": ingredients[:2] + ["olive oil", "herbs", "salt", "pepper"]
        },
        {
            "name": f"Hearty {primary_ingredient} Soup",
            "ingredients": ingredients[:3] + ["vegetable broth", "onion", "carrots"]
        },
        {
            "name": f"Baked {primary_ingredient} Delight",
            "ingredients": ingredients[:2] + ["butter", "seasoning blend", "breadcrumbs"]
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

@recipes_bp.route('/api/generate-recipes', methods=['POST', 'OPTIONS'])
def generate_recipes_simple():
    if request.method == 'OPTIONS':
        return '', 200
        
    data = request.get_json(force=True)  
    ingredients = data.get('ingredients', []) if data else []
    
    if not ingredients:
        return jsonify({"error": "No ingredients provided"}), 400
    
    recipes = create_fallback_recipes(ingredients)
    return jsonify({"recipes": recipes, "source": "template"})