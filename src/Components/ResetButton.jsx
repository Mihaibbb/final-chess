import React, { Component } from "react";

export default class ResetButton extends React.Component {

    constructor(props) {
        super(props);
        this.computerGame = this.props.computerGame;
        this.lang = localStorage.getItem("language") ? JSON.parse(localStorage.getItem("language")) : "en";
    }

    componentDidUpdate() {
        console.log("set")
        this.lang = localStorage.getItem("language") ? JSON.parse(localStorage.getItem("language")) : "en";
    }

    resetGame() {
        if (this.computerGame) { 
            for (let i = 0, len = localStorage.length; i < len; i++) {
                const key = localStorage.key(i);
                console.log(key);
                if (key === null) continue;
                if (key.search("computer-") !== -1) localStorage.removeItem(key);
            }
        }
        else localStorage.clear();
        window.location.reload();
    }

    render() {
        return (
            <div className="reset-button" onClick={() => this.resetGame()}>
                <h2>{this.lang === "en" ? "Reset Game" : this.lang === "ro" ? "Reseteaza Jocul" : "Reset játék"}</h2>
            </div>
        );
    }
 
};