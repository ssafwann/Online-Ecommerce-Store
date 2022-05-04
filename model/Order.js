const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalQuantity: {
      type: Number,
      default: 0,
      required: true,
    },
    subtotal: {
      type: Number,
      default: 0,
      required: true,
    },
    deliveryaddress: {
      type: String,
      required: true,
    },
    orderdate: {
      type: Date,
      default: new Date(),
    },
    deliverystatus: {
      type: Boolean,
      default: false,
    },
    products: [
      {
        productID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        price: {
          type: Number,
          default: 0,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        shop: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { versionKey: false }
);

module.exports = mongoose.model("Order", OrderSchema);
