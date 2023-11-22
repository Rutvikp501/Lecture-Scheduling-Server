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
CourseRouter.get('/couresallocation',async(req,res)=>{
        try {
            const Allinstructor = await UserModel.find({Role:"Instructor"})
            const AllCourse = await CourseModel.find({})
            res.status(200).json({Allinstructor, AllCourse})
        } catch (error) {
            res.status(500).send("Error")
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

    
    



//////////////Add Course/////////////////
CourseRouter.post('/create1',async(req,res)=>{
    const {title,image} = req.body
    try {
        const existingCourse = await CourseModel.findOne({ title });
        if (existingCourse) {
          res.status(400).json({ error: 'Course already exists' });
          return;
        }
        let uploadRes
            if(image){
                 uploadRes = await cloudinary.uploader.upload(image,{
                    folder:'courses_images'
                })
                if(!uploadRes){
                    res.status(500).send(`Image uploading went wrong`)
                }
            }
        const newCourse = new CourseModel({title,image:uploadRes})
        const data = await newCourse.save()
        res.status(200).send(data)
        
    } catch (error) {
        res.status(500).send(`Error creating Course: ${error.message}`)
    }
})

//////////////Get all Course/////////////////
CourseRouter.get('/find',async(req,res)=>{  
    try {
        const cart = await CourseModel.find({})
                    res.status(201).json(cart)
    } catch (error) {
        res.status(500).send(`Error getting Course data: ${error.message}`)
    }
})
//////////////Update details/////////////////
CourseRouter.patch('/edit/:id',async(req,res)=>{
    const ID = req.params.id
    try {
        let updated = await CourseModel.findByIdAndUpdate({_id:ID},req.body,{ new: true })
        res.status(201).json(updated)
    } catch (error) {
        res.status(500).send(`Error updating products: ${error.message}`) 
    }
})

//////////////Delete product/////////////////
CourseRouter.delete('/delete/:id',async(req,res)=>{
    const ID = req.params.id
    try {
        await CourseModel.findByIdAndDelete({_id:ID})
        res.status(201).json('Deleted successfully')
    } catch (error) {
        res.status(500).send(`Error deleting products: ${error.message}`) 
    }
})
//////////////Active product/////////////////
CourseRouter.patch('/active/:id',async(req,res)=>{  
    const { id } = request.body;
    try {
        let Coursestatus = await CourseModel.find({ _id: id });

        let newstatus = "";
        let status = "";
        let msg = "";
        if (Coursestatus[0]["status"] == 0) {
          newstatus = 1;
          status = "success";
          msg = "Course Active successfully.";
        } else {
          newstatus = 0;
          status = "failed";
          msg = "Course Delete successfully.";
        }
  
        await CourseModel.findByIdAndUpdate(id, { status: newstatus });
  
        // const result = await SubmenuModel.findByIdAndDelete(id)
        response.send({
          status: status,
          statuscode: 200,
          message: msg,
        });

    } catch (error) {
        res.status(500).send(`Error getting Course data: ${error.message}`)
    }
})


app.use("/course", CourseRouter);
}