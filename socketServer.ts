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

interface GroupCreate {
    name: string,
    avatar: any,
    timeCreated: number,
    creator: Person,
    participants: Person[],
}
interface Group {
    id: string,
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

function createPhoneSocketRelation(phone: number, socketid: string) {
    // in the temporary database, add these as a pair
}

function checkPendingMessages(phone: number): Message[] {
    return []
}

function SocketHandler(io: SocketIO.Server) {
    io.on("connection", (socket) => {

        /* ------------------------- INITIALIZATION ------------------------- */

        socket.on("created", (phone: number) => {
            createPhoneSocketRelation(phone, socket.id)

            checkPendingMessages(phone)
        })


        /* ----------------------- PERSONAL MESSAGING ----------------------- */

        socket.on("send personal message", (message: Message, callback) => {
            const phone = message.toPhone
            const sid = getSocketId(phone)  // receiver

            if (!sid) callback("Person does not use our");

            // try to send the message
            socket.to(sid).emit("incoming personal message", { ...message, incoming: true });

            // ACK that message was received
            socket.on("received personal message", () => {
                // notify sender that message was delivered
                socket.emit("delivered personal message")
            })
        });


        /* ------------------------ GROUP MESSAGING ------------------------ */

        socket.on("create group", (details: GroupCreate, callback) => {
            const { name, avatar, timeCreated, creator, participants } = details

            // create a new entry to the database of groups
            // group id is the unique id assigned on creation of entry

            const groupId = ''  // string id

            // create another DB of group ids (for faster fetching)

            participants.map((participant) => socket.join(groupId))

            // notify all the members of the group about creation
            io.to('/').emit("group created")
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

module.exports = [SocketHandler]