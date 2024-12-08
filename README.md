# 🐍🎮 Slither-Game  

**Slither-Game** est un jeu interactif inspiré du célèbre Slither.io, développé en HTML, CSS, et JavaScript. Ce projet utilise la bibliothèque [p5.js](https://p5js.org/) pour gérer les interactions graphiques et le comportement autonome. Réalisé dans le cadre de mon cours d'IA Réactive, il illustre l'application de concepts étudiés en classe pour créer une expérience de jeu immersive où le joueur contrôle un serpent tout en interagissant avec des ennemis autonomes, des mangoustes, et un environnement dynamique.  

---

## 🌟 Aperçu  

Dans **Slither-Game**, vous devrez :  
- **Contrôler votre serpent** : Mangez des objets et des serpents ennemis pour grandir.  
- **Éviter les dangers** : Fuyez les mangoustes .**Astuces** vous pouvez utilisez des obstacles pour vous cacher.  
- **Survivre et triompher** : Mangez tous les serpents ennemis sans vous faire attraper par la mangouste pour gagner !  
- **Personnalisez et ajustez** : Modifiez la vitesse et la force de votre serpent à l’aide des sliders,le debug avec un d pour voir ce qui ce passe , creer les obstacles avec un o ou ajoutez des papillons avec un clic sur `mouseDragged`.  

### Capture d'Écran  
*(Ajoutez ici une capture d’écran ou un GIF du gameplay pour illustrer les fonctionnalités.)*  

---

## 🚀 Fonctionnalités Principales  
### 📋 **Page d'Accueil**  
- Une interface intuitive pour entrer votre pseudo avant de commencer le jeu. 
![alt text](image.png)

### 🐍 **Le Serpent Joueur**  
- Grandit en mangeant de la nourriture ou des serpents ennemis.  
- Devient brillant après avoir mangé un ennemi.  
- Peut se cacher derrière des obstacles créés avec la touche `O` (Les obtacles ont un etat de santé qui diminue apres chaque contacte avec le mangouste dès qu'il devient 0 l'obtacle sera détruit et oooops il te mange le mangouste ).  

### 🐍 **Les Serpents Ennemis**  
- Ils mangent aussi de la nourriture pour grandir.  
- Deviennent une cible que le joueur doit éliminer.  

### 🦴 **Les Mangoustes**  
- Elles tournent dans l’arène et traquent le serpent du joueur.  
- Peuvent détruire les obstacles pour attraper le joueur.  
### 🦴 **Les papillons**
-Les papillons circule dès que le serpent du joueur vient , elle fuit (flee) 

### 🌟 **Interactions Avancées**  
- **Création d’obstacles** : Utilisez la touche `o` pour créer des obstacles derrière lesquels vous pouvez vous cacher et que le serpents les avoid .  
- **Slider de vitesse et de force** : Ajustez la vitesse et la force du serpent grâce à une interface interactive.  
- **Ajout de papillons** : Cliquez sur `mouseDragged` pour ajouter plus de papillons dans l’arène.  
- **le debug** : Utilisez la touche `d` pour debugger pour voir ce qui se passe .  
### 🎮 **Objectif Final**  
- Mangez tous les serpents ennemis
  Astuces :
- Restez caché derrière des obstacles et évitez la mangouste pour survivre.  
- Gagnez si tous les ennemis sont éliminés avant d’être attrapé par la mangouste. 
![alt text](Victoire.jpg)

---

## 🛠️ Technologies Utilisées  

- **Langages** : HTML, CSS, JavaScript.  
- **Frameworks et Bibliothèques** :  
  - [p5.js](https://p5js.org/) : Pour les rendus graphiques et interactions.  
  - [p5.sound](https://p5js.org/reference/#/libraries/p5.sound) : Pour les effets sonores immersifs.  
- **Outils** : Visual Studio Code ou WebStorm pour le développement.  

---

## 🛠️ Installation  

1. **Clonez le dépôt GitHub** :  
   ```bash
   git clone https://github.com/Oumidark/Slither_Game.git
   

##  🌐 Déploiement sur GitHub Pages
Ce projet est également déployé sur GitHub Pages et accessible via ce lien :
Slither-Game sur GitHub Pages
https://oumidark.github.io/Slither_Game/