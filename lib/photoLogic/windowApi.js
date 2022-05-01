
function fillCanvas(img) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const ctx2 = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    ctx.drawImage(img, 0, 0, img.width,    img.height,     // source rectangle
        0, 0, canvas.width, canvas.height); // destination rectangle);

    ctx.strokeStyle = 'rgba(225, 192, 209, 0.8)';
    ctx.lineWidth = 0.9;

    ctx2.moveTo(0, 400);
    ctx2.lineTo(600, 400);
    ctx2.stroke();

    ctx2.moveTo(0, 10);
    ctx2.lineTo(600, 10);
    ctx2.stroke();


    ctx2.moveTo(590, 0);
    ctx2.lineTo(590, 800);
    ctx2.stroke();

    ctx2.moveTo(10, 0);
    ctx2.lineTo(10, 800);
    ctx2.stroke();

    ctx2.moveTo(0, 790);
    ctx2.lineTo(600, 790);
    ctx2.stroke();

    ctx2.moveTo(300, 0);
    ctx2.lineTo(300, 800);
    ctx2.stroke();
}

window.api.receive('showPhoto', data => {
    const img = new Image();
    img.src = 'data:image/png;base64, ' + data.src;

    img.onload = function() {
        fillCanvas(img);
    };


    const filePath = document.getElementById('file-path');
    if (filePath) {
        document.getElementById('file-path').innerHTML = data.filePath;
        return;
    }
    const h1 = document.createElement('h2');
    h1.id = 'file-path';
    const t = document.createTextNode('File path: ' + data.filePath);
    h1.appendChild(t);
    const block = document.getElementById('file-path');
    block.appendChild(h1);

});

window.api.receive('updatePhoto', data => {
    const img = new Image();
    img.src = 'data:image/png;base64, ' + data.src;

    img.onload = function() {
        fillCanvas(img);
    };

    fillCanvas(img);
});
