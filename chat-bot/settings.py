from RAG import skill
import os

os.environ["OPENAI_API_KEY"] = ""

rag = skill.RAGSkill()

mode = "DEBUG"

if mode == "DEBUG":
    import langchain

    langchain.DEBUG = True
