import React, { useState, useEffect } from "react";
import ComputerBoard from "./ComputerBoard";
import LeftSide from "./LeftSide";
import RightSide from "./RightSide";
import Header from "./Header";

import '../styles/home.css';

export default function Computer({ color, difficulty }) {

    console.log(difficulty);

    const [buttonsTarget, setButtonsTarget] = useState(null);
    const [random, setRandom] = useState(null);
    const [winner, setWin] = useState(null);
    const [message, setMessage] = useState(null);
    const [lang, setLang] = useState(localStorage.getItem("language") ? JSON.parse(localStorage.getItem("language")) : "en");

    const returnButtonsClick = (e) => {

        let newTarget = e.target;

        while (!newTarget.classList.contains('button')) {
            newTarget = newTarget.parentElement;
        }

        setButtonsTarget(newTarget);
        setRandom(Math.random());
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

    const languageCallback = (language) => {
        setLang(language);
        window.location.reload();
    };

    useEffect(() => localStorage.setItem("language", JSON.stringify(lang)), [lang]);

    return (
        <div className="content">
            <Header languageCallback={languageCallback} />
            <div className="message">
                <h2 className={`winner ${winner ? "win" : "lose"}`}>{message}</h2>
            </div>
            <div className="game">
                <LeftSide color={!color ? 1 : color}/>
                <ComputerBoard color={!color ? 1 : color} prevButtons={buttonsTarget} random={random} difficulty={!difficulty ? "easy" : difficulty} gameEnd={gameEnd}/>
                <RightSide clickButton={returnButtonsClick} computerGame={true} color={!color ? 1 : color} gameEnd={gameEnd} />
            </div>
        </div>
    );
};