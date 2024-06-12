import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
from dotenv import load_dotenv
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.llms import OpenAI
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.prompts import PromptTemplate
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(_name_)
CORS(app)

persist_directory = 'Pdfs/chroma/'
if not os.path.exists(persist_directory):
    os.makedirs(persist_directory)

embedding = OpenAIEmbeddings()
vectordb = Chroma(
    persist_directory=persist_directory,
    embedding_function=embedding
)

@app.route('/upload', methods=['POST'])
def upload_pdfs():
    files = request.files.getlist("files")
    docs = []
    for file in files:
        pdf_reader = PdfReader(file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        docs.append({"text": text, "metadata": {"source": file.filename}})

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1500,
        chunk_overlap=150
    )
    splits = text_splitter.split_documents(docs)

    vectordb.add_texts(texts=[split["text"] for split in splits], metadatas=[split["metadata"] for split in splits])
    vectordb.persist()

    return jsonify({"message": "PDFs uploaded and processed successfully!"}), 200

@app.route('/ask', methods=['POST'])
def ask_question():
    data = request.json
    question = data.get("question")

    retriever = vectordb.as_retriever()
    
    # Custom prompt template to enforce PDF content restriction
    template = """You are a knowledgeable assistant. You are given some documents, and you should only answer based on the information contained in these documents. Do not answer any questions not related to these documents.
    
    Question: {question}
    """
    prompt = PromptTemplate(template=template, input_variables=["question"])
    
    llm = OpenAI(model='gpt-3.5-turbo-instruct', temperature=0)
    
    qa = ConversationalRetrievalChain.from_llm(
        llm,
        retriever=retriever,
        memory=ConversationBufferMemory(memory_key="chat_history", return_messages=True),
        return_source_documents=True,
        chain_type_kwargs={"prompt": prompt}
    )

    result = qa.invoke({"question": question})
    response = result["answer"]

    return jsonify({"answer": response}), 200

if _name_ == "_main_":
    app.run(debug=True)