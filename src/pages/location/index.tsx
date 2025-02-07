import { useState, useEffect } from "react";
import { DashboardContent } from "src/layouts/dashboard";
import CheckTable from "src/components/table";
import axiosInstance from "src/service/axios";
import Modal from "src/components/modal";
import AddLocation from "./add-location";
import { HiOutlinePlusSmall } from "react-icons/hi2";
import { toast } from "react-toastify";
import UpdateLocation from "./update-location";

const Location = () => {
  const [data, setData] = useState<any[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [locationToUpdate, setLocationToUpdate] = useState<any>(null);
  const [locations, setLocations] = useState<any[]>([]);

  // Fetch location table data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/locations/list");
        setData(response.data);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "An error occurred while fetching locations.";
        toast.error(errorMessage);
      }
    };

    fetchData();
  }, []);

  // Open and close add location modal
  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  // Function to delete a location by ID
  const handleDeleteLocation = async (id: string) => {
    try {
      await axiosInstance.put(`/locations/${id}/delete`);
      toast.success("Location deleted successfully!");
      // window.location.reload();
      // Update the data state to remove the deleted location
      setData((prevData) => prevData.filter((item) => item.id !== id));
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "An error occurred while deleting the location.";
      toast.error(errorMessage);
    }
  };

  // Confirmation before deleting
  const confirmDelete = (id: string) => {
    toast(
      ({ closeToast }) => (
        <div className="text-center">
          <p>Are you sure you want to delete this location?</p>
          <div className="flex justify-center space-x-4 mt-3">
            <button
              onClick={() => {
                handleDeleteLocation(id);
                closeToast();
              }}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Yes
            </button>
            <button
              onClick={closeToast}
              className="bg-gray-300 text-black px-3 py-1 rounded hover:bg-gray-400"
            >
              No
            </button>
          </div>
        </div>
      ),
      { autoClose: false } // Keep the toast open until a button is clicked
    );
  };

  // Function to handle opening update location modal and passing the location
  const handleOpenUpdate = (location: any) => {
    setLocationToUpdate(location); // Set the location to update
    setOpen(true); // Open the update modal
  };

  // Table column structure
  const columns = [
    { key: "createdAt", label: "Created Date" },
    { key: "region", label: "Region" },
    { key: "city", label: "City" },
  ];

  // Actions for editing and deleting locations
  const actions = [
    {
      label: "Edit",
      className: "text-[var(--primary-color-1)] cursor-pointer",
      onClick: (item: any) => {
        setLocationToUpdate(item.id); // Set the location to update when Edit is clicked
        handleOpenUpdate(item); // Open the update modal
      },
    },
    {
      label: "Delete",
      className: "text-red-500 cursor-pointer",
      onClick: (item: any) => {
        confirmDelete(item.id); // Pass the `id` to confirm deletion
      },
    },
  ];


  const handleUpdate = (updatedLocation: { id: string; region: string; city: string }) => {
    // Update the location in the state with the new data
    setData((prevData) =>
      prevData.map((loc) =>
        loc.id === updatedLocation.id
          ? { ...loc, region: updatedLocation.region, city: updatedLocation.city }
          : loc
      )
    );
  };

  return (
    <DashboardContent>
      <div className="w-full lg:p-10">
        <div className="w-full flex items-center justify-between">
          <h3 className="text-2xl font-bold capitalize">Location Management</h3>
          <button
            className="bg-[var(--primary-color-2)] text-white capitalize font-semibold lg:text-md sm:text-sm cursor-pointer hover:bg-transparent hover:text-[var(--primary-color-1)] lg:p-5 sm:p-2 rounded-lg hover:border-2 hover:border-[var(--primary-color-1)] flex items-center gap-3"
            onClick={handleOpen}
          >
            <span>
              <HiOutlinePlusSmall size={20} />
            </span>
            <span>Add Location</span>
          </button>
        </div>

        <div className="w-full lg:mt-20 sm:mt-10">
          <CheckTable columns={columns} data={data} itemsPerPage={itemsPerPage} actions={actions} />
        </div>

        {/* Modal for adding location */}
        {open && !locationToUpdate && (
          <Modal visible={open} onClose={handleOpen}>
            <AddLocation handleClose={handleOpen} />
          </Modal>
        )}

        {/* Modal for updating location */}
        {locationToUpdate && (
          <Modal visible={open} onClose={() => setOpen(false)}>
            <UpdateLocation
              handleClose={() => setOpen(false)}
              location={locationToUpdate}
              onUpdate={handleUpdate}
            />
          </Modal>
        )}
      </div>
    </DashboardContent>
  );
};

export default Location;
