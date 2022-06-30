import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import '../styles/prev-button.css';

export default function PreviousButton({icon, classDiv, clickButton}) {
    return (
        <div className={`button ${classDiv}`} onClick={(e) => clickButton(e)}>
            <FontAwesomeIcon 
                color="#fff" 
                icon={icon}
                className="prev-icon"
            />
        </div>
    );
};