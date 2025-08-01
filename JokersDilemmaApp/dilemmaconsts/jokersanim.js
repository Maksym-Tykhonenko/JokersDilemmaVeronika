const jokersanim = `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8" />
    <style>
        html, body {
        margin: 0;
        padding: 0;
        background: transparent;
        overflow: hidden;
        height: 100%;
        }
        .container {
        position: absolute;
        inset: 0;
        transform: scale(0.5);
        }
        .loader {
        top: calc(50% - 300px);
        left: calc(50% - 350px);
        animation: girar 8s linear infinite;
        width: 700px;
        height: 700px;
        position: absolute;
        transform-style: preserve-3d;
        perspective: 10000px;
        }
        .sphere, .item {
        position: absolute;
        width: 700px;
        height: 700px;
        transform-style: preserve-3d;
        }
        .sphere {
        transform: rotate(var(--rot));
        }
        .item {
        border-radius: 50%;
        background: var(--bg);
        transform: rotateY(var(--rotY));
        }

        .sphere1 { --bg: #f008; --rot: 0deg; }
        .sphere2 { --bg: #f0f8; --rot: 20deg; }
        .sphere3 { --bg: #ff08; --rot: 40deg; }
        .sphere4 { --bg: #0f08; --rot: 60deg; }
        .sphere5 { --bg: #0ff8; --rot: 80deg; }
        .sphere6 { --bg: #00f8; --rot: 100deg; }
        .sphere7 { --bg: #dc1ddf88; --rot: 120deg; }
        .sphere8 { --bg: #ffa50088; --rot: 140deg; }
        .sphere9 { --bg: #e5b2ca88; --rot: 160deg; }

        @keyframes girar {
        0% { transform: rotateX(0deg) rotateY(0deg); }
        100% { transform: rotateX(360deg) rotateY(360deg); }
        }
    </style>
    </head>
    <body>
    <section class="container">
        <section class="loader">
        ${[...Array(9).keys()].map(i => `
            <article class="sphere sphere${i + 1}">
            ${[...Array(9).keys()].map(j => `
                <div class="item" style="--rotY: ${j * 40}deg;"></div>
            `).join('')}
            </article>
        `).join('')}
        </section>
    </section>
    </body>
    </html>
`;


export default jokersanim;