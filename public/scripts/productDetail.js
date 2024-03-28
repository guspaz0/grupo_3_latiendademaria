const host = window.location.host
window.onload = () => {
    const id = document.querySelector("input[name='id']")
    const FavoriteIcon = document.querySelector('#heart')
    const cantidad = document.querySelector("input[type=number]")
    const precio = document.querySelector(".precio")
    const price = precio.textContent.split("$")[1];
    const sumar = document.querySelector("#sumar")
    const restar = document.querySelector("#restar")
    const errorStock = document.querySelector("#error-stock")
    const checked = document.querySelectorAll(".color input")
    const coloresStock = document.querySelectorAll(".stockcolores")


    checked.forEach(element =>{
    element.addEventListener("input", (e)=>{
        const stockValue = document.querySelector(`#${e.target.id}-stock`).textContent.split(": ")
        const stockValueNumber = stockValue[1]

            if(parseInt(cantidad.value) <= parseInt(stockValueNumber)){    
            errorStock.style.display = "none"
            }else{
                errorStock.style.display = "block"  
            }
            
    }) })

    if(coloresStock){
        let stocktotal = 0;
         coloresStock.forEach(element => {
            let numero = element.textContent.split(": ")[1]
            stocktotal = parseInt(stocktotal) + parseInt(numero)
        });
        document.querySelector("h4").textContent += stocktotal;
    }

    FavoriteIcon.addEventListener('click', async (e) => {
        const data = await fetchData(`/api/user/favorites`, {product: id.value})
        if (data.success) {
            FavoriteIcon.firstChild.nextSibling.classList.toggle('unheart')
        }
    })


    cantidad.addEventListener("input",(e)=>{
        const colorName = document.querySelector(".color input:checked").id;
        const stockValue = document.querySelector(`#${colorName}-stock`).textContent.split(": ")
        const stockValueNumber = stockValue[1]
        
        if(e.data == null){
            precio.textContent = "$0"
            errorStock.style.display = "none"
        }
        else{
            if(parseInt(cantidad.value) <= parseInt(stockValueNumber)){
                precio.textContent = `$${(parseFloat(price)*parseFloat(cantidad.value)).toFixed(2)}`
                errorStock.style.display = "none"
            }
            else{
                precio.textContent = `$${(parseFloat(price)*parseFloat(cantidad.value)).toFixed(2)}`
                errorStock.style.display = "block"
            }
            }
    })

    sumar.addEventListener("click",(e)=>{ 
        const colorName = document.querySelector(".color input:checked").id;
        const stockValue = document.querySelector(`#${colorName}-stock`).textContent.split(": ")
        const stockValueNumber = stockValue[1]
        if(parseInt(cantidad.value) <= parseInt(stockValueNumber)){
        precio.textContent = `$${(parseFloat(precio.textContent.split("$")[1]) + parseFloat(price)).toFixed(2)}`;
        cantidad.value = parseFloat(cantidad.value)
        errorStock.style.display = "none"
        }else{
            precio.textContent = `$${(parseFloat(precio.textContent.split("$")[1]) + parseFloat(price)).toFixed(2)}`;
            cantidad.value = parseFloat(cantidad.value)
            errorStock.style.display = "block"
        }
        
    })

    restar.addEventListener("click",(e)=>{ 
        const colorName = document.querySelector(".color input:checked").id;
        const stockValue = document.querySelector(`#${colorName}-stock`).textContent.split(": ")
        const stockValueNumber = stockValue[1]

        if(cantidad.value != 1){
        if(parseInt(cantidad.value) <= parseInt(stockValueNumber)){    
        precio.textContent = `$${(parseFloat(precio.textContent.split("$")[1]) - parseFloat(price)).toFixed(2)}`;
        cantidad.value = parseFloat(cantidad.value)
        errorStock.style.display = "none"
        }else{
            precio.textContent = `$${(parseFloat(precio.textContent.split("$")[1]) - parseFloat(price)).toFixed(2)}`;
            cantidad.value = parseFloat(cantidad.value)
            errorStock.style.display = "block"  
        }
        }else{
            precio.textContent = `$${parseFloat(price)}`
            errorStock.style.display = "none"
        }


}) 
    


}

async function fetchData(endpoint, body) {
    try {
        const response = await fetch(`http://${host}${endpoint}`,{
            method: body? 'POST' : 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: body? JSON.stringify(body) : null
        });
        const data = await response.json();
        return data
    } catch (error) {
        alert(error.message)
    }
};


function redireccionarAlogin(){
    const response = confirm("Debe iniciar sesion para agregar el producto al carrito")
    if(response){
       window.location.href = "/users/login"
    } 
}

function addCart(id) {
const colorInput = document.querySelector(".color input:checked");
const cantidadInput = document.querySelector("#cantidad");
const errorStock1 = document.querySelector("#error-stock")
const count = document.querySelector("input[type=number]")
if(errorStock1.style.display == "none" && count.value > 0 && count.value != null){
if (!colorInput || !cantidadInput) {
console.error('No se encontraron elementos de entrada de color o cantidad');
return;
}
const color = colorInput.value;
const cantidad = cantidadInput.value;

fetch(`/users/cart/${id}`, {
    method: 'post',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        id: id,
        cantidad: cantidad,
        color: color
    })
})
.then(response => {
    if (response.status === 500) {
        throw new Error(`Error al agregar el producto: ${response.status}`);
    }else{
   return response.json()
}})
.then(respuesta => {

    if(respuesta.success){
      if(confirm(`${respuesta.message}, ¿Le gustaría ir al carrito?`)){
          window.location.href = "/cart"
      }

    }
    else{
        alert(respuesta.message)
    }
})
.catch(error => {
    console.error('Error al agregar el producto:', error);
});
}
}