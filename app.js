const express = require('express')
const app = express()
const cors = require('cors')
const BASE_URL = process.env.BASE_URL || 2000

//requiring mongoose
const mongoose = require('mongoose')
mongoose.set('strictQuery',false)

//connecting to DataBase
// let dbURL = "mongodb+srv://abiiRam:abii%40mongoDB002@abii.dgatpri.mongodb.net/fitness?retryWrites=true&w=majority"
let dbURL = "mongodb://localhost:27017/fitness"
mongoose.connect(dbURL ,  { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>
{
    console.log("connected to database");
})

//creating and requiring models 
const user = require('./models/userSchema')
const trainer = require('./models/trainerSchema')
const workout = require('./models/workoutSchema')

//middlewares
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors())

app.post('/signup', async (req, res) => {
    try {

      let person = req.body.userKind == "user" ?  await user.findOne({ email: req.body.email }).exec() 
                                               :  await trainer.findOne({ email: req.body.email }).exec()

      
      if (person) {
        res.send({ message: "person already exists" });
      } else {
          switch(req.body.userKind)
          {
          case "user" :
                  const userData = new user({
                  name: req.body.name,
                  age: req.body.age,
                  email: req.body.email,
                  password: req.body.password,
                  gender: req.body.gender,
                  userKind: req.body.userKind
                });
                await userData.save();
                res.send({ message: "new user is created" });
                break;
          case "trainer" :
                const trainerData = new trainer({
                  name: req.body.name,
                  age: req.body.age,
                  email: req.body.email,
                  password: req.body.password,
                  gender: req.body.gender,
                  userKind: req.body.userKind
                });
                await trainerData.save();
                res.send({ message: "new Trainer is created" });
                break;
          }   
      }
    } catch (err) {
      res.send(err);
    }
  });

  app.post("/login" , async (req , res)=>
  {
    try
    {
       let person = req.body.personType == "user" ? await user.findOne({email:req.body.email}).exec() //the exec() method used to execute the query and handle the results in the callback function
                                                  : await trainer.findOne({email:req.body.email}).exec()

       if(person)
       {
          if(person.password == req.body.password)
          {
            res.send({message:"Login Successfull" , user: person})
          }
          else
          {
            res.send({message:"Incorrect Password"})
          }
       }else{
        res.send({message:"seems like you haven't signed before"})
       }
    }
    catch(err) {
        res.send(err)
    }
  })

  app.put('/update' ,async (req , res)=>
  {
    try {
      req.body.personType == "user"
       ?
      await user.findByIdAndUpdate(req.body.id, {name : req.body.name}).exec()
      .then(()=>
      {
          res.send({message : "updated"});
      })
      .catch((err)=>
      {
        console.error(err);
      })
       :
      await trainer.findByIdAndUpdate(req.body.id , {name : req.body.name}).exec()
      .then((res)=>
      {
        res.send({message : "updated"});
      })
      .catch((err)=>
      {
        console.error(err);
      })


    } catch (error) {
      res.send(error)
      console.log(error);
    }
  })

  app.put('/bmi' ,async (req , res)=>
  {
    try {
      req.body.personType == "user"
       ?
      await user.findByIdAndUpdate(req.body.id, {bmi : req.body.bmi , health : req.body.health}).exec()
      .then(()=>
      {
          res.send({message : "updated"});
      })
      .catch((err)=>
      {
        console.error(err);
      })
       :
      await trainer.findByIdAndUpdate(req.body.id , {name : req.body.name}).exec()
      .then((res)=>
      {
        res.send({message : "updated"});
      })
      .catch((err)=>
      {
        console.error(err);
      })


    } catch (error) {
      res.send(error)
      console.log(error);
    }
  })

  app.post('/AddWorkout' , async ( req ,res )=>
  {
    let workoutExists = await workout.findOne({workoutName:req.body.workoutName}).exec()

    if(!workoutExists)
    {
      let workoutData = new workout({
        workoutName : req.body.workoutName,
        musle : req.body.musle,
        gifURL : req.body.gif,
        equipment : req.body.equipment,
        level : req.body.level,
        instructions : req.body.instructions,
        trainer : req.body.trainer
      })
      await workoutData.save()
      res.send({message: "new workout has been added, kindly checkout in (workouts)"})
    }
    else
    {
      res.send({message : "Can't add , workout already present"})
    }
  })

  app.get('/Allworkout' , async (req,res)=>
  {
    await workout.find().exec()
    .then((data)=>
    {
      res.send({info : data})
    })
  })

  app.get('/singleWorkout/:id' , async (req , res)=>
  {
    try
    {
      let {id} = req.params
      await workout.findById(id).exec()
      .then((data)=>
      {
        res.send(data)
      })
    }catch(err){
      res.send(err);
    }
    
  })

  app.delete('/Deleteworkout:id' ,  async(req , res)=>
  {
    try
    {
      let {id} = req.params
      await workout.deleteOne({ _id : id }).exec()
      .then(()=>
      {
        res.send({message : "Deleted successfully"})
      })
    }catch(err)
    {
      console.log(err);
    }
  } )

  app.put('/updateWorkout' , async (req , res)=>
  {
    try
    {
      await workout.findOneAndUpdate( { _id : req.body.id} , { $set : req.body } , { new : true } ).exec()
      .then(()=>
      {
       res.send({message : "Updated successfully"})
      })
    }catch(err)
    {
      console.log(err);
    }
  })

//app listening to port 
app.listen( BASE_URL , ()=>
{
    console.log(`listening to port ${BASE_URL}`);
} )