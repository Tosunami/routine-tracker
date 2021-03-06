import React from 'react';
import './Landing.css';

const Landing = () =>
(
    <div>
        <div className="jumbo">
            <div className="column">
                <h1 className="jumbo-title">Dont Break the Chain</h1>
                <p className="jumbo-subText">
                Keep your routines in track and increase your productivity.
                </p>
            </div>
            <div className="column">
                <img className="jumbo-image" src="/img/chain-312403_1280-e1422477190582.png" alt=""/>
            </div>
        </div>
    </div>
)

export default Landing;
