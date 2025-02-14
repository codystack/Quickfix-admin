import React, { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import axiosInstance from "src/service/axios";
import Select from "react-select";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FormData {
  region: string;
  city: string;
}

interface ErrorState {
  region?: string;
  city?: string;
}

interface AddLocationProps {
  handleClose: () => void;
}

const AddLocation: React.FC<AddLocationProps> = ({ handleClose }) => {
  const [formData, setFormData] = useState<FormData>({ region: "", city: "" });
  const [states, setStates] = useState<{ label: string; value: string }[]>([]);
  const [cities, setCities] = useState<{ label: string; value: string }[]>([]);
  const [error, setError] = useState<ErrorState>({});
  const [loadingCities, setLoadingCities] = useState(false);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.post("https://countriesnow.space/api/v0.1/countries/states", {
          country: "Nigeria",
        });
        const stateOptions = response.data.data.states.map((state: { name: string }) => ({
          label: state.name,
          value: state.name,
        }));
        setStates(stateOptions);
      } catch (error) {
        toast.error("Failed to fetch states");
      }
    };

    fetchStates();
  }, []);

  const handleStateChange = (selectedOption: { value: string } | null) => {
    if (selectedOption) {
      setFormData((prev) => ({ ...prev, region: selectedOption.value, city: "" }));
      fetchCities(selectedOption.value);
    }
  };

  const fetchCities = async (state: string) => {
    setLoadingCities(true);
    try {
      const response = await axios.post("https://countriesnow.space/api/v0.1/countries/state/cities", {
        country: "Nigeria",
        state,
      });
      const cityOptions = response.data.data.map((city: string) => ({
        label: city,
        value: city,
      }));
      setCities(cityOptions);
    } catch (error) {
      toast.error("Failed to fetch cities");
    } finally {
      setLoadingCities(false);
    }
  };

  const handleCityChange = (selectedOption: { value: string } | null) => {
    if (selectedOption) {
      setFormData((prev) => ({ ...prev, city: selectedOption.value }));
    }
  };

  const handleAddLocation = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError({});

    const errors: ErrorState = {};
    if (!formData.region) errors.region = "Region is required";
    if (!formData.city) errors.city = "City is required";

    if (Object.keys(errors).length > 0) {
      setError(errors);
      Object.values(errors).forEach((err) => toast.error(err as string));
      return;
    }

    try {
      await axiosInstance.post("/locations/save", formData);
      toast.success("Location added successfully!");
      handleClose();
      window.location.reload();
    } catch (error) {
      toast.error("An error occurred while adding the location.");
    }
  };

  const customSelectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      border: "none",
      borderBottom: state.isFocused ? "2px solid var(--primary-color-1)" : "1px solid #ccc",
      borderRadius: 0,
      boxShadow: "none",
      "&:hover": {
        borderBottom: "2px solid var(--primary-color-1)",
      },
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (base: any) => ({
      ...base,
      color: "var(--primary-color-1)",
    }),
    menu: (base: any) => ({
      ...base,
      borderRadius: "0px",
    }),
  };

  return (
    <div>
      <h2 className="font-bold text-[var(--primary-color-1)] text-2xl capitalize my-2">
        Add Location
      </h2>
      <form className="w-full flex flex-col items-center" onSubmit={handleAddLocation}>
        {/* State Dropdown */}
        <div className="w-full my-3">
          <Select
            options={states}
            onChange={handleStateChange}
            placeholder="Select State"
            className="w-full"
            styles={customSelectStyles}
          />
          {error.region && <p className="text-red-500 text-sm">{error.region}</p>}
        </div>

        {/* City Dropdown */}
        <div className="w-full my-3">
          <Select
            options={cities}
            onChange={handleCityChange}
            placeholder={loadingCities ? "Loading Cities..." : "Select City"}
            className="w-full"
            isDisabled={!formData.region}
            styles={customSelectStyles}
          />
          {error.city && <p className="text-red-500 text-sm">{error.city}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[var(--primary-color-2)] text-white hover:bg-transparent hover:text-[var(--primary-color-1)] font-bold rounded-lg capitalize p-3 text-center cursor-pointer mt-3 hover:border-2 hover:border-[var(--primary-color-2)]"
        >
          Add Location
        </button>
      </form>
    </div>
  );
};

export default AddLocation;
