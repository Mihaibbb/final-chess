import Header from "./Header";
import "../Styles/SignIn.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDog, faEnvelope, faIdCard, faKey, faPaw } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SignUp() {

    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const url = window.location.href.split(":")[0] + ":" + window.location.href.split(":")[1];
    

    const submit = async () => {
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
            })
        };
        console.log(url);
        const responseJSON = await fetch(`${url}:8080/sign-up`, options);
        const response = await responseJSON.json();
        console.log(response.message, response.error);
        if (response.message) {
            localStorage.setItem("logged", true);
            navigate("/");
        }
    };

    return (
        <div className="signin-page">
            <Header />

            <div className="big-container">
                <div className="forms-container">
                    <h2 className="title">Create account<span>.</span> <FontAwesomeIcon icon={faPaw} className="paw-icon" /></h2>
                    <p className="diff-sign">Have an account? <span onClick={() => navigate("/sign-in")}>Sign in.</span></p>
                    <div className="input-container">
                        <input type="text" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)}/>
                        <FontAwesomeIcon icon={faIdCard} className="button-icon" />
                    </div>

                    <div className="input-container">
                        <input type="text" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)}/>
                        <FontAwesomeIcon icon={faIdCard} className="button-icon" />
                    </div>

                    <div className="input-container">
                        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}/>
                        <FontAwesomeIcon icon={faEnvelope} className="button-icon" />
                    </div>

                    <div className="input-container">
                        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/>
                        <FontAwesomeIcon icon={faKey} className="button-icon" />
                    </div>
                
                    <button type="button" className="sign-button" onClick={async () => await submit()} >Sign in <FontAwesomeIcon icon={faDog} className="button-icon" /></button>
                </div>
                <div className="background-container">
                    
                </div>
            </div>
            
        </div>
    );
};