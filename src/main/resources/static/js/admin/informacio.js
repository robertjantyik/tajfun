$(document).ready(function(){

    $("#informacioMentesButton").off('click');
    $("#informacioMentesButton").on('click', function(){
        let megszolitas = $("#megszolitas").val();
        let szoveg = $("#szoveg").val();

        $.ajax({
            method: 'post',
            url: '/admin/informacio/editinformacio',
            data: {megszolitas : megszolitas, szoveg: szoveg},
            complete: function (data){
                toastr.info(data.responseText);
            }
        });
    });

    $("#covidSaveButton").off('click');
    $("#covidSaveButton").on('click', function(){
        let megszolitas = $("#CovidMegszolitas").val();
        let szoveg = $("#CovidSzoveg").val();

        $.ajax({
            method: 'post',
            url: '/admin/informacio/editcovid',
            data: {megszolitas : megszolitas, szoveg: szoveg},
            complete: function (data){
                toastr.info(data.responseText);
            }
        });
    });

    $("#tudnivalokSaveButton").off('click');
    $("#tudnivalokSaveButton").on('click', function(){
        let megszolitas = $("#TudnivalokMegszolitas").val();
        let szoveg = $("#TudnivalokSzoveg").val();

        $.ajax({
            method: 'post',
            url: '/admin/informacio/edittudnivalok',
            data: {megszolitas : megszolitas, szoveg: szoveg},
            complete: function (data){
                toastr.info(data.responseText);
            }
        });
    });

})