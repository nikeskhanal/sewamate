import React from 'react';
import ChatComponent from '../Components/ChatComponent';

const ReceiverPage = () => {
  return (
    <div className="h-screen flex flex-col">
      <header className="bg-green-600 text-white p-4 shadow-md">
        <h1 className="text-xl font-bold">Chat View</h1>
      </header>
      <div className="flex-1 overflow-hidden">
        <ChatComponent isSender={false} />
      </div>
    </div>
  );
};

export default ReceiverPage;