import React, {useState, useEffect, useRef} from "react";
import Header from "./Header";
import tutorialJson from "../json/tutorial.json";

import "../styles/tutorial.css";
import PracticeBoard from "./PracticeBoard";
import Board from "./Board";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";


export default function Tutorial() {

    const chapters = tutorialJson.modules;

    const [lang, setLang] = useState(localStorage.getItem("language") ? JSON.parse(localStorage.getItem("language")) : "en");
    const [content, setContent] = useState(null);
    const [currChapter, setCurrChapter] = useState(Object.values(chapters)[0].chapters);
    const [currChapterName, setCurrChapterName] = useState(Object.values(chapters)[0][`title_${lang}`]);
    const [currSubChapterName, setCurrSubChapterName] = useState(null);
    const [currSubChapter, setCurrSubChapter] = useState(null);
    const [currChapterIdx, setCurrChapterIdx] = useState(0);
    const [currSubChapterIdx, setCurrSubChapterIdx] = useState(0);

    const chaptersRef = useRef();

    useEffect(() => {
        if (localStorage.length !== 0) {
            for (let i = 0, len = localStorage.length; i < len; i++) {
                const key = localStorage.key(i);
                if (key === null) continue;
                if (key.search("classic-") !== -1) localStorage.removeItem(key);
            }
        }
    }, []);

    useEffect(() => console.log(currChapter), [currChapter]);

    const stopTimer = () => {

    };

    const nextLesson = () => {
        const newSubChapterIdx =  currSubChapterIdx + 1;
        if (newSubChapterIdx < Object.values(currChapter).length) {
            setCurrSubChapter(Object.values(currChapter)[newSubChapterIdx].description);
            setCurrSubChapterIdx(newSubChapterIdx);
            setCurrSubChapterName(Object.values(currChapter)[newSubChapterIdx][`title_${lang}`]);
            return;
        }

        const newChapterIdx = currChapterIdx + 1;
        const newChapter = Object.values(chapters)[newChapterIdx];
        const newSubChapter = Object.values(newChapter.chapters)[0];
        setCurrChapterIdx(newChapterIdx);
        setCurrChapter(newChapter.chapters);
        setCurrChapterName(newChapter[`title_${lang}`]);
        setCurrSubChapterIdx(0);
        setCurrSubChapter(newSubChapter.description);
        setCurrSubChapterName(newSubChapter[`title_${lang}`]);
    };

    const backLesson = () => {
        const newSubChapterIdx =  currSubChapterIdx - 1;
        if (newSubChapterIdx >= 0) {
            setCurrSubChapter(Object.values(currChapter)[newSubChapterIdx].description);
            setCurrSubChapterIdx(newSubChapterIdx);
            setCurrSubChapterName(Object.values(currChapter)[newSubChapterIdx][`title_${lang}`]);
            return;
        }


        const newChapterIdx = currChapterIdx - 1;
        if (newChapterIdx < 0) return;
        const newChapter = Object.values(chapters)[newChapterIdx];
        const newSubChapter = Object.values(newChapter.chapters)[Object.values(newChapter.chapters).length - 1];
        setCurrChapterIdx(newChapterIdx);
        setCurrChapter(newChapter.chapters);
        setCurrChapterName(newChapter[`title_${lang}`]);
        setCurrSubChapterIdx(Object.values(newChapter.chapters).length - 1);
        setCurrSubChapter(newSubChapter.description);
        setCurrSubChapterName(newSubChapter[`title_${lang}`]);
    };
    
    return (
        <div className="container">
            <Header />
            <div className="banner">
                <h2 className="center-text">Tutorial for absolute beginners!</h2>
            </div>

            <div className="content-tutorial">
                <div className="chapters">
                    {Object.values(chapters).map((chapter, idx) => (
                        <div className="chapter" key={idx} onClick={() => {
                            chaptersRef.current.classList.remove("total_hide");
                            chaptersRef.current.classList.remove("hide");
                           
                                setCurrChapterIdx(idx);
                                setCurrSubChapterIdx(0);
                                setCurrChapter(chapter.chapters);
                                setCurrChapterName(chapter[`title_${lang}`])
                                setCurrSubChapter(null);
                                setCurrSubChapterName(null);
                            
                        }}>
                            <p>{idx + 1}. {chapter[`title_${lang}`]}</p>
                            <div className="tick"></div>
                        </div>
                    ))}
                </div>
                
                <div ref={chaptersRef} className={`description-tutorial`}>
                    <h2 className="chapter-title">{currChapterName}</h2>
                    <div className="chapter-content">
                        {Object.values(currChapter).map((chapter, idx) => (
                            <div className="content-text" key={idx} onClick={(e) => {
                                chaptersRef.current.classList.add("hide");
                                chaptersRef.current.addEventListener("transitionend", () => {
                                    chaptersRef.current.classList.add("total_hide");
                                    setCurrSubChapterName(chapter[`title_${lang}`]);
                                    setCurrSubChapter(chapter.description);
                                    setCurrSubChapterIdx(idx);
                                });
                            }}>
                                <p className="subchapter-title">{chapter[`title_${lang}`]}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`subchapter-description ${currSubChapter ? "show" : null}`}>
                    <div className="subchapter-title">{currSubChapterName}</div>
                   
                        {currSubChapter && (
                            <div className="subchapter-content">
                                <p className="description">{currSubChapter[`text_${lang}`]}</p>
                                {currSubChapter[`text_2_${lang}`] && (
                                    <p className="description">{currSubChapter[`text_2_${lang}`]}</p>
                                )}
                                
                                <div className="board-container-lesson">
                                    {currSubChapter.board === "classic" ? (
                                        <Board color={1} stopTimer={stopTimer} lesson={true}/>
                                    ) : currSubChapter.board === "practice" ? (
                                        <PracticeBoard pieceCode={currSubChapter.pieceCode} lesson={true} />
                                    ) : null}       
                                </div>

                                <div className="lesson-buttons">
                                    {(currChapterIdx - 1 >= 0 || currSubChapterIdx - 1 >= 0) && <button className="previous-lesson" type="click" onClick={() => backLesson()}>
                                        <h3> <FontAwesomeIcon 
                                                icon={faAngleLeft}
                                                color="#fff"
                                                className="prev-icon"
                                            />
                                            Previous lesson 
                                        </h3>
                                    </button>}
                                    {(currChapterIdx + 1 < Object.values(chapters).length || currSubChapterIdx + 1 < Object.values(Object.values(chapters)[currChapterIdx]).length)&& <button className="next-lesson" type="click" onClick={() => nextLesson()}>
                                        <h3>Next lesson 
                                            <FontAwesomeIcon 
                                                icon={faAngleRight}
                                                color="#fff"
                                                className="next-icon"
                                            />
                                        </h3>
                                    </button>}
                                </div>

                                
                            </div>
                        )}
                    
                </div>
            </div>
        </div>
    );
};