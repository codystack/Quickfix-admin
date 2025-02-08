/* eslint-disable */

import React, { useState, ChangeEvent, FormEvent } from "react";
import axiosInstance from "src/service/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { states } from "./dummy";
import {
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
  TextField,
  SelectChangeEvent,
} from "@mui/material";

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
  const [formData, setFormData] = useState<FormData>({
    region: "",
    city: "",
  });

  const [error, setError] = useState<ErrorState>({});

  // Handle form input change
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    if (name) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
      setError((prevError) => ({
        ...prevError,
        [name]: "",
      }));
    }
  };

  // Add location function
  const handleAddLocation = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError({});

    // Validate input fields
    const errors: ErrorState = {};
    if (!formData.region) {
      errors.region = "Region is required";
    }
    if (!formData.city) {
      errors.city = "City is required";
    }
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
      toast.error(
        "An error occurred while adding the location. Please try again."
      );
    }
  };

  return (
    <div>
      <h2 className="font-bold text-[var(--primary-color-1)] text-2xl capitalize my-2">
        Add Location
      </h2>
      <form
        className="w-full lg:p-5 sm:p-2 flex flex-col items-center justify-center lg:px-5 sm:px-2"
        onSubmit={handleAddLocation}
      >
        <div className="w-full lg:my-3 sm:my-1">
          <TextField
            fullWidth
            select
            label="Region"
            name="region"
            value={formData.region}
            onChange={handleChange}
            error={!!error.region}
            helperText={error.region}
            variant="standard"
            InputProps={{
              className:
                "border-b-2 border-gray-200 focus:border-[var(--primary-color-2)]",
            }}
          >
            {states.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>
        </div>

        {/* City Input */}
        <div className="w-full lg:my-3 sm:my-1">
          <TextField
            fullWidth
            label="City"
            name="city"
            placeholder="Enter your city"
            value={formData.city}
            onChange={handleChange}
            error={!!error.city}
            helperText={error.city}
            variant="standard"
            InputProps={{
              className:
                "border-b-2 border-gray-200 focus:border-[var(--primary-color-2)]",
            }}
          />
        </div>

        {/* Add Location Button */}
        <button
          type="submit"
          className="w-full bg-[var(--primary-color-2)] text-white hover:bg-transparent hover:text-[var(--primary-color-1)] font-bold rounded-lg capitalize lg:p-5 sm:p-3 text-center cursor-pointer mt-3 hover:border-2 hover:border-[var(--primary-color-2)]"
        >
          Add Location
        </button>
      </form>
    </div>
  );
};

export default AddLocation;
