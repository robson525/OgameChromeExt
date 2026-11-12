const resourcesEnergy = parseInt(jQuery("#top #resourcesbarcomponent #resources_energy").html());

async function checkSolarPlant() {
    if(resourcesEnergy < 0) {
        console.log(getTime(), 'Energy resources are negative.');
        if(!autoUpdateList.includes("Planta de Energia Solar")) {
            console.log(getTime(), 'Solar plant is not in the auto-update list.');
            return false;
        }

        const solarPlant = getTechnology("solarPlant");

        if(isTechnologyUpgradeable(solarPlant)) {
            upgradeTechnology(solarPlant);
        }
        console.log(getTime(), 'Solar plant is not upgradeable.');
        await reloadPage(60 * 5);
        return true;
    }
    return false;
}

async function goToTheNextUpgradeablePlanet(upgradeablePlanets) {
    const planetsNames = await getPlanetsNames();
    const currentPlanet = await getHightlightPlanetName();
    const currentPlanetIndex = planetsNames.indexOf(currentPlanet);

    for(let i = currentPlanetIndex + 1; i < planetsNames.length; i++) {
        if(upgradeablePlanets.includes(planetsNames[i])) {
            await delay(5000);
            await goToPlanet(planetsNames[i]);
            return;
        }
    }
    if(currentPlanet != upgradeablePlanets[0]) {
        await delay(5000);
        await goToPlanet(upgradeablePlanets[0]);
    } else {
        console.log(getTime(), 'No upgradeable planets to navigate to.');
    }
}

async function checkAutoUpdateView() {

    if(!autoUpdateList || autoUpdateList.length == 0) {
        console.log(getTime(), 'Update supplies is disabled.', autoUpdateList);
        return;
    }

    if(await checkSolarPlant()) {
        return;
    }

    const metalMine = await getTechnologyObjByClass("metalMine");
    const metalStorage = await getTechnologyObjByClass("metalStorage");
    const crystalMine = await getTechnologyObjByClass("crystalMine");
    const crystalStorage = await getTechnologyObjByClass("crystalStorage");
    const deuteriumSynthesizer = await getTechnologyObjByClass("deuteriumSynthesizer");
    const deuteriumStorage = await getTechnologyObjByClass("deuteriumStorage");

    if(metalMine.level <= (crystalMine.level + 2) && metalMine.isUpgradeable) {
        await upgradeTechnology(metalMine.technology);
    } else if(crystalMine.level <= (deuteriumSynthesizer.level + 3) && crystalMine.isUpgradeable) {
        await upgradeTechnology(crystalMine.technology);
    } else if(deuteriumSynthesizer.level < crystalMine.level && deuteriumSynthesizer.isUpgradeable) {
        await upgradeTechnology(deuteriumSynthesizer.technology);
    } else if(metalStorage.isUpgradeable) {
        await upgradeTechnology(metalStorage.technology);
    } else if(crystalStorage.isUpgradeable) {
        await upgradeTechnology(crystalStorage.technology);
    } else if(deuteriumStorage.isUpgradeable) {
        await upgradeTechnology(deuteriumStorage.technology);
    } else {
        console.log(getTime(), 'No technology is upgradeable.');        
        const upgradeablePlanets = await getPlanetsUpgradeable(".icon_wrench");        
        if(upgradeablePlanets.length > 0) {
            await goToTheNextUpgradeablePlanet(upgradeablePlanets);
        }
        else {
            console.log(getTime(), 'No upgradeable planets found.');
        }        
        await reloadPage(60);
    }
}