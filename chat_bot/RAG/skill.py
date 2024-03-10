from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain.prompts import PromptTemplate
from .model import load_embedding_model, load_model
from .prompt import template
import os
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from langchain.chains import RetrievalQA


class RAGSkill:
    """
    A class for RAG-based question answering.
    Attributes:
        llm (torch.Module): The language model for the
        db (faiss.Index): The FAISS index containing the document embeddings.
        embeddings (torch.Tensor): The document embeddings.
        prompts (PromptTemplate): The prompt template for the question generation.
    """

    def __init__(self):
        self.llm = load_model()
        self.db = None
        self.embeddings = load_embedding_model()
        self.prompts = PromptTemplate.from_template(template)

    
    def text_to_pdf(self, filename, file_content):
        filename = filename.split(".txt")[0]+".pdf"
        # Create a canvas object
        c = canvas.Canvas(filename, pagesize=letter)
        # Set font and size
        c.setFont("Helvetica", 12)
        # Write text to the PDF
        c.drawString(100, 750, file_content)
        # Save the PDF
        c.save()
        print("PDF saved to", filename)


    def store_pdf_data(self, file):
        """
        Store the document data in an FAISS index.
        Args:
            file (File): The uploaded file.
        Returns:
            faiss.Index: The FAISS index containing the document embeddings.
        """
        temp_dir = "Data"
        file_path = os.path.join(temp_dir, file.filename)
        print(file_path)
        with open(file_path, "wb") as f:
            f.write(file.file.read())
        pdfLoader = PyPDFLoader(file_path)
        document = pdfLoader.load()

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000, chunk_overlap=150
        )
        docs = text_splitter.split_documents(document)
        db = FAISS.from_documents(docs, self.embeddings)
        print("FAISS index created")
        self.db = db

    def query_db(self, query):
        """
        Query the FAISS index for the provided query.
        Args:
            query (str): The query text.
        Returns:
            list: A list of answers.
        """
        retriver_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=self.db.as_retriever(),
            chain_type_kwargs={"prompt": self.prompts},
        )
        result = retriver_chain({"query": query})
        return result