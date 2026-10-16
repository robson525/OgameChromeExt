async function updateLifeForm() {
    const mainHouse = getTechnology("lifeformTech11101");
    const foodFactory = getTechnology("lifeformTech11102");

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