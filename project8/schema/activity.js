const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
    activity_type: {type: Number, required: true},
    date_time: {type: Date, default: Date.now},
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    photo_id: {type: mongoose.Schema.Types.ObjectId, ref: "Photo", default: null},
    comment_id: {type: mongoose.Schema.Types.ObjectId, default: null}
});

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;