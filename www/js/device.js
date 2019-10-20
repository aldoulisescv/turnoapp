document.addEventListener("deviceready",function() {
    document.addEventListener("offline", onOffline, false);
    document.addEventListener("online", onOnline, false);
    document.addEventListener("resume", onResume, false);
    if(navigator.connection.type==Connection.NONE){
        onOffline();
    }
    window.FirebasePlugin.grantPermission();
    window.FirebasePlugin.onTokenRefresh(function(token) {
        var url=API_URL+"?task=refreshToken&user="+localStorage.uid+"&tkn="+token+"&plat="+device.platform;
        //console.log(url);
        $.getJSON(url,
          function(data) {
            console.log(data);
          }
        );
      }, function(error) {
          console.error(error);
      });
});
function onResume() {
    console.log('onResume');
    if(navigator.connection.type==Connection.NONE){
        checkConnection();
    }else{
        $('#noconnection').hide();
        window.location.reload(); 
    }
    
}
function onOnline() {
    console.log('onOnline');
    setTimeout(() => {
        $('#noconnection').hide();
        window.location.reload();

    }, 3000); 
}

function onOffline() {
    console.log('onOffline');
    $('#noconnection').show();
}
function checkConnection() {
    var networkState = navigator.connection.type;
    if(networkState==Connection.NONE){
        onOffline();
    }else{
        onOnline();
    }
}

// function checkConnection() {}

//     var networkState = navigator.connection.type;
//     console.log('Connection type: '+networkState );
//         var url=API_URL;
//         var interval = setInterval(function(){
//             // try {
                
                
//                 // $.ajax({
//                 //     async: false,
//                 //     url: url,
//                 //     type: 'GET',
//                 //     success: function (data) {
//                 //         console.log(data);
//                 //         traeTurnos(FILTRO_ESTATUS, FILTRO_DESDE, FILTRO_HASTA, FILTRO_ESTAB, FILTRO_ORDEN);
//                 //         clearInterval(interval);
//                 //     }
//                 //     ,error: function (data) {
//                 //         console.error(data);
//                 //     }
//                 // });
//             // } catch (error) {
//             //     console.log(error);
//             // }
            
//         },1000);
// }