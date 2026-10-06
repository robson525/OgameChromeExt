var STORAGE_CONFIGS_ID = "ogame.galaxy.ogameExtConfig";

const ogameExtConfig = {};

const configForm = document.getElementById("configForm");

async function saveFindArtifacts() {
  console.log("Saving findArtifacts setting", configForm.findArtifacts.checked);
  await chrome.storage.local.set({ [STORAGE_CONFIGS_ID]: { ...ogameExtConfig, findArtifacts: configForm.findArtifacts.checked } });
}

async function saveUpdateSupplies() {
  console.log("Saving updateSupplies setting", configForm.updateSupplies.checked);
  await chrome.storage.local.set({ [STORAGE_CONFIGS_ID]: { ...ogameExtConfig, updateSupplies: configForm.updateSupplies.checked } });
}

async function saveUpdateRoboticsFactory() {
  console.log("Saving updateRoboticsFactory setting", configForm.updateRoboticsFactory.checked);
  await chrome.storage.local.set({ [STORAGE_CONFIGS_ID]: { ...ogameExtConfig, updateRoboticsFactory: configForm.updateRoboticsFactory.checked } });
}

async function saveUpdateLifeForm() {
  console.log("Saving updateLifeForm setting", configForm.updateLifeForm.checked);
  await chrome.storage.local.set({ [STORAGE_CONFIGS_ID]: { ...ogameExtConfig, updateLifeForm: configForm.updateLifeForm.checked } });
}

async function saveAutoLogin() {
  console.log("Saving autoLogin setting", configForm.autoLogin.checked);
  await chrome.storage.local.set({ [STORAGE_CONFIGS_ID]: { ...ogameExtConfig, autoLogin: configForm.autoLogin.checked } });
}

async function loadForm() {
  console.log("Loading form...");
  
  configForm.findArtifacts.addEventListener("change", saveFindArtifacts);
  configForm.findArtifacts.checked = ogameExtConfig.findArtifacts || false;

  configForm.updateSupplies.addEventListener("change", saveUpdateSupplies);
  configForm.updateSupplies.checked = ogameExtConfig.updateSupplies || false;

  configForm.updateRoboticsFactory.addEventListener("change", saveUpdateRoboticsFactory);
  configForm.updateRoboticsFactory.checked = ogameExtConfig.updateRoboticsFactory || false;

  configForm.updateLifeForm.addEventListener("change", saveUpdateLifeForm);
  configForm.updateLifeForm.checked = ogameExtConfig.updateLifeForm || false;
  
  configForm.autoLogin.addEventListener("change", saveAutoLogin);
  configForm.autoLogin.checked = ogameExtConfig.autoLogin || false;
}

async function loadConfigs() {
  const tabs = await chrome.tabs;
  var url;
  if(tabs) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    var disableConfigForm = false;
    if(URL.canParse(tab.url)){
      url = new URL(tab.url);
      if(!url.hostname.includes("ogame")) {        
        disableConfigForm = true;     
      }
    } else {
      disableConfigForm = true;
    }

    if(disableConfigForm) {
      console.log("Not an Ogame TAB");
      configForm.hidden = true;
      return;
    }
  } else {
      url = new URL (window.location.href);
  }
  const universe = url.hostname.split('.')[0];
  STORAGE_CONFIGS_ID += "." + universe;

  console.log("Loading ogameExtConfig...");
  const data = await chrome.storage.local.get([STORAGE_CONFIGS_ID]);
  Object.assign(ogameExtConfig, data[STORAGE_CONFIGS_ID]);

  console.log("Loaded ogameExtConfig:", ogameExtConfig);
  if (configForm) {
    await loadForm();
  }  
}

loadConfigs();