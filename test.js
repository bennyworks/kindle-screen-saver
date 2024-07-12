"use strict";

// 获取DOM元素
var domApp = document.querySelector(".app");
var domTime = document.querySelector(".time");
var domDate = document.querySelector(".date");
var domCnDate = document.querySelector(".cn-date");

// 解析URL参数
function geturl(url) {
    var arr = url.split("?");
    if (!arr[1]) {
        return {};
    }
    var res = arr[1].split("&");
    var items = {};
    for (var i = 0; i < res.length; i++) {
        var a = res[i].split("=");
        items[a[0]] = a[1];
    }
    return items;
}

// 格式化日期
function formatDate(date, fmt = "yyyy-MM-dd") {
    if (!date) {
        return "";
    }
    if (typeof date === "number" || typeof date === "string") {
        date = new Date(Number(date));
    }
    var o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds(),
        "q+": Math.floor((date.getMonth() + 3) / 3),
        S: date.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return fmt;
}

// 渲染时间、日期和农历日期
function render() {
    var time = new Date();
    var len = time.getTime();
    var offset = time.getTimezoneOffset() * 60000;
    var utcTime = len + offset;
    var date = new Date(utcTime + 3600000 * 8);
    var lunar = calendar.solar2lunar(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
    var dateText = formatDate(date, "yyyy.M.d") + " " + (urlQuery.l == "en" ? ["SUN", "MON", "TUES", "WED", "THUR", "FRI", "SAT"][date.getDay()] : "星期" + ["日", "一", "二", "三", "四", "五", "六"][date.getDay()]);
    var timeText = date.getHours() + ":" + date.getMinutes();
    var cnDateText = lunar.IMonthCn + lunar.IDayCn + " " + lunar.Animal + "年";

    if (domDate.innerHTML != dateText) {
        domDate.innerHTML = dateText;
    }
    if (domTime.innerHTML != timeText) {
        domTime.innerHTML = timeText;
    }
    if (domCnDate.innerHTML != cnDateText) {
        domCnDate.innerHTML = cnDateText;
    }
}

// 获取URL参数
var urlQuery = geturl(location.href);

// 配置参数
var config = {
    fontSize: +(urlQuery.fs || 7),
    rotate: urlQuery.r,
    lang: urlQuery.l
};

// 设置样式
domTime.style.fontSize = config.fontSize + "rem";
domDate.style.fontSize = config.fontSize / 2.5 + "rem";
domCnDate.style.fontSize = config.fontSize / 4 + "rem";
domApp.style.cssText = "-webkit-transform: rotate(" + (config.rotate || 0) + "deg) translate3d(-50%,-50%,0)";

// 初始化渲染
render();

// 每秒更新一次
setInterval(function () {
    render();
}, 1000);
