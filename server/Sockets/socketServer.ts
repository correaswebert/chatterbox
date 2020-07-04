const socketio = require("socket.io");
const { addUser, removeUser, getUser } = require("./users");
const PhoneSocket = require("../Models/PhoneSocket");

interface GroupJoin {
    phone: number,
    group: number,
    time: number,
}

interface Person {
    phone: number
    name: string
    avatar?: any
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
    toPhone?: number    // if a personal message
    groupId?: string    // if a group message
    type: string        // text, audio, video, file
    payload: any        // actual data to be sent
    time: number        // time sent
    incoming: boolean
    group: boolean
}

// this should be a database
const users: number[] = []

function getSocketFromPhone(phone: number): string {
    return PhoneSocket.findOne({ phone }).socket_id
}

function getPhoneFromSocket(socket_id: string): number {
    return PhoneSocket.findOne({ socket_id }).phone
}

function createPhoneSocketRelation(phone: number, socket_id: string) {
    const phone_socket = new PhoneSocket({
        phone, socket_id
    });
    phone_socket.save();
}
function deletePhoneSocketRelation(phone: number, socket_id: string) {
    PhoneSocket.deleteOne({ phone, socket_id });
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
            const phone = getPhoneFromSocket(socket.id)
            deletePhoneSocketRelation(phone, socket.id)
        })


        /* ----------------------- PERSONAL MESSAGING ----------------------- */

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


        /* ------------------------ GROUP MESSAGING ------------------------ */

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
        })

        socket.on("received group message", ({ groupId, phone, time }) => {
            // person has gotten the message (double ticks)
            socket.broadcast.to(groupId).emit("delivered group message", { phone, time })
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