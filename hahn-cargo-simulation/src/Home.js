import { useState } from "react"
import { useNavigate } from "react-router-dom";


function Home() {
    const [started, setStarter] = useState("Start");
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const onButtonClick = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const StartStopButtonClick = () => {
        
        setStarter(started === "Start" ? "Stop" : "Start");

        logInLogOut(started);
    };

    const logInLogOut = (EndPoint) => {
        fetch(`http://localhost:5000/Sim/${EndPoint}`, {
            method: "POST",
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`, // notice the Bearer before your token
            },
        })
            .then(async (data) => {
                // Check if the response is successful
                if (data.ok) {
                    window.alert(`Task ${EndPoint}`);
                }
            })
            .catch(error => {
                // Handle any fetch errors here
                console.error('Fetch error:', error);
            });

    };

    const CreateOrderButtonClick = () => {
        fetch(`http://localhost:5000/Order/Create`, {
            method: "POST",
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`, // notice the Bearer before your token
            },
        })
            .then(async (data) => {
                // Check if the response is successful
                if (data.ok) {
                    window.alert("Order created Succefully");
                }
            })
            .catch(error => {
                // Handle any fetch errors here
                console.error('Fetch error:', error);
            });
    };

    return <div className="mainContainer">
     <input
            className={"inputButton"}
            type="button"
            onClick={CreateOrderButtonClick}
            value="Create Order"/>
        <input
            className={"inputButton"}
            type="button"
            onClick={StartStopButtonClick}
            value={started}/>
        <div className={"titleContainer"}>
            <div>Welcome!</div>
        </div>
        <div>
            This is the home page.
        </div>
        <div className={"buttonContainer"}>
            <input
                className={"inputButton"}
                type="button"
                onClick={onButtonClick}
                value="Log out" />
            <div>
                Your token {token}
            </div>
        </div>


    </div>;
}

export default Home