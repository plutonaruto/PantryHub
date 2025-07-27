import pytest
from app import app  # Adjust import if your blueprint is registered in another way

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

def test_generate_recipes_no_ingredients(client):
    response = client.post('/api/generate-recipes', json={})
    assert response.status_code == 400
    assert response.get_json()['error'] == 'No ingredients provided'

def test_generate_recipes_with_ingredients_together(monkeypatch, client):
    # Monkeypatch to simulate Together AI success
    fake_recipes = [{"name": "Test Recipe", 
                     "ingredients": ["carrot", "onion"]}]
    monkeypatch.setattr('api.recipes.try_together_ai_with_retry', lambda ingredients, max_retries=3: fake_recipes)
    data = {"ingredients": ["carrot", "onion"]}
    response = client.post('/api/generate-recipes', json=data)
    assert response.status_code == 200
    result = response.get_json()
    assert result['source'] == 'together'
    assert result['recipes'] == fake_recipes
