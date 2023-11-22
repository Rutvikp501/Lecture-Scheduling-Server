module.exports = (app) => {
const express = require('express');
const { UserModel } = require('../model/User/User');
const { CourseModel } = require('../model/Coures/Coures.model');
const { cloudinary } = require('../utils/cloudinary');
const CourseRouter = express.Router()

    
CourseRouter.get('/',async(req,res)=>{
        try {
            const AllCourse = await CourseModel.find({})
            
            res.status(200).json(AllCourse)
        } catch (error) {
            res.status(500).send("Error")
        }
    })

CourseRouter.get('/instructor',async(req,res)=>{
        try {
            const Allinstructor = await UserModel.find({Role:"Instructor"})
            res.status(200).json(Allinstructor)
        } catch (error) {
            res.status(500).send("Error")
        }
    })
CourseRouter.get('/instructordata',async(req,res)=>{
        try {
            const Allinstructor = await UserModel.find({Role:"Instructor"})
            const AllCourse = await CourseModel.find({})
            res.status(200).json({Allinstructor, AllCourse})
        } catch (error) {
            res.status(500).send("Error")
        }
    })



    CourseRouter.post('/coursealocate',async(req,res)=>{
        const {Instructor,Course,Date}=req.body;
        try {
            const Coursedetails = await CourseModel.findById({_id:Course})
            const Instructordetails = await UserModel.findById({_id:Instructor})
            let Lectures = Coursedetails.Lectures
            let flag = false
          
            for (let index = 0; index < Lectures.length; index++) {
              const element = Lectures[index]
              if (element.Instructor == Instructordetails.Name && element.Date == Date){
                flag = true
                res.status(500).json( "Instructor Allready has a slot Booked")
                break
              }
            }
          
            if(!flag){
              const lectureData={
                Date:Date,
                Instructor:Instructordetails.Name,
              }
              Coursedetails.Lectures.push(lectureData)
              
              const datas = await CourseModel.findByIdAndUpdate({_id:Course},Coursedetails)
              res.status(200).json({datas:datas});
            }
            
          } catch (error) {
            res.status(500).json({message: "Error:", error: error})
          }
    })
    CourseRouter.post('/create',async(req,res)=>{
        const {CoverImg}=req.body;
        try {
            let uploadRes
            if(CoverImg){
                 uploadRes = await cloudinary.uploader.upload(CoverImg,{
                    folder:'courses_images'
                })
                if(!uploadRes){
                    res.status(500).json({error:`Image uploading went wrong`})
                }
            }
        const newCourse = uploadRes? new CourseModel({...req.body,CoverImg:uploadRes}):new CourseModel(req.body)
            const datas = await newCourse.save()
            console.log(datas)
            res.status(200).json({data:datas});
        } catch (error) {
            res.status(500).json({message: "Error:", error: error})

            
        }
    })

    CourseRouter.delete('/delete/:id',async(req,res)=>{
        const ID = req.params.id
        const Appoinment = await Appoinmentmodel.findOne({_id:ID})
        const userID_in_Appoinment = Appoinment.userID
        const userID_in_req = req.headers.userid
        //console.log(userID_in_req);
        try {
            if(userID_in_Appoinment != userID_in_req){
                res.send("You're not authorized")
            }
            else{
    
                await Appoinmentmodel.findByIdAndDelete({_id:ID})
                res.send("Deleted")
            }
        } catch (error) {
            res.status(500).send(error)
        }
    })

    
    


app.use("/course", CourseRouter);
}
