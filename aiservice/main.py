# pip install ipywidgets
# pip install openai
from flask import Flask, request, jsonify
import openai
import pandas as pd
from typing import List, Tuple, Optional
from dotenv import load_dotenv
import os

load_dotenv('.env')

app = Flask(__name__)
openai.api_key = os.environ.get("OPENAI_API_KEY")

def jaccard_similarity(s1: set, s2: set) -> float:
    intersection = len(s1.intersection(s2))
    union = len(s1.union(s2))
    return intersection / union if union != 0 else 0

def check_plagiarism(gpt_output: List[str], spreadsheet_data_list: List[str], threshold: float = 0.1) -> List[Tuple[str, str, float]]:
    results = []
    for output_text in gpt_output:
        output_words = set(output_text.split())
        for data_text in spreadsheet_data_list:
            data_words = set(data_text.split())
            similarity = jaccard_similarity(output_words, data_words)
            if similarity > threshold:
                results.append((data_text, output_text, similarity))
    return results

def contains_blocked_words(text: str, blocked_words_list: List[str]) -> bool:
    for blocked_word in blocked_words_list:
        if blocked_word.lower() in text.lower():
            return True
    return False

def generate_text(prompt: str, max_tokens: int = 74, stop: Optional[str] = None, temperature: float = 0.8) -> str:
    response = openai.Completion.create(
        engine="davinci:ft-ai100-2023-06-03-18-54-09",
        prompt=prompt + " ->",
        temperature=temperature,
        max_tokens=max_tokens,
        n=1,
        stop=stop,
        timeout=30,
    )
    return response.choices[0].text.strip()

    
def check_and_retry(prompt: str) -> str:
    output = generate_text(prompt, stop="###")
    plagiarism_results = check_plagiarism([output], spreadsheet_data)
    if not plagiarism_results:
        return output
    else:
        output = generate_text(prompt, stop="###")
        plagiarism_results = check_plagiarism([output], spreadsheet_data)
        if not plagiarism_results:
            return output
    return None

def moderate_content(text: str) -> Tuple[bool, dict]:
    moderation_response = openai.Moderation.create(input=text)
    output = moderation_response["results"][0]
    flagged = output.get("flagged")
    return flagged, output

# Load spreadsheet data
df = pd.read_csv("checker.csv", encoding='utf-8', delimiter='\t')
spreadsheet_data = df["text"].tolist()

# Load blocked words
df_blocked_words = pd.read_csv("blocked_words.csv", encoding='utf-8', delimiter='\t')
blocked_words = df_blocked_words["word"].tolist()

@app.route("/")
def home():
    return "Hello PFFT"

@app.route('/generate_article', methods=['POST'])
def generate_article():
    try:
        request_data = request.get_json()
        if 'opinion' not in request_data:
            return jsonify({'error': 'Invalid request. opinion is missing.'}), 400
        if 'headline' not in request_data:
            return jsonify({'error': 'Invalid request. headline is missing.'}), 400

        prompt = request_data['opinion']
        headline = request_data['headline']
        
        beginning_text = ""
        ending_text = " ->"
        opinion = beginning_text + prompt + ending_text
        
        print(f"Selected output:")
        new_prompt = f"{opinion} {headline} ###Add Article:"
    
        # Generate the article
        new_result = generate_text(new_prompt, max_tokens=400, stop=["!Article Complete","!E","###"])
        flagged, moderation_output = moderate_content(new_result)
    
        if not flagged:
            print(f"\nGenerated article:")
            print("jh" , new_result)
        else:
            # Rerun the article generation if it's flagged
            new_result = generate_text(new_prompt, max_tokens=400, stop=["!Article Complete","!E","###"])
            flagged, moderation_output = moderate_content(new_result)
            if not flagged:
                print(f"\nArticle Generated")
                print("jh" , new_result)
            else:
                print(f"\nThe final article output has been flagged by the moderation model twice. Please try again or use a different prompt.")

                         
        if not new_result:
            return jsonify({'status': True,'article': new_result, 'prompt':new_prompt}), 400
        else:
            return jsonify({'status': True,'article': new_result, 'prompt':new_prompt}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/generate_headline', methods=['POST'])
def generate_headline():
    try:
        request_data = request.get_json()
        if 'opinion' not in request_data:
            return jsonify({'error': 'Invalid request. opinion is missing.'}), 400

        initial_prompt = request_data['opinion']
        
        beginning_text = " "
        ending_text = " ->"
        prompt = beginning_text + initial_prompt + ending_text
        final_outputs = []

        for _ in range(8):
            result = check_and_retry(prompt)
            if result:
                flagged, moderation_output = moderate_content(result)
                if not flagged:
                    if not contains_blocked_words(result, blocked_words):
                        final_outputs.append(result)              
        if not final_outputs:
            return jsonify({'status': True, 'headlines': final_outputs, 'prompt':prompt}), 400
        else:
            return jsonify({'status': True, 'headlines': final_outputs ,'prompt':prompt}), 200
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

application = app

if __name__ == '__main__':
    
    app.run(host='localhost', port=105)
