import React from 'react';
import './OrderInformation.css'; // Adjust the path based on your project structure

const OrderInformation = ({ order }) => {
  const {
    id,
    originNodeId,
    targetNodeId,
    load,
    value,
    deliveryDateUtc,
    expirationDateUtc
  } = order;

  return (
    <div className="order-information-container">
      <h2 className="order-information-title">Order Information</h2>
      <p className="order-information-item">ID: {id}</p>
      <p className="order-information-item">Origin Node ID: {originNodeId}</p>
      <p className="order-information-item">Target Node ID: {targetNodeId}</p>
      <p className="order-information-item">Load: {load}</p>
      <p className="order-information-item">Value: {value}</p>
      <p className="order-information-item">Delivery Date: {deliveryDateUtc}</p>
      <p className="order-information-item">Expiration Date: {expirationDateUtc}</p>
    </div>
  );
};

export default OrderInformation;
