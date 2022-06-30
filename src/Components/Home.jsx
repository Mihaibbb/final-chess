import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faRobot, faCheck, faAngleDown, faWifi, faChessBoard, faMicrochip, faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { ReactComponent as ReactLogo } from "../image/ai.svg"

import Header from "./Header";
import black_queen from "../image/black_queen.png";
import white_queen from "../image/white_queen.png";
import half_queen from "../image/half_queen.png";
import '../styles/game-modes.css';
import selectS from "../sounds/select.mp3";
import clickS from "../sounds/click.mp3";

export default function Home({id, getColor, getDifficulty}) {

    // Update 1
    if (localStorage.length !== 0) {
        for (let i = 0, len = localStorage.length; i < len; i++) {
            const key = localStorage.key(i);
            if (key === null) continue;
            if (key.search("computer-") === -1 && key.search("player") === -1 && key.search("opponent") === -1 && key !== 'language' && key.search("classic-") === -1 && key.search("c-") === -1) localStorage.removeItem(key);
            if (key.search("online-") !== -1) localStorage.removeItem(key);
        }
    }

    const [stop, setStop] = useState(false);
    const [clickStop, setClickStop] = useState(false);
    const [computerColor, setComputerColor] = useState(null);
    const [lang, setLang] = useState(localStorage.getItem("language") ? JSON.parse(localStorage.getItem("language")) : "en");

    const inputLinkRef = useRef(null);
    const copyButtonRef = useRef(null);
    const copyIconRef = useRef(null);
    const colorButtons = useRef([]);
    const difficultiesRef = useRef();
    const difficultyRef = useRef();

    const selectSound = new Audio(selectS);
    const pointSound = new Audio(clickS);

    const hoverSound = async () => {
        selectSound.pause();
        selectSound.currentTime = 0;
        // await selectSound.play();
    };

    const copyLink = (e) => {
        setClickStop(false);
        inputLinkRef?.current.select();
        inputLinkRef?.current.setSelectionRange(0, 1000);

        navigator.clipboard.writeText(inputLinkRef?.current.value);
        copyButtonRef?.current.classList.add("sent");
        
        setTimeout(() => copyButtonRef?.current.firstChild.classList.add('rotate'), 400);
        // copyButtonRef?.current.addEventListener('transitionend', () => {
        //     copyButtonRef?.current.classList.add('rotate');
        // });

        setTimeout(() => {
            inputLinkRef?.current.blur();
            setClickStop(true);
        }, 150);
    };

    const clickSound = async (path) => {
        if (path === `/${id}` && (stop || !clickStop)) return;
        pointSound.pause();
        pointSound.currentTime = 0;
        await pointSound.play();
        pointSound.addEventListener('ended', () => {
            if (path === `/${id}`) {
                localStorage.removeItem("board");
                localStorage.removeItem("current-move")
            }
            window.location.href = path;
        });
    
    };  

    const playComputer = (e, color) => {
        let newTarget = e.target;

        while (!newTarget.classList.contains('piece-button')) {
            newTarget = newTarget.parentElement;
        }

        setComputerColor(color);
        getColor(color, "computer-");
        // window.location.href = `${window.location.href}computer`;
        [...newTarget.parentElement.childNodes].forEach(childNode => {
            childNode.classList.remove('clicked');
        });
        newTarget.classList.add('clicked');
    };

    const playClassic = (e, color) => {
        let newTarget = e.target;

        while (!newTarget.classList.contains('piece-button')) {
            newTarget = newTarget.parentElement;
        }

       
        getColor(color, "classic-");
        // window.location.href = `${window.location.href}computer`;
        [...newTarget.parentElement.childNodes].forEach(childNode => {
            childNode.classList.remove('clicked');
        });
        newTarget.classList.add('clicked');
    };

    const playOnline = (e, color) => {
        let newTarget = e.target;

        while (!newTarget.classList.contains('piece-button')) {
            newTarget = newTarget.parentElement;
        }

        
        getColor(color, "online-");
        // window.location.href = `${window.location.href}computer`;
        [...newTarget.parentElement.childNodes].forEach(childNode => {
            childNode.classList.remove('clicked');
        });
        newTarget.classList.add('clicked');
    };

    const startComputerGame = () => {
        console.log(computerColor);
        // window.location.href = `${window.location.href}computer`;
    };

    const changeDifficulty = (e) => {
        const difficulty = e.target.innerText.toLowerCase();
        e.target.parentElement.childNodes.forEach(child => child.classList.remove('active'));
        e.target.classList.add('active');
        getDifficulty(difficulty);
    };

    const languageCallback = (language) => {
        setLang(language);
    };

    useEffect(() => localStorage.setItem("language", JSON.stringify(lang)), [lang]);

    return (
        <div className="container">

            <Header languageCallback={languageCallback}/>

            <div className="home-content">
             
                <div className="classic-mode game-mode" onMouseEnter={async () => await hoverSound()} >
                    <div className="title">
                        <h2>{lang === "en" ? "Classic" : lang === "ro" ? "Clasic" : "Klasszikus"}</h2>
    
                        <div className="icon">
                            <FontAwesomeIcon 
                                icon={faUser} 
                                color="#fff"
                                className="mode-icon"
                            />

                            <FontAwesomeIcon 
                                className="mode-icon board-icon"
                                icon={faChessBoard}
                            />

                            <FontAwesomeIcon 
                            icon={faUser} 
                                color="#fff"
                                className="mode-icon"
                            />

                        </div>
                    </div>

                    <div className="colors">
                        <div className="white piece-button clicked" onClick={(e) => playClassic(e, 1)}>
                            <img src={white_queen} className="color-img" alt="white color play"/>
                        </div>
                        <div className="black piece-button" onClick={(e) => playClassic(e, -1)} >
                            <img src={black_queen} className="color-img" alt="black color play"/>
                        </div>
                        <div className="random piece-button" onClick={(e) => playClassic(e, Math.random() < 0.5 ? 1 : -1)}>
                            <img src={half_queen} className="color-img" alt="random color play"/>
                        </div>
                    </div>

                    <div></div>

                    <div></div>

                    <div className="start">
                            <button className="start-button" onClick={async () => await clickSound(`/classic`)}>{lang === "en" ? "Start game!" : lang === "ro" ? "Incepe jocul!" : "Játék kezdése!"}</button>
                    </div>
    
                </div>
                
                <div className="online-mode game-mode" onMouseEnter={() => hoverSound()}>
                    
                    <div className="title">
                        <h2>Online</h2>
    
                        <div className="icon">
                            <FontAwesomeIcon 
                                icon={faUser} 
                                color="#fff"
                                className="mode-icon"
                            />

                            <div className="icon-manager">
                                <FontAwesomeIcon
                                    color="#fff"
                                    icon={faWifi}
                                    className="mode-icon wifi"
                                />
                                <FontAwesomeIcon
                                    color="#fff"
                                    icon={faWifi}
                                    className="mode-icon"
                                />
                                
                            </div>
                            <FontAwesomeIcon 
                                    icon={faUser} 
                                    color="#fff"
                                    className="mode-icon"
                            />
                             
                        </div>
    
                        
                    </div>      
                    <div className="colors">
                        <div className="white piece-button clicked" onClick={(e) => playOnline(e, 1)}>
                            <img src={white_queen} className="color-img" alt="white color play"/>
                        </div>
                        <div className="black piece-button" onClick={(e) => playOnline(e, -1)} >
                            <img src={black_queen} className="color-img" alt="black color play"/>
                        </div>
                        <div className="random piece-button" onClick={(e) => playOnline(e, Math.random() < 0.5 ? 1 : -1)}>
                            <img src={half_queen} className="color-img" alt="random color play"/>
                        </div>
                    </div>
                    <div className="link-container">
                        <p className="link-text">{lang === "en" ? "Invite your friend to a match:" : lang === "ro" ? "Invită-ți prietenul la un meci:" : "Hívd meg a barátodat egy meccsre"} </p>
                        
                        <div className="link">
                            <label htmlFor="link-input">
                                <input type="text" className="link-input" value={`${window.location.href}${id}`} ref={inputLinkRef} onFocus={e => setStop(true)} onBlur={e => setStop(false)} readOnly/>
                            </label>
    
                            <div className="copy-button" onClick={(e) => copyLink(e)} ref={copyButtonRef}>
                                <FontAwesomeIcon 
                                    icon={faCheck}
                                    className="fa copy-icon"
                                    ref={copyIconRef}
                                />
                                
                            </div>
                        </div>
                        
                    </div>

                    <div className="icon"></div>
    
                    {/* <div className="icon">
                        
                    </div>
    
                    <div className="icon">
                        
                    </div> */}

                    <div className="start">
                        <button className="start-button" onClick={() => clickSound(`/${id}`)}>{lang === "en" ? "Start game!" : lang === "ro" ? "Incepe jocul!" : "Játék kezdése!"}</button>
                    </div>
                    
                </div>
    
                <div className="computer-mode game-mode" onMouseEnter={() => hoverSound()}>
                    <div className="title">
                            <h2>{lang === "en" ? "Computer" : lang === "ro" ? "Calculator" : "Számítógép"} </h2>
    
                            <div className="icon">
                                <FontAwesomeIcon 
                                    icon={faUser} 
                                    color="#fff"
                                    className="mode-icon"
                                />

                                <FontAwesomeIcon 
                                    className="mode-icon board-icon"
                                    icon={faChessBoard}
                                />
                                
                                <FontAwesomeIcon 
                                    className="mode-icon"
                                    icon={faMicrochip}
                                />

                                {/* <ReactLogo /> */}
                            </div>
                    </div>
    
                    <div className="colors">
                        <div className="white piece-button clicked" onClick={(e) => playComputer(e, 1)}>
                            <img src={white_queen} className="color-img" alt="white color play"/>
                        </div>
                        <div className="black piece-button" onClick={(e) => playComputer(e, -1)} >
                            <img src={black_queen} className="color-img" alt="black color play"/>
                        </div>
                        <div className="random piece-button" onClick={(e) => playComputer(e, Math.random() < 0.5 ? 1 : -1)}>
                            <img src={half_queen} className="color-img" alt="random color play"/>
                        </div>
                    </div>
                  
                    <div className="difficulty-selection">
                        <div ref={difficultyRef} className="difficulty" onClick={(e) => {
                            difficultiesRef.current.classList.toggle("show");
                            difficultyRef.current.classList.toggle("show");
                        }}>
                            
                            <p>{lang === "en" ? "Choose your difficulty" : lang === "ro" ? "Alege-ți dificultatea" : "Válassza ki a nehézséget"}</p>
                            <FontAwesomeIcon
                                icon={faAngleDown}
                                color="#fff"
                                className="angle-icon"
                            />
                        </div>
                       
                    </div>
    
                    <div className="difficulties" ref={difficultiesRef}>
                        <div className="difficulty active" onClick={(e) => changeDifficulty(e)}>{lang === "en" ? "Easy" : lang === "ro" ? "Uşor" : "Könnyen"}</div>
                        <div className="difficulty" onClick={(e) => changeDifficulty(e)}>{lang === "en" ? "Medium" : lang === "ro" ? "Mediu" : "Közepes"}</div>
                        <div className="difficulty" onClick={(e) => changeDifficulty(e)}>{lang === "en" ? "Hard" : lang === "ro" ? "Greu" : "Kemény"}</div>
                        {/* <div className="difficulty" onClick={(e) => changeDifficulty(e)}>Very Hard</div> */}
                    </div>
    
                    <div className="start">
                        <Link to="/computer">
                            <button className="start-button" onClick={() => startComputerGame()}>{lang === "en" ? "Start game!" : lang === "ro" ? "Incepe jocul!" : "Játék kezdése!"}</button>
                        </Link>
                    </div>
                    
                </div>
 
            </div>
        </div>
        
    );
};