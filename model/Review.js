const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      require: true,
    },
    reviewdate: {
      type: Date,
      default: new Date(),
    },
    review: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Review", OrderSchema);
