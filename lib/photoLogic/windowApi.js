window.api.receive('showPhoto', (data) => {
    const imageExists = document.getElementById('photo')
    if (imageExists){
        imageExists.src = 'data:image/png;base64, ' + data.src;

        document.getElementById('file-path').innerHTML = data.filePath;
        return;
    }
    let img = document.createElement("img");
    img.id = 'photo'
    img.width = 600
    img.height = 800
    img.src = 'data:image/png;base64, ' + data.src;
    const block = document.getElementById("x");
    block.appendChild(img);
    const h1 = document.createElement('h2');
    h1.id = 'file-path'
    let t = document.createTextNode("File path: " + data.filePath);
    h1.appendChild(t);
    block.appendChild(h1);


})

window.api.receive('updatePhoto', (data) => {
    console.log(data)
    var image = document.getElementById("photo");
    image.src = 'data:image/png;base64, ' + data.src;
})
