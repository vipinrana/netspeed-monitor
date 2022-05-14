let downloadElement = document.getElementsByClassName('download-content');
let uploadElement = document.getElementsByClassName('upload-content');
const { networkStats, ipcRenderer } = window.electronAPI;

// change the downloading and uploading speed on setInterval
setInterval(function () {
    networkStats().then(data => {
        let networkContent = convertToOtherMeasure(data[0].rx_sec, data[0].tx_sec);
        downloadElement[0].textContent = networkContent.downloadContent;
        uploadElement[0].textContent = networkContent.uploadContent;
    })
}, 1000);

function convertToOtherMeasure(dowloadSpeed, uploadSpeed) {

    let downloadSpeedInKb = +(dowloadSpeed / 1000).toFixed(2);
    let uploadSpeedInKb = +(uploadSpeed / 1000).toFixed(2);
    let downloadContent = `${downloadSpeedInKb} kb/s`;
    let uploadContent = `${uploadSpeedInKb} kb/s`;
    if (downloadSpeedInKb > 999) {
        downloadContent = `${(downloadSpeedInKb / 1000).toFixed(2)} mb/s`;
    }

    if (uploadSpeedInKb > 999) {
        uploadContent = `${(uploadSpeedInKb / 1000).toFixed(2)} mb/s`;
    }
    return {
        downloadContent,
        uploadContent
    };
}

window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    window.electronAPI.ipcRenderer.send('show-context-menu');

});