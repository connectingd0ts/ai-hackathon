from openai import OpenAI
from docx import Document
import docx

def extract_text_from_docx(file_path):
    doc = docx.Document(file_path)
    text = []
    for paragraph in doc.paragraphs:
        text.append(paragraph.text)
    return '\n'.join(text)

def write_to_file(text, file_path):
    with open(file_path, 'w') as file:
        file.write(text)




api_key = ''
client = OpenAI(
    # defaults to os.environ.get("OPENAI_API_KEY")
    api_key=api_key
)

def abstract_summary_extraction(transcription):
    response = client.chat.completions.create(
        model="gpt-4",
        temperature=0,
        messages=[
            {
                "role": "system",
                "content": "You are a highly skilled AI trained in language comprehension and summarization. I would like you to read the following text and summarize it into a concise abstract paragraph. Aim to retain the most important points, providing a coherent and readable summary that could help a person understand the main points of the discussion without needing to read the entire text. Please avoid unnecessary details or tangential points."
            },
            {
                "role": "user",
                "content": transcription
            }
        ]
    )
    # print(response)
    return response.choices[0].message.content

def convert_to_summary(transcript):
  x = len(transcript)//4096
  summ  = []
  i = 0
  while i < x:
    start = i*4096
    end = (i+1)*4096
    text = abstract_summary_extraction(transcript[start:end])
    summ.append(text)
    i+=1
  return ''.join(summ)

def get_mom(transcript):
  while len(transcript)>4096:
      transcript = convert_to_summary(transcript)
  return transcript


def generate_mom(summary,date,location,prepared_by):
    response = client.chat.completions.create(
        model="gpt-4",
        temperature=0,
        messages=[
            {
                "role": "system",
                "content": f"Generate Minutes of meeting where Location is {location} , Date is {date} and prepared by {prepared_by}:"
            },
            {
                "role": "user",
                "content": summary
            }
        ]
    )
    return response.choices[0].message.content

