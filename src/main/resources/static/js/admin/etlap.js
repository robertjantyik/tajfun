let etelekDataAdapter;

$(document).ready(function () {

    let etelekSource =
        {
            datatype: "json",
            datafields:
                [
                    {name: 'id', type: 'number'},
                    {name: 'nev', type: 'string'},
                    {name: 'ar', type: 'number'},
                    {name: 'ar2', type: 'number'},
                    {name: 'kategoriaId', type: 'number'},
                    {name: 'kategoriaNev', type: 'string'},
                    {name: 'megjegyzes', type: 'string'},
                    {name: 'kepId', type: 'string'},
                    {name: 'aktiv'}
                ],
            id: 'id',
            url: '/admin/etlap/etelek',
            /*sortcolumn: 'nev'*/
        };

    etelekDataAdapter = new $.jqx.dataAdapter(etelekSource);

    $("#etelGrid").jqxGrid(
        {
            theme:'fresh',
            width: '100%',
            height:'100%',
            source: etelekDataAdapter,
            columnsresize: true,
            groupable: true,
            sortable: true,
            filterable: true,
            columns:
                [
                    {text: 'Id', datafield: 'id', width:'10%'},
                    {text: 'Étel neve', datafield: 'nev', width:'40%'},
                    {text: 'Ára', datafield: 'ar', width:'10%'},
                    {text: 'Akciós ára', datafield: 'ar2', width:'10%'},
                    {text: 'Kategória', datafield: 'kategoriaNev', width:'10%'},
                    {text: 'Étel leírása', datafield: 'megjegyzes', width:'10%'},
                    {text: 'Állandó kínálat', datafield: 'aktiv', width:'10%',
                        cellsRenderer: function (row, column, value, rowData) {
                            var checkbox;
                            let data = $('#etelGrid').jqxGrid('getrowdata', row);
                            if (value === true) {
                                checkbox = '<input class="ml-5 mr-5 mt-2 mb-2" onclick="changeEtelAktiv(this.dataset.etelid)" data-etelid="' + data.id + '" type="checkbox" checked/></div>'
                            }else{
                                checkbox = '<input class="ml-5 mr-5 mt-2 mb-2" onclick="changeEtelAktiv(this.dataset.etelid)" data-etelid="' + data.id + '" type="checkbox" /></div>';
                            }
                            return checkbox;
                        },
                    }
                ],
            groups: ['kategoriaNev']
        });

    let kategoriakSource =
        {
            datatype: "json",
            datafields:
                [
                    {name: 'id', type: 'number'},
                    {name: 'nev', type: 'string'},
                    {name: 'prio', type: 'number'}
                ],
            id: 'id',
            url: '/admin/etlap/kategoriak',
            sortcolumn: 'prio'
        };

    let kategoriakDataAdapter = new $.jqx.dataAdapter(kategoriakSource);

    $("#katGrid").jqxGrid(
        {
            theme:'fresh',
            width: '100%',
            source: kategoriakDataAdapter,
            columnsresize: true,
            sortable: true,
            filterable: true,
            columns:
                [
                    {text: 'Id', datafield: 'id'},
                    {text: 'Kategória neve', datafield: 'nev'},
                    {text: 'Priorítás', datafield: 'prio'}
                ]
        });

    //ÉtelButtons default disabled
    $("#editEtelButton").prop('disabled',true);
    $("#deleteEtelButton").prop('disabled',true);

    //KatButtons default disabled
    $("#editKatButton").prop('disabled',true);
    $("#deleteKatButton").prop('disabled',true);

    //RowSelect gombok
    $("#etelGrid").on('rowselect',function (){
        $("#editEtelButton").prop('disabled',false);
        $("#deleteEtelButton").prop('disabled',false);
    });

    //RowSelect gombok
    $("#katGrid").on('rowselect',function (){
        $("#editKatButton").prop('disabled',false);
        $("#deleteKatButton").prop('disabled',false);
    });

    //ÉtelGrid gomb functions


    $("#newEtelButton").on('click', function(){
        $("#etelFormA").attr('action', '/admin/etlap/new/etel');
    });

    $("#editEtelButton").on('click',function (){
        var row = $('#etelGrid').jqxGrid('getselectedrowindex')
        var data = $('#etelGrid').jqxGrid('getrowdata', row);
        $("#etelFormContent #etelNev").val(data.nev);
        $("#etelFormContent #etelMegjegyzes").val(data.megjegyzes);
        $("#etelFormContent #etelKategoriaNev").val(data.kategoriaNev);
        $("#etelFormContent #etelAr").val(data.ar);
        $("#etelFormContent #etelAr2").val(data.ar2);
        $("#etelFormContent #etelId").val(data.id);
        $("#etelFormA").attr('action', '/admin/etlap/edit/etel');
        $("#etelForm").modal('show');
        $("#etelFormContent #etelKategoria").val(data.kategoriaId);
    });

    $("#newEtelButton").on('click', function (){
        $("#etelFormA").attr('action', '/admin/etlap/new/etel');
        $("#etelForm").modal('show');
    });

    $("#deleteEtelButton").on('click',function (){
        var row = $('#etelGrid').jqxGrid('getselectedrowindex')
        var data = $('#etelGrid').jqxGrid('getrowdata', row);
        $.ajax({
            type: 'get',
            url: '/admin/etlap/delete/etel/' + data.id,
            success: function (data){
                toastr.success(data);
                etelekDataAdapter.dataBind();
            },
            error: function (data){
                toastr.error(data.responseText);
            }
        });
    });

    //Kategória Grid gomb functions

    $("#newKatButton").on('click', function(){
        $("#kategoriaFormFooter #kategoriaMentes").off('click');
        $("#kategoriaFormFooter #kategoriaMentes").on('click', function(){
            if($("#kategoriaFormContent #kategoriaNev").val().length < 1){
                alert("A Kategória neve mező kitöltése kötelező!");
            } else {
                let kategoriaData = {
                    nev: $("#kategoriaFormContent #kategoriaNev").val(),
                    prio: $("#kategoriaFormContent #kategoriaPrio").val()
                }
                $.ajax({
                    method: 'post',
                    url: '/admin/etlap/new/kategoria',
                    data: kategoriaData,
                    success: function(data){
                        toastr.success(data);
                        $("#kategoriaForm").modal('hide');
                        kategoriakDataAdapter.dataBind();
                    },
                    error: function (data){
                        toastr.error(data.responseText);
                    }
                });
            }
        });
    });

    $("#editKatButton").on('click',function (){
        var row = $('#katGrid').jqxGrid('getselectedrowindex')
        var data = $('#katGrid').jqxGrid('getrowdata', row);
        $('#kategoriaForm').modal('show');
        $("#kategoriaFormContent #kategoriaNev").val(data.nev);
        $("#kategoriaFormContent #kategoriaId").val(data.id);
        $("#kategoriaFormContent #kategoriaPrio").val(data.prio);
        $("#kategoriaFormFooter #kategoriaMentes").off('click');
        $("#kategoriaFormFooter #kategoriaMentes").on('click', function(){
            if($("#kategoriaFormContent #kategoriaNev").val().length < 1){
                alert("A Kategória neve mező kitöltése kötelező!");
            } else {
                let kategoriaData = {
                    id: $("#kategoriaFormContent #kategoriaId").val(),
                    nev: $("#kategoriaFormContent #kategoriaNev").val(),
                    prio: $("#kategoriaFormContent #kategoriaPrio").val()
                }
                $.ajax({
                    method: 'post',
                    url: '/admin/etlap/edit/kategoria',
                    data: kategoriaData,
                    success: function (data) {
                        toastr.success(data, 'Siker!');
                        $("#kategoriaForm").modal('hide');
                        kategoriakDataAdapter.dataBind();
                    },
                    error: function (data) {
                        toastr.error(data.responseText);
                    }
                });
            }
        });
    });

    $("#deleteKatButton").on('click',function (){
        var row = $('#katGrid').jqxGrid('getselectedrowindex')
        var data = $('#katGrid').jqxGrid('getrowdata', row);
        $.ajax({
            type: 'get',
            url:'/admin/etlap/delete/kategoria/' + data.id,
            success: function (data){
                toastr.success(data);
                kategoriakDataAdapter.dataBind();
            },
            error: function (data){
                toastr.error(data.responseText);
            }
        });
    });

    $('#etelForm').on('show.bs.modal', function (){
        let s = $('#etelFormContent #etelKategoria');
        let k = kategoriakDataAdapter.records;
        s.empty();
        s.append(`<option selected disabled value="">Kérjük válasszon</option>`);
        $.each(k, function(i){
            s.append(`<option value="${k[i].id}">
                                       ${k[i].nev}
                                  </option>`);
        });

    });

    $("#etelKategoria").on('change', function (){
        $("#etelKategoriaNev").val(this.selectedOptions[0].text);
    });

    $('#etelForm').on('hidden.bs.modal', function (){
        $("#etelFormContent #etelNev").val('');
        $("#etelFormContent #etelMegjegyzes").val('');
        $("#etelFormContent #etelKategoria").val('');
        $("#etelFormContent #etelKategoriaNev").val('');
        $("#etelFormContent #etelAr").val('');
        $("#etelFormContent #etelAr2").val('');
        $("#etelFormContent #etelId").val('');
        $("#etelFormContent #etelKep")[0].value = null;
        $("#etelFormA").attr('action','');
    });

    $('#kategoriaForm').on('hidden.bs.modal', function (){
        $("#kategoriaFormContent #kategoriaNev").val('');
        $("#kategoriaFormContent #kategoriaId").val('');
        $("#kategoriaFormContent #kategoriaPrio").val('');
    });

    $("#etelMentes").off('click');
    $("#etelMentes").on('click', function (){
        let form = $("#etelFormA")[0];
        if(formValidation(form)){
            let formData = new FormData(form);
            $.ajax({
                type: 'post',
                url: $(form).attr('action'),
                data: formData,
                processData: false,
                contentType: false,
                success: function (data){
                    toastr.success(data);
                    $('#etelForm').modal('hide');
                    etelekDataAdapter.dataBind();
                },
                error: function (data){
                    toastr.error(data.responseText);
                }
            });
        }
    });

});

function changeEtelAktiv(id){
    $.ajax({
        method: 'GET',
        url: '/admin/etlap/changeetelaktiv?id=' + id,
        success: function(data){
            toastr.info(data);
            etelekDataAdapter.dataBind();
        },
        error: function (data){
            toastr.error(data.responseText);
        }
    });
}


function formValidation(form){
    let r = [];
    let inputs = $("input[required], select[required]", form);
    $(inputs).each(function (){
        if(this.value.length < 1)r.push(this.id);
    });
    if(r.length > 0) {
        $(r).each(function () {
            let i = $("#" + this)[0];
            let s = $("label", i.parentElement.children)[0].textContent.replace(":", "");
            if (i.tagName === "SELECT") {
                alert("A(z) " + s + " mező értékének kiválasztása kötelező!");
            } else {
                alert("A(z) " + s + " mező kitöltése kötelező!");
            }
        });
        return false;
    }
    return true;
}