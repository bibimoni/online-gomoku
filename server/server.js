const io = require('socket.io')({
    cors : {
        origin: "*"
    }
});
const cors = require('cors');

io.on('connection', client => {
    client.emit('init', { data: 'hello world'});
})

io.listen(8080)