"use strict";
const CourseModel = require("../model/Coures/Coures.model")

CourseModel.pre('save', async function (next) {
    const instructorLectures = await CourseModel.find({
      'Lectures.Instructor': this.Instructor,
      'Lectures.Date': { $in: this.Lectures.map(({ Date }) => Date) },
    });
  
    if (instructorLectures.length > 0) {
      throw new Error('Instructor already has a lecture scheduled on that date');
    }
  
    next();
  });
  
  const assignLecture = async (courseId, instructorId, lectureDate) => {
    try {
      const courseDetails = await CourseModel.findById({ _id: courseId });
      const instructorDetails = await UserModel.findById({ _id: instructorId });
  
      const lectureData = {
        Date: lectureDate,
        Instructor: instructorDetails.Name,
      };
  
      courseDetails.Lectures.push(lectureData);
  
      await courseDetails.save();
  
      res.status(200).json({ message: 'Lecture assigned successfully', data: courseDetails });
    } catch (error) {
      res.status(500).json({ message: 'Error:', error: error });
    }
  };
  module.exports= assignLecture();