const express = require('express');
const { Spot, Review, SpotImage } = require('../../db/models');

const router = express.Router();


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

module.exports = router;
