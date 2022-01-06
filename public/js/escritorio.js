//Referencias html
const lblEscritorio = document.querySelector('h1');
const btnAtender = document.querySelector('button');
const lblTicket = document.querySelector('small');
const divAlert = document.querySelector('.alert');
const lblPendientes=document.querySelector('#lblPendientes');
//Leyendo cosas del url , saber que escritorio estoy trabajando
const searchParams = new URLSearchParams(window.location.search);
if(!searchParams.has('escritorio')){
    window.location="index.html";
    throw new Error("El escrorio es obligatorio");
}

const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText=escritorio;
divAlert.style.display='none';

const socket = io();

socket.on('connect', () => {
    btnAtender.disable=false;
});

socket.on('disconnect', () => {
    btnAtender.disabled=true;
});

socket.on('ultimo-ticket',(ticket)=>{
    //lblNuevoTicket.innerText='Ticket '+ ticket;

});

socket.on('tickets-pendientes',(tickets)=>{
    if(tickets===0){
        lblPendientes.style.display='none';
    }else{
        lblPendientes.style.display='';
        lblPendientes.innerText=tickets;
    }
});


btnAtender.addEventListener( 'click', () => {

    //           evento ,payload que enviamos, callback con argumentos que nos enviara nuestro backend
    socket.emit('atender-ticket',{escritorio},({ok,ticket,msg})=>{

        if(!ok){
            lblTicket.innerText="Nadie";
            return divAlert.style.display='';
        }
        lblTicket.innerText='Ticket '+ticket.numero;
    });

});