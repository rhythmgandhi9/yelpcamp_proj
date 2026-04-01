const express = require('express');
const router = express.Router({mergeParams:true}); //used to merge the params from the parent route into the router routes otherwise campground id won,t be considered
const catchAsync = require('../utils/catchAsync')
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware')
const reviews = require('../controllers/reviews');



//Review associating route
router.post('/',isLoggedIn, validateReview, catchAsync(reviews.createReview))

//Review delete route
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;