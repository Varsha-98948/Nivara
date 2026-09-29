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
  distanceKm?: number;
  emergencyAvailable: boolean;
  hours: string;
  openNow?: boolean;
  source?: string;
  lat?: number;
  lon?: number;
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

/**
 * Fetch real healthcare facilities for an Indian PIN code via server-side provider API.
 * Data source: Hospital Directory of India (National Health Portal / Living Atlas).
 */
export async function getHealthcareProviders(
  pin: string,
  category: CareCategory = "all"
): Promise<HealthcareProvider[]> {
  const trimmed = pin.trim();
  const validation = validateIndianPin(trimmed);
  if (!validation.valid) {
    return [];
  }

  try {
    const params = new URLSearchParams({
      pin: trimmed,
      category,
    });

    const res = await fetch(`/api/providers?${params.toString()}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return Array.isArray(data.providers) ? data.providers : [];
  } catch {
    // Network / client error — return empty list gracefully without crashing
    return [];
  }
}

/** Verified Indian PIN codes with facilities in the India Hospital Directory */
export const SAMPLE_PINS = [
  { pin: "110001", label: "New Delhi (Connaught Place)" },
  { pin: "400001", label: "Mumbai (Fort / CST)" },
  { pin: "600001", label: "Chennai (George Town)" },
  { pin: "500001", label: "Hyderabad (Abids)" },
  { pin: "560029", label: "Bengaluru (NIMHANS / Dairy Cir.)" },
];
