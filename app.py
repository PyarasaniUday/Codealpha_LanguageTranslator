from flask import Flask, render_template, request, jsonify
from deep_translator import GoogleTranslator

app = Flask(__name__)

# Fetch supported languages from deep-translator
try:
    LANGUAGES = GoogleTranslator().get_supported_languages(as_dict=True)
except Exception:
    # Fallback in case of API issues on startup
    LANGUAGES = {'english': 'en', 'spanish': 'es', 'french': 'fr', 'german': 'de', 'hindi': 'hi', 'telugu': 'te'}

@app.route('/')
def index():
    """Render the homepage with the translation UI."""
    # Sort languages alphabetically by name for better UI
    sorted_langs = dict(sorted(LANGUAGES.items()))
    return render_template('index.html', languages=sorted_langs)

@app.route('/translate', methods=['POST'])
def translate():
    """Handle translation requests via API."""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Invalid JSON payload'}), 400
            
        text = data.get('text', '').strip()
        source = data.get('source', 'auto')
        target = data.get('target', 'en')

        # Error Handling: Empty text
        if not text:
            return jsonify({'error': 'Please enter some text to translate.'}), 400
        
        # Error Handling: Same language
        if source == target and source != 'auto':
            return jsonify({'error': 'Source and target languages cannot be the same.'}), 400

        # Perform Translation
        translator = GoogleTranslator(source=source, target=target)
        translated_text = translator.translate(text)

        return jsonify({'translated_text': translated_text}), 200
        
    except Exception as e:
        # Error Handling: API/Network errors
        return jsonify({'error': f'Translation failed: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)