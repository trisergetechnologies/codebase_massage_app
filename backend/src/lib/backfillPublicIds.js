/**
 * Backfill `publicId` on existing documents (safe to run multiple times).
 */
const { newPublicId } = require("./ids");

async function backfillPublicIds(models) {
  for (const Model of models) {
    const missing = await Model.find({
      $or: [{ publicId: { $exists: false } }, { publicId: null }, { publicId: "" }],
    });
    for (const doc of missing) {
      doc.publicId = newPublicId();
      await doc.save();
    }
    if (missing.length > 0) {
      console.log(`[ids] backfilled ${missing.length} ${Model.modelName} record(s)`);
    }
  }
}

module.exports = { backfillPublicIds };
