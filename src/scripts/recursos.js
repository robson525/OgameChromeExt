const resourcesEnergy = parseInt(jQuery("#top #resourcesbarcomponent #resources_energy").html());

function getTechnology(technology) {
    return jQuery("#suppliescomponent #technologies li.technology." + technology);
}
function getTechnologyLevel(technology) {
    return parseInt(jQuery(technology).find("span.level span.stockAmount").html().trim());
}

function isTechnologyUpgradeable(technology) {
    return jQuery(technology).attr("data-status") == "on"
}

async function upgradeTechnology(technology) {
     jQuery(technology).find("button.upgrade")[0].click();
}

async function checkSolarPlant() {
    if(resourcesEnergy < 0) {
        console.log(getTime(), 'Energy resources are negative. Upgrading solar plant...');
        const solarPlant = getTechnology("solarPlant");
        upgradeTechnology(solarPlant);
        //reloadPage(60);
        return true;
    }
    return false;
}

async function main() {

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
    } else if(crystalMineLevel <= deuteriumSynthesizerLevel && isTechnologyUpgradeable(crystalMine)) {
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
        await reloadPage(60 * 60);
    }
}

main();