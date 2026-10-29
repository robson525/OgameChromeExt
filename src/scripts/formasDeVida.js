async function updateLifeForm() {

    const technologies = jQuery("#technologies li.technology");
    if(technologies.length < 0) {
        console.log(getTime(), 'No technologies found.');
        return;
    }

    const mainHouse = technologies[0];
    const foodFactory = technologies[1];

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
    
    if(ogameExtConfig.updateLifeForm) {
        console.log(getTime(), 'updateLifeForm is enabled. Proceeding...');
        await updateLifeForm();
    } else {
        console.log(getTime(), 'updateLifeForm is disabled.');
    }

    await reloadPage(60 * 60);
}