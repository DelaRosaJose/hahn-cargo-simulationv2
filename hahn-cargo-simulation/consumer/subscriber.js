const amqp = require('amqplib/callback_api');
const server = require("http").createServer();
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    }
});

const PORT = 9081;

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    try {
        amqp.connect('amqp://rabbitmq:5672', (error0, connection) => {
            if (error0) {
                console.log(error0);
            }

            connection.createChannel((error1, channel) => {
                if (error1) {
                    console.log(error1);
                }

                const queue = 'HahnCargoSim_NewOrders';

                channel.assertQueue(queue, {
                    durable: false
                });

                console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

                channel.consume(queue, (msg) => {
                    const messageContent = msg.content.toString();

                    // Emit the message to connected clients
                    io.emit('newQueuemessage', messageContent);

                    console.log(" [x] Received:", messageContent);
                }, {
                    noAck: true
                });
            });
        });
    } catch {

    }

    // Handle disconnect event if needed
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});


server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});


// const amqp = require('amqplib/callback_api');
// const server = require("http").createServer();
// const io = require("socket.io")(server, {
//     cors: {
//         origin: "*",
//     }
// });

// const PORT = 9081;

// // Wrap the entire logic in a function for better organization
// async function startServer() {
//     try {
//         const connection = await new Promise((resolve, reject) => {
//             amqp.connect('amqp://rabbitmq:5672', (error, connection) => {
//                 if (error) reject(error);
//                 else resolve(connection);
//             });
//         });

//         const channel = await new Promise((resolve, reject) => {
//             connection.createChannel((error, channel) => {
//                 if (error) reject(error);
//                 else resolve(channel);
//             });
//         });

//         const queue = 'HahnCargoSim_NewOrders';

//         channel.assertQueue(queue, {
//             durable: false
//         });

//         console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

//         // Move the rest of your RabbitMQ logic here

//         // Now handle client connections
//         io.on('connection', (socket) => {
//             console.log('Client connected:', socket.id);
//             // Your existing code for handling socket connections
//         });

//         // Handle disconnect event if needed
//         io.on('disconnect', () => {
//             console.log('Client disconnected:', socket.id);
//         });

//         // Start the server after everything is set up
//         server.listen(PORT, () => {
//             console.log(`Server listening on port ${PORT}`);
//         });
//     } catch (error) {
//         console.log('Error during server setup:', error);
//     }
// }

// // Call the function to start the server
// startServer();
