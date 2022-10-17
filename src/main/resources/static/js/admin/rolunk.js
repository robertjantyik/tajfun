$(document).ready(function(){

    $("#rolunkMentesButton").off('click');
    $("#rolunkMentesButton").on('click', function(){
        let title = $("#title").val();
        let szoveg = $("#szoveg").val();

        $.ajax({
            method: 'post',
            url: '/admin/rolunk/editrolunk',
            data: {title: title, szoveg: szoveg},
            complete: function(data){
                toastr.info(data.responseText);
            }
        })
    });

})