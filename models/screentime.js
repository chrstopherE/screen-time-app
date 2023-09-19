const mongoose =  require('mongoose');
const Schema = mongoose.Schema;


// temporary schema until I figure out how to make the main feature and make data flooow
const ScreentimeSchema = new Schema({
    screenTime: Date,
    timeStamp: Date,
    startTime: Date, // Timestamp indicating when screentime started
    endTime: Date,   // Timestamp indicating when screentime ended
    createdAt: { type: Date, default: Date.now }, // Timestamp when the record was created
    updatedAt: { type: Date, default: Date.now }  // Timestamp when the record was last updated
})

module.exports = mongoose.model('Screentime', ScreentimeSchema);