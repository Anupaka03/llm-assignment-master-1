from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any

# Importing other packages required for the program
import os
import llama_index
import aiofiles
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, Settings
from llama_index.embeddings.gradient import GradientEmbedding
from llama_index.llms.gradient import GradientBaseModelLLM

# Load environment variables from .env file (if any)
load_dotenv()

class Response(BaseModel):
    result: str | None

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000"
]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def save_file_locally(uploaded_file,filename):

    # Specify the directory where you want to save the file
    # Created a Documents directory to store the uploaded file locally
    save_directory = 'Documents/'
    
    # Full path where the file will be saved
    save_path = save_directory + filename
    
    # Opening the file in binary mode and writing the uploaded file's contents
    async with aiofiles.open(save_path, 'wb') as f:
        await f.write(uploaded_file)

@app.post("/predict", response_model=Response)
async def predict(request: Request) -> Any:

    # Access the input file and question from the request
    form_data = await request.form()
    uploaded_file = await form_data["file"].read()
    filename = form_data["file"].filename
    question = form_data["question"]

    # Call the function to save the file locally
    await save_file_locally(uploaded_file, filename)

    # Initializing the LLM (Large Language Model) with specified parameters
    llm = GradientBaseModelLLM(
        base_model_slug = "llama2-7b-chat",
        max_tokens = 400,
    )

    # Initializing the embedding model for text embeddings
    # It requires access token and workspace ID for authentication
    embed_model = GradientEmbedding(
        gradient_access_token = os.getenv('GRADIENT_ACCESS_TOKEN'),
        gradient_workspace_id = os.getenv('GRADIENT_WORKSPACE_ID'),
        gradient_model_slug = "bge-large",
    )

    # Creating a service context for indexing operations
    service_context = llama_index.core.indices.service_context.ServiceContext.from_defaults(
        llm = llm,
        embed_model = embed_model,
        chunk_size = 256,
    )

    # Setting the initialized LLM, embedding model, and chunk size in the Settings
    Settings.llm = llm
    Settings.embed_model = embed_model
    Settings.chunk_size = 256

    # SimpleDirectoryReader can read various file types treating them as text
    documents = SimpleDirectoryReader("Documents").load_data()
    index = VectorStoreIndex.from_documents(documents, service_context = service_context)
    query_engine = index.as_query_engine()

    # Execute the query
    response = str(query_engine.query(question))

    # Deleting the file locally saved after we get the response
    filepath = 'Documents/' + filename
    os.remove(filepath)

    return {"result": response}
