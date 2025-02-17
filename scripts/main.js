function ouvrirPopupCentre(TON_REQUEST_TOKEN, width, height) {
    let left = (screen.width - width) / 2;
    let top = (screen.height - height) / 2;
    window.open("https://www.themoviedb.org/auth/access?request_token=" + TON_REQUEST_TOKEN, "popupLogin", `width=${width},height=${height},top=${top},left=${left}`);
}

document.getElementById("btnLogin").addEventListener("click", function() {
    ouvrirPopupCentre("", 500, 600);
});