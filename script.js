// ==========================================
// 🔹 CONTROLE DE ABAS
// ==========================================
function trocarAba(id) {
    document.querySelectorAll(".conteudo").forEach(sec => sec.classList.remove("ativo"));
    document.getElementById(id).classList.add("ativo");

    atualizarCarrinhoUI();
    atualizarResumoPagamento();

    if (id === "pedidos") carregarPedidos();
    // if (id === "coach") carregarCursos(); // Comentado para carregar o carrossel local sem sobrescrever
    if (id === "loja") carregarProdutos();
}

// ==========================================
// 🛒 CARRINHO DE COMPRAS
// ==========================================
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

function adicionarAoCarrinho(nome, preco = null) {
    const item = {
        nome,
        preco: preco !== null ? Number(preco) : 100
    };
    carrinho.push(item);
    salvarCarrinho();
    atualizarCarrinhoUI();
    atualizarResumoPagamento();
}

function atualizarCarrinhoUI() {
    const lista = document.getElementById("lista-carrinho");
    const total = document.getElementById("total-carrinho");

    if (!lista || !total) return;
    lista.innerHTML = "";
    let soma = 0;

    if (carrinho.length === 0) {
        lista.innerHTML = "<p>Seu carrinho está vazio.</p>";
        total.innerText = "Total: R$ 0";
        return;
    }

    carrinho.forEach((item, index) => {
        soma += item.preco;
        lista.innerHTML += `
            <div class="card">
                <h3>${item.nome}</h3>
                <p>R$ ${item.preco}</p>
                <button onclick="removerItem(${index})">Remover</button>
            </div>`;
    });
    total.innerText = "Total: R$ " + soma;
}

function removerItem(index) {
    carrinho.splice(index, 1);
    salvarCarrinho();
    atualizarCarrinhoUI();
    atualizarResumoPagamento();
}

function salvarCarrinho() {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

// ==========================================
// 🎓 SELETOR DE PERFIL (INTERAÇÃO FIGMA)
// ==========================================
function toggleDropdownPerfil() {
    const dropdown = document.getElementById('perfil-dropdown');
    if (!dropdown) return;
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

function selecionarPerfil(nomePerfil, classeIcone) {
    const displayTexto = document.getElementById('perfil-selected' || 'perfil-selecionado');
    if (displayTexto) displayTexto.innerText = nomePerfil;

    const iconePrincipal = document.querySelector('.perfil-botao .icon-perfil');
    if (iconePrincipal) {
        iconePrincipal.className = `fa-solid ${classeIcone} icon-perfil`;
    }

    const itens = document.querySelectorAll('.perfil-item');
    itens.forEach(item => item.classList.remove('ativo'));

    itens.forEach(item => {
        if (item.innerText.includes(nomePerfil)) {
            item.classList.add('ativo');
        }
    });

    const dropdown = document.getElementById('perfil-dropdown');
    if (dropdown) dropdown.style.display = 'none';

    console.log("Filtro de Perfil alterado para: " + nomePerfil);
}

window.addEventListener('click', function(event) {
    const container = document.querySelector('.perfil-container');
    const dropdown = document.getElementById('perfil-dropdown');

    if (container && dropdown && !container.contains(event.target)) {
        dropdown.style.display = 'none';
    }
});

// ==========================================
// 🤖 BEPRO IA MATCH (STORE EDITION)
// ==========================================
async function gerarRecomendacao() {
    const jogo = document.getElementById("jogo").value;
    const resultado = document.getElementById("resultado-buildix");
    const robot = document.getElementById("robot");
    const robotText = document.getElementById("robot-text");
    const respostaIA = document.getElementById("resposta-ia");

    if (!jogo) {
        if (resultado) resultado.innerHTML = "⚠️ Por favor, selecione um jogo competitivo!";
        if (respostaIA) respostaIA.innerHTML = "";
        return;
    }

    if (resultado) resultado.innerHTML = "";
    if (respostaIA) respostaIA.innerHTML = "";

    if (robot && robotText) {
        robot.style.display = "block";
        robotText.innerText = "🤖 Computando ecossistema profissional da Academy...";
    }

   const tabelaPrecos = {
    // --- PROCESSADORES (CPUs Top de Linha) ---
    "AMD Ryzen 7 7800X3D": 2899,
    "AMD Ryzen 9 7950X3D": 4299,
    "AMD Ryzen 7 9700X": 2599,
    "Intel Core i7-14700K": 2799,
    "Intel Core i9-14900K": 3999,

    // --- REFRIGERAÇÃO & GABINETES ---
    "Air Cooler DeepCool AK620 Digital": 480,
    "Water Cooler Lian Li Galahad II Trinity 360mm": 1199,
    "Water Cooler Corsair iCUE Link H150i 360mm": 1499,
    "Gabinete NZXT H9 Flow": 1150,
    "Gabinete Lian Li O11 Dynamic EVO": 1299,
    "Gabinete Montech King 95 Pro": 899,

    // --- PLACAS MÃE ---
    "ASRock B650M Pro RS": 1150,
    "ASUS ROG Strix B650-A Gaming WiFi": 1899,
    "MSI MAG B650 Tomahawk WiFi": 1699,
    "ASUS ROG Strix Z790-E Gaming WiFi": 3200,
    "Gigabyte Z790 AORUS Elite AX": 2499,

    // --- PLACAS DE VÍDEO (NVIDIA) ---
    "NVIDIA GeForce RTX 4060 Ti 8GB": 2699,
    "NVIDIA GeForce RTX 4070 Super 12GB": 4399,
    "NVIDIA GeForce RTX 4070 Ti Super 16GB": 5999,
    "NVIDIA GeForce RTX 4080 Super 16GB": 7899,
    "NVIDIA GeForce RTX 5070": 4999,
    "NVIDIA GeForce RTX 5080": 8999,
    "NVIDIA GeForce RTX 5090": 15999,

    // --- PLACAS DE VÍDEO (AMD) ---
    "AMD Radeon RX 6600 8GB": 1399,
    "AMD Radeon RX 6750 XT 12GB": 2399,
    "AMD Radeon RX 7600 8GB": 1799,
    "AMD Radeon RX 7700 XT 12GB": 3199,
    "AMD Radeon RX 7800 XT 16GB": 3999,
    "AMD Radeon RX 7900 XTX 24GB": 7499,
    "AMD Radeon RX 9070 XT": 4999,

    // --- MEMÓRIA & ARMAZENAMENTO ---
    "32 GB DDR5 6000 MHz CL30": 899,
    "64 GB (2x32GB) DDR5 6000 MHz CL30": 1699,
    "SSD 1 TB NVMe PCIe 4.0 (Kingston/XPG)": 499,
    "SSD 2 TB Samsung 990 Pro NVMe PCIe 4.0": 1299,

    // --- FONTES DE ALIMENTAÇÃO ---
    "Fonte Corsair RM750x 750W 80+ Gold": 749,
    "Fonte MSI MAG A850GL 850W 80+ Gold PCIe 5.0": 699,
    "Fonte Corsair RM1000e 1000W 80+ Gold ATX 3.0": 1199,
    "Fonte ROG Thor 1200W Platinum ATX 3.0": 2499,

    // --- TECLADOS ---
    "Wooting 80HE": 1999,
    "Razer Huntsman V3 Pro TKL": 1299,
    "Logitech G Pro X TKL Rapid": 1099,
    "Corsair K70 MAX RGB Magnetic": 1399,

    // --- MOUSES ---
    "Logitech G Pro X Superlight 2": 899,
    "Logitech G Pro X Superlight 2 Superstrike": 999,
    "Razer Viper V3 Pro": 899,
    "Razer Viper V4 Pro": 999,

    // --- MOUSEPADS ---
    "FX Hayate Otsu v2 XL": 349,
    "Artisan FX Hayate Otsu Soft": 419,
    "Mousepad Artisan FX Zero Xxl": 479,
    "Artisan Ninja FX Zero Mid": 419,
    "Logitech G640 Large": 149,
    "Lethal Gaming Gear Saturn Pro": 329,

    // --- HEADSETS ---
    "HyperX Cloud III Wireless": 949,
    "Logitech G Pro X 2 LIGHTSPEED": 1499,
    "SteelSeries Arctis Nova Pro Wireless": 2199,
    "Audeze Maxwell Wireless Gaming": 2499,

    // --- MONITORES ---
    "LG UltraGear 27GR75FG (360Hz IPS)": 3899,
    "ASUS ROG Swift PG27AQDM (240Hz OLED)": 4699,
    "BenQ ZOWIE XL2586X+ (540Hz)": 5999,
    "Alienware AW2725DF (360Hz QD-OLED)": 4299,

    // --- MANGAS (SLEEVES) ---
    "Base Labs Gaming Sleeve": 79,
    "SteelSeries Gaming Sleeve": 99,
    "Pulsar ES Arm Sleeve": 119,
    "Skypad Sora Arm Sleeve": 149
};

    setTimeout(async () => {
        try {
            const response = await fetch("http://localhost:3000/recomendar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jogo })
            });

            const data = await response.json();
            const textoBruto = data.resposta;

            let pecasHTML = "";
            let perifericosHTML = "";

            const linhas = textoBruto.split("\n");
            let categoriaAtual = "";

            linhas.forEach(linha => {
                const linhaLimpa = line => line.replace("• ", "").trim();
                const formattedLine = linhaLimpa(linha);

                if (formattedLine.includes("Configuração Ideal Competitiva")) {
                    categoriaAtual = "pecas";
                    return;
                }
                if (formattedLine.includes("Periféricos Ideais para o Jogo")) {
                    categoriaAtual = "perifericos";
                    return;
                }

                if (formattedLine.includes(":") && (categoriaAtual === "pecas" || categoriaAtual === "perifericos")) {
                    const partes = formattedLine.split(":");
                    const componenteTipo = partes[0].trim();
                    const modeloNome = partes[1].trim();

                    const precoItem = tabelaPrecos[modeloNome] || 250;

                    const itemCard = `
                        <div style="display: flex; justify-content: space-between; align-items: center; background: #111823; padding: 12px; margin-bottom: 8px; border-radius: 6px; border: 1px solid #2d3748;">
                            <div style="text-align: left;">
                                <strong style="color: #00d4ff; font-size: 0.9rem;">${componenteTipo}:</strong>
                                <span style="color: white; font-size: 0.95rem; display: block; margin: 2px 0;">${modeloNome}</span>
                                <span style="color: #48bb78; font-size: 0.9rem; font-weight: bold;">R$ ${precoItem}</span>
                            </div>
                            <button onclick="adicionarAoCarrinho('${modeloNome}', ${precoItem})" style="padding: 6px 12px; background: #00d4ff; color: black; border: none; font-weight: bold; border-radius: 4px; cursor: pointer; font-size: 0.85rem; transition: background 0.2s;">
                                + Carrinho
                            </button>
                        </div>
                    `;

                    if (categoriaAtual === "pecas") pecasHTML += itemCard;
                    if (categoriaAtual === "perifericos") perifericosHTML += itemCard;
                }
            });

            if (respostaIA) {
                respostaIA.innerHTML = `
                    <div class="card-academy" style="background: #1a2332; padding: 25px; border-radius: 12px; margin-top: 20px; max-width: 900px; margin-left: auto; margin-right: auto; border: 1px solid #00d4ff;">
                        <h3 style="color: white; margin-top: 0; text-align: center; border-bottom: 1px solid #00d4ff; padding-bottom: 10px;">🤖 Setup Recomendado pela IA Store</h3>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px;">
                            <div>
                                <h4 style="color: #00d4ff; margin-bottom: 12px; font-size: 1.1rem; text-align: left;">💻 Peças do Hardware</h4>
                                ${pecasHTML || "<p style='color: gray; text-align: left;'>Nenhuma peça mapeada.</p>"}
                            </div>

                            <div>
                                <h4 style="color: #00d4ff; margin-bottom: 12px; font-size: 1.1rem; text-align: left;">🎮 Periféricos Ideais</h4>
                                ${perifericosHTML || "<p style='color: gray; text-align: left;'>Nenhum periférico mapeado.</p>"}
                            </div>
                        </div>
                    </div>`;
            }
        } catch (error) {
            console.error(error);
            if (respostaIA) {
                respostaIA.innerHTML = "⚠️ Erro ao processar as recomendações de compra da Store.";
            }
        }
        if (robot) robot.style.display = "none";
    }, 1000);
}

// ==========================================
// 👤 AUTENTICAÇÃO (LOGIN/CADASTRO)
// ==========================================
function fazerCadastro(event) {
    event.preventDefault();
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const msg = document.getElementById("msg-cadastro");

    if (!nome || !email || !senha) {
        msg.innerText = "❗ Preencha todos os campos!";
        return;
    }

    const usuario = { nome, email, senha };
    localStorage.setItem("usuario", JSON.stringify(usuario));
    localStorage.setItem("usuarioLogado", "true");

    msg.innerText = "✅ Conta criada! Logando...";
    atualizarStatusLogin();
    setTimeout(() => trocarAba("inicio"), 1500);
}

function fazerLogin() {
    const email = document.getElementById("login-email").value.trim();
    const senha = document.getElementById("login-senha").value.trim();
    const msg = document.getElementById("msg-login");
    const usuarioSalvo = JSON.parse(localStorage.getItem("usuario"));

    if (usuarioSalvo && usuarioSalvo.email === email && usuarioSalvo.senha === senha) {
        localStorage.setItem("usuarioLogado", "true");
        msg.innerText = "✅ Login realizado com sucesso!";
        atualizarStatusLogin();
        setTimeout(() => trocarAba("inicio"), 1500);
    } else {
        msg.innerText = "❌ Credenciais inválidas!";
    }
}

// ==========================================
// 💳 MÓDULO FINALIZAÇÃO PAGAMENTO
// ==========================================
function atualizarResumoPagamento() {
    const resumo = document.getElementById("resumo-pagamento");
    if (!resumo) return;
    resumo.innerHTML = "";
    let soma = 0;
    carrinho.forEach(item => {
        soma += item.preco;
        resumo.innerHTML += `<p>${item.nome} - R$ ${item.preco}</p>`;
    });
    resumo.innerHTML += `<h4>Total: R$ ${soma}</h4>`;
}

async function finalizarPedido() {
    const logado = localStorage.getItem("usuarioLogado") === "true";
    if (!logado) {
        alert("Você precisa estar logado para finalizar o pedido!");
        return;
    }

    const cliente = document.getElementById("nome-cliente").value;
    const telefone = document.getElementById("telefone").value;
    const endereco = document.getElementById("endereco").value;
    const pagamento = document.getElementById("forma-pagamento").value;

    if (!cliente || !telefone || !endereco || !pagamento || carrinho.length === 0) {
        document.getElementById("mensagem-pedido").innerText = "⚠️ Preencha os dados e coloque itens no carrinho!";
        return;
    }

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const dadosPedido = { cliente, telefone, endereco, pagamento, usuario, itens: carrinho };

    try {
        const response = await fetch("http://localhost:3000/pedido", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosPedido)
        });
        const data = await response.json();
        document.getElementById("mensagem-pedido").innerText = data.mensagem;
        carrinho = [];
        salvarCarrinho();
        atualizarCarrinhoUI();
    } catch {
        document.getElementById("mensagem-pedido").innerText = "❌ Erro ao enviar pedido.";
    }
}

// ==========================================
// 📦 INTEGRAÇÃO DE LISTAGENS DO BACKEND
// ==========================================
async function carregarPedidos() {
    const lista = document.getElementById("lista-pedidos");
    if (!lista) return;
    lista.innerHTML = "<p>Carregando histórico...</p>";
    try {
        const response = await fetch("http://localhost:3000/pedidos");
        const pedidos = await response.json();
        lista.innerHTML = pedidos.length === 0 ? "<p>Nenhum pedido encontrado.</p>" : "";
        pedidos.forEach(p => {
            lista.innerHTML += `
                <div class="card" style="border-left: 5px solid green;">
                    <h4>Cliente: ${p.cliente} | Total: R$ ${p.total || 0}</h4>
                    <p>Data: ${p.data} | Status: <strong>${p.status}</strong></p>
                </div>`;
        });
    } catch {
        lista.innerHTML = "<p>Erro ao carregar pedidos.</p>";
    }
}

// Variable global para armazenar os produtos do banco
let todosProdutos = [];

// ==========================================
// 🛒 1. CARREGAR PRODUTOS DO BACKEND
// ==========================================
async function carregarProdutos() {
    const elContainer = document.getElementById("lista-produtos");
    if (!elContainer) return;

    elContainer.innerHTML = "<p style='color: gray;'>Carregando produtos...</p>";

    try {
        const response = await fetch("http://localhost:3000/produtos");
        todosProdutos = await response.json();

        // Inicialmente exibe todos os produtos
        filtrarCategoria('todos');
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        elContainer.innerHTML = "<p style='color: red;'>Erro ao carregar os produtos do servidor.</p>";
    }
}

// ==========================================
// 🖼️ FUNÇÃO DE IMAGENS AJUSTADA AOS NOMES DA SUA PASTA
// ==========================================
function obterCaminhoImagem(nomeProduto) {
    const nome = nomeProduto.toLowerCase();

    // 1. Processadores
    if (nome.includes("7800x3d") || nome.includes("5700x") || nome.includes("ryzen 7") || nome.includes("ryzen 5") || nome.includes("5560")) {
        return "imagens/andryzen5-5560-removebg-preview.png";
    }
    if (nome.includes("i5") || nome.includes("intel core i5")) return "imagens/intelcore-i5-removebg-preview.png";
    if (nome.includes("i7") || nome.includes("intel core i7")) return "imagens/intelcore-i7-removebg-preview.png";

    // 2. Refrigeração
    if (nome.includes("air cooler") || nome.includes("aio") || nome.includes("cooler")) return "imagens/aircooler-removebg-preview.png";

    // 3. Placas Mãe
    if (nome.includes("b550")) return "imagens/placamaeb550-removebg-preview.png";
    if (nome.includes("b660") || nome.includes("b650") || nome.includes("asrock")) return "imagens/placamaeb660-removebg-preview.png";
    if (nome.includes("x570")) return "imagens/placamaex570-removebg-preview.png";
    if (nome.includes("z690")) return "imagens/placamaez690-removebg-preview.png";

    // 4. Memórias RAM
    if (nome.includes("ddr4") && nome.includes("16")) return "imagens/ram16gb-ddr4-removebg-preview.png";
    if (nome.includes("ddr5") && nome.includes("16")) return "imagens/ram16gb-ddr5-removebg-preview.png";
    if (nome.includes("ddr4") && nome.includes("32")) return "imagens/ram32gb-ddr4-removebg-preview.png";
    if (nome.includes("ddr5") || nome.includes("32 gb")) return "imagens/ram32gb-ddr5-removebg-preview.png";

    // 5. Placas de Vídeo
    if (nome.includes("3060")) return "imagens/rtx3060-removebg-preview.png";
    if (nome.includes("4060")) return "imagens/rtx4060-removebg-preview.png";
    if (nome.includes("4070") || nome.includes("5070")) return "imagens/rtx4070-removebg-preview.png";
    if (nome.includes("7600") || nome.includes("9070")) return "imagens/rtx3060-removebg-preview.png";

    // 6. Armazenamento
    if (nome.includes("ssd") || nome.includes("nvme")) return "imagens/ssd-1tb-removebg-preview.png";

    // 7. Fontes
    if (nome.includes("550w")) return "imagens/fonte550w-removebg-preview.png";
    if (nome.includes("650w")) return "imagens/fonte650w-removebg-preview.png";
    if (nome.includes("750w") || nome.includes("750 w") || nome.includes("gold")) return "imagens/fonte750w-removebg-preview.png";
    if (nome.includes("850w")) return "imagens/fonte850w-removebg-preview.png";

    // 8. Gabinetes
    if (nome.includes("gabinete") || nome.includes("airflow")) return "imagens/gabinete-removebg-preview.png";

    // 9. Periféricos e Acessórios
    if (nome.includes("pulsar") || nome.includes("sleeve") || nome.includes("manguito")) return "imagens/manguito-removebg-preview.png";
    if (nome.includes("wooting") || nome.includes("teclado")) return "imagens/wooting-80he-removebg-preview.png";
    if (nome.includes("superlight") || nome.includes("mouse") || nome.includes("razer")) return "imagens/logitech-superlight2-removebg-preview.png";
    if (nome.includes("hayate") || nome.includes("saturn") || nome.includes("mousepad")) return "imagens/hayate-otsu-removebg-preview.png";
    if (nome.includes("audeze") || nome.includes("maxwell") || nome.includes("steelseries")) return "imagens/audeze-maxwell-removebg-preview.png";
    if (nome.includes("benq") || nome.includes("zowie") || nome.includes("monitor")) return "imagens/BenqZowie.png";

    // Imagem padrão caso o produto não seja encontrado
    return "imagens/logo-bepro.png.jpeg";
}

// ==========================================
// 🎯 FILTRAR CATEGORIAS E SUBCATEGORIAS
// ==========================================
function filtrarCategoria(categoria, elementoClicado) {
    const elContainer = document.getElementById("lista-produtos");
    const elTitulo = document.getElementById("titulo-categoria-atual");

    if (!elContainer) return;

    if (elementoClicado) {
        document.querySelectorAll('.barra-categorias .categoria-item').forEach(item => {
            item.classList.remove('active');
        });
        elementoClicado.classList.add('active');
    }

    let produtosFiltrados = [];

    if (categoria === 'todos') {
        produtosFiltrados = todosProdutos;
        if (elTitulo) elTitulo.innerText = "📦 Todos os Produtos";
    } else if (categoria === 'teclados') {
        produtosFiltrados = todosProdutos.filter(p => {
            const n = p.nome.toLowerCase();
            return n.includes("teclado") || n.includes("wooting") || n.includes("huntsman");
        });
        if (elTitulo) elTitulo.innerText = "⌨️ Teclados";
    } else if (categoria === 'mouses') {
        produtosFiltrados = todosProdutos.filter(p => {
            const n = p.nome.toLowerCase();
            return n.includes("mouse") || n.includes("superlight") || n.includes("sleeve") || n.includes("pad");
        });
        if (elTitulo) elTitulo.innerText = "🖱️ Mouses & Acessórios";
    } else if (categoria === 'monitores') {
        produtosFiltrados = todosProdutos.filter(p => {
            const n = p.nome.toLowerCase();
            return n.includes("monitor") || n.includes("zowie") || n.includes("xl2586x");
        });
        if (elTitulo) elTitulo.innerText = "🖥️ Monitores";
    } else if (categoria === 'headsets') {
        produtosFiltrados = todosProdutos.filter(p => {
            const n = p.nome.toLowerCase();
            return n.includes("headset") || n.includes("audeze") || n.includes("fone");
        });
        if (elTitulo) elTitulo.innerText = "🎧 Headsets & Áudio";
    } else if (categoria === 'hardware') {
        produtosFiltrados = todosProdutos.filter(p => {
            const n = p.nome.toLowerCase();
            return n.includes("ryzen") || n.includes("rtx") || n.includes("radeon") || n.includes("asrock") || n.includes("ddr5") || n.includes("ssd") || n.includes("cooler") || n.includes("80+");
        });
        if (elTitulo) elTitulo.innerText = "⚙️ Hardware & Peças (Tudo)";
    }
    // SUBCATEGORIAS DE HARDWARE
    else if (categoria === 'gpu') {
        produtosFiltrados = todosProdutos.filter(p => {
            const n = p.nome.toLowerCase();
            return n.includes("rtx") || n.includes("rx") || n.includes("radeon") || n.includes("geforce") || n.includes("placa de video");
        });
        if (elTitulo) elTitulo.innerText = "🎮 Placas de Vídeo";
    } else if (categoria === 'placa-mae') {
        produtosFiltrados = todosProdutos.filter(p => {
            const n = p.nome.toLowerCase();
            return n.includes("b550") || n.includes("b660") || n.includes("x570") || n.includes("z690") || n.includes("asrock") || n.includes("placa mãe") || n.includes("placa mae");
        });
        if (elTitulo) elTitulo.innerText = "🔌 Placas Mãe";
    } else if (categoria === 'cpu') {
        produtosFiltrados = todosProdutos.filter(p => {
            const n = p.nome.toLowerCase();
            return n.includes("ryzen") || n.includes("intel") || n.includes("i5") || n.includes("i7") || n.includes("7800x3d");
        });
        if (elTitulo) elTitulo.innerText = "💻 Processadores";
    } else if (categoria === 'ram') {
        produtosFiltrados = todosProdutos.filter(p => {
            const n = p.nome.toLowerCase();
            return n.includes("ddr4") || n.includes("ddr5") || n.includes("ram");
        });
        if (elTitulo) elTitulo.innerText = "⚡ Memória RAM";
    } else if (categoria === 'fonte-armazenamento') {
        produtosFiltrados = todosProdutos.filter(p => {
            const n = p.nome.toLowerCase();
            return n.includes("fonte") || n.includes("ssd") || n.includes("80+") || n.includes("nvme");
        });
        if (elTitulo) elTitulo.innerText = "🔋 Fontes & Armazenamento";
    } else if (categoria === 'promocao') {
        produtosFiltrados = todosProdutos.filter(p => p.preco < 1000);
        if (elTitulo) elTitulo.innerText = "🏷️ Promoções em Destaque";
    }

    elContainer.innerHTML = "";

    if (produtosFiltrados.length === 0) {
        elContainer.innerHTML = "<p style='color: #64748b; font-size: 1.1rem; grid-column: 1 / -1;'>Nenhum produto encontrado nesta categoria.</p>";
        return;
    }

    produtosFiltrados.forEach(p => {
        const caminhoImg = obterCaminhoImagem(p.nome);

        elContainer.innerHTML += `
            <div class="card-produto-loja">
                <div class="card-produto-img-box">
                    <img src="${caminhoImg}"
                     alt="${p.nome}"
                     class="card-produto-img"
                     onerror="this.onerror=null; this.src='imagens/logo-bepro.png.jpeg';">
                </div>
                <div class="card-produto-detalhes">
                    <h3 class="card-produto-titulo">${p.nome}</h3>
                    <p class="card-produto-preco">R$ ${p.preco}</p>
                    <button onclick="adicionarAoCarrinho('${p.nome}', ${p.preco})" class="btn-card-comprar">
                        Adicionar ao Carrinho
                    </button>
                </div>
            </div>
        `;
    });
}

// ==========================================
// 🎮 FILTRO CATEGORIZADO DE PRO PLAYERS
// ==========================================
async function carregarCursos() {
    const lista = document.getElementById("lista-cursos");
    if (!lista) return;
    lista.innerHTML = "<p>Carregando aulas da Academy...</p>";
    try {
        const response = await fetch("http://localhost:3000/cursos");
        const jazidaCursos = await response.json();

        lista.className = "produtos-grid";
        lista.innerHTML = "";

        if (jazidaCursos.length === 0) {
            lista.innerHTML = "<p>Nenhum treinamento disponível no momento.</p>";
            return;
        }

        jazidaCursos.forEach(c => {
            const tituloCompleto = c.titulo || c.nome || "";
            let jogoCompetitivo = "Coach";
            let proPlayer = "Disponível";

            if (tituloCompleto.includes(" - ")) {
                const partes = tituloCompleto.split(" - ");
                jogoCompetitivo = partes[0].trim();
                proPlayer = partes[1].trim();
            } else {
                jogoCompetitivo = tituloCompleto;
            }

            lista.innerHTML += `
                <div class="card" style="text-align: left; align-items: flex-start; justify-content: flex-start; padding: 25px; min-height: 240px !important;">
                    <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #00d4ff; font-weight: bold; margin-bottom: 5px;">${jogoCompetitivo}</span>
                    <h3 style="margin: 0 0 12px 0; font-size: 1.25rem; color: white;">👑 Pro Player: ${proPlayer}</h3>
                    <p style="font-size: 14px; line-height: 1.5; color: #a0aec0; margin: 0 0 15px 0;">${c.descricao}</p>
                    <button style="margin-top: auto; width: 100%; cursor: pointer;">Garantir Vaga na Aula</button>
                </div>`;
        });
    } catch (error) {
        lista.innerHTML = "<p>Erro ao buscar conteúdo do Coach de Pro Players.</p>";
    }
}

function sairConta() {
    localStorage.removeItem("usuarioLogado");
    atualizarStatusLogin();
    trocarAba("inicio");
}

function abrirCadastro() {
    document.getElementById("cadastro-box").style.display = "block";
}

function atualizarStatusLogin() {
    const logado = localStorage.getItem("usuarioLogado") === "true";
    const userArea = document.getElementById("auth-area");
    const userName = document.getElementById("auth-user");
    const menuLogin = document.getElementById("menu-login");
    const menuPedidos = document.getElementById("menu-pedidos");

    if (logado) {
        const usuario = JSON.parse(localStorage.getItem("usuario"));
        if (userName) userName.innerText = `Olá, ${usuario?.nome || "User"}`;
        if (userArea) userArea.style.display = "flex";
        if (menuLogin) menuLogin.style.display = "none";
        if (menuPedidos) menuPedidos.style.display = "block";
    } else {
        if (userArea) userArea.style.display = "none";
        if (menuLogin) menuLogin.style.display = "block";
        if (menuPedidos) menuPedidos.style.display = "none";
    }
}

window.onload = () => {
    atualizarCarrinhoUI();
    atualizarResumoPagamento();
    atualizarStatusLogin();
};

// ==========================================
// 🤖 DADOS DA ANÁLISE DE SETUP (GLOBAIS)
// Ficam fora da função para que adicionarPacoteCompleto()
// também consiga acessá-los.
// ==========================================
const tabelaPrecosSetup = {
    "AMD Ryzen 7 7800X3D (O Rei do FPS)": 2499,
    "AMD Ryzen 7 7800X3D (Estabilidade máxima de 1% Low)": 2499,
    "AMD Ryzen 7 7800X3D (Melhor engine sub-tick)": 2499,
    "AMD Ryzen 7 7800X3D (Crucial para o mapa pesado do Warzone)": 2499,
    "AMD Ryzen 5 7600X": 1400,
    "Intel Core i7-14700K": 2800,
    "NVIDIA GeForce RTX 4070 Super": 4399,
    "NVIDIA GeForce RTX 4060 Ti": 2799,
    "NVIDIA GeForce RTX 4070": 3999,
    "NVIDIA GeForce RTX 3060 Ti": 2100,
    "NVIDIA GeForce RTX 4070 Ti Super": 6100,
    "NVIDIA GeForce RTX 4080 Super (Foco em alta resolução/Frames)": 8500,
    "32 GB DDR5 6000 MHz CL30": 850,
    "32 GB DDR5 6000 MHz": 800,
    "16 GB DDR5 5600 MHz": 450,
    "32 GB DDR5 6400 MHz CL32": 950,
    "Wooting 80HE (Rapid Trigger Analógico)": 1800,
    "Wooting 60HE+ ou Razer Huntsman V3 Pro TKL": 1450,
    "Wooting 80HE (Desempenho de SOCD/Snap Tap)": 1800,
    "Logitech G Pro X TKL Rapid": 1000,
    "Razer Huntsman V3 Pro Mini": 1100,
    "Wooting 80HE": 1800,
    "Razer Viper V3 Pro (8000Hz Polling Rate)": 850,
    "Logitech G Pro X Superlight 2 Dex": 950,
    "Razer DeathAdder V3 Pro ou Logitech G Pro X Superlight 2": 850,
    "Razer Viper V3 Pro (Leveza para cliques rápidos/APM)": 850,
    "Logitech G Pro X Superlight 2": 800,
    "Razer Viper V3 Pro": 850,
    "Artisan FX Hayate Otsu XL": 400,
    "Artisan FX Zero Soft XL (Controle perfeito de flicada)": 450,
    "Lethal Gaming Gear Saturn Pro XL": 350,
    "Logitech G640 Large": 150,
    "Artisan Ninja FX Zero Mid": 400,
    "SkyPAD Glass 3.0 XL (Rastreamento infinito de tracking)": 750,
    "Audeze Maxwell Wireless": 2300,
    "HyperX Cloud III Wireless": 950,
    "SteelSeries Arctis Nova Pro Wireless": 2100,
    "Logitech G Pro X 2 LIGHTSPEED": 1400,
    "Beyerdynamic DT 990 Pro + Amp (Áudio de estúdio para pixels)": 1900,
    "Audeze Maxwell (Melhor palco sonoro para passos distantes)": 2300,
    "ASUS ROG Swift 360Hz OLED": 5500,
    "BenQ ZOWIE XL2586X+ (540Hz DyAc 2 - O padrão dos Majors)": 5999,
    "BenQ ZOWIE XL2566K (360Hz DyAc+)": 4200,
    "LG UltraGear 27\" OLED 240Hz (Cores e tempo de resposta absurdo)": 4500,
    "LG UltraGear 360Hz IPS": 3200,
    "ASUS ROG Swift PG27AQDM (1440p OLED 240Hz)": 4500
};

const setups = {
    fortnite: [
        "Processador: AMD Ryzen 7 7800X3D (O Rei do FPS)",
        "Placa de Vídeo: NVIDIA GeForce RTX 4070 Super",
        "Memória RAM: 32 GB DDR5 6000 MHz CL30",
        "Teclado: Wooting 80HE (Rapid Trigger Analógico)",
        "Mouse: Razer Viper V3 Pro (8000Hz Polling Rate)",
        "Mousepad: Artisan FX Hayate Otsu XL",
        "Headset: Audeze Maxwell Wireless",
        "Monitor: ASUS ROG Swift 360Hz OLED"
    ],
    valorant: [
        "Processador: AMD Ryzen 7 7800X3D (Estabilidade máxima de 1% Low)",
        "Placa de Vídeo: NVIDIA GeForce RTX 4060 Ti",
        "Memória RAM: 32 GB DDR5 6000 MHz CL30",
        "Teclado: Wooting 60HE+ ou Razer Huntsman V3 Pro TKL",
        "Mouse: Logitech G Pro X Superlight 2 Dex",
        "Mousepad: Artisan FX Zero Soft XL (Controle perfeito de flicada)",
        "Headset: HyperX Cloud III Wireless",
        "Monitor: BenQ ZOWIE XL2586X+ (540Hz DyAc 2)"
    ],
    cs2: [
        "Processador: AMD Ryzen 7 7800X3D (Melhor engine sub-tick)",
        "Placa de Vídeo: NVIDIA GeForce RTX 4070",
        "Memória RAM: 32 GB DDR5 6000 MHz",
        "Teclado: Wooting 80HE (Desempenho de SOCD/Snap Tap)",
        "Mouse: Razer DeathAdder V3 Pro ou Logitech G Pro X Superlight 2",
        "Mousepad: Lethal Gaming Gear Saturn Pro XL",
        "Headset: SteelSeries Arctis Nova Pro Wireless",
        "Monitor: BenQ ZOWIE XL2566K (360Hz DyAc+)"
    ],
    lol: [
        "Processador: AMD Ryzen 5 7600X",
        "Placa de Vídeo: NVIDIA GeForce RTX 3060 Ti",
        "Memória RAM: 16 GB DDR5 5600 MHz",
        "Teclado: Logitech G Pro X TKL Rapid",
        "Mouse: Razer Viper V3 Pro (Leveza para cliques rápidos/APM)",
        "Mousepad: Logitech G640 Large",
        "Headset: Logitech G Pro X 2 LIGHTSPEED",
        "Monitor: LG UltraGear 27\" OLED 240Hz (Cores e tempo de resposta absurdo)"
    ],
    rainbow: [
        "Processador: Intel Core i7-14700K",
        "Placa de Vídeo: NVIDIA GeForce RTX 4070 Ti Super",
        "Memória RAM: 32 GB DDR5 6000 MHz",
        "Teclado: Razer Huntsman V3 Pro Mini",
        "Mouse: Logitech G Pro X Superlight 2",
        "Mousepad: Artisan Ninja FX Zero Mid",
        "Headset: Beyerdynamic DT 990 Pro + Amp (Áudio de estúdio para pixels)",
        "Monitor: LG UltraGear 360Hz IPS"
    ],
    warzone: [
        "Processador: AMD Ryzen 7 7800X3D (Crucial para o mapa pesado do Warzone)",
        "Placa de Vídeo: NVIDIA GeForce RTX 4080 Super (Foco em alta resolução/Frames)",
        "Memória RAM: 32 GB DDR5 6400 MHz CL32",
        "Teclado: Wooting 80HE",
        "Mouse: Razer Viper V3 Pro",
        "Mousepad: SkyPAD Glass 3.0 XL (Rastreamento infinito de tracking)",
        "Headset: Audeze Maxwell (Melhor palco sonoro para passos distantes)",
        "Monitor: ASUS ROG Swift PG27AQDM (1440p OLED 240Hz)"
    ]
};

const nomesJogos = {
    fortnite: "Fortnite",
    valorant: "Valorant",
    cs2: "Counter Strike 2",
    lol: "League of Legends",
    rainbow: "Rainbow Six Siege",
    warzone: "Call of Duty: Warzone"
};

function analisarSetup() {
    const jogo = document.getElementById("jogo").value;
    const resultado = document.getElementById("resultado-setup");
    const robot = document.getElementById("robot");

    if (!jogo) {
        if (resultado) resultado.innerHTML = "<p>⚠️ Selecione um jogo primeiro.</p>";
        return;
    }

    if (resultado) resultado.innerHTML = "";
    if (robot) robot.style.display = "block";

    let itens = setups[jogo];

    setTimeout(() => {
        if (robot) robot.style.display = "none";

        if (resultado) {
            let htmlCards = "";

            itens.forEach(item => {
                const partes = item.split(":");
                const categoria = partes[0].trim();
                const modelo = partes[1].trim();

                const precoReal = tabelaPrecosSetup[modelo] || 150;
                const modeloEscapado = modelo.replace(/"/g, '&quot;').replace(/'/g, "\\'");

                htmlCards += `
                    <div class="setup-item" style="background: #111823; padding: 15px; border-radius: 8px; border: 1px solid #1f293d; display: flex; flex-direction: column; justify-content: space-between;">
                        <div>
                            <span style="color: #00d4ff; font-size: 12px; font-weight: bold; text-transform: uppercase; display: block; margin-bottom: 4px;">${categoria}</span>
                            <strong style="color: white; font-size: 15px; display: block; line-height: 1.4; margin-bottom: 4px;">${modelo}</strong>
                            <span style="color: #48bb78; font-weight: bold; font-size: 14px; display: block; margin-bottom: 8px;">R$ ${precoReal}</span>
                        </div>
                        <button onclick="adicionarAoCarrinho('${modeloEscapado}', ${precoReal})" style="width: 100%; margin-top: 10px; padding: 8px; font-size: 13px; background: #00d4ff; color: black; font-weight: bold; border: none; border-radius: 4px; cursor: pointer;">
                            + Carrinho
                        </button>
                    </div>
                `;
            });

            resultado.innerHTML = `
                <div class="setup-card" style="margin-top: 20px;">
                    <h3 style="color: #00d4ff; font-family: 'Rajdhani', sans-serif; font-size: 24px; text-transform: uppercase; margin-bottom: 20px;">
                        🤖 Ecossistema Elite Recomendado para ${nomesJogos[jogo]}
                    </h3>
                    <div class="setup-table" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 15px; text-align: left;">
                        ${htmlCards}
                    </div>

                    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #1f293d;">
                        <button onclick="adicionarPacoteCompleto('${jogo}')" style="background: #00d4ff; color: #000; border: none; padding: 14px 28px; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; box-shadow: 0 0 15px rgba(0, 212, 255, 0.4); text-transform: uppercase; transition: 0.3s;">
                            🛒 Adicionar Pacote Completo ao Carrinho
                        </button>
                    </div>
                </div>
            `;
        }
    }, 1500);
}

// Adiciona os 8 itens do setup recomendado de uma vez só (novidade do Kelvyn)
function adicionarPacoteCompleto(jogoChave) {
    const listaItens = setups[jogoChave];
    if (!listaItens) return;

    listaItens.forEach(item => {
        const partes = item.split(":");
        if (partes.length >= 2) {
            const modelo = partes[1].trim();
            const precoReal = tabelaPrecosSetup[modelo] || 150;
            adicionarAoCarrinho(modelo, precoReal);
        }
    });

    alert(`🚀 Todos os componentes recomendados para ${nomesJogos[jogoChave]} foram adicionados ao carrinho!`);
}

// ==========================================
// 👑 CARROSSEL DE PRO PLAYERS (CARD ÚNICO)
// ==========================================
const playersData = [
    {
        nome: "👑 Pro Player: Blackoutz",
        jogo: "FORTNITE",
        imagem: "imagens/blackoutzx.jpg",
        preco: "R$ 150,00",
        descricao: "Aprenda mecânicas avançadas de construção, highground retakes e rotas de mapa com um dos maiores nomes do Fortnite brasileiro."
    },
    {
        nome: "👑 Pro Player: Fallen",
        jogo: "COUNTER STRIKE 2",
        imagem: "imagens/Fallen.jpg",
        preco: "R$ 200,00",
        descricao: "Aprenda controle de mapa, posicionamento de AWP, setups de granadas e mentalidade de capitão com o Professor."
    },
    {
        nome: "👑 Pro Player: Faker",
        jogo: "LEAGUE OF LEGENDS",
        imagem: "imagens/Faker.jpg",
        preco: "R$ 300,00",
        descricao: "Domine o controle de wave na Mid Lane, visão de mapa macro, gerenciamento de recursos e tomadas de decisão."
    },
    {
        nome: "👑 Pro Player: Neskwga",
        jogo: "RAINBOW SIX SIEGE",
        imagem: "imagens/Neskwga.jpg",
        preco: "R$ 180,00",
        descricao: "Estratégias de ataque e defesa estruturadas, posicionamento de mira e comunicação avançada de equipe em alto nível."
    },
    {
        nome: "👑 Pro Player: FRTT",
        jogo: "VALORANT",
        imagem: "imagens/FRTT.jpg",
        preco: "R$ 160,00",
        descricao: "Otimização de uso de utilitários de agentes, estratégias avançadas de clutch, leitura de economia e movimentação tática."
    },
    {
        nome: "👑 Pro Player: TonyBoy",
        jogo: "CALL OF DUTY: WARZONE",
        imagem: "imagens/tonyBOy.jpg",
        preco: "R$ 140,00",
        descricao: "Movimentação avançada (slide cancel), gerenciamento de inventário sob pressão, escolha dos melhores loadouts e rotações."
    }
];

let playerIndexAtual = 0;

function mudarPlayer(direcao) {
    const card = document.getElementById('card-player');
    if (!card) return;

    card.style.opacity = '0';
    card.style.transform = 'scale(0.95)';

    setTimeout(() => {
        playerIndexAtual += direcao;

        if (playerIndexAtual >= playersData.length) playerIndexAtual = 0;
        if (playerIndexAtual < 0) playerIndexAtual = playersData.length - 1;

        const player = playersData[playerIndexAtual];

        const elNome = document.getElementById('player-nome');
        const elJogo = document.getElementById('player-jogo');
        const elImg = document.getElementById('player-img');
        const elDesc = document.getElementById('player-desc');
        const elPreco = document.getElementById('player-preco');

        if (elNome) elNome.innerText = player.nome;
        if (elJogo) elJogo.innerText = player.jogo;
        if (elImg) elImg.src = player.imagem;
        if (elDesc) elDesc.innerText = player.descricao;
        if (elPreco) elPreco.innerText = player.preco;

        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
    }, 200);
}

// ==========================================
// 🏆 CONTROLE DO MODAL DE PLANOS DE COACH (novidade do Kelvyn)
// ==========================================
function abrirModalPlanos() {
    const modal = document.getElementById("modal-planos");
    if (modal) modal.style.display = "flex";
}

function fecharModalPlanos() {
    const modal = document.getElementById("modal-planos");
    if (modal) modal.style.display = "none";
}

// Ao clicar em um plano, adiciona ao carrinho (usando o helper que já existe,
// pra garantir que salva no localStorage e atualiza a tela certinho) e leva pro carrinho
function assinarPlano(nomePlano, preco) {
    adicionarAoCarrinho(`Aulas Pro Player (Plano ${nomePlano})`, preco);
    fecharModalPlanos();
    trocarAba("carrinho");
}