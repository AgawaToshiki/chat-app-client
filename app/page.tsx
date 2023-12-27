"use client"
import Image from 'next/image';
import { useState } from 'react';
import io from "socket.io-client";
import { v4 as uuidv4 } from 'uuid';

const socket = io("http://localhost:5000");

export default function Home() {
  const [message, setMessage] = useState<string>("");
  const [list, setList] = useState<{ message: string, id: string }[]>([]);
  const handleSendMessage = () => {
    //サーバーへ送信
    const id = uuidv4();
    socket.emit("send_message", { message: message, id: id })
    setMessage("");
  }

  //サーバーから受信
  socket.on("received_message", (data) => {
    setList([...list, data]);
  })

  console.log(list);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-[500px] mx-auto">
        <h1>チャットアプリ</h1>
        <div>
          <input type="text" onChange={ (e) => setMessage(e.target.value) } value={ message } placeholder="chat" className="border"/>
          <button onClick={ () => handleSendMessage() } className="border">送信</button>
        </div>
        {list.map((chat) => (
          <div key={chat.id}>{ chat.message }</div>
        ))}
      </div>
    </div>
  )
}
