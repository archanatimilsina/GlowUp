import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from .models import Product
from account.models import Profile

# Matches React exactly (lowercase version)
MASTER_TRAITS = [
    "oily", "dry", "combination", "sensitive", "normal",
    "moisturizing", "soothing", "pore-care", "acne-spot", "skin-barrier",
    "uv-protection", "oil-control", "no-whitecast", "balancing", "hydrating",
    "anti-aging", "black-spot", "acne-free", "brightening", "refreshing"
]

def clean_data(data_list):
    """Helper to turn any string/list into a clean lowercase list with no spaces"""
    if not data_list:
        return []
    # If it's a string from the DB like "Oily, Sensitive", split it
    if isinstance(data_list, str):
        data_list = data_list.split(',')
    
    return [str(item).strip().lower().replace(" ", "-") for item in data_list]

def recommend_skin_products(user_obj):
    try:
        profile = Profile.objects.get(user=user_obj)
        
        # Clean User Data: "Pore Care" becomes "pore-care"
        user_types = clean_data(profile.skin_type)
        user_concerns = clean_data(profile.skin_concerns)
        user_input = user_types + user_concerns
        
    except Exception as e:
        print(f"Error: {e}")
        return []

    # Create User Vector
    user_vector = [1 if trait in user_input else 0 for trait in MASTER_TRAITS]
    user_matrix = np.array(user_vector).reshape(1, -1)

    all_products = Product.objects.all()
    results = []

    for prod in all_products:
        # Clean Product Data
        p_types = clean_data(prod.skin_type)
        p_effects = clean_data(prod.notable_effects)
        prod_features = p_types + p_effects
        
        # Create Product Vector
        prod_vector = [1 if trait in prod_features else 0 for trait in MASTER_TRAITS]
        prod_matrix = np.array(prod_vector).reshape(1, -1)

        if np.any(prod_matrix) and np.any(user_matrix):
            score = cosine_similarity(user_matrix, prod_matrix)[0][0]
        else:
            score = 0
        
        results.append({
            'product': prod,
            'score': round(float(score), 2)
        })

    # Sort and return top 30
    results.sort(key=lambda x: x['score'], reverse=True)
    return results[:]