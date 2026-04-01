const Campground = require('../models/camprground')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken})
const {cloudinary} = require('../cloudinary');

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports.index = async(req,res) =>{
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), "gi");
        // Get all campgrounds from DB that match the search query
        const allCampgrounds = await Campground.find({ title : regex });

        if (allCampgrounds.length < 1) {
            req.flash('error', 'Cannot find that campground!') 
            return res.redirect('/campgrounds');
        }

        res.render("campgrounds/index", {
            campgrounds: allCampgrounds,
        });
    } else{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
    }
}
module.exports.renderNewForm = (req,res) => {
    res.render('campgrounds/new')
}
module.exports.createCampground = async(req,res,next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const geoData =await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1        
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry
    campground.images = req.files.map(f =>({url:f.path,filename: f.filename}))
    campground.author = req.user._id;
    await campground.save();
    console.log(campground)
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`campgrounds/${campground._id}`);
    
}
module.exports.showCampground = async(req,res) =>{
    const {id} = req.params; //or can also directly pass req.params.id
    //niche hum campround pe review and unke author ko to populte kr rhe hai pr review model pe bhi review ke author ko populate kr rhe
    const campground = await Campground.findById(id).populate({
        path:'reviews',
        populate:{
            path: 'author' //ye review ke author ko populate krta
        }    
    }).populate('author'); //ye campground ke author ko populate krta
    if(!campground){
        req.flash('error', 'Cannot find that campground!') 
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground})
}
module.exports.renderEditForm = async(req,res) =>{
    const {id} = req.params; 
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'Cannot find that campground!') 
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground})
}
module.exports.updateCampground = async(req,res)=>{
    const {id} = req.params;
    console.log(req.body)
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    const imgs = req.files.map(f =>({url:f.path,filename: f.filename}))
    campground.images.push(...imgs)
    await campground.save()
    if (req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull:{images: {filename: {$in: req.body.deleteImages}}}})
        
    }
    req.flash('success', 'Successfully updated a campground!')
    res.redirect(`/campgrounds/${campground.id}`);
}
module.exports.deleteCampground = async(req,res) =>{
    const {id} = req.params
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Succesfully deleted campground!') 
    res.redirect('/campgrounds');
}