
const apiKey = "IGFWFQatQndSlWK9XNrMe7s6FTBKR15T"
const urlApi = "https://api.giphy.com/v1/gifs/"
const printImg = document.getElementById("print_img");
const inputBusqueda = document.getElementById("input_busqueda");
const botonGo = document.getElementById("button_get");
const listaBusqueda = document.getElementById("lista_busqueda");
// const botonBorrar= document.getElementById("button_borrar");

let primeraBusqueda = false;
let offset = 0;

const cargarTrending = async()=>{
    const data = await fetchDataTrending();
    const templates = data.map(img => makeFigure(img));
    printImg.append(...templates);
    mostrarBusquedas();
};

const fetchDataTrending = async ()=>{
    const res = await fetch(`${urlApi}trending?api_key=${apiKey}&limit=10&offset=${offset}`);
    const {data} = await res.json();
    offset += 10;
    return data;
};

const cargarSearch = async () =>{
    primeraBusqueda = true;
    const inputSearch = inputBusqueda.value
    if (inputSearch != ""){
        limpiarPrintImg(inputSearch);
        const data = await fetchDataSearch(inputSearch);
        if (data.length == 0){
            alert("Tu busqueda no dio resultados");
            printImg.innerHTML = "(Sin Resultados)"
        };
        const templates = data.map(img => makeFigure(img));
        printImg.append(...templates);
        grabarBusqueda(inputSearch);
        mostrarBusquedas();
    }
};

const fetchDataSearch = async (search)=>{
    const res = await fetch(`${urlApi}search?api_key=${apiKey}&limit=10&offset=${offset}&q=${search}`);
    const {data} = await res.json();
    offset += 10;
    return data;
};

const makeFigure = (element)=>{
    const img = document.createElement("img");
    img.src=element.images.original.url;
    img.alt=element.title;
    const figure = document.createElement("figure");
    figure.appendChild(img);
    figure.className = "main_explorer_container-img";
    return figure;
};

const onScroll = () => {
    if (window.scrollY + window.innerHeight >= (document.documentElement.scrollHeight-10)){
        if (primeraBusqueda){
            cargarSearch();
        }else{
            cargarTrending();
        }
    }
};

const existeBusqueda = (listas, input) =>{
    for (let lista of listas){
        if (lista == input){
            return true;
        }
    }
    return false;
};

const grabarBusqueda = (input) =>{
    let listas = [];
    if(localStorage.getItem("busquedas")){
        listas = JSON.parse(localStorage.getItem("busquedas"));
    }
    if (!existeBusqueda(listas, input)){
        listas.push(input);
    };
    if (listas.length > 3){
        listas.shift();
    }
    ultimaBusqueda(input);
    localStorage.setItem("busquedas",JSON.stringify(listas));
};

const mostrarBusquedas = () =>{
    let listas = [];
    if(localStorage.getItem("busquedas")){
        listas = JSON.parse(localStorage.getItem("busquedas"));
    }
    let html = "";
    for (let lista of listas){
        html += "<li>" + lista + "</li>";
    }
    listaBusqueda.innerHTML = html;
    reBuscar();
};

const reBuscar = () =>{
    const busquedas = document.querySelectorAll("li");
    busquedas.forEach(function (elemento) {
      elemento.addEventListener("click", function () {
        const eliminar = confirm("¿Desea buscar nuevamente " + elemento.innerText + "?");
        if (eliminar) {
            inputBusqueda.value = elemento.innerText
            botonGo.click()
        }
      });
    });
};

const ultimaBusqueda = (input) =>{
    if(localStorage.getItem('ultimaBusqueda') != input){
        offset = 0;
    }
    localStorage.setItem('ultimaBusqueda', input);
};
const limpiarPrintImg = (input) =>{
    const img = document.createElement("img");
    if(localStorage.getItem('ultimaBusqueda')){
        if(localStorage.getItem('ultimaBusqueda') != input){
        printImg.innerHTML = "";
    };
    }else{
        printImg.innerHTML = "";
    };
    
};

// botonBorrar.addEventListener("click", function (evento) {
//     evento.preventDefault();
//     localStorage.clear();
//     mostrarBusquedas();
// });
   
window.addEventListener("load",cargarTrending);
window.addEventListener('scroll', onScroll);
botonGo.addEventListener("click", cargarSearch);
inputBusqueda.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      botonGo.click()
    }
  });