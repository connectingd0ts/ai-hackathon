from langchain.embeddings import HuggingFaceEmbeddings
from langchain.llms import OpenAI


def load_embedding_model():
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    return embeddings


def load_model():
    llm = OpenAI(temperature=1.0, top_p=0.95)
    return llm
