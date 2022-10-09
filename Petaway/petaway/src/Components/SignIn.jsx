import { useState } from "react";
import Header from "./Header";
import "../Styles/SignIn.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDog, faEnvelope, faIdCard, faKey, faPaw } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function SignIn() {

    const navigate = useNavigate();
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
                email: email,
                password: password
            })
        };

        const responseJSON = await fetch(`${url}:8080/sign-in`, options);
        const response = await responseJSON.json();
        console.log(response.message);
        if (response.message) {
            localStorage.setItem("token", response.data);
            localStorage.setItem("logged", true);
            navigate("/");
        }
    };

    return (
        <div className="signin-page">
            <Header />
            <div className="big-container">

                <div className="forms-container">
                    <h2 className="title">Sign in to your account<span>.</span> <FontAwesomeIcon icon={faPaw} className="paw-icon" /></h2>
                    <p className="diff-sign">Don't have an account? <span onClick={() => navigate("/sign-up")}>Create account.</span></p>

                    <div className="input-container">
                        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}/>
                        <FontAwesomeIcon icon={faEnvelope} className="button-icon" />
                    </div>

                    <div className="input-container">
                        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                        <FontAwesomeIcon icon={faKey} className="button-icon" />
                    </div>
               
                    <button type="button" className="sign-button" onClick={async () => await submit()}>Sign in <FontAwesomeIcon icon={faDog} className="button-icon" /></button>
                </div>
                <div className="background-container">
                   
                </div>
            </div>
           
        </div>
    );
};