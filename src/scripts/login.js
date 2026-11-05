
async function main() {

    await delay(5000);

    if(ogameLoginConfig.autoLogin === undefined || ogameLoginConfig.autoLogin.length === 0) {
        console.log(getTime(), 'autoLogin is disabled. Skipping...');
        return;
    }

    const loginButton = jQuery("#content #hub #joinGame button");
    console.log(getTime(), 'Found login button:', loginButton);
    if(loginButton.length > 0) {
        console.log(getTime(), 'Found login button. Clicking...');
        loginButton[0].click();
        await delay(500);
    }

    const myAccounts = jQuery("#content #dashboard #myAccounts .rt-tbody .rt-tr-group");

    if(myAccounts.length > 0) {
        for (let i = 0; i < myAccounts.length; i++) {
            const account = jQuery(myAccounts[i]);
            const universeName = account.find(".rt-td.server-name-cell div").html().trim();
            if(ogameLoginConfig.autoLogin.includes(universeName)) {
                console.log(getTime(), 'Found autoLogin universe:', universeName);
                account.find(".rt-td.action-cell button")[0].click();
                await delay(500);
            }
        }
    }
}