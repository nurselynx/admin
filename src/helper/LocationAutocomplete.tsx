"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { FieldErrors, UseFormRegister } from "react-hook-form";

type Suggestion = {
  formatted: string;
  lat: number;
  lon: number;
  city?: string;
  state?: string;
  zip?: string;
  street?: string;
  houseNumber?: string;
};

interface Props {
  placeholder?: string;
  onSelect: (selected: Suggestion) => void;
  className?: string;
  label?: string;
  setInputValue?: any;
  inputValue?: any;
  register?: UseFormRegister<any>;
  validationKey?: any;
  errors?: FieldErrors;
  onChange?: () => void;
  disable?: boolean;
}

const libraries = ["places"] as any;

const AddressAutocomplete: React.FC<Props> = ({
  placeholder = "Enter your address",
  onSelect,
  className = "",
  label,
  setInputValue,
  inputValue,
  register,
  validationKey,
  errors,
  onChange,
  disable = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isAddressSelected, setIsAddressSelected] = useState(false);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY;

  if (!apiKey) {
    throw new Error(
      "NEXT_PUBLIC_GOOGLE_MAP_KEY is not defined in the environment"
    );
  }

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isLoaded || inputValue.length < 3 || isAddressSelected) return;

    const autocompleteService =
      new window.google.maps.places.AutocompleteService();

    autocompleteService.getPlacePredictions(
      {
        input: inputValue,
        componentRestrictions: { country: "us" },
        // types: ["address"],
      },
      (predictions, status) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          predictions
        ) {
          setSuggestions(predictions);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      }
    );
  }, [inputValue, isLoaded, isAddressSelected]);

  const handleSelect = (placeId: string, description: string) => {
    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ placeId }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const result = results[0];
        const location = result.geometry.location;
        const components = result.address_components;

        const getComponent = (type: string) => {
          const comp = components.find((c) => c.types.includes(type));
          return comp ? comp.long_name : "";
        };

        const city =
          getComponent("locality") ||
          getComponent("sublocality") ||
          getComponent("administrative_area_level_2");

        const state = getComponent("administrative_area_level_1");
        const zip = getComponent("postal_code");
        const street = getComponent("route");
        const houseNumber = getComponent("street_number");

        onSelect({
          formatted: description,
          lat: location.lat(),
          lon: location.lng(),
          city,
          state,
          zip,
          street,
          houseNumber,
        });

        setInputValue(description);
        setIsAddressSelected(true);
        setShowSuggestions(false);
        onChange?.();
      }
    });
  };

  if (!isLoaded) return null;

  return (
    <div className={`relative  ${className}`} ref={wrapperRef}>
      {label && (
        <label className="block text-base font-medium text-lynx-blue-300 mb-1">
          {label}
        </label>
      )}

      <input
        type="text"
        ref={inputRef}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setIsAddressSelected(false); // Reset when typing
        }}
        placeholder={placeholder}
        className={`placeholder-lynx-grey-900 w-full border h-[46px] border-lynx-grey-1000 rounded-lg px-3 py-2 focus:outline-none ${
          errors?.[validationKey] ? "border-red-600" : "border-lynx-grey-1000"
        }`}
        disabled={disable}
      />

      {register && validationKey && (
        <input
          type="hidden"
          {...register(validationKey, {
            required: "Address is required",
          })}
          value={inputValue}
          onChange={onChange}
          disabled={disable}
        />
      )}

      {errors?.[validationKey] && (
        <p className="text-red-600 text-sm mt-1">
          {errors[validationKey]?.message as string}
        </p>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto text-sm">
          {suggestions.map((s) => (
            <li
              key={s.place_id}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelect(s.place_id, s.description)}
            >
              {s.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressAutocomplete;
