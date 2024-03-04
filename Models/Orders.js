const mongoose = require('mongoose');

const OrdersSchema = mongoose.Schema({
	userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Groceries",
            },
            quantity: {
                type: Number,
                default: 1
            },
        }
    ],
    totalAmount: {
        type: Number
    }
}, 
{
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
  );

module.exports = mongoose.model('Orders', OrdersSchema);
