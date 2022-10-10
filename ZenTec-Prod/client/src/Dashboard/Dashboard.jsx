import './Dashboard.css';
import Navigation from '../Components/Navigation/Navigation';
import Header from '../Components/Header/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCab, faCalendar, faCoins, faE, faEllipsis, faUsers } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from "react";
import { useCookies } from 'react-cookie';

const Dashboard = ({ data }) => {

    const [doctors, setDoctors] = useState([]);
    const [nextAppointments, setNextAppointments] = useState([]);
    const [appointments, setAppointments] = useState();
    const [newPatients, setNewPatients] = useState();
    const [income, setIncome] = useState();
    const [filter, setFilter] = useState("month");
    const [typeIncome, setTypeIncome] = useState("");
    
    const [cookies, setCookie] = useCookies();

    const getDoctors = async () => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id: data.organisation._id
            })
        };

        const request = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/get-doctors`, options);
        const response = await request.json();
        if (!response.success) return;
        setDoctors(response.doctors);
    };     
    // Get the following appointments
    const getNextAppointments = async () => {

        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                _id: data.organisation._id
            })
        };

        const request = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/next-appointments`, options);
        const response = await request.json();
        console.log(await response);
        if (response.success) setNextAppointments(response.appointments.map(appointment => {
            return {
                name: `${appointment.patients[0].firstname} ${appointment.patients[0].lastname}`,
                hour: `${new Date(appointment.startDate).getHours()}:${new Date(appointment.startDate).getMinutes()}`,
                income: appointment.income,
                typeIncome: appointment.typeIncome
            };
        }));
    };

    const getStatistics = async () => {
      
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                _id: data.organisation._id,
                filter: filter
            })
        };
        
        try {
            console.log(options, data.organisation._id);
            console.log(`${process.env.REACT_APP_BACKEND_URL}/api/user/get-statistics-data`);
            const request = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/analytics`, options);
            const response = await request.json();
            console.log(await response);
            if (!response.success) return;
            
            setNewPatients(response.patients);
            setAppointments(response.appointments);
            setIncome(response.income);
            setTypeIncome(response.typeIncome);
        } catch (e) {
            console.log("ERROR", e);
        }
       
    }

    useEffect(() => {
        (async () => {
            await getDoctors();
            await getNextAppointments();
            await getStatistics();
        })();
    }, []);


    const patientsData = [
        {
            name: 'Jacad Monie',
           
            hour: '17:30',
            income: 400,
            typeIncome: "$"
        },

        {
            name: 'Killan James',
            hour: '18:00',
            income: 300,
            typeIncome: "$"

        },

        {
            name: 'Wade Jack',
            hour: '18:30',
            income: 350,
            typeIncome: "$"
        },

        {
            name: 'Wade Jack',
            hour: '18:30',
            income: 350,
            typeIncome: "$"
        },

        {
            name: 'Wade Jack',
            hour: '18:30',
            income: 350,
            typeIncome: "$"
        },

        {
            name: 'Wade Jack',
            hour: '18:30',
            income: 350,
            typeIncome: "$"
        },

        {
            name: 'Wade Jack',
            hour: '18:30',
            income: 350,
            typeIncome: "$"
        },
    ];

    return (
        <div className="dashboard">
            <Navigation page="dashboard"/>
            
            <div className="content">
                <Header data={data} />
               

                <div className="data">
                    <div className="data-container">
                        <div className="image">
                            <FontAwesomeIcon icon={faCalendar} className="data-icon"/>
                        </div>
                        <div className="data-text">
                            <div className="text-container">
                                <h2>{appointments || 0}</h2>
                                <p>{cookies.language === "en" ? "Appointments" : "Programari"}</p>
                            </div>
                            
                        </div>
                    </div>

                    <div className="data-container">
                        <div className="image">
                            <FontAwesomeIcon icon={faUsers} className="data-icon"/>
                        </div>
                        <div className="data-text">
                            <div>
                                <h2>{newPatients || 0}</h2>
                                <p>{cookies.language === "en" ? "New patients" : "Pacienti noi"}</p>
                            </div>
                            
                        </div>
                    </div>

                    <div className="data-container">
                        <div className="image">
                            <FontAwesomeIcon icon={faCoins} className="data-icon"/>
                        </div>
                        <div className="data-text">
                            <div>
                                <h2>{income || 0} {typeIncome}</h2>
                                <p>{cookies.language === "en" ? "Earning" : "Venit"}</p>
                            </div>
                            
                        </div>
                    </div>
                </div>

                <div className="sm-content">
                    <div className="left-container">
                    
                        <div className="patients-statistics">

                        </div>

                        <div className="new-appointments">
                            <h2 className="title">{cookies.language === "en" ? "Appointment Patients List" : "Lista programari pacienti"}</h2>
                            <div className="first-row">
                                <p>{cookies.language === "en" ? "No." : "Nr."}</p>
                                <p>{cookies.language === "en" ? "Name" : "Nume"}</p>
                                <p>{cookies.language === "en" ? "Date of admit" : "Ora"}</p>
                                <p>{cookies.language === "en" ? "Icome" : "Venit"}</p>
                                <p>{cookies.language === "en" ? "Action" : "Optiuni"}</p>
                            </div>
                            {nextAppointments && nextAppointments.length > 0 ? nextAppointments.map((patient, idx) => (
                                <div className="row" key={idx}>
                                    <div className="number-patient">
                                        <p>{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</p>
                                    </div>

                                    <div className="patient-name">
                                        <p>{patient.name}</p>
                                    </div>

                                    <div className="patient-hour">
                                        <p>{patient.hour}</p>
                                    </div>

                                    <div className="patient-income money">
                                        <p>{patient.income} </p>
                                    </div>

                                    <div className="patient-actions">
                                        <FontAwesomeIcon icon={faEllipsis}/>
                                    </div>
                                </div>
                            )) : (
                                <div className="message">
                                    <h2>{cookies.language === "en" ? "No appointments for today!" : "Nicio programare pentru astazi"}</h2>
                                </div>
                            )}
                            
                        </div>
                    </div>
                    <div className="right-container">

                        <div className="doctors">
                            <h2 className="title">{cookies.language === "en" ? "Doctors" : "Doctori"}</h2>
                            <div className="first-row">
                                <p>{cookies.language === "en" ? "Doctor Name" : "Nume doctor"}</p>
                                <p>{cookies.language === "en" ? "Doctor Status" : "Status doctor"}</p>
                            </div>
                            {doctors && doctors.length > 0 && doctors.map((doctor, idx) => (
                                <div className="doctor" key={idx}>
                                    <div>
                                        <p>{doctor.name}</p>
                                    </div>

                                    <div className={`status ${doctor.available ? "on" : "off"}`}>
                                        <p>{doctor.available ? (cookies.language === "en" ? "Online" : "Conectat") : "Offline"}</p>
                                    </div>
                                </div>
                            ))}
                       </div>
                    </div>
                </div>
               

            </div>
        </div>
    );
};

export default Dashboard;