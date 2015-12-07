var util = require('./server/utility');
var db = require('./db/db')
module.exports = function() {
  var roomName = 'testRoom';
  var hostUserName = 'Jackson'
  util.createEvent(db, roomName, hostUserName)
  .then(function() {
    Promise.all([
    util.createUser(db, 'Jack', 1, false),
    util.createUser(db,'Jill', 1, false),
    util.createUser(db,'Sarah', 1, false),
    util.createUser(db,'Ted', 1, false)])
    .then(function() {
      Promise.all([
      util.createDish(db, 'chicken', 10, 1, 1),
      util.createDish(db, 'rice', 13, 1, 1),
      util.createDish(db, 'soup', 5, 1, 1),
      util.createDish(db, 'protein', 1, 1, 1),
      util.createDish(db, 'chicken', 10, 2, 1),
      util.createDish(db, 'rice', 13, 3, 1),
      util.createDish(db, 'soup', 5, 4, 1),
      util.createDish(db, 'protein', 1, 5, 1),
      util.createDish(db, 'chicken', 10, 3, 1),
      util.createDish(db, 'rice', 13, 4, 1),
      util.createDish(db, 'soup', 5, 5, 1),
      util.createDish(db, 'protein', 1, 2, 1),
      util.createDish(db, 'chicken', 10, 4, 1),
      util.createDish(db, 'rice', 13, 5, 1),
      util.createDish(db, 'soup', 5, 2, 1),
      util.createDish(db, 'protein', 1, 3, 1),
      util.createDish(db, 'chicken', 10, 5, 1),
      util.createDish(db, 'rice', 13, 2, 1),
      util.createDish(db, 'soup', 5, 3, 1),
      util.createDish(db, 'protein', 1, 4, 1)
        ])
      .then(function() {
        util.gatherState(db, 1, roomName)
        .then(function(data) {
          data.users.forEach(function(user, index) {
            data.users[index].dishes = JSON.stringify(user.dishes);
          })
          console.log('Event Info Dummy Data: \n', data);
        })
      })
    })
    .catch(function(err){
      console.error('Error Generating Dummy Data: ', err)
    })
  })
}
