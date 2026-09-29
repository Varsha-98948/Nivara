export type CareCategory = "all" | "clinic" | "hospital" | "emergency";

export interface HealthcareProvider {
  id: string;
  name: string;
  category: "clinic" | "hospital" | "emergency";
  categoryLabel: string;
  area: string;
  city: string;
  pinCode: string;
  address: string;
  phone: string;
  distanceKm: number;
  emergencyAvailable: boolean;
  hours: string;
  openNow: boolean;
}

// Curated demo data mapped to prominent Indian postal codes
const CURATED_PROVIDERS: Record<string, HealthcareProvider[]> = {
  "560001": [
    {
      id: "blr-1",
      name: "Manipal Hospital — Emergency Department",
      category: "emergency",
      categoryLabel: "Emergency Care",
      area: "Old Airport Road",
      city: "Bengaluru",
      pinCode: "560001",
      address: "98 HAL Old Airport Road, Kodihalli, Bengaluru",
      phone: "+91 80 2502 4444",
      distanceKm: 1.8,
      emergencyAvailable: true,
      hours: "24 / 7 Emergency",
      openNow: true,
    },
    {
      id: "blr-2",
      name: "St. Martha's Hospital",
      category: "hospital",
      categoryLabel: "Multispeciality Hospital",
      area: "Nrupathunga Road",
      city: "Bengaluru",
      pinCode: "560001",
      address: "5 Nrupathunga Rd, Opp. Reserve Bank of India, Bengaluru",
      phone: "+91 80 4012 8200",
      distanceKm: 0.9,
      emergencyAvailable: true,
      hours: "24 Hours (OPD 8 AM – 6 PM)",
      openNow: true,
    },
    {
      id: "blr-3",
      name: "Apollo Clinic — Central",
      category: "clinic",
      categoryLabel: "Doctor / Clinic",
      area: "Richmond Town",
      city: "Bengaluru",
      pinCode: "560001",
      address: "34 Richmond Rd, Bengaluru",
      phone: "+91 80 4123 5500",
      distanceKm: 1.4,
      emergencyAvailable: false,
      hours: "7:30 AM – 9:00 PM",
      openNow: true,
    },
    {
      id: "blr-4",
      name: "Bowring and Lady Curzon Hospital",
      category: "hospital",
      categoryLabel: "Government Hospital",
      area: "Shivaji Nagar",
      city: "Bengaluru",
      pinCode: "560001",
      address: "Lady Curzon Rd, Tasker Town, Shivaji Nagar, Bengaluru",
      phone: "+91 80 2559 1325",
      distanceKm: 1.2,
      emergencyAvailable: true,
      hours: "24 / 7 Emergency",
      openNow: true,
    },
    {
      id: "blr-5",
      name: "CareFirst Family Health Clinic",
      category: "clinic",
      categoryLabel: "Doctor / Clinic",
      area: "MG Road",
      city: "Bengaluru",
      pinCode: "560001",
      address: "12 Barton Centre, MG Road, Bengaluru",
      phone: "+91 80 2558 7711",
      distanceKm: 0.6,
      emergencyAvailable: false,
      hours: "9:00 AM – 8:00 PM",
      openNow: true,
    },
  ],
  "110001": [
    {
      id: "del-1",
      name: "Dr. Ram Manohar Lohia Hospital — Emergency Care",
      category: "emergency",
      categoryLabel: "Emergency Care",
      area: "Connaught Place",
      city: "New Delhi",
      pinCode: "110001",
      address: "Baba Kharak Singh Marg, Connaught Place, New Delhi",
      phone: "+91 11 2336 5525",
      distanceKm: 1.1,
      emergencyAvailable: true,
      hours: "24 / 7 Emergency & Trauma",
      openNow: true,
    },
    {
      id: "del-2",
      name: "Lady Hardinge Medical College & Hospital",
      category: "hospital",
      categoryLabel: "Multispeciality Hospital",
      area: "Shaheed Bhagat Singh Marg",
      city: "New Delhi",
      pinCode: "110001",
      address: "C-604, Shaheed Bhagat Singh Marg, DIZ Area, New Delhi",
      phone: "+91 11 2336 3728",
      distanceKm: 0.8,
      emergencyAvailable: true,
      hours: "24 Hours Open",
      openNow: true,
    },
    {
      id: "del-3",
      name: "Max Multi Speciality Centre — CP",
      category: "clinic",
      categoryLabel: "Doctor / Clinic",
      area: "Barakhamba Road",
      city: "New Delhi",
      pinCode: "110001",
      address: "26 Kasturba Gandhi Marg, Connaught Place, New Delhi",
      phone: "+91 11 4355 5555",
      distanceKm: 1.3,
      emergencyAvailable: false,
      hours: "8:00 AM – 8:00 PM",
      openNow: true,
    },
    {
      id: "del-4",
      name: "Apollo Clinic — Central Delhi",
      category: "clinic",
      categoryLabel: "Doctor / Clinic",
      area: "Janpath",
      city: "New Delhi",
      pinCode: "110001",
      address: "48 Janpath Rd, Connaught Place, New Delhi",
      phone: "+91 11 4151 7700",
      distanceKm: 0.7,
      emergencyAvailable: false,
      hours: "8:30 AM – 7:30 PM",
      openNow: true,
    },
  ],
  "400001": [
    {
      id: "mum-1",
      name: "St. George's Hospital — Emergency Trauma Centre",
      category: "emergency",
      categoryLabel: "Emergency Care",
      area: "Fort",
      city: "Mumbai",
      pinCode: "400001",
      address: "P D'Mello Rd, Near CSMT Station, Fort, Mumbai",
      phone: "+91 22 2262 0241",
      distanceKm: 0.5,
      emergencyAvailable: true,
      hours: "24 / 7 Emergency",
      openNow: true,
    },
    {
      id: "mum-2",
      name: "Bombay Hospital & Medical Research Centre",
      category: "hospital",
      categoryLabel: "Multispeciality Hospital",
      area: "Marine Lines",
      city: "Mumbai",
      pinCode: "400001",
      address: "12 New Marine Lines, Mumbai",
      phone: "+91 22 2206 7676",
      distanceKm: 1.6,
      emergencyAvailable: true,
      hours: "24 Hours (OPD 8 AM – 8 PM)",
      openNow: true,
    },
    {
      id: "mum-3",
      name: "Fort Family Clinic & Diagnostic Centre",
      category: "clinic",
      categoryLabel: "Doctor / Clinic",
      area: "Kala Ghoda",
      city: "Mumbai",
      pinCode: "400001",
      address: "18 Ropewalk Lane, Kala Ghoda, Fort, Mumbai",
      phone: "+91 22 2284 3311",
      distanceKm: 0.8,
      emergencyAvailable: false,
      hours: "9:00 AM – 8:00 PM",
      openNow: true,
    },
  ],
  "600001": [
    {
      id: "chn-1",
      name: "Rajiv Gandhi Government General Hospital",
      category: "emergency",
      categoryLabel: "Emergency Care",
      area: "Park Town",
      city: "Chennai",
      pinCode: "600001",
      address: "EVR Periyar Salai, Park Town, Chennai",
      phone: "+91 44 2530 5000",
      distanceKm: 1.2,
      emergencyAvailable: true,
      hours: "24 / 7 Trauma Care",
      openNow: true,
    },
    {
      id: "chn-2",
      name: "Apollo Hospital — Greams Road",
      category: "hospital",
      categoryLabel: "Multispeciality Hospital",
      area: "Thousand Lights",
      city: "Chennai",
      pinCode: "600001",
      address: "21 Greams Lane, Off Greams Road, Chennai",
      phone: "+91 44 2829 0200",
      distanceKm: 3.1,
      emergencyAvailable: true,
      hours: "24 Hours Open",
      openNow: true,
    },
    {
      id: "chn-3",
      name: "Parrys Medical Clinic & Lab",
      category: "clinic",
      categoryLabel: "Doctor / Clinic",
      area: "George Town",
      city: "Chennai",
      pinCode: "600001",
      address: "52 Armenian Street, George Town, Chennai",
      phone: "+91 44 2538 9011",
      distanceKm: 0.4,
      emergencyAvailable: false,
      hours: "8:00 AM – 7:30 PM",
      openNow: true,
    },
  ],
  "500001": [
    {
      id: "hyd-1",
      name: "Osmania General Hospital — Emergency Services",
      category: "emergency",
      categoryLabel: "Emergency Care",
      area: "Afzal Gunj",
      city: "Hyderabad",
      pinCode: "500001",
      address: "Afzal Gunj, High Court Rd, Hyderabad",
      phone: "+91 40 2460 0121",
      distanceKm: 1.1,
      emergencyAvailable: true,
      hours: "24 / 7 Emergency",
      openNow: true,
    },
    {
      id: "hyd-2",
      name: "Care Hospitals — Nampally",
      category: "hospital",
      categoryLabel: "Multispeciality Hospital",
      area: "Nampally",
      city: "Hyderabad",
      pinCode: "500001",
      address: "Exhibition Grounds Rd, Mukarramjahi Rd, Hyderabad",
      phone: "+91 40 6165 6565",
      distanceKm: 1.4,
      emergencyAvailable: true,
      hours: "24 Hours (OPD 9 AM – 7 PM)",
      openNow: true,
    },
    {
      id: "hyd-3",
      name: "Abids Polyclinic & Family Health Centre",
      category: "clinic",
      categoryLabel: "Doctor / Clinic",
      area: "Abids",
      city: "Hyderabad",
      pinCode: "500001",
      address: "Station Road, Abids, Hyderabad",
      phone: "+91 40 2473 4422",
      distanceKm: 0.6,
      emergencyAvailable: false,
      hours: "9:00 AM – 8:30 PM",
      openNow: true,
    },
  ],
};

// Procedural generator for any other valid 6-digit Indian PIN code
function generateRegionalProviders(pin: string): HealthcareProvider[] {
  const seed = parseInt(pin, 10);
  const distBase = ((seed % 15) + 5) / 10; // 0.5 to 1.9 km

  return [
    {
      id: `gen-emg-${pin}`,
      name: `District Civil Hospital & Emergency Unit (${pin})`,
      category: "emergency",
      categoryLabel: "Emergency Care",
      area: `Sector ${pin.slice(-2)}`,
      city: `Regional Zone ${pin.slice(0, 2)}`,
      pinCode: pin,
      address: `Main Hospital Road, Near Postal Zone ${pin}`,
      phone: "+91 1800 112 001",
      distanceKm: Number((distBase + 0.4).toFixed(1)),
      emergencyAvailable: true,
      hours: "24 / 7 Emergency & Trauma",
      openNow: true,
    },
    {
      id: `gen-hosp-${pin}`,
      name: `Community Multispeciality Hospital`,
      category: "hospital",
      categoryLabel: "Multispeciality Hospital",
      area: `Central Circle, Pin ${pin}`,
      city: `Zone ${pin.slice(0, 2)}`,
      pinCode: pin,
      address: `Civil Lines Road, Postal Sub-Division ${pin.slice(0, 3)}`,
      phone: "+91 1800 220 445",
      distanceKm: Number((distBase + 1.2).toFixed(1)),
      emergencyAvailable: true,
      hours: "24 Hours (OPD 8 AM – 7 PM)",
      openNow: true,
    },
    {
      id: `gen-cln-${pin}`,
      name: `Urban Primary Health Centre & Family Clinic`,
      category: "clinic",
      categoryLabel: "Doctor / Clinic",
      area: `Market Road, PIN ${pin}`,
      city: `Zone ${pin.slice(0, 2)}`,
      pinCode: pin,
      address: `Station Approach Road, PIN ${pin}`,
      phone: "+91 1800 334 112",
      distanceKm: Number((distBase).toFixed(1)),
      emergencyAvailable: false,
      hours: "8:30 AM – 7:30 PM",
      openNow: true,
    },
  ];
}

/** Validate standard 6-digit Indian Postal PIN code (cannot start with 0) */
export function validateIndianPin(pin: string): { valid: boolean; error?: string } {
  const trimmed = pin.trim();
  if (!trimmed) {
    return { valid: false, error: "Please enter a 6-digit Indian PIN code." };
  }
  if (!/^\d+$/.test(trimmed)) {
    return { valid: false, error: "PIN code must contain numbers only." };
  }
  if (trimmed.length !== 6) {
    return { valid: false, error: "PIN code must be exactly 6 digits." };
  }
  if (trimmed.startsWith("0")) {
    return { valid: false, error: "Indian postal PIN codes do not begin with 0." };
  }
  return { valid: true };
}

/** Lookup providers for a given PIN code and optional category */
export async function getHealthcareProviders(
  pin: string,
  category: CareCategory = "all"
): Promise<HealthcareProvider[]> {
  // Simulate small network delay for realistic lookups
  await new Promise((resolve) => setTimeout(resolve, 350));

  const trimmed = pin.trim();
  const list = CURATED_PROVIDERS[trimmed] || generateRegionalProviders(trimmed);

  if (category === "all") {
    return list;
  }
  return list.filter((p) => p.category === category);
}

export const SAMPLE_PINS = [
  { pin: "560001", label: "Bengaluru (Central)" },
  { pin: "110001", label: "New Delhi (CP)" },
  { pin: "400001", label: "Mumbai (Fort)" },
  { pin: "600001", label: "Chennai (George Town)" },
  { pin: "500001", label: "Hyderabad (Abids)" },
];
