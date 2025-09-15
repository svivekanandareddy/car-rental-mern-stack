import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const CarCard = ({ car }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        navigate(`/car-details/${car._id}`);
        scrollTo(0, 0);
      }}
      className="group bg-white rounded-xl overflow-hidden shadow-md hover:-translate-y-1 transition-all duration-500 cursor-pointer flex flex-col"
    >
      {/* Image section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={car.image}
          alt="Car"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {car.isAvaliable && (
          <p className="absolute top-4 left-4 bg-primary/90 text-white text-xs px-2.5 py-1 rounded-full">
            Available Now
          </p>
        )}

        <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg">
          <span className="font-semibold">
            {currency}
            {car.pricePerDay}
          </span>
          <span className="text-sm text-white/80"> / day</span>
        </div>
      </div>

      {/* Details section */}
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-1">
            {car.brand} {car.model}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            {car.category} • {car.year}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <img src={assets.users_icon} alt="" className="h-4 w-4 mr-1" />
            {car.seating_capacity} Seats
          </div>
          <div className="flex items-center">
            <img src={assets.fuel_icon} alt="" className="h-4 w-4 mr-1" />
            {car.fuel_type}
          </div>
          <div className="flex items-center">
            <img src={assets.car_icon} alt="" className="h-4 w-4 mr-1" />
            {car.transmission}
          </div>
          <div className="flex items-center">
            <img src={assets.location_icon} alt="" className="h-4 w-4 mr-1" />
            {car.location}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
