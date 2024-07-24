import React, {useState} from "react";
import States from "../States";
import Example from "../Example";
import "./styles.css";

const Switch = () => {
    const [showExample, setShowExample] = useState(true);

    const toggleView = () => {
        setShowExample(!showExample);
    }

    return (
        <div>
            <button onClick={toggleView}>
                switch to {showExample ? "States": "Example"}
            </button>
            {showExample ? <Example /> : <States />}
        </div>
    );
};

export default Switch;