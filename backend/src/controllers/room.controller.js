import Room from '../models/room.model.js';
import Hotel from '../models/hotel.model.js';

export const createRoom = async (req, res) => {
    const hotelId = req.params.hotelId;
    const newRoom = req.body;

    try {

    const room = await Room.create({ ...newRoom, hotelId });

    await Hotel.findByIdAndUpdate(hotelId, {
      $push: { rooms: room._id },
    });

    res.status(201).json({
      success: true,
      message: 'Room created and added to hotel',
      room,
    });
  } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateRoom = async (req, res) => {
    const roomId = req.params.id;
    const updatedRoomData = req.body;

    try {
        const updatedRoom = await Room.findByIdAndUpdate(
            roomId,
            { $set: updatedRoomData },
            { new: true, runValidators: true }
        );

        if(!updatedRoom) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.status(200).json({ message: 'Room updated successfully', room: updatedRoom });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteRoom = async (req, res) => {
    const roomId = req.params.id;
    const hotelId = req.params.hotelId;

    try {
        const deletedRoom = await Room.findByIdAndDelete(roomId);

        if (!deletedRoom) {
            return res.status(404).json({ message: 'Room not found' });
        }

        await Hotel.findByIdAndUpdate(hotelId, {
            $pull: { rooms: roomId },
        });

        res.status(200).json({ message: 'Room deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getRoomById = async (req, res) => {
    const roomId = req.params.id;

    try {
        const room = await Room.findById(roomId);

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        res.status(200).json({ room });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.status(200).json({ rooms });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}                                                                   


// export const searchAvailableRooms = async (req, res) => {
//   const { location, checkIn, checkOut, guests } = req.query;

//   if (!location || !checkIn || !checkOut || !guests) {
//     return res.status(400).json({ message: "All search fields are required" });
//   }

//   const guestCount = parseInt(guests, 10);

//   console.log("Search Query:", {location, checkIn, checkOut, guestCount });


//   try {
//     // Step 1: Find all hotels in the location
//     const hotels = await Hotel.find({ location }); // or use regex/i for partial match

//     if (hotels.length === 0) {
//       return res.status(404).json({ message: "No hotels found in this location" });
//     }

//     const hotelIds = hotels.map(h => h._id);

//     // Step 2: Find all rooms in those hotels
//     const rooms = await Room.find({
//       hotelId: { $in: hotelIds },
//       maxPeople: { $gte: guests }
//     });

//     const checkInDate = new Date(checkIn);
//     const checkOutDate = new Date(checkOut);

//     // Step 3: Filter rooms where at least one roomNumber is available
//     const availableRooms = rooms.filter(room => {
//       const isAvailable = room.roomNumbers.some(roomNumber => {
//         return roomNumber.unavailableDates.every(date => {
//           const d = new Date(date);
//           return d < checkInDate || d >= checkOutDate;
//         });
//       });
//       return isAvailable;
//     });

//     res.status(200).json(availableRooms);
//   } catch (error) {
//     console.error("Error searching rooms:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// export const searchAvailableRooms = async (req, res) => {
//   const { location, checkIn, checkOut, guests } = req.query;

//   if (!location || !checkIn || !checkOut || !guests) {
//     return res.status(400).json({ message: "All search fields are required" });
//   }

//   const guestCount = parseInt(guests, 10);

//   console.log("Search Query:", { location, checkIn, checkOut, guestCount });

//   try {
//     // Step 1: Find all hotels in the location
//     const hotels = await Hotel.find({ location }); // Consider using regex for case-insensitive match

//     if (hotels.length === 0) {
//       return res.status(404).json({ message: "No hotels found in this location" });
//     }

//     const hotelIds = hotels.map(h => h._id);

//     // Step 2: Find all rooms in those hotels
//     const rooms = await Room.find({
//       hotelId: { $in: hotelIds },
//       maxPeople: { $gte: guestCount }
//     });

//     const checkInDate = new Date(checkIn);
//     const checkOutDate = new Date(checkOut);

//     // Step 3: Filter rooms where at least one roomNumber is available
//     const availableRooms = rooms.filter(room => {
//       const isAvailable = room.roomNumbers.some(roomNumber => {
//         return roomNumber.unavailableDates.every(date => {
//           const d = new Date(date);
//           return d < checkInDate || d >= checkOutDate;
//         });
//       });
//       return isAvailable;
//     });

//     res.status(200).json({ rooms: availableRooms });
//   } catch (error) {
//     console.error("Error searching rooms:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };


export const searchAvailableRooms = async (req, res) => {
  const { location, checkIn, checkOut, guests } = req.body;

  if (!location || !checkIn || !checkOut || !guests) {
    return res.status(400).json({ message: "All search fields are required" });
  }

  const guestCount = parseInt(guests, 10);
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  // Step 1: Generate planned trip dates array
  const plannedDates = [];
  for (
    let d = new Date(checkInDate);
    d < checkOutDate;
    d.setDate(d.getDate() + 1)
  ) {
    plannedDates.push(new Date(d)); // clones the date instance
  }

  try {
    // Step 2: Find all hotels in location (case-insensitive match)
    const hotels = await Hotel.find({
      location: { $regex: new RegExp(location, "i") },
    }).populate("rooms");

    const availableRooms = [];

    for (const hotel of hotels) {
      for (const room of hotel.rooms) {
        // Check if room can accommodate the guests
        if (room.maxPeople < guestCount) continue;

        let isAvailable = false;

        // Check each room number
        for (const roomNumber of room.roomNumbers) {
          const unavailable = roomNumber.unavailableDates.map(
            (d) => new Date(d).toDateString()
          );

          const overlap = plannedDates.some((d) =>
            unavailable.includes(d.toDateString())
          );

          if (!overlap) {
            isAvailable = true;
            break; // one available room number is enough
          }
        }

        if (isAvailable) {
          availableRooms.push({
            ...room._doc,
            hotelName: hotel.name,
            hotelLocation: hotel.location,
            hotelId: hotel._id,
          });
        }
      }
    }

    res.status(200).json({ rooms: availableRooms });
  } catch (error) {
    console.error("Error searching rooms:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getRoomsByHotelId = async (req, res) => {
    const hotelId = req.params.hotelId;

    try {
        const rooms = await Room.find({ hotelId });

        if (!rooms.length) {
            return res.status(404).json({ message: 'No rooms found for this hotel' });
        }

        res.status(200).json({ rooms });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
} 


