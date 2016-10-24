const request = require('request');
const config = require('./config');
function getMessage(event){
	var senderID = event.sender.id
	var messageText = event.message.text

	console.log("Mensaje Recibido de "+senderID);

	evaluarMensaje(senderID, messageText);
}

function evaluarMensaje(senderID, messageText){
	var mensaje = '';

	if(isContain(messageText,'hola') || isContain(messageText,'Hola')){
		mensaje = 'Hola soy un bot, estos son los comandos que me puedes decir\n';
		enviarMensajeTexto(senderID, mensaje);
		mensaje = 'Ayuda: Muestro los comandos de ayuda\n';
		enviarMensajeTexto(senderID, mensaje);
		mensaje = 'Información - Muestro la información de contacto\n';
		enviarMensajeTexto(senderID, mensaje);
		mensaje = 'Perfil - Muestro los perfiles de los integrantes\n';
		enviarMensajeTexto(senderID, mensaje);
		mensaje = 'clima - Muestro el clima.';
	}else if(isContain(messageText,'ayuda') || isContain(messageText,'Ayuda')){
		mensaje = 'Información - Muestro la información de contacto\n';
		enviarMensajeTexto(senderID, mensaje);
		mensaje = 'Perfil - Muestro los perfiles de los integrantes\n';
		enviarMensajeTexto(senderID, mensaje);
		mensaje = 'clima - Muestro el clima.';
	}else if(isContain(messageText,'info') || isContain(messageText,'Info')){
		mensaje = 'Hola que tal nuestro numero de telefono es: (+57)300748-5545\n mi correo es: mi.canal.robot@gmail.com';
	}else if(isContain(messageText,'imagen') || isContain(messageText,'Imagen') || isContain(messageText,'logo')){
		enviarMensajeImagen(senderID);
	}else if(isContain(messageText,'perfil') || isContain(messageText,'Perfil')){
		enviarMensajeTemplate(senderID);
	}else if(isContain(messageText,'clima') || isContain(messageText,'temperatura') || isContain(messageText,'Clima') || isContain(messageText,'Temperatura')){
		getClima(function(_temperatura){
			enviarMensajeTexto(senderID, getMessageCLima(_temperatura));
		})
	}else{
		mensaje = 'El comando "'+messageText+'" es invalido, envia "ayuda" para asesoramiento.';
	}

	enviarMensajeTexto(senderID, mensaje);
}

function enviarMensajeTemplate(senderID){
	var messageData = {
		recipient: {
			id : senderID
		},
		message: {
			attachment :{
				type: "template",
				payload: {
					template_type: 'generic',
					elements: [elementTemplate()]
				}
			}
		}
	}

	callSendAPI(messageData);
}

function elementTemplate(){
	return {
		title: "Edinson Andres Tique Ramirez",
		subtitle: "Programador freelance",
		item_url: "https://www.quecodigo.com",
		image_url: "https://www.quecodigo.com/img/logo.png",
		buttons: [
			buttonTemplate('Contactame','https://www.quecodigo.com/contacto.html'),
			buttonTemplate('Portafolio','https://www.quecodigo.com')
		]
	}
}

function buttonTemplate(title,url){
	return {
		type: 'web_url',
		url: url,
		title: title
	}
}

//enviar imagen

function enviarMensajeImagen(senderID){
	var messageData = {
		recipient : {
			id: senderID
		},
		message:{
			attachment:{
				type: "image",
				payload: {
					url: 'https://www.quecodigo.com/img/logo.png'
				}

			}
		}
	}

	callSendAPI(messageData);
}
//enviar texto plano
function enviarMensajeTexto(senderID, mensaje){
	var messageData = {
		recipient : {
			id: senderID
		},
		message: {
			text: mensaje
		}
	}

	callSendAPI(messageData);
}

//formatear el texto de regreso al cliente

function getMessageCLima(temperatura){
	if(temperatura > 30){
		return "Nos encontramos a una temperatura de " + temperatura +"°. Hay demasiado calor, comprate una gaseosa :D";
	}else{
		return "Nos encontramos a una temperatura de " + temperatura +"°. es un bonito dia para salir";
	}
}

//enviar texto en temperatura
function getClima(callback){
	request('http://api.geonames.org/findNearByWeatherJSON?lat=-12.046374&lng=-77.042793&username=eduardo_gpg',
		function(error, response, data){
			if(!error){
				var response = JSON.parse(data);
				var temperatura = response.weatherObservation.temperature;
				callback(temperatura);
			}else{
				callback(15); //temperatura por defecto
			}
		})
}

function callSendAPI(messageData){
	//api de facebook
	request({
		uri: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token: config.token},
		method: 'POST',
		json: messageData
	},function(error, response, data){
		if(error)
			console.log('No es posible enviar el mensaje');
		else
			console.log('Mensaje enviado');
	});
}

function isContain(texto, word){
	if(typeof texto=='undefined' || texto.length<=0) return false;
	return texto.indexOf(word) > -1;
}

exports.getMessage = getMessage;