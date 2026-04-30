function playSiteSound(filePath) {
    const sound = new Audio(filePath);

    sound.play().catch(function(error) {
        console.log("Sound error:", error);
    });
}

document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll("nav a").forEach(function(link) {
        link.addEventListener("click", function(event) {
            event.preventDefault();

            const destination = link.getAttribute("href");

            playSiteSound("./sounds/button_click.wav");

            setTimeout(function() {
                window.location.href = destination;
            }, 700);
        });
    });

    document.querySelectorAll(".game-button-link").forEach(function(link) {
        link.addEventListener("click", function(event) {
            event.preventDefault();

            const destination = link.getAttribute("href");

            playSiteSound("./sounds/game_entrance.wav");

            setTimeout(function() {
                window.location.href = destination;
            }, 1200);
        });
    });

    document.querySelectorAll("button").forEach(function(button) {
        button.addEventListener("click", function() {
            playSiteSound("./sounds/button_click.wav");
        });
    });

});