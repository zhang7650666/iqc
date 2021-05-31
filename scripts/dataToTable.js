var dateInits = [];

function crateThead(item) {
  var thHtml = "";
  switch (item.columnType) {
    case "label":
      thHtml +=
        '<th colspan="' +
        item.columnCount +
        '"  rowspan="' +
        item.tag_height +
        '"><label> ' +
        item.name +
        "</th>";
    default:
      thHtml +=
        '<th colspan="' +
        item.columnCount +
        '" rowspan="' +
        item.tag_height +
        '"><label flex><span flex-box="0">' +
        item.name +
        '</span> <input type="text" name=' +
        item.submitId +
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
    var tdStr = "";
    tb.forEach(function (item) {
      var tdHtml = "";
      switch (item.columnType) {
        case "label":
          var checked = item.value ? " checked=checked" : "";
          var isCheckBox =
            item.extendType == "checkbox"
              ? '<span class="hidden placeholder">□</span><input type="checkbox" class="form-check-input"  name=' +
                item.submitId +
                "value=" +
                item.id +
                checked +
                ">"
              : ""; // to do 增加选中状态后放开
          tdHtml =
            '<span class=="font-weight">' + item.name + "</span> " + isCheckBox;
          break;
        case "text":
          // debugger;
          var place = item.valueExtPos == "bottom" ? "<br/>" : "";
          var isRight = item.valueExtPos == "right";
          tdHtml =
            '<input type="text" name=' +
            item.submitId +
            (isRight ? ' style="width:70%"' : "") +
            ' value="' +
            (item.value || "") +
            '"/><span class="hidden placeholder"></span> ' +
            place +
            (item.valueExt || "");
          break;
        case "date":
          dateInits.push(item.submitId);
          var data = new Date();
          var value =
            item.value && /^[1-9]\d{3}\-\d{2}\-\d{2}$/.test(item.value)
              ? item.value
              : data.getFullYear() +
                "-" +
                (data.getMonth() + 1) +
                "-" +
                data.getDate();
          tdHtml =
            '<input type="text" id="datapicker' +
            item.submitId +
            '" name=' +
            item.submitId +
            ' value="' +
            value +
            '"/><span class="hidden placeholder"></span>';
          break;
        case "checkbox":
          var checkStr = "";
          // 做一个样式测试
          var joint = "";
          var className = "";
          // ，0：竖，1：横，2：就是检测项目这个无特定顺序
          // 0-无序，1-横向，2-纵向
          switch (item.direction) {
            case 1:
              // joint = "";
              className = "txt-center";
              break;
            case 0:
              // joint = "";
              // className = "txt-left";
              break;
            case 2:
              joint = "<br/>";
              className = "txt-left";
            default:
              // joint = "";
              break;
          }
          var ids = (item.value || "").split(",").filter(function (v) {
            return v;
          });
          (item.options || []).forEach(function (checkItem) {
            var checked =
              ids.indexOf(checkItem.id + "") > -1 ? " checked=checked" : "";
            checkStr +=
              '<label class="form-check-label" style="padding-right:10px;">' +
              '<span class="hidden placeholder">□</span><input type="checkbox" value=' +
              checkItem.id +
              " name=" +
              item.submitId +
              checked +
              ' class="form-check-input"> ' +
              checkItem.name +
              "</label>" +
              joint;
          });
          tdHtml +=
            '<div style="padding:0 15px;" class="' +
            className +
            '">' +
            checkStr +
            " </div>";
          break;
      }

      var colspan =
        item.columnCount && item.columnCount > 1
          ? "colspan=" + item.columnCount
          : "";
      var rowspan =
        item.tag_height && item.tag_height > 1
          ? "rowspan=" + item.tag_height
          : "";
      var dataid = item.id != null ? "data-id=" + item.id : "";
      var classNams = item.direction == 1 ? "txt-left" : ""; //table-center
      tdStr +=
        "<td " +
        colspan +
        rowspan +
        dataid +
        ' class=" ' +
        classNams +
        ' "' +
        " >" +
        tdHtml +
        "</td>";
    });
    trHtml += "<tr>" + tdStr + "</tr>";
  });

  var temp = $("#tableTemp").html();
  temp = temp.replace("__TABLE_HEADER__", theadHtml);
  temp = temp.replace("__TABLE_BODY", trHtml);
  temp = temp.replace("__TABLE_DESC", tableData.desc);
  $(".table-donwload-section").append(temp);
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
  dataURL = "";
  Img.src = url;
  Img.onload = function () {
    //要先确保图片完整获取到，这是个异步事件
    var canvas = document.createElement("canvas"), //创建canvas元素
      width = Img.width, //确保canvas的尺寸和图片一样
      height = Img.height;
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d").drawImage(Img, 0, 0, width, height); //将图片绘制到canvas中
    dataURL = canvas.toDataURL("image/jpg"); //转换图片为dataURL
    condataurl ? condataurl(dataURL, charImg) : null; //调用回调函数
  };
}

function condataurl(dataURL, charImg) {
  charImg.src = dataURL;
  //console.log(charImg);
}
