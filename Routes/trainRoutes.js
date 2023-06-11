const express = require("express");
const { Train } = require("../Models/trainModel");
const { Mongoose, default: mongoose } = require("mongoose");
const {findAvailableSeats,markSeatsAsBooked} =require("../Controller/Controll")

const router = express.Router();

router.post("/", async (req, res) => {
    //  Nubmer of seats which is requested for booking
  const numSeats = parseInt(req.body.numSeats);
//  Find All Seats
  let train = await Train.findOne();
  
  try {
    if (!numSeats || numSeats < 1 || numSeats > 7) {
      return res
        .status(400)
        .send({ message: "Invalid number of seats requested" });
    }
    if (!train) {
      return res.status(404).send({ message: "Train not found" });
    }

    // Find the All Seats which are not booked
    let notBooked=train.coach.seats.filter((el)=>el.isBooked===false) 

    // Find the available seats for the requested number of seats
    let availableSeats = findAvailableSeats(notBooked,numSeats)
    
 
    if (availableSeats.length <= 0||availableSeats.length<numSeats||notBooked.length<numSeats) { 
      return res.status(400).send({ message: "No seats available" });
    }

    
    // Marking Seat as booked which  seats are booked
    let marks= markSeatsAsBooked(train.coach.seats, availableSeats);

    // Modifing  the seats After booking
    train.coach.seats=marks
    await train.save()
    res.send({ seats: availableSeats });
  } 
  catch (err) {
    res.status(500).send(err);
  }
});
router.get("/", async (req, res) => {
  try {
    const train = await Train.findOne()
    res.send(train);
  } catch (err) {
    res.send(err);
  }
});





module.exports = {
  router,
};
