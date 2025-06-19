import Hotel from "../models/hotel.model.js";


export const createHotel = async(req, res)=>{
    try {
        const { name, description, destination, location, photos, title, rating, rooms, cheapestPrice } = req.body;

        if (!name || !description || !destination || !location || !title || !cheapestPrice) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newHotel = new Hotel({
            name,
            description,
            destination,
            location,
            photos: photos || [],
            title,
            rating: rating || 0,
            rooms,
            cheapestPrice
        });

        const savedHotel = await newHotel.save();
        res.status(201).json({ message: 'Hotel created successfully', hotel: savedHotel });

        } catch (error) {
                res.status(500).json({
                success: false,
                message: 'Failed to create hotel',
                error: error.message,
            });
        }
    }

    export const updateHotel = async(req, res)=>{
        try {
            const { id } = req.params;
            const { name, description, destination, location, photos, title, rating, rooms, cheapestPrice } = req.body;

            if (!name || !description || !destination || !location || !title || !cheapestPrice) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            const updatedHotel = await Hotel.findByIdAndUpdate(id, {
                name,
                description,
                destination,
                location,
                photos: photos || [],
                title,
                rating: rating || 0,
                rooms,
                cheapestPrice
            }, { new: true });

            if (!updatedHotel) {
                return res.status(404).json({ message: 'Hotel not found' });
            }

            res.status(200).json({ message: 'Hotel updated successfully', hotel: updatedHotel });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to update hotel',
                error: error.message,
            });
            
        }
    }

    export const deleteHotel = async(req, res)=>{
        try {
            const { id } = req.params;

            const deletedHotel = await Hotel.findByIdAndDelete(id);

            if (!deletedHotel) {
                return res.status(404).json({ message: 'Hotel not found' });
            }

            res.status(200).json({ message: 'Hotel deleted successfully', hotel: deletedHotel });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to delete hotel',
                error: error.message,
            });
        }
    }

    export const getAllHotels = async(req, res)=>{
        try {
            const hotels = await Hotel.find().populate('rooms');

            if (!hotels || hotels.length === 0) {
                return res.status(404).json({ message: 'No hotels found' });
            }

            res.status(200).json({ success: true, hotels });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch hotels',
                error: error.message,
            });
        }
    }

    export const getHotelByID = async (req,res) =>{
    try {
        const { id } = req.params;

        const hotel = await Hotel.findById(id).populate('rooms');

        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        res.status(200).json({ success: true, hotel });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch hotel',
            error: error.message,
        });
    }
}

export const getHotelByDestination = async (req, res) =>{
    try {
        const { name } = req.params;

        const hotels = await Hotel.find({ destination: `${name}` });

        if (!hotels || hotels.length === 0) {
            return res.status(404).json({ message: 'No hotels found for this destination' });
        }

        res.status(200).json({ success: true, hotels });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch hotels by destination',
            error: error.message,
        });
    }
}
// fetching hotels by destination or implemente the feature of filtering hotels.
