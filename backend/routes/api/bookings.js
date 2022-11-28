const express = require('express');
const { where } = require('sequelize');
const { Spot, Review, SpotImage, Booking, User, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const Sequelize = require('sequelize');
const { Op } = require("sequelize");


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


//edit a booking
router.put('/:bookingId', requireAuth, async (req, res) => {
    const {user} = req;
    const {startDate, endDate} = req.body;

    const booking = await Booking.findByPk(req.params.bookingId);

    if (!booking) {
        res.status(404);
        res.json({
            message: "Booking couldn't be found",
            statusCode: 404,

        });

        let err = new Error("Couldn't find a Booking with the specified id");
        err.statusCode = 404;
        err.message = "Couldn't find a Booking with the specified id";

        return (console.log(err));
    }


    const bookings = await Booking.findAll({
        where: {
            spotId: booking.spotId,
            id:
            {[Op.ne]: booking.id}
        },

    });
    // console.log(bookings);

    let conflictAggregator = 0;

    const bookingConflict = bookings.forEach(booking => {
        let existingStartDate = new Date(booking.startDate).getTime();
        let existingEndDate = new Date(booking.endDate).getTime();

        let newStartDate = new Date(startDate).getTime();
        let newEndDate = new Date(endDate).getTime();


        if (newStartDate >= existingStartDate && newStartDate <= existingEndDate) {
            conflictAggregator +=1;
        }

        if (newEndDate >= existingStartDate && newEndDate <= existingEndDate) {
            conflictAggregator +=1;
        }

    });




    if (booking.userId != user.id) {
        res.status(403);
        res.json({
            message: "Forbidden",
            statusCode: 403,
            errors: {
                userId: "booking must belong to the current user"
            }
        })

        let err = new Error("Authorization error");
        err.statusCode = 403;
        err.message = "Authorization error";

        return (console.log(err));
    }



    if (new Date(startDate).getTime() >= new Date(endDate).getTime()) {

        res.status(400);
        res.json({
            message: "Validation error",
            statusCode: 400,
            errors: {
                endDate: "endDate cannot be on or before startDate"
            }
        })

        let err = new Error('Body validation errors');
        err.statusCode = 400;
        err.message = "Body validation errors";

        return (console.log(err));

    }


    if (conflictAggregator > 0) {
        res.status(403);
        res.json({
            message: "Sorry, this spot is already booked for the specified dates",
            statusCode: 403,
            errors: {
                startDate: "Start date conflicts with an existing booking",
                endDate: "End date conflicts with an existing booking"
            }
        })

        let err = new Error('Booking conflict');
        err.statusCode = 403;
        err.message = "Booking conflict";

        return (console.log(err));
    }


    if (new Date(endDate).getTime() < Date.now()) {
        res.status(403);
        res.json({
            message: "Past bookings can't be modified",
            statusCode: 403,

        })

        let err = new Error("Can't edit a booking that's past the end date");
        err.statusCode = 403;
        err.message = "Can't edit a booking that's past the end date";

        return (console.log(err));
    }


    await Booking.update(
        {
        startDate: startDate,
        endDate: endDate,
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    {
        where: {
            id: req.params.bookingId
        }
    }
    )

    const updatedBooking = await Booking.findByPk(req.params.bookingId);
    res.json(updatedBooking);

})


module.exports = router;
