/* GaragHub mock data */
const GH_DATA = {
    kpis: [
        { label: "Revenue (this month)", value: "$48,250", delta: "+12.5%", up: true, icon: "dollar", tone: "success" },
        { label: "Active Work Orders", value: "18", delta: "+3 today", up: true, icon: "wrench", tone: "primary" },
        { label: "Vehicles in Shop", value: "11", delta: "-2 vs yesterday", up: false, icon: "car", tone: "warning" },
        { label: "Appointments Today", value: "7", delta: "+2 vs avg", up: true, icon: "calendar", tone: "primary" }
    ],

    revenue: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        values: [5200, 6100, 4800, 7300, 8100, 9450, 3200],
        trend: "+18%"
    },

    services: {
        labels: ["Oil Change", "Brakes", "Tires", "Diagnostics", "Engine", "Other"],
        values: [32, 21, 18, 12, 9, 8]
    },

    workOrders: [
        { id: "WO-1042", customer: "Sarah Chen", vehicle: "2021 Toyota Camry", service: "Brake Pad Replacement", tech: "Mike J.", status: "In Progress", progress: 65, total: 480 },
        { id: "WO-1041", customer: "David Miller", vehicle: "2018 Honda Civic", service: "Oil Change + Filter", tech: "Anna K.", status: "In Progress", progress: 30, total: 89 },
        { id: "WO-1040", customer: "Lisa Wong", vehicle: "2020 Ford F-150", service: "Transmission Diagnostics", tech: "Carlos R.", status: "Waiting Parts", progress: 45, total: 950 },
        { id: "WO-1039", customer: "James Park", vehicle: "2019 BMW 330i", service: "Tire Rotation + Alignment", tech: "Mike J.", status: "In Progress", progress: 80, total: 220 },
        { id: "WO-1038", customer: "Emma Davis", vehicle: "2022 Tesla Model 3", service: "Cabin Filter + Inspection", tech: "Anna K.", status: "Completed", progress: 100, total: 145 },
        { id: "WO-1037", customer: "Robert Lee", vehicle: "2017 Jeep Wrangler", service: "Suspension Repair", tech: "Carlos R.", status: "Waiting Parts", progress: 20, total: 1280 },
        { id: "WO-1036", customer: "Maria Garcia", vehicle: "2021 Subaru Outback", service: "Coolant Flush", tech: "Mike J.", status: "Completed", progress: 100, total: 130 },
        { id: "WO-1035", customer: "Tom Wilson", vehicle: "2016 Audi A4", service: "Timing Belt Replacement", tech: "Carlos R.", status: "Completed", progress: 100, total: 890 }
    ],

    appointments: [
        { time: "9:00", customer: "Nina Patel", vehicle: "2020 Mazda CX-5", service: "Annual Inspection", date: "Today" },
        { time: "10:30", customer: "Greg Adams", vehicle: "2019 Chevy Malibu", service: "Check Engine Light", date: "Today" },
        { time: "11:15", customer: "Sophie Turner", vehicle: "2022 Kia Sportage", service: "Oil Change", date: "Today" },
        { time: "13:00", customer: "Marcus Reid", vehicle: "2018 Nissan Altima", service: "Brake Inspection", date: "Today" },
        { time: "14:30", customer: "Olivia Brooks", vehicle: "2021 VW Jetta", service: "AC Repair", date: "Today" },
        { time: "15:45", customer: "Henry Cole", vehicle: "2017 Dodge Charger", service: "Battery Replacement", date: "Today" },
        { time: "16:30", customer: "Grace Kim", vehicle: "2023 Hyundai Tucson", service: "Tire Replacement", date: "Today" },
        { time: "9:00", customer: "Frank Ortiz", vehicle: "2015 GMC Sierra", service: "Transmission Service", date: "Tomorrow" },
        { time: "11:00", customer: "Amy Zhao", vehicle: "2020 Lexus RX", service: "Wheel Alignment", date: "Tomorrow" }
    ],

    vehicles: [
        { plate: "8XKR203", vehicle: "2021 Toyota Camry", owner: "Sarah Chen", mileage: "42,150", bay: "Bay 1", status: "In Progress" },
        { plate: "5TRM891", vehicle: "2018 Honda Civic", owner: "David Miller", mileage: "68,900", bay: "Bay 2", status: "In Progress" },
        { plate: "2LPW447", vehicle: "2020 Ford F-150", owner: "Lisa Wong", mileage: "31,220", bay: "Bay 3", status: "Waiting Parts" },
        { plate: "9BMH330", vehicle: "2019 BMW 330i", owner: "James Park", mileage: "55,780", bay: "Bay 4", status: "In Progress" },
        { plate: "7JEP004", vehicle: "2017 Jeep Wrangler", owner: "Robert Lee", mileage: "88,410", bay: "Lot A", status: "Waiting Parts" }
    ],

    customers: [
        { name: "Sarah Chen", phone: "(415) 555-0182", vehicles: 2, visits: 9, spent: "$3,420", since: "2020" },
        { name: "David Miller", phone: "(415) 555-0147", vehicles: 1, visits: 5, spent: "$1,180", since: "2021" },
        { name: "Lisa Wong", phone: "(650) 555-0199", vehicles: 3, visits: 14, spent: "$6,890", since: "2018" },
        { name: "James Park", phone: "(408) 555-0163", vehicles: 1, visits: 7, spent: "$2,760", since: "2019" },
        { name: "Emma Davis", phone: "(415) 555-0121", vehicles: 1, visits: 3, spent: "$620", since: "2023" },
        { name: "Robert Lee", phone: "(510) 555-0175", vehicles: 2, visits: 11, spent: "$4,510", since: "2019" },
        { name: "Maria Garcia", phone: "(650) 555-0138", vehicles: 1, visits: 6, spent: "$1,940", since: "2021" }
    ]
};
