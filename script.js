document.querySelector('.play-button').addEventListener('click', () => {
    const nickname = document.querySelector('#nickname').value.trim();
    const welcomeMessage = document.querySelector('#welcomeMessage');
    const errorMessage = document.querySelector('#errorMessage');

    if (nickname === "") {
        errorMessage.style.display = "block";
        errorMessage.textContent = "Veuillez saisir votre pseudo !";
    } else {
        errorMessage.style.display = "none";

        // Construire le message avec des sauts de ligne
        welcomeMessage.style.display = 'block';
        welcomeMessage.innerHTML = `Bienvenue <strong>${nickname}</strong> !<br>Le jeu commence maintenant...`;

        // Appliquer le style
        welcomeMessage.style.fontSize = '50px';
        welcomeMessage.style.fontWeight = 'bold';
        welcomeMessage.style.background = 'linear-gradient(to right, green, purple)';
        welcomeMessage.style.webkitBackgroundClip = 'text';
        welcomeMessage.style.color = 'transparent';
        welcomeMessage.style.textAlign = 'center';

        console.log("Message affiché : ", welcomeMessage.innerHTML);

        // Garder le message visible pendant 5 secondes avant de rediriger
        setTimeout(() => {
            window.location.href = "game.html"; // Redirige après 5 secondes
        }, 1000); // 5 secondes (ajustez si nécessaire)
    }
});
