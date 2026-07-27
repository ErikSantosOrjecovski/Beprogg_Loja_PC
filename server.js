const express = require("express");
const cors = require("cors");
const fs = require("fs");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());

// ==========================================
// 🔌 CONEXÃO COM O BANCO DE DADOS BEPROGG
// ==========================================
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',       // <--- Deixe as aspas totalmente vazias!
    database: 'beprogg', // <--- Garanta que este é o nome exato do banco criado no phpMyAdmin
    port: 3306          // <--- Porta correta do seu XAMPP
});

db.connect((err) => {
    if (err) {
        console.error('❌ Erro ao conectar ao banco MySQL:', err.message);
        return;
    }
    console.log('🚀 Conectado com sucesso ao banco de dados beprogg!');
});

// Rota inicial de teste
app.get("/", (req, res) => {
    res.send("Servidor Bepro.gg funcionando 🚀");
});

// ==========================================
// 🤖 SISTEMA DE RECOMENDAÇÃO (BEPRO IA ACADEMY)
// ==========================================
app.post("/recomendar", (req, res) => {
    const { jogo } = req.body; // Recebe estritamente a string do jogo
    let resposta = "";

    // 🎯 CONFIGURAÇÃO DA MÁQUINA IDEAL DA ACADEMY
    const setupIdeal = `💻 Configuração Ideal Competitiva:
• Processador: AMD Ryzen 7 7800X3D
• Cooler: Air cooler premium ou AIO 240 mm
• Placa-mãe: ASRock B650M Pro RS
• Placa de Vídeo: NVIDIA GeForce RTX 5070 ou AMD Radeon RX 9070 XT
• Memória RAM: 32 GB DDR5 6000 MHz CL30
• Armazenamento: SSD 1 TB NVMe PCIe 4.0
• Fonte: 750 W 80+ Gold
• Gabinete: Gabinete com bom airflow`;

    switch (jogo) {
        case "fortnite":
            resposta = `🤖 Bepro IA Academy: Esta é a máquina ideal para o competitivo de Fortnite.

${setupIdeal}

🎮 Periféricos Ideais para o Jogo:
• Teclado: Wooting 80HE
• Mouse: Logitech G Pro X Superlight 2 Superstrike
• MousePad: FX Hayate Otsu v2 XL
• Fone: Audeze Maxwell Wireless Gaming
• Monitor: BenQ ZOWIE XL2586X+
• Manguito: Pulsar ES Arm Sleeve`;
            break;

        case "valorant":
            resposta = `🤖 Bepro IA Academy: Esta é a máquina ideal para o competitivo de Valorant.

${setupIdeal}

🎮 Periféricos Ideais para o Jogo:
• Teclado: Wooting 80HE
• Mouse: Logitech G Pro X Superlight 2
• MousePad: Mousepad Artisan FX Zero Xxl
• Fone: Audeze Maxwell Wireless Gaming
• Monitor: BenQ ZOWIE XL2586X+
• Manguito: SteelSeries Gaming Sleeve`;
            break;

        case "cs2":
            resposta = `🤖 Bepro IA Academy: Esta é a máquina ideal para o competitivo de Counter Strike 2.

${setupIdeal}

🎮 Periféricos Ideais para o Jogo:
• Teclado: Wooting 80HE
• Mouse: Razer Viper V3 Pro
• MousePad: Artisan Ninja FX Zero Mid
• Fone: SteelSeries Arctis Nova Pro Wireless
• Monitor: BenQ ZOWIE XL2586X+
• Manguito: Pulsar ES Arm Sleeve`;
            break;

        case "r6":
            resposta = `🤖 Bepro IA Academy: Esta é a máquina ideal para o competitivo de Rainbow Six Siege.

${setupIdeal}

🎮 Periféricos Ideais para o Jogo:
• Teclado: Razer Huntsman V3 Pro TKL
• Mouse: Logitech G Pro X Superlight 2 Superstrike
• MousePad: Artisan FX Hayate Otsu Soft
• Fone: HyperX Cloud III Wireless
• Monitor: BenQ ZOWIE XL2586X+
• Manguito: Skypad Sora Arm Sleeve`;
            break;

        case "lol":
            resposta = `🤖 Bepro IA Academy: Esta é a máquina ideal para o competitivo de League of Legends.

${setupIdeal}

🎮 Periféricos Ideais para o Jogo:
• Teclado: Logitech G Pro X TKL Rapid
• Mouse: Logitech G Pro X Superlight 2
• MousePad: Logitech G640 Large
• Fone: Logitech G Pro X 2 LIGHTSPEED
• Monitor: LG UltraGear 27GR75FG (360Hz IPS)
• Manguito: Base Labs Gaming Sleeve`;
            break;

        case "warzone":
            resposta = `🤖 Bepro IA Academy: Esta é a máquina ideal para o competitivo de Warzone.

${setupIdeal}

🎮 Periféricos Ideais para o Jogo:
• Teclado: Wooting 80HE
• Mouse: Razer Viper V4 Pro
• MousePad: Lethal Gaming Gear Saturn Pro
• Fone: Audeze Maxwell Wireless Gaming
• Monitor: ASUS ROG Swift PG27AQDM
• Manguito: Pulsar ES Arm Sleeve`;
            break;

        default:
            resposta = "❌ Erro: Jogo competitivo não mapeado ou inválido.";
    }

    res.json({ resposta });
});

// ============================
// 💳 RECEBER PEDIDOS (Módulo Loja)
// ============================
app.post("/pedido", (req, res) => {
    const pedido = req.body;
    const total = pedido.itens.reduce((soma, item) => soma + Number(item.preco), 0);

    const query = `
        INSERT INTO pedidos 
        (cliente, telefone, endereco, pagamento, usuario_email, usuario_nome, itens, total, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Confirmado')
    `;

    db.query(query, [
        pedido.cliente,
        pedido.telefone,
        pedido.endereco,
        pedido.pagamento,
        pedido.usuario.email,
        pedido.usuario.nome,
        JSON.stringify(pedido.itens),
        total
    ], (err) => {
        if (err) {
            console.error("Erro ao salvar pedido no banco:", err);
            return res.status(500).json({ mensagem: "❌ Erro ao salvar pedido no banco." });
        }
        res.json({ margin: "✅ Pedido salvo no banco de dados com sucesso!" });
    });
});

// ============================
// 📦 LISTAR PEDIDOS (Módulo Loja)
// ============================
app.get("/pedidos", (req, res) => {
    const query = "SELECT * FROM pedidos ORDER BY data_pedido DESC";

    db.query(query, (err, results) => {
        if (err) {
            console.error("Erro ao listar pedidos:", err);
            return res.status(500).json([]);
        }

        const pedidosFormatados = results.map(pedido => ({
            cliente: pedido.cliente,
            telefone: pedido.telefone,
            endereco: pedido.endereco,
            pagamento: pedido.pagamento,
            usuario: { nome: pedido.usuario_nome, email: pedido.usuario_email },
            itens: typeof pedido.itens === "string" ? JSON.parse(pedido.itens) : pedido.itens,
            data: new Date(pedido.data_pedido).toLocaleString("pt-BR"),
            status: pedido.status
        }));

        res.json(pedidosFormatados);
    });
});

// ==========================================
// 🎓 MÓDULO ACADEMY - BUSCAR CURSOS
// ==========================================
app.get("/cursos", (req, res) => {
    const query = 'SELECT * FROM aulas_coach';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar os cursos.' });
        res.json(results);
    });
});

// ==========================================
// 🛒 MÓDULO LOJA - BUSCAR PRODUTOS
// ==========================================
app.get("/produtos", (req, res) => {
    const query = "SELECT * FROM produtos";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: "Erro ao buscar os produtos." });
        res.json(results);
    });
});

// ==========================================
// 🚀 INICIALIZAÇÃO DO SERVIDOR
// ==========================================
app.listen(3000, () => {
    console.log("Servidor rodando com sucesso em http://localhost:3000");
});