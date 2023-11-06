import axios from 'axios';
import React, { useState, useEffect } from 'react'
import "../App.css";
import api from "../store/store-request-api"

export default function TestingComponent() {
    const [testStrings, setTestStrings] = useState([]);
    const [stringInput, setStringInput] = useState({testString: ""});
    const baseUrl = "http://geocraftmaps.azurewebsites.net";
 

    // useEffect(() => {
    // axios
    //     .get(`${baseUrl}/get-tests`)
    //     .then((res) => setTestStrings(res.data))
    //     .catch((err) => console.log(err));
    // }, []);

    // useEffect(() => {
    //     let tests = []
    //     async function asyncGetTests() {
    //         const response = await api.getTests();
    //         if (response.data.success) {
    //             console.log("got test strings from mongo")
    //             tests = response.data.testString;
    //         }
    //         else {
    //             console.log("COULDNT GET TEST STRINGS")
    //         }

    //         setTestStrings(tests);
    //     }
    //     asyncGetTests();
    // });

    const handleChange = (event) => {
        const { value } = event.target;
        setStringInput(value);
    };

    const saveData = (event) => {
        async function asyncCreateNewTest() {
            let payload = {testString: stringInput}
            const response = await api.createTestString(payload.testString);
            if (response.data.success) {
                console.log("test string added to mongo")
            }
            else {
                console.log("COULDNT ADD TEST STRING")
            }
        }
        asyncCreateNewTest();
    };


    // const saveData = (event) => {
    //     event.preventDefault();

    //     axios
    //     .post(`${baseUrl}/tests`, stringInput)
    //     .then((res) => console.log(res))
    //     .catch((err) => console.log(err));
    // };

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
            placeholder="test string"
            onChange={handleChange}
            name="testString"
            value={stringInput.testString}
        />
        <button onClick={saveData}>Save to MongoDB</button>
    </div>
  );
}