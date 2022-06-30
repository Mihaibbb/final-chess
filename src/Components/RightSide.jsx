import React, {useEffect, useState} from "react";
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

import ResetButton from './ResetButton';
import PreviousButton from "./PreviousButton";

import '../styles/right-side.css';

const HEIGHT = 85 * window.innerHeight / 100;

export default function RightSide({clickButton, onlineGame, computerGame, practiceGame, empty, stopTimer, time, gameEnd, timer, players, color}) {

 
    console.log(stopTimer);
    const [upTimerMinutes, setUpTimerMinutes] = useState(onlineGame ? (localStorage.getItem("online-opponent-minutes") ? localStorage.getItem("online-opponent-minutes") : time) : computerGame ? (localStorage.getItem("computer-opponent-minutes") ? localStorage.getItem("computer-opponent-minutes") : time) : (localStorage.getItem("opponent-minutes") ? localStorage.getItem("opponent-minutes") : time));
    const [upTimerSeconds, setUpTimerSeconds] = useState(onlineGame ? (localStorage.getItem("online-opponent-seconds") ? localStorage.getItem("online-opponent-seconds") : 0) : computerGame ? (localStorage.getItem("computer-opponent-seconds") ? localStorage.getItem("computer-opponent-seconds") : 0) : (localStorage.getItem("opponent-seconds") ? localStorage.getItem("opponent-seconds") : 0));
    const [downTimerMinutes, setDownTimerMinutes] = useState(onlineGame ? (localStorage.getItem("online-player-minutes") ? localStorage.getItem("online-player-minutes") : time) : computerGame ? (localStorage.getItem("computer-player-minutes") ? localStorage.getItem("computer-player-minutes") : time) : (localStorage.getItem("player-minutes") ? localStorage.getItem("player-minutes") : time));
    const [downTimerSeconds, setDownTimerSeconds] = useState(onlineGame ? (localStorage.getItem("online-player-seconds") ? localStorage.getItem("online-player-seconds") : 0) : computerGame ? (localStorage.getItem("computer-player-seconds") ? localStorage.getItem("computer-player-seconds") : 0) : (localStorage.getItem("player-seconds") ? localStorage.getItem("player-seconds") : 0));
    
    let downTimeSec = onlineGame ? (localStorage.getItem("online-player-seconds") ? localStorage.getItem("online-player-seconds") : 0) : computerGame ? (localStorage.getItem("computer-player-seconds") ? localStorage.getItem("computer-player-seconds") : 0) : (localStorage.getItem("player-seconds") ? localStorage.getItem("player-seconds") : 0);
    let upTimeSec = onlineGame ? (localStorage.getItem("online-opponent-seconds") ? localStorage.getItem("online-opponent-seconds") : 0) : computerGame ? (localStorage.getItem("computer-opponent-seconds") ? localStorage.getItem("computer-opponent-seconds") : 0) : (localStorage.getItem("opponent-seconds") ? localStorage.getItem("opponent-seconds") : 0);
    let downTimeMinutes = onlineGame ? (localStorage.getItem("online-player-minutes") ? localStorage.getItem("online-player-minutes") : time) : computerGame ? (localStorage.getItem("computer-player-minutes") ? localStorage.getItem("computer-player-minutes") : time) : (localStorage.getItem("player-minutes") ? localStorage.getItem("player-minutes") : time);
    let upTimeMinutes = onlineGame ? (localStorage.getItem("online-opponent-minutes") ? localStorage.getItem("online-opponent-minutes") : time) : computerGame ? (localStorage.getItem("computer-opponent-minutes") ? localStorage.getItem("computer-opponent-minutes") : time) : (localStorage.getItem("opponent-minutes") ? localStorage.getItem("opponent-minutes") : time);
    // const setStorage = computerGame ? (localStorage.getItem("computer-opponent-minutes") || localStorage.getItem("computer-opponent-seconds") || localStorage.getItem("computer-player-minutes") || localStorage.getItem("computer-player-seconds")) : (localStorage.getItem("opponent-minutes") || localStorage.getItem("opponent-seconds") || localStorage.getItem("player-minutes") || localStorage.getItem("player-seconds"));
    // console.log(setStorage);

    const downTimer = () => {
        if (!timer) return;
        if (onlineGame && players < 2) return;
        if (downTimeSec <= 0 && downTimeMinutes <= 0) {
            gameEnd(!color);
            clearInterval(upTimer);
            clearInterval(downTimer);
            return;
        }

        console.log(stopTimer);
   
        if (downTimeSec <= 0) {
            setDownTimerMinutes(downTime => downTime - 1);
            setDownTimerSeconds(59);
            downTimeSec = 59;
            downTimeMinutes--;
        } else {
            setDownTimerSeconds(downTime => downTime - 1);
            downTimeSec--;
        }

        if (onlineGame) {
            localStorage.setItem("online-player-minutes", downTimeMinutes);
            localStorage.setItem("online-player-seconds", downTimeSec);
        }
        else if (computerGame) {
            localStorage.setItem("computer-player-minutes", downTimeMinutes);
            localStorage.setItem("computer-player-seconds", downTimeSec);
        } else {
            localStorage.setItem("player-minutes", downTimeMinutes);
            localStorage.setItem("player-seconds", downTimeSec);
        }
        
    };

    const upTimer = () => {
        if (computerGame) return;
        if (onlineGame && players < 2) return;
        if (upTimeSec <= 0 && upTimeMinutes <= 0) {
            gameEnd(color);
            clearInterval(upTimer);
            clearInterval(downTimer);
            return;
        }


        if (upTimeSec <= 0) {
            setUpTimerMinutes(upTime => upTime - 1);
            setUpTimerSeconds(59);
            upTimeSec = 59;
            upTimeMinutes--;
        } else {
            setUpTimerSeconds(upTime => upTime - 1);
            upTimeSec--;
        }

        if (onlineGame) {
            localStorage.setItem("online-opponent-minutes", upTimeMinutes);
            localStorage.setItem("online-opponent-seconds", upTimeSec);
        }
        else if (computerGame) {
            localStorage.setItem("computer-opponent-minutes", upTimeMinutes);
            localStorage.setItem("computer-opponent-seconds", upTimeSec);
        } else {
            localStorage.setItem("opponent-minutes", upTimeMinutes);
            localStorage.setItem("opponent-seconds", upTimeSec);
        }
       
    };

    

    useEffect(() => {
        const interval1 = setInterval(downTimer, 1000);
        const interval2 = setInterval(upTimer, 1000);
        
        if (stopTimer || (onlineGame && players < 2)) clearInterval(interval1);
        else if (!stopTimer) clearInterval(interval2);

        return () => {
            clearInterval(interval1);
            clearInterval(interval2);
        }
    }, [stopTimer, players]);
    

    if (empty) return <div></div>;

    return (
        <div className="right-side">
            <div className={`timer opponent-timer ${parseInt(color) === 1 ? "black" : "white"} `}>
                {!computerGame && !practiceGame && <h2>{upTimerMinutes < 10 ? `0${upTimerMinutes}` : upTimerMinutes} : {upTimerSeconds < 10 ? `0${upTimerSeconds}` : upTimerSeconds}</h2>}
            </div>
            <ResetButton computerGame={computerGame} />
            <div className="prev-next">
                <PreviousButton icon={faArrowLeft} classDiv="prev-button" clickButton={clickButton}/>
                <PreviousButton icon={faArrowRight} classDiv="next-button" clickButton={clickButton}/>
            </div>
            <div className={`timer my-timer ${parseInt(color) === 1 ? "white" : "black"} `}>
                {timer && <h2>{downTimerMinutes < 10 ? `0${downTimerMinutes}` : downTimerMinutes} : {downTimerSeconds < 10 ? `0${downTimerSeconds}` : downTimerSeconds}</h2>}
            </div>
        </div>
    );
};
