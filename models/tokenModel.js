import mongoose, { Schema } from 'mongoose';

const tokenSchema = mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    unique: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expired: 3600,
  },
});

const Token = mongoose.model('token', tokenSchema);

export { Token };
