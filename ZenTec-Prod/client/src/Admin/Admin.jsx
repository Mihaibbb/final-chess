import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import './Admin.css';

const Admin = () => {

    const [organisations, setOrganisations] = useState([]);
    const [cookies, setCookie] = useCookies(['user-id']);
    const location = useLocation();
    const navigate = useNavigate();

    window.addEventListener("onbeforeunload", () => {
        navigate("/dashboard");
    });

    useEffect(() => {
        (async () => {
            console.log(cookies['user-id']);
            const options = {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    adminId: cookies['user-id']
                })
            };

            const req = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/organisation/data`, options);
            const response = await req.json();
            console.log(await response);
            setOrganisations(await response.organisations);
        })();
    }, []);


    
    return (
        <div className="admin">
            {location?.state?.message && <div className="message">
                <p>{location.state.message[cookies.language]}</p>
            </div>}
            <h2 className="title">Admin's Control Panel</h2>
            <p>Organisations</p>
            <div className="create-organisation" onClick={() => navigate("/create-organisation")}>
                <FontAwesomeIcon icon={faPlus} className="plus-icon" />
                <p>Create new organisation...</p>
            </div>
            {organisations.length > 0 && organisations.map((organisation, idx) => (
                <div className="organisation" key={idx}>
                    <div className="organisation-container">
                        <h2>{organisation.name}</h2>
                    </div>
                    <div className="create-user" onClick={() => navigate("/create-user", { state: { organisationName: organisation.name, _id: organisation._id } })}>
                        <FontAwesomeIcon icon={faPlus} className="plus-icon" />
                        <p>Create new user...</p>
                    </div>
                    {organisation.users && organisation.users.length > 0  && <div className="first-row">
                        <p>No</p>
                        <p>Name</p>
                        <p>Username</p>
                        <p>Email</p>
                        <p>Type</p>
                    </div>}
                    {organisation.users && organisation.users.length > 0 && organisation.users.map((user, userIdx) => (
                        <div key={userIdx}> 
                          <div className="user">
                                <p>{userIdx + 1 < 10 ? `0${userIdx + 1}` : userIdx + 1}</p>
                                <p>{user.name}</p>
                                <p>{user.username}</p>
                                <p>{user.email}</p>
                                <p>{user.type.slice(0, 1).toUpperCase() + user.type.slice(1)}</p>
                         </div>
                         <div className="line" />
                        </div>
                      
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Admin;