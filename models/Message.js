import mongoose from "mongoose";
const { Schema, model } = mongoose;

const messageSchema = new Schema({
  from: { type: Schema.Types.ObjectId, required: true, index: true },
  fromModel: { type: String, enum: ["User", "Therapist"], required: true },
  to: { type: Schema.Types.ObjectId, required: true, index: true },
  toModel: { type: String, enum: ["User", "Therapist"], required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }, // Track if the message has been read
});

export default model("Message", messageSchema);

// When querying messages, you can use the fromModel and toModel fields to determine which model to populate:
// Message.find()
//   .populate({ path: "from", model: "User" })
//   .populate({ path: "to", model: "Therapist" })
//   .exec((err, messages) => {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log(messages);
//     }
//   });
