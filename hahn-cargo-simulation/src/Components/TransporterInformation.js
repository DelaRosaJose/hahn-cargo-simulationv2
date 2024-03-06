import React from 'react';

const NodeInformation = ({ transporter: transporterData }) => {
  const { id, positionNodeId, inTransit, capacity, load, loadedOrders } = transporterData;

  return (
    <div className="order-information-container">
      <h2 className="order-information-title">Node Information</h2>
      <p className="order-information-item">ID: {id}</p>
      <p className="order-information-item">Position Node ID: {positionNodeId}</p>
      <p className="order-information-item">In Transit: {inTransit ? 'Yes' : 'No'}</p>
      <p className="order-information-item">Capacity: {capacity}</p>
      <p className="order-information-item">Load: {load}</p>

      <h3>Loaded Orders:</h3>
      <ul>
        {loadedOrders.map((order, index) => (
          <li key={index}>Order ID: {order.id}</li>
        ))}
      </ul>
    </div>
  );
};

export default NodeInformation;
