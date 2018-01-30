var mongoose = require('mongoose');
var staffSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
},
{
	collection: 'adminStaff'
});

mongoose.model('adminStaff', staffSchema);

module.exports = mongoose.model('adminStaff');
