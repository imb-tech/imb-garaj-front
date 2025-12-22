interface TripFormData {
    driver: number | string // adjust to number if IDs are numbers
    vehicle: number | string
    start: Date
    type: number | string
}


type CardMain = {
    current_balance: number
    current_balance_perc: number
    difference: number
    difference_perc: number
    expenses: number
    expense_perc: number
    incomes: number
    income_perc: number
}

type TripRow = {
  id: number|string;
  created: string; // ISO datetime string
  updated: string; // ISO datetime string
  status: number;
  type: number;
  start: string; // YYYY-MM-DD date string
  end: string | null; // YYYY-MM-DD or null if ongoing
  driver: number; // driver ID
  vehicle: number; // vehicle ID
}

type Truck ={
  id: number;
  created: string; // ISO 8601 datetime string
  updated: string; // ISO 8601 datetime string
  truck_number: string;
  truck_passport: string;
  trailer_number: string | null;
  fuel: string;
  truck_type: number;
  trailer_type: number | null;
  driver: number;
}

type CargoItem = {
  id: number;
  created: string; 
  updated: string; 
  name: string;
};

type TripsOrders = {
  id?:string|number
  loading: number
  unloading: number
  trip: number
}

type DistrictType ={
  name:string,
  id:number|number
}

type TripOrdersRow = {
  id: number
  created: string // ISO datetime
  updated: string
  loading: number
  unloading: number
  trip: number
  cargo_type: number | null
}