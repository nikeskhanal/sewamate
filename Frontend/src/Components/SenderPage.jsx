import React from 'react';
import ChatComponent from '../Components/ChatComponent';

const SenderPage = () => {
  return (
    <div className="h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-xl font-bold">Chat App</h1>
      </header>
      <div className="flex-1 overflow-hidden">
        <ChatComponent isSender={true} />
      </div>
    </div>
  );
};

export default SenderPage;