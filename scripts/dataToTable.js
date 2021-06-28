function crateThead(item, rules, messages) {
  var thHtml = "";
  switch (item.columnType) {
    case "label":
      thHtml +=
        '<th colspan="' +
        item.columnType +
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
        item.columnType +
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
 */
function dataToTable(tableData, parentId, map, sourceData, isProhibitEdit) {
  var theadHtml = "";
  var dateInits = [];
  var headData = $.extend([], tableData.tableHead);
  theadHtml = formatTableHeadItem(headData, map.rules, map.messages);
  // 表体信息
  var trHtml = "";
  tableData.tableBody.forEach(function (tb) {
    var tdStr = "";
    var tdW = 100 / parseInt(sourceData.columns);
    var trLine4 = ""; // 设置th class的目的是为了打印时可以有行高
    var trLine1 = "";
    var isRowAnExclusiveLine = false;
    var isFlog = false;
    var tagHeight = 1;
    tb.forEach(function (item) {
      var tdHtml = "";
      var parentAttr = "";
      // 计算高度
      if (!isFlog) {
        tagHeight = item.tag_height;
        isFlog = true;
      } else {
        isRowAnExclusiveLine = !!(tagHeight == item.tag_height);
      }

      // 禁止编辑
      var disab = isView ? ' disabled="disabled"' : "";
      // var disab = ''; // to do 放开
      if (parentId == "#loginForm2") {
        trLine1 = "tr-line1";
        if (item.name == "有见证送检章") {
          trLine4 = "tr-line4";
        }
      }
      switch (item.columnType) {
        case "label":
          var checked = item.value ? " checked=checked" : "";
          var isCheckBox = "";
          if (item.name == "见证" || item.name == "复试") {
            isCheckBox =
              '<span class="hidden placeholder">□</span><input type="radio" class="form-check-input"  name=' +
              "testStatus" +
              " value=" +
              item.id +
              checked +
              " sid=sid_" +
              item.submitId +
              disab +
              " style=position:relative;top:2px />";
          } else {
            isCheckBox =
              item.extendType == "checkbox"
                ? '<span class="hidden placeholder">□</span><input type="checkbox" class="form-check-input"  name=sid_' +
                  item.submitId +
                  " value=" +
                  item.id +
                  checked +
                  disab +
                  ">"
                : ""; // to do 增加选中状态后放开
          }

          tdHtml =
            "<span class='label-text'>" + item.name + "</span> " + isCheckBox;
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
              (item.valueExt ? ' class="value-ext"' : "") +
              "/> " +
              place +
              (item.valueExt || "");
            // (item.valueExt
            //   ? '<span class="text-gary">' + item.valueExt + "</span>"
            //   : "");
          } else {
            tdHtml = "<div class='txt-left'>" + item.value + "</div> ";
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
          var value =
            item.value && /^[1-9]\d{3}\-\d{2}\-\d{2}$/.test(item.value)
              ? item.value
              : ymd();

          var required = map.rules["sid_" + item.submitId]
            ? 'required="true"'
            : "";
          // value="' +
          // (item.value ? ymd_format(item.value) : ymd_format(value)) +
          // (item.value ? moment(item.value).format('YYYY年MM月DD日'):  moment(value).format('YYYY年MM月DD日')) +
          var isDate = item.value.indexOf("年");
          var dateVal =
            isDate > -1
              ? item.value
              : moment(item.value).format("YYYY年MM月DD日");
          tdHtml =
            '<input data-date-format="yyyy年mm月dd日" iptdate="ipt-date" type="text" ' +
            required +
            ' id="datapicker' +
            item.submitId +
            '" name=sid_' +
            item.submitId +
            ' value="' +
            dateVal +
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
          // debugger;
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
          // debugger;
          (item.options || []).forEach(function (checkItem) {
            var checked =
              ids.indexOf(checkItem.id + "") > -1 ? " checked=checked" : "";
            var classOther =
              checkItem.name == "其他："
                ? "form-check-input class-other"
                : "form-check-input ";
            var checkVal = checkItem.value ? checkItem.value : '""';
            checkStr +=
              '<label class="form-check-label" style="padding-right:10px;">' +
              '<span class="hidden placeholder">□</span><input type="checkbox" value= ' +
              checkVal +
              " name=sid_" +
              item.submitId +
              " subVal=" +
              checkVal +
              " subSid=sid_" +
              checkItem.submitId +
              disab +
              checked +
              ' class="' +
              classOther +
              '"> ' +
              checkItem.name +
              "</label>" +
              joint;
          });

          tdHtml +=
            '<div style="padding:0 5px;" class="' +
            className +
            '">' +
            checkStr +
            " </div>";
          break;
        case "fill":
          var place = item.valueExtPos == "bottom" ? "<br/>" : "";
          var isRight = item.valueExtPos == "right";
          var required = map.rules["sid_" + item.submitId]
            ? 'required="true"'
            : "";
          // var testStr = "<div class='main'>第<span style='text-decoration:underline'>&nbsp;&nbsp;</span>步～<span style='text-decoration:underline'>&nbsp;&nbsp;</span>步<br/>第<span style='text-decoration:underline'>&nbsp;&nbsp;</span>点~<span style='text-decoration:underline'>&nbsp;&nbsp;</span>点<br/>共<span style='text-decoration:underline'>&nbsp;&nbsp;</span>步，<span style='text-decoration:underline'>&nbsp;&nbsp;</span>点</div>"
          var tempHtmls = item.value ? item.value : item.valueExt;
          tdHtml +=
            '<label class="form-check-label step-wp" style="padding-right:10px;" data-sid="sid_' +
            item.submitId +
            '">' +
            tempHtmls +
            "</label>";
          break;
        case "qrcode":
          var required = map.rules["sid_" + item.submitId]
            ? 'required="true"'
            : "";
          // var testStr = "<div class='main'>第<span style='text-decoration:underline'>&nbsp;&nbsp;</span>步～<span style='text-decoration:underline'>&nbsp;&nbsp;</span>步<br/>第<span style='text-decoration:underline'>&nbsp;&nbsp;</span>点~<span style='text-decoration:underline'>&nbsp;&nbsp;</span>点<br/>共<span style='text-decoration:underline'>&nbsp;&nbsp;</span>步，<span style='text-decoration:underline'>&nbsp;&nbsp;</span>点</div>"
          var tempHtmls = item.value ? item.value : item.valueExt;
          tdHtml +=
            '<div class="qr-code code-pos" style="width: 80px;height: 80px; overflow:hidden;text-align: right">\
            <img src="" alt="" class="witness-code"  width="80px" height="80px"/>\
          </div>';
          break;
      }
      var columnCount = item.tagColumCount || item.columnCount || 1;
      var classNams = item.direction == 1 ? "txt-left" : ""; //table-center
      if (item.name && item.name.indexOf("见证记录<br/>表") != -1) {
        var jzStr1 = item.name.split("<br/>")[0];
        var jzStr2 = item.name.split("<br/>")[1];
        var testHtml = "";
        testHtml += '<div class="jz-str1">' + jzStr1 + "</div>";
        testHtml += '<div class="jz-str2"><br/>' + jzStr2 + "<br/></div>";
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
        // parentAttr +=
        //   item.columnType == "label" ? " width:" + tdW.toFixed(2) + "%" : "";
        parentAttr +=
          "width:" + parseInt(tdW) + "%;" + "padding: 0 5px;text-align:center;";
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
    trLine1 = trLine4 ? "" : trLine1;
    var extendTd = "";
    if (isRowAnExclusiveLine && tagHeight > 2) {
      for (var i = 0; i < tagHeight - 1; i++) {
        extendTd += "<tr></tr>";
      }
    }
    trHtml +=
      "<tr \
    class='" +
      trLine1 +
      trLine4 +
      "'\
    >" +
      tdStr +
      "</tr>" +
      extendTd;
    //  + trLine4 +
    // "'\
  });

  var temp = $("#tableTemp").html();

  temp = temp.replace("__TABLE_HEADER__", theadHtml);
  temp = temp.replace("__TABLE_BODY", trHtml);
  temp = temp.replace("__TABLE_DESC", tableData.desc || "");
  $(parentId).find(".table-donwload-section").append(temp);
  if (headData.length == 0) {
    $(parentId).find(".table-header").remove();
  }
  if ("#loginForm2" == parentId) {
    $(parentId).find("table tbody").addClass("table-win");
    $(parentId).find("table").attr("style", "border: 2px solid #000;");
  }
  dateInits.forEach(function (idx) {
    // setDate: moment().format("YYYY年MM月DD日")
    $("#datapicker" + idx).attr("readonly", "readonly");
    $("#datapicker" + idx)
      .datepicker({
        language: "zh-CN",
        autoclose: true, //选中之后自动隐藏日期选择框
        // clearBtn: true, //清除按钮
        todayBtn: true, //今日按钮
        todayHighlight: true,
        format: "yyyy年mm月dd日",
        // viewDate: new Date(),
      })
      .on("changeDate", function (ev) {
        $(ev.currentTarget).datepicker(
          "setStartDate",
          moment(ev.date).format("YYYY年MM月DD日")
        );
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
