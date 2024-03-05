import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from 'socket.io-client';


const socket = io('http://localhost:9081');
function Home() {
    useEffect(() => {
        // Event listener for new messages from the server
        socket.on('newQueuemessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        // Clean up the event listener on component unmount
        return () => {
            socket.disconnect();
        };
    }, []);
    const [messages, setMessages] = useState([]);
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

    const MessagesReceiverButtonClick = async () => {
        // const socket = socket.connect('http://localhost:4000');
        // socket.on('messageResponse', (data) => setMessages([...messages, data]));
        // console.log(socket)
    }



    return <div className="mainContainer">
        <ul>
            {messages.map((message, index) => (
                <li key={index}>{message}</li>
            ))}
        </ul>
        <input
            className={"inputButton"}
            type="button"
            onClick={MessagesReceiverButtonClick}
            value="Receiver messages" />

        <input
            className={"inputButton"}
            type="button"
            onClick={CreateOrderButtonClick}
            value="Create Order" />

        <input
            className={"inputButton"}
            type="button"
            onClick={StartStopButtonClick}
            value={started} />
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