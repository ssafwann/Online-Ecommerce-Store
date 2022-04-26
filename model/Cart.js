const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
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
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
        image: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { versionKey: false }
);

module.exports = mongoose.model("Cart", CartSchema);
