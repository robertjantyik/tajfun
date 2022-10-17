$(document).ready(function (){

    $("#kapcsolatMentesButton").off('click');
    $("#kapcsolatMentesButton").on('click', function(){
        let varositelefonszam = $("#varositelefonszam").val();
        let mobilszam = $("#mobilszam").val();
        let nyitvatartas = $("#nyitvatartas").val();
        let cim = $("#cim").val();
        let email = $("#email").val();
        let facebook = $("#facebook").val();

        $.ajax({
            method: 'post',
            url: '/admin/kapcsolat/editkapcsolat',
            data: {varositelefonszam: varositelefonszam, mobilszam : mobilszam, nyitvatartas : nyitvatartas, cim : cim, email : email, facebook : facebook},
            complete: function(data){
                toastr.info(data.responseText);
            }
        })
    });

})