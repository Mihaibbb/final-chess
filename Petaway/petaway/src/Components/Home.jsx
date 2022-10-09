import Header from "./Header";
import "../Styles/Home.css";
import paw from "../images/paw.png";
import petSharingImage from "../images/pet_sharing.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDog, faHome, faLink, faPaw } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
    return (
        <div className="container">
            <Header />
            <div className="first-part">
                <div className="title-content">
                    <h2 className="title">Pet sharing. <FontAwesomeIcon icon={faPaw} className="paw-icon" /><br /> <span>Platform</span> that connects pet owners with pet sitters.</h2>

                </div>

                <div className="layout"></div>
                {/* <div className="title-image">
                    <img src={petSharingImage} alt=""/>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#fff" fill-opacity="1" d="M0,192L60,192C120,192,240,192,360,160C480,128,600,64,720,32C840,0,960,0,1080,21.3C1200,43,1320,85,1380,106.7L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path></svg>
                </div> */}
            </div>
                
            <div className="second-part">
                <h2 className="second-part-title">Petaway. The <span>better way</span></h2>
                <div className="card-container">
                    <div className="card">
                        <h2 className="card-title">I want to let my pet to someone who loves it.</h2>
                        <p>Petaway is intended for those who don't have any option where to leave their pet. This is the platform where these people can find pet-sitters.</p>
                        <div className="dominant-container-icon">
                            <FontAwesomeIcon icon={faDog} className="dominant-icon"/>
                        </div>
                    </div>

                    <div className="connector">
                        <FontAwesomeIcon icon={faLink} className="connector-icon"/>
                    </div>

                    <div className="card">
                        <h2 className="card-title">I want to spend time and play with pets.</h2>
                        <p>Petaway is also intended for those who ocasionally want to play, spend time and take care of pets but don't have any opportunity to do it. This is the platform where those people can find pet owners.</p>

                        <div className="dominant-container-icon">
                            <FontAwesomeIcon icon={faHome} className="dominant-icon" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="third-part">
                
            </div>
        </div>
    );
};