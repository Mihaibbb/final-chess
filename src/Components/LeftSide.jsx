import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChessPawn, faChessKnight, faChessRook, faChessBishop, faChessKing, faChessQueen, faTimes, faPaperPlane, faAngleRight } from '@fortawesome/free-solid-svg-icons'; 

import '../styles/left-side.css';

const pieceIcons = {
    1: faChessPawn,
    2: faChessRook,
    3: faChessKnight,
    4: faChessBishop,
    5: faChessQueen,
    6: faChessKing
};

const HEIGHT = 85 * window.innerHeight / 100;

export default function LeftSide({practice, handlePieceChoose, handleDelete, color, online, socket}) {

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [opponentUsername, setOpponentUsername] = useState(null);
    const username = localStorage.getItem("c-username") ? JSON.parse(localStorage.getItem("c-username")) : null;

    useEffect(() => {
        if (!online) return;
        socket.on("recieve-message", opponentMessage => {
            console.log(socket.id, opponentMessage);
            setMessages(currMessages => [...currMessages, {
                type: "opponent",
                message: opponentMessage 
            }]);
        });

        socket.on("username-opponent", oppUsername => {
            setOpponentUsername(oppUsername)
            console.log("Opponent username", oppUsername);
        });
    }, []);

    const getIcons = () => {
        const elements = Object.values(pieceIcons).map((pieceIcon, idx) => {
            return (
                <div className="piece-selections" key={idx}>
                    <div className="white-icon icon" onClick={() => handlePieceChoose(idx + 1)}>
                        <FontAwesomeIcon
                            icon={pieceIcon} 
                            className="white-piece piece-selection"
                            color="#fff"
                        />
    
                    </div>
    
                    <div className="black-icon icon" onClick={() => handlePieceChoose(-idx - 1)}>
                        <FontAwesomeIcon
                            icon={pieceIcon} 
                            className="black-piece piece-selection"
                            color="#000"
                        />
                        
                    </div>
    
                </div>
            );
        });
    
        return elements;
    };  

    const sendMessage = () => {
        if (message.trim().length === 0) {
            setMessage("");
            return;
        }

        setMessages(currMessages => [...currMessages, {
            type: "player",
            message: message 
        }]);
        socket.emit("send-message", message)
        setMessage("");
        
    };

    const addFriend = () => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username1: username,
                username2: opponentUsername
            })
        };

        
    };


    return (
        <div className="left-side" style={{maxHeight: `${HEIGHT}px`}}>

            {online && 
                <div className="chat-container">
                    <div className="title-chat">
                        <h2>{opponentUsername ? `Your opponent : ${opponentUsername}` : `Chat with opponent`}</h2>
                    </div>
                    <div className="messages-container">
                        {messages.length > 0 && messages.map((message, idx) => (
                            <div className={`message ${message.type === "player" ? "own" : "opponent"} ${parseInt(color) === 1 && message.type === "player" ? "white" : parseInt(color) === 1 && message.type === "opponent" ? "black" : parseInt(color) === -1 && message.type === "player" ? "black" : parseInt(color) === -1 && message.type === "opponent" ? "white" : null}`} key={idx}>
                                <p>{message.message}</p>
                            </div>
                        ))}
                    </div>

                    <div className="send-message">
                        <input 
                            type="text" 
                            className="message-input" 
                            placeholder="Type a message here..." 
                            onChange={(e) => setMessage(e.target.value)} 
                            onKeyDown={(e) => e.key === "Enter" ? sendMessage() : null}

                            value={message}
                        />
                            
                        <FontAwesomeIcon
                            className="send-icon"
                            icon={faAngleRight}
                            onClick={() => sendMessage()}
                        />
                    </div>
                    
                </div>
            }

            {practice && (
                <div className="pieces">
                    {getIcons()}
                    <div className="delete" onClick={handleDelete}>
                        <FontAwesomeIcon 
                            className="delete-icon"
                            icon={faTimes}
                            color="crimson"
                        />
                        <h2>Delete</h2>
                    </div>
                </div>
                
            )}
            

            {color === undefined || parseInt(color) === 1? (
                <div className="numbers">
                    <p>8</p>
                    <p>7</p>
                    <p>6</p>
                    <p>5</p>
                    <p>4</p>
                    <p>3</p>
                    <p>2</p>
                    <p>1</p>
                </div>
            ) : (
                <div className="numbers">
                    <p>1</p>
                    <p>2</p>
                    <p>3</p>
                    <p>4</p>
                    <p>5</p>
                    <p>6</p>
                    <p>7</p>
                    <p>8</p>
                </div>
            )}
        </div>
    );
};