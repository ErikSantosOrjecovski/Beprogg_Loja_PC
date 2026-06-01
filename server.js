const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Servidor Buildix funcionando 🚀");
});

app.post("/recomendar", (req, res) => {

    const { uso, jogo } = req.body;

    let resposta = "";

    if (jogo === "fortnite" && uso === "fps") {
        resposta = `
🤖 Buildix IA:

Para Fortnite competitivo, o foco principal é FPS alto, baixa latência e resposta rápida.

💻 Configuração recomendada:
• Ryzen 5 5600
• RTX 4060
• 16GB RAM Dual Channel
• SSD NVMe

⚡ Resultado esperado:
Fortnite rodando em configurações competitivas, com FPS alto, boa estabilidade e gameplay lisa para partidas rápidas.

📈 Durabilidade:
Boa build para competitivo por alguns anos antes de precisar de upgrade.
        `;
    }

    else if (jogo === "fortnite" && uso === "grafico") {
        resposta = `
🤖 Buildix IA:

Mesmo sendo um jogo competitivo, você escolheu foco em qualidade gráfica. Então a prioridade será visual bonito sem perder estabilidade.

💻 Configuração recomendada:
• Ryzen 5 5600
• RTX 4060
• 16GB RAM
• SSD NVMe

🎨 Resultado esperado:
Fortnite rodando com gráficos altos, boa iluminação, texturas bonitas e FPS estável.

📈 Durabilidade:
Boa escolha para quem quer jogar bonito e ainda manter desempenho.
        `;
    }

    else if (jogo === "cs2" && uso === "fps") {
        resposta = `
🤖 Buildix IA:

Para CS2 competitivo, o mais importante é FPS estável, baixa latência e resposta rápida nos comandos.

💻 Configuração recomendada:
• Ryzen 5 5600
• RTX 3060 ou RTX 4060
• 16GB RAM Dual Channel
• SSD NVMe

⚡ Resultado esperado:
CS2 rodando com alta taxa de quadros, ideal para mira precisa, reflexos rápidos e partidas competitivas.

📈 Durabilidade:
Excelente para jogos competitivos leves e médios por vários anos.
        `;
    }

    else if (jogo === "cs2" && uso === "grafico") {
        resposta = `
🤖 Buildix IA:

Apesar de CS2 ser competitivo, você escolheu qualidade gráfica. Então a build busca visual mais bonito sem sacrificar fluidez.

💻 Configuração recomendada:
• Ryzen 5 5600
• RTX 4060
• 16GB RAM
• SSD NVMe

🎨 Resultado esperado:
CS2 rodando com texturas, sombras e detalhes melhores, mantendo FPS estável e boa resposta.

📈 Durabilidade:
Boa opção para quem joga casualmente, mas ainda quer desempenho confiável.
        `;
    }

    else if (jogo === "gta5" && uso === "fps") {
        resposta = `
🤖 Buildix IA:

Para GTA V Online com foco em desempenho, o objetivo é evitar quedas de FPS em áreas movimentadas e servidores cheios.

💻 Configuração recomendada:
• Ryzen 5 5600
• RTX 4060
• 16GB RAM
• SSD NVMe

⚡ Resultado esperado:
GTA V Online rodando com boa estabilidade, carregamentos rápidos e menos engasgos durante perseguições, tiroteios e eventos.

📈 Durabilidade:
Boa escolha para jogar online com estabilidade e qualidade equilibrada.
        `;
    }

    else if (jogo === "gta5" && uso === "grafico") {
        resposta = `
🤖 Buildix IA:

Para GTA V com foco em gráficos, a prioridade é deixar o jogo bonito, com boa qualidade visual e FPS estável.

💻 Configuração recomendada:
• Ryzen 5 5600
• RTX 4060
• 16GB RAM
• SSD NVMe

🎨 Resultado esperado:
GTA V rodando no alto/ultra, com boa qualidade de sombras, texturas, iluminação e carregamentos rápidos.

📈 Durabilidade:
Ótima opção para jogar com visual bonito por vários anos.
        `;
    }

    else if (jogo === "rdr2" && uso === "fps") {
        resposta = `
🤖 Buildix IA:

Red Dead Redemption 2 é um jogo pesado e cinematográfico, mas você escolheu foco em FPS. Então a prioridade será estabilidade e fluidez.

💻 Configuração recomendada:
• Ryzen 7
• RTX 4060
• 16GB RAM
• SSD NVMe

⚡ Resultado esperado:
RDR2 rodando com menos quedas de FPS em tiroteios, missões, cidades e áreas abertas.

🎯 Foco:
Ideal para quem quer uma experiência mais fluida, sem engasgos, mesmo em momentos intensos.

📈 Durabilidade:
Boa opção para single players pesados com foco em desempenho.
        `;
    }

    else if (jogo === "rdr2" && uso === "grafico") {
        resposta = `
🤖 Buildix IA:

Para Red Dead Redemption 2 com foco em qualidade gráfica, a prioridade é aproveitar paisagens, iluminação e detalhes cinematográficos.

💻 Configuração recomendada:
• Ryzen 7
• RTX 4070
• 32GB RAM
• SSD NVMe

🎨 Resultado esperado:
RDR2 rodando no alto/ultra com excelente qualidade visual, boa estabilidade e experiência imersiva.

🌄 Experiência:
Ideal para quem quer apreciar cenários, texturas, clima, iluminação e detalhes do mundo aberto.

📈 Durabilidade:
Excelente para jogos single player pesados por vários anos.
        `;
    }

    else if (jogo === "cyberpunk" && uso === "fps") {
        resposta = `
🤖 Buildix IA:

Cyberpunk 2077 é um jogo muito pesado, mas seu foco é desempenho. Então a build prioriza FPS estável e fluidez.

💻 Configuração recomendada:
• Ryzen 7
• RTX 4070
• 32GB RAM
• SSD NVMe

⚡ Resultado esperado:
Cyberpunk rodando com boa estabilidade em cidade aberta, tiroteios, direção e cenas pesadas.

🎯 Foco:
Ideal para quem prefere jogabilidade fluida em vez de ativar todos os efeitos gráficos no máximo.

📈 Durabilidade:
Ótima escolha para jogos modernos pesados.
        `;
    }

    else if (jogo === "cyberpunk" && uso === "grafico") {
        resposta = `
🤖 Buildix IA:

Para Cyberpunk 2077 com foco em gráficos no Ultra, a prioridade é GPU forte, memória e estabilidade.

💻 Configuração recomendada:
• Ryzen 7
• RTX 4070
• 32GB RAM
• SSD NVMe

🎨 Resultado esperado:
Cyberpunk rodando com gráficos altos/ultra, iluminação avançada, cidade detalhada e boa estabilidade.

🌆 Experiência:
Ideal para quem quer imersão visual, cenários futuristas e qualidade cinematográfica.

📈 Durabilidade:
Excelente para jogos AAA atuais e futuros.
        `;
    }

    else {
        resposta = "❌ Não consegui identificar essa combinação. Verifique se jogo e estilo foram selecionados corretamente.";
    }

    res.json({ resposta });
});

// ============================
// 💳 RECEBER PEDIDOS
// ============================
app.post("/pedido", (req, res) => {

    const pedido = req.body;

    console.log("📦 Novo pedido recebido:");
    console.log(pedido);

    let pedidos = [];

    if (fs.existsSync("pedidos.json")) {
        pedidos = JSON.parse(fs.readFileSync("pedidos.json"));
    }

    pedidos.push(pedido);

    fs.writeFileSync(
        "pedidos.json",
        JSON.stringify(pedidos, null, 2)
    );

    res.json({
        mensagem: "✅ Pedido realizado e salvo com sucesso!"
    });
});

// ============================
// 📦 LISTAR PEDIDOS
// ============================
app.get("/pedidos", (req, res) => {

    if (!fs.existsSync("pedidos.json")) {
        return res.json([]);
    }

    const pedidos = JSON.parse(fs.readFileSync("pedidos.json"));

    res.json(pedidos);
});

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});