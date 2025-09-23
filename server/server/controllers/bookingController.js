import Booking from "../models/Booking.js"
import Car from "../models/Car.js";


// Function to check if a car is available for the given date range
const checkAvailability = async (carId, pickupDate, returnDate) => {
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const conflictingBookings = await Booking.find({
        car: carId,
        status: { $ne: "cancelled" },
        $and: [
            { pickupDate: { $lt: end } },
            { returnDate: { $gt: start } }
        ]
    });

    return conflictingBookings.length === 0;
};


// API to Check Availability of Cars for the given Date and Location
export const checkAvailabilityOfCar = async (req, res) => {
    try {
        const { location, pickupDate, returnDate } = req.body;

        // Fetch all available cars for the given location
        const cars = await Car.find({ location, isAvaliable: true });

        // Check availability of each car in parallel
        const availableCarsPromises = cars.map(async (car) => {
            const isAvailable = await checkAvailability(car._id, pickupDate, returnDate);
            return { ...car._doc, isAvailable };
        });

        let availableCars = await Promise.all(availableCarsPromises);

        // Filter only cars that are available in the date range
        availableCars = availableCars.filter(car => car.isAvailable === true);

        res.json({ success: true, availableCars });
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
};


// API to Create Booking
export const createBooking = async (req, res)=>{
    try {
          const {_id} = req.user;
           const {car, pickupDate, returnDate} = req.body;

           const isAvailable = await checkAvailability(car, pickupDate, returnDate)
           if(!isAvailable){
               return res.json({success: false, message: "Car is not available"})
           }

           const carData = await Car.findById(car)

           // Calculate price based on pickupDate and returnDate
           const picked = new Date(pickupDate);
           const returned = new Date(returnDate);
           const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24))
           const price = carData.pricePerDay * noOfDays;

           await Booking.create({car, owner: carData.owner, user: _id, pickupDate, returnDate, price})

           res.json({success: true, message: "Booking Created"})
 
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}


// API to List User Bookings
export const getUserBookings = async (req, res)=>{
    try {
        const {_id} = req.user;
        const bookings = await Booking.find({ user: _id }).populate("car").sort({createdAt: -1})
        res.json({success: true, bookings})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to get Owner Bookings
export const getOwnerBookings = async (req, res)=>{
    try {
        if(req.user.role !== 'owner'){
            return res.json({ success: false, message: "Unauthorized" })
        }
        const bookings = await Booking.find({owner: req.user._id}).populate('car user').select("-user.password").sort({createdAt: -1 })
        res.json({success: true, bookings})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to change booking status
export const changeBookingStatus = async (req, res)=>{
    try {
          const {_id} = req.user;
       const {bookingId, status} = req.body

       const booking = await Booking.findById(bookingId)

       if(booking.owner.toString() !== _id.toString()){
           return res.json({ success: false, message: "Unauthorized"})
       }

       booking.status = status;
       await booking.save();

       res.json({ success: true, message: "Status Updated"})
           } catch (error) {
           console.log(error.message);
           res.json({success: false, message: error.message})
           }
       }