
async function main() {

    await delay(5000);

    if(!(ogameExtConfig.autoLogin)) {
        console.log(getTime(), 'autoLogin is disabled. Skipping...');
        return;
    }
    
    console.log(getTime(), 'autoLogin is enabled. Proceeding...');

    console.log(getTime(), jQuery("#content #hub #joinGame button"));

    jQuery("#content #hub #joinGame button").each((index, button) => {
        if(button.innerText.includes("última vez")) {
            console.log(getTime(), 'Clicking the "Entrar" button...');
            button.click();
            logged = true;
        }
    });
}

main();