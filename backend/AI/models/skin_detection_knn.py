import pandas as pd
import numpy as np
import os
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from .skin_detection import skin_detection 

skin_model = None
scaler = StandardScaler()

def train_model(dataset_path):
    """Trains the AI using your CSV file."""
    if not os.path.exists(dataset_path):
        print(f"ERROR: Dataset not found at {dataset_path}")
        return None
        
    df = pd.read_csv(dataset_path)
    
    X = df[['Y', 'H', 'Cr', 'Cb']].values
    y = df['Type'].values
    
    X_scaled = scaler.fit_transform(X)
    
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_scaled, y)
    print("AI Model Trained Successfully.")
    return model

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, 'skin_tone_new.csv')
skin_model = train_model(DATASET_PATH)

def identify_skin_tone(image_path):
    if skin_model is None:
        return None, "Model Error"

    color_values = skin_detection(image_path)
    
    if np.all(color_values == 0):
        return None, "No Face Detected"
    
    vals_reshaped = color_values.reshape(1, -1)
    vals_scaled = scaler.transform(vals_reshaped)
    
    y_pred = skin_model.predict(vals_scaled)[0]
    
    tone_names = {
        1: "Very Fair", 2: "Fair", 3: "Medium", 
        4: "Olive", 5: "Brown", 6: "Dark"
    }
    
    result = tone_names.get(y_pred, "Unknown")
    confidence = skin_model.predict_proba(vals_scaled).max()
    
    print(f"--- RESULT ---")
    print(f"Detected Values (Y,H,Cr,Cb): {color_values}")
    print(f"Prediction: {result} ({confidence*100:.1f}% confidence)")
    
    return y_pred, result






# TEST IT:
# identify_skin_tone("my_photo.jpg")

# import pandas as pd
# import os
# from sklearn.neighbors import KNeighborsClassifier
# from models.skin_detection import skin_detection

# def train_model(dataset_path):
#     df = pd.read_csv(dataset_path)
#     X = df[['H', 'Cr', 'Cb']].values
#     y = df['Type'].values
    
#     model = KNeighborsClassifier(n_neighbors=6, metric='minkowski', p=2)
#     model.fit(X, y)
#     return model


# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# DATASET_PATH = os.path.join(BASE_DIR, 'skin_tone_dataset.csv')

# skin_model = train_model(DATASET_PATH)


# def identify_skin_tone(image_path):
#     mean_color_values = skin_detection(image_path)
    
#     y_pred = skin_model.predict([mean_color_values])
    
#     tone_names = {1: "Very Fair", 2: "Fair", 3: "Medium", 4: "Olive", 5: "Brown", 6: "Dark"}
#     result = tone_names.get(y_pred[0], "Unknown")
    
#     return y_pred[0], result





# # def identify_skin_tone(image_path):
# #     mean_color_values = skin_detection(image_path)
# #     y_pred = skin_model.predict([mean_color_values])
# #     tone_names = {1: "Very Fair", 2: "Fair", 3: "Medium", 4: "Olive", 5: "Brown", 6: "Dark"}
# #     result = tone_names.get(y_pred[0], "Unknown")
# #     print(f"Predicted Type: {y_pred[0]} ({result})")
# #     return y_pred[0]