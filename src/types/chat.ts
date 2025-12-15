type UserChat = {
    id: string
    full_name: string
    face: string
}

type FileData = {
    name: string
    size: number
    type: string
    url: string
}

type MessageType = "text" | "file"

type Message = {
    created_at: string
    files?: FileData[]
    id: string
    reply?: Message
    task: number
    text: string
    updated_at: string
    user: UserChat
    is_self:boolean
    edited?: boolean
    type: string
}
