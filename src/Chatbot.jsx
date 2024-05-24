import axios from "axios";
import "./dot.css";
import React, { useState } from "react";
import ReactSyntaxHighlighter from "react-syntax-highlighter";
import {
    androidstudio,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
function divideText(text) {
    // Find the first occurrence of ```
    let firstSplitIndex = text.indexOf("```");

    // If there is no ``` in the text, return the whole text as the first part
    if (firstSplitIndex === -1) {
        return [text, "", "", ""];
    }

    // Find the last occurrence of ```
    let lastSplitIndex = text.lastIndexOf("```");

    // If the first and last occurrence are the same, it means there's only one ```
    if (firstSplitIndex === lastSplitIndex) {
        return [text, "", "", ""];
    }

    // Divide the text into three parts
    let firstPart = text.substring(0, firstSplitIndex);
    let middlePart = text.substring(firstSplitIndex + 3, lastSplitIndex);
    let thirdPart = text.substring(lastSplitIndex + 3);
    let spaceIndex = middlePart.indexOf("\n");

    // Use slice to split the text into two parts
    let fourthPart = middlePart.slice(0, spaceIndex);
    middlePart = middlePart.slice(spaceIndex);

    return [firstPart, middlePart.trim(), thirdPart, fourthPart];
}

function Chatbot() {
    const [chat, setChat] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    async function getResponse(e) {
        e.preventDefault();

        // Construct the new user message
        const newUserMessage = {
            role: "user",
            content: userInput,
        };

        // Update the chat state with the new user message
        setChat((prevChat) => {
            const updatedChat = [...prevChat, newUserMessage];

            // Use updatedChat to ensure the request body has the latest state
            sendMessageToServer(updatedChat);

            return updatedChat;
        });

        // Clear the user input field
        setUserInput("");
    }

    // Function to handle sending the chat to the server
    async function sendMessageToServer(chat) {
        setIsLoading(true);
        try {
            const response = await axios.post("https://freebot-server.vercel.app/", {
                headers: {
                    "x-api-key":
                        "pleasedontuseit-iwillnotbeableto-keepitfreethisway",
                },
                body: chat,
            });
            if (response.status === 200) {
                // Add the assistant's response to the chat
                setChat((prevChat) => [
                    ...prevChat,
                    { role: "assistant", content: response.data.chat_response },
                ]);
            } else {
                setChat((prevChat) => [
                    ...prevChat,
                    { role: "assistant", content: response.data },
                ]);
            }
        } catch (error) {
            console.error("Error fetching response:", error);
            // Optionally, you can handle the error by updating the chat or showing a message to the user
        }
        setIsLoading(false);
    }
    return (
        <div className="w-full relative shadow-lg shadow-black/30 sm:w-[320px] flex flex-col overflow-hidden h-screen  sm:h-[480px] bg-[#ffd60a] sm:rounded-lg">
            <div className="w-full font-bold shadow-lg overflow-hidden   shadow-black/10 z-10 bg-[#ffc300] p-3 px-4 flex gap-2 items-center text-xl">
                {" "}
                <img src="bee.svg" alt="Bee" className="h-[20px] " />
                FreeBot
                {chat.length > 0 && (
                    <button
                        onClick={() => {
                            setChat([]);
                        }}
                        className="ml-auto text-sm bg-[#00509d] text-white p-[5px] px-2 rounded-md font-normal hover:bg-[#1f4160] active:bg-[#091621] "
                    >
                        Clear
                    </button>
                )}
            </div>
            <div className="h-full w-full bg-[#ffd60a] overflow-hidden flex pb-[48px] flex-col justify-end px-2">
                {chat.length == 0 ? (
                    <div className="flex h-full w-full justify-center gap-2 items-center text-center font-bold">
                        <img src="bee.svg" alt="BEE" className="h-[60px]" />
                        <p>
                            Start Your Free
                            <br /> Conversation Now!
                        </p>
                    </div>
                ) : (
                    <div
                        id="chat-box"
                        className="overflow-auto w-full h-full px-2 flex flex-col"
                    >
                        {chat.map((msg, index) => {
                            return (
                                <div
                                    key={index}
                                    className={`${
                                        msg.role == "assistant"
                                            ? "bg-[#ffc300] self-start rounded-tl-none"
                                            : "bg-[#00509d] text-white self-end rounded-tr-none"
                                    } p-2 px-4 rounded-lg max-w-[80%] text-sm my-2`}
                                >
                                    {msg.content.split("```").length > 1 &&
                                    msg.role == "assistant" ? (
                                        <div>
                                            {divideText(msg.content)[0]}
                                            <ReactSyntaxHighlighter
                                                style={androidstudio}
                                                className={"rounded-lg my-2"}
                                                language={
                                                    divideText(msg.content)[3]
                                                }
                                                wrapLines={false}
                                            >
                                                {divideText(msg.content)[1]}
                                            </ReactSyntaxHighlighter>
                                            {divideText(msg.content)[2]}
                                        </div>
                                    ) : (
                                        msg.content
                                    )}
                                </div>
                            );
                        })}
                        {isLoading && (
                            <div
                                id="loadin-boxes"
                                className={
                                    "bg-[#ffc300] overflow-hidden self-start rounded-tl-none p-4 px-8  rounded-lg flex justify-center items-center text-sm my-2"
                                }
                            >
                                <div className="dot-typing"></div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <form
                onSubmit={getResponse}
                className="flex absolute bottom-[4px] left-[4px] w-[calc(100%-8px)] items-center rounded-md h-[45px] overflow-hidden  bg-white"
            >
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    autoComplete="off"
                    data-gramm="false"
                    data-gramm_editor="false"
                    data-enable-grammarly="false"
                    placeholder="Ask a Question..."
                    className="w-full p-1 px-4 h-full outline-none"
                />
                <button
                    type="submit"
                    className="h-[45px] rounded-full w-[50px] flex justify-center items-center object-contain overflow-hidden"
                >
                    <img
                        src="send.svg"
                        alt="Send"
                        className="w-full h-full object-contain p-[10px] cursor-pointer hover:bg-gray-200 active:bg-gray-300"
                    />
                </button>
            </form>
        </div>
    );
}

export default Chatbot;
