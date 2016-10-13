var User = require('./userModel.js');
var Events = require('./eventModel.js');
var mongoose = require('mongoose');
var services = require('./services.js');

var db = mongoose.connection;

module.exports = {

  // add new user to user collection
  addUser: function(req, res) {
    User.findOne({'userId': req.body.userId}, function(error, user){
      if(error){
        console.error(error);
      } else if(user === null){
        User.create(req.body, function(error, user){
          if(error){
            console.error(error);
          } else {
            console.log('User Successfully Created!', user)
            res.json(user);
          }
        })
      } else {
        console.log('User Already Created');
        res.status(200).send('User already exists!');
      }
    })
  },

  // get user in user collection
  findUser: function(req, res) {
    console.log('Find User Called');
    User.findOne({'userId': req.params.id}, function(error, user){
      if(error){
        console.error(error);
      } else {
        console.log(user);
        res.json(user);
      }
    })
  },

  // add an event to users favorite field in user collection
  addFavorite: function(req, res) {
    console.log('Add Favorite Called');
    console.log('****', req.body);
    db.collections.users.update(
      { userId: req.body.userId },
      { $push: { favoritedEvents: req.body.favoritedEvent } }
    );
    res.status(200).send('Successfully updated user');
  },

  // get users favorites in user collection
  getFavorites: function(req, res) {
    console.log('Get Favorites Called');
    User.findOne({'userId': req.params.id}, function(error, user){
      if(error){
        console.error(error);
      } else {
        Events.find({ eventId: { $in: user.favoritedEvents } }, function(error, events){
          if(error){
            console.error(error)
          } else {
            res.json(events);
          }
        })
      }
    })
  },

  // adds users zipcode to the user collection
  addZipCode: function(req, res) {
    db.collections.users.findOneAndUpdate(
      { userId: req.body.userId },
      {
        $set: { zipCode:req.body.zipCode }
      }
    ).then(function(result) {
      res.json(result)
    }).catch(function(err) {
      res.json(err)
    })
  },

  // add users interests to the user collection
  addInterests: function(req, res) {
    db.collections.users.findOneAndUpdate(
      { userId: req.body.userId },
      {
        $addToSet: { interests: { $each: req.body.interests } }
      }
    ).then(function(result) {
      res.json(result)
    }).catch(function(err) {
      res.json(err)
    })
  },

  // add profile image link to user document in user collection
  addImgUrl: function(req, res) {
    db.collections.users.findOneAndUpdate(
      { userId: req.body.userId },
      {
        $set: { imgUrl: req.body.imgUrl }
      }
    ).then(function(result) {
      res.json(result)
    }).catch(function(err) {
      res.json(err)
    })
  },

  // get profile image link from user document in user collection
  getImgUrl: function(req, res) {
    console.log('Get ImgUrl Called');
    console.log("this is getImgUrl reqeust", req.params.id);
    db.collections.users.findOne(
      { userId: req.params.id } // get use params
    ).then(function(result) {
      console.log("this is getImgUrl result", result);
      res.json(result.imgUrl)
    }).catch(function(err) {
      res.json(err)
    })
  },

  // grab the users zipcode from users collection
  getUserZipcode: function(req, res) {
    db.collections.users.findOne(
      { userId: req.params.id }
    ).then(function(result) {
      res.json(result.zipCode)
    }).catch(function(err) {
      res.json(err)
    })
  },

  // grab the users interests from users collection
  getUserInterests: function(req, res) {
    db.collections.users.findOne(
      { userId: req.params.id }
    ).then(function(result) {
      res.json(result.interests)
    }).catch(function(err) {
      res.json(err)
    })
  }

}