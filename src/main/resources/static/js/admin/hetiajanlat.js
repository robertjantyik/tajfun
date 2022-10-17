$(document).ready(function () {

    let hetiajanlatId = -1;

    let currentdate = new Date();
    let oneJan = new Date(currentdate.getFullYear(), 0, 1);
    let numberOfDays = (currentdate - oneJan) / 86400000;
    let maiNapHet = Math.ceil(numberOfDays / 7) - 1;

    let kategoriakSource =
        {
            datatype: "json",
            datafields:
                [
                    {name: 'id', type: 'number'},
                    {name: 'nev', type: 'string'}
                ],
            id: 'id',
            url: '/admin/hetiajanlat/kategoriak'
        };

    let kategoriakDataAdapter = new $.jqx.dataAdapter(kategoriakSource);

    $("#kategoriaList").jqxComboBox({
        placeHolder: "Kérjük válassza ki a kategóriát...",
        source: kategoriakDataAdapter,
        displayMember: "nev",
        valueMember: "id",
        itemHeight: 30,
        height: 30,
        width: '100%'
    });

    $("#kategoriaList").on('select', function (event) {
        let katId = event.args.item.value;
        etelekSource.url = '/admin/etlap/' + katId + '/etelek';
        etelekDataAdapter.dataBind();
    });

    $("#hetfoDatePicker").jqxDateTimeInput(
        {
            width: '100%',
            height: '25px',
            formatString: 'yyyy-MM-dd',
            showWeekNumbers: true,
            culture: 'hu-HU',
            selectableDays: ["Monday"]
        });

    $("#hetfoDatePickerCopy").jqxDateTimeInput(
        {
            width: '100%',
            height: '25px',
            formatString: 'yyyy-MM-dd',
            showWeekNumbers: true,
            culture: 'hu-HU',
            selectableDays: ["Monday"]
        });

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
                    {name: 'kepId', type: 'string'}
                ],
            id: 'id',
            url: ''
        };

    let etelekDataAdapter = new $.jqx.dataAdapter(etelekSource);

    $("#etelList").jqxComboBox({
        placeHolder: "Kérjük válassza ki az ételt...",
        source: etelekDataAdapter,
        displayMember: "nev",
        valueMember: "id",
        itemHeight: 30,
        height: 30,
        width: '100%'
    });

    $("#etelList").on('select', function (event) {
        $("#etelId").val(event.args.item.value);
        $("#etelNev").val(event.args.item.originalItem.nev);
        $("#etelAr").val(event.args.item.originalItem.ar);
    });

    $("#modalEtelSubmitButton").on('click', function () {
        let nap = $("#nap").val();
        let etelId = $("#etelId").val();
        $.ajax({
            method: 'post',
            url: '/admin/hetiajanlat/eteluj',
            data: {
                etelId: etelId,
                nap: nap,
                id: hetiajanlatId
            },
            success: function (data) {
                toastr.success(data);
                switch (nap) {
                    case "hétfő":
                        hetfoDataAdapter.dataBind();
                        break;
                    case "kedd":
                        keddDataAdapter.dataBind();
                        break;
                    case "szerda":
                        szerdaDataAdapter.dataBind();
                        break;
                    case "csütörtök":
                        csutortokDataAdapter.dataBind();
                        break;
                    case "péntek":
                        pentekDataAdapter.dataBind();
                        break;
                    case "szombat":
                        szombatDataAdapter.dataBind();
                        break;
                    case "vasárnap":
                        vasarnapDataAdapter.dataBind();
                        break;
                }
            },
            error: function (data){
                toastr.error(data.responseText);
            },
            complete: function (){
                $("#eteladdModal").modal('hide');
            }
        });
    });

    let hetiajanlatList = {
        datatype: "json",
        datafields:
            [
                {name: 'id', type: 'number'},
                {name: 'het', type: 'number'}
            ],
        id: 'id',
        url: '/admin/hetiajanlat/hetiajanlatok'
    }

    let hetiajanlatDataAdapter = new $.jqx.dataAdapter(hetiajanlatList);

    $("#hetiajanlatList").jqxComboBox({
        placeHolder: "Kérjük válasszon",
        source: hetiajanlatDataAdapter,
        displayMember: "het",
        valueMember: "id",
        itemHeight: 30,
        height: 30,
        width: 270
    });

    $("#hetiajanlatList").on('bindingComplete', function () {
        let numberofWeek = moment().locale('hu').format('WW');
        let data = $("#hetiajanlatList").jqxComboBox('getItems');
        if (data.length > 0) {
            $.each(data, function (i) {
                if (data[i].originalItem.het == numberofWeek) {
                    $("#hetiajanlatList").jqxComboBox('selectItem', data[i]);
                }
            });
        } else {
            toastr.info("Nincsen heti ajánlat a listában!");
        }
    });



    $("#hetiajanlatList").on('select', function (event) {
        hetiajanlatId = event.args.item.value;
        $.ajax({
            type: 'get',
            url: '/admin/hetiajanlat/hetiajanlat/' + hetiajanlatId,
            success: function (data){
                hetfoSource.url = '/admin/hetiajanlat/hetfo/' + hetiajanlatId;
                hetfoDataAdapter.dataBind();
                keddSource.url = '/admin/hetiajanlat/kedd/' + hetiajanlatId;
                keddDataAdapter.dataBind();
                szerdaSource.url = '/admin/hetiajanlat/szerda/' + hetiajanlatId;
                szerdaDataAdapter.dataBind();
                csutortokSource.url = '/admin/hetiajanlat/csutortok/' + hetiajanlatId;
                csutortokDataAdapter.dataBind();
                pentekSource.url = '/admin/hetiajanlat/pentek/' + hetiajanlatId;
                pentekDataAdapter.dataBind();
                if (event.args.item.originalItem.het < maiNapHet) {
                    $("#hetiajanlatImport").prop('hidden', false);
                    $("#hetfoAdd").prop('disabled', true);
                    $("#keddAdd").prop('disabled', true);
                    $("#szerdaAdd").prop('disabled', true);
                    $("#csutortokAdd").prop('disabled', true);
                    $("#pentekAdd").prop('disabled', true);
                } else {
                    $("#hetiajanlatImport").prop('hidden', true);
                    $("#hetfoAdd").prop('disabled', false);
                    $("#keddAdd").prop('disabled', false);
                    $("#szerdaAdd").prop('disabled', false);
                    $("#csutortokAdd").prop('disabled', false);
                    $("#pentekAdd").prop('disabled', false);
                }
                $("#printHetiAjanlat").prop('hidden', false);
            },
            error: function (data){
                toastr.error(data.responseText);
            }
        })
    });

    let hetfoSource =
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
                    {name: 'kepId', type: 'string'}
                ],
            id: 'id',
            url: '/admin/hetiajanlat/hetfo/' + hetiajanlatId
        };

    let hetfoDataAdapter = new $.jqx.dataAdapter(hetfoSource);

    $("#hetfoGrid").jqxGrid(
        {
            theme: 'fresh',
            width: '100%',
            source: hetfoDataAdapter,
            columnsresize: true,
            selectionmode: 'singlerow',
            columns:
                [
                    {text: 'Étel neve', datafield: 'nev'},
                    {text: 'Ára', datafield: 'ar'}
                ]
        });

    $("#hetfoGrid").on('rowselect', function () {
        $("#hetfoDelete").prop('disabled', false);
    });

    $("#hetfoDelete").on('click', function () {
        let rowindex = $('#hetfoGrid').jqxGrid('getselectedrowindex');
        let data = $('#hetfoGrid').jqxGrid('getrowdata', rowindex);
        let nap = "hétfő";
        let etelId = data.id;
        $.ajax({
            type: 'post',
            url: '/admin/hetiajanlat/eteltorles',
            data:{
                etelId : etelId,
                nap: nap,
                id: hetiajanlatId
            },
            success: function (data){
                toastr.info(data);
                hetfoDataAdapter.dataBind();
            },
            error: function (data){
                toastr.error(data.responseText);
            }
        });
    });

    $("#hetfoAdd").on('click', function () {
        $("#nap").val('hétfő');
        $("#eteladdModal").modal('show');
    });

    let keddSource =
        {
            datatype: "json",
            selectionmode: 'singlerow',
            datafields:
                [
                    {name: 'id', type: 'number'},
                    {name: 'nev', type: 'string'},
                    {name: 'ar', type: 'number'},
                    {name: 'ar2', type: 'number'},
                    {name: 'kategoriaId', type: 'number'},
                    {name: 'kategoriaNev', type: 'string'},
                    {name: 'megjegyzes', type: 'string'},
                    {name: 'kepId', type: 'string'}
                ],
            id: 'id',
            url: '/admin/hetiajanlat/kedd/' + hetiajanlatId
        };

    let keddDataAdapter = new $.jqx.dataAdapter(keddSource);

    $("#keddGrid").jqxGrid(
        {
            theme: 'fresh',
            width: '100%',
            source: keddDataAdapter,
            columnsresize: true,
            selectionmode: 'singlerow',
            columns:
                [
                    {text: 'Étel neve', datafield: 'nev'},
                    {text: 'Ára', datafield: 'ar'}
                ]
        });

    $("#keddGrid").on('rowselect', function () {
        $("#keddDelete").prop('disabled', false);
    });

    $("#keddDelete").on('click', function () {
        let rowindex = $('#keddGrid').jqxGrid('getselectedrowindex');
        let data = $('#keddGrid').jqxGrid('getrowdata', rowindex);
        let nap = "kedd";
        let etelId = data.id;
        $.ajax({
            type: 'post',
            url: '/admin/hetiajanlat/eteltorles',
            data:{
                etelId : etelId,
                nap: nap,
                id: hetiajanlatId
            },
            success: function (data){
                toastr.info(data);
                keddDataAdapter.dataBind();
            },
            error: function (data){
                toastr.error(data.responseText);
            }
        });
    });

    $("#keddAdd").on('click', function () {
        $("#nap").val('kedd');
        $("#eteladdModal").modal('show');
    });

    let szerdaSource =
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
                    {name: 'kepId', type: 'string'}
                ],
            id: 'id',
            url: '/admin/hetiajanlat/szerda/' + hetiajanlatId
        };

    let szerdaDataAdapter = new $.jqx.dataAdapter(szerdaSource);

    $("#szerdaGrid").jqxGrid(
        {
            theme: 'fresh',
            width: '100%',
            source: szerdaDataAdapter,
            selectionmode: 'singlerow',
            columnsresize: true,
            columns:
                [
                    {text: 'Étel neve', datafield: 'nev'},
                    {text: 'Ára', datafield: 'ar'}
                ]
        });

    $("#szerdaGrid").on('rowselect', function () {
        $("#szerdaDelete").prop('disabled', false);
    });

    $("#szerdaDelete").on('click', function () {
        let rowindex = $('#szerdaGrid').jqxGrid('getselectedrowindex');
        let data = $('#szerdaGrid').jqxGrid('getrowdata', rowindex);
        let nap = "szerda";
        let etelId = data.id;
        $.ajax({
            type: 'post',
            url: '/admin/hetiajanlat/eteltorles',
            data:{
                etelId : etelId,
                nap: nap,
                id: hetiajanlatId
            },
            success: function (data){
                toastr.info(data);
                szerdaDataAdapter.dataBind();
            },
            error: function (data){
                toastr.error(data.responseText);
            }
        });
    });

    $("#szerdaAdd").on('click', function () {
        $("#nap").val('szerda');
        $("#eteladdModal").modal('show');
    });

    let csutortokSource =
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
                    {name: 'kepId', type: 'string'}
                ],
            id: 'id',
            url: '/admin/hetiajanlat/csutortok/' + hetiajanlatId
        };

    let csutortokDataAdapter = new $.jqx.dataAdapter(csutortokSource);

    $("#csutortokGrid").jqxGrid(
        {
            theme: 'fresh',
            width: '100%',
            selectionmode: 'singlerow',
            source: csutortokDataAdapter,
            columnsresize: true,
            columns:
                [
                    {text: 'Étel neve', datafield: 'nev'},
                    {text: 'Ára', datafield: 'ar'}
                ]
        });

    $("#csutortokGrid").on('rowselect', function () {
        $("#csutortokDelete").prop('disabled', false);
    });

    $("#csutortokDelete").on('click', function () {
        let rowindex = $('#csutortokGrid').jqxGrid('getselectedrowindex');
        let data = $('#csutortokGrid').jqxGrid('getrowdata', rowindex);
        let nap = "csütörtök";
        let etelId = data.id;
        $.ajax({
            type: 'post',
            url: '/admin/hetiajanlat/eteltorles',
            data:{
                etelId : etelId,
                nap: nap,
                id: hetiajanlatId
            },
            success: function (data){
                toastr.info(data);
                csutortokDataAdapter.dataBind();
            },
            error: function (data){
                toastr.error(data.responseText);
            }
        });
    });

    $("#csutortokAdd").on('click', function () {
        $("#nap").val('csütörtök');
        $("#eteladdModal").modal('show');
    });

    let pentekSource =
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
                    {name: 'kepId', type: 'string'}
                ],
            id: 'id',
            url: '/admin/hetiajanlat/pentek/' + hetiajanlatId
        };

    let pentekDataAdapter = new $.jqx.dataAdapter(pentekSource);

    $("#pentekGrid").jqxGrid(
        {
            theme: 'fresh',
            width: '100%',
            source: pentekDataAdapter,
            selectionmode: 'singlerow',
            columnsresize: true,
            columns:
                [
                    {text: 'Étel neve', datafield: 'nev'},
                    {text: 'Ára', datafield: 'ar'}
                ]
        });

    $("#pentekGrid").on('rowselect', function () {
        $("#pentekDelete").prop('disabled', false);
    });

    $("#pentekDelete").on('click', function () {
        let rowindex = $('#pentekGrid').jqxGrid('getselectedrowindex');
        let data = $('#pentekGrid').jqxGrid('getrowdata', rowindex);
        let nap = "péntek";
        let etelId = data.id;
        $.ajax({
            type: 'post',
            url: '/admin/hetiajanlat/eteltorles',
            data:{
                etelId : etelId,
                nap: nap,
                id: hetiajanlatId
            },
            success: function (data){
                toastr.info(data);
                pentekDataAdapter.dataBind();
            },
            error: function (data){
                toastr.error(data.responseText);
            }
        });
    });

    $("#pentekAdd").on('click', function () {
        $("#nap").val('péntek');
        $("#eteladdModal").modal('show');
    });

    $("#eteladdModal").on('hidden.bs.modal', function () {
        $("#nap").val('');
        $("#etelId").val('');
        $("#etelNev").val('');
        $("#etelAr").val('');
        $("#kategoriaList").jqxComboBox('clearSelection');
        $("#etelList").jqxComboBox('clearSelection');

    });

    $("#newHetiajanlat").on('click', function () {
        $("#hetiajanlatModal").modal("show");
    });

    $("#hetiajanlatImport").on('click', function () {
        $("#hetiajanlatModalCopy").modal("show");
    });

    $("#modalHetiajanlatCopySubmitButton").on('click', function () {
        let hetfoDatum = $("#hetfoDatePickerCopy").val();
        let id = $("#hetiajanlatList").val();
        let hetiajanlatId = id;
        if ($("#inputhetfoDatePickerCopy").hasClass('jqx-input-invalid')) {
            toastr.error('Csak hétfői napot lehet kiválasztani!');
        } else {
            $.ajax({
                method: 'GET',
                url: '/admin/hetiajanlat/import/hetiajanlat/' + id,
                data: {
                    hetfoDatum: hetfoDatum
                },
                success: function (data) {
                    toastr.success(data);
                    hetfoSource.url = '/admin/hetiajanlat/hetfo/' + hetiajanlatId;
                    hetfoDataAdapter.dataBind();
                    keddSource.url = '/admin/hetiajanlat/kedd/' + hetiajanlatId;
                    keddDataAdapter.dataBind();
                    szerdaSource.url = '/admin/hetiajanlat/szerda/' + hetiajanlatId;
                    szerdaDataAdapter.dataBind();
                    csutortokSource.url = '/admin/hetiajanlat/csutortok/' + hetiajanlatId;
                    csutortokDataAdapter.dataBind();
                    pentekSource.url = '/admin/hetiajanlat/pentek/' + hetiajanlatId;
                    pentekDataAdapter.dataBind();
                },
                error: function (data) {
                    toastr.error(data.responseText);
                },
                complete: function () {
                    $("#hetiajanlatModalCopy").modal('hide');
                }
            });
        }
    });

    $("#modalHetiajanlatSubmitButton").on('click', function () {
        let hetfoDatum = $("#hetfoDatePicker").val();
        if ($("#inputhetfoDatePicker").hasClass('jqx-input-invalid')) {
            toastr.error('Csak hétfői napot lehet kiválasztani!');
        } else {
            $.ajax({
                method: 'post',
                url: '/admin/hetiajanlat/new/hetiajanlat',
                data: {
                    hetfoDatum: hetfoDatum
                },
                success: function (data) {
                    toastr.success(data);
                    hetiajanlatDataAdapter.dataBind();
                },
                error: function (data) {
                    toastr.error(data.responseText);
                },
                complete: function () {
                    $("#hetiajanlatModal").modal('hide');
                }
            });
        }
    });

    $("#hetiajanlatModal").on('hidden.bs.modal', function () {
        $('#hetfoDatePicker').jqxDateTimeInput('val', moment().format("yyyy-MM-DD"));
    });

    $("#printHetiAjanlat").on('click', function (){
        window.open('/admin/hetiajanlat/hetiajanlatnyomtatas?id=' + hetiajanlatId, '_blank');
    });

});