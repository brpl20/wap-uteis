//src/config/featureFlags.js
const mongoose = require("mongoose");

const FeatureFlagSchema = new mongoose.Schema({
  name: String,
  enabled: Boolean,
  lastModified: Date,
});

const FeatureFlag = mongoose.model("FeatureFlag", FeatureFlagSchema);

const Features = {
  TRANSCRIPTION: "transcription",
  MESSAGE_SCHEDULER: "messageScheduler",
  VAULT: "vault",
};

async function isFeatureEnabled(featureName) {
  const feature = await FeatureFlag.findOne({ name: featureName });
  return feature ? feature.enabled : false;
}

async function toggleFeature(featureName, enabled) {
  await FeatureFlag.findOneAndUpdate(
    { name: featureName },
    { enabled, lastModified: new Date() },
    { upsert: true },
  );
}

async function initializeFeatureFlags() {
  for (const feature of Object.values(Features)) {
    const existing = await FeatureFlag.findOne({ name: feature });
    if (!existing) {
      await FeatureFlag.create({
        name: feature,
        enabled: true,
        lastModified: new Date(),
      });
      console.log(`Feature ${feature} initialized as enabled`);
    }
  }
  console.log("All features initialized");
}

module.exports = {
  Features,
  isFeatureEnabled,
  toggleFeature,
  initializeFeatureFlags,
};
