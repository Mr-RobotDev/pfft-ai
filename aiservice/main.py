# pip install ipywidgets
# pip install openai
from flask import Flask, request, jsonify
import openai as OpenAI
import pandas as pd
from typing import List, Tuple, Optional
from dotenv import load_dotenv
import os, sys
import together
import requests
from flask_cors import CORS

def trim_text(text: str) -> str:
    return ' '.join(text.split())

load_dotenv('.env')

app = Flask(__name__)
OpenAI.api_key = os.environ.get("OPENAI_API_KEY")
client = OpenAI
together.api_key = os.environ.get("TOGETHER_API_KEY")

def jaccard_similarity(s1: set, s2: set) -> float:
    intersection = len(s1.intersection(s2))
    union = len(s1.union(s2))
    return intersection / union if union != 0 else 0

def check_plagiarism(gpt_output: List[str], spreadsheet_data_list: List[str], threshold: float = 0.3) -> List[Tuple[str, str, float]]:
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

def generate_text(prompt: str, model="ft:gpt-3.5-turbo-0613:ai100::855YmvE9", max_tokens: int = 124, temperature: float = 0.77, stop=["#"]) -> str:
    completion = client.chat.completions.create(
        model=model,
        stop=stop,
        messages=[
            {"role": "system", "content": "this AI writes hilarious satirical headlines"},
            {"role": "user", "content": prompt}
        ],
        max_tokens=max_tokens,
        temperature=temperature
    )
    output = completion.choices[0].message['content']
    print(f"Received response from OpenAI: {output}")
    return trim_text(output)

def process_opinion(opinion: str, processing_count: int) -> str:
    mod_value = processing_count % 7
    if mod_value == 0:
        prompt = "<s>[INST] Add very specific, comedically hyperbolic detail to hyperbolically justify the opinion in absurdly extreme way. Output only sentence. OPINION: " + opinion + "\nOUTPUT: [/INST]"
    elif mod_value == 1:
        prompt = "<s>[INST] Add very specific hyperbolic extremely awkward detail to foolishly deny the opinion. Output only one short sentence. OPINION: " + opinion + "\nOUTPUT: [/INST]"
    elif mod_value == 2:
        prompt = "<s>[INST] INSTRUCTIONS: take the opposite of the opinion and justify it hyperbolically and ironically with a hyper-specific detail. Output only one short sentenc. OPINION: " + opinion + "\nOUTPUT: [/INST]"
    elif mod_value == 3:
        prompt = "<s>[INST] Make the opinion funnier (in a late-night comedy club kind of way) in one short sentence. OPINION: " + opinion + "\nOUTPUT: [/INST]"
    elif mod_value == 4:
        prompt = "<s>[INST] Take the opinion and make it rationally justified with a specific persuasive and hilarious example. Output only one short sentence. OPINION: " + opinion + "\nOUTPUT: [/INST]"
    elif mod_value == 5:
        prompt = "<s>[INST] Give a relatable example of the opinion. Output only one short sentence. OPINION: " + opinion + "\nOUTPUT: [/INST]"
    elif mod_value == 6:
        prompt = "<s>[INST] Add extreme detail to the opinion and include no punctuation. Output only one short sentence. OPINION: " + opinion + "\nOUTPUT: [/INST]"

    url = "https://api.together.xyz/inference"
    payload = {
        "model": "mistralai/Mistral-7B-Instruct-v0.1",
        "prompt": prompt,
        "max_tokens": 140,
        "stop": ["##","[/INST]","</s>","###","#"],
        "temperature": 0.8,
        "top_p": 0.7,
        "top_k": 50,
        "repetition_penalty": 1
    }
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "Authorization": f"Bearer {together.api_key}"
    }

    try:
        print(f"Sending prompt to together.ai: {payload}")
        response = requests.post(url, json=payload, headers=headers)
        print(f"Received response from together.ai: {response.json()}")  
        response.raise_for_status()  # This will raise an HTTPError if the HTTP request returned an unsuccessful status code.
    
        # Assuming the API returns a JSON response
        response_json = response.json()
    
        # Checking if 'output' and 'choices' keys are present and structured as expected
        if 'output' in response_json and 'choices' in response_json['output'] and len(response_json['output']['choices']) > 0:
            processed_opinion = trim_text(response_json['output']['choices'][0]['text'].strip())
        else:
            print("Unexpected response format or 'choices' not in response.")
            return "", {"error": "Unexpected response format or 'choices' not in response."}

    
        # Return both the processed opinion and the entire response.
        return processed_opinion, response_json  # Returns a tuple with the string and the response JSON
    
    except requests.exceptions.HTTPError as http_err:
        # Handle HTTP errors (e.g., response code 4xx, 5xx)
        print(f"HTTP error occurred: {http_err}")
        return "", {"error": str(http_err), "status_code": response.status_code}  # Returns an empty string and the error information
    
    except Exception as err:
        # Handle other possible errors (e.g., network issues)
        print(f"An error occurred: {err}")
        return "", {"error": str(err)}  # Returns an empty string and the error information


def check_and_retry(prompt: str, model="ft:gpt-3.5-turbo-0613:ai100::855YmvE9", temperature: float = 0.75, stop=["#"]) -> str:
    completion = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": "this AI writes hilarious satirical headlines"},
            {"role": "user", "content": prompt}
        ],
        stop=stop,
        max_tokens=120,
        temperature=temperature
    )
    output = completion.choices[0].message.content
    output = trim_text(output)
    plagiarism_results = check_plagiarism([output], spreadsheet_data)
    
    if not plagiarism_results:
        return output
    else:
        # Retry generation with the same prompt
        completion = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=120,
            temperature=temperature
        )
        output = completion.choices[0].message['content']
        output = trim_text(output)
        plagiarism_results = check_plagiarism([output], spreadsheet_data)
        
        if not plagiarism_results:
            return output
    
    return None



def moderate_content(text: str) -> Tuple[bool, dict]:
    response = client.moderations.create(input=text)
    output = response.results[0]
    flagged = output.flagged
    return flagged, output

# Load spreadsheet data
df = pd.read_csv("checker.csv", encoding='utf-8', delimiter='\t')
spreadsheet_data = df["text"].tolist()

# Load blocked words
df_blocked_words = pd.read_csv("blocked_words.csv", encoding='utf-8', delimiter='\t')
blocked_words = df_blocked_words["word"].tolist()

# Project Routes
@app.route("/")
def home():
    return jsonify({'status': True}), 200

@app.route('/generate_article', methods=['POST'])
def generate_article():
    try:
        request_data = request.get_json()
        if 'headline' not in request_data:
            return jsonify({'error': 'Invalid request. headline is missing.'}), 400

        headline = request_data['headline']

        prompt = f"{headline} ###Add Article:"

        completion = client.chat.completions.create(
            model="ft:gpt-3.5-turbo-0613:ai100::855YmvE9",
            messages=[
                {"role": "system", "content": "this AI writes hilarious satirical headlines"},
                {"role": "user", "content": prompt}
            ],
            max_tokens=1024,
            temperature=0.7,
            stop=["!Article"]
        )

        if completion.choices and len(completion.choices) > 0:
            article = trim_text(completion.choices[0].message.content.strip())
            return jsonify({'status': True, 'article': article}), 200
        else:
            return jsonify({'error': 'Article generation failed. No output from OpenAI.'}), 500
    except Exception as err:
        print(f"An error occurred: {err}")
        return jsonify({'error': str(err)}), 500

        

    except Exception as err:
        print(f"An error occurred: {err}")
        return jsonify({'error': str(err)}), 500


@app.route('/generate_headline', methods=['POST'])
def generate_headline():
    try:
        request_data = request.get_json()
        if 'opinion' not in request_data:
            return jsonify({'error': 'Invalid request. opinion is missing.'}), 400

        opinion = request_data['opinion']
        
        # New step to process the opinion with Prompt A or B
        processed_opinion = process_opinion(opinion, 1)
        final_outputs = []

        for i in range(7):
            processed_opinion, _ = process_opinion(opinion, i)
            processed_opinion = processed_opinion.lower()
            prompt = f"{processed_opinion} ->"
            result = check_and_retry(prompt, model="ft:gpt-3.5-turbo-0613:ai100::855YmvE9")  # Updated to match new client usage
            print(f"Received headline: {result}")

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
    debug = "--debug" in sys.argv
    app.run(host='localhost', port=105, debug=debug)
