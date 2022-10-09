import "../Patients/Patients.css";
import Navigation from "../Components/Navigation/Navigation";
import Header from "../Components/Header/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react"; 
import { useCookies } from "react-cookie";
const Users = ({ data }) => {

    const [doctors, setDoctors] = useState([]);
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

    useEffect(() => {
        (async () => {
            await getDoctors();
        })();
    }, []);

    

    return (
        <div className="patients">
            <Navigation page="doctors" />

            <div className="content">
                <Header data={data} />
                <h2 className="title">{cookies.language === "en" ? "Doctors" : "Doctori"}</h2>
                <div className="patients-container">

                    <div className="first-row">
                        <div className="column">
                            <p>{cookies.language === "en" ? "Name" : "Nume"}</p>
                        </div>
                        <div className="column">
                            <p>{cookies.language === "en" ? "Username" : "Nume utilizator"}</p>
                        </div>
                        <div className="column">
                            <p>Email</p>
                        </div>
                        <div className="column">
                            <p>{cookies.language === "en" ? "Options" : "Optiuni"}</p>
                        </div>
                    </div>

                    {doctors.map((user, idx) => (
                        <div className="row" key={idx}>
                            <div className="column">
                                <p>{user.name}</p>
                            </div>
                            <div className="column">
                                <p>{user.username}</p>
                            </div>
                            <div className="column">
                                <p>{user.email}</p>
                            </div>
                            <div className="column">
                                <FontAwesomeIcon className="column-icon" icon={faEllipsis}/>
                            </div>
                        </div>
                    ))}
                </div>

             
            </div>
        </div>
    );

};

export default Users; 