import { faAngleDown, faAngleUp, faCheck, faTicket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Components/Header/Header";
import Navigation from "../Components/Navigation/Navigation";
import "./CreatePatient.css";

const CreatePatient = ({ data }) => {

    const location = useLocation();
    const navigate = useNavigate();
    const cookies = useCookies();

    const birthRef = useRef();
    const gendersRef = useRef([]);
    const genders = cookies.language === "en" ? ['Male', 'Female', 'Not mentioned'] : ['Barbat', 'Femeie', 'Nespecificat'];

    const [doctors, setDoctors] = useState([]);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [email, setEmail] = useState(null);
    const [county, setCounty] = useState(null);
    const [city, setCity] = useState(null);
    const [address, setAddress] = useState(null);
    const [currGender, setCurrGender] = useState(null);
    const [fileNumber, setFileNumber] = useState(null);
    const [PIC, setPIC] = useState(null);
    const [notes, setNotes] = useState(null);
    const [doctor, setDoctor] = useState(null);
    const [dropMenu, setDropMenu] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [numberPatients, setNumberPatients] = useState();

    const createNewPatient = async () => {
        if (firstName === "" || lastName === "" || phoneNumber === "" || birthDate === "") {
            setErrorMessage(cookies.language === "en" ? "Please fill every required field!" : "Te rog completeaza fiecare camp!");
            return;
        }
        let realPhoneNumber = phoneNumber.length > 10 ? `+${phoneNumber}` : phoneNumber;
        console.log(birthDate);
        const birthDateJS = new Date(birthDate);
        const phoneNumberValidation =  /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        const phoneNumberSecondValidation = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g;
        if (!realPhoneNumber.match(phoneNumberValidation) && !realPhoneNumber.match(phoneNumberSecondValidation)) {
            setErrorMessage(cookies.language === "en" ? "Please enter a valid phone number!" : "Te rog introdu un numar de telefon valid!");
            console.log("error");
            return;
        }

        const emailValidation = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (email && email.length > 0 && !email.match(emailValidation)) {
            setErrorMessage(cookies.language === "en" ? "Please enter a valid email address!" : "Te rog introdu o adresa de email valida!");
            return;
        }

        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                _id: data.organisation._id,
                firstname: firstName,
                lastname: lastName,
                username,
                email,
                phone: realPhoneNumber,
                birthdate: birthDate,
                cnp: PIC,
                gender: currGender,
                city,
                county,
                address,
                doctors: doctor,
                notes,
                fileNumber: fileNumber
            })
        };
        try {
            const request = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/create-patient`, options);
            const response = await request.json();
            if (!await response.success) {
                console.log(await response.message);
                setErrorMessage(await response.message[cookies.language]);
                return;
            }
            navigate("/patients", { state: { message: { en: "Patient added successfully!", ro: "Pacient adaugat cu succes." } } });

        } catch (e) {
            console.log(e);
        }
        

    };

    const getDoctors = async () => {
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                _id: data.organisation._id
            })
        };

        const request = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/get-doctors`, options);
        const response = await request.json();
        if (response.success && response.doctors) setDoctors(response.doctors);
    };

    const getNumberOfPatients = async () => {
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                _id: data.organisation._id
            })
        };

        const request = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/get-patients`, options);
        const response = await request.json();
        console.log(response);
        if (response.success) setFileNumber(response.patients.length + 1);
        else setFileNumber(1);
    };

    const toggleGender = idx => {
        gendersRef.current[idx].classList.toggle("active");
        gendersRef.current.forEach((gender, currIdx) => currIdx !== idx && gender.classList.remove("active"));
        setCurrGender(gendersRef.current[idx].classList.contains("active") ? genders[idx] : "");
    };

    useEffect(() => {
        (async() => {
            await getDoctors();
            await getNumberOfPatients();
        })();
    }, []);

    useEffect(() => {
        if (!birthRef.current) return;
        const today = new Date();
        let day = today.getDate();
        let month = today.getMonth() + 1; //January is 0!
        const year = today.getFullYear();
        
        if (day < 10) {
           day = '0' + day;
        }
        
        if (month < 10) {
           month = '0' + month;
        } 
            
        const inputMax = `${year}-${month}-${day}`;
        const inputMin = `${year - 100}-${month}-${day}`;
        birthRef.current.setAttribute("max", inputMax);
        birthRef.current.setAttribute("min", inputMin);

    }, [birthRef]);

    return (
        <div className="create-patient">
            <Navigation />
            <div className="content">
                <Header data={data} />
                <h2 className="title">{cookies.language === "en" ? "Create new patient" : "Creeaza un nou pacient"}</h2>
                <div className="form">
                    <div className="input">
                        <p>{cookies.language === "en" ? "First Name" : "Nume"}</p>
                        <input type="text" placeholder={cookies.language === "en" ? "First Name" : "Nume"} value={firstName} onChange={e => setFirstName(e.target.value)} required />
                    </div>

                    <div className="input">
                        <p>{cookies.language === "en" ? "Last Name" : "Prenume"}</p>
                        <input type="text" placeholder={cookies.language === "en" ? "Last Name" : "Prenume"} value={lastName} onChange={e => setLastName(e.target.value)} required />
                    </div>

                    <div className="input">
                        <p>{cookies.language === "en" ? "Phone number" : "Numar de telefon"}</p>
                        <input type="number" placeholder={cookies.language === "en" ? "Phone number" : "Numar de telefon"} value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} required />
                    </div>

                    <div className="input">
                        <p>{cookies.language === "en" ? "Birthdate" : "Data de nastere"}</p>
                        <input type="date" placeholder={cookies.language === "en" ? "Birthdate" : "Data de nastere"} ref={birthRef} value={birthDate} onChange={e => setBirthDate(e.target.value)} required />
                    </div>

                    {data.user.type !== "doctor" && doctors.length > 0 ? (
                        <div className="input">
                            <p>Doctor</p>
                            <select value={doctor} onChange={e => setDoctor(e.target.value)}>
                                {doctors.map((doctor, idx) => (
                                    <option value={doctor.name} key={idx}>
                                        {doctor.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : null}

                    <div className="info">
                        <p>{cookies.language === "en" ? "Optional fields" : "Campuri optionale"}</p>
                        <FontAwesomeIcon className={`option-icon ${dropMenu ? "active" : ""}`} icon={faAngleDown} onClick={() => setDropMenu(currStatus => !currStatus)}/>
                    </div>
                   
                    {dropMenu && 
                    <>
                        <div className="input">
                            <p>{cookies.language === "en" ? "Email" : "Adresa de email"}</p>
                            <input type="email" placeholder={cookies.language === "en" ? "Email" : "Adresa de email"} value={email || ""} onChange={e => setEmail(e.target.value)} />
                        </div>

                        <div className="input">
                            <p>{cookies.language === "en" ? "Country" : "Tara"}</p>
                            <input type="text" placeholder={cookies.language === "en" ? "Country" : "Tara"} value={county || ""} onChange={e => setCounty(e.target.value)} />
                        </div>

                        <div className="input">
                            <p>{cookies.language === "en" ? "City" : "Oras"}</p>
                            <input type="text" placeholder={cookies.language === "en" ? "City" : "Oras"} value={city || ""} onChange={e => setCity(e.target.value)} />
                        </div>

                        <div className="input">
                            <p>{cookies.language === "en" ? "Address" : "Adresa"}</p>
                            <input type="text" placeholder={cookies.language === "en" ? "Address" : "Adresa"} value={address || ""} onChange={e => setAddress(e.target.value)} />
                        </div>

                        <div className="input">
                            <p>{cookies.language === "en" ? "Gender" : "Sex"}</p>
                            <div className="options">
                                {genders.map((gender, idx) => (
                                    <div className="option" key={idx} ref={ref => gendersRef.current[idx] = ref}>
                                        <div className="circle" onClick={() => toggleGender(idx)}>
                                            
                                            <FontAwesomeIcon icon={faCheck} className={`active-icon`} />
                                            
                                        </div>
                                        <p>{gender}</p>
                                    </div>
                                ))}
                            
                            </div>
                        </div>
                        
                        <div className="input">
                            <p>{cookies.language === "en" ? "File Number" : "Nr. fisa"}</p>
                            <input type="number" placeholder={cookies.language === "en" ? "File Number" : "Nr. fisa"} value={fileNumber || ""} onChange={e => setFileNumber(e.target.value)}/>
                        </div>

                        <div className="input">
                            <p>{cookies.language === "en" ? "PIC" : "CNP"}</p>
                            <input placeholder={cookies.language === "en" ? "Personal Identification Code" : "Cod Numeric Personal"} value={PIC || ""} onChange={e => setPIC(e.target.value)}/>
                        </div>

                        <div className="input">
                            <p>{cookies.language === "en" ? "Notes" : "Observatii"}</p>
                            <textarea placeholder={cookies.language === "en" ? "Notes" : "Observatii"} value={notes || ""} onChange={e => setNotes(e.target.value)} />
                        </div>
                    </>
                    }

                   

                    <button type="button" onClick={async () => await createNewPatient()}>{cookies.language === "en" ? "Add patient" : "Adauga pacient"}</button>
                </div>
            </div>
        </div>
    );
};

export default CreatePatient;