# This script takes in a build log file, sends it to openai to generates suggestions based on any build errors.
import sys
import os
import openai

openai.api_key = os.getenv('OPEN_AI_KEY')

# this function parses the log file and returns the content
def parse_log(file):
    with open(file, 'r') as f:
        return f.read()

# this function send the log contents to open ai chatgpt for build error suggestions
def get_error_suggestions(log):
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=f"Check the following log contents for any error. If there are any errors, generate a suggestion, else, respond with \"Looks good.\":\n{log}\nSuggestion: ",
        max_tokens=300,
        n=1,  # number of completions to retrieve
        stop=None,
        temperature=0.7,
        top_p=0.95)

    return response['choices'][0]['text'].strip()

if __name__ == "__main__":        
    filename = sys.argv[1]
    log = parse_log(filename)
    print(get_error_suggestions(log))

