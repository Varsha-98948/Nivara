import { NextRequest, NextResponse } from "next/server";
import { validateIndianPin, HealthcareProvider, CareCategory } from "@/lib/providers";

const LIVING_ATLAS_HOSPITALS_URL =
  "https://livingatlas.esri.in/server/rest/services/LivingAtlas/IND_Hospital_Directory/MapServer/0/query";

interface FeatureAttributes {
  objectid?: number;
  globalid?: string;
  health_facility_name?: string;
  address?: string;
  street?: string;
  landmark?: string;
  locality?: string;
  posatalcode?: string;
  landline_number?: string;
  facility_type?: string;
  state_name?: string;
  district_name?: string;
  taluka_name?: string;
  block_name?: string;
  lat?: number;
  lon?: number;
  [key: string]: unknown;
}

function cleanStr(val: unknown): string {
  if (typeof val !== "string") return "";
  const trimmed = val.trim();
  if (trimmed === "\\N" || trimmed === "N/A" || trimmed === "null" || trimmed === "undefined") {
    return "";
  }
  return trimmed;
}

function normalizeProvider(
  attr: FeatureAttributes,
  pin: string,
  index: number
): HealthcareProvider {
  const rawName = cleanStr(attr.health_facility_name) || "Healthcare Facility";
  const rawType = cleanStr(attr.facility_type);
  const nameLower = rawName.toLowerCase();
  const typeLower = rawType.toLowerCase();

  // Determine category & emergency status
  const isEmergencyMentioned =
    nameLower.includes("emergency") ||
    nameLower.includes("trauma") ||
    nameLower.includes("casualty") ||
    nameLower.includes("24x7") ||
    nameLower.includes("24/7") ||
    nameLower.includes("icu") ||
    typeLower.includes("district hospital");

  let category: "emergency" | "hospital" | "clinic" = "hospital";
  let categoryLabel = rawType || "Hospital";

  if (
    nameLower.includes("emergency") ||
    nameLower.includes("trauma") ||
    nameLower.includes("casualty")
  ) {
    category = "emergency";
    categoryLabel = "Emergency / Trauma Care";
  } else if (
    typeLower.includes("subcentre") ||
    typeLower.includes("sub centre") ||
    typeLower.includes("primary health") ||
    typeLower.includes("urban health") ||
    typeLower.includes("clinic") ||
    typeLower.includes("dispensary") ||
    nameLower.includes("clinic") ||
    nameLower.includes("dispensary") ||
    nameLower.includes("health centre") ||
    nameLower.includes("phc")
  ) {
    category = "clinic";
    categoryLabel = rawType || "Primary Health Centre";
  } else if (
    typeLower.includes("hospital") ||
    typeLower.includes("medical college") ||
    nameLower.includes("hospital")
  ) {
    category = "hospital";
    categoryLabel = rawType || "General / District Hospital";
  }

  // Build clean address
  const addrParts = [
    cleanStr(attr.address),
    cleanStr(attr.street),
    cleanStr(attr.locality),
    cleanStr(attr.landmark),
  ].filter(Boolean);

  let formattedAddress = addrParts.join(", ").replace(/,\s*,/g, ", ").trim();
  if (formattedAddress.endsWith(",")) {
    formattedAddress = formattedAddress.slice(0, -1).trim();
  }
  if (!formattedAddress) {
    formattedAddress = `${rawName}, Area PIN ${pin}`;
  }

  const rawPhone = cleanStr(attr.landline_number);
  const phone = rawPhone && !/^0+$/.test(rawPhone) ? rawPhone : "";

  const area =
    cleanStr(attr.locality) ||
    cleanStr(attr.street) ||
    cleanStr(attr.taluka_name) ||
    cleanStr(attr.district_name) ||
    `Postal PIN ${pin}`;

  const city =
    cleanStr(attr.district_name) ||
    cleanStr(attr.state_name) ||
    "India";

  const stateName = cleanStr(attr.state_name);
  const cityWithState = stateName && stateName !== city ? `${city}, ${stateName}` : city;

  const lat = typeof attr.lat === "number" && !isNaN(attr.lat) && attr.lat !== 0 ? attr.lat : undefined;
  const lon = typeof attr.lon === "number" && !isNaN(attr.lon) && attr.lon !== 0 ? attr.lon : undefined;

  return {
    id: String(attr.objectid ?? attr.globalid ?? `fac-${pin}-${index}`),
    name: rawName,
    category,
    categoryLabel,
    area,
    city: cityWithState,
    pinCode: cleanStr(attr.posatalcode) || pin,
    address: formattedAddress,
    phone,
    emergencyAvailable: isEmergencyMentioned,
    hours: isEmergencyMentioned ? "24 / 7 Emergency & Casualty" : "Contact facility for timings",
    openNow: isEmergencyMentioned ? true : undefined,
    source: "India Hospital Directory (NHP / Living Atlas)",
    lat,
    lon,
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pin = searchParams.get("pin")?.trim() || "";
  const category = (searchParams.get("category") || "all") as CareCategory;

  const validation = validateIndianPin(pin);
  if (!validation.valid) {
    return NextResponse.json(
      { error: validation.error || "Invalid 6-digit Indian PIN code." },
      { status: 400 }
    );
  }

  try {
    const params = new URLSearchParams({
      where: `posatalcode='${pin}'`,
      outFields: "*",
      f: "json",
      returnGeometry: "false",
      resultRecordCount: "100",
    });

    const res = await fetch(`${LIVING_ATLAS_HOSPITALS_URL}?${params.toString()}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      return NextResponse.json({
        providers: [],
        total: 0,
        source: "India Hospital Directory (NHP / Living Atlas)",
      });
    }

    const data = await res.json();
    const features: { attributes: FeatureAttributes }[] = Array.isArray(data.features)
      ? data.features
      : [];

    let providers = features.map((f, i) => normalizeProvider(f.attributes || {}, pin, i));

    // Filter by care category if requested
    if (category === "emergency") {
      providers = providers.filter((p) => p.category === "emergency" || p.emergencyAvailable);
    } else if (category === "hospital") {
      providers = providers.filter((p) => p.category === "hospital");
    } else if (category === "clinic") {
      providers = providers.filter((p) => p.category === "clinic");
    }

    return NextResponse.json({
      providers,
      total: providers.length,
      source: "India Hospital Directory (NHP / Living Atlas)",
    });
  } catch {
    // Graceful error fallback: never crash or expose internal/provider errors
    return NextResponse.json({
      providers: [],
      total: 0,
      source: "India Hospital Directory (NHP / Living Atlas)",
    });
  }
}
