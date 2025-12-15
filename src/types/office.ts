type Geometry = {
  type: "Point";
  coordinates: [number, number];
};

type Polygon = {
  type: "Polygon";
  coordinates: number[][][];
};


type Properties = {
  id: number
  address: string;
  region:number
  lunch_start_time: string;
  lunch_end_time: string;
  name: string;
  polygon: Polygon;
  users: string;
  locations: string[];
  employee_count?: number
  exists_count: number,
  total_count: number,
  absend_count: number
  persentage: number
  departments: number
}


type Office = {
  type: "Feature";
  id: number;
  geometry: Geometry;
  properties: Properties;
};

type FeatureCollection = {
  type: "FeatureCollection";
  features: Office[];
};

type UserPoint = {
  id: number,
  full_name: string
  urole_id?:number
  company: number
  lat: number,
  lng: number
}


type OfficeInfo = {
  group_id: number
  name: string
  total_workers_count: number
  checked_in_workers: number
  absent_users: number
  early_users: number
  late_users_count: number
}


type WorkerInfo = {
  id: number
  full_name: string
  entrance_time: string
  latency: string
  check_out_time: string
  last_company: string
  entry_log_status: string
}

interface WorkerAttendance {
  id: number
  full_name: string
  face: string
  entry_log_status: number
  work_shift_start: string
  work_shift_end: string
  work_day:boolean
  role_id?: number
  attendance: {
    status: 0 | 1
    duration: string
    left_time: string
    attendance_time: string
  } | null
}


type Company = {
  id: number;
  name: string;
  users_in_company: number;
  absent_users: number;
  total_users_count: number;
  absent_users_with_reason_count: number;
  absent_users_with_no_reason_count: number;
  late_users_count: number;
  in_time_users: number;
}


type CompanyStats = {
  id: number
  in_time: number
  late: number
  excused: number
  absent: number
  total: number
  role: string
  department: string
}