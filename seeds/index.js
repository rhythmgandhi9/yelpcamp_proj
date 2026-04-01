const mongoose = require('mongoose');
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers')
const Campground = require('../models/camprground')

main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb+srv://nemilshah212005:2BJSMBx2OmkSJ5hy@cluster0.dyduqbh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    console.log("Mongo Connection Open!!")
}
  
const sample = array=>array[Math.floor(Math.random()*array.length)];

const seedDB = async() =>{
    await Campground.deleteMany({})
    for(let i = 0; i<300; i++){
        const random1000 = Math.floor(Math.random()*1000)
        const price = Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            author: '664d6fa12898f8bed1e90cb7',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,  
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, quo! Lorem ipsum dolor sit amet consectetur adipisicing elit.',
            price,
            geometry: { 
                type: "Point",
                coordinates: [
                   cities[random1000].longitude,
                   cities[random1000].latitude]
              },
            images: [
                {
                  url: 'https://res.cloudinary.com/dqeaomlck/image/upload/v1716042911/YelpCamp/juhvscfomvjsicprobzp.jpg',
                  filename: 'YelpCamp/juhvscfomvjsicprobzp'  
                  
                },
                {
                  url: 'https://res.cloudinary.com/dqeaomlck/image/upload/v1716042914/YelpCamp/n5hfpjabo6woydov7r01.jpg',
                  filename: 'YelpCamp/n5hfpjabo6woydov7r01'
                  
                },
                {
                  url: 'https://res.cloudinary.com/dqeaomlck/image/upload/v1716042915/YelpCamp/awi9znfkfskn9a72kcu0.jpg',
                  filename: 'YelpCamp/awi9znfkfskn9a72kcu0'
                }
              ]
        })
        await camp.save();
    }
}


seedDB().then(()=>mongoose.connection.close());