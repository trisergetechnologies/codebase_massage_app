const asyncHandler = require("express-async-handler");
const Category = require("../models/Category");

function serializeCategory(cat) {
  const o = cat.toObject ? cat.toObject() : cat;
  return {
    id: o.slug,
    slug: o.slug,
    name: o.name,
    description: o.description,
    sortOrder: o.sortOrder,
    active: o.active,
  };
}

const list = asyncHandler(async (_req, res) => {
  const categories = await Category.find({ active: true }).sort({ sortOrder: 1, name: 1 });
  res.json(categories.map(serializeCategory));
});

module.exports = { list, serializeCategory };
