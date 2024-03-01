import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// The Login component receives props from its parent component.
function Login() {
    // State variables to store email, password, and corresponding error messages.
    const [userName, setUserName] = useState("");
    const [userNameError, setUserNameError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    // React Router hook to enable navigation within the application.
    const navigate = useNavigate();

    // Function to handle the button click event.
    const onButtonClick = () => {
        // Set initial error values to empty.
        setPasswordError("");

        // Validation checks for email and password.
        if ("" === userName) {
            setUserNameError("Please enter your UserName");
            return;
        }

        if (userName.length < 4) {
            setUserNameError("Please enter an UserName at least 4 characters");
            return;
        }

        if ("" === password) {
            setPasswordError("Please enter a password");
            return;
        }

        if (password.length < 4) {
            setPasswordError("The password must be 4 characters or longer");
            return;
        }

        // If validation passes, initiate the login process.
        logIn();
    };

    // Function to perform user login using email and password.
    const logIn = () => {
        fetch("http://localhost:5000/User/Login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: userName, password })
        })
            .then(async (data) => {
                // Check if the response is successful
                if (data.ok) {
                    // Extract the token from the response data
                    const DeserializedData = await data.json();

                    // Store user information in local storage, update the state, and navigate to the home page.
                    localStorage.setItem("token", DeserializedData.token);
                    navigate("/Home");
                } else {
                    // If the response is not successful, show an alert with an error message.
                    window.alert("Wrong email or password");
                }
            })
            .catch(error => {
                // Handle any fetch errors here
                console.error('Fetch error:', error);
            });

    };

    // JSX structure representing the login form.
    return (
        <div className={"mainContainer"}>
            <div className={"titleContainer"}>
                <div>Login</div>
            </div>
            <br />
            <div className={"inputContainer"}>
                <input
                    value={userName}
                    placeholder="Enter your UserName here"
                    onChange={ev => setUserName(ev.target.value)}
                    className={"inputBox"} />
                <label className="errorLabel">{userNameError}</label>
            </div>
            <br />
            <div className={"inputContainer"}>
                <input
                    value={password}
                    placeholder="Enter your password here"
                    onChange={ev => setPassword(ev.target.value)}
                    className={"inputBox"}
                    type="password" />
                <label className="errorLabel">{passwordError}</label>
            </div>
            <br />
            <div className={"inputContainer"}>
                <input
                    className={"inputButton"}
                    type="button"
                    onClick={onButtonClick}
                    value={"Log in"} />
            </div>
        </div>
    );
}

// Export the Login component.
export default Login;
