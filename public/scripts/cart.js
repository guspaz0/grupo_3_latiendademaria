
const cartascart = document.querySelectorAll(".cartascart")

let productosCarrito = []
const body = document.querySelector("body")


cartascart.forEach((e) => {
   
    //obtener id productos y del color
    const ids = e.id.split("-")
    const idProducto = parseInt(ids[1])
    const idColor = parseInt(ids[2])
    const sumar = document.querySelector(`#${e.id} #sumar`)
    const restar = document.querySelector(`#${e.id} #restar`)
    const priceIndividual = parseFloat(document.querySelector(`#${e.id} #precio`).textContent)
    const subTotal = document.querySelector(`#${e.id} #subtotalproduct`) 
    const count = document.querySelector(`#${e.id} #cantidad`).value
    const totalCompleto = document.querySelector("#subtotalfinal")
    const stock = document.querySelector(`#${e.id} #tdcolors`)
    const stockValue = document.querySelector(`#${e.id} #tdcolors`).textContent.split(" ")[1]
    
    
     let producto = {
        product_id: idProducto,
        precio: priceIndividual,
        color_id: idColor,
        cantidad: parseInt(count)
    };

    productosCarrito.push(producto)

   
  
    if(parseInt(count) == 1){
        restar.disabled = true
    }

    if(parseInt(count) == parseInt(stockValue)){
        sumar.disabled = true
        stock.style.color = "red"
    }

    sumar.addEventListener("click", () => {
        console.log("ingresa suma")
        const cantidad = document.querySelector(`#${e.id} #cantidad`).value
        const precioindividual = parseFloat(document.querySelector(`#${e.id} #precio`).textContent)
        let subTotalSuma = parseFloat(subTotal.textContent) + precioindividual 
        subTotal.textContent = subTotalSuma.toFixed(2)
        
        if(cantidad > 1){
            restar.disabled = false
        }

        
        const cantidadfinal = parseInt(document.querySelector(`#cantidadTotal`).textContent)
        const sumacantidad = cantidadfinal + 1
        document.querySelector(`#cantidadTotal`).textContent = sumacantidad
        

        const precioFinal = parseFloat(document.querySelector("#precioSubTotal").textContent)
        const sumaPrecioFinal = precioFinal + precioindividual
        document.querySelector("#precioSubTotal").textContent = sumaPrecioFinal.toFixed(2)
        totalCompleto.textContent = sumaPrecioFinal.toFixed(2)

        if(cantidad == stockValue){
            sumar.disabled = true;
            stock.style.color = "red"
        }

        productosCarrito.forEach(element =>{
            element.color_id == idColor ? element.cantidad = parseInt(cantidad) : "";
        })
        
    })
    
    restar.addEventListener("click", (element) => {
        console.log("ingresa resta")
        const cantidad = document.querySelector(`#${e.id} #cantidad`).value
        const precioindividual = parseFloat(document.querySelector(`#${e.id} #precio`).textContent)
        let subTotalresta = parseFloat(subTotal.textContent) - precioindividual 
        subTotal.textContent = subTotalresta.toFixed(2) 
        
        if(parseInt(cantidad) == 1){
            restar.disabled = true
        }

        const cantidadfinal = parseInt(document.querySelector(`#cantidadTotal`).textContent)
        const sumacantidad = cantidadfinal - 1
        document.querySelector(`#cantidadTotal`).textContent = sumacantidad

        const precioFinal = parseFloat(document.querySelector("#precioSubTotal").textContent)
        const restaPrecioFinal = precioFinal - precioindividual
        document.querySelector("#precioSubTotal").textContent = restaPrecioFinal.toFixed(2)
        totalCompleto.textContent = restaPrecioFinal.toFixed(2)

        if(parseInt(cantidad) < parseInt(stockValue)){
            sumar.disabled = false;
            stock.style.color = "black"
        }

        productosCarrito.forEach(element =>{
            element.color_id == idColor ? element.cantidad = parseInt(cantidad) : "";
        })

    })
 
})


function eliminarProducto(id, color) {
    const popup = document.createElement('span');
    popup.classList.add('popupscreen');
    popup.innerHTML = `
        <div class="popUps" id="popUpDetailLogin">
            <h3>¿Estás seguro de que deseas eliminar este producto del carrito?</h3>
            <div class="botonPopup">
                <a onclick="deleted('${id}','${color}')">Aceptar</a>
                <a onclick="popUpoOff()">Cancelar</a>
            </div>  
        </div>
    `;
    body.appendChild(popup);
}


 

function deleted(id, color){ 
    const totals = document.querySelector("#precioSubTotal").textContent
  
        fetch(`/users/cart/${id}`, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                color: color
            })
        })
        .then(response => {

            if (!response.ok) {
                throw new Error(`Error al eliminar el producto: ${response.status}`);
            }
            console.log("Response", response.status)
            if(response.status === 201){
            
               const productRow = document.getElementById(`product-${id}-${color}`);
               const subTotal = document.querySelector(`#product-${id}-${color} #subtotalproduct`).textContent
               const cantidad = document.querySelector(`#product-${id}-${color} #cantidad`).value
               const total = document.querySelector("#precioSubTotal")
               const cantidadTotal = document.querySelector("#cantidadTotal")
               const totalesCompleto = document.querySelector("#subtotalfinal")
            
               if (productRow) {
                   productRow.remove();
                   const newTotal = parseFloat(total.textContent) - parseFloat(subTotal);
                   total.textContent = newTotal.toFixed(2);
                   totalesCompleto.textContent = newTotal.toFixed(2);
                   cantidadTotal.textContent -= cantidad;
                   
                   productosCarrito = productosCarrito.filter((element)=>{
                   
                    return element.product_id !== parseInt(id) || element.color_id !== parseInt(color);

                   })
                   popUpoOff()
               }
            }
        })
        .catch(error => {
            console.error('Error al eliminar el producto:', error);
        });
    }




function finalizarCompra(id){
    const envio = document.querySelector('#calcularEnvio input:checked').value

    let carrito = {
        idUser: parseInt(id), 
        products: productosCarrito,
        envio: envio == "true" ? true : false,
        status: "enproceso"
    }

}

function popUpoOff(){
    
    const elementosPopup = document.querySelector('.popupscreen');
    
    body.removeChild(elementosPopup);
    
}