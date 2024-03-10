import pytest
from fastapi.testclient import TestClient
from main import app
import os
 
@pytest.fixture(scope="module")
def test_app():
    client = TestClient(app)
    yield client
 
def test_upload_pdf(test_app):
    # Open a valid PDF file
    pdf_path = "covid-details.pdf"
    with open(pdf_path, "rb") as file:
        # Send a POST request with the PDF file
        response = test_app.post("/upload_pdf/", files={'file': file})
        # Check if the response indicates successful PDF file upload
        assert response.status_code == 200
        assert response.json() == {"message": "File uploaded successfully"}
 
if __name__ == "__main__":
    pytest.main([__file__])
