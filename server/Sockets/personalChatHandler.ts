export function groupChatHandler(io: SocketIO.Server, socket: SocketIO.Socket) {

    socket.on("send personal message", (message: Message, callback) => {
        const toPhone = message.toPhone
        const sid = getSocketFromPhone(toPhone)  // receiver

        if (!sid) {
            // receiver is offline, add to his pending messages stash
            addToPendingMessages(message, toPhone)
        } else {
            io.to(sid).emit("incoming personal message", { ...message, incoming: true });
            callback();
        }
    });

    // ACK that message was received
    socket.on("received personal message", ({ toPhone, time }: Message) => {
        // notify sender that message was delivered
        socket.emit("delivered personal message", { toPhone, time })
    })

}