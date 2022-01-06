const path = require('path');
const fs = require('fs');
class Ticket{

    constructor(numero,escritorio){
        this.numero=numero;
        this.escritorio=escritorio;
    }

}

class TicketControl{

    constructor(){
        this.ultimo  =0;//Ultimo ticket que estoy atendiendo
        this.hoy     = new Date().getDate();
        this.tickets =[];//Todos los tickets que estan pendientes
        this.ultimos4=[];//Los que se mostraran en la pantalla publico
        this.init();
    }

    //
    get toJson(){
        return {
            ultimo:this.ultimo,
            hoy:this.hoy,
            tickets:this.tickets,
            ultimos4:this.ultimos4
        }
    }

    init(){
        const {hoy,tickets,ultimos4,ultimo} = require('../db/data.json');
        if(hoy===this.hoy){
            //Significa que estamos trabajando en el mismo dia y estoy recargando el servidor
            this.tickets=tickets;
            this.ultimo=ultimo;
            this.ultimo4=ultimos4;
        }else{
            //Es otro dia
            this.guardarDB();
        }
        //console.log(data);
    }

    guardarDB(){
        const dbPath = path.join(__dirname,'../db/data.json');
        fs.writeFileSync(dbPath,JSON.stringify(this.toJson));
        //JSON.stringify() convierte un objeto o valor de Javascript en una cadena de texto JSON
    }
    
    siguiente(){
        this.ultimo+=1;
        const ticket = new Ticket(this.ultimo,null);
        this.tickets.push(ticket);
        this.guardarDB();
        return 'Ticket' +ticket.numero;
    }
    atenderTicket(escritorio){
        //No tenemos tickets 
        if(this.tickets.length===0){
            return null;
        }

        const ticket = this.tickets.shift();
        //ticket que estoy atendiendo ahora
        ticket.escritorio=escritorio;
        this.ultimos4.unshift(ticket);
        //Validando que sean 4
        if(this.ultimos4.length>4){
            //borrar el ultimo
            this.ultimos4.splice(-1,1);
        }
        this.guardarDB();
        return ticket;
    }

}

module.exports=TicketControl;