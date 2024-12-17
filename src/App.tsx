import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState(["hit there", "hello "]);
  const [inputMessage, setinputMessage] = useState("");
  const wsRef = useRef();

  useEffect(() => {
    const ws = new WebSocket("http://localhost:8080");
    ws.onmessage = (event) => {
      setMessages((m) => [...m, event.data]);
    };
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: "red",
          },
        })
      );
    };
    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="h-screen bg-black flex justify-center items-center">
      <div className="bg-gray-600 w-[35%] h-[70%] ">
        {/* messages */}
        <div
          className=" h-[90%] overflow-y-auto text-white
        "
        >
          {messages.map((message) => (
            <div className="bg-white text-black w-content rounded p-4 m-8">
              {message}
            </div>
          ))}
        </div>
        {/* Send Message Block */}
        <div className=" bg-red-300">
          <div className="flex gap-10 ">
            <input
              type="text"
              className="p-4"
              value={inputMessage}
              onChange={(e) => setinputMessage(e.target.value)}
            />
            <button
              onClick={() => {
                wsRef.current.send(
                  JSON.stringify({
                    type: "chat",
                    payload: {
                      message: inputMessage,
                    },
                  })
                );
                setinputMessage("")
              }}
            >
              send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
