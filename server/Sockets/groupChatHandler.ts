export function groupChatHandler(io: SocketIO.Server, socket: SocketIO.Socket) {

    socket.on("create group", (details: GroupCreate, callback) => {
        const { name, avatar, timeCreated, creator, participants } = details

        // create a new entry to the database of groups
        // group id is the unique id assigned on creation of entry

        const groupId = ''  // string id

        // create another DB of group ids (for faster fetching)

        participants.forEach((participant) => {
            // BUG:
            // get socket from participants phone
            // const psocket = getSocketFromPhone(participant.phone)
            // join above socket to group
            // psocket.join(groupId)    // does not work
        })

        // notify all the members of the group about creation
        io.to(groupId).emit("added to group", {
            groupId,
            name,
            avatar,
            timeCreated,
            creator,
            participants,
            admins: [creator],
        })
    });

    socket.on("received group message", ({ groupId, phone, time }) => {
        // person has gotten the message (double ticks)
        socket.broadcast.to(groupId).emit("delivered group message", { phone, time })
    });

    // this should be emitted (a group member adds new person)
    // outsiders can't join without consent of at least one in group
    socket.on("join group", ({ phone, group, time }: GroupJoin, callback) => {
        const { error, user } = addUser({ id: socket.id, name, group });

        if (error) return callback(error);

        socket.join(user.chat);
        console.log(`${name} has joined @ ${time}`);

        // notify the user
        socket.emit("notify", {
            user: user.phone,
            type: "join",
            payload: `You have joined the chat`,
        });

        // BUG: move this from here to router to DB js
        users.push(user.phone);

        // notify the others in group
        socket.broadcast.to(user.chat).emit("notify", {
            user: user.phone,
            type: "join",
            payload: `${user.name} has joined the chat`,
        });

        callback();
    });

    socket.on("send group message", (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.chat).emit("incoming group message", { ...message, incoming: true });

        console.log(message);
        callback();
    });

    socket.on("leave group", ({ phone, groupId }) => {
        const index = users.indexOf(phone);

        if (index > -1) {
            users.splice(index, 1);

            // socket.broadcast.to(user.chat).emit("notify", {
            //     user: phone,
            //     type: "left",
            // });
        }
    });

}