let clicks = {};

clicks["quentin"] = 0;
const QUENTIN_PIC = document.getElementById("quentin-picture");

clicks["lucie"] = 0;
const LUCIE_PIC = document.getElementById("lucie-picture");

clicks["kamil"] = 0;
const KAMIL_PIC = document.getElementById("kamil-picture");

clicks["cookie"] = 0;
const COOKIE_PIC = document.getElementById("cookie-picture");

clicks["chipie"] = 0;
const CHIPIE_PIC = document.getElementById("chipie-picture");

QUENTIN_PIC.addEventListener("click", () => {

    clicks["quentin"]++;
    
    if(clicks["quentin"] === 2) {
        QUENTIN_PIC.src = "../medias/staff-pictures/quentin-petpet.gif";

    } else if(clicks["quentin"] === 3) {
        QUENTIN_PIC.src = "../medias/staff-pictures/quentin-picture.jpeg";
        clicks["quentin"] = 0;
    }
});

LUCIE_PIC.addEventListener("click", () => {

    clicks["lucie"]++;
    
    if(clicks["lucie"] === 2) {
        LUCIE_PIC.src = "../medias/staff-pictures/lucie-petpet.gif";

    } else if(clicks["lucie"] === 3) {
        LUCIE_PIC.src = "../medias/staff-pictures/lucie-picture.jpg";
        clicks["lucie"] = 0;
    }
});

KAMIL_PIC.addEventListener("click", () => {

    clicks["kamil"]++;
    
    if(clicks["kamil"] === 2) {
        KAMIL_PIC.src = "../medias/staff-pictures/kamil-petpet.gif";

    } else if(clicks["kamil"] === 3) {
        KAMIL_PIC.src = "../medias/staff-pictures/kamil-picture.jpg";
        clicks["kamil"] = 0;
    }
});

COOKIE_PIC.addEventListener("click", () => {

    clicks["cookie"]++;
    
    if(clicks["cookie"] === 2) {
        COOKIE_PIC.src = "../medias/staff-pictures/cookie-petpet.gif";

    } else if(clicks["cookie"] === 3) {
        COOKIE_PIC.src = "../medias/staff-pictures/cookie-picture.jpg";
        clicks["cookie"] = 0;
    }
});

CHIPIE_PIC.addEventListener("click", () => {

    clicks["chipie"]++;
    
    if(clicks["chipie"] === 2) {
        CHIPIE_PIC.src = "../medias/staff-pictures/chipie-petpet.gif";

    } else if(clicks["chipie"] === 3) {
        CHIPIE_PIC.src = "../medias/staff-pictures/chipie-picture.jpg";
        clicks["chipie"] = 0;
    }
});
