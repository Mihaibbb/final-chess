import './Navigation.css';
import logo from "../../imgs/logo_zentec3.svg";
import dashboardIcon from "../../imgs/icons/dashboard-icon.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBedPulse, faCalendarDays, faClose, faCoffee, faDashboard, faHandHoldingDollar, faUserDoctor } from "@fortawesome/free-solid-svg-icons"
import settingsIcon from "../../imgs/icons/settings-icon.svg";
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import patientIcon from "../../imgs/icons/patient.svg";

const Navigation = ({ show, page }) => {

    const navigation = useNavigate();
    const [cookies, setCookie] = useCookies();

    return (
        <div className="navigation">

            <FontAwesomeIcon icon={faClose} className="close-icon" onClick={e => e.target.parentElement.classList.remove("active")} />
            <div className="logo">
                <img src={logo} className="logo-img" />
            </div>

            <div className={`item ${page === "dashboard" ? "active" : ""}`} onClick={() => navigation("/dashboard")}>
                <img src={dashboardIcon} className="item-img" />
                <h3>{cookies.language === "en" ? "Dashboard" : "Panou de control"}</h3>
            </div>

            <div className={`item ${page === "appointments" ? "active" : ""}`} onClick={() => navigation("/appointments")}>
                <FontAwesomeIcon icon={faCalendarDays} className="item-icon"/>
                <h3>{cookies.language === "en" ? "Appointments" : "Programari"}</h3>
            </div>

            <div className={`item ${page === "doctors" ? "active" : ""}`} onClick={() => navigation("/doctors")}>
                <FontAwesomeIcon icon={faUserDoctor} className="item-icon" />
                <h3>{cookies.language === "en" ? "Doctors" : "Doctori"}</h3>
            </div>

            <div className={`item ${page === "patients" ? "active" : ""}`} onClick={() => navigation("/patients")}>
                {/* <FontAwesomeIcon icon={faBedPulse} className="item-icon" /> */}
                <img src={patientIcon} className="patient-icon" />
                <h3>{cookies.language === "en" ? "Patients" : "Pacienti"}</h3>
            </div>

            <div className={`item ${page === "income" ? "active" : ""}`} onClick={() => navigation("/income")}>
                <FontAwesomeIcon icon={faHandHoldingDollar} className="item-icon" />
                <h3>{cookies.language === "en" ? "Analytics" : "Vanzari"}</h3>
            </div>

            <div className={`settings ${page === "settings" ? "active" : ""}`} onClick={() => navigation("/settings")}>
                <img src={settingsIcon} className="item-img" />
                <h3>{cookies.language === "en" ? "Settings" : "Setari"}</h3>
            </div>
        </div>
    );
};

export default Navigation;