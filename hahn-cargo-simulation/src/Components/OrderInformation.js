import React, { useState } from 'react';
import './OrderInformation.css';

const OrderInformation = ({ order, token, backendURL, AcceptedOrdersFunction, SearchTransporters, createdOrders = false }) => {

  const [buttonPressed, setButtonPressed] = useState(false);

  const {
    id,
    originNodeId,
    targetNodeId,
    load,
    value,
    deliveryDateUtc,
    expirationDateUtc
  } = order;

  const AcceptOrderButtonClick = () => {
    fetch(`${backendURL}Order/Accept?orderId=${id}`, {
      method: "POST",
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => {
        if (response.ok) {
          setButtonPressed(true);
          AcceptedOrdersFunction();
          SearchTransporters();
        }
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
  };

  return (
    <div className="order-information-container">
      <h2 className="order-information-title">{!createdOrders ? 'Order Information' : 'Order Accepted'}</h2>
      <p className="order-information-item">ID: {id}</p>
      <p className="order-information-item">Origin Node ID: {originNodeId}</p>
      <p className="order-information-item">Target Node ID: {targetNodeId}</p>
      <p className="order-information-item">Load: {load}</p>
      <p className="order-information-item">Value: {value}</p>
      <p className="order-information-item">Delivery Date: {deliveryDateUtc}</p>
      <p className="order-information-item">Expiration Date: {expirationDateUtc}</p>

      {(!buttonPressed && !createdOrders) &&
      (
      <input
        className="Aceppt Button"
        type="button"
        onClick={AcceptOrderButtonClick}
        value="Accept Order" />
      )}
      
    </div>
  );
};

export default OrderInformation;
