
function drawGrid(canvas, ctx, img, x, y, scaleW, scaleH) {
    // drawing vertical lines
    let coordinates = [scaleW * (0.5 / 100) + x, scaleW * (99.5 / 100) + x, canvas.width * (50 / 100)];
    ctx.strokeStyle = 'rgba(225, 192, 209, 0.8)';
    ctx.lineWidth = 0.9;
    ctx.beginPath();

    for (const coordinate of coordinates) {
        ctx.moveTo(coordinate, y);
        ctx.lineTo(coordinate, y + scaleH);
        ctx.stroke();
    }

    // draw horizontal lines
    coordinates = [scaleH * (0.5 / 100) + y, scaleH * (99.5 / 100) + y, canvas.height * (50 / 100)];
    for (const coordinate of coordinates) {
        ctx.moveTo(x, coordinate);
        ctx.lineTo(x + scaleW, coordinate);
        ctx.stroke();
    }
}


function fillCanvas(img) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // scale image to fit canvas
    const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
    const x = (canvas.width / 2) - (img.width / 2) * scale;
    const y = (canvas.height / 2) - (img.height / 2) * scale;
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

    drawGrid(canvas, ctx, img, x, y, img.width * scale, img.height * scale);
}



window.api.receive('showPhoto', data => {
    const img = new Image();
    const ext = data.fileName.split('.').pop();
    img.src = `data:image/${ext};base64, ` + data.src;

    img.onload = function() {
        fillCanvas(img);
    };


    const filePath = document.getElementById('file-path');
    if (filePath) {
        document.getElementById('file-path').innerHTML = 'File path: ' + data.filePath;
        return;
    }
    const h1 = document.createElement('h1');
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

});
