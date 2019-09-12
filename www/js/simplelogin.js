var user = {
	init: function(){
		$('.login-form').hide();
		$('#init').show();
		$('#back').hide();
		$('.login-msg').hide();
	},
	enviarAlerta: function(forma=''){
		
		$('#WaitIcon').show();
		function alertDismissed() {
		    
		}
          var response = user.verify('', forma).done(function(response){
          	navigator.notification.beep(1);
          if(response!=0){
           	$('#WaitIcon').hide();
            navigator.notification.alert(
			    'Reporte Generado Correctamente',  // message
			    alertDismissed,         // callback
			    'Aviso',            // title
			    'Entendido'                  // buttonName
			);
            
          }else{            
            $('#WaitIcon').hide();
            navigator.notification.alert(
			    'Hubo un error, favor de intentarlo de nuevo',  // message
			    alertDismissed,         // callback
			    'Error',            // title
			    'Entendido'                  // buttonName
			);
          }
        });
	},
	obtenerPolygon: function(aid='',mapita){
		
		var param = {task:"getPolygon",id:aid};
		
        var res = user.verify('', param).done(function(response){
        	if(response!=0){
                var stringy = JSON.stringify(response);
                localStorage.poly = stringy.replace(/"/g,"");
               return mapita.addPolyline({
                        'points': response,
                          'color' : '#dd8888',
                          'width': 3,
                          'geodesic': true
                      });
        	}else{
        		return false;                            		
        	}

        });
	},
	cambiarPass: function(json=''){
        var res = user.verify('', json).done(function(response){

        	if (response!=0) {        		
        			
        		switch(response.ws_response){
        			case '1':
        				navigator.notification.alert("Se realizó correctamente el cambio de la contraseña", 
        					function(){

        						localStorage.removeItem('uid');
        						window.location.href = index_page;
        					}, "Aviso", "Aceptar");
						
        			break;
        			case '2':
        			navigator.notification.alert("Error al actualizar el campo", 
        					function(){}, "Aviso", "Aceptar");
        				
        			break;
        			case  '3':
        			navigator.notification.alert("Las contraseña antigüa no coincide", 
        					function(){}, "Aviso", "Aceptar");
        			break;
        			case '4':
        			navigator.notification.alert("Error al buscar el usuario", 
        					function(){}, "Aviso", "Aceptar");
        			break;
        		}
        	}       	

        });
	},
	signUp: function(show=0){
		if(show == 1){
			$('.login-form').hide();
			$('#registration').show();
			$('#back').show();
		}else{
			var nom  = $('#nom').val();
			var em = $('#em').val();
			var tel  = $('#tel').val();
			var ps  = $('#cripto').val().toUpperCase();
			var ape  = $('#ape').val();
			var uname  = $('#uname').val();
			if(em!='' && nom!=''  && tel!=''  && ps!=''  && ape!='' && uname!=''){
				$('.login-msg').hide();
				$('#WaitIcon').show();
				var param = {task:"registroCliente",nom:nom,ape:ape,em:em,tel:tel,ps:ps,uname:uname};
				console.log(param);
				var response = user.verify('', param).done(function(response){
					if(response!=0){
						$('.login-msg').html("Cuenta Registrada! <br><span>Revisa tu correo para verificar tu cuenta</span>");
						$('.login-msg').show();
						$('#WaitIcon').hide();
						$('#login').show();
						$('#registration').hide();
					}else{
						$('.login-msg').html("Email o usuario ya registrado! <br><span onclick='user.init()'>Try Login?</span>");
						$('.login-msg').show();
						$('#WaitIcon').hide();
					}
				});
			}else{
				$('.login-msg').html("Por favor rellena todos los campos!");
				$('.login-msg').show();
			}
		}
	},
	signIn: function(show=0){
		if(show == 1){
			$('.login-form').hide();
			$('#login').show();
			$('#back').show();
		}else{
			var email = $('#email').val();
			var pass = $('#cripto').val().toUpperCase();
			var token=$('#token').val();
			var plataforma=$('#plataforma').val();
            if(email!='' && pass!=''){
				$('.login-msg').hide();
				$('#WaitIcon').show();
				var param = {task:"login",em:email,ps:pass,tkn:token,plat:plataforma};
				var msg = "";
				var response = user.verify('', param).done(function(response){
                    switch (response.estatus) {
                        case "0":
                            if(response.ws_error==2){
                                $('.login-msg').html("Usuario no existe");
                                $('.login-msg').show();
                                $('#WaitIcon').hide();
                            }else{
                                $('.login-msg').html("Credenciales inválidas <br><input type='button'  value='¿Desea resetear su contraseña?' onclick='user.resetPassword(1)' style='font-size: 3.5vw;  margin-top: 14px;'>");
                                $('.login-msg').show();
                                $('#WaitIcon').hide();
                            }
                            break;
                        case "2":
                                $('.login-msg').html("Su cuenta no ha sido autorizada");
                                $('.login-msg').show();
                                $('#WaitIcon').hide();
                            break;
                        case "1":
							$('.login-msg').html();
							$('.login-msg').show();
							$('#WaitIcon').hide();
							console.log("logueado como "+response.nombreCompleto);
                            localStorage.unom = response.nombreCompleto;
                            localStorage.uid = response.usuarioId;
                            localStorage.token = response.token;
                            localStorage.uemail = response.email;
							localStorage.utel = response.telefono;
							window.location.href = home_page;
                            // user.initFirebase(response.UsuarioId, function () {
                                
                            // });
                            break;
                        case "3":
                                $('.login-msg').html("Su cuenta ha sido deshabilitada");
                                $('.login-msg').show();
                                $('#WaitIcon').hide();
                            break;
                        default:
                                $('.login-msg').html("Algo salio mal");
                                $('.login-msg').show();
                                $('#WaitIcon').hide();
                            break;
                    }
				});
				
				
			}else{
				$('.login-msg').html("Escriba sus credenciales");
				$('.login-msg').show();
			}
		}
	},
	resetPassword: function(show=0){
		if(show == 1){
			$('.login-form').hide();
			$('.login-msg').hide();
			$('#reset').show();
			$('#back').show();
		}else{
			var email = $('#registeredEmail').val();
			if(email!=''){
				$('.login-msg').hide();
				$('#WaitIcon').show();
				var param = {task:"recoverPass",em:email};
				var response = user.verify('PLUGIN__checkEmail', param).done(function(response){
					if(response!=0){
						$('.login-msg').html("Revisa tu bandeja de entrada y spam para cambiar tu contraseña");
						$('.login-msg').show();
						$('.login-form').show();
						$('#reset').hide();
						$('#WaitIcon').hide();
						ß
					}else{
						$('.login-msg').html("Dirección de Email no está registrada");
						$('.login-msg').show();
						$('#WaitIcon').hide();
					}
				});
				
			}else{
				$('.login-msg').html("Dirección de Email es requerida!");
				$('.login-msg').show();
			}
		}
	},
	confirmReset: function(show=0,secQ='',email=''){
		if(show != 0){
			$('.login-form').hide();
			$('.login-msg').html(secQ + '?');
			$('.login-msg').show();
			$('#confirmReset').show();
			$('#confirmBtn').html('<input type="button" id="resetButton" value="Reset" onclick="user.confirmReset(0,\''+secQ+'\',\''+email+'\')" />');
			$('#back').show();
		}else{
			var secA = $('#secretAns').val();
			var pass = $('#preferredPassword').val();
			var pass  = (pass);
			if(secA!='' && pass!=''){
				$('.login-msg').hide();
				$('#WaitIcon').show();
				var param = {email:email,pass:pass,secQ:secQ,secA:secA,app_id:localStorage.app_id};
				var response = user.verify('PLUGIN__passwordReset', param).done(function(response){
					if(response){
						$('#WaitIcon').hide();
						$('#secretAns').hide();
						$('#preferredPassword').hide();
						$('#resetButton').hide();
						$('.login-msg').html("Password Reset successful");
						$('.login-msg').show();
					}else{
						$('.login-msg').html("Invalid security answer!");
						$('.login-msg').show();
						$('#WaitIcon').hide();
					}
				});
				
			}else{
				$('.login-msg').html("Email Address is required!");
				$('.login-msg').show();
			}
		}
	},
	signOut: function(){
		localStorage.removeItem("uid");
		window.location.href="index.html";
	},
	auth: function(){
		if(localStorage.uid!=undefined){
			return true;
		}else{
			window.location.href="index.html";
		}
	},
	verify: function(method,param){
		console.log('verify');
		return jQuery.ajax({
			 type: "GET",
			 url: API_URL,
			 data: param,
			 contentType: "application/x-www-form-urlencoded; charset=utf-8",
			 dataType: "json",
			 success: function (data) {
				 console.log(data);
			 },error: function (err) {            
				 console.error(err);
				 console.error(err.responseText);
			 }
		 });
	},
    
	initFirebase: function (userId, callback) {
		window.FirebasePlugin.getToken(function(token) {
			
			var params = {task: 'uploadToken', id: userId, ntoken: token};
			jQuery.ajax({
				type: "GET",
				url: API_URL,
				data: params,
				contentType: "application/x-www-form-urlencoded; charset=utf-8",
				dataType: "json",
				success: function (data) {
					if (callback && (typeof callback) === 'function') {
						callback();
					}
				}, error: function (err) {
					if (callback && (typeof callback) === 'function') {
						callback();
					}
				}
			});

		}, function(error) {
			//console.error('Error getting Firebase token', error);
		});

		window.FirebasePlugin.onTokenRefresh(function(token) {

			var params = {task: 'uploadToken', id: userId, ntoken: token};
			jQuery.ajax({
				type: "GET",
				url: API_URL,
				data: params,
				contentType: "application/x-www-form-urlencoded; charset=utf-8",
				dataType: "json",
				success: function (data) {
					if (callback && (typeof callback) === 'function') {
						callback();
					}
				}, error: function (err) {
					if (callback && (typeof callback) === 'function') {
						callback();
					}
				}
			});

		}, function(error) {
			//console.error('Error getting Firebase refresh token', error);
			if (callback && (typeof callback) === 'function') {
				callback();
			}
		});

		window.FirebasePlugin.grantPermission();
    }
};