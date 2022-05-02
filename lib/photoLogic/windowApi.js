function drawGrid(canvas, ctx) {
    // drawing vertical lines
    let coordinates = [canvas.width * (0.5 / 100), canvas.width * (99.5 / 100), canvas.width * (50 / 100)];
    ctx.strokeStyle = 'rgba(225, 192, 209, 0.8)';
    ctx.lineWidth = 0.9;

    for (const coordinate of coordinates) {
        ctx.moveTo(coordinate, 0);
        ctx.lineTo(coordinate, canvas.height);
        ctx.stroke();
    }

    // drawing vertical lines
    coordinates = [canvas.height * (0.5 / 100), canvas.height * (99.5 / 100), canvas.height * (50 / 100)];
    for (const coordinate of coordinates) {
        ctx.moveTo(0, coordinate);
        ctx.lineTo(canvas.width, coordinate);
        ctx.stroke();
    }
}


function fillCanvas(img) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
    // get the top left position of the image
    const x = (canvas.width / 2) - (img.width / 2) * scale;
    const y = (canvas.height / 2) - (img.height / 2) * scale;
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

    drawGrid(canvas, ctx);
}

window.api.receive('showPhoto', data => {
    const img = new Image();
    img.src = 'data:image/png;base64, ' + data.src;

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

    fillCanvas(img);
});
