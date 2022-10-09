import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import Home from "./Home/Home";
import Dashboard from "./Dashboard/Dashboard";
import Admin from "./Admin/Admin"; 
import Patients from "./Patients/Patients";
import Users from "./Users/Users";
import Login from "./Login/Login";
import Appointments from "./Appointments/Appointments";
import "./App.css";
import { useCookies } from "react-cookie";
import { useState, useEffect } from "react";
import CreateOrganisation from "./CreateOrganisation/CreateOrganisation";
import CreateUser from "./CreateUser/CreateUser";
import CreatePatient from "./CreatePatient/CreatePatient";
import PatientAccount from "./PatientAccount/PatientAccount";

const App = () => {
    const [cookies, setCookie, removeCookie] = useCookies([]);
    const [language, setLanguage] = useState("en");
    const [data, setData] = useState(null);
    const [isAdmin, setIsAdmin] = useState(null);

    useEffect(() => {

        cookies.language && setLanguage(cookies.language);

        (async () => {
            if (!cookies["user-id"] || !cookies["pwd"]) {
                setData(false);
                return;
            }
            
            const [userId, password] = [cookies["user-id"], cookies["pwd"]];
            const options = {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({
                    userId,
                    hashedPassword: password
                })
            };

            const loginRequest = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login-remember`, options);
            const result = await loginRequest.json();
            console.log(result);
            if (!await result.success) {
                removeCookie('user-id');
                removeCookie('pwd');
                setData(false);
                return;
            }
            console.log(await result);
            setData(await result);
            setIsAdmin(await result.admin);

        })();

    }, []);

 

    return data !== null && (
        <BrowserRouter>
             <Routes>
                {/* <Route path="/" element={<Home />} /> */}
                {data ? (
                    <>
                        <Route path="dashboard" element={isAdmin ? <Admin data={data} language={language} /> : <Dashboard data={data} language={language} />} />
                        
                        {!isAdmin ? (
                            <>
                                <Route path="patients" element={<Patients data={data} />} />
                                <Route path="patient/:id" element={<PatientAccount data={data} />} />
                                <Route path="doctors" element={<Users data={data}/>} />
                                <Route path="appointments" element={<Appointments data={data} language={language} />} />
                                {/* <Route path="import-patients" element={<ImportPatients />}/> */}
                                <Route path="create-patient" element={<CreatePatient data={data} language={language} />} />


                            </>
                        ) : (
                            <>
                                <Route path="create-organisation" element={<CreateOrganisation language={language} />} />
                                <Route path="create-user" element={<CreateUser language={language} />}/>
                            </>
                        )}
                        <Route path="*" element={<Navigate to="/dashboard" />}/>
                    </>
                ) : (
                    <>
                        <Route path="login" element={<Login language={language} />} />
                        <Route path="*" element={<Navigate to="/login" language={language} />} />
                    </>
                )}

               
                {/*
                <Route path="statistics" element={<Statistics />} />
                <Route path="search:query" element={<Search />} />
                <Route path="admin" element={<AdminInterface />} /> */}
            </Routes>
        </BrowserRouter>
    );
};


export default App;