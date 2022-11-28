const express = require('express');
const { where } = require('sequelize');
const { Spot, Review, SpotImage, Booking, User, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const Sequelize = require('sequelize')


const router = express.Router();


//delete a review image
router.delete('/:imageId', requireAuth, async (req, res) => {
    const {user} = req;
    const reviewImage = await ReviewImage.findByPk(req.params.imageId);

    if (!reviewImage) {
        res.status(404);
        res.json({
            message: "Review Image couldn't be found",
            statusCode: 404,

        });

        let err = new Error("Couldn't find a Review Image with the specified id");
        err.statusCode = 404;
        err.message = "Couldn't find a Review Image with the specified id";

        return (console.log(err));
    }


    const review = await Review.findByPk(reviewImage.reviewId);

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



    await ReviewImage.destroy({
        where: {
            id: req.params.imageId
        }
    })

    res.json({
        message: "Successfully deleted",
        statusCode: 200
      })
})



module.exports = router;
