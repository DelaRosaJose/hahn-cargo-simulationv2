import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from 'socket.io-client';
import './Home.css';
import OrderInformation from "./Components/OrderInformation";

const Backendurl = 'http://localhost:5000/'
const socket = io('http://localhost:9081');
function Home() {
    useEffect(() => {
        console.clear();
        SetterWebScoket();
        GetterGrids();
        GetterCoins();

    }, []);

    const [messages, setMessages] = useState([]);
    const [started, setStarter] = useState("Start");
    const [fetchSuccess, setFetchSuccess] = useState(false);
    const [coins, setCoins] = useState(0);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const GetterCoins = () => {
        fetch(`${Backendurl}User/CoinAmount`, {
            method: "GET",
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(async (data) => {
                if (data.ok) {
                    setCoins(await data.json());
                    // console.log(coins);
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
            });
    };

    const GetterGrids = () => {
        fetch(`${Backendurl}Grid/Get`, {
            method: "GET",
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(async (data) => {
                if (data.ok) {
                    const deserializejson = await data.json();
                    console.log(deserializejson);
                    // window.alert(`Grids Getters Succefully`);
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
            });
    };

    const SetterWebScoket = () => {
        // Event listener for new messages from the server
        socket.on('newQueuemessage', (message) => {
            const parsedMessage = JSON.parse(message);
            setMessages((prevMessages) => [...prevMessages, parsedMessage]);
        });

        // Clean up the event listener on component unmount
        return () => {
            socket.disconnect();
        };
    };

    const StartStopButtonClick = () => {

        setStarter(started === "Start" ? "Stop" : "Start");

        StartStop(started);
    };

    const StartStop = (EndPoint) => {
        fetch(`${Backendurl}Sim/${EndPoint}`, {
            method: "POST",
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(async (data) => {
                if (data.ok) {
                    // window.alert(`Task ${EndPoint}`);
                    setFetchSuccess(true);
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                setFetchSuccess(false);
            });

    };

    const CreateOrderButtonClick = () => {
        fetch(`${Backendurl}Order/Create`, {
            method: "POST",
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(async (data) => {
                if (data.ok) {
                    // window.alert("Order created Succefully");
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
            });
    };



    return <div className="mainContainer">
        <div className={"coinsContainer"}>Your Coins {coins}</div>
        <div>
            <input
                className={`inputButtonStartStop ${fetchSuccess && started === 'Stop' ? 'stop' : 'start'}`}
                type="button"
                onClick={StartStopButtonClick}
                value={`${started} Simulation`} />

            <input
                className={"inputButton"}
                type="button"
                onClick={CreateOrderButtonClick}
                value="Create Order" />


        </div>


        <div className={"countList"}>List Count ={messages.length}</div>

        <ul className={"orderlist"}>
            {messages.map((message, index) => (
                <OrderInformation order = {message}/>
            ))}
        </ul>
        {/* <input
            className={"inputButton"}
            type="button"
            onClick={MessagesReceiverButtonClick}
            value="Info" /> */}
        {/* <input
            className={"inputButton"}
            type="button"
            onClick={MessagesReceiverButtonClick}
            value="Receiver messages" />
 */}



        {/* <div className={"titleContainer"}>
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
                value="Log out" /> */}

        {/* </div> */}


    </div>;
}

export default Home