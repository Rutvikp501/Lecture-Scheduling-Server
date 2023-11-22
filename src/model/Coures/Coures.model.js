const mongoose = require('mongoose');

const LecturesSchema = new mongoose.Schema({
    Date:{},
    Instructor:{},
})


const CourseSchema = new mongoose.Schema({
    Name:{type:String,required:true},
    Level:{type:String,required:true},
    Description:{type:String},
    CoverImg:{type:Object},
    Lectures:[LecturesSchema]
    
},{
    timestamps:true
})
const CourseModel = mongoose.model('course',CourseSchema)
module.exports={
    CourseModel
}