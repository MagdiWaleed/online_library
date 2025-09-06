"use client";
import { useState, useRef, useEffect } from "react";
import { Message, SingleMessage } from "./single-message";
import { BaseMessage, HumanMessage } from "@langchain/core/messages";

export const ChatSection = () => {

    const [sessionId, setSessionId] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [inputValue, setInputValue] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const [messages, setMessages] = useState<Message[]>([
    ]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
        }
    }, [inputValue]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    useEffect(() => {
        if (!isLoading && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [isLoading]);
    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            await handleSend();
        }
    };

    const handleSend = async () => {
        if (inputValue.trim() === "") return;
        console.log("********************************************")
        const newUserMessage: Message = {
            role: "user",
            message: inputValue.trim(),
            timestamp: new Date()
        };
        setMessages([...messages, newUserMessage]);
        setInputValue("");
        setIsLoading(true);
        const currentHumanMessage = new HumanMessage(inputValue);
        console.log("id is ", sessionId)
        const res = await fetch("/api/agent", {
            method: "POST",
            body: JSON.stringify({
                message: currentHumanMessage,
            }),
            headers: {
                'x-session-id': sessionId,
                "Content-Type": "application/json",
                "Cache-Control": "no-cache, no-store, must-revalidate",
            },
            cache: "no-store",
        });
        const data = await res.json();

        setSessionId(data.sessionId);

        const aiMessage = data.response;

        const newAiMessage: Message = {
            role: "ai",
            message: aiMessage,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, newAiMessage]);
        setIsLoading(false);



    };
    return (
        <div className="flex flex-col h-[500px] w-[350px] bg-gray-900/50 rounded-2xl overflow-hidden shadow-lg">


            <div
                ref={chatContainerRef}
                className="flex-1 p-4 overflow-y-auto flex flex-col"
                style={{ scrollBehavior: 'smooth' }}
            >
                <div className="mt-auto"></div>

                {messages.map((message, index) => (
                    <SingleMessage
                        key={index}
                        role={message.role}
                        message={message.message}
                        timestamp={message.timestamp}
                    />
                ))}

                <div ref={messagesEndRef} />
            </div>

            <div className="p-3 bg-gray-800 border-t border-gray-700 rounded-2xl">
                <div className="flex items-end">
                    <textarea
                        ref={textareaRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={async (e) => {
                            await handleKeyDown(e);
                        }}
                        placeholder={!isLoading ? "Type your message..." : "KnowledgeAi is Thinking....."}
                        className="flex-1 bg-gray-700 text-white placeholder-gray-400 p-3 rounded-lg resize-none overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-800 "
                        rows={1}
                        autoFocus
                        disabled={isLoading}
                    />


                    <button
                        onClick={handleSend}
                        disabled={inputValue.trim() === "" || isLoading}
                        className="ml-2 bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600 disabled:hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};












