async function updateLifeForm() {
    const mainHouse = getTechnology("lifeformTech14101");
    const foodFactory = getTechnology("lifeformTech14102");

    const mainHouseLevel = getTechnologyLevel(mainHouse);
    const foodFactoryLevel = getTechnologyLevel(foodFactory );

    if(mainHouseLevel <= (foodFactoryLevel + 1) && isTechnologyUpgradeable(mainHouse)) {
        console.log(getTime(), 'Main House is upgradeable. Upgrading...');
        await upgradeTechnology(mainHouse);
        return;
    }
    
    if(isTechnologyUpgradeable(foodFactory)) {
        console.log(getTime(), 'Food Factory is upgradeable. Upgrading...');
        await upgradeTechnology(foodFactory);
        return;
    }
}

async function main() {

    await delay(500);

    if(!(await checkPlanetsUpgradeable())) {
        return;
    }
    
    if(ogameExtConfig.updateLifeForm) {
        console.log(getTime(), 'updateLifeForm is enabled. Proceeding...');
        await updateLifeForm();
    } else {
        console.log(getTime(), 'updateLifeForm is disabled.');
    }

    await reloadPage(60 * 60);
}

main();