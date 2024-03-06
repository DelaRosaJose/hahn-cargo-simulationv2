import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [userName, setUserName] = useState("");
    const [userNameError, setUserNameError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const navigate = useNavigate();

    const onButtonClick = () => {
        setPasswordError("");

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

        logIn();
    };

    const logIn = () => {
        fetch("http://localhost:5000/User/Login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: userName, password })
        })
            .then(async (data) => {
                if (data.ok) {
                    const DeserializedData = await data.json();

                    localStorage.setItem("token", DeserializedData.token);
                    navigate("/Home");
                } else {
                    setPasswordError("Wrong email or password");
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
            });
    };

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

export default Login;
