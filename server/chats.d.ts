interface Person {
    phone: number
    name: string
    avatar?: any
}

interface GroupJoin {
    phone: number,
    gid: number,
    time: number,
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

// module.exports = [Group, Person, Message];