const express = require('express');
const { User, Review, Spot, ReviewImage, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const Sequelize = require('sequelize');
const { Model } = require('sequelize');

const router = express.Router();


//get all the reviews written by current user
router.get('/current', requireAuth, async (req, res) => {
    const {user} = req;

    const userReviews = await Review.findAll({
        where: {
            userId: user.id,
        },
        include: [
            {
                model: Spot,
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                },
                include: [
                    {
                        model: SpotImage
                    }
                ]
            },
            {
                model: ReviewImage,
                attributes:
                {exclude: ['createdAt', 'updatedAt', 'reviewId']}
            }
        ]
    })
    let reviewList = [];
    userReviews.forEach(review => {
        reviewList.push(review.toJSON());
    });

    reviewList.forEach(review => {
        review.Spot.SpotImages.forEach(image => {
            if (image.preview === true) {
                review.Spot.previewImage = image.url;
            }
        })
        if (!review.Spot.previewImage) {
            review.Spot.previewImage = 'no preview image found'
        }
        delete review.Spot.SpotImages;
    })

    reviewList.forEach(review => {
        review.User = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName
        };
    })


    const reviewsObj = {};
    reviewsObj.Reviews = reviewList;
    res.json(reviewsObj);
})



module.exports = router;
