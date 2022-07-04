const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
    hash: String
});

const UserModel = module.exports = mongoose.model('Users', UsersSchema);