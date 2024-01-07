"use client"
import Link from 'next/link';
import { useEffect, useState } from 'react';
import io from "socket.io-client";
import { v4 as uuidv4 } from 'uuid';

const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_SERVER}`);

export default function Home() {
  const [title, setTitle] = useState<string>("");
  const [list, setList] = useState<{ title: string, id: string }[]>([]);
  const handleCreateThread = () => {
    //サーバーへ送信
    const id = uuidv4();
    socket.emit("create_thread", { title: title, id: id })
    setTitle("");
  }
  useEffect(() => {
    //サーバーから受信
    socket.on("received_thread", (data) => {
      setList([...data]);
  })

  },[list])

  console.log(list);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-[500px] mx-auto">
        <h1>掲示板</h1>
        <div>
          <input type="text" onChange={ (e) => setTitle(e.target.value) } value={ title } placeholder="新規スレッド名" className="border"/>
          <button onClick={ () => handleCreateThread() } className="border">新規スレッド作成</button>
        </div>
        {list.map((thread) => (
          <Link 
            key={ thread.id } 
            href={`/threads/${thread.id}`} 
            className="flex flex-col">
              { thread.title }
          </Link>
        ))}
      </div>
    </div>
  )
}
