const net = require('net');
const server = net.createServer();// 'connection' listener

server.on('connection', (socket) => {
    console.log(socket.address());

    server.getConnections((err, counts)=>console.log("client connected, total counts: ", counts));

    socket.on('end', () => {
        console.log('client disconnected');
    });

    socket.on('data', (data) => {
        let res = data.toString();
        console.log("recived: ", res);
        if(res.includes("end"))socket.end();
    });

    socket.write('hello\r\n');
    //socket.pipe(socket);

});

server.on('error', (err) => {
    throw err;
});

server.listen(8124, () => {
    console.log('server bound');
});