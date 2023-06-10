const seatSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  row: { type: Number, required: true },
  isBooked: { type: Boolean, default: false },
}); 
 
