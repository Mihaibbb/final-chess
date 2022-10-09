import { useEffect } from "react";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Components/Header/Header";
import Navigation from "../Components/Navigation/Navigation";
import InputColor from "react-input-color";

const CreateUser = () => {

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [type, setType] = useState("Doctor");
    const [doctorColor, setDoctorColor] = useState({});
    const [startHour, setStartHour] = useState(9);
    const [endHour, setEndHour] = useState(17);
    const [cookies, setCookie] = useCookies();

    const navigate = useNavigate();
    const location = useLocation();

    const { _id, organisationName } = location.state;

    if (!_id) navigate(-1);

    const createNewUser = async () => {

        if (password !== repeatPassword) setErrorMessage(cookies.language === "en" ? "Passwords must be the same!" : "Parolele nu trebuie sa difere!");
        if (username.length < 4) setErrorMessage(cookies.language === "en" ? "Username must have 4 characters minimum." : "Username-ul trebuie sa aiba minim 4 caractere.");

        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                username,
                email,
                password,
                type,
                organisationId: _id,
                adminId: cookies["user-id"],
                color: doctorColor,
                startHour,
                endHour
            })
        };

        const request = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/organisation/create-user`, options);
        const response = await request.json();
        if (!response.success) setErrorMessage(response.message[cookies.language]);
        else navigate("/dashboard", { state: { message: { en: "User created successfully!", ro: "Utilizator creat cu succes!" } } });
        
    };


    useEffect(() => {
        console.log(type);
    }, [type]);


    return (
        <div className="center-container">
            <div className="image"></div>
            <div className="login-container">
                <h2 className="title">{cookies.language === "en" ? "Create User" : "Creeaza utilizator"}</h2>
                <div className="login-inputs">

                    <div className="input">
                        <p>{cookies.language === "en" ? "Name" : "Nume"}</p>
                        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
                    </div>

                    <div className="input">
                        <p>{cookies.language === "en" ? "Username" : "Nume de utilizator"}</p>
                        <input type="text" placeholder={cookies.language === "en" ? "Username" : "Nume de utilizator"} value={username} onChange={e => setUsername(e.target.value)} />
                    </div>

                    <div className="input">
                        <p>{cookies.language === "en" ? "Email" : "Adresa de email"}</p>
                        <input type="text" placeholder={cookies.language === "en" ? "Email" : "Adresa de email"} value={email} onChange={e => setEmail(e.target.value)} />
                    </div>

                    <div className="input">
                        <p>{cookies.language === "en" ? "Password" : "Parola"}</p>
                        <input type="password" placeholder={cookies.language === "en" ? "Password" : "Parola"} value={password} onChange={e => setPassword(e.target.value)} />
                    </div>

                    <div className="input">
                        <p>{cookies.language === "en" ? "Repeat password" : "Repeta parola"}</p>
                        <input type="password" placeholder={cookies.language === "en" ? "Repeat password" : "Repeta parola"} value={repeatPassword} onChange={e => setRepeatPassword(e.target.value)} />
                    </div>

                    <div className="selection">
                        <p>{cookies.language === "en" ? "Type of user: " : "Tipul de utilizator"}</p>
                        <select value={type} onChange={e => setType(e.target.value)}>
                            <option value="Doctor">Doctor</option>
                            <option value="Reception">{cookies.language === "en" ? "Reception" : "Receptie"}</option>
                        </select>
                    </div>

                    {type === "Doctor" && 
                        <div className="input-color">
                            <p>{cookies.language === "en" ? "Doctor's color" : "Culoare doctor: "}</p>
                            <InputColor 
                                initialValue="#5e72e4"
                                onChange={setDoctorColor}
                            >
                                <div
                                    style={{
                                    width: 50,
                                    height: 50,
                                    marginTop: 20,
                                    backgroundColor: doctorColor.rgba,
                                    }}
                                />
                            </InputColor>
                        </div>
                    }

                    {/* <div className="input">
                        <input type="checkbox" checked={rememberMe} onClick={() => setRememberMe(currRememberMe => !currRememberMe)}/>
                        <p>Remember Me</p>
                    </div> */}

                    <button type="text" onClick={async () => await createNewUser()}>
                        <p>{cookies.language === "en" ? "Add user" : "Adauga utilizator"}</p>
                    </button>

                    <p className="error-text">{errorMessage}</p>
                </div>
            </div>
        </div>
    );
};

export default CreateUser;
