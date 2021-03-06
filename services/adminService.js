const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const User = db.User
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

let adminService = {
  getRestaurants: (req, res, callback) => {
    return Restaurant.findAll(
      { include: [Category] }
    ).then(restaurants => {
      callback({ restaurants: restaurants })
    })
  },

  getRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id, { include: [Category] }).then(restaurant => {
      callback({ restaurant: restaurant })
    })
  },

  postRestaurant: (req, res, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: 'Name is required!' })
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: file ? img.data.link : null,
          CategoryId: req.body.categoryId
        }).then(restaurant => {
          return callback({ status: 'success', message: 'Restaurant was created successfully!' })
        })
      })
    } else {
      return Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: null,
        CategoryId: req.body.categoryId
      }).then(restaurant => {
        return callback({ status: 'success', message: 'Restaurant was created successfully!' })
      })
    }
  },

  putRestaurant: (req, res, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: 'Name is required!' })
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id)
          .then((restaurant) => {
            restaurant.update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? img.data.link : restaurant.image,
              CategoryId: req.body.categoryId
            })
              .then((restaurant) => {
                return callback({ status: 'success_messages', message: 'Restaurant was successfully updated!' })
              })
          })
      })
    } else {
      return Restaurant.findByPk(req.params.id)
        .then((restaurant) => {
          restaurant.update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: restaurant.image,
            CategoryId: req.body.categoryId
          })
            .then((restaurant) => {
              return callback({ status: 'success_messages', message: 'Restaurant was successfully updated!' })
            })
        })
    }
  },

  deleteRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id).then(restaurant => {
      restaurant.destroy()
        .then((restaurant) => {
          callback({
            status: 'success',
            message: ''
          })
        })
    })
  },

  editUsers: (req, res, callback) => {
    return User.findAll().then(users => {
      return callback({ users: users })
    })
  },

  putUsers: (req, res, callback) => {
    return User.findByPk(req.params.id).then(user => {
      if (user.isAdmin) {
        user.update({
          isAdmin: 0
        })
          .then((user) => {
            return callback({ status: 'success', message: 'User was successfully updated!' })
          })
      } else {
        user.update({
          isAdmin: 1
        })
          .then((user) => {
            return callback({ status: 'success', message: 'User was successfully updated!' })
          })
      }
    }).catch(err => {
      return callback({ status: 'error', message: 'User not found!' })
    })
  }
}

module.exports = adminService