const asyncHandler = require("express-async-handler");
const Service = require("../models/Service");
const { isMongoObjectId } = require("../lib/ids");
const { serializeService } = require("../lib/serialize");

async function findService(paramId) {
  if (isMongoObjectId(paramId)) return Service.findById(paramId);
  return Service.findOne({ slug: paramId });
}

const list = asyncHandler(async (req, res) => {
  const filter = { active: true };
  if (req.query.category) {
    filter.categories = req.query.category;
  }
  const services = await Service.find(filter).sort({ createdAt: 1 });
  res.json(services.map(serializeService));
});

const get = asyncHandler(async (req, res) => {
  const svc = await findService(req.params.id);
  if (!svc) return res.status(404).json({ error: "not_found" });
  res.json(serializeService(svc));
});

const create = asyncHandler(async (req, res) => {
  const svc = await Service.create(req.body);
  res.status(201).json(serializeService(svc));
});

const update = asyncHandler(async (req, res) => {
  const existing = await findService(req.params.id);
  if (!existing) return res.status(404).json({ error: "not_found" });
  const svc = await Service.findByIdAndUpdate(existing._id, req.body, { new: true });
  res.json(serializeService(svc));
});

const remove = asyncHandler(async (req, res) => {
  const existing = await findService(req.params.id);
  if (!existing) return res.status(404).json({ error: "not_found" });
  await Service.findByIdAndUpdate(existing._id, { active: false });
  res.json({ ok: true });
});

module.exports = { list, get, create, update, remove };
