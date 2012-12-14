var _date = null;
function IndexLoad(MID, layout) {
    var vLayout = "", vStylesheet = "";
    $.ajax({
        url: "/WidgetsHandler.ashx",
        data: "ModuleID=" + MID,
        dataType: "json",
        type: "post",
        beforeSend: function() {
            // _render();    //正在加载... 
            $("#main").hide();
        },
        complete: function() {
            //setTimeout("removeLoad()", 1200);
            //removeLoad();     $("#main").show();       
        },
        success: function(data) {
            _date = data;
            vLayout = data.root.ew_layout;
            vStylesheet = data.root.ew_stylesheet;
            var tempStyle = "widgetsStyletwo.css";
            if (vLayout != undefined) {
                tempStyle = vLayout;
            } else {
                tempStyle = "widgetsStyletwo.css";
            }
            attachStylesheet(tempStyle, vStylesheet);
            /*****给所有的控件CSS类名包含movable的层的第一个子层加上widget-header类**************************/
            if (layout == 0) //有权限才加样式、显示布局
            {
                $.each($(".widget"), function(index) {
                    $(this).addClass("movable");
                    $("> div[id]", $(this)).addClass("widget-header");
                });
                $("#Float").show();
            }
            else  //隐藏布局按钮
            {
                $("#Float").hide();
            }

            /*************************************************************************************************/
            $.fn.EasyWidgets({
                behaviour: {
                    useCookies: false
                },
                selectors: {
                    places: '.widget_place_left,.widget_place_center,.widget_place_right,.widget_place_top,.widget_place_Flash,.widget_place_center2,.widget_place_right2,.widget-placeholder'
                },
                callbacks: {
                    onRefreshPositions: function() {
                        return data.root.ew_position;
                    },
                    onChangePositions: function(ChedPost) {
                        changedPST = ChedPost;
                    }
                }

            });
            $("#PlaceHolderd").show();
            $("#indexbottom").show();
            //$("#body_main").show();
            //----------EasyWidgets----------------
            removeLoad();
        }
    });    //ajax The End

    /*替换ID*/
    var _list = $("div [id*=identifierwidget]");
    $.each(_list, function(i) {
        var _id = $(_list[i]).attr("id").split("_")[1];
        $(_list[i]).attr("id", _id);
    });

} //Jquery End
/************save widgets****************/
var changedPST = '';
function saveWidgets(_moduleid) {
    if (changedPST != "") {
        _date.root.ew_position = changedPST;
        var _json = "{root:{ew_position:\"" + changedPST + "\",ew_layout:\"" + _date.root.ew_layout + "\",ew_stylesheet:\"" + _date.root.ew_stylesheet + "\"}}";
        $.get("/WidgetsHandler.ashx?widget=" + _json + "&ModuleID=" + _moduleid);
        alert("保存成功!");
    }
    else {
        alert('没有改动！');
    }
    return false;
}
/*****************************************/
/*动态加载样式*/
function attachStylesheet(vWidLayout, vWidStyle) {
    $('<link href=/Css/WidLayout/' + vWidLayout + '?ram=20120214001 rel="stylesheet"  media="screen" type="text/css" />').appendTo("head");

    $('<link href=/Css/WidStyle/' + vWidStyle + '?ram=20120214001 rel="stylesheet"  media="screen" type="text/css" />').appendTo("head");
}

function removeLoad() {
    $("#loadingIx").remove();
    $("#main").show(); 
}
/*Loading...*/
function _render() {
    var _div = $("<div id=\"loadingIx\" style=\"background:white;position:absolute;\"><div id=\"loadContent\" style=\"margin-top:20%; margin-left:auto;width:140px; margin-right:auto\"><object classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" codebase=\"http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,28,0\" width=\"128\" height=\"128\">  <param name=\"movie\" value=\"/images/loading.swf\" />  <param name=\"quality\" value=\"high\" />  <embed src=\"loading.swf\" quality=\"high\" pluginspage=\"http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash\" type=\"application/x-shockwave-flash\" width=\"128\" height=\"128\"></embed></object></div></div>").appendTo("body");
    var _css = _getCss();
    _div.css(_css).show();
    return _div;
}
/*Loading样式*/
function _getCss() {
    //alert($(".body_main").width()+"$$$"+$(".body_main").height());

    var css = {
        display: "none",
        top: 0 + "px",
        left: 0 + "px",
        width: $(document.body).width() + "px",
        height: $(document.body).outerWidth(true) + "px",
        zIndex: 9999,
        opacity: 1
    };
    return css;
}
