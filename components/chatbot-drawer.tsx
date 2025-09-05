// "use client";

// import { useState, useRef, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Drawer,
//   DrawerContent,
//   DrawerHeader,
//   DrawerBody,
//   DrawerFooter,
//   DrawerTitle,
// } from "@/components/ui/drawer";
// import { Input } from "@/components/ui/input";

// type Message = { text: string; from: "user" | "bot" };

// export default function ChatbotDrawer() {
//   const [open, setOpen] = useState(false);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState("");
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   // scroll to bottom when new message
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSend = () => {
//     if (!input.trim()) return;

//     // add user message
//     setMessages((prev) => [...prev, { text: input, from: "user" }]);
//     setInput("");

//     // simulate bot response (replace with your agent call)
//     setTimeout(() => {
//       setMessages((prev) => [
//         ...prev,
//         { text: `Bot response to "${input}"`, from: "bot" },
//       ]);
//     }, 500);
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") handleSend();
//   };

//   return (
//     <>
//       {/* Floating Button */}
//       <Button
//         className="fixed bottom-8 right-8 rounded-full w-16 h-16 p-4 shadow-lg bg-blue-600 text-white"
//         onClick={() => setOpen(true)}
//       >
//         Chat
//       </Button>

//       {/* Drawer */}
//       <Drawer open={open} onOpenChange={setOpen} side="right">
//         <DrawerContent className="w-[400px] max-w-full flex flex-col">
//           <DrawerHeader>
//             <DrawerTitle>Chatbot</DrawerTitle>
//           </DrawerHeader>

//           <DrawerBody className="flex-1 flex flex-col overflow-hidden">
//             <div className="flex-1 overflow-y-auto p-4 space-y-3">
//               {messages.map((msg, i) => (
//                 <div
//                   key={i}
//                   className={`px-4 py-2 rounded-lg max-w-[80%] ${
//                     msg.from === "user"
//                       ? "bg-blue-500 text-white self-end"
//                       : "bg-gray-200 text-gray-900 self-start"
//                   }`}
//                 >
//                   {msg.text}
//                 </div>
//               ))}
//               <div ref={messagesEndRef} />
//             </div>

//             {/* Input */}
//             <div className="p-4 border-t flex gap-2">
//               <Input
//                 placeholder="Type a message..."
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={handleKeyDown}
//                 className="flex-1"
//               />
//               <Button onClick={handleSend}>Send</Button>
//             </div>
//           </DrawerBody>
//         </DrawerContent>
//       </Drawer>
//     </>
//   );
// }
