import React, { useEffect, useState, useCallback } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CarCard from "../components/CarCard";
import { useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const Cars = () => {
  const [input, setInput] = useState("");
  const [filteredCars, setFilteredCars] = useState([]);
  const [searchParams] = useSearchParams();

  const pickupLocation = searchParams.get("pickupLocation");
  const pickupDate = searchParams.get("pickupDate");
  const returnDate = searchParams.get("returnDate");
  const isSearchData = pickupLocation && pickupDate && returnDate;

  const { cars, axios } = useAppContext();

  const applyFilter = useCallback(() => {
    const trimmedInput = input.trim().toLowerCase();
    if (!trimmedInput) {
      setFilteredCars(cars);
      return;
    }

    const filtered = cars.filter((car) =>
      [car.brand, car.model, car.category, car.transmission]
        .some((field) => field.toLowerCase().includes(trimmedInput))
    );

    setFilteredCars(filtered);
  }, [input, cars]);

  const searchCarAvailability = useCallback(async () => {
    try {
      const { data } = await axios.post("/api/bookings/check-availability", {
        location: pickupLocation,
        pickupDate,
        returnDate,
      });

      if (data.success) {
        setFilteredCars(data.availableCars);
        if (data.availableCars.length === 0) {
          toast("No cars available", { icon: "🚫" });
        }
      } else {
        toast.error(data.message || "Failed to fetch available cars.");
      }
    } catch (err) {
      toast.error("Error fetching car availability.");
    }
  }, [pickupLocation, pickupDate, returnDate, axios]);

  // Initial data handling
  useEffect(() => {
    if (isSearchData) {
      searchCarAvailability();
    } else {
      applyFilter(); // initial filter for all cars
    }
  }, [isSearchData, cars, applyFilter, searchCarAvailability]);

  // Refetch when input changes
  useEffect(() => {
    if (!isSearchData) {
      applyFilter();
    }
  }, [input, isSearchData, applyFilter]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Header & Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex flex-col items-center py-20 bg-light max-md:px-4"
      >
        <Title
          title="Available Cars"
          subTitle="Browse our selection of premium vehicles available for your next adventure"
        />
        <div className="flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow">
          <img src={assets.search_icon} alt="search" className="w-4.5 h-4.5 mr-2" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search by make, model, or features"
            className="w-full h-full outline-none text-gray-500"
          />
          <img src={assets.filter_icon} alt="filter" className="w-4.5 h-4.5 ml-2" />
        </div>
      </motion.div>

      {/* Car Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10"
      >
        <p className="text-gray-500 xl:px-20 max-w-7xl mx-auto">
          Showing {filteredCars.length} {filteredCars.length === 1 ? "Car" : "Cars"}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-6 w-full max-w-7xl mx-auto">
          {filteredCars.map((car, index) => (
            <CarCard key={index} car={car} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Cars;
