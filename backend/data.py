from deepgram import DeepgramClient
from dotenv import load_dotenv
from os import environ
import easyocr
import numpy as np
import cv2
from pypdf import PdfReader
from io import BytesIO

from .rag import RAG

load_dotenv()

class data:
    @classmethod
    def data_pick_file(cls, file_content_type, contents, active_chat):
        if file_content_type == 'image/jpeg' or file_content_type == 'image/png':
            return cls.image_data(contents=contents, active_chat=active_chat)
        elif file_content_type == 'video/mp4' or file_content_type == 'audio/mpeg' or file_content_type == 'audio/wav':
            return cls.audio_data(contents=contents, active_chat=active_chat)
        elif file_content_type == 'application/pdf':
            return cls.pdf_data(contents=contents, active_chat=active_chat)
        else:
            return "File type not supported"

        return "none"

    @classmethod
    def audio_data(cls, contents, active_chat):
        client = DeepgramClient(api_key=environ["DEEPGRAM_API_KEY"])

        response = client.listen.v1.media.transcribe_file(
            request=contents,
            model="nova-3",
            diarize=True
        )

        result = response.results.channels[0].alternatives[0].transcript

        RAG.add_data(docs=result, collection_name=active_chat)

        return(result)

    @classmethod
    def image_data(cls, contents, active_chat):
        reader = easyocr.Reader(['en','lt'])

        np_arr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if image is None:
            return {"error": "Invalid image"}


        result = reader.readtext(image, detail=0)
        full_text = " ".join(result)

        RAG.add_data(docs=full_text, collection_name=active_chat)

        return(full_text)
    
    @classmethod
    def pdf_data(cls, contents, active_chat):
        reader = PdfReader(BytesIO(contents))
        result = ""

        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                result += page_text + "\n"

        RAG.add_data(docs=result, collection_name=active_chat)

        return(result)

    @classmethod
    def change_object_to_basemessage(cls, messages):
        ideal_array = []
        for message in messages:
            ideal_array.append((message["sender"].lower(), message["text"]))
        
        return ideal_array
    
    @classmethod
    def normalize_collection_name(cls, collention_name):
        return collention_name.replace(" ", "_")