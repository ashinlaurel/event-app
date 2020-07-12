const mongoose = require("mongoose");
const autopopulate = require("mongoose-autopopulate");

const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      autopopulate: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      autopopulate: true,
    },
  },
  { timestamps: true }
);

bookingSchema.plugin(require("mongoose-autopopulate"));
module.exports = mongoose.model("Booking", bookingSchema);
