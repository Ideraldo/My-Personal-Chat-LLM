import "./App.css";
import { Col, Row, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import WaitingRoom from "./components/waitingroom";
import { useState } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import ChatRoom from "./components/ChatRoom";

function App() {
  const [connect, setConnection] = useState();
  const [messages, setMessages] = useState([]);

  const joinChatRoom = async (username, chatroom) => {
    try {
      const connect = new HubConnectionBuilder()
        .withUrl("https://localhost:7156/chat")
        .configureLogging(LogLevel.Information)
        .build();

      connect.on("JoinSpecificChatRoom", (username, msg) => {
        setMessages((messages) => [...messages, { username, msg }]);
        console.log("msg ", msg);
      });

      connect.on("ReceiveSpecificMessage", (username, msg) => {
        setMessages((messages) => [...messages, { username, msg }]);
      });

      await connect.start();
      await connect.invoke("JoinSpecificChatRoom", { username, chatroom });
      setConnection(connect);
    } catch (e) {
      console.log(e.message);
    }
  };

  const sendMessage = async(message) => {
    try{
      await connect.invoke("SendMessage", message);
    }catch(e){
      console.log(e);
    }
  };

  return (
    <div>
      <main>
        <Container>
          <Row className="px-5 my-5">
            <Col sm="12">
              <h1 className="font-weight-light">TESTTTTTTTTTTTTTTTT</h1>
            </Col>
          </Row>
          {!connect ? (
            <WaitingRoom joinChatRoom={joinChatRoom}></WaitingRoom>
          ) : (
            <ChatRoom messages={messages} sendMessage={sendMessage}></ChatRoom>
          )}
        </Container>
      </main>
    </div>
  );
}

export default App;
