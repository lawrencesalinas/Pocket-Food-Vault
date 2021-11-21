const express = require('express')
const router = express.Router()
const axios = require('axios')
const db = require('../models')
const restaurant = require('../models/restaurant')
const user = require('../models/user')
const { render } = require('ejs')
const flash = require('connect-flash')
const isLoggedIn = require('../middleware/isLoggedIn')

//-----------GET route to render a list of the users favorite restaurants--//
router.get('/',isLoggedIn, (req, res) => {
    //find user restaurants data using user id and user restaurants
    db.user.findByPk(res.locals.currentUser.id, {include: [db.restaurant] })
    .then(foundUser => {
     const names = foundUser.restaurants
    res.render('profile/restaurants/index.ejs' ,{results:names})
    })
       .catch(error => {
        console.log(error)
    })
})

//-------------POST route to add a restaurant on users profile----//
router.post('/add',isLoggedIn,(req, res) => {
    // console.log(req.body);
    db.restaurant.findByPk(req.body.restaurantId)
    .then(foundRestaurant => {
      db.user.findByPk(res.locals.currentUser.id)
    .then( foundUser => {
        console.log(foundUser)
       foundRestaurant.addUser(foundUser)
    })
    .catch(error => {
        console.log(error)
    })
    })
})

router.get('/edit/:id' ,isLoggedIn, (req, res) => {
    db.restaurant.findOne({
        where: { id: req.params.id } 
      })
      .then(foundRestaurant =>{
          console.log(foundRestaurant)
          res.render('profile/restaurants/edit.ejs', 
          {name: foundRestaurant.name, address: foundRestaurant.address, 
          hours: foundRestaurant.hours, phoneNumber: foundRestaurant.phoneNumber, 
          restaurantCode: foundRestaurant.restaurantCode, restaurantId: foundRestaurant.id })
        
      })
      .catch(error => {
        console.log(error )
      })
  })
    

  router.put('/:idx', (req, res) => {

    db.restaurant.update({
        where: { id: req.body.restaurantId } 
      })
      .then(foundRestaurant =>{
          console.log(foundRestaurant)
    //re-assign the name and type fields of the dinosaur to be editted
        console.log(foundRestaurant.name = req.body.name)

    // dinoData[req.params.idx].name = req.body.name
    // dinoData[req.params.idx].type = req.body.type
    //  // save the editted dinosaurs to the data.json file
    // fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinoData))
    // res.redirect('/dinosaurs');
    // console.log(req.body);
    res.redirect(`/profile/restaurants/${req.body.restaurantId}`);
  })
 
})









//------------GET route for users' detailed restaurants----//
router.get('/:id',isLoggedIn,(req, res) => {
  
    db.restaurant.findOne({
      where: { id: req.params.id } 
    })
    .then(foundRestaurant =>{
        res.render('profile/restaurants/detail.ejs', 
        {name: foundRestaurant.name, address: foundRestaurant.address, 
        hours: foundRestaurant.hours, phoneNumber: foundRestaurant.phoneNumber, 
        restaurantCode: foundRestaurant.restaurantCode, restaurantId: foundRestaurant.id })
    })
    .catch(error => {
      console.log(error )
    })
})



//---------------DELETE a user favorite restaurant----//      
router.delete('/:id' ,isLoggedIn, (req, res) => {
    console.log('DELETE')
   
     db.userRestaurant.destroy({
       where: {restaurantId: req.params.id, userId:res.locals.currentUser.id }
     }) 
  .then(deletedItem => {
    if(deletedItem === 1){
      console.log('Deleted successfully');
    }
    res.redirect('/profile/restaurants')
  })
    })


module.exports = router