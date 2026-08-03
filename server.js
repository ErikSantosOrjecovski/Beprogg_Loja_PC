require('dotenv').config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mysql = require("mysql2");

// 1. CRIAR A APLICAÇÃO EXPRESS PRIMEIRO
const app = express();

// ==========================================
// 🛡️ SEGURANÇA E MIDDLEWARES INICIAIS
// ==========================================
app.use(helmet());
app.disable('x-powered-by');

// Configuração estrita de CORS
const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : ['http://localhost:3000', 'http://127.0.0.1:5500']; // Adicionado fallback comum de Live Server local

app.use(cors({ 
    origin: (origin, callback) => {
        // Permite requisições sem 'origin' (como Mobile Apps ou Postman/Curl em dev)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Bloqueado pelo CORS'));
        }
    },
    optionsSuccessStatus: 200 
}));

app.use(express.json({ limit: '10kb' })); // Limita o tamanho do JSON para prevenir DoS

// Rate Limiter para conter tentativas de ataques de força bruta ou estouro de requisições
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // limite de 100 requisições por IP por janela
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Muitas requisições. Tente novamente mais tarde.' }
});
app.use(limiter);

// Validação de Variáveis de Ambiente Críticas
const requiredEnv = ['DB_HOST', 'DB_USER', 'DB_PASS', 'DB_NAME'];
const missingEnv = requiredEnv.filter(key => !process.env[key]);
if (missingEnv.length) {
    console.error(`❌ Variáveis de ambiente faltando: ${missingEnv.join(', ')}`);
    process.exit(1);
}

// ==========================================
// 🛠️ FUNÇÕES AUXILIARES E VALIDADORES
// ==========================================
function isNonEmptyString(value) {
    return typeof value === 'string' && value.trim().length > 0;
}

function validatePedido(pedido) {
    if (!pedido || typeof pedido !== 'object') return false;
    if (!isNonEmptyString(pedido.cliente)) return false;
    if (!isNonEmptyString(pedido.telefone)) return false;
    if (!isNonEmptyString(pedido.endereco)) return false;
    if (!isNonEmptyString(pedido.pagamento)) return false;
    if (!pedido.usuario || !isNonEmptyString(pedido.usuario.email) || !isNonEmptyString(pedido.usuario.nome)) return false;
    if (!Array.isArray(pedido.itens) || pedido.itens.length === 0) return false;
    
    return pedido.itens.every(item => item && isNonEmptyString(item.nome) && !Number.isNaN(Number(item.preco)));
}

// ==========================================
// 🔌 CONEXÃO COM O BANCO DE DADOS BEPROGG
// ==========================================
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

db.connect((err) => {
    if (err) {
        console.error('❌ Erro ao conectar ao banco MySQL:', err.message);
        return;
    }
    console.log('🚀 Conectado com sucesso ao banco de dados beprogg!');
});

// Rota inicial de verificação do servidor
app.get("/", (req, res) => {
    res.status(200).send("Servidor Bepro.gg funcionando 🚀");
});

// ==========================================
// 🤖 SISTEMA DE RECOMENDAÇÃO (BEPRO IA ACADEMY)
// ==========================================
app.post("/recomendar", (req, res) => {
    const { jogo } = req.body;
    
    if (!isNonEmptyString(jogo)) {
        return res.status(400).json({ error: "Parâmetro 'jogo' é obrigatório." });
    }

    let resposta = "";

    const setupIdeal = `💻 Configuração Ideal Competitiva:
• Processador: AMD Ryzen 7 7800X3D
• Cooler: Air cooler premium ou AIO 240 mm
• Placa-mãe: ASRock B650M Pro RS
• Placa de Vídeo: NVIDIA GeForce RTX 5070 ou AMD Radeon RX 9070 XT
• Memória RAM: 32 GB DDR5 6000 MHz CL30
• Armazenamento: SSD 1 TB NVMe PCIe 4.0
• Fonte: 750 W 80+ Gold
• Gabinete: Gabinete com bom airflow`;

    switch (jogo.toLowerCase().trim()) {
        case "fortnite":
            resposta = `🤖 Bepro IA Academy: Esta é a máquina ideal para o competitivo de Fortnite.\n\n${setupIdeal}\n\n🎮 Periféricos Ideais para o Jogo:\n• Teclado: Wooting 80HE\n• Mouse: Logitech G Pro X Superlight 2 Superstrike\n• MousePad: FX Hayate Otsu v2 XL\n• Fone: Audeze Maxwell Wireless Gaming\n• Monitor: BenQ ZOWIE XL2586X+\n• Manguito: Pulsar ES Arm Sleeve`;
            break;

        case "valorant":
            resposta = `🤖 Bepro IA Academy: Esta é a máquina ideal para o competitivo de Valorant.\n\n${setupIdeal}\n\n🎮 Periféricos Ideais para o Jogo:\n• Teclado: Wooting 80HE\n• Mouse: Logitech G Pro X Superlight 2\n• MousePad: Mousepad Artisan FX Zero Xxl\n• Fone: Audeze Maxwell Wireless Gaming\n• Monitor: BenQ ZOWIE XL2586X+\n• Manguito: SteelSeries Gaming Sleeve`;
            break;

        case "cs2":
            resposta = `🤖 Bepro IA Academy: Esta é a máquina ideal para o competitivo de Counter Strike 2.\n\n${setupIdeal}\n\n🎮 Periféricos Ideais para o Jogo:\n• Teclado: Wooting 80HE\n• Mouse: Razer Viper V3 Pro\n• MousePad: Artisan Ninja FX Zero Mid\n• Fone: SteelSeries Arctis Nova Pro Wireless\n• Monitor: BenQ ZOWIE XL2586X+\n• Manguito: Pulsar ES Arm Sleeve`;
            break;

        case "r6":
            resposta = `🤖 Bepro IA Academy: Esta é a máquina ideal para o competitivo de Rainbow Six Siege.\n\n${setupIdeal}\n\n🎮 Periféricos Ideais para o Jogo:\n• Teclado: Razer Huntsman V3 Pro TKL\n• Mouse: Logitech G Pro X Superlight 2 Superstrike\n• MousePad: Artisan FX Hayate Otsu Soft\n• Fone: HyperX Cloud III Wireless\n• Monitor: BenQ ZOWIE XL2586X+\n• Manguito: Skypad Sora Arm Sleeve`;
            break;

        case "lol":
            resposta = `🤖 Bepro IA Academy: Esta é a máquina ideal para o competitivo de League of Legends.\n\n${setupIdeal}\n\n🎮 Periféricos Ideais para o Jogo:\n• Teclado: Logitech G Pro X TKL Rapid\n• Mouse: Logitech G Pro X Superlight 2\n• MousePad: Logitech G640 Large\n• Fone: Logitech G Pro X 2 LIGHTSPEED\n• Monitor: LG UltraGear 27GR75FG (360Hz IPS)\n• Manguito: Base Labs Gaming Sleeve`;
            break;

        case "warzone":
            resposta = `🤖 Bepro IA Academy: Esta é a máquina ideal para o competitivo de Warzone.\n\n${setupIdeal}\n\n🎮 Periféricos Ideais para o Jogo:\n• Teclado: Wooting 80HE\n• Mouse: Razer Viper V4 Pro\n• MousePad: Lethal Gaming Gear Saturn Pro\n• Fone: Audeze Maxwell Wireless Gaming\n• Monitor: ASUS ROG Swift PG27AQDM\n• Manguito: Pulsar ES Arm Sleeve`;
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

    if (!validatePedido(pedido)) {
        return res.status(400).json({ error: 'Payload de pedido inválido.' });
    }

    const total = pedido.itens.reduce((soma, item) => soma + Number(item.preco), 0);

    const query = `
        INSERT INTO pedidos 
        (cliente, telefone, endereco, pagamento, usuario_email, usuario_nome, itens, total, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Confirmado')
    `;

    db.query(query, [
        pedido.cliente.trim(),
        pedido.telefone.trim(),
        pedido.endereco.trim(),
        pedido.pagamento.trim(),
        pedido.usuario.email.trim(),
        pedido.usuario.nome.trim(),
        JSON.stringify(pedido.itens),
        total
    ], (err) => {
        if (err) {
            console.error("Erro ao salvar pedido no banco:", err.message);
            return res.status(500).json({ error: "❌ Erro interno ao salvar pedido no banco de dados." });
        }
        res.status(201).json({ message: "✅ Pedido salvo no banco de dados com sucesso!" });
    });
});

// ============================
// 📦 LISTAR PEDIDOS (Módulo Loja)
// ============================
app.get("/pedidos", (req, res) => {
    const query = "SELECT * FROM pedidos ORDER BY data_pedido DESC";

    db.query(query, (err, results) => {
        if (err) {
            console.error("Erro ao listar pedidos:", err.message);
            return res.status(500).json({ error: "Erro ao buscar histórico de pedidos." });
        }

        const pedidosFormatados = results.map(pedido => {
            let itensProcessados = [];
            
            // Tratamento de erro seguro para evitar crash da aplicação caso o JSON esteja malformatado
            try {
                itensProcessados = typeof pedido.itens === "string" ? JSON.parse(pedido.itens) : pedido.itens;
            } catch (e) {
                console.error(`Erro ao decodificar JSON dos itens do pedido ID ${pedido.id}:`, e.message);
                itensProcessados = [];
            }

            return {
                id: pedido.id,
                cliente: pedido.cliente,
                telefone: pedido.telefone,
                endereco: pedido.endereco,
                pagamento: pedido.pagamento,
                usuario: { nome: pedido.usuario_nome, email: pedido.usuario_email },
                itens: itensProcessados,
                total: pedido.total,
                data: pedido.data_pedido ? new Date(pedido.data_pedido).toLocaleString("pt-BR") : "N/A",
                status: pedido.status
            };
        });

        res.json(pedidosFormatados);
    });
});

// ==========================================
// 🎓 MÓDULO ACADEMY - BUSCAR CURSOS
// ==========================================
app.get("/cursos", (req, res) => {
    const query = 'SELECT * FROM aulas_coach';
    db.query(query, (err, results) => {
        if (err) {
            console.error("Erro ao buscar cursos:", err.message);
            return res.status(500).json({ error: 'Erro ao buscar os cursos.' });
        }
        res.json(results);
    });
});

// ==========================================
// 🛒 MÓDULO LOJA - BUSCAR PRODUTOS
// ==========================================
app.get("/produtos", (req, res) => {
    const query = "SELECT * FROM produtos";
    db.query(query, (err, results) => {
        if (err) {
            console.error("Erro ao buscar produtos:", err.message);
            return res.status(500).json({ error: "Erro ao buscar os produtos." });
        }
        res.json(results);
    });
});

// ==========================================
// ❌ MANIPULAÇÃO DE ROTAS NÃO ENCONTRADAS & ERROS GLOBAIS
// ==========================================
app.use((req, res) => {
    res.status(404).json({ error: "Rota não encontrada." });
});

app.use((err, req, res, next) => {
    console.error("Erro não tratado na aplicação:", err.stack);
    res.status(500).json({ error: "Ocorreu um erro interno no servidor." });
});

// ==========================================
// 🚀 INICIALIZAÇÃO DO SERVIDOR
// ==========================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando com sucesso em http://localhost:${PORT}`);
});

