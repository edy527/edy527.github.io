let cantidadDeSaludos = 0;
let saludo = document.getElementById('saludo')
let entrada = document.getElementById('entrada')
let btn = document.getElementById('btn')
let contenedor = document.getElementById('saludos') ;
let cantidades = document.getElementById('cantidades')

btn.addEventListener('click', function(){
    cantidadDeSaludos++
    let tipo = entrada.value
    let saludito = "Hola " +tipo+ ", Bienvenido!!!";
   

    var sal = document.createElement('h1')
    var txt = document.createTextNode(saludito)
    sal.appendChild(txt)
    contenedor.appendChild(sal)

    if(cantidadDeSaludos > 1){
        cantidades.innerHTML = "Saludamos a "+cantidadDeSaludos+' personas'
    }else{
        cantidades.innerHTML = "Saludamos a "+cantidadDeSaludos+' persona'
    }
    
    
entrada.value = "";
})