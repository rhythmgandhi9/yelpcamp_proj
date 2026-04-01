const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/camprground')
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware.js')
const campgrounds = require('../controllers/campgrounds.js')
const multer  = require('multer');
const {storage} = require('../cloudinary')
const upload = multer({ storage });

router.route('/')
    .get( catchAsync(campgrounds.index)) //Index route
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground)); //create route
    

//render create form route
router.get('/new',isLoggedIn,campgrounds.renderNewForm)

router.route('/:id')
    .get( catchAsync(campgrounds.showCampground)) //SHOW ROUTE
    .put(isLoggedIn,isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground)) //edit route
    .delete(isLoggedIn,isAuthor, catchAsync(campgrounds.deleteCampground)) //delete route

//render edit form route
router.get('/:id/edit',isLoggedIn,isAuthor, catchAsync(campgrounds.renderEditForm))

module.exports = router;