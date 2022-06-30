import React, { useState, useEffect, useRef } from "react";

import PracticeBoard from "./PracticeBoard";
import RightSide from "./RightSide";
import LeftSide from "./LeftSide";
import Header from "./Header";

import '../styles/home.css';

export default function Classic() {

    const [buttonsTarget, setButtonsTarget] = useState(null);
    const [random, setRandom] = useState(null);
    const [choosePiece, setChoosePiece] = useState(null);
    const [deleteIcon, setDeleteIcon] = useState(null);

    const returnButtonsClick = (e) => {

        let newTarget = e.target;

        while (!newTarget.classList.contains('button')) {
            newTarget = newTarget.parentElement;
        }

        setButtonsTarget(newTarget);
        setRandom(Math.random());
    };

    const handlePieceChoose = (idx) => {
        console.log(idx)
        setChoosePiece(idx);
    };

    const handleDelete = () => setDeleteIcon(Math.random());

    const languageCallback = () => {
        
    };

    
    return (
        <div className="content">
            <Header languageCallback={languageCallback}/>
            <div className="game">
                <LeftSide practice={true} handlePieceChoose={handlePieceChoose} handleDelete={handleDelete} color={1}/>
                <PracticeBoard color={1} prevButtons={buttonsTarget} random={random} difficulty="very hard" choosePiece={choosePiece} deleteIcon={deleteIcon} />
                <RightSide clickButton={returnButtonsClick} practiceGame={true} computerGame={false} onlineGame={false} timer={false}/>
            </div>
        </div>
        
    );
};