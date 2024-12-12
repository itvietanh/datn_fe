(function (global, factory) {
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = factory();
    } else if (typeof define === "function" && define.amd) {
        define(factory);
    } else {
        global.MoMoPopup = factory();
    }
})(this, function () {
    "use strict";

    var MoMoPopup = function () {
        const domain = "https://payment.momo.vn"; // Thay bằng domain thực tế của MoMo
        var popupWindow = null;
        var interval = null;
        var config = {};

        return {
            init: function () {
                // Lắng nghe message từ popup
                window.addEventListener(
                    "message",
                    function (event) {
                        if (event.origin !== domain) {
                            console.error("MoMo: Origin không hợp lệ!");
                            return;
                        }
                        console.log("MoMo: Message nhận được", event.data);
                        MoMoPopup.callback(event.data);
                    },
                    false
                );
                console.log("MoMoPopup: Inited.");
            },

            open: function (options = {}) {
                config.accessToken = options.accessToken || "";
                config.orderId = options.orderId || "";
                config.amount = options.amount || "";
                config.returnUrl = options.returnUrl || "";
                config.notifyUrl = options.notifyUrl || "";

                const height = window.screen.availHeight - 100;
                const width = window.screen.availWidth - 150;

                // Mở popup
                const popupUrl = `${domain}/payment?accessToken=${config.accessToken}&orderId=${config.orderId}&amount=${config.amount}&returnUrl=${encodeURIComponent(config.returnUrl)}&notifyUrl=${encodeURIComponent(config.notifyUrl)}`;
                popupWindow = window.open(
                    popupUrl,
                    "MoMoPayment",
                    `toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=${width},height=${height}`
                );

                // Kiểm tra trạng thái popup
                clearInterval(interval);
                if (popupWindow) {
                    interval = setInterval(function () {
                        if (popupWindow.closed) {
                            console.log("MoMoPopup: Popup đã đóng.");
                            MoMoPopup.callback({ status: "CANCEL" });
                            clearInterval(interval);
                        }
                    }, 500);
                }
            },

            callback: function (data) {
                console.log("MoMoPopup: Callback từ popup", data);
                // Xử lý dữ liệu callback (ví dụ: cập nhật giao diện, gọi API)
            },
        };
    };

    return MoMoPopup();
});
