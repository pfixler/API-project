const express = require('express');
const { Spot, Review, SpotImage, Booking } = require('../../db/models');

const router = express.Router();


//create a booking from a spot based on the spots id
router.post('/:spotId/bookings', async (req, res, next) => {
    const {user} = req;
    const bookingSpot = await Spot.findByPk(req.params.spotId);

    const {startDate, endDate} = req.body;

    const bookings = await Booking.findAll({
        where: {spotId: req.params.spotId}
    });
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


    if (!bookingSpot) {
        res.status(404);
        res.json({
            message: "Spot couldn't be found",
            statusCode: 404,

        })

        let err = new Error("Couldn't find a Spot with the specified id");
        err.statusCode = 404;
        err.message = "Couldn't find a Spot with the specified id";

        return (console.log(err));
    }

    else if (user.id == bookingSpot.ownerId) {
        res.status(403);
        res.json({
            message: "Authorization error",
            statusCode: 403,
            errors: {
                userId: "user can not book a spot they own"
            }
        })

        let err = new Error("Authorization error");
        err.statusCode = 403;
        err.message = "Authorization error";

        return (console.log(err));

    }


    else if (new Date(startDate).getTime() >= new Date(endDate).getTime()) {

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



    else if (conflictAggregator > 0) {
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


    else {
        const newBooking = await Booking.create({
            spotId: req.params.spotId, userId: user.id, ...req.body
        })

        res.json(newBooking);
    }
});


//get all spots of current user
router.get('/current', async (req, res) => {

    // console.log(req);
    const {user} = req;
    // console.log(user);

    const userSpots = await Spot.findAll({
        where: {ownerId: user.id},
        include: [
            {
                model: Review
            },
            {
                model: SpotImage
            }
        ]
    })
    let spotsList = [];
    userSpots.forEach(spot => {
        spotsList.push(spot.toJSON());
    });

    spotsList.forEach(spot => {
        spot.SpotImages.forEach(image => {
            if (image.preview === true) {
                spot.previewImage = image.url;
            }
        })
        if (!spot.previewImage) {
            spot.previewImage = 'no preview image found'
        }
        delete spot.SpotImages;
    })

    spotsList.forEach(spot => {
        totalStars = 0;
        totalReviews = 0;
        spot.Reviews.forEach(review => {
            totalStars +=review.stars;
            totalReviews++;
        })
        let avg = totalStars/totalReviews;
        spot.avgRating = avg;
        if (!avg) {
            spot.avgRating = 'no ratings for this spot';

        }
        delete spot.Reviews;
    })
    res.json(spotsList);
})


// get all the spots with avg rating and preview img
router.get('/', async (req, res) => {
    const spots = await Spot.findAll({
        include: [
            {
                model: Review
            },
            {
                model: SpotImage
            }
        ]

    })

    let spotsList = [];
    spots.forEach(spot => {
        spotsList.push(spot.toJSON());
    });

    spotsList.forEach(spot => {
        spot.SpotImages.forEach(image => {
            if (image.preview === true) {
                spot.previewImage = image.url;
            }
        })
        if (!spot.previewImage) {
            spot.previewImage = 'no preview image found'
        }
        delete spot.SpotImages;
    })

    spotsList.forEach(spot => {
        totalStars = 0;
        totalReviews = 0;
        spot.Reviews.forEach(review => {
            totalStars +=review.stars;
            totalReviews++;
        })
        let avg = totalStars/totalReviews;
        spot.avgRating = avg;
        if (!avg) {
            spot.avgRating = 'no ratings for this spot';

        }
        delete spot.Reviews;
    })
    // console.log(spots);

    res.json(spotsList);
});



module.exports = router;
