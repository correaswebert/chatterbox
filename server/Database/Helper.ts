import PhoneSocket from "../Models/PhoneSocket";

export function getSocketFromPhone(phone: number): string {
    return PhoneSocket.findOne({ phone }).socket_id
}

export function getPhoneFromSocket(socket_id: string): number {
    return PhoneSocket.findOne({ socket_id }).phone
}

export function createPhoneSocketRelation(phone: number, socket_id: string) {
    const phone_socket = new PhoneSocket({
        phone, socket_id
    });
    phone_socket.save();
}
export function deletePhoneSocketRelation(phone: number, socket_id: string) {
    PhoneSocket.deleteOne({ phone, socket_id });
}

export function checkPendingMessages(phone: number): Message[] {
    return []
}

// add the message to the pending messages of phone
export function addToPendingMessages(message: Message, phone: number) {

}