## To run the application
1) Clone the repo
2) Add your openai and deepgram api keys to the .env file
3) Make sure you install uv and vite. Have python, npm and pip on your computer.
4) npm install (in frontend folder)
5) uv sync (in backend folder)
6) In the 1 terminal (in backend folder): uv run fastapi dev main.py
7) In the 2 terminal (in frontend folder): npm run dev

## Technologies used
1) Frontend: React / vite
2) Backend: Fastapi
3) LLM: langgraph
4) Database: chromadb

## About the agent
I specifically designed the agent for my needs (image and video context processing) and it is still a work in progress. The main functionality now: conversation history, RAG storage, getting context from video and audio files, text transcription from images. There is no knowledge base, you add it through the add context button below the search bar to the specific chat selected.

Due to time shortages I didn't implement everything I wanted and will still be upgrading this project for the next assignment to add agent learning, selectable LLM models, similarity search optimisation, error handling, responsive UI design, tool calls and dockerization. Currently I mostly focused on the frontend and UI.