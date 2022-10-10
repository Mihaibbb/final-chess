import { faEllipsis, faPlus } from '@fortawesome/free-solid-svg-icons';
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


    useEffect(() => {
        (async () => {
            console.log(cookies['user-id'], organisations);
            const options = {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    adminId: cookies['user-id']
                })
            };
            try {
                const req = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/organisation/data`, options);
                const response = await req.json();
                console.log(await response);
                setOrganisations(await response.organisations);
            } catch (e) {
                console.log(e);
            }
       
        })();
    }, []);

    const removeOrganisation = async (organisationId) => {
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                adminId: cookies['user-id'],
                _id: organisationId
            })
        };

        try {
            const request = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/organisation/remove`, options);
            const response = await request.json();
            if (!await response.success) return;
            navigate("/dashboard", { state: { message: await response.message[cookies.language] } })
        } catch (e) {
            console.log(e);
        }
    };

    const removeUser = async (_id, username) => {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                _id,
                username,
                adminId: cookies['user-id']
            })
        };

        try {
            const request = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/organisation/remove-user`, options);
            const response = await request.json();
            if (!await response.success) return;
            navigate("/dashboard", { state: { message: await response.message } });
        } catch (e) {
            console.log(e);
        }
    };  
    
    return (
        <div className="admin">
            {location?.state?.message && <div className="message">
                <p>{location.state.message[cookies.language]}</p>
            </div>}
            <h2 className="title">{cookies.language === "en" ? "Admin's Control Panel" : "Panoul de control"}</h2>
            <p>{cookies.language === "en" ? "Organisations" : "Organizatii"}</p>
            <div className="create-organisation" onClick={() => navigate("/create-organisation")}>
                <FontAwesomeIcon icon={faPlus} className="plus-icon" />
                <p>{cookies.language === "en" ? "Create new organisation..." : "Creeaza o noua organizatie..."}</p>
            </div>
            {organisations.length > 0 && organisations.map((organisation, idx) => (
                <div className="organisation" key={idx}>

                    <div className="option">
                        <FontAwesomeIcon icon={faEllipsis} className="option-icon" onClick={async () => await removeOrganisation(organisation._id)} />
                    </div>

                    <div className="organisation-container">
                        <h2>{organisation.name}</h2>
                    </div>
                    <div className="create-user" onClick={() => navigate("/create-user", { state: { organisationName: organisation.name, _id: organisation._id } })}>
                        <FontAwesomeIcon icon={faPlus} className="plus-icon" />
                        <p>{cookies.language === "en" ? "Create new user..." : "Creeaza un nou utilizator..."}</p>
                    </div>
                    {organisation.users && organisation.users.length > 0  && <div className="first-row">
                        <p>{ cookies.language === "en" ? "No." : "Nr." }</p>
                        <p>{ cookies.language === "en" ? "Name" : "Nume" }</p>
                        <p>{ cookies.language === "en" ? "Username" : "Nume utilizator" }</p>
                        <p>{ cookies.language === "en" ? "Email" : "Email" }</p>
                        <p>{ cookies.language === "en" ? "Type" : "Tip" }</p>
                        <p>{ cookies.language === "en" ? "Options" : "Optiuni" }</p>
                    </div>}
                    {organisation.users && organisation.users.length > 0 && organisation.users.map((user, userIdx) => (
                        <div key={userIdx}> 
                            <div className="user">
                                <p>{userIdx + 1 < 10 ? `0${userIdx + 1}` : userIdx + 1}</p>
                                <p>{user.name}</p>
                                <p>{user.username}</p>
                                <p>{user.email}</p>
                                <p>{user.type.slice(0, 1).toUpperCase() + user.type.slice(1)}</p>
                                <FontAwesomeIcon icon={faEllipsis} className="option-icon" onClick={async () => await removeUser(user.userId, user.username)} />
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