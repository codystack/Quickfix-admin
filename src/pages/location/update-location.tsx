import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axiosInstance from "src/service/axios";
import { toast } from "react-toastify";
import { states } from "./dummy";
import "react-toastify/dist/ReactToastify.css";
import { MenuItem, TextField, SelectChangeEvent } from "@mui/material";

interface FormData {
  region: string;
  city: string;
}

interface ErrorState {
  region?: string;
  city?: string;
}

interface UpdateLocationProps {
  handleClose: () => void;
  location: { id: string; region?: string; city?: string };
  onUpdate: (updatedLocation: { id: string; region: string; city: string }) => void;
}

const UpdateLocation: React.FC<UpdateLocationProps> = ({ handleClose, location, onUpdate }) => {
  const [formData, setFormData] = useState<FormData>({
    region: location?.region || "",
    city: location?.city || "",
  });
  const [error, setError] = useState<ErrorState>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location) {
      setFormData({
        region: location.region || "",
        city: location.city || "",
      });
    }
  }, [location]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [name]: "" }));
  };

  const handleUpdateLocation = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError({});
    setLoading(true);

    const errors: ErrorState = {};
    if (!formData.region) errors.region = "Region is required";
    if (!formData.city) errors.city = "City is required";

    if (Object.keys(errors).length > 0) {
      setError(errors);
      Object.values(errors).forEach((err) => toast.error(err as string));
      setLoading(false);
      return;
    }

    if (!location?.id) {
      toast.error("Location ID is missing.");
      setLoading(false);
      return;
    }

    try {
      await axiosInstance.post(`/locations/${location.id}/update`, formData);
      toast.success("Location updated successfully!");
      if (onUpdate) onUpdate({ id: location.id, ...formData });
      handleClose();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "An error occurred while updating the location."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="font-bold text-[var(--primary-color-1)] text-2xl capitalize my-2">
        Update Location
      </h2>
      <form
        className="w-full lg:p-5 sm:p-2 flex flex-col items-center justify-center lg:px-5 sm:px-2"
        onSubmit={handleUpdateLocation}
      >
        <div className="w-full lg:my-3 sm:my-1">
          <TextField
            fullWidth
            select
            label="Region"
            name="region"
            value={formData.region || ""}
            onChange={handleChange}
            error={!!error.region}
            helperText={error.region}
            variant="standard"
          >
            {states.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div className="w-full lg:my-3 sm:my-1">
          <TextField
            fullWidth
            label="City"
            name="city"
            placeholder="Enter your city"
            value={formData.city || ""}
            onChange={handleChange}
            error={!!error.city}
            helperText={error.city}
            variant="standard"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[var(--primary-color-2)] text-white hover:bg-transparent hover:text-[var(--primary-color-1)] font-bold rounded-lg capitalize lg:p-5 sm:p-3 text-center cursor-pointer mt-3 hover:border-2 hover:border-[var(--primary-color-2)]"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Location"}
        </button>
      </form>
    </div>
  );
};

export default UpdateLocation;
