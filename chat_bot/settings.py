from RAG import skill
import os, json

json_file = open("config.json")
config = json.load(json_file)
os.environ["OPENAI_API_KEY"] = config['OPENAI_API_KEY']


rag = skill.RAGSkill()

mode = "DEBUG"

if mode == "DEBUG":
    import langchain
    langchain.DEBUG = True
