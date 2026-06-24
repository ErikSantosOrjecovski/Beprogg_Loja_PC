// ==========================================
// 🔹 CONTROLE DE ABAS
// ==========================================
function trocarAba(id) {
    document.querySelectorAll(".conteudo").forEach(sec => sec.classList.remove("ativo"));
    document.getElementById(id).classList.add("ativo");

    atualizarCarrinhoUI();
    atualizarResumoPagamento();

    if (id === "pedidos") carregarPedidos();
    if (id === "coach") carregarCursos();
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
    // 1. Atualiza o texto do botão principal
    const displayTexto = document.getElementById('perfil-selected' || 'perfil-selecionado');
    if (displayTexto) displayTexto.innerText = nomePerfil;
    
    // 2. Atualiza o ícone do botão principal mantendo a cor do design
    const iconePrincipal = document.querySelector('.perfil-botao .icon-perfil');
    if (iconePrincipal) {
        iconePrincipal.className = `fa-solid ${classeIcone} icon-perfil`;
    }
    
    // 3. Remove a classe 'ativo' de todos os itens do dropdown
    const itens = document.querySelectorAll('.perfil-item');
    itens.forEach(item => item.classList.remove('ativo'));
    
    // 4. Adiciona a classe 'ativo' ao item selecionado
    itens.forEach(item => {
        if (item.innerText.includes(nomePerfil)) {
            item.classList.add('ativo');
        }
    });
    
    // 5. Fecha o dropdown após a seleção
    const dropdown = document.getElementById('perfil-dropdown');
    if (dropdown) dropdown.style.display = 'none';
    
    console.log("Filtro de Perfil alterado para: " + nomePerfil);
}

// Fechar o dropdown se o usuário clicar fora dele
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
        "AMD Ryzen 7 7800X3D": 2499,
        "Air cooler premium ou AIO 240 mm": 450,
        "ASRock B650M Pro RS": 1100,
        "NVIDIA GeForce RTX 5070 ou AMD Radeon RX 9070 XT": 4999,
        "32 GB DDR5 6000 MHz CL30": 850,
        "SSD 1 TB NVMe PCIe 4.0": 450,
        "750 W 80+ Gold": 600,
        "Gabinete com bom airflow": 350,
        "Wooting 80HE": 1800,
        "Logitech G Pro X Superlight 2 Superstrike": 900,
        "Logitech G Pro X Superlight 2": 800,
        "Razer Viper V3 Pro": 850,
        "Razer Viper V4 Pro": 950,
        "Razer Huntsman V3 Pro TKL": 1200,
        "Logitech G Pro X TKL Rapid": 1000,
        "FX Hayate Otsu v2 XL": 350,
        "Artisan FX Hayate Otsu Soft": 400,
        "Mousepad Artisan FX Zero Xxl": 450,
        "Artisan Ninja FX Zero Mid": 400,
        "Logitech G640 Large": 150,
        "Lethal Gaming Gear Saturn Pro": 300,
        "Audeze Maxwell Wireless Gaming": 2300,
        "SteelSeries Arctis Nova Pro Wireless": 2100,
        "HyperX Cloud III Wireless": 950,
        "Logitech G Pro X 2 LIGHTSPEED": 1400,
        "BenQ ZOWIE XL2586X+": 5999,
        "LG UltraGear 27GR75FG (360Hz IPS)": 3800,
        "ASUS ROG Swift PG27AQDM": 4500,
        "Pulsar ES Arm Sleeve": 120,
        "SteelSeries Gaming Sleeve": 100,
        "Skypad Sora Arm Sleeve": 150,
        "Base Labs Gaming Sleeve": 80
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

// ==========================================
// 🛒 CARREGAMENTO FILTRADO DA LOJA (PEÇAS E PERIFÉRICOS)
// ==========================================
async function carregarProdutos() {
    const listaPecas = document.getElementById("lista-pecas");
    const listaPerifericos = document.getElementById("lista-perifericos");
    
    if (!listaPecas || !listaPerifericos) return;
    
    listaPecas.innerHTML = "<p style='color: gray;'>Carregando peças...</p>";
    listaPerifericos.innerHTML = "<p style='color: gray;'>Carregando periféricos...</p>";
    
    const termosPerifericos = [
        "mouse", "teclado", "headset", "fone", "monitor", "mousepad", "sleeve", "manguito", 
        "wooting", "logitech", "razer", "artisan", "zowie", "hyperx", "audiotechnica", "astros"
    ];

    try {
        const response = await fetch("http://localhost:3000/produtos");
        const produtos = await response.json();
        
        listaPecas.innerHTML = "";
        listaPerifericos.innerHTML = "";
        
        if (produtos.length === 0) {
            listaPecas.innerHTML = "<p style='color: gray;'>Nenhum produto disponível.</p>";
            listaPerifericos.innerHTML = "<p style='color: gray;'>Nenhum produto disponível.</p>";
            return;
        }

        produtos.forEach(p => {
            const nomeMinusculo = p.nome.toLowerCase();
            const ehPeriferico = termosPerifericos.some(termo => nomeMinusculo.includes(termo));

            const produtoCard = `
                <div class="card" style="text-align: left; padding: 20px; display: flex; flex-direction: column; justify-content: space-between; border: 1px solid #2d3748; background: #1a2332; border-radius: 8px;">
                    <div>
                        <h3 style="margin: 0 0 8px 0; font-size: 1.1rem; color: white;">${p.nome}</h3>
                        <p style="color: #48bb78; font-weight: bold; font-size: 1.1rem; margin: 0 0 15px 0;">R$ ${p.preco}</p>
                    </div>
                    <button onclick="adicionarAoCarrinho('${p.nome}', ${p.preco})" style="width: 100%; cursor: pointer; background: #00d4ff; color: black; font-weight: bold; padding: 10px; border: none; border-radius: 4px;">
                        Adicionar ao Carrinho
                    </button>
                </div>
            `;

            if (ehPeriferico) {
                listaPerifericos.innerHTML += produtoCard;
            } else {
                listaPecas.innerHTML += produtoCard;
            }
        });

        if (listaPecas.innerHTML === "") {
            listaPecas.innerHTML = "<p style='color: gray;'>Nenhuma peça no catálogo.</p>";
        }
        if (listaPerifericos.innerHTML === "") {
            listaPerifericos.innerHTML = "<p style='color: gray;'>Nenhum periférico no catálogo.</p>";
        }

    } catch (error) {
        console.error("Erro ao carregar os itens do catálogo:", error);
        listaPecas.innerHTML = "<p style='color: red;'>Erro ao carregar catálogo.</p>";
        listaPerifericos.innerHTML = "<p style='color: red;'>Erro ao carregar catálogo.</p>";
    }
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
        
        lista.className = "produtos-grid"; // Sincronizado com a classe do index unificado
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

function analisarSetup() {
    const jogo = document.getElementById("jogo").value;
    const resultado = document.getElementById("resultado-setup");

    if (!jogo) {
        resultado.innerHTML = "<p>Selecione um jogo primeiro.</p>";
        return;
    }

    const setups = {
        fortnite: ["AMD Ryzen 7 7800X3D", "RTX 4060", "32 GB DDR5 6000 MHz", "Teclado Wooting 80HE"],
        valorant: ["Intel Core i5-12400F", "RTX 3060", "Mouse Logitech G Pro X Superlight 2", "BenQ ZOWIE XL2586X+"],
        cs2: ["Ryzen 7 5700X", "RTX 4060", "Teclado mecânico", "Headset competitivo"],
        lol: ["Ryzen 5 5600X", "RTX 3060", "Mouse gamer preciso", "Monitor 144Hz"],
        rainbow: ["Intel Core i7-13700K", "RTX 4070", "Headset surround", "Mouse Logitech G Pro X Superlight 2"],
        warzone: ["AMD Ryzen 7 7800X3D", "RTX 5070", "32 GB DDR5", "SSD NVMe 1TB"]
    };

    const nomesJogos = {
        fortnite: "Fortnite",
        valorant: "Valorant",
        cs2: "Counter Strike 2",
        lol: "League of Legends",
        rainbow: "Rainbow Six Siege",
        warzone: "Call of Duty: Warzone"
    };

    let itens = setups[jogo];

    resultado.innerHTML = `
        <div class="setup-card">
            <h3>Setup recomendado pela Buildix IA para ${nomesJogos[jogo]}</h3>
            <div class="setup-table">
                ${itens.map(item => `
                    <div class="setup-item">
                        <strong>${item}</strong>
                        <p>Peça recomendada para melhor desempenho competitivo.</p>
                        <button onclick="adicionarAoCarrinho('${item}', 100)">Adicionar ao Carrinho</button>
                    </div>
                `).join("")}
            </div>
        </div>
    `;
}