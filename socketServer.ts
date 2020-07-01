const socketio = require("socket.io");
const { addUser, removeUser, getUser } = require("./users");

interface GroupJoin {
    phone: number,
    group: number,
    time: number,
}

interface Person {
    phone: number
    name: string
    avatar: any
}

interface Group {
    id: number,
    name: string,
    avatar: any,
    timeCreated: number,
    creator: Person,
    admins: Person[],
    participants: Person[],
}

interface Message {
    fromPhone: number
    toPhone: number
    name: string        // sender's name
    type: string        // text, audio, video, file
    payload: any        // actual data to be sent
    time: number        // time sent
    incoming: boolean
}

// this should be a database
const users: number[] = []

function getSocketId(phone: number): string {
    // from the temporary database, get the socket.id of the phone number
    return null
}

function PersonalChatHandler(io: SocketIO.Server) {
    io.on("connect", (socket) => {

        socket.on("send personal message", (message: Message, callback) => {
            const phone = message.toPhone
            const sid = getSocketId(phone)  // receiver

            if (!sid) callback("Person does not use our");

            socket.to(sid).emit("incoming personal message", { ...message, incoming: true });
        });

    });
}

function GroupChatHandler(io: SocketIO.Server) {
    io.on("connect", (socket) => {
        socket.on("create group", () => {

        })

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

        // socket.on("disconnect", (phone) => {
        //     // remove the phone2socket relationship
        // });
    });
}

module.exports = [GroupChatHandler, PersonalChatHandler]