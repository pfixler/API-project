const express = require('express');
const { where } = require('sequelize');
const { Spot, Review, SpotImage, Booking, User, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const Sequelize = require('sequelize')


const router = express.Router();


//get all bookings for a spot based on spot id
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    const {user} = req;
    const spotId = req.params.id;
    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
        res.status(404);
        res.json({
            message: "Spot couldn't be found",
            statusCode: 404,

        });

        let err = new Error("Couldn't find a Spot with the specified id");
        err.statusCode = 404;
        err.message = "Couldn't find a Spot with the specified id";

        return (console.log(err));
    }

    const notOwnerBookings = await Booking.findAll({
        where: {
            spotId: spot.id
        },
        attributes: {
            exclude: ['id', 'userId', 'createdAt', 'updatedAt']
        }
    })


    const ownerBookings = await Booking.findAll({
        where: {
            spotId: spot.id
        },
            include: [
                {
                    model: User,
                    attributes: {
                        exclude: ['username', 'email',
                        'hashedPassword', 'createdAt', 'updatedAt']
                    }
                },

            ]
    })


    if (user.id != spot.ownerId) {
        let bookingObj = {};
        bookingObj.Bookings = notOwnerBookings
        return res.json(bookingObj);
    }

    if (user.id == spot.ownerId) {
        let bookingObj = {};
        bookingObj.Bookings = ownerBookings;
        return res.json(bookingObj);
    }

})


//create a review for a spot based on the spots id
router.post('/:spotId/reviews', requireAuth, async (req, res) => {
    const {review, stars} = req.body;
    const {user} = req;
    const reviewSpot = await Spot.findByPk(req.params.spotId);
    const reviews = await Review.findAll({
        where: {
            spotId: req.params.spotId
        }
    })

    if (!reviewSpot) {
        res.status(404);
        res.json({
            message: "Spot couldn't be found",
            statusCode: 404,

        });

        let err = new Error("Couldn't find a Spot with the specified id");
        err.statusCode = 404;
        err.message = "Couldn't find a Spot with the specified id";

        return (console.log(err));
    }

    if (!review || stars > 5 || stars < 1) {
        res.status(400);
        res.json({
            message: "Validation error",
            statusCode: 400,
            errors: {
                review: "Review text is required",
                stars: "Stars must be an integer from 1 to 5"
            }
        })

        let err = new Error('Body validation errors');
        err.statusCode = 400;
        err.message = "Body validation errors";

        return (console.log(err));
    }

    let reviewBoolean;
    reviews.forEach(review => {
        if (review.userId == user.id) {
            reviewBoolean = false;
        }
    })

    if (reviewBoolean === false) {
        res.status(403);
        res.json({
            message: "User already has a review for this spot",
            statusCode: 403,

        });

        let err = new Error("Review from the current user already exists for the Spot");
        err.statusCode = 403;
        err.message = "Review from the current user already exists for the Spot";

        return (console.log(err));
    }



    const newReview = await Review.create({
        userId: user.id, spotId: req.params.spotId, ...req.body
    });

    res.json(newReview);

})


//get all the reviews the belong to the spot specified by id
router.get('/:spotId/reviews', async (req, res) => {
    const {user} = req;
    const spotId = req.params.id;
    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
        res.status(404);
        res.json({
            message: "Spot couldn't be found",
            statusCode: 404,

        });

        let err = new Error("Couldn't find a Spot with the specified id");
        err.statusCode = 404;
        err.message = "Couldn't find a Spot with the specified id";

        return (console.log(err));
    }
    const users = await User.findAll();

    const spotReviews = await Review.findAll({
        where: {
            spotId: spot.id
        },
        include: [
            {
                model: ReviewImage,
                attributes:
                {exclude: ['createdAt', 'updatedAt', 'reviewId']}
        }
    ]
    })

    let spotReviewList = [];
    spotReviews.forEach(spot => {
        spotReviewList.push(spot.toJSON());
    });

    spotReviewList.forEach(async review => {
        let userId = review.userId;
        for (let i = 0; i < users.length; i++) {
            if (userId === users[i].id) {
                thisUser = users[i];
                review.User = {
                    id: thisUser.id,
                    firstName: thisUser.firstName,
                    lastName: thisUser.lastName
                };
            }
        }

    })
    // console.log(spotReviewList);


    const reviewsObj = {};
    reviewsObj.Reviews = spotReviewList;
    res.json(reviewsObj);
})



//add an image to a spot based on spots id
router.post('/:spotId/images', requireAuth, async (req, res) => {
    const {user} = req;
    const {url, preview} = req.body;
    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
        res.status(404);
        res.json({
            message: "Spot couldn't be found",
            statusCode: 404,

        });

        let err = new Error("Couldn't find a Spot with the specified id");
        err.statusCode = 404;
        err.message = "Couldn't find a Spot with the specified id";

        return (console.log(err));
    }

    if (spot.ownerId != user.id) {
        res.status(403);
        res.json({
            message: "Forbidden",
            statusCode: 403,
            errors: {
                userId: "spot must belong to the current user"
            }
        })

        let err = new Error("Authorization error");
        err.statusCode = 403;
        err.message = "Authorization error";

        return (console.log(err));
    }


    const newImage = await SpotImage.create({
        spotId: spot.id, url: url, preview: preview
    });

    const returnImage = await SpotImage.findByPk(newImage.id, {
        attributes: {
            exclude: ['spotId', 'createdAt', 'updatedAt']
        }
    })
    res.json(returnImage);
})


//create a booking from a spot based on the spots id
router.post('/:spotId/bookings', requireAuth, async (req, res, next) => {
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
            message: "Forbidden",
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
router.get('/current', requireAuth, async (req, res) => {

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

    const spotsObj = {};
    spotsObj.Spots = spotsList;

    res.json(spotsObj);
})

//get details of a spot based on its id
router.get('/:spotId', async (req, res) => {
    const spotId = req.params.spotId;
    let spotArr = [];

    const getSpot = await Spot.findByPk(spotId,{
        include: [
            {
                model: Review
            },
            {
                model: SpotImage,
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'spotId']
                }
            },

        ]
    });


    if (!getSpot) {
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

    spotArr.push(getSpot.toJSON());

    totalStars = 0;
    totalReviews = 0;
    await spotArr[0].Reviews.forEach(review => {
        totalStars +=review.stars;
        totalReviews++;
    })
    let avg = totalStars/totalReviews;
    spotArr[0].avgStarRating = avg;
    spotArr[0].numReviews = totalReviews;


    if (!avg) {
        spotArr[0].avgStarRating = 'no ratings for this spot';

    }
    delete spotArr[0].Reviews;

    let getSpotForOwner = await Spot.findByPk(spotId);
    const getSpotOwnerId = getSpotForOwner.ownerId;
    const owner = await User.findByPk(getSpotOwnerId);
    spotArr[0].Owner = {
        id: owner.id,
        firstName: owner.firstName,
        lastName: owner.lastName
    };

    res.json(spotArr[0]);
})

//edit a spot
router.put('/:spotId', requireAuth, async (req, res) => {
    const {user} = req;
    const spotId = req.params.spotId;
    const {address, city, state, country,
        lat, lng, name, description, price} = req.body;
    const spot = await Spot.findByPk(spotId);
    // console.log(spot);

    if (!spot) {
        res.status(404);
        res.json({
            message: "Spot couldn't be found",
            statusCode: 404,

        });

        let err = new Error("Couldn't find a Spot with the specified id");
        err.statusCode = 404;
        err.message = "Couldn't find a Spot with the specified id";

        return (console.log(err));
    }

    if (spot.ownerId != user.id) {
        res.status(403);
        res.json({
            message: "Forbidden",
            statusCode: 403,
            errors: {
                userId: "spot must belong to the current user"
            }
        })

        let err = new Error("Authorization error");
        err.statusCode = 403;
        err.message = "Authorization error";

        return (console.log(err));
    }


    let validLat;
    let validLng;

        if (typeof lat === 'number' && lat <= 180 && lat >= -180) {
            validLat = true;
        }
        else {
            validLat = false;
        }

        if (typeof lng === 'number' && lng <= 180 && lng >= -180) {
            validLng = true;
        }
        else {
            validLng = false;
        }

        if (!address || !city || !state || !country ||
            !validLat || !validLng || name.length > 50 ||
            !description || !price) {
            res.status(400);
            res.json({
                message: "Validation Error",
                statusCode: 400,
                errors: {
                    address: "Street address is required",
                    city: "City is required",
                    state: "State is required",
                    country: "Country is required",
                    lat: "Latitude is not valid",
                    lng: "Longitude is not valid",
                    name: "Name must be less than 50 characters",
                    description: "Description is required",
                    price: "Price per day is required"
                  }
            })

            let err = new Error("Body validation error");
            err.statusCode = 400;
            err.message = "Body validation error";

            return (console.log(err));
        }

    await Spot.update(
        {
        address: address,
        city: city,
        state: state,
        country: country,
        lat: lat,
        lng: lng,
        address: address,
        name: name,
        description: description,
        price: price,
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    {
        where: {
            id: spotId
        }
    }

    )

    const updatedSpot = await Spot.findByPk(spotId);
    res.json(updatedSpot);
});


//delete a spot
router.delete('/:spotId', requireAuth, async (req, res) => {
    const {user} = req;
    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
        res.status(404);
        res.json({
            message: "Spot couldn't be found",
            statusCode: 404,

        });

        let err = new Error("Couldn't find a Spot with the specified id");
        err.statusCode = 404;
        err.message = "Couldn't find a Spot with the specified id";

        return (console.log(err));
    }


    if (spot.ownerId != user.id) {
        res.status(403);
        res.json({
            message: "Forbidden",
            statusCode: 403,
            errors: {
                userId: "spot must belong to the current user"
            }
        })

        let err = new Error("Authorization error");
        err.statusCode = 403;
        err.message = "Authorization error";

        return (console.log(err));
    }



    await Spot.destroy({
        where: {
            id: req.params.spotId
        }
    })

    res.json({
        message: "Successfully deleted",
        statusCode: 200
      })
})



//create a spot
router.post('/', requireAuth, async (req, res) => {
    const {user} = req;
    // console.log('hello');
    const {address, city, state, country,
        lat, lng, name, description, price} =  req.body;
        // console.log(req.body);
        // console.log(lat);
        // console.log('hi');


        let validLat;
        let validLng;

        if (typeof lat === 'number' && lat <= 180 && lat >= -180) {
            validLat = true;
        }
        else {
            validLat = false;
        }

        if (typeof lng === 'number' && lng <= 180 && lng >= -180) {
            validLng = true;
        }
        else {
            validLng = false;
        }

        if (!address || !city || !state || !country ||
            !validLat || !validLng || name.length > 50 ||
            !description || !price) {
            res.status(400);
            res.json({
                message: "Validation Error",
                statusCode: 400,
                errors: {
                    address: "Street address is required",
                    city: "City is required",
                    state: "State is required",
                    country: "Country is required",
                    lat: "Latitude is not valid",
                    lng: "Longitude is not valid",
                    name: "Name must be less than 50 characters",
                    description: "Description is required",
                    price: "Price per day is required"
                  }
            })

            let err = new Error("Body validation error");
            err.statusCode = 400;
            err.message = "Body validation error";

            return (console.log(err));
        }

        else {
            const newSpot = await Spot.create({
            ownerId: user.id, ...req.body
            })
            res.json(newSpot);
        }
})


// get all the spots with avg rating and preview img query version
router.get('/', async (req, res) => {
    //query parameters
    if (req.query.page) {
    let { page, size } = req.query;
    if(!page) page = 1
    if(!size) size = 20

    let pagination = {}
    if (parseInt(page) >= 1 && parseInt(page) <= 10 && parseInt(size) >= 1 && parseInt(size) <= 20) {
        pagination.limit = size
        pagination.offset = size * (page - 1)
    }
    else {
        res.status(400);
        res.json({
            message: "Validation Error",
            statusCode: 400,
            errors: {
                page: "Page must be greater than or equal to 1",
                size: "Size must be greater than or equal to 1",
            }
        })

        let err = new Error("Query parameter validation errors");
        err.statusCode = 400;
        err.message = "Query parameter validation errors";

        return (console.log(err));
    }




    const spots = await Spot.findAll({
        include: [
            {
                model: Review
            },
            {
                model: SpotImage
            }
        ],
        ...pagination
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
        // let avg = totalStars/totalReviews;
        // spot.avgRating = avg;
        // if (!avg) {
        //     spot.avgRating = 'no ratings for this spot';

        // }
        delete spot.Reviews;
    })
    // console.log(spots);

    const spotsObj = {page, size};
    spotsObj.Spots = spotsList;

    res.json(spotsObj);
}

else {
    const spots = await Spot.findAll({
        include: [
            {
                model: Review
            },
            {
                model: SpotImage
            }
        ],
        // ...pagination
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

    // const spotsObj = {page, size};
    const spotsObj = {};
    spotsObj.Spots = spotsList;

    res.json(spotsObj);
}
});




// // get all the spots with avg rating and preview img
// router.get('/', async (req, res) => {
//     //query parameters
//     // let { page, size } = req.query;
//     // if(!page) page = 1
//     // if(!size) size = 20

//     // let pagination = {}
//     // if (parseInt(page) >= 1 && parseInt(page) <= 10 && parseInt(size) >= 1 && parseInt(size) <= 20) {
//     //     pagination.limit = size
//     //     pagination.offset = size * (page - 1)
//     // }
//     // else {
//     //     res.status(400);
//     //     res.json({
//     //         message: "Validation Error",
//     //         statusCode: 400,
//     //         errors: {
//     //             page: "Page must be greater than or equal to 1",
//     //             size: "Size must be greater than or equal to 1",
//     //         }
//     //     })

//     //     let err = new Error("Query parameter validation errors");
//     //     err.statusCode = 400;
//     //     err.message = "Query parameter validation errors";

//     //     return (console.log(err));
//     // }




//     const spots = await Spot.findAll({
//         include: [
//             {
//                 model: Review
//             },
//             {
//                 model: SpotImage
//             }
//         ],
//         // ...pagination
//     })

//     let spotsList = [];
//     spots.forEach(spot => {
//         spotsList.push(spot.toJSON());
//     });

//     spotsList.forEach(spot => {
//         spot.SpotImages.forEach(image => {
//             if (image.preview === true) {
//                 spot.previewImage = image.url;
//             }
//         })
//         if (!spot.previewImage) {
//             spot.previewImage = 'no preview image found'
//         }
//         delete spot.SpotImages;
//     })

//     spotsList.forEach(spot => {
//         totalStars = 0;
//         totalReviews = 0;
//         spot.Reviews.forEach(review => {
//             totalStars +=review.stars;
//             totalReviews++;
//         })
//         let avg = totalStars/totalReviews;
//         spot.avgRating = avg;
//         if (!avg) {
//             spot.avgRating = 'no ratings for this spot';

//         }
//         delete spot.Reviews;
//     })
//     // console.log(spots);

//     // const spotsObj = {page, size};
//     const spotsObj = {};
//     spotsObj.Spots = spotsList;

//     res.json(spotsObj);
// });



module.exports = router;
