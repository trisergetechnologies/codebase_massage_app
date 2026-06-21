const mongoose = require("mongoose");

/**
 * Browse grouping for services. A service can belong to multiple categories
 * via Service.categories (array of Category slugs).
 */
const categorySchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
