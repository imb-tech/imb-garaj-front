type TruckCreate = {
  truck_number: string;
  truck_passport: string;
  trailer_number: string;
  fuel: "methane" | "diesel" | "gasoline" | "lpg"; // adjust literals if needed
  truck_type: number;
  trailer_type: number;
  driver: number;
};
type TrailerType = {
    id: number
    name: string
}
