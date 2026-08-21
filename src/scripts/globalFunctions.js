const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const getTime = () => {
    var now = new Date();
    return now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
};

async function reloadPage(seconds) {
    console.log(getTime(),  'Reloading the page in ' + seconds + ' seconds ...');
    await delay(1000 * seconds);
    console.log(getTime(),  'Reloading the page ...');
    window.location.reload();
}