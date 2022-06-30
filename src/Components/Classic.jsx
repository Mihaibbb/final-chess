import React, { useState, useEffect } from "react";

import Board from './Board';
import RightSide from "./RightSide";
import LeftSide from "./LeftSide";
import Header from "./Header";

import '../styles/home.css';

export default function Classic() {

    const [buttonsTarget, setButtonsTarget] = useState(null);
    const [random, setRandom] = useState(null);
    const [stopRealTimer, setStopTimer] = useState(false);
    const [message, setMessage] = useState("");
    const [winner, setWin] = useState(null);
    const [lang, setLang] = useState(localStorage.getItem("language") ? JSON.parse(localStorage.getItem("language")) : "en");

    const color = localStorage.getItem("classic-player-color") ? localStorage.getItem("classic-player-color") : 1;

    const returnButtonsClick = (e) => {

        let newTarget = e.target;

        while (!newTarget.classList.contains('button')) {
            newTarget = newTarget.parentElement;
        }

        setButtonsTarget(newTarget);
        setRandom(Math.random());
    };

    const stopTimer = (cond) => setStopTimer(cond);

    const gameEnd = (win) => {
        if (win === 1) {
            setWin(true);
            setMessage("White wins!");
            return;
        } else if (win === -1) {
            setMessage("Black Wins!");
        } else if (win === 0) {
            setMessage("Draw!");
        }
    }

    const languageCallback = (language) => {
        setLang(language);
    };

    useEffect(() => localStorage.setItem("language", JSON.stringify(lang)), [lang]);

    // useEffect(() => {
    //     return () => (<div className="content">
    //         <div className="game">
    //             <LeftSide color={color} />
    //             <Board color={color} prevButtons={buttonsTarget} random={random} stopTimer={stopTimer}/>
    //             <RightSide clickButton={returnButtonsClick} computerGame={false} stopTimer={stopRealTimer} time={10} gameEnd={gameEnd}/>
    //         </div>
            
    //     </div>);
    // }, [stopRealTimer]);
    
    return (
        <div className="content">
            <Header languageCallback={languageCallback}/>
            <div className="message">
                <h2 className="winner">{message}</h2>
            </div>
            <div className="game">
                <LeftSide color={color} />
                <Board color={color} prevButtons={buttonsTarget} random={random} stopTimer={stopTimer} win={winner} gameEnd={gameEnd}/>
                <RightSide clickButton={returnButtonsClick} computerGame={false} stopTimer={stopRealTimer} time={10} gameEnd={gameEnd} timer={true} color={color}/>
            </div>
        </div>
        
    );
};