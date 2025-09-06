"use client";
export interface Message {
    message: string;
    role: string;
    timestamp?: Date;
}



export const SingleMessage = ({ role, message, timestamp }: Message) => {
    return (
        <div
            className={`p-3 my-2 max-w-[80%] rounded-xl ${role === "user"
                ? "bg-orange-600 text-white ml-auto rounded-br-none"
                : "bg-gray-700 text-white mr-auto rounded-bl-none"
                }`}
        >
            <div className="text-sm">{message}</div>
            {timestamp && (
                <div
                    className={`text-xs mt-1 opacity-70 ${role === "user" ? "text-blue-100" : "text-gray-300"
                        }`}
                >
                    {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            )}
        </div>
    );
};
