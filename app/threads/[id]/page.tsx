"use client"
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import io from "socket.io-client";

const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_SERVER}`);

const Threads = ({ params }: { params: { id: string }}) => {

  const [message, setMessage] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [list, setList] = useState<{ message: string, id: string, username: string }[]>([]);
  const handleSendMessage = () => {
    //サーバーへ送信
    const id = uuidv4();
    socket.emit("send_message", { message: message, id: id, threadId: params.id, username: name })
    setName("");
    setMessage("");
  }

  //サーバーから受信
  useEffect(() => {
    socket.on("received_message", (data) => {
      setList([...data]);
    })
  }, [])

  console.log(list);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-[500px] mx-auto">
        <h1>チャット</h1>
        {list.map((chat) => (
          <div key={chat.id}>{ chat.username }:{ chat.message }</div>
        ))}
        <div>
          <input type="text" onChange={ (e) => setName(e.target.value) } value={ name } placeholder="name"/>
          <input type="text" onChange={ (e) => setMessage(e.target.value) } value={ message } placeholder="chat" className="border"/>
          <button onClick={ () => handleSendMessage() } className="border">送信</button>
        </div>
      </div>
    </div>
  )
}

export default Threads