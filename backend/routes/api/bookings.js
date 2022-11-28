const express = require('express');
const { where } = require('sequelize');
const { Spot, Review, SpotImage, Booking, User, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const Sequelize = require('sequelize')


const router = express.Router();


//get all of the current users bookings
router.get('/current', requireAuth, async (req, res) => {
    const {user} = req;

    const userBookings = await Booking.findAll({
        where: {
            userId: user.id
        },
        include: [
            {
                model: Spot,
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                },
                include: [
                    {model: SpotImage}
                ]
            },


        ]
    })

    let bookingList = [];
    userBookings.forEach(booking => {
        bookingList.push(booking.toJSON())
    });

    // console.log(bookingList);


    bookingList.forEach(booking => {
        // console.log(booking.Spot);
        let bookingSpot = booking.Spot;

            bookingSpot.SpotImages.forEach(image => {
                if (image.preview === true) {
                    bookingSpot.previewImage = image.url;
                }
            })
            if (!bookingSpot.previewImage) {
                bookingSpot.previewImage = 'no preview image found'
            }
            delete bookingSpot.SpotImages;
            // console.log(booking);

    })
    // console.log(bookingList);



    const bookingObj = {};
    bookingObj.Bookings = bookingList;

    res.json(bookingObj);
})


module.exports = router;
