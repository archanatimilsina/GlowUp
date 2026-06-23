import gradio as gr
import os
import cv2
import numpy as np
from skin_detection_knn import identify_skin_tone

def analyze_skin_tone(image):
    temp_dir = "./temp_uploads"
    os.makedirs(temp_dir, exist_ok=True)
    temp_path = os.path.join(temp_dir, "uploaded_face.png")
    cv2.imwrite(temp_path, cv2.cvtColor(image, cv2.COLOR_RGB2BGR))
    tone_id, result_name = identify_skin_tone(temp_path)
    if tone_id is None:
        return {
            "tone": None,
            "tone_name": result_name,
            "status": "failed"
        }
    return {
        "tone": str(tone_id),
        "tone_name": result_name,
        "status": "success"
    }

demo = gr.Interface(
    fn=analyze_skin_tone,
    inputs=gr.Image(type="numpy"),
    outputs=gr.JSON(),
    title="GlowUp Skin Tone Analyzer"
)

demo.launch()