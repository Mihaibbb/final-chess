import {useState, useEffect, useRef} from "react";
import Header from "./Header";
import "../styles/account.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faChess, faChessPawn, faEllipsisVertical, faPlus, faTrophy, faUserFriends} from "@fortawesome/free-solid-svg-icons"
import noUser from "../image/no-user.jpg";

export default function Account() {

    const uploadRef = useRef();
    const submitPhotoRef = useRef();

    const [lang, setLang] = useState(localStorage.getItem("language") ? JSON.parse(localStorage.getItem("language")) : "en");
    const [isUpdated, setIsUpdated] = useState(false);
    const [rank, setRank] = useState(null);
    const username = localStorage.getItem("c-username") ? JSON.parse(localStorage.getItem("c-username")) : null;
    const email = localStorage.getItem("c-email") ? JSON.parse(localStorage.getItem("c-email")) : null;
    const id = localStorage.getItem("c-id") ? JSON.parse(localStorage.getItem("c-id")) : null;
    const friends = localStorage.getItem("c-friends") ? JSON.parse(localStorage.getItem("c-friends")) : null;
    const points = localStorage.getItem("c-points") ? JSON.parse(localStorage.getItem("c-points")) : null;
    const languageCallback = (language) => {
        setLang(language);
    };

    const [emailInput, setEmailInput] = useState(email);
    const [usernameInput, setUsernameInput] = useState(username);

    useEffect(() => localStorage.setItem("language", JSON.stringify(lang)), [lang]);
    useEffect(() => {
        (async() => {
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: id
                })
            };

            const dataJSON = await fetch("http://localhost:8000/get-rank", options);
            const data = await dataJSON.json();
            if (data.rank) setRank(data.rank);
            
        })();
    });

    const uploadPhoto = () => {
        uploadRef.current.click();
        uploadRef.current.addEventListener("change", (e) => {
            submitPhotoRef.current.click();
        });
    };

    return rank && (
        <div className="container">
            <Header languageCallback={languageCallback}/>

            <div className={`account-container ${friends && friends.length !== 0 ? "": "no-friends"}`}>
                <div className="account-list">
                    {/* <h1 className="name">{username}</h1> */}
                    <div className="account-profile">
                        <div className="photo">
                            <img src={noUser} alt="no user photo"/>
                            <FontAwesomeIcon
                                icon={faPlus}
                                className="upload-photo"
                                onClick={() => uploadPhoto()}
                            />
                            <form action="http://localhost:8000/upload-image" encType="multipart/form-data" method="post">
                                <input type="file" name="image" accept='image/' ref={uploadRef}/>
                                <input type="submit" ref={submitPhotoRef}/>
                            </form>  
                        
                        </div>

                        <h1 className="name">{username}</h1>
                        
                    </div>
                    
                    <div className="game-stats">
                        <div className="total-points">
                            <h2>{points}</h2>
                            <p>points</p>
                        </div>

                        <div className="rank">
                            <h2>Your rank is 
                                <span style={{color: rank === 1 ? "#f4c430" : rank === 2 ? "silver" : rank === 3 ? "bronze" : "initial"}}>#{rank}</span>
                                <FontAwesomeIcon 
                                    icon={faTrophy}
                                    color="orange"
                                />
                            </h2>
                        </div>
                    </div>

                    {/* <div className="user-profile">
                        <div className="email-container">
                            <h2>Email: </h2>
                            <input type="text" value={emailInput} onChange={(e) => setEmailInput(e.target.value)}/>
                        </div>

                        <div className="username-container">
                            <h2>Username: </h2>
                            <input type="text" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)}/>
                        </div>

                        <div className={isUpdated ? "update visible" : "update"}>
                            <button type="button">Update profile</button>
                        </div>
                    </div> */}

                    
                </div>
                {friends && friends.length !== 0 && <div className="friends-list">
                    <h2>Friends</h2>
                    <div className="friends-content">
                        {friends.map((friendName, friendIdx) => (
                            <div className="friend" key={friendIdx}>
                                <FontAwesomeIcon
                                    className="friend-icon"
                                    icon={faUserFriends}
                                />

                                <p>{friendName}</p>

                                <FontAwesomeIcon
                                    className="options-icon"
                                    icon={faEllipsisVertical}
                                />
                            </div>
                        ))}
                    </div>
                </div>}
            </div>
        </div>
    );
};