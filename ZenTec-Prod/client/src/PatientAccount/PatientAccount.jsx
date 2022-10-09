import { faAddressBook, faAddressCard, faCheck, faCity, faEnvelope, faIdBadge, faMars, faNoteSticky, faPhone, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../Components/Header/Header";
import Navigation from "../Components/Navigation/Navigation";
import "./PatientAccount.css";

const PatientAccount = ({ data }) => {

    const navigation = useNavigate();
    const param = useParams();
    const location = useLocation();
   
    const [cookies, setCookie] = useCookies();


    console.log(location?.state, data);
    
        
    if (!param?.id) navigation(-1);
   

    const patient = location?.state?.patient;

    const initialFirstName = patient.firstname;
    const initialLastName = patient.lastname;
    const initialUsername = patient.username || "";
    const initialPhone = patient.phone;
    const initialEmail = patient.email || "";
    const initialCity = patient.city || "";
    const initialCounty = patient.county || "";
    const initialAddress = patient.address || "";
    const initialGender = patient.gender || "";
    const initialFileNumber = patient.fileNumber || "";
    const initialPIC = patient.cnp || "";
    const initialNotes = patient.notes || "";

    
    const [firstName, setFirstName] = useState(initialFirstName);
    const [lastName, setLastName] = useState(initialLastName);
    const [username, setUsername] = useState(initialUsername);
    const [phoneNumber, setPhoneNumber] = useState(initialPhone);
    const [email, setEmail] = useState(initialEmail);
    const [city, setCity] = useState(initialCity); 
    const [county, setCounty] = useState(initialCounty);
    const [address, setAddress] = useState(initialAddress);
    const [gender, setGender] = useState(initialGender);
    const [fileNumber, setFileNumber] = useState(initialFileNumber);
    const [PIC, setPIC] = useState(initialPIC);
    const [notes, setNotes] = useState(initialNotes);
    const [showUpdate, setShowUpdate] = useState(false);
    const [historic, setHistoric] = useState(JSON.parse(patient.historic));
    const [errorMessage, setErrorMessage] = useState();

    const currGenders = cookies.language === "en" ? ['Male', 'Female', 'Not mentioned'] : ['Masculin', 'Feminin', 'Nespecificat'];

    const gendersRef = useRef([]);

    const toggleGender = (idx) => {
        gendersRef.current[idx].classList.toggle("active");
        gendersRef.current.forEach((currGender, currIdx) => currIdx !== idx && currGender.classList.remove("active"));
        setGender(gendersRef.current[idx].classList.contains("active") ? currGenders[idx] : "");
    };

    const checkId = async (parameterId) => {
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                patientId: parameterId,
                organisationId: data.organisation._id
            })
        };
        try {
            const request = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/check-patient`, options);
            const response = await request.json();
            console.log(response);
            if (!response || !response.success) navigation(-1);
            
        } catch (e) {
            console.log(e)
        }
      
    };

    const updateAccount = async () => {
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                patientId: param.id,
                organisationId: data.organisation._id,
                firstname: firstName,
                lastname: lastName,
                username: username,
                email: email,
                phone: phoneNumber,
                birthdate: patient.birthdate,
                cnp: PIC,
                gender: gender,
                city,
                county,
                address,
                doctors: patient.doctors,
                notes,
                fileNumber: fileNumber
            })
        };

        try {
            const request = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/update-patient`, options);
            const response = await request.json();
            console.log(response.message);
            if (!response.success) setErrorMessage(response.message[cookies.language]);
            else navigation("/patients", { 
                state: { 
                    message: response.message
                } 
            });
        } catch(e) {
            console.log(e);
        }
       
    };

    useEffect(() => {
        (async () => {
            await checkId(param.id);
        })();
    }, []);

    useEffect(() => {
        if (
            firstName !== initialFirstName ||
            lastName !== initialLastName ||
            username !== initialUsername ||
            phoneNumber !== initialPhone ||
            email !== initialEmail ||
            city !== initialCity ||
            county !== initialCounty ||
            address !== initialAddress ||
            gender !== initialGender ||
            fileNumber !== initialFileNumber || 
            PIC !== initialPIC ||
            notes !== initialNotes
        ) setShowUpdate(true);
        else setShowUpdate(false);
    }, [firstName, lastName, phoneNumber, username, email, city, county, address, gender, fileNumber, PIC, notes]);

    return (
        <div className="account-container"> 
            <Navigation />

            <div className="content">
                <Header data={data} />

                <div className="patient-account-details">
                    <h2 className="title">{cookies.language === "en" ? "Patient's account details " : "Detalii cont pacient"}</h2>
                    <div className="inputs-container">
                        <div className="input">
                            <div className="input-title">
                                <FontAwesomeIcon className="icon" icon={faUser} />
                                <p>{cookies.language === "en" ? "First name" : "Prenume"}</p>
                            </div>
                            
                            <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)}/>
                        </div>   

                        <div className="input">
                            <div className="input-title">
                                <FontAwesomeIcon className="icon" icon={faUser} />
                                <p>{cookies.language === "en" ? "Last name" : "Nume de familie"}</p>
                            </div>
                            
                            <input type="text" value={lastName} onChange={e => setLastName(e.target.value)}/>
                        </div>  

                        <div className="input">
                            <div className="input-title">
                                <FontAwesomeIcon className="icon" icon={faPhone} />
                                <p>{cookies.language === "en" ? "Phone number" : "Numar de telefon"}</p>
                            </div>
                            
                            <input type="number" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}/>
                        </div> 

                        <div className="input">
                            <div className="input-title">
                                <FontAwesomeIcon className="icon" icon={faEnvelope} />
                                <p>Email</p>
                            </div>
                            
                            <input type="text" value={email} onChange={e => setEmail(e.target.value)}/>
                        </div> 

                        <div className="input">
                            <div className="input-title">
                                <FontAwesomeIcon className="icon" icon={faUser} />
                                <p>{cookies.language === "en" ? "Username" : "Nume utilizator"}</p>
                            </div>
                            
                            <input type="text" value={username} onChange={e => setUsername(e.target.value)}/>
                        </div> 

                        <div className="input">
                            <div className="input-title">
                                <FontAwesomeIcon className="icon" icon={faCity} />
                                <p>{cookies.language === "en" ? "City" : "Oras"}</p>
                            </div>
                            
                            <input type="text" value={city} onChange={e => setCity(e.target.value)}/>
                        </div> 

                        <div className="input">
                            <div className="input-title">
                                <FontAwesomeIcon className="icon" icon={faCity} />
                                <p>{cookies.language === "en" ? "County" : "Judet"}</p>
                            </div>
                            
                            <input type="text" value={county} onChange={e => setCounty(e.target.value)}/>
                        </div> 

                        <div className="input">
                            <div className="input-title">
                                <FontAwesomeIcon className="icon" icon={faAddressCard} />
                                <p>{cookies.language === "en" ? "Address" : "Adresa"}</p>
                            </div>
                            
                            <input type="text" value={address} onChange={e => setAddress(e.target.value)}/>
                        </div> 

                        <div className="input">

                            <div className="input-title">
                                <FontAwesomeIcon className="icon" icon={faMars} />
                                <p>{cookies.language === "en" ? "Gender" : "Sex"}</p>
                            </div>
                            <div className="options">
                                {currGenders.map((currGender, idx) => (
                                    <div className={`option ${currGender === gender ? "active" : ""}`} key={idx} ref={ref => gendersRef.current[idx] = ref}>
                                        <div className="circle" onClick={() => toggleGender(idx)}>
                                            
                                            <FontAwesomeIcon icon={faCheck} className={`active-icon`} />
                                            
                                        </div>
                                        <p>{currGender}</p>
                                    </div>
                                ))}
                            </div>
                           
                            
                        </div>

                        <div className="input">
                            <div className="input-title">
                                <FontAwesomeIcon className="icon" icon={faIdBadge} />
                                <p>{cookies.language === "en" ? "File number" : "Numar fisa"}</p>
                            </div>
                            
                            <input type="number" value={fileNumber} onChange={e => setFileNumber(e.target.value)}/>
                        </div> 

                        <div className="input">
                            <div className="input-title">
                                <FontAwesomeIcon className="icon" icon={faAddressCard} />
                                <p>{cookies.language === "en" ? "PIC" : "CNP"}</p>
                            </div>
                            
                            <input type="number" value={PIC} onChange={e => setPIC(e.target.value)}/>
                        </div> 


                        <div className="input">
                            <div className="input-title">
                                <FontAwesomeIcon className="icon" icon={faNoteSticky} />
                                <p>{cookies.language === "en" ? "Notes" : "Observatii"}</p>
                            </div>
                            
                            <textarea value={notes} onChange={e => setNotes(e.target.value)} />
                        </div> 

                        
                        <button className={`update ${showUpdate ? "active" : ""}`} onClick={async () => showUpdate && await updateAccount()}>
                            <p>{cookies.language === "en" ? "Update account" : "Confirma modificarile"}</p>
                        </button>    
                     
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                    </div> 
                    
                        
                </div>

                <div className="patient-historic">
                    <h2 className="title">{cookies.language === "en" ? "Patient's historic" : "Istoricul pacientului"}</h2>
                    
                    <div className="historic-container">
                        <div className="first-row">
                            <div className="col">{cookies.language === "en" ? "Title" : "Titlu"}</div>
                            <div className="col">{cookies.language === "en" ? "Date" : "Data"}</div>
                            <div className="col">{cookies.language === "en" ? "Interval": "Interval"}</div>
                            <div className="col">{cookies.language === "en" ? "Price": "Cost"}</div>
                        </div>
                        {historic && historic.length > 0 && historic.map(historicItem => (
                            <div className="historic-item">
                                <div className="col">{historicItem.title}</div>
                                <div className="col">{new Date(historicItem.date).getDate()}.{new Date(historicItem.date).getMonth()}.{new Date(historicItem).getFullYear()}</div>
                                <div className="col">{historicItem.startHour}:{historicItem.startMinutes} - {historicItem.endHour}:{historicItem.endMinutes}</div>
                                <div className="col">{historicItem.price} {historicItem.typePrice}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientAccount;