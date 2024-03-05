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

    amqp.connect('amqp://rabbitmq:5672', (error0, connection) => {
        if (error0) {
            throw error0;
        }

        connection.createChannel((error1, channel) => {
            if (error1) {
                throw error1;
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
    // Handle disconnect event if needed
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});


server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
