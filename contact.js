const contactForm = document.getElementById("contactForm");
const contactMessage = document.getElementById("contactMessage");

contactForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("nameInput").value.trim();
    const email = document.getElementById("emailInput").value.trim();
    const messageType = document.getElementById("messageType").value;
    const gameChoice = document.getElementById("gameChoice").value;
    const message = document.getElementById("messageInput").value.trim();

    if (name === "" || email === "" || messageType === "" || message === "") {
        contactMessage.textContent = "Please complete all required fields.";
        return;
    }

    const arcadeEmail = "example@email.com";

    const subject = "Retro Game Arcade - " + messageType;

    const body =
        "Name: " + name + "\n" +
        "Email: " + email + "\n" +
        "Message Type: " + messageType + "\n" +
        "Related Game: " + gameChoice + "\n\n" +
        "Message:\n" + message;

    const mailtoLink =
        "mailto:" + arcadeEmail +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

    contactMessage.textContent = "Opening your email app...";

    window.location.href = mailtoLink;
});