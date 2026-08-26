const STORAGE_CONFIGS_ID = "ogame.galaxy.ogameExtConfig";

const ogameExtConfig = {};

const configForm = document.getElementById("configForm");

async function saveFindArtifacts() {
  console.log("Saving findArtifacts setting", configForm.findArtifacts.checked);
  await chrome.storage.local.set({ [STORAGE_CONFIGS_ID]: { ...ogameExtConfig, findArtifacts: configForm.findArtifacts.checked } });
}

async function saveUpdateRoboticsFactory() {
  console.log("Saving updateRoboticsFactory setting", configForm.updateRoboticsFactory.checked);
  await chrome.storage.local.set({ [STORAGE_CONFIGS_ID]: { ...ogameExtConfig, updateRoboticsFactory: configForm.updateRoboticsFactory.checked } });
}

async function saveUpdateLifeForm() {
  console.log("Saving updateLifeForm setting", configForm.updateLifeForm.checked);
  await chrome.storage.local.set({ [STORAGE_CONFIGS_ID]: { ...ogameExtConfig, updateLifeForm: configForm.updateLifeForm.checked } });
}

async function loadForm() {
  console.log("Loading form...");
  
  configForm.findArtifacts.addEventListener("change", saveFindArtifacts);
  configForm.findArtifacts.checked = ogameExtConfig.findArtifacts || false;

  configForm.updateRoboticsFactory.addEventListener("change", saveUpdateRoboticsFactory);
  configForm.updateRoboticsFactory.checked = ogameExtConfig.updateRoboticsFactory || false;

  configForm.updateLifeForm.addEventListener("change", saveUpdateLifeForm);
  configForm.updateLifeForm.checked = ogameExtConfig.updateLifeForm || false;
}

async function loadConfigs() {
  console.log("Loading ogameExtConfig...");
  const data = await chrome.storage.local.get([STORAGE_CONFIGS_ID]);
  Object.assign(ogameExtConfig, data[STORAGE_CONFIGS_ID]);

  console.log("Loaded ogameExtConfig:", ogameExtConfig);
  if (configForm) {
    await loadForm();
  }  
}

loadConfigs();