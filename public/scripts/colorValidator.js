let agregarColor = document.getElementById('agregar')

agregarColor.addEventListener('click', function () {
    let inputCount = document.querySelectorAll('input[type="color"]').length
    let input = `<div><input class="c${inputCount? inputCount : 0}" type="color" name="color" id="color"/><span id="c${inputCount? inputCount : 0}"></span></div>`;

    const container = document.getElementsByClassName('container-colorinputs')[0];
    if (inputCount < 3) {
        container.insertAdjacentHTML("afterbegin", input);
        input = document.querySelector(`input[class="c${inputCount? inputCount : 0}"]`)
        input.addEventListener("change", () => {
            let spanColor = document.querySelector(`span#${input.className}`)
            var match = ntc.name(input.value)
            spanColor.innerHTML = match[1]
            spanColor.style = `color:${match[0]}`
            input.value = match[0]
        })
    }
})

let ColorsError = document.querySelectorAll('input[type="color"]')

ColorsError.forEach((c) => {
    c.addEventListener("change", () => {
        let spanColor = document.querySelector(`span#${c.className}`)
        var match = ntc.name(c.value);
        spanColor.innerHTML = match[1];
        spanColor.style = `color:${match[0]}`;
        c.value = match[0];
    })
})

let inputFile = document.querySelector('input[type="file"]')

inputFile.addEventListener("change", (e) => {
    for (let i = 0; i < inputFile.files.length; i++) {
        let image = `<br/><span>${inputFile.files[i].name}, ${(inputFile.files[i].size/1024).toFixed(2)}KB</span>`;
        inputFile.insertAdjacentHTML("beforebegin", image);
    }
})
