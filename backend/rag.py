from uuid import uuid4
from dotenv import load_dotenv

from langchain_community.document_loaders import WebBaseLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_openai import OpenAIEmbeddings
from langchain_classic.tools.retriever import create_retriever_tool
from langchain_chroma import Chroma


load_dotenv()

class RAG:
    embeddings = OpenAIEmbeddings(model="text-embedding-3-large")

    @classmethod
    def setup(cls, collection_name):
        """Setup chromadb"""
        return Chroma(
            collection_name=collection_name,
            embedding_function=cls.embeddings,
            persist_directory="./chroma_langchain_db",
        )

    @classmethod
    def add_data(cls, docs, collection_name):
        """Gets data and proccesses it. Stores data as vectors in ChromaDB"""             
        # Fine tune the chunk_size and overlap
        vector_store = cls.setup(collection_name)

        text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
            chunk_size=100, chunk_overlap=50
        )
        doc_splits = text_splitter.split_text(docs)

        uuids = [str(uuid4()) for _ in range(len(doc_splits))]

        vector_store.add_texts(texts=doc_splits, ids=uuids)

    @classmethod
    def similarity_search(cls, search_prompt, collection_name):
        """Uses similarity search in the database"""
        vector_store = cls.setup(collection_name)
        
        results = vector_store.similarity_search(
            search_prompt,
            k=1,
        )

        return results
    
    @classmethod
    def delete_collection(cls, collection_name):
        """Deletes the vector store"""
        vector_store = cls.setup(collection_name)

        vector_store.delete_collection()