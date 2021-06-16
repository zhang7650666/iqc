/**
 * HOMER - Responsive Admin Theme
 * version 1.9
 *
 */

$(document).ready(function () {
  // Add special class to minimalize page elements when screen is less than 768px
  setBodySmall();

  // Handle minimalize sidebar menu
  $(".hide-menu").on("click", function (event) {
    event.preventDefault();
    if ($(window).width() < 769) {
      $("body").toggleClass("show-sidebar");
    } else {
      $("body").toggleClass("hide-sidebar");
    }
  });

  // Initialize metsiMenu plugin to sidebar menu
  // $("#side-menu").metisMenu();

  // Initialize iCheck plugin
  $(".i-checks").iCheck({
    checkboxClass: "icheckbox_square-green",
    radioClass: "iradio_square-green",
  });

  // Initialize animate panel function
  $(".animate-panel").animatePanel();

  // Function for collapse hpanel
  $(".showhide").on("click", function (event) {
    event.preventDefault();
    var hpanel = $(this).closest("div.hpanel");
    var icon = $(this).find("i:first");
    var body = hpanel.find("div.panel-body");
    var footer = hpanel.find("div.panel-footer");
    body.slideToggle(300);
    footer.slideToggle(200);

    // Toggle icon from up to down
    icon.toggleClass("fa-chevron-up").toggleClass("fa-chevron-down");
    hpanel.toggleClass("").toggleClass("panel-collapse");
    setTimeout(function () {
      hpanel.resize();
      hpanel.find("[id^=map-]").resize();
    }, 50);
  });

  // Function for close hpanel
  $(".closebox").on("click", function (event) {
    event.preventDefault();
    var hpanel = $(this).closest("div.hpanel");
    hpanel.remove();
    if ($("body").hasClass("fullscreen-panel-mode")) {
      $("body").removeClass("fullscreen-panel-mode");
    }
  });

  // Fullscreen for fullscreen hpanel
  $(".fullscreen").on("click", function () {
    var hpanel = $(this).closest("div.hpanel");
    var icon = $(this).find("i:first");
    $("body").toggleClass("fullscreen-panel-mode");
    icon.toggleClass("fa-expand").toggleClass("fa-compress");
    hpanel.toggleClass("fullscreen");
    setTimeout(function () {
      $(window).trigger("resize");
    }, 100);
  });

  // Open close right sidebar
  $(".right-sidebar-toggle").on("click", function () {
    $("#right-sidebar").toggleClass("sidebar-open");
  });

  // Function for small header
  $(".small-header-action").on("click", function (event) {
    event.preventDefault();
    var icon = $(this).find("i:first");
    var breadcrumb = $(this).parent().find("#hbreadcrumb");
    $(this).parent().parent().parent().toggleClass("small-header");
    breadcrumb.toggleClass("m-t-lg");
    icon.toggleClass("fa-arrow-up").toggleClass("fa-arrow-down");
  });

  // Set minimal height of #wrapper to fit the window
  setTimeout(function () {
    fixWrapperHeight();
  });

  // Sparkline bar chart data and options used under Profile image on left navigation panel
  $("#sparkline1").sparkline([5, 6, 7, 2, 0, 4, 2, 4, 5, 7, 2, 4, 12, 11, 4], {
    type: "bar",
    barWidth: 7,
    height: "30px",
    barColor: "#62cb31",
    negBarColor: "#53ac2a",
  });

  // Initialize tooltips
  $(".tooltip-demo").tooltip({
    selector: "[data-toggle=tooltip]",
  });

  // Initialize popover
  $("[data-toggle=popover]").popover();

  // Move modal to body
  // Fix Bootstrap backdrop issu with animation.css
  $(".modal").appendTo("body");
});

$(window).bind("load", function () {
  // Remove splash screen after load
  $(".splash").css("display", "none");
});

$(window).bind("resize click", function () {
  // Add special class to minimalize page elements when screen is less than 768px
  setBodySmall();

  // Waint until metsiMenu, collapse and other effect finish and set wrapper height
  setTimeout(function () {
    fixWrapperHeight();
  }, 300);
});

function fixWrapperHeight() {
  // Get and set current height
  var headerH = 62;
  var navigationH = $("#navigation").height();
  var contentH = $(".content").height();

  // Set new height when contnet height is less then navigation
  if (contentH < navigationH) {
    $("#wrapper").css("min-height", navigationH + "px");
  }

  // Set new height when contnet height is less then navigation and navigation is less then window
  if (contentH < navigationH && navigationH < $(window).height()) {
    $("#wrapper").css("min-height", $(window).height() - headerH + "px");
  }

  // Set new height when contnet is higher then navigation but less then window
  if (contentH > navigationH && contentH < $(window).height()) {
    $("#wrapper").css("min-height", $(window).height() - headerH + "px");
  }
}

function setBodySmall() {
  if ($(this).width() < 769) {
    $("body").addClass("page-small");
  } else {
    $("body").removeClass("page-small");
    $("body").removeClass("show-sidebar");
  }
}

// Animate panel function
$.fn["animatePanel"] = function () {
  var element = $(this);
  var effect = $(this).data("effect");
  var delay = $(this).data("delay");
  var child = $(this).data("child");

  // Set default values for attrs
  if (!effect) {
    effect = "zoomIn";
  }
  if (!delay) {
    delay = 0.06;
  } else {
    delay = delay / 10;
  }
  if (!child) {
    child = ".row > div";
  } else {
    child = "." + child;
  }

  //Set defaul values for start animation and delay
  var startAnimation = 0;
  var start = Math.abs(delay) + startAnimation;

  // Get all visible element and set opacity to 0
  var panel = element.find(child);
  panel.addClass("opacity-0");

  // Get all elements and add effect class
  panel = element.find(child);
  panel.addClass("stagger").addClass("animated-panel").addClass(effect);

  var panelsCount = panel.length + 10;
  var animateTime = (panelsCount * delay * 10000) / 10;

  // Add delay for each child elements
  panel.each(function (i, elm) {
    start += delay;
    var rounded = Math.round(start * 10) / 10;
    $(elm).css("animation-delay", rounded + "s");
    // Remove opacity 0 after finish
    $(elm).removeClass("opacity-0");
  });

  // Clear animation after finish
  setTimeout(function () {
    $(".stagger").css("animation", "");
    $(".stagger")
      .removeClass(effect)
      .removeClass("animated-panel")
      .removeClass("stagger");
  }, animateTime);
};

if ($.validator) {
  $.validator.addMethod(
    "isMobile",
    function (value, element) {
      var length = value.length;
      var mobile =
        /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
      return this.optional(element) || (length == 11 && mobile.test(value));
    },
    "手机号码格式错误"
  ); //可以自定义默认提示信息
  $.validator.addMethod(
    "isCid",
    function (value, element) {
      var length = value.length;
      console.log("value", value);
      var mobile = /^W((19\d{2})|(2\d{3}))\d{4}$/;
      console.log(888, mobile.test(value));
      return this.optional(element) || (length == 9 && mobile.test(value));
    },
    "工程编号必须以大写W开头 W+年份+4位数字,年份必须在(1999-2999)之间 如W20001234"
  ); //可以自定义默认提示信息
}

// toastr 提示配置
if (window.toastr) {
  toastr.options = {
    // debug: false,
    newestOnTop: false,
    positionClass: "toast-top-center",
    closeButton: true,
    showDuration: "100",
    hideDuration: "1000",
    timeOut: "3000",
    // toastClass: "animated fadeInDown",
  };
}

//errorCodeMap
var errorCodeMap = {
  0: "无效的token或token已过期",
  201: "密码不正确",
  202: "验证码不正确",
  203: "用户不存在",
  204: "用户已存在",
  205: "工程编号不正确",
};

//获取token
function getUserInfo() {
  var info = localStorage.getItem("iqc_user_info");
  try {
    info = JSON.parse(info);
  } catch (e) {}
  return info;
}

var userInfo = getUserInfo();

var whiteList = ["login/", "register/"];
var baseUrl = "http://meterial.cxhy.cn/";
//ajax错误信息统一捕获处理
$.ajaxSetup({
  contentType: "application/x-www-form-urlencoded;charset=utf-8",
  beforeSend: function (xhr, ajaxobj) {
    //处理get方式请求，统一添加token
    if (whiteList.indexOf(baseUrl + ajaxobj.url) > -1) {
      return;
    }
    if (ajaxobj.type === "GET" && ajaxobj.url.indexOf("token") == -1) {
      ajaxobj.url =
        ajaxobj.url +
        (ajaxobj.url.indexOf("?") > -1 ? "&token=" : "?token=") +
        (userInfo.token || "");
    }

    if (ajaxobj.type === "POST" && ajaxobj.data) {
      var data = {};
      try {
        data = JSON.parse(ajaxobj.data);
        data.token = userInfo.token || "";
      } catch (e) {}

      ajaxobj.data = JSON.stringify(data);
    }
  },
  complete: function (XMLHttpRequest) {
    //通过XMLHttpRequest取得响应结果
    var res = XMLHttpRequest.responseText;
    var jsonData = JSON.parse(res);
    if (errorCodeMap[jsonData.code]) {
      toastr && toastr.warning(errorCodeMap[jsonData.code]);
      setTimeout(() => {
        window.location.href = "./login-y.html";
      }, 2000);
    }
    //正常情况就不统一处理了
  },
  statusCode: {
    // 504: function () {
    //   alert("数据获取/输入失败，服务器没有响应。504");
    // },
    500: function () {
      alert("服务器有误。500");
    },
  },
});

function query2obj(url) {
  /**
   * 200902 修复没有参数的URL会返回： {url: ''}
   * 原因： index为 -1;  index + 1 = 0;
   *
   */
  var index = url.lastIndexOf("?");
  index = index === -1 ? url.indexOf("&") : index;
  if (index === -1) {
    return {};
  }
  var query = url.substr(index + 1);
  var params = query.split("&");
  var len = params.length;
  var result = {};
  for (var i = 0; i < len; i++) {
    if (!params[i]) {
      continue;
    }
    var param = params[i].split("=");
    var key = param[0];
    var value = param[1];
    var item = result[key];
    if ("undefined" === typeof item) {
      result[key] = value;
    } else if (Array.isArray(item)) {
      item.push(value);
    } else {
      // 这里只可能是string了
      result[key] = [item, value];
    }
  }
  return result;
}

function obj2query(obj) {
  return Object.keys(obj)
    .map((i) => `${i}=${obj[i]}`)
    .join("&");
}

//退出登陆
$(".logoutBtn").on("click", function (e) {
  swal &&
    swal(
      {
        title: "提示",
        text: "确认退出登陆？",
        // type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        closeOnConfirm: false,
        // closeOnCancel: false,
      },
      function (isConfirm) {
        if (isConfirm) {
          //退出登陆，清除token, 跳转登陆页
          $.ajax({
            url: "http://meterial.cxhy.cn/logout/",
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            data: "{}",
            success: function (res) {
              if (res.code == 200) {
                toastr && toastr.success("已退出登陆！");
                localStorage.setItem("iqc_user_info", "");
                setTimeout(function () {
                  window.location.href = "./login-y.html";
                }, 1000);
              }
            },
            error: function (error) {},
          });
        }
      }
    );
});

//递归生成菜单
function getMemu(data, num) {
  num = num || 0;
  num++;
  var htmls =
    (num > 1 ? "<ul class='nav nav-second-level'>" : "") +
    menuUnit(data, num) +
    (num > 1 ? "</ul>" : "");

  // console.log("htmls", htmls);
  return htmls;
}

function menuUnit(data, num) {
  var str = "";
  var queryObj = query2obj(window.location.href);
  $.each(data, function (idx, opt) {
    var isChild = opt.items && opt.items.length ? true : false;
    var child = isChild ? getMemu(opt.items, num) : "";
    // "<a href='#' class='targetPoint' data-id=" + opt.id + "'>"
    var isActive = queryObj.classifyId == opt.id ? "active" : "";
    str +=
      "<li class='" +
      isActive +
      "'>" +
      (isChild
        ? "<a href='javascript:void()'>"
        : "<a href='javascript:void()' class='targetPoint " +
          (isActive ? "hight" : "") +
          "' data-form_id=" +
          opt.form_id +
          "  data-id=" +
          opt.id +
          ">") +
      "<span class='nav-label'>" +
      opt.classify_name +
      "</span>" +
      (isChild ? " <span class='fa arrow'></span></a>" : "") +
      child +
      "</li>";
  });

  // debugger;
  return str;
}

function getFirstData(data) {
  if (!Array.isArray(data)) {
    return "";
  }
  var item;
  if (data[0] && data[0].items && data[0].items.length) {
    item = getFirstData(data[0].items);
  } else {
    item = data[0];
  }
  return item;
  // return data[0] && data[0].items ? getFirstData(data[0].items) : data[0];
}

//动态生成分类列表
var queryObj = query2obj(window.location.href);
function createList(cb) {
  //loading
  $.get("http://meterial.cxhy.cn/getClassifyList/", function (res) {
    var data = res.data;
    // 初始高亮表格
    var activeData = getFirstData(data);
    if (window.history && activeData) {
      queryObj.classifyId = activeData.id || ""; // classId
      queryObj.form_id = activeData.form_id || "";
      var query = "?" + obj2query(queryObj);
      history.replaceState(null, "", query);
      cb && cb();
    }

    var menus = getMemu(data);
    $("#side-menu").append(menus);
    $("#side-menu").metisMenu({
      //阻止默认行为
      // preventDefault: false,
      // 关闭
      toggle: false,
    });
    data[0] && data[0].items.length ? $('.create-form-z').html(data[0].items[0].classify_name) :  $('.create-form-z').html(data[0].classify_name);
   
    
    $("#navigation").on("click", "a[data-id]", function (e) {
      e.preventDefault();
      //导航点击处理
      $('.create-form-z').html($(this).html())
      var id = $(this).attr("data-id");
      var form_id = $(this).attr("data-form_id");
      $("a[data-id]").each(function (idx, aele) {
        $(aele).removeClass("hight");
      });
      $(this).addClass("hight");
      if (id && window.history) {
        queryObj.classifyId = id;
        queryObj.form_id = form_id;
        var query = "?" + obj2query(queryObj);
        history.replaceState(null, "", query);
        cb && cb();
      }
    });
  });
}

// 获取当前年月日
function ymd() {
  var now = new Date();
  return (time =
    now.getFullYear() +
    "-" +
    (now.getMonth() + 1 < 10 ? "0" : "") +
    (now.getMonth() + 1) +
    "-" +
    (now.getDate() < 10 ? "0" : "") +
    now.getDate());
}

//返回上层
function goBack(setp) {
  setp = setp || -1;
  window && window.history.go(setp);
}

function encode(str) {
  // first we use encodeURIComponent to get percent-encoded UTF-8,
  // then we convert the percent encodings into raw bytes which
  // can be fed into btoa.
  return window.btoa(
    encodeURIComponent(str).replace(
      /%([0-9A-F]{2})/g,
      function toSolidBytes(match, p1) {
        return String.fromCharCode("0x" + p1);
      }
    )
  );
}

// 单位信息
var unitNameMap = {
  cid: "工程编号",
  construction_group: "施工单位",
  entrust_group: "委托单位",
  witness_group: "见证单位",
};
function getUnitDetail() {
  if (!userInfo) {
    return;
  }
  if (userInfo.projectInfo) {
    var units = [];
    for (var key in unitNameMap) {
      var unit = userInfo.projectInfo[key];
      unit &&
        units.push(
          '<li class="width-50 pull-right">' +
            unitNameMap[key] +
            "：" +
            unit +
            "</li>"
        );
    }
    $("#unit-info-box").html(units.join(""));
    userInfo.projectInfo.name &&
      $("#project-title").html(userInfo.projectInfo.name);
  }
}
