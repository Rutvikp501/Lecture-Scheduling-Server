const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    Name:{type:String},
    Email:{type:String,required:true},
    Password:{type:String,required:true},
    Role:{type:String,required:true,},
    status: { type: String, trim: true,default: '1' },
},{
    timestamps:true
})
const UserModel = mongoose.model('user',UserSchema)
module.exports={
    UserModel
}