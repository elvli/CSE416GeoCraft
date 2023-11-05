import React, { useState, useEffect } from 'react'
import axios from "axios";
import "../App.css";

export default function TestingComponent() {
    const [testStrings, setTestStrings] = useState([]);
    const [stringInput, setStringInput] = useState({testString: ""});
    const baseUrl = "http://localhost:4000";
 

    useEffect(() => {
    axios
        .get(`${baseUrl}/get-tests`)
        .then((res) => setTestStrings(res.data))
        .catch((err) => console.log(err));
    }, []);

    const handleChange = (event) => {
        const { value } = event.target;
        setStringInput(value);
    };

    const saveData = (event) => {
        event.preventDefault();

        axios
        .post(`${baseUrl}/tests`, stringInput)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    };

    return (
    <div className="App">
        <h1>Test Strings in the MongoDB</h1>

        {testStrings &&
            testStrings.length > 0 &&
            testStrings.map((test) => {
                return (
                    <div>
                        <h3>{test.testString}</h3>
                    </div>
                );
            })
        }

        <h2>Input your string here</h2>
        <input
            placeholder="test strsing"
            onChange={handleChange}
            name="testString"
            value={stringInput.testString}
        />
        <button onClick={saveData}>Save to MongoDB</button>
    </div>
  );
}