const mongoose = require('mongoose');

const GroceriesSchema = mongoose.Schema({
	adminUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    name: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    remainingItems: {
        type: Number,
        default: 0,
    },
    itemsSold: {
        type: Number,
        default: 0
    },
    cost: {
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

module.exports = mongoose.model('Groceries', GroceriesSchema);
