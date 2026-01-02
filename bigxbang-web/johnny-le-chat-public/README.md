# Johnny Le Chat 🐱

> "Une mascotte vivante, 4h de prod, 0€ de budget."

Ce projet est une démonstration de ce qu'il est possible de créer en combinant **IA Générative** et **Web Engineering** créatif. C'est la source code complète de la page "Johnny Le Chat" de l'agence BigXBang.

## 🚀 La Stack

- **Framework** : [Next.js](https://nextjs.org/) (App Router)
- **Styling** : [Tailwind CSS](https://tailwindcss.com/)
- **Animation** : [Framer Motion](https://www.framer.com/motion/)
- **Assets** : WebM transparent (détourage IA + Masquage SVG)

## 🛠️ Le Process de Création (En bref)

1.  **Gen AI** : Design itéré sur **Gemini** et **Nano Banana** pour le look "bonbon".
2.  **Upscale** : Amélioration de la texture avec **Upscayl** (Open Source).
3.  **Animation** : Mise en mouvement avec **Gemini Veo**.
4.  **Optimisation** : Upscale vidéo 4K via **Google Colab** + **Video2X** (script Python).
5.  **Intégration** : Conversion en WebM transparent avec **ffmpeg**.

*Une étude de cas détaillée est disponible sur [bigxbang.io](https://bigxbang.io).*

## 💻 Installation

1.  Cloner ce repo :
    ```bash
    git clone https://github.com/votre-user/johnny-le-chat.git
    cd johnny-le-chat
    ```

2.  Installer les dépendances :
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  Lancer le serveur de dév :
    ```bash
    npm run dev
    ```

4.  Ouvrir [http://localhost:3000/johnny-le-chat](http://localhost:3000/johnny-le-chat).

## 📂 Structure

- `src/app/johnny-le-chat/page.tsx` : Le code principal de la page (React).
- `public/` : Les assets (vidéo WebM, SVG, PNG).

## 📄 Licence

Ce code est partagé librement par **BigXBang** pour l'éducation et l'inspiration. Servez-vous, décortiquez, créez !
