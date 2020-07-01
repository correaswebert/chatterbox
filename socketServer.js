const { addUser, removeUser, getUser } = require("./users");
// this should be a database
const users = [];
function PersonalChatHandler(io) { }
function GroupChatHandler(io) {
    io.on("connect", (socket) => {
        socket.on("join group", ({ phone, group, time }, callback) => {
            const { error, user } = addUser({ id: socket.id, name, group });
            if (error)
                return callback(error);
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
module.exports = [GroupChatHandler, PersonalChatHandler];
