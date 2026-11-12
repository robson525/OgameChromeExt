const STORAGE_CONFIGS_BASE = "ogame.galaxy.ogameExtConfig";
var STORAGE_CONFIGS_ID = STORAGE_CONFIGS_BASE;
var universeId = null;
var universeName = null;

const ogameLoginConfig = {};
const ogameExtConfig = {};

const configForm = document.getElementById("configForm");

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const currentView = urlParams.get("component");

async function saveAutoLogin() {
  console.log("Saving autoLogin setting", configForm.autoLogin.checked);
  if(ogameLoginConfig.autoLogin === undefined) {
    ogameLoginConfig.autoLogin = [];
  }
  if(configForm.autoLogin.checked) {
    if(!(ogameLoginConfig.autoLogin.includes(universeName))) {
      ogameLoginConfig.autoLogin.push(universeName);
    }
  } else {
    const index = ogameLoginConfig.autoLogin.indexOf(universeName);
    if(index > -1) {
      ogameLoginConfig.autoLogin.splice(index, 1);
    }
  }
  await chrome.storage.local.set({ [STORAGE_CONFIGS_BASE]: ogameLoginConfig });
}

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

async function saveSendResources(newSendResources) {
  ogameExtConfig.sendResources = newSendResources;
  await chrome.storage.local.set({ [STORAGE_CONFIGS_ID]: { ...ogameExtConfig, sendResources: newSendResources } });
}

async function sendResources() {
  console.log("Sending resources...");

  saveSendResources({ enabled: true });
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const newUrl = new URL(tab.url).origin + "/game/index.php?page=ingame&component=fleetdispatch";
  await chrome.tabs.create({ url: newUrl });
}


async function saveSpy(newSpy) {
  ogameExtConfig.spy = newSpy;
  await chrome.storage.local.set({ [STORAGE_CONFIGS_ID]: { ...ogameExtConfig, spy: newSpy } });
}
async function saveAttack(newAttack) {
  ogameExtConfig.attack = newAttack;
  await chrome.storage.local.set({ [STORAGE_CONFIGS_ID]: { ...ogameExtConfig, attack: newAttack } });
}
async function saveSpyAndAttack(newSpyAndAttack) {
  ogameExtConfig.spyAndAttack = newSpyAndAttack;
  await chrome.storage.local.set({ [STORAGE_CONFIGS_ID]: { ...ogameExtConfig, spyAndAttack: newSpyAndAttack } });
}

async function spyAndAttack() {
  console.log("Espionage and Attacking...");
  ogameExtConfig.attack = { enabled: false };
  saveAttack({ enabled: false });
  saveSpy({ enabled: true });
  saveSpyAndAttack(true);
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const newUrl = new URL(tab.url).origin + "/game/index.php?page=ingame&component=galaxy";
  await chrome.tabs.create({ url: newUrl });

  const data = await chrome.storage.local.get([STORAGE_CONFIGS_ID]);
  console.log("Spy and Attack sequence initiated.", ogameExtConfig, data[STORAGE_CONFIGS_ID]);
}

async function loadForm() {
  console.log("Loading form...");

  configForm.autoLogin.addEventListener("change", saveAutoLogin);
  configForm.autoLogin.checked = ogameLoginConfig.autoLogin?.includes(universeName) || false;
  
  configForm.findArtifacts.addEventListener("change", saveFindArtifacts);
  configForm.findArtifacts.checked = ogameExtConfig.findArtifacts || false;

  configForm.updateSupplies.addEventListener("change", saveUpdateSupplies);
  configForm.updateSupplies.checked = ogameExtConfig.updateSupplies || false;

  configForm.updateRoboticsFactory.addEventListener("change", saveUpdateRoboticsFactory);
  configForm.updateRoboticsFactory.checked = ogameExtConfig.updateRoboticsFactory || false;

  configForm.updateLifeForm.addEventListener("change", saveUpdateLifeForm);
  configForm.updateLifeForm.checked = ogameExtConfig.updateLifeForm || false;

  configForm.btnSendResources.addEventListener("click", sendResources);
  configForm.btnSpyAttack.addEventListener("click", spyAndAttack);
}

async function loadConfigs() {
  const tabs = await chrome.tabs;
  var url;
  if(tabs) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    var disableConfigForm = false;
    if(URL.canParse(tab.url)){
      url = new URL(tab.url);
      if(!url.hostname.includes("ogame") || url.hostname.includes("lobby")) {        
        disableConfigForm = true;     
      }
    } else {
      disableConfigForm = true;
    }

    if(disableConfigForm) {
      console.log("Not a Valid Ogame TAB");
      configForm.hidden = true;
      return;
    }

    console.log("Current TAB:", tab);
    universeName = tab.title.trim();
  } else {
      url = new URL (window.location.href);
      universeName = document.title.trim();
  }

  universeId = url.hostname.split('.')[0];
  STORAGE_CONFIGS_ID += "." + universeId;

  console.log("Current Universe:", universeName, universeId);

  console.log("Loading ogameExtConfig...");
  const data = await chrome.storage.local.get([STORAGE_CONFIGS_ID]);
  Object.assign(ogameExtConfig, data[STORAGE_CONFIGS_ID]);

  const loginData = await chrome.storage.local.get([STORAGE_CONFIGS_BASE]);
  Object.assign(ogameLoginConfig, loginData[STORAGE_CONFIGS_BASE]);

  console.log("Loaded ogameExtConfig:", ogameExtConfig);
  if (configForm) {
    await loadForm();
  }

  if (typeof delay === "function") {
    await delay(500);
  }
  if (typeof main === "function") {
    await main();
  }
  if (typeof autoUpdate === "function") {
    await autoUpdate();
  }
}

loadConfigs();