# pip install openai
from flask import Flask, request, jsonify
import openai
import pandas as pd
from typing import List, Tuple, Optional
from dotenv import load_dotenv
	@@ -18,75 +17,52 @@ def jaccard_similarity(s1: set, s2: set) -> float:
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

def generate_text(prompt: str, engine="davinci:ft-ai100-2023-05-21-00-49-49", max_tokens: int = 74, stop: Optional[str] = None, temperature: float = 0.8) -> str:
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


def check_and_retry(prompt: str, engine="davinci:ft-ai100-2023-05-21-00-49-49") -> str:
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
	@@ -113,7 +89,7 @@ def generate_article():
        prompt = request_data['opinion']
        headline = request_data['headline']

        beginning_text = "The following is a professional satire writing tool created by the greatest satirical headline writer of all time. It hides an idea or opinion in a satirical news headline by passing this idea or opinion through one or more humor filters such as irony, exaggeration, wordplay, reversal, shock, hyperbole, incongruity, meta humor, benign violation, madcap, unexpected endings, character, reference, brevity, parody, rhythm, analogy, and/or misplaced focus and outputs a hilarious satirical headline. Begin: "
        ending_text = " ->"
        opinion = beginning_text + prompt + ending_text

	@@ -148,21 +124,20 @@ def generate_article():

@app.route('/generate_headline', methods=['POST'])
def generate_headline():
    try:
        request_data = request.get_json()
        if 'opinion' not in request_data:
            return jsonify({'error': 'Invalid request. opinion is missing.'}), 400

        initial_prompt = request_data['opinion']

        beginning_text = ""
        ending_text = " ->"
        prompt = beginning_text + initial_prompt + ending_text
        final_outputs = []

        for _ in range(7):
            result = check_and_retry(prompt, engine="davinci:ft-ai100-2023-06-03-18-54-09")
            if result:
                flagged, moderation_output = moderate_content(result)
                if not flagged:
	@@ -174,7 +149,6 @@ def generate_headline():
            return jsonify({'status': True, 'headlines': final_outputs ,'prompt':prompt}), 200
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

application = app
