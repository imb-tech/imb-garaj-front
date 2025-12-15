type SubTask = {
    id: number
    title: string
    finished: boolean
}

type QuoteCard = {
    id: number
    title: string
    is_action: boolean
    is_checked: boolean
    middle_name: string
    status_id: number
    desc: string
    priority: 1 | 2 | 3
    deadline: string
    subtasks: SubTask[]
    files: { file: any; type: string, id?: number }[] | []
    users: number[]
    users_data: {
        id: number
        face: string,
        last_name: string,
        first_name: string
        middle_name: string
    }[]
    todo: number
    finished: number
    remind_at: string
    author: {
        id: number
        full_name: string
        face: string
    }
}


type Column = {
    id: string
    name: string
    count: number
    is_author: boolean
    has_delete: boolean
    tasks: QuoteCard[]
}

type FormValues = {
    name: string
    is_update: boolean
    background: string
    author?: string
    id: number
    statuses: {
        name: string
        count: number
    }[]
    created_at: string
    users: {
        id: number
        face: string,
        full_name: string,
    }[]
    employees: number[]
}