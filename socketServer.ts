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
    fromName: string    // sender's name
    toPhone: number     // if a personal message
    groupId: string     // if a group message
    type: string        // text, audio, video, file
    payload: any        // actual data to be sent
    time: number        // time sent
    incoming: boolean
    group: boolean
}

// this should be a database
const users: number[] = []

function getSocketId(phone: number): string {
    // from the temporary database, get the socket.id of the phone number
    return null
}

function getPhoneNumber(socketid: string): number {
    // from the temporary database, get the phone number of the socket.id
    return null
}

function createPhoneSocketRelation(phone: number, socketid: string) {
    // in the temporary database, add these as a pair
}
function deletePhoneSocketRelation(phone: number, socketid: string) {
    // in the temporary database, add these as a pair
}

function checkPendingMessages(phone: number): Message[] {
    return []
}

// add the message to the pending messages of phone
function addToPendingMessages(message: Message, phone: number) {

}

function SocketHandler(io: SocketIO.Server) {
    io.on("connection", (socket) => {

        /* ------------------------- INITIALIZATION ------------------------- */

        socket.on("online", (phone: number) => {
            createPhoneSocketRelation(phone, socket.id)

            // send the pending messages
            const pendingMessages = checkPendingMessages(phone)
            if (pendingMessages) {
                socket.emit("pending incoming messages", pendingMessages)
            }
        })


        /* ---------------------------- CLEANUP ---------------------------- */

        socket.on("disconnect", () => {
            const phone = getPhoneNumber(socket.id)
            deletePhoneSocketRelation(phone, socket.id)
        })


        /* ----------------------- PERSONAL MESSAGING ----------------------- */

        socket.on("send personal message", (message: Message, callback) => {
            const toPhone = message.toPhone

            // check if phone registered
            if (!toPhone) callback({ error: "Person does not use our service" })

            const sid = getSocketId(toPhone)  // receiver

            // check if the receiver is online
            if (!sid) {
                addToPendingMessages(message, toPhone)
                callback({ error: "Person offline" });
            }

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
    });
}

module.exports = [SocketHandler]