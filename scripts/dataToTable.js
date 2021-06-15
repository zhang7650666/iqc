function crateThead(item, rules, messages) {
  var thHtml = "";
  switch (item.columnType) {
    case "label":
      thHtml +=
        '<th colspan="' +
        item.tagColumCount +
        '"  rowspan="' +
        item.tag_height +
        '"><label> ' +
        item.name +
        "</th>";
      // is_required 【是否必填：0-否，1-是】
      //处理校验信息
      if (!!item.is_required) {
        rules["sid_" + item.submitId] = { required: true };
        messages["sid_" + item.submitId] = { required: "必填项" };
      }
    default:
      var required = rules["sid_" + item.submitId] ? 'required="true"' : "";
      thHtml +=
        '<th colspan="' +
        item.tagColumCount +
        '" rowspan="' +
        item.tag_height +
        '"><label flex><span flex-box="0">' +
        item.name +
        '</span> <input type="text" ' +
        required +
        " name=sid_" +
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
function formatTableHeadItem(datas, rules, messages) {
  if (!datas.length) {
    return [];
  }
  var htmls = "";
  $(datas).each(function (idx, item) {
    var dataMap = {};
    var htmlstr = "";
    if (Array.isArray(item)) {
      item.forEach(function (item) {
        var submitId = parseInt(item.submitId);
        if (!dataMap[submitId]) {
          dataMap[submitId] = item;
        } else {
          // dataMap[item.submitId] =
          var colcount =
            parseInt(item.tagColumCount) +
            parseInt(dataMap[submitId].tagColumCount || 1);
          item.tagColumCount = colcount;
          $.extend && $.extend(true, dataMap[submitId], item);
        }
      });
    }
    for (var i in dataMap) {
      htmlstr += crateThead(dataMap[i], rules, messages);
    }
    htmls += htmlstr;
  });
  return "<tr>" + htmls + "</tr>";
}

/**
 *
 * @param {*} tableData  要处理的表格数据
 * @param {*} parentId 父级元素id
 * @param {*} map 校验的map
 * @param {*} sourceData 接口全数据
 * @param {*} isProhibitEdit 是否禁止编辑 to:用于见证记录内容不可编辑
 * @param {*} disabledEdit 禁止编辑
 */
function dataToTable(
  tableData,
  parentId,
  map,
  sourceData,
  isProhibitEdit,
  disabledEdit
) {
  // var theadHtml = "";
  var dateInits = [];
  var headData = $.extend([], tableData.tableHead);
  var theadHtml = formatTableHeadItem(headData, map.rules, map.messages);
  // 表体信息
  console.log(6666, tableData);
  var trHtml = "";
  tableData.tableBody.forEach(function (tb) {
    var tdStr = "";
    var tdW = 100 / parseInt(sourceData.columns);
    tb.forEach(function (item) {
      var tdHtml = "";
      var parentAttr = "";
      // 禁止编辑
      var disab = disabledEdit && ' disabled="true"';
      switch (item.columnType) {
        case "label":
          var checked = item.value ? " checked=checked" : "";
          var isCheckBox =
            item.extendType == "checkbox"
              ? '<span class="hidden placeholder">□</span><input type="checkbox" class="form-check-input"  name=sid_' +
                item.submitId +
                " value=" +
                item.id +
                checked +
                disab +
                ">"
              : ""; // to do 增加选中状态后放开
          tdHtml =
            '<span class="font-weight">' + item.name + "</span> " + isCheckBox;
          parentAttr = "text-align:center;";
          if (!!item.is_required) {
            map.rules["sid_" + item.submitId + "_0"] = { required: true };
            map.messages["sid_" + item.submitId + "_0"] = {
              required: "必填项",
            };
          }
          break;
        case "text":
          if (!isProhibitEdit || (isProhibitEdit && !item.value)) {
            // debugger;
            var place = item.valueExtPos == "bottom" ? "<br/>" : "";
            var isRight = item.valueExtPos == "right";
            var required = map.rules["sid_" + item.submitId]
              ? 'required="true"'
              : "";

            tdHtml =
              '<input type="text" ' +
              required +
              " name=sid_" +
              item.submitId +
              (isRight ? ' style="width:70%"' : "") +
              ' value="' +
              (item.value || "") +
              '" ' +
              disab +
              "/> " +
              place +
              (item.valueExt || "");
            // (item.valueExt
            //   ? '<span class="text-gary">' + item.valueExt + "</span>"
            //   : "");
          } else {
            tdHtml = "<div class='txt-left p-xs'>" + item.value + "</div> ";
          }
          break;
        case "textarea":
          // var place = item.valueExtPos == "bottom" ? "<br/>" : "";
          // var isRight = item.valueExtPos == "right";
          var required = map.rules["sid_" + item.submitId]
            ? 'required="true"'
            : "";
          value = (item.valueExt || "").replace(/<br\/>\n/g, "");
          tdHtml =
            "<textarea " +
            (value ? " placeholder=" + value : "") +
            required +
            " name=sid_" +
            item.submitId +
            // (isRight ? ' style="width:70%"' : "") +
            ' value="' +
            (item.value || "") +
            '" ' +
            disab +
            "></textarea>";

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

          var required = map.rules["sid_" + item.submitId]
            ? 'required="true"'
            : "";

          tdHtml =
            '<input type="text" ' +
            required +
            ' id="datapicker' +
            item.submitId +
            '" name=sid_' +
            item.submitId +
            ' value="' +
            value +
            '" ' +
            disab +
            "/>";
          break;
        case "checkbox":
          var checkStr = "";
          // 做一个样式测试
          var joint = "";
          var className = "";
          // 0-无序，1-横向，2-纵向
          switch (item.direction) {
            case 1:
              // joint = "";
              className = "txt-center";
              break;
            case 0:
              // joint = "";
              className = "txt-left";
              break;
            case 2:
              joint = "<br/>";
              className = "txt-left";
            default:
              // joint = "";
              break;
          }
          var ids = ((item.value && item.value.toString()) || "")
            .split(",")
            .filter(function (v) {
              return v;
            });
          (item.options || []).forEach(function (checkItem) {
            var checked =
              ids.indexOf(checkItem.id + "") > -1 ? " checked=checked" : "";
            checkStr +=
              '<label class="form-check-label" style="padding-right:10px;">' +
              '<span class="hidden placeholder">□</span><input type="checkbox" value=' +
              checkItem.id +
              " name=sid_" +
              item.submitId +
              disab +
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
      var columnCount = item.tagColumCount || item.columnCount || 1;
      var classNams = item.direction == 1 ? "txt-left" : ""; //table-center
      if (item.name && item.name.indexOf("见证记录<br/>表") != -1) {
        var jzStr1 = item.name.split("<br/>")[0];
        var jzStr2 = item.name.split("<br/>")[1];
        var testHtml = "";
        testHtml += '<div class="jz-str1">' + jzStr1 + "</div>";
        testHtml += '<div class="jz-str2">' + jzStr2 + "</div>";
        tdStr +=
          "<td \
          colspan='" +
          columnCount +
          "'\
          rowspan='" +
          item.tag_height +
          "'\
          data-id='" +
          (item.id || "") +
          "'\
          class='" +
          classNams +
          "'\
          style='" +
          parentAttr +
          "'\
          >" +
          testHtml +
          "</td>";
      } else {
        parentAttr += " width:" + tdW + "%";
        tdStr +=
          "<td \
          colspan='" +
          columnCount +
          "'\
          rowspan='" +
          item.tag_height +
          "'\
          data-id='" +
          item.id +
          "'\
          class='" +
          classNams +
          "'\
          style='" +
          parentAttr +
          "'\
          >" +
          tdHtml +
          "</td>";
      }
    });
    trHtml += "<tr>" + tdStr + "</tr>";
  });

  var temp = $("#tableTemp").html();

  temp = temp.replace("__TABLE_HEADER__", theadHtml);
  temp = temp.replace("__TABLE_BODY", trHtml);
  temp = temp.replace("__TABLE_DESC", tableData.desc || "");
  $(parentId).find(".table-donwload-section").append(temp);
  if (headData.length == 0) {
    $(parentId).find(".table-header").remove();
  }
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
