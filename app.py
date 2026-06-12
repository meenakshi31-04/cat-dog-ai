import os
import numpy as np
from flask import Flask, request, render_template, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Load your trained model
MODEL_PATH = 'cat_dog_model.h5'
model = load_model(MODEL_PATH)

# Setup a temporary folder for uploaded images
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def predict_image(img_path):
    # Load and resize to match your updated notebook code!
    img = image.load_img(img_path, target_size=(128, 128))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    
    # CRITICAL: Normalize the image
    img_array = img_array / 255.0  
    
    # Make prediction and CONVERT TO STANDARD PYTHON FLOAT
    result = float(model.predict(img_array)[0][0])  # <--- Add float() here
    
    # Calculate confidence percentage
    if result > 0.5:
        return {"class": "Dog", "confidence": round(result * 100, 2)}
    else:
        return {"class": "Cat", "confidence": round((1 - result) * 100, 2)}
# This route serves your HTML page
@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

# This route handles the AI prediction
@app.route('/predict', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'})
    
    f = request.files['file']
    if f.filename == '':
        return jsonify({'error': 'No file selected'})

    # Save the file securely
    filename = secure_filename(f.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    f.save(filepath)

    try:
        # Run the AI prediction
        prediction_data = predict_image(filepath)
        # Delete the image so your computer doesn't fill up!
        os.remove(filepath)
        return jsonify(prediction_data)
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True, port=5000)