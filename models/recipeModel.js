import mongoose from 'mongoose'

const recipeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    cookTime: {
      type: String,
      default: 0,
    },
    owner: { 
      type: mongoose.Schema.Types.ObjectId, 
      required: true, 
      ref: "User" 
    },
  }, 
  {
    timestamps: true,
  }
)

export const Recipe = mongoose.model('Recipe', recipeSchema);