$(document).ready(function () {
    const elementProperty = new ElementProperty();
    const user = Session.get("user");
    
    if (!user || !user.idDriver) {
        Route.redirect("Main");
        return;
    }
    
    const config = Session.get("configGeneral");
    
    const driverId = user.idDriver;
    const baseUrl = HOST_SITE_PRODUCTION.endsWith('/') ? HOST_SITE_PRODUCTION.slice(0, -1) : HOST_SITE_PRODUCTION;
    const qrcodeUrl = `${baseUrl}/audit?q=${driverId}`;

    const driverNameEl = document.getElementById("audit-driver-name");
    const driverVehicleEl = document.getElementById("audit-driver-vehicle");
    const driverAvatarEl = document.querySelector(".audit-driver-avatar");

    if (driverNameEl) {
        driverNameEl.textContent = user.nickname || user.name || "-";
    }

    if (driverVehicleEl && user.car) {
        driverVehicleEl.textContent = `${user.car.brand || ""} ${user.car.model || ""} - ${user.car.plate || ""}`;
    }

    if (driverAvatarEl && user.picture) {
        const picturesLink = config ? config.find(item => item.name === "pictures_link") : null;
        const basePath = picturesLink ? picturesLink.value : PATH_IMAGE;
        driverAvatarEl.style.backgroundImage = `url(${basePath}${user.picture})`;
    }   

    elementProperty.addEventInElement(".go-back", "onclick", function () {
        Route.backPage();
    });

    elementProperty.addEventInElement("#btnShareQrcode", "onclick", function () {
        shareQrCode();
    });

    function shareQrCode() {
        const qrcodeCanvas = document.querySelector("#qrcode canvas");
        
        if (!qrcodeCanvas) {
            SwalCustom.messageDialog(getTextTranslate("audit", "qrcode-not-generated"));
            return;
        }

        const driverName = user.nickname || user.name || "Motorista";
        const vehicleInfo = user.car ? `${user.car.brand || ""} ${user.car.model || ""} - ${user.car.plate || ""}` : "";
        
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        const padding = 40;
        const headerHeight = 80;
        const footerHeight = 60;
        const qrSize = qrcodeCanvas.width;
        
        canvas.width = qrSize + (padding * 2);
        canvas.height = qrSize + (padding * 2) + headerHeight + footerHeight;
        
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = "#1d4873";
        ctx.fillRect(0, 0, canvas.width, headerHeight);
        
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 18px Arial";
        ctx.textAlign = "center";
        ctx.fillText(getTextTranslate("audit", "title"), canvas.width / 2, 30);
        
        ctx.font = "14px Arial";
        ctx.fillText(driverName, canvas.width / 2, 52);
        
        if (vehicleInfo) {
            ctx.font = "12px Arial";
            ctx.fillText(vehicleInfo, canvas.width / 2, 70);
        }
        
        ctx.drawImage(qrcodeCanvas, padding, headerHeight + padding);
        
        ctx.fillStyle = "#666666";
        ctx.font = "11px Arial";
        ctx.fillText(getTextTranslate("audit", "footer"), canvas.width / 2, canvas.height - 20);
        
        const imageData = canvas.toDataURL("image/png");
        
        if (window.plugins && window.plugins.socialsharing) {
            window.plugins.socialsharing.share(
                getTextTranslate("audit", "title") + " - " + driverName,
                getTextTranslate("audit", "title"),
                imageData,
                null,
                function () {},
                function () {
                    SwalCustom.messageDialog(getTextTranslate("audit", "share-error"));
                }
            );
        } else {
            const link = document.createElement("a");
            link.download = "qrcode-fiscalizacao.png";
            link.href = imageData;
            link.click();
        }
    }

    const qrcodeElement = document.getElementById("qrcode");

    function generateQRCode() {
        if (typeof QRCode === "undefined") {
            setTimeout(generateQRCode, 100);
            return;
        }
        
        try {
            new QRCode(qrcodeElement, {
                text: qrcodeUrl,
                width: 180,
                height: 180,
                colorDark: "#000000",
                colorLight: "#ffffff"
            });
        } catch (e) {
            qrcodeElement.innerHTML = '<p class="qrcode-error">' + getTextTranslate("audit", "qrcode-error") + '</p>';
        }
    }

    if (qrcodeElement) {
        generateQRCode();
    }
});
