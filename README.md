# cat-dog-ai
# AI Vision | Pet Classifier 🐱🐶

An elegant, full-stack web application that uses a custom-trained Convolutional Neural Network (CNN) to instantly classify uploaded images as either a cat or a dog. 

Featuring a modern, dark-themed "glassmorphism" UI built with Tailwind CSS, this project demonstrates end-to-end machine learning deployment from model training to frontend user experience.

---

## ✨ Features
* **Custom AI Model:** Powered by a TensorFlow/Keras Convolutional Neural Network trained on thousands of images.
* **Modern UI/UX:** A sleek, responsive dark mode interface utilizing Tailwind CSS.
* **Dynamic Interactions:** Drag-and-drop file uploading, image preview, and animated confidence bars.
* **Robust Backend:** A lightweight, fast Python/Flask server handling image preprocessing and AI inference.

---

## 🛠️ Tech Stack
* **Frontend:** HTML5, Tailwind CSS, Vanilla JavaScript
* **Backend:** Python, Flask, Werkzeug
* **Machine Learning:** TensorFlow, Keras, NumPy, Pillow
* **Deployment:** Gunicorn (Ready for Render/Heroku)

---

## 📁 Project Structure

```text
CatDogWebsite/
│
├── app.py                  # Flask backend server
├── cat_dog_model.h5        # Trained Keras CNN model
├── requirements.txt        # Python dependencies
├── README.md               # Project documentation
├── uploads/                # Temporary directory for image processing
├── templates/              
│   └── index.html          # Main application interface
└── static/                 
    ├── style.css           # Custom UI animations
    └── script.js           # Client-side logic & API requests

##preview
https://cat-dog-ai-classifier.onrender.com/
