import Booking from "../models/booking.model.js";
import Room from "../models/room.model.js";

// Helper: Generate dates between check-in and check-out
const getDatesInRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dates = [];

  let current = new Date(start);
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
};

export const createBooking = async (req, res) => {
  try {
    const { roomId, hotelId, checkIn, checkOut } = req.body;
    const requestedDates = getDatesInRange(checkIn, checkOut);

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });

    let selectedRoomNumber = null;

    for (let rn of room.roomNumbers) {
      const isAvailable = rn.unavailableDates.every(date =>
        !requestedDates.find(d => new Date(d).toDateString() === new Date(date).toDateString())
      );

      if (isAvailable) {
        selectedRoomNumber = rn.number;
        rn.unavailableDates.push(...requestedDates);
        break;
      }
    }

    if (!selectedRoomNumber) {
      return res.status(400).json({ message: "No room available for the selected dates" });
    }

    // Save updated room
    await room.save();

    // Optional: calculate price based on nights * room price
    const totalNights = requestedDates.length;
    const totalPrice = totalNights * room.price;

    const booking = await Booking.create({
      userId: req.user._id,
      hotelId: room.hotelId,
      roomId,
      roomNumber: selectedRoomNumber,
      checkIn,
      checkOut,
      totalPrice,
      status: 'confirmed',
    });

    res.status(201).json({
      success: true,
      message: "Room booked successfully",
      booking,
    });

  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUsersBooking = async (req, res) => {
    try {

        const userId = req.user._id;

        const bookings = await Booking.find({ userId })
        .populate('hotelId', 'name location')
        .populate('roomId', 'title price')
        .sort({ createdAt: -1 });

        bookings = bookings.filter(
          booking => booking.hotelId !== null && booking.roomId !== null
        );
    
        if (!bookings.length) {
        return res.status(404).json({ message: "No bookings found" });
        }
    
        res.status(200).json({
        success: true,
        bookings,
        });
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const cancelBooking = async (req, res) =>{
    try {
        const { bookingId } = req.params;
        const userId = req.user._id;
    
        const booking = await Booking.findById(bookingId);
        if (!booking) {     
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking.userId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You are not authorized to cancel this booking" });
        }
        booking.status = 'cancelled';
        await booking.save();

        await Room.updateOne(
            { _id: booking.roomId, "roomNumbers.number": booking.roomNumber },
            {
                $pull: {
                "roomNumbers.$.unavailableDates": {
                    $gte: booking.checkIn,
                    $lt: booking.checkOut
                }
                }
            }
        );

        res.status(200).json({
            success: true,
            message: "Booking cancelled successfully",
        });
    }
    catch (error) {
        console.error("Error cancelling booking:", error);
        res.status(500).json({ message: "Failed to cancel booking" });
    }
}