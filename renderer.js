/* eslint-disable no-unused-vars*/

document.getElementById('openFile').addEventListener('click', e => {
    window.image.uploadFile();
});


document.getElementById('rotateLeft').addEventListener('click', e => {
    window.image.rotateLeft();
});


document.getElementById('rotateRight').addEventListener('click', e => {
    window.image.rotateRight();
});

