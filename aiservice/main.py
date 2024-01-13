# pip install ipywidgets 
# pip install openai
from flask import Flask, request, jsonify
import openai as OpenAI
import pandas as pd
from typing import List, Tuple, Optional
from dotenv import load_dotenv
import os
import together
import requests

def trim_text(text: str) -> str:
    return ' '.join(text.split())

load_dotenv('.env')

app = Flask(__name__)
client = OpenAI.Client(api_key=os.environ.get("OPENAI_API_KEY"))
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

def generate_text(prompt: str, model="davinci:ft-ai100-2023-06-03-18-54-09", max_tokens: int = 124, stop: Optional[str] = None, temperature: float = 0.7) -> str:
    full_prompt = "This satirical headline writing tool translates an idea or opinion into a satirical news headline by passing this idea or opinion through one or more humor techniques such as irony, exaggeration, wordplay, reversal, shock, hyperbole, incongruity, meta humor, benign violation, madcap, unexpected endings, character, reference, brevity, parody, rhythm, analogy, the rule of 3, and/or misplaced focus and outputs a hilarious satirical headline. Begin: " + prompt + "->"
    
    # Printing the full request details
    request_details = {
        "model": model,
        "prompt": full_prompt,
        "temperature": temperature,
        "max_tokens": max_tokens,
        "n": 1,
        "stop": stop,
        "timeout": 30
    }
    print(f"Sending full request to OpenAI: {request_details}")
    
    response = client.Completion.create(**request_details) 
    print(f"Received response from OpenAI: {response.choices[0].text.strip()}")
    return trim_text(response.choices[0].text.strip())


def process_opinion(opinion: str, processing_count: int) -> str:
    mod_value = processing_count % 7
    if mod_value == 0:
        prompt = "<s>[INST] Add very specific, comedically hyperbolic detail to hyperbolically justify the opinion. Output one long and detailed sentence, then add one space and ###. If the opinion is not in english, you simply output: 'no'. OPINION: " + opinion + "\nOUTPUT: [/INST]"
    elif mod_value == 1:
        prompt = "<s>[INST] Add very specific hyperbolic detail to foolishly deny the opinion. Output one long and detailed sentence, then add one space and ###. If the opinion is not in english, you simply output: 'no'. OPINION: " + opinion + "\nOUTPUT: [/INST]"
    elif mod_value == 2:
        prompt = "<s>[INST] INSTRUCTIONS: take the opposite of the opinion and justify it hyperbolically ironically with a specific detail or two in one detailed sentence, then add one space and ###. If the opinion is not in english, you simply output: 'no'. OPINION: " + opinion + "\nOUTPUT: [/INST]"
    elif mod_value == 3:
        prompt = "<s>[INST] INSTRUCTIONS: take the opposite of the opinion and justify it hyperbolically ironically with a specific detail or two in one detailed sentence, then add one space ###. If the opinion is not in english, you simply output: 'no'. OPINION: " + opinion + "\nOUTPUT: [/INST]"
    elif mod_value == 4:
        prompt = "<s>[INST] Take the opinion and make it rationally justified with a specific persuasive and funny example. Output one long detailed sentence, then add one space and ###. If the opinion is not in english, you simply output: 'no'. OPINION: " + opinion + "\nOUTPUT: [/INST]"
    elif mod_value == 5:
        prompt = "<s>[INST] Repeat the opinion with more detail. Output one detailed sentence, then add one space and ###. If the opinion is not in english, you simply output: 'no'. OPINION: " + opinion + "\nOUTPUT: [/INST]"
    elif mod_value == 6:
        prompt = "<s>[INST] Add extreme detail to the opinion and include no punctuation. Output one detailed sentence, then add one space and ###. If the opinion is not in english, you simply output: 'no'. OPINION: " + opinion + "\nOUTPUT: [/INST]"

    url = "https://api.together.xyz/inference"
    payload = {
        "model": "mistralai/Mistral-7B-Instruct-v0.1",
        "prompt": prompt,
        "max_tokens": 140,
        "stop": ["##","[/INST]","</s>","###","#"],
        "temperature": 0.9,
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


def check_and_retry(prompt: str, model="davinci:ft-ai100-2023-06-03-18-54-09") -> str:
    output = generate_text(prompt, model=model, max_tokens=120, stop=["##","!","<","#"])
    output = trim_text(output)  # Trim the output text
    plagiarism_results = check_plagiarism([output], spreadsheet_data)
    
    if not plagiarism_results:
        return output
    else:
        output = generate_text(prompt, model=model, max_tokens=120, stop=["##","!","<","#"])
        output = trim_text(output)  # Trim the output text again
        plagiarism_results = check_plagiarism([output], spreadsheet_data)
        
        if not plagiarism_results:
            return output
    
    return None


def moderate_content(text: str) -> Tuple[bool, dict]:
    moderation_response = client.Moderation.create(input=text)
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
    return jsonify({'status': True}), 200

@app.route('/generate_article', methods=['POST'])
def generate_article():
    try:
        request_data = request.get_json()
        if 'opinion' not in request_data:
            return jsonify({'error': 'Invalid request. opinion is missing.'}), 400

        if 'headline' not in request_data:
            return jsonify({'error': 'Invalid request. headline is missing.'}), 400

        opinion = request_data['opinion']
        headline = request_data['headline']
        
        # New step to process the opinion with Prompt A or B
        processed_opinion, _ = process_opinion(opinion, 1)  # Unpacking the tuple to get just the text
        new_prompt = f" {processed_opinion} -> {headline} ###Add Article:"
        print(f"Generating with prompt: {new_prompt}")  # Print statement before sending the prompt
    
        # Generate the article
        new_result = generate_text(new_prompt, model="davinci:ft-ai100-2023-10-11-07-16-59", max_tokens=500, stop=["!Article Complete","!E","###","##"])
        print(f"Received article: {new_result}")  # Print statement after receiving the response

        flagged, moderation_output = moderate_content(new_result)
    
        if not flagged:
            print(f"\nGenerated article:")
            print("jh" , new_result)
        else:
            # Rerun the article generation if it's flagged
            new_result = generate_text(new_prompt, model="davinci:ft-ai100-2023-10-11-07-16-59", max_tokens=500, stop=["!Article Complete","!E","###","##"])
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

        opinion = request_data['opinion']
        
        # New step to process the opinion with Prompt A or B
        processed_opinion = process_opinion(opinion, 1)  # Adjust the count as needed
        prompt = f"{processed_opinion} "
        print(f"Generating with prompt: {prompt}")  # Print statement before sending the prompt

        final_outputs = []

        for i in range(7):
            processed_opinion, _ = process_opinion(opinion, i)  # Unpack the tuple to get the string
            processed_opinion = processed_opinion.lower()  # Now it's clear that processed_opinion is a string
            prompt = f"{processed_opinion} ->"
            result = check_and_retry(prompt, model="davinci:ft-ai100-2023-06-03-18-54-09")
            print(f"Received headline: {result}")  # Print statement after receiving the response

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
