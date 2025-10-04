import { useState } from "react";

interface LocationDetails {
  city?: string;
  postcode?: string;
  continent?: string; // Not available in Google API
  country?: string;
  road?: string;
  state?: string;
  state_code?: string;
  state_district?: string;
  full_address?: string;
  address_line?: string; // NEW: First 2-3 address parts like "C212, Phase 8B, Industrial Area"
}

interface UseLocationDetails {
  locationDetails: LocationDetails | null;
  error: string | null;
  loading: boolean;
  getLocation: () => void;
}

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY;

if (!apiKey) {
  throw new Error(
    "NEXT_PUBLIC_GOOGLE_MAP_KEY is not defined in the environment"
  );
}
export const useLocationDetails = (): UseLocationDetails => {
  const [locationDetails, setLocationDetails] =
    useState<LocationDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
        )
          .then((response) => {
            if (!response.ok)
              throw new Error("Failed to fetch location details");
            return response.json();
          })
          .then((data) => {
            const result = data.results?.[0];
            if (!result) {
              setError("No location details found");
              return;
            }

            const components = result.address_components;

            const getComponent = (types: string[]) =>
              components.find((c: any) =>
                types.every((t) => c.types.includes(t))
              )?.long_name;

            const fullAddress = result.formatted_address ?? "";
            const addressLine = fullAddress
              .split(",")
              .slice(0, 3)
              .join(",")
              .trim(); // first 3 parts

            setLocationDetails({
              city:
                getComponent(["locality"]) ||
                getComponent(["administrative_area_level_2"]),
              postcode: getComponent(["postal_code"]),
              country: getComponent(["country"]),
              state: getComponent(["administrative_area_level_1"]),
              state_code: getComponent(["administrative_area_level_1"]),
              road: getComponent(["route"]),
              state_district:
                getComponent(["sublocality"]) || getComponent(["neighborhood"]),
              full_address: fullAddress,
              address_line: addressLine,
              continent: "", // Not provided by Google API
            });
          })
          .catch((fetchError) => {
            setError(fetchError.message || "Error fetching location");
          })
          .finally(() => {
            setLoading(false);
          });
      },
      (geoError) => {
        setError(geoError.message || "Geolocation error");
        setLoading(false);
      }
    );
  };

  return { locationDetails, error, loading, getLocation };
};
