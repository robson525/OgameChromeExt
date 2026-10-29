const resourcesEnergy = parseInt(jQuery("#top #resourcesbarcomponent #resources_energy").html());

async function checkSolarPlant() {
    if(resourcesEnergy < 0) {
        console.log(getTime(), 'Energy resources are negative. Upgrading solar plant...');
        const solarPlant = getTechnology("solarPlant");

        if(isTechnologyUpgradeable(solarPlant)) {
            upgradeTechnology(solarPlant);
            reloadPage(60);
            return true;
        }
        console.log(getTime(), 'Solar plant is not upgradeable.');
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

async function main() {

    if(!ogameExtConfig.updateSupplies){
        console.log(getTime(), 'Update supplies is disabled.');
        return;
    }

    if(!(await isCurrentPlanetInUpgradeList())) {
        return;
    }

    if(await checkSolarPlant()) {
        return;
    }

    const metalMine = getTechnology("metalMine");
    const metalStorage = getTechnology("metalStorage");
    const crystalMine = getTechnology("crystalMine");
    const crystalStorage = getTechnology("crystalStorage");
    const deuteriumSynthesizer = getTechnology("deuteriumSynthesizer");
    const deuteriumStorage = getTechnology("deuteriumStorage");

    const metalMineLevel = getTechnologyLevel(metalMine);
    const crystalMineLevel = getTechnologyLevel(crystalMine);
    const deuteriumSynthesizerLevel = getTechnologyLevel(deuteriumSynthesizer);

    if(metalMineLevel <= crystalMineLevel && isTechnologyUpgradeable(metalMine)) {
        await upgradeTechnology(metalMine);
    } else if(isTechnologyUpgradeable(crystalMine)) {
        await upgradeTechnology(crystalMine);
    } else if(isTechnologyUpgradeable(deuteriumSynthesizer)) {
        await upgradeTechnology(deuteriumSynthesizer);
    } else if(isTechnologyUpgradeable(metalStorage)) {
        await upgradeTechnology(metalStorage);
    } else if(isTechnologyUpgradeable(crystalStorage)) {
        await upgradeTechnology(crystalStorage);
    } else if(isTechnologyUpgradeable(deuteriumStorage)) {
        await upgradeTechnology(deuteriumStorage);
    } else {
        console.log(getTime(), 'No technology is upgradeable.');        
        const upgradeablePlanets = await getPlanetsUpgradeable(".icon_wrench");        
        if(upgradeablePlanets.length > 0) {
            await goToTheNextUpgradeablePlanet(upgradeablePlanets);
        }
        else {
            console.log(getTime(), 'No upgradeable planets found.');
        }        
        await reloadPage(60 * 10);
    }
}