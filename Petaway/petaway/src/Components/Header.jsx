import { faArrowRight, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import "../Styles/Header.css";

export default function Header() {

    const navigate = useNavigate();
    return (
        <nav>
            <ul>
                <li className="first" onClick={() => navigate("/")}>
                    <img src={logo} alt="logo image" />
                </li>
                <li>About</li>
                <li>Services</li>
                <li>Testimonials</li>
                <li>Support</li>
                {!localStorage.getItem("logged") ? 
                    (<li className="last" onClick={() => navigate("/sign-in")}>Sign In 
                        <FontAwesomeIcon icon={faArrowRight} className="arrow-icon" />
                    </li> )
                : (
                    <li className="last account-last" onClick={() => navigate("/account")}>
                        <FontAwesomeIcon icon={faUser} />
                        Account
                    </li>
                )}
                
            </ul>
        </nav>
    );
};