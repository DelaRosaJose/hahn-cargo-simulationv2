import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from 'socket.io-client';
import './Home.css';
import OrderInformation from "./Components/OrderInformation";
import TransporterInformation from './Components/TransporterInformation';

const Backendurl = 'http://localhost:5000/'
const socket = io('http://localhost:9081');
function Home() {
    useEffect(() => {
        console.clear();
        SetterWebScoket();
        GetterGrids();
        GetterCoins();

    }, []);

    const [countTransporters, setCountTransporters] = useState(0);
    const [orders, setOrders] = useState([]);
    const [acceptedOrders, setAcceptedOrders] = useState([]);
    const [transporters, settransporters] = useState([]);
    const [started, setStarter] = useState("Start");
    const [node, setNode] = useState(0);
    const [fetchSuccess, setFetchSuccess] = useState(false);
    const [coins, setCoins] = useState(0);
    
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
            setOrders((prevMessages) => [...prevMessages, parsedMessage]);
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
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
            });
    };

    const SearchtAcceptedOrders = () => {
        fetch(`${Backendurl}Order/GetAllAccepted`, {
            method: "GET",
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                return response.json();
            })
            .then(data => {
                setAcceptedOrders(data);
            })
            .catch(error => {
                console.error('Fetch error:', error);
            });
    };


    const BuyTransporterButtonClick = () => {
        fetch(`${Backendurl}CargoTransporter/buy?positionNodeId=${node}`, {
            method: "POST",
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                GetterCoins();
                return response.json();
            })
            .then(data => {
                if (data === -1) {
                    window.alert("No sufficient coins.")
                }
                else {
                    setCountTransporters(data);
                    ExecuteGetTransporters(data);

                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
            });
    };

    const ExecuteGetTransporters = (Canttransporters) => {
        settransporters([]);
        for (let index = 1; index <= Canttransporters; index++) {
            GetterTransporters(index);
        }
    };

    const GetterTransporters = (TransporterId) => {
        fetch(`${Backendurl}CargoTransporter/Get?transporterId=${TransporterId}`, {
            method: "GET",
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(async (response) => {
                if (response.status === 200) {
                    const parsedTransporters = await response.json();

                    settransporters((prevTransporters) => [...prevTransporters, parsedTransporters]);
                }


            })
            .catch(error => {
                console.error('Fetch error:', error);
            });
    };

    return <div className="mainContainer">
        <div>
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
        </div>

        <div className="horizontalContainer">

            <div className="listContainer">
                <div className={"countList"}>Real time orders: {orders.length}</div>
                <div className="listdiv">
                    <ul className={"orderlist"}>
                        {orders.map((message, index) => (
                            <OrderInformation order={message} token={token} backendURL={Backendurl} AcceptedOrdersFunction={SearchtAcceptedOrders} 
                            SearchTransporters={() => ExecuteGetTransporters(countTransporters)} />
                        ))}
                    </ul>
                </div>

            </div>

            <div className="listContainer">
                <div className={"countList"}>Orders Accepted: {acceptedOrders.length}</div>
                <div className="listdiv">
                    <ul className={"orderlist"}>
                        {acceptedOrders.map((orderAccepted, index) => (
                            <OrderInformation order={orderAccepted} token={token} backendURL={Backendurl} AcceptedOrdersFunction={SearchtAcceptedOrders} 
                            SearchTransporters={() => ExecuteGetTransporters(countTransporters)} createdOrders={true} />
                        ))}
                    </ul>
                </div>
            </div>

            <div className="listContainer">
                <div className={"countList"}>Transporters: {countTransporters}</div>
                <div className="buyControl">

                    <input
                        className="buy Button"
                        type="button"
                        onClick={BuyTransporterButtonClick}
                        value="Buy Transporter" />

                    <input
                        value={node}
                        className="inputNode"
                        placeholder="Enter a node"
                        type="number"
                        onChange={ev => setNode(ev.target.value)}
                    />

                </div>
                <div className="listdiv">
                    <ul className={"orderlist"}>
                        {transporters.map((transporter, index) => (
                            <TransporterInformation key={transporter.id} transporter={transporter} />
                        ))}
                    </ul>
                </div>
            </div>

        </div>



    </div >;
}

export default Home