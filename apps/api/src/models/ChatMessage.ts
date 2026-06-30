import { Schema, model, Document, Types } from "mongoose";
import type { ChatSender } from "../types";

export interface ChatMessageDoc extends Document {
  _id: Types.ObjectId;
  roomId: string;
  sender: ChatSender;
  text: string;
  createdAt: Date;
}

const chatMessageSchema = new Schema<ChatMessageDoc>(
  {
    roomId: { type: String, required: true, index: true },
    sender: {
      id: { type: String },
      name: { type: String, required: true },
      role: { type: String, required: true },
    },
    text: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ChatMessage = model<ChatMessageDoc>(
  "ChatMessage",
  chatMessageSchema
);
