const express = require('express');
const { User, Review, Spot, ReviewImage, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const Sequelize = require('sequelize');
const { Model } = require('sequelize');

const router = express.Router();


//add an image to a review based on the reviews id
router.post('/:reviewId/images', requireAuth, async (req, res) => {
    const {url} = req.body;
    const {user} = req;
    const review = await Review.findByPk(req.params.reviewId);

    if (!review) {
        res.status(404);
        res.json({
            message: "Review couldn't be found",
            statusCode: 404,

        });

        let err = new Error("Couldn't find a Review with the specified id");
        err.statusCode = 404;
        err.message = "Couldn't find a Review with the specified id";

        return (console.log(err));
    }


    if (review.userId != user.id) {
        res.status(403);
        res.json({
            message: "Forbidden",
            statusCode: 403,
            errors: {
                userId: "review must belong to the current user"
            }
        })

        let err = new Error("Authorization error");
        err.statusCode = 403;
        err.message = "Authorization error";

        return (console.log(err));
    }

    let reviewImages = await ReviewImage.findAll({
        where: {
            reviewId: review.id
        }
    })

    if (reviewImages.length > 10) {
        res.status(403);
        res.json({
            message: "Maximum number of images for this resource was reached",
            statusCode: 403,

        })

        let err = new Error("Cannot add any more images because there is a maximum of 10");
        err.statusCode = 403;
        err.message = "Cannot add any more images because there is a maximum of 10";

        return (console.log(err));
    }

    const newImage = await ReviewImage.create({
        reviewId: review.id, url: url
    });

    const returnImage = await ReviewImage.findByPk(newImage.id, {
        attributes: {
            exclude: ['reviewId', 'createdAt', 'updatedAt']
        }
    })
    res.json(returnImage);

})



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
