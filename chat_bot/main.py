"""
This file contains the code for the API endpoints for the file upload and query.
"""

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import settings
import uvicorn
import warnings

warnings.filterwarnings("ignore")


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/upload_pdf")
async def read_pdf_file(file: UploadFile = File(...)):
    """
    This endpoint is used to upload a file to the database.

    Parameters:
    file (UploadFile): The file to be uploaded

    Returns:
    JSONResponse: A JSON response with a message indicating that the file was uploaded successfully
    """
    settings.rag.store_pdf_data(file)
    print(f"File uploaded successfully")
    return JSONResponse(
        content={"message": "File uploaded successfully"}, status_code=200
    )


@app.post("/query")
async def query_pdf_file(query: str):
    """
    This endpoint is used to query the database for a given string.

    Parameters:
    query (str): The string to be searched for

    Returns:
    JSONResponse: A JSON response with the result of the search
    """
    result = settings.rag.query_db(query)
    return JSONResponse(content={"message": result}, status_code=200)
    


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
