type AllBalances = {
    agentlar_balansi: number;
    main_balance: number;
    umumiy_boshqa_harajatlar: number;
    umumiy_reyslar_boyicha_harajatlar: number;
};

type Transactions = {
    id: number
    created_at: string
    amount: string;
    comment: string;
    full_name: string;
    status: 1 | 2 | 3 | 4;
};

type Agent = {
    balance: string;
    defetsit?: number;
    full_name: string;
    id: number;
};


type Receipt = {
    id: number
    amount: number
    agent: number
    created_at: string
    action: number
    comment: string
    cashier_name:string
    status: number
    rejected_comment:string
};


type CashTransfers = {
    id: number;
    code: string;
    wanted_date: string;
    departure_point: string;
    destination: string;
    agent_status: number;
    truck_id: string;
    trailer_id: string;
    full_name: string;
    cash: number;
    phone_number: string;
    company_code: number;
    prastoy: number;
    reyestr_comment: string;
};

type THistory = {
    agent: Agent;
    cash: number;
    code: string;
    company_code: number;
    departure_point: string;
    destination: string;
    full_name: string;
    id: number;
    phone_number: string;
    trailer_id: string;
    truck_id: string;
    wanted_date: string;
    prastoy: number;
    reyestr_comment: string;
    ttn_document_url: string;
};


