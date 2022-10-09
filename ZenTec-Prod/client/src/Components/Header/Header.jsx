import { faAngleDown, faBars, faBell, faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import accountImage from "../../imgs/account-image.jpeg";
import './Header.css';

const Header = ({ data }) => {
    console.log(data);
    return (
        <div className="header">
            <div className="searchbar-container">
                <div className="searchbar">
                    
                        <FontAwesomeIcon icon={faSearch}  className="search-icon"/>
                    <input type="text" placeholder="Search here..." />
                </div>
            </div>
         

            <div className="account-details">

                <FontAwesomeIcon icon={faBars} className="navigation-icon" onClick={() => document.querySelector(".navigation").classList.add("active")} />

                <div className="notifications">
                    <FontAwesomeIcon icon={faBell} className="notification-icon" />
                    <div className="notification-signal" />
                </div>
                <div className="account-photo">
                    <FontAwesomeIcon icon={faUser} className="account-icon" />
                </div>
                <p className="account-name">{data.user.name}</p>
                <FontAwesomeIcon icon={faAngleDown} className="account-info-icon" />
            </div>  
        </div>
    );
};

export default Header;