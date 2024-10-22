from flask import Flask, request, render_template, redirect, url_for, jsonify
from flask_cors import CORS  # Add this import
from groq import Groq
import base64
import os
from PIL import Image
import warnings
import uuid

# Suppress warnings
warnings.filterwarnings('ignore')

# Initialize Flask app
app = Flask(__name__)
# Enable CORS for all routes
CORS(app, resources={r"/*": {"origins": "*"}})

# Constants for models
LLAVA_MODEL = "llava-v1.5-7b-4096-preview"

# Initialize the Groq client
groq_api_key = 'groq_api_key'
client = Groq(api_key=groq_api_key)

class ImageProcessor:
    @staticmethod
    def encode_image(img_path: str) -> str:
        """Encode image to base64 string."""
        try:
            with open(img_path, "rb") as image_file:
                return base64.b64encode(image_file.read()).decode('utf-8')
        except Exception as e:
            return {"error": f"Error encoding image: {str(e)}"}

    @staticmethod
    def convert_to_jpg(input_image_path: str) -> str:
        """Converts any image to JPG format."""
        try:
            with Image.open(input_image_path) as img:
                img = img.convert("RGB")
                base_name = os.path.splitext(input_image_path)[0]
                output_image_path = f"{base_name}.jpg"
                img.save(output_image_path, "JPEG")
                return output_image_path
        except Exception as e:
            return {"error": f"Error converting image: {str(e)}"}

    def process_image_with_llm(self, encoded_image: str, model: str = LLAVA_MODEL) -> str:
        """Process image with LLM model."""
        try:
            response = client.chat.completions.create(
                messages=[{
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "Analyze this image and provide insights."},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{encoded_image}",
                            },
                        },
                    ],
                }],
                model=model
            )

            return response.choices[0].message.content

        except Exception as e:
            return {"error": f"Error processing image with LLM: {str(e)}"}

@app.route('/upload', methods=['POST'])
def upload_image():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        image_file = request.files['image']
        if image_file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        if image_file:
            # Create a unique filename
            filename = f"{uuid.uuid4().hex}_{image_file.filename}"
            image_path = os.path.join('static', filename)
            image_file.save(image_path)

            # Convert image to JPG if necessary
            processor = ImageProcessor()
            if not image_path.lower().endswith('.jpg'):
                result = processor.convert_to_jpg(image_path)
                if isinstance(result, dict) and "error" in result:
                    return jsonify(result), 500
                image_path = result

            # Encode the image
            encoded_result = processor.encode_image(image_path)
            if isinstance(encoded_result, dict) and "error" in encoded_result:
                return jsonify(encoded_result), 500

            # Clean up the file after encoding
            try:
                os.remove(image_path)
            except:
                pass  # Ignore cleanup errors

            return jsonify({
                "success": True,
                "encoded_image": encoded_result
            }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_caption', methods=['POST'])
def get_caption():
    try:
        data = request.json
        if not data or 'encoded_image' not in data:
            return jsonify({"error": "No encoded image provided"}), 400

        encoded_image = data['encoded_image']
        processor = ImageProcessor()

        result = processor.process_image_with_llm(encoded_image)
        if isinstance(result, dict) and "error" in result:
            return jsonify(result), 500

        return jsonify({
            "success": True,
            "caption": result
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

if __name__ == "__main__":
    # Make sure the static folder exists
    os.makedirs('static', exist_ok=True)
    # Run the app
    app.run(host='0.0.0.0', port=5020, debug=True)