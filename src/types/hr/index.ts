type Filter = {
  id: number
  name: string
  first_name: string
  last_name: string
}





type HumanProfile = {
  phone_number: string | number;
  phone_number2: string;
  id_number: string;
  address: string;
  residence: string;
  education: string | number;
}
type Human = {
  profile: HumanProfile
  phone: string | number;
  deleted_at: string
  salary_amount_type: string
  attendance_json?: {
    attendance_time?: string
    left_time?: string
  }
  delete_reason: string
  fine_name: string
  is_active: boolean
  is_accessible: boolean
  phone_number: string | number;
  phone_number2: string;
  id_number: string;
  attendance_status?: number
  address: string;
  residence: string;
  education: string | number;
  id: number;
  role: string | number;
  salary: number | string | undefined;
  password?: string
  username?: string
  advance: number
  bonus: number
  first_name?: string
  last_name?: string
  middle_name: string;
  work_shift_start?: string
  work_shift_end?: string
  image?: string
  full_name?: string
  companies?: string[]
  companies_name?: string[]
  role_name?: string
  has_attendance?: boolean
  excuses_status?: string | number
  status?: boolean
  face?: any
  shift_name?: string
  fine: number
  fine_id: number
  shift?: number
  hikvision_id?: number
  actions?: string[]
  salary_start: string
  salary_type: string
  salary_type_name: string
  fine_start: string
  is_phone_login?: boolean
  department_name: string
};

type HumanInMap = {}

type HumanYear = {
  year: number;
  late_count: number;
  early_checkout: string
  fine: string;
  date?: string;
  late_duraction: string
  month: string
  late_duration: string
  user: number
  salary: number
  left_time: string
  attendance_time: string
  work_shift_start: string
  work_shift_end: string
  status: string
  id: number
}



type Advance = {
  id: number
  employee: number | null
  amount: number | null
  description?: string
  date: string
  created_at: string
  employee_name: string
}


type Salary = {
  from_date: string
  to_date: string
  id: number
  users: string[]
  date: {
    from_date?: string
    to_date?: string
  }
  salary: number
  bonus: number
  name: string
  fine: number
  total: number
  count: number
  advance: number
  employee_name?: string
  employee_id?: number
  status: 1 | 2 | 3
  work_minutes: number
  percentage: number
}


