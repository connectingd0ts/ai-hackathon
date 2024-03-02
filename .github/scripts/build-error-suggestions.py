# This script takes in a build log file, sends it to openai to generates suggestions based on any build errors.
import sys
import os
from openai import OpenAI

client = OpenAI()

# this function parses the log file and returns the content
def parse_log(file):
    with open(file, 'r') as f:
        return f.read()

# this function send the log contents to open ai chatgpt for build error suggestions
def get_error_suggestions(log):

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful coding assistant."},
            {"role": "user", "content": f"Check the following log contents for any error. If there are any errors, generate a suggestion, else, respond with \"Looks good.\":\n{log}"}
        ],
        max_tokens=300,
        temperature=0.7
    )

    return response.choices[0].message.content

if __name__ == "__main__":        
    filename = sys.argv[1]
    log = parse_log(filename)
    print(get_error_suggestions(log))

