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

def generate_text(prompt: str, engine="davinci:ft-ai100-2023-06-03-18-54-09", max_tokens: int = 74, stop: Optional[str] = None, temperature: float = 0.7) -> str:
    response = openai.Completion.create(
        engine=engine,
        prompt=prompt + " ->",
        temperature=temperature,
        max_tokens=max_tokens,
        n=1,
        stop=stop,
        timeout=30,
    )
    return response.choices[0].text.strip()

def process_opinion(opinion: str, processing_count: int) -> str:
    mod_value = processing_count % 7
    if mod_value == 0:
        prompt = "INSTRUCTIONS: take the opposite of the opinion and justify it hyperbolically ironically with a specific detail or two in one short sentence with no punctuation, then say nothing else. Output one SHORT sentence, then add: ###. OPINION: " + opinion + "\nOUTPUT:"
    elif mod_value == 1:
        prompt = "INSTRUCTIONS: take the opinion and justify it hyperbolically ironically with a specific detail or two in one short sentence with no punctuation, then say nothing else. Output one short sentence, then add: ###. OPINION: " + opinion + "\nOUTPUT:"
    elif mod_value == 2:
        prompt = "INSTRUCTIONS: take the opposite of the opinion and justify it hyperbolically ironically with a specific detail or two in one short sentence with no punctuation, then say nothing else. Output one short sentence, then add ###. OPINION: " + opinion + "\nOUTPUT:"
    elif mod_value == 3:
        prompt = "INSTRUCTIONS: take the opinion and justify it hyperbolically ironically with a specific detail or two in one short sentence with no punctuation, then say nothing else. Output one SHORT sentence, then add ###. OPINION: " + opinion + "\nOUTPUT:"
    elif mod_value == 4:
        prompt = "Repeat the opinion exactly, then add ###. OPINION: " + opinion + "\nOUTPUT:"
    elif mod_value == 5:
        prompt = "Add very specific detail to the opinion. Output one sentence, then add: ###. OPINION: " + opinion + "\nOUTPUT:"
    elif mod_value == 6:
        prompt = "Repeat the opinion exactly, then add ###. OPINION: " + opinion + "\nOUTPUT:"

    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=prompt,
        temperature=0.8,
        max_tokens=60,
        stop=["###"]
    )

    processed_opinion = response.choices[0].text.strip()
    return processed_opinion
    
def check_and_retry(prompt: str, engine="davinci:ft-ai100-2023-06-03-18-54-09") -> str:
    output = generate_text(prompt, engine=engine, stop="###")
    plagiarism_results = check_plagiarism([output], spreadsheet_data)
    if not plagiarism_results:
        return output
    else:
        output = generate_text(prompt, engine=engine, stop="###")
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

        opinion = request_data['opinion']
        headline = request_data['headline']
        
        # New step to process the opinion with Prompt A or B
        processed_opinion = process_opinion(opinion, 1)  # Adjust the count as needed
        new_prompt = f"The following is a professional satire writing tool created by the greatest satirical headline writer of all time. It hides an idea or opinion in a satirical news headline by passing this idea or opinion through one or more humor filters such as irony, exaggeration, wordplay, reversal, shock, hyperbole, incongruity, meta humor, benign violation, madcap, unexpected endings, character, reference, brevity, parody, rhythm, analogy, and/or misplaced focus and outputs a hilarious satirical headline. Begin: {processed_opinion} -> {headline} ###Add Article:"
    
        # Generate the article
        new_result = generate_text(new_prompt, engine="davinci:ft-ai100-2023-05-22-06-41-36", max_tokens=400, stop=["!Article Complete","!E","###"])

        flagged, moderation_output = moderate_content(new_result)
    
        if not flagged:
            print(f"\nGenerated article:")
            print("jh" , new_result)
        else:
            # Rerun the article generation if it's flagged
            new_result = generate_text(new_prompt, engine="davinci:ft-ai100-2023-05-22-06-41-36", max_tokens=400, stop=["!Article Complete","!E","###"])
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
        prompt = f"{processed_opinion} ->"

        final_outputs = []

        for i in range(7):
            processed_opinion = process_opinion(opinion, i)
            processed_opinion = processed_opinion.lower()  # Convert to lowercase
            prompt = f"{processed_opinion} ->"
            result = check_and_retry(prompt, engine="davinci:ft-ai100-2023-06-03-18-54-09")
            # rest of the code

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
