import React, {useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

import Board from './Board';
import OnlineBoard from "./OnlineBoard";
import RightSide from "./RightSide";
import LeftSide from "./LeftSide";
import Header from "./Header";

import '../styles/home.css';

export default function Online({ socket }) {

    const { id } = useParams();
    //const gotColor = localStorage.getItem("online-player-color") ? parseInt(localStorage.getItem("online-player-color")) : 1; 
    if (id.length !== 20) window.location.href = "/";

    const [color, setColor] = useState(null);
    const [buttonsTarget, setButtonsTarget] = useState(null);
    const [random, setRandom] = useState(null);
    const [done, setDone] = useState(true);
    const [numberOfPlayers, setNumberOfPlayers] = useState(null);
    const [lang, setLang] = useState(localStorage.getItem("language") ? JSON.parse(localStorage.getItem("language")) : "en");
    const [winner, setWin] = useState(null);
    const [stopRealTimer, setStopTimer] = useState(false);
    const [message, setMessage] = useState("");

    const username = localStorage.getItem("c-username") ? JSON.parse(localStorage.getItem("c-username")) : null;

    let players;

    socket.on("rooms", rooms => {
        console.log("HERE");
        const isThisRoom = [...Object.keys(rooms)].filter(room => room == id);
        console.log("NOT FOUND ROOM", isThisRoom);
        if (isThisRoom === undefined) {
           
            return null;
        }
    });

    socket.emit("create-room", id);

    socket.emit("get-players");

    socket.on("players", player => {
        console.log("PLAYERS: ", player);
        console.log(player, id, socket.id, JSON.parse(localStorage.getItem("socket")));
        const ownColor = (localStorage.getItem("player") !== null ? parseInt(localStorage.getItem("player")) : player === 1 ? 1 : -1);
        setColor(ownColor);
        console.log(ownColor);
        if (parseInt(ownColor) === -1) {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                console.log(key);
                if (key.search('online-') !== -1) localStorage.removeItem(key);
            }
        }
        
        if (localStorage.getItem("player") === null) localStorage.setItem("player", player === 1 ? player : -1);
        
        setNumberOfPlayers(player);
        console.log(username);
        if (player === 2 && username) socket.emit("send-username", username, socket.id);
        // if (localStorage.getItem("id") === null) localStorage.setItem("id", parseInt(id));
        // else if (localStorage.getItem("id") !== parseInt(id) && localStorage.length !== 0) {
        //     localStorage.removeItem("id");
        //     localStorage.clear();
        //     // window.location.reload();
        // }
    });
   
    // if (id != JSON.parse(localStorage.getItem("socket"))) return null;
    // Request for room's players

    const returnButtonsClick = (e) => {

        let newTarget = e.target;

        while (!newTarget.classList.contains('button')) {
            newTarget = newTarget.parentElement;
        }

        setButtonsTarget(newTarget);
        setRandom(Math.random());
    };

    useEffect(() => {
        if (numberOfPlayers === null) return null;

        return (
            <div className="content">
                <div className="game">
                    <LeftSide />
                    <OnlineBoard color={color} prevButtons={buttonsTarget} random={random} socket={socket} oppId="ij3YC-_VZmKbEahoAABH" players={numberOfPlayers} />
                    <RightSide clickButton={returnButtonsClick}  onlineGame={true} computerGame={false} stopTimer={parseInt(color) === 1 ? stopRealTimer : !stopRealTimer} time={10} gameEnd={gameEnd} timer={true} players={numberOfPlayers} color={color}/>
                </div>
            </div>
        );

    }, [numberOfPlayers]);

    const languageCallback = (language) => {
        setLang(language);
    };

    const gameEnd = (win) => {
        if (win) {
            setWin(true);
            setMessage("You win!");
            return;
        } 
        setWin(false);
        setMessage("You lose!");
    }

    const stopTimer = (cond) => setStopTimer(cond);

    useEffect(() => localStorage.setItem("language", JSON.stringify(lang)), [lang]);

    
    return color && (
        <div className="content">
            <Header languageCallback={languageCallback} />
            <div className="game">
                <LeftSide color={color} online={true} socket={socket} />
                <OnlineBoard color={color} prevButtons={buttonsTarget} random={random} socket={socket} oppId="ij3YC-_VZmKbEahoAABH" players={numberOfPlayers} stopTimer={stopTimer} />
                <RightSide clickButton={returnButtonsClick} onlineGame={true} computerGame={false} stopTimer={parseInt(color) === 1 ? stopRealTimer : !stopRealTimer} time={10} gameEnd={gameEnd} timer={true} players={numberOfPlayers} color={color}/>
            </div>
        </div>
    );
};