from RAG import skill
import os

os.environ["OPENAI_API_KEY"] = "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"

rag = skill.RAGSkill()

mode = "DEBUG"

if mode == "DEBUG":
    import langchain

    langchain.DEBUG = True
