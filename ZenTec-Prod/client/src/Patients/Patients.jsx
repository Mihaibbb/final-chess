import { faEllipsis, faPlus, faSearch, faTimes, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Components/Header/Header";
import Navigation from "../Components/Navigation/Navigation";
import "./Patients.css";

const Patients = ({ data }) => {
    
    const [patients, setPatients] = useState([]);
    const [query, setQuery] = useState("");
    const navigation = useNavigate();
    const location = useLocation();
    const optionsRef = useRef([]);

    const [cookies, setCookie] = useCookies();

    // const patients = [
    //     {
    //         name: 'Mihai',
    //         surname: 'Barbu',
    //         phone: "0760331322"
    //     },

    //     {
    //         name: 'Claudiu',
    //         surname: 'Barbu',
    //         phone: "0732048431"
    //     },

    //     {
    //         name: 'Mihai',
    //         surname: 'Barbu',
    //         phone: "0760331322"
    //     },

    //     {
    //         name: 'Claudiu',
    //         surname: 'Barbu',
    //         phone: "0732048431"
    //     },

    //     {
    //         name: 'Mihai',
    //         surname: 'Barbu',
    //         phone: "0760331322"
    //     },

    //     {
    //         name: 'Claudiu',
    //         surname: 'Barbu',
    //         phone: "0732048431"
    //     }
    // ];

    const getPatients = async () => {
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                _id: data.organisation._id
            })
        };
        try {
            const request = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/get-patients`, options);
            const response = await request.json();
            console.log(await response);
            if (!await response.success) return;

            setPatients(await response.patients);

        } catch (e) {
            console.log(e);
        }
     

    };

    const removePatient = async (patientId) => {
        const options = {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                _id: data.organisation._id,
                patientId
            })
        };
        
        try {
            const request = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/remove-patient`, options);
            const response = await request.json();
            console.log(response);
            if (response.success) window.location.reload()
        } catch (e) {
            console.log(e);
        }
   
    };

    const triggerOptions = (idx) => {
        optionsRef.current[idx].classList.toggle("show");
        optionsRef.current.forEach((option, currIdx) => currIdx !== idx && option.classList.remove("show"));
        
    };

    useEffect(() => {
        (async () => {
            await getPatients();
        })();
    }, []);

    useEffect(() => {
        if (query === "") {
            (async () => {
                await getPatients();
            })();
            return;
        }
        (async () => {
            const options = {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    organisationId: data.organisation._id,
                    searchQuery: query
                })
            };

            const request = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/search-patient`, options);
            const response = await request.json();
            console.log(response);
            if (response.success) setPatients(response.patients || []);
            
        })();
    }, [query]);

    return (
        <div className="patients">
            <Navigation page="patients" />

            <div className="content">
                <Header data={data} />
                {location.state?.message && <div className="message">{location.state?.message[cookies['language']]}</div>}
                <h2 className="title">{cookies.language === "en" ? "Patients" : "Pacienti"}</h2>

                {patients.length > 0 && <div className="search-container">
                    <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder={cookies.language === "en" ? "Search patient..." : "Cauta pacient..."} />
                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                </div>}

                <div className="patients-container">
                    {patients.length > 0 && <div className="first-row">
                        <div className="column">
                            <p>{cookies.language === "en" ? "File Nr." : "Nr. fisa"}</p>
                        </div>
                        <div className="column">
                            <p>{cookies.language === "en" ? "First Name" : "Nume"}</p>
                        </div>
                        <div className="column">
                            <p>{cookies.language === "en" ? "Last Name" : "Prenume"}</p>
                        </div>
                        <div className="column">
                            <p>{cookies.language === "en" ? "Phone" : "Telefon"}</p>
                        </div>
                        <div className="column">
                            <p>{cookies.language === "en" ? "Options" : "Optiuni"}</p>
                        </div>
                    </div>}

                    {patients.length > 0 ? patients.map((patient, idx) => (
                        <div className="row" key={idx}>
                            <div className="column">
                                <p>{idx + 1}</p>
                            </div>

                            <div className="column">
                                <p>{patient.firstname}</p>
                            </div>
                            <div className="column">
                                <p>{patient.lastname}</p>
                            </div>
                            <div className="column">
                                <p>{patient.phone}</p>
                            </div>
                            <div className="column pressable" onClick={() => triggerOptions(idx)}>
                                <FontAwesomeIcon className="column-icon" icon={faEllipsis}/>
                                <div className="options-container" ref={ref => optionsRef.current[idx] = ref}>
                                    <div className="option" onClick={async () => optionsRef.current[idx].classList.contains("show") ? await removePatient(patient._id) : null}>
                                        <FontAwesomeIcon icon={faTimes} className="option-icon" /> 
                                        <p>{cookies.language === "en" ? "Remove" : "Sterge"}</p>
                                    </div>

                                    <div className="option" onClick={() => navigation(`/patient/${patient._id}`, { state: { patient: patient } })}>
                                        <FontAwesomeIcon icon={faUser} className="option-icon" />
                                        <p>{cookies.language === "en" ? "View profile" : "Vezi profil"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <h2 className="center">{cookies.language === "en" ? "No patients" : "Niciun pacient"}</h2>
                    )}
                </div>

                <div className="add-button" onClick={() => navigation("/create-patient")}>
                    <FontAwesomeIcon icon={faPlus} className="add-icon"/>
                </div>
            </div>
        </div>
    );

   
};

export default Patients;