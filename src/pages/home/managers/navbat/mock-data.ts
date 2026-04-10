import { Excavator, QueueDriver } from "./types"

export const mockDrivers: QueueDriver[] = [
    { id: 1, name: "Abdullayev Jamshid", truck_number: "01 A 123 BC", phone: "+998901234567", status: "in_queue", position: 1, excavator_id: 1, arrival_time: "08:30", location: "Olmaliq" },
    { id: 2, name: "Karimov Bobur", truck_number: "01 B 456 DE", phone: "+998901234568", status: "in_queue", position: 2, excavator_id: 1, arrival_time: "08:45", location: "Olmaliq" },
    { id: 3, name: "Toshmatov Sardor", truck_number: "01 C 789 FG", phone: "+998901234569", status: "loading", position: null, excavator_id: 1, arrival_time: "08:15", location: "Olmaliq" },
    { id: 4, name: "Rahimov Ulug'bek", truck_number: "01 D 012 HI", phone: "+998901234570", status: "in_queue", position: 1, excavator_id: 2, arrival_time: "09:00", location: "Angren" },
    { id: 5, name: "Normatov Aziz", truck_number: "01 E 345 JK", phone: "+998901234571", status: "in_queue", position: 2, excavator_id: 2, arrival_time: "09:10", location: "Angren" },
    { id: 6, name: "Yusupov Farrux", truck_number: "01 F 678 LM", phone: "+998901234572", status: "available", position: null, excavator_id: null, arrival_time: null, location: "Chirchiq" },
    { id: 7, name: "Xasanov Otabek", truck_number: "01 G 901 NP", phone: "+998901234573", status: "in_transit", position: null, excavator_id: null, arrival_time: null, location: "Yo'lda → Olmaliq" },
    { id: 8, name: "Mirzayev Sherzod", truck_number: "01 H 234 QR", phone: "+998901234574", status: "unavailable", position: null, excavator_id: null, arrival_time: null, location: null },
    { id: 9, name: "Sobirov Dostonbek", truck_number: "01 I 567 ST", phone: "+998901234575", status: "available", position: null, excavator_id: null, arrival_time: null, location: "Toshkent" },
    { id: 10, name: "Ergashev Mansur", truck_number: "01 J 890 UV", phone: "+998901234576", status: "in_queue", position: 3, excavator_id: 1, arrival_time: "09:20", location: "Olmaliq" },
]

export const mockExcavators: Excavator[] = [
    {
        id: 1,
        name: "Ekskavator #1",
        number: "01 X 001 AA",
        location: "Olmaliq karyer",
        status: "active",
        queue: [],
    },
    {
        id: 2,
        name: "Ekskavator #2",
        number: "01 X 002 BB",
        location: "Angren razrez",
        status: "active",
        queue: [],
    },
    {
        id: 3,
        name: "Ekskavator #3",
        number: "01 X 003 CC",
        location: "Chirchiq",
        status: "maintenance",
        queue: [],
    },
]
