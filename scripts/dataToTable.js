var dateInits = [];

function crateThead(item) {
    var thHtml = "";
    switch (item.columnType) {
        case "label":
            thHtml += '<th colspan="' + item.columnCount + '"  rowspan="' + item.tag_height + '"><label> ' + item.name + "</th>";
        default:
            thHtml += '<th colspan="' + item.columnCount + '" rowspan="' + item.tag_height + '"><label flex><span flex-box="0">' +
                item.name + '</span> <input type="text" name=' + item.submitId +
                ' vaule="" flex-box="1"/></label></th>';
            break;
    }
    return thHtml;
}
/**
 * 功能：处理表格头的数据格式，以label + 输入框的形式展示
 * 原因：label和input分开时，大屏中，input距离label较远，可输入的区域较小，所以处理下
 * @ datas 要处理的数据格式
 **/
function formatTableHeadItem(datas) {
    if (!datas.length) {
        return [];
    }
    var htmls = "";
    $(datas).each(function (idx, item) {
        var dataMap = {};
        var htmlstr = "";
        if (Array.isArray(item)) {
            item.forEach(function (item) {
                if (!dataMap[item.submitId]) {
                    dataMap[item.submitId] = item;
                } else {
                    // dataMap[item.submitId] =
                    var colcount =
                        parseInt(item.columnCount) +
                        parseInt(dataMap[item.submitId].columnCount);
                    item.columnCount = colcount;
                    $.extend && $.extend(true, dataMap[item.submitId], item);
                }
            });
        }

        for (var i in dataMap) {
            // newDatas.push(dataMap[i]);
            htmlstr += crateThead(dataMap[i]);
        }
        htmls += htmlstr;
    });
    return "<tr>" + htmls + "</tr>";
}

function dataToTable(tableData, parentId) {
    // var theadHtml = "";
    var theadHtml = formatTableHeadItem(tableData.tableHead);
    // 表体信息
    var trHtml = "";
    tableData.tableBody.forEach(function (tb) {
        var tdHtml = "";
        var tdStr = "";
        tb.forEach(function (item) {
            switch (item.columnType) {
                case "label":
                    var isCheckBox =
                        item.extendType == "checkbox" ?
                        '<span class="hidden placeholder">□</span><input type="checkbox" class="form-check-input"  name=' +
                        item.submitId + " value=" + item.id +  ">" : ""; // to do 增加选中状态后放开
                    tdHtml +=
                        "<td colspan=" + item.columnCount +  ' rowspan=' + item.tag_height + ' class="table-center" data-id=' +
                        item.id +  " >" + item.name +  "  " + isCheckBox + "</td>";
                    break;
                case "text":
                    tdHtml +=
                        "<td colspan=" + item.columnCount + '  rowspan=' + item.tag_height + '><input type="text" name=' +
                            item.submitId + ' value=""/></td>';
                    break;
                case "date":
                    dateInits.push(item.submitId);
                    var data = new Date();
                    var value = data.getFullYear() +  "-" + (data.getMonth() + 1) +
                        "-" + data.getDate();
                    tdHtml +=
                        "<td colspan=" + item.columnCount + '  rowspan=' + item.tag_height + ' class="table-center"><input type="text" id="datapicker' +
                            item.submitId + '" name=' + item.submitId + ' value="' + 
                            '"/></td>';
                    break;
                case "checkbox":
                    var checkFormHtml = "";
                    var checkStr = "";
                    var eleName = "";
                    // 做一个样式测试
                    if (
                        (item.submitId == 11 || item.submitId == 12) &&
                        item.options
                    ) {
                        item.direction = 1;
                    } else if (item.submitId == 13 && item.options) {
                        item.direction = 2;
                    } else if (item.submitId == 14 && item.options) {
                        item.direction = 0;
                    }
                    var joint = "\n";
                    switch (item.direction) {
                        case 1:
                            joint = "<br/>";
                            break;
                        case 0:
                        case 2:
                        default:
                            // joint = "";
                            break;
                    }

                    (item.options || []).forEach(function (checkItem) {
                        checkStr +=
                            '<label class="form-check-label" style="padding-right:10px;">' +
                            '<span class="hidden placeholder">□</span><input type="checkbox" value=' +
                            checkItem.id + " name=" + item.submitId + ' class="form-check-input"> ' +
                            checkItem.name + "</label>" + joint;
                    });
                    tdHtml +=
                        "<td colspan=" +
                        item.columnCount +
                        "  rowspan=" + item.tag_height + " data-id=" +
                        item.id +
                        ' style="text-align:left">  <div style="padding:0 15px;">' +
                        checkStr +
                        " </div></td>";
                    break;
            }
            tdStr = "<tr>" + tdHtml + "</tr>";
        });
        trHtml += tdStr;
    });

    $(".table-html .table-header").html(theadHtml);
    $(".table-html .table-body").html(trHtml);
    $(".table-html .table-desc").html(tableData.desc);
    $(parentId).find('.table-wp').append($(".table-html").html());
    dateInits.forEach(function (idx) {
        $("#datapicker" + idx).datepicker({
            language: "zh-CN",
            autoclose: true, //选中之后自动隐藏日期选择框
            // clearBtn: true, //清除按钮
            todayBtn: true, //今日按钮
            todayHighlight: true,
            format: "yyyy-mm-dd",
            viewDate: new Date(),
        });
    });
}

// 图片转换
function changeImgToDataurl() {
    var charImg = document.getElementsByTagName("img");
    var imgURLs = "";
    for (var i = 0; i < charImg.length; i++) {
      var imgURL = charImg[i].currentSrc;
      getBase64(imgURL, charImg[i]);
    }
  }

  function getBase64(url, charImg) {
    var Img = new Image();
    Img.crossOrigin = "Anonymous"; //跨域必须使用，且后台也得设置允许跨域
    dataURL = '';
    Img.src = url;
    Img.onload = function () { //要先确保图片完整获取到，这是个异步事件
      var canvas = document.createElement("canvas"), //创建canvas元素
        width = Img.width, //确保canvas的尺寸和图片一样
        height = Img.height;
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(Img, 0, 0, width, height); //将图片绘制到canvas中
      dataURL = canvas.toDataURL('image/jpg'); //转换图片为dataURL
      condataurl ? condataurl(dataURL, charImg) : null; //调用回调函数
    };
  }

  function condataurl(dataURL, charImg) {
    charImg.src = dataURL;
    //console.log(charImg);
  }