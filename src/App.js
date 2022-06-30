import React, { useEffect, useState } from "react";
import Home from "./Components/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useCookies } from "react-cookie";
import io from "socket.io-client";
import Classic from "./Components/Classic";
import Online from "./Components/Online";
import Computer from "./Components/Computer";
import Practice from "./Components/Practice";
import Tutorial from "./Components/Tutorial";
import Lessons from "./Components/Lessons";
import SignUp from "./Components/SignUp";

import "./styles/scroll.css";
import Account from "./Components/Account";


export default function App() {

    const [cookies, setCookies] = useCookies(['id']);

    const [userSocket, setUserSocket] = useState(null);
    const [playerColor, setPlayerColor] = useState(localStorage.getItem("computer-player-color") ? localStorage.getItem("computer-player-color") : null);
    const [playerDifficulty, setPlayerDifficulty] = useState(localStorage.getItem("computer-player-difficulty") ? JSON.parse(localStorage.getItem("computer-player-difficulty")) : null);
    
    const [id, setId] = useState(null);

    useEffect(() => {

        const socket = io("http://localhost:8000");
        
        socket.on('connect', async () => {
            
            console.log('connected', socket.id, socket, cookies.id);
            setUserSocket(socket);
            if (JSON.parse(localStorage.getItem("socket")) == null) localStorage.setItem("socket", JSON.stringify(socket.id));
            setId(socket.id);
            const dbId = localStorage.getItem("c-id") ? JSON.parse(localStorage.getItem("c-id")) : null;
            const cookieId = parseInt(cookies.id);
            
            if (!dbId && !cookieId) return;
            console.log(typeof cookieId, dbId);
            let options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: dbId || cookieId,
                    socketId: socket.id
                })
            };
            (dbId || cookieId) && await fetch("http://localhost:8000/update-socket", options);

            options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: cookieId 
                })
            };

           console.log("aha");

            const dataJSON = cookieId && await fetch("http://localhost:8000/get-user", options);
            const data = await dataJSON.json();
            console.log(data);
            localStorage.setItem("c-email", JSON.stringify(data.email));
            localStorage.setItem("c-id", JSON.stringify(data.id));
            localStorage.setItem("c-username", JSON.stringify(data.username));
            localStorage.setItem("c-friends", data.friends);
            localStorage.setItem("c-points", JSON.stringify(data.points));
            
        });

    }, []);

    const getColor = (color, mode) => {
        setPlayerColor(color);
        
        if (localStorage.length !== 0) {
            for (let i = 0, len = localStorage.length; i < len; i++) {
                const key = localStorage.key(i);
                console.log(key);
                if (key === null) continue;
                if (key.search(mode) !== -1 && key.search("c-") === -1) localStorage.removeItem(key);
            }
        }

        localStorage.setItem(`${mode}player-color`, color);
        // window.location.href = `${window.location.href}computer`;
    };


    const getDifficulty = (difficulty) => {
        setPlayerDifficulty(difficulty);
        console.log(difficulty);
        
        if (localStorage.length !== 0) {
            for (let i = 0, len = localStorage.length; i < len; i++) {
                const key = localStorage.key(i);
                if (key === null) continue;
                if (key.search("computer-") !== -1) localStorage.removeItem(key);
            }
        }

        localStorage.setItem("computer-player-difficulty", JSON.stringify(difficulty));
    };

    useEffect(() => {
        console.log(playerColor);
        if (playerColor === null || playerDifficulty === null || id === null || userSocket === null) return;
        
        return (
            <Router>
                <Routes>
                    <Route path={"/"} element={ <Home id={id} getColor={getColor} getDifficulty={getDifficulty} /> } />
                    <Route path={"/signup"} element={ <SignUp id={id}/> } />
                    <Route path={"/classic"} element={ <Classic /> } />
                    <Route path={"/computer"} element={ <Computer color={playerColor} difficulty={playerDifficulty} /> }/>
                    <Route path={"/practice"} element={ <Practice /> }/>
                    <Route path={"/tutorial"} element={ <Tutorial /> } />
                    <Route path={"/lessons"} element={ <Lessons /> } />
                    <Route path={`/:id`} element={ <Online socket={userSocket}/> } />
                </Routes>
            </Router>
        );
        
    }, [playerColor, playerDifficulty, id, userSocket]);

 
    return userSocket && userSocket.connected && userSocket.id !== undefined && (
        <Router>
            <Routes>
                <Route path={"/"} element={ <Home id={id} getColor={getColor} getDifficulty={getDifficulty} /> } />
                <Route path={"/signup"} element={ <SignUp id={id}/> } />
                <Route path={"/classic"} element={ <Classic /> } />
                <Route path={"/computer"} element={ <Computer color={playerColor} difficulty={playerDifficulty} /> }/>
                <Route path={"/practice"} element={ <Practice /> }/>
                <Route path={"/tutorial"} element={ <Tutorial /> } />
                <Route path={"/lessons"} element={ <Lessons /> } />
                <Route path={`/:id`} element={ <Online socket={userSocket}/> } />
            </Routes>
        </Router>
    );
  
};
