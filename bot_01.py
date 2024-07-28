import os
import nest_asyncio
import logging
import openai
import streamlit as st
from phi.assistant import Assistant
from phi.llm.openai import OpenAIChat
from phi.tools.duckduckgo import DuckDuckGo

# Set up logger
logger = logging.getLogger(__name__)

# Function to set up the Assistant
def setup_assistant(api_key: str) -> Assistant:
    openai.api_key = api_key
    llm_model = os.getenv("OPENAI_Key", "gpt-4")
    llm = OpenAIChat(model=llm_model, api_key=api_key)
    return Assistant(
        name="web_search_assistant",
        llm=llm,
        description="You are AI search engine",
        instructions=[
            "xxxxxxxx",
        ],
        show_tool_calls=False,
        search_knowledge=False,
        read_chat_history=True,
        tools=[DuckDuckGo()],
        markdown=True,
        add_chat_history_to_messages=True,
        add_datetime_to_instructions=True,
        debug_mode=True,
    )

# Function to run a query with the Assistant
def query_assistant(assistant: Assistant, question: str):
    response = ""
    for delta in assistant.run(question):
        response += delta 
    filtered_response = "\n".join(
        line for line in response.split("\n")
        if not line.startswith("Running:") and not line.startswith(question) and line.strip()
    )
    return filtered_response.strip()

# Streamlit UI
st.title("AI Chat with GRAB GAMAN")

openai_access_token = st.text_input("Your Key", type="password")

if openai_access_token:
    st.subheader("The Place for You to Ask Us About Small Medium Enterprises and Export-Import")

    # Initialize Assistant
    nest_asyncio.apply()
    assistant = setup_assistant(openai_access_token)

    if "messages" not in st.session_state:
        st.session_state["messages"] = []

    user_input = st.text_input("Enter your question:")
    
    if user_input:
        #st.session_state.messages.append({"role": "user", "content": user_input})
        response = query_assistant(assistant, user_input)
        st.session_state.messages.append({"role": "assistant", "content": response})

    for msg in st.session_state["messages"]:
        st.write(f"{msg['content']}")

else:
    st.write("Insert Your Key to start chatting.")
