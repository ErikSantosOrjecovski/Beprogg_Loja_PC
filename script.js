// ============================
// 🔹 CONTROLE DE ABAS
// ============================
function trocarAba(id) {

    document.querySelectorAll(".conteudo")
        .forEach(sec => sec.classList.remove("ativo"));

    document.getElementById(id).classList.add("ativo");

    atualizarCarrinhoUI();
    atualizarResumoPagamento();

    if (id === "pedidos") {
        carregarPedidos();
    }
}

// ============================
// 🛒 CARRINHO
// ============================
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

function adicionarAoCarrinho(nome) {
    const item = {
        nome,
        preco: gerarPrecoFake(nome)
    };

    carrinho.push(item);
    salvarCarrinho();
    atualizarCarrinhoUI();
    atualizarResumoPagamento();
}

function gerarPrecoFake(nome) {
    const precos = {
        "RTX 4060": 2500,
        "RTX 3060": 1800,
        "Ryzen 5 5600": 800,
        "Intel i5 12400F": 900,
        "Teclado RGB": 250,
        "Mouse Gamer": 150,
        "Headset": 300,
        "Mousepad": 80
    };

    return precos[nome] || 100;
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
            </div>
        `;
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

// ============================
// 🤖 BUILDIX MATCH + IA
// ============================
async function gerarRecomendacao() {

    const orcamento = document.getElementById("orcamento").value;
    const jogo = document.getElementById("jogo").value;
    const uso = document.getElementById("uso").value;

    const resultado = document.getElementById("resultado-buildix");
    const robot = document.getElementById("robot");
    const robotText = document.getElementById("robot-text");
    const respostaIA = document.getElementById("resposta-ia");

    if (!orcamento || !jogo || !uso) {
        resultado.innerHTML = "⚠️ Preencha todas as opções!";
        if (respostaIA) respostaIA.innerHTML = "";
        return;
    }

    resultado.innerHTML = "";
    if (respostaIA) respostaIA.innerHTML = "";

    if (robot && robotText) {
        robot.style.display = "block";
        robotText.innerText = "🤖 Analisando seu perfil gamer...";
    }

    let perfil = "";
    let pc = "";
    let desempenho = "";
    let explicacao = "";

    if (uso === "fps") {
        perfil = "Competitivo";
        pc = "Ryzen 5 5600 + RTX 4060";
        desempenho = "Foco em FPS alto, baixa latência e estabilidade.";
        explicacao = "Ideal para jogadores competitivos que querem partidas rápidas, lisas e sem travamentos.";
    }

    if (uso === "grafico") {
        perfil = "Qualidade Gráfica";
        pc = "Ryzen 7 + RTX 4070";
        desempenho = "Foco em gráficos no Ultra com FPS estável.";
        explicacao = "Ideal para jogadores que querem aproveitar jogos bonitos, detalhados e sem engasgos.";
    }

    setTimeout(async () => {

        resultado.innerHTML = `
            <h3>🎯 Perfil: ${perfil}</h3>
            <p><strong>💻 PC recomendado:</strong> ${pc}</p>
            <p><strong>⚡ Desempenho:</strong> ${desempenho}</p>
            <p><strong>🤖 Explicação:</strong> ${explicacao}</p>
        `;

        try {
            const response = await fetch("http://localhost:3000/recomendar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ uso, jogo })
            });

            const data = await response.json();

            if (respostaIA) {
                respostaIA.innerHTML = `
                    <h3>🤖 IA Buildix recomenda:</h3>
                    <p>${data.resposta}</p>
                `;
            }

        } catch (error) {
            if (respostaIA) {
                respostaIA.innerHTML = "⚠️ IA não respondeu. Verifique se o backend está rodando.";
            }
        }

        if (robot) {
            robot.style.display = "none";
        }

    }, 1500);
}

// ============================
// 👤 LOGIN / CADASTRO
// ============================
function fazerCadastro(event) {

    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const msg = document.getElementById("msg-cadastro");

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const senhaForte = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!nome || !email || !senha) {
        msg.innerText = "❗ Preencha todos os campos!";
        msg.style.color = "red";
        return;
    }

    if (!emailValido.test(email)) {
        msg.innerText = "❗ Insira um email válido!";
        msg.style.color = "red";
        return;
    }

    if (!senhaForte.test(senha)) {
        msg.innerText = "❗ Sua senha deve ter 8 caracteres, número, maiúscula e minúscula!";
        msg.style.color = "red";
        return;
    }

    const usuario = { nome, email, senha };

    localStorage.setItem("usuario", JSON.stringify(usuario));
    localStorage.setItem("usuarioLogado", "true");

    msg.innerText = "✅ Conta criada com sucesso! Você já está logado.";
    msg.style.color = "green";

    document.getElementById("nome").value = "";
    document.getElementById("email").value = "";
    document.getElementById("senha").value = "";

    atualizarStatusLogin();

    setTimeout(() => {
        trocarAba("inicio");
    }, 1500);
}

function fazerLogin() {

    const email = document.getElementById("login-email").value.trim();
    const senha = document.getElementById("login-senha").value.trim();
    const msg = document.getElementById("msg-login");

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!email || !senha) {
        msg.innerText = "❗ Preencha email e senha!";
        msg.style.color = "red";
        return;
    }

    if (!usuario) {
        msg.innerText = "❗ Nenhuma conta cadastrada. Crie uma conta primeiro.";
        msg.style.color = "red";
        return;
    }

    if (email !== usuario.email || senha !== usuario.senha) {
        msg.innerText = "❗ Email ou senha incorretos!";
        msg.style.color = "red";
        return;
    }

    localStorage.setItem("usuarioLogado", "true");

    msg.innerText = "✅ Login realizado com sucesso!";
    msg.style.color = "green";

    document.getElementById("login-email").value = "";
    document.getElementById("login-senha").value = "";

    atualizarStatusLogin();

    setTimeout(() => {
        trocarAba("inicio");
    }, 1500);
}

function sairConta() {
    localStorage.removeItem("usuarioLogado");

    atualizarStatusLogin();
    trocarAba("login");
}

function abrirCadastro() {
    const box = document.getElementById("cadastro-box");
    const botao = document.getElementById("btn-abrir-cadastro");

    box.style.display = "block";
    botao.style.display = "none";
}

function atualizarStatusLogin() {

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const usuarioLogado = localStorage.getItem("usuarioLogado");

    const authArea = document.getElementById("auth-area");
    const authUser = document.getElementById("auth-user");
    const menuLogin = document.getElementById("menu-login");
    const menuPedidos = document.getElementById("menu-pedidos");

    if (!authArea || !authUser || !menuLogin) return;

    if (usuario && usuarioLogado === "true") {
        authArea.style.display = "flex";
        authUser.innerText = "👤 Logado como: " + usuario.nome;
        menuLogin.style.display = "none";
        if (menuPedidos) menuPedidos.style.display = "block";
    } else {
        authArea.style.display = "none";
        authUser.innerText = "";
        menuLogin.style.display = "block";
        if (menuPedidos) menuPedidos.style.display = "none";
    }
}

// ============================
// 💳 PAGAMENTO
// ============================
function atualizarResumoPagamento() {

    const resumo = document.getElementById("resumo-pagamento");

    if (!resumo) return;

    resumo.innerHTML = "";

    if (carrinho.length === 0) {
        resumo.innerHTML = "<p>Nenhum item no carrinho.</p>";
        return;
    }

    let total = 0;

    carrinho.forEach(item => {
        total += item.preco;

        resumo.innerHTML += `
            <p>${item.nome} - R$ ${item.preco}</p>
        `;
    });

    resumo.innerHTML += `
        <hr>
        <h3>Total: R$ ${total}</h3>
    `;
}

async function finalizarPedido() {

    const nome = document.getElementById("nome-cliente").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const endereco = document.getElementById("endereco").value.trim();
    const pagamento = document.getElementById("forma-pagamento").value;
    const mensagem = document.getElementById("mensagem-pedido");

    const usuarioCadastrado = JSON.parse(localStorage.getItem("usuario"));
    const usuarioLogado = localStorage.getItem("usuarioLogado");

    if (!usuarioCadastrado || usuarioLogado !== "true") {
        mensagem.innerText = "⚠️ Para finalizar a compra, você precisa criar uma conta ou fazer login.";
        mensagem.style.color = "red";

        setTimeout(() => {
            trocarAba("login");
        }, 1800);

        return;
    }

    const telefoneValido = /^\(?\d{2}\)?\s?9?\d{4}-\d{4}$/;

    if (!nome || !telefone || !endereco || !pagamento) {
        mensagem.innerText = "❗ Preencha todos os campos!";
        mensagem.style.color = "red";
        return;
    }

    if (nome.length < 3) {
        mensagem.innerText = "❗ Digite um nome válido!";
        mensagem.style.color = "red";
        return;
    }

    if (!telefoneValido.test(telefone)) {
        mensagem.innerText = "❗ Digite um telefone válido com DDD e tracinho. Ex: (41) 99999-9999";
        mensagem.style.color = "red";
        return;
    }

    if (endereco.length < 5) {
        mensagem.innerText = "❗ Digite um endereço válido!";
        mensagem.style.color = "red";
        return;
    }

    if (carrinho.length === 0) {
        mensagem.innerText = "❗ Seu carrinho está vazio!";
        mensagem.style.color = "red";
        return;
    }

    const pedido = {
        cliente: nome,
        telefone,
        endereco,
        pagamento,
        usuario: usuarioCadastrado,
        itens: carrinho,
        data: new Date().toLocaleString("pt-BR")
    };

    mensagem.innerText = "⏳ Processando pedido...";
    mensagem.style.color = "#00d4ff";

    setTimeout(async () => {

        try {
            const response = await fetch("http://localhost:3000/pedido", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(pedido)
            });

            const data = await response.json();

            mensagem.innerText = data.mensagem || "✅ Pedido realizado com sucesso!";
            mensagem.style.color = "green";

            carrinho = [];
            salvarCarrinho();
            atualizarCarrinhoUI();
            atualizarResumoPagamento();

            document.getElementById("nome-cliente").value = "";
            document.getElementById("telefone").value = "";
            document.getElementById("endereco").value = "";
            document.getElementById("forma-pagamento").value = "";

        } catch (error) {
            mensagem.innerText = "⚠️ Não foi possível finalizar o pedido. Verifique se o backend está rodando.";
            mensagem.style.color = "red";
        }

    }, 1800);
}

// ============================
// 📦 MEUS PEDIDOS
// ============================
async function carregarPedidos() {

    const lista = document.getElementById("lista-pedidos");

    if (!lista) {
        console.log("Elemento lista-pedidos não encontrado.");
        return;
    }

    lista.innerHTML = "<p>⏳ Carregando seus pedidos...</p>";

    try {

        const response = await fetch("http://localhost:3000/pedidos");
        const pedidos = await response.json();

        if (!pedidos || pedidos.length === 0) {
            lista.innerHTML = "<p>Nenhum pedido encontrado.</p>";
            return;
        }

        const usuario = JSON.parse(localStorage.getItem("usuario"));

        if (!usuario) {
            lista.innerHTML = "<p>⚠️ Faça login para ver seus pedidos.</p>";
            return;
        }

        const pedidosDoUsuario = pedidos.filter(pedido => {
            return pedido.usuario && pedido.usuario.email === usuario.email;
        });

        if (pedidosDoUsuario.length === 0) {
            lista.innerHTML = "<p>Você ainda não realizou nenhum pedido com esta conta.</p>";
            return;
        }

        lista.innerHTML = "";

        pedidosDoUsuario.reverse().forEach((pedido, index) => {

            let itensHTML = "";
            let total = 0;

            pedido.itens.forEach(item => {
                total += item.preco;
                itensHTML += `<li>${item.nome} - R$ ${item.preco}</li>`;
            });

            lista.innerHTML += `
                <div class="card">
                    <h3>📦 Pedido #${pedidosDoUsuario.length - index}</h3>

                    <p><strong>Cliente:</strong> ${pedido.cliente}</p>
                    <p><strong>Data:</strong> ${pedido.data}</p>
                    <p><strong>Pagamento:</strong> ${pedido.pagamento}</p>

                    <p><strong>Itens:</strong></p>
                    <ul>
                        ${itensHTML}
                    </ul>

                    <h3>Total: R$ ${total}</h3>
                    <p><strong>Status:</strong> Pedido confirmado ✅</p>
                </div>
            `;
        });

    } catch (erro) {

        console.log(erro);

        lista.innerHTML =
            "<p>⚠️ Não foi possível carregar os pedidos. Verifique se o backend está rodando.</p>";

    }
}

// ============================
// 🚀 INICIALIZAÇÃO
// ============================
window.onload = () => {
    atualizarCarrinhoUI();
    atualizarResumoPagamento();
    atualizarStatusLogin();
};

// ============================
// 🧩 COMPATIBILIDADE DE HARDWARE
// ============================
function verificarCompatibilidade() {

    const cpu = document.getElementById("cpu").value;
    const placaMae = document.getElementById("placa-mae").value;
    const gpu = document.getElementById("gpu").value;
    const ram = document.getElementById("ram").value;
    const fonte = document.getElementById("fonte").value;

    const resultado = document.getElementById("resultado-compatibilidade");

    function adicionarBuildAoCarrinho() {

    const cpu = document.getElementById("cpu").value;
    const placaMae = document.getElementById("placa-mae").value;
    const gpu = document.getElementById("gpu").value;
    const ram = document.getElementById("ram").value;
    const fonte = document.getElementById("fonte").value;

    carrinho = [];

    const nomes = {
        amd: "Ryzen 5 5600",
        intel: "Intel i5 12400F",
        rtx4060: "RTX 4060",
        rtx3060: "RTX 3060",
        ddr4: "16GB DDR4",
        ddr5: "32GB DDR5",
        "500": "Fonte 500W",
        "550": "Fonte 550W",
        "650": "Fonte 650W"
    };

    carrinho.push({ nome: nomes[cpu], preco: gerarPrecoFake(nomes[cpu]) });
    carrinho.push({ nome: placaMae === "amd" ? "Placa-mãe B550" : "Placa-mãe B660", preco: placaMae === "amd" ? 700 : 900 });
    carrinho.push({ nome: nomes[gpu], preco: gerarPrecoFake(nomes[gpu]) });
    carrinho.push({ nome: nomes[ram], preco: ram === "ddr4" ? 350 : 600 });
    carrinho.push({ nome: nomes[fonte], preco: fonte === "500" ? 250 : fonte === "550" ? 320 : 450 });

    salvarCarrinho();
    atualizarCarrinhoUI();
    atualizarResumoPagamento();

    document.getElementById("resultado-compatibilidade").innerHTML =
        "✅ Build completa adicionada ao carrinho com sucesso!";
}

    if (!cpu || !placaMae || !gpu || !ram || !fonte) {
        resultado.innerHTML = "⚠️ Preencha todos os campos antes de verificar a compatibilidade.";
        resultado.style.color = "orange";
        return;
    }

    if (cpu !== placaMae) {
        resultado.innerHTML = "❌ Incompatibilidade detectada! Processador e placa-mãe utilizam plataformas diferentes.";
        resultado.style.color = "red";
        return;
    }

    if (placaMae === "amd" && ram !== "ddr4") {
        resultado.innerHTML = "❌ A placa-mãe B550 suporta apenas memória DDR4.";
        resultado.style.color = "red";
        return;
    }

    if (placaMae === "intel" && ram !== "ddr5") {
        resultado.innerHTML = "❌ A placa-mãe B660 suporta apenas memória DDR5.";
        resultado.style.color = "red";
        return;
    }

    if (gpu === "rtx3060" && Number(fonte) < 550) {
        resultado.innerHTML = "❌ A RTX 3060 precisa de uma fonte de pelo menos 550W.";
        resultado.style.color = "red";
        return;
    }

    if (gpu === "rtx4060" && Number(fonte) < 650) {
        resultado.innerHTML = "❌ A RTX 4060 precisa de uma fonte de pelo menos 650W.";
        resultado.style.color = "red";
        return;
    }

    resultado.style.color = "lightgreen";
    resultado.innerHTML = `
        ✅ Peças compatíveis! Sua configuração pode ser montada com segurança.<br><br>
        <button onclick="adicionarBuildAoCarrinho()">🛒 Adicionar Build ao Carrinho</button>
    `;
}

// ============================
// 🛒 ADICIONAR BUILD AO CARRINHO
// ============================
function adicionarBuildAoCarrinho() {

    const cpu = document.getElementById("cpu").value;
    const placaMae = document.getElementById("placa-mae").value;
    const gpu = document.getElementById("gpu").value;
    const ram = document.getElementById("ram").value;
    const fonte = document.getElementById("fonte").value;

    carrinho = [];

    const nomes = {
        amd: "Ryzen 5 5600",
        intel: "Intel i5 12400F",
        rtx4060: "RTX 4060",
        rtx3060: "RTX 3060",
        ddr4: "16GB DDR4",
        ddr5: "32GB DDR5",
        "500": "Fonte 500W",
        "550": "Fonte 550W",
        "650": "Fonte 650W"
    };

    carrinho.push({ nome: nomes[cpu], preco: gerarPrecoFake(nomes[cpu]) });
    carrinho.push({ nome: placaMae === "amd" ? "Placa-mãe B550" : "Placa-mãe B660", preco: placaMae === "amd" ? 700 : 900 });
    carrinho.push({ nome: nomes[gpu], preco: gerarPrecoFake(nomes[gpu]) });
    carrinho.push({ nome: nomes[ram], preco: ram === "ddr4" ? 350 : 600 });
    carrinho.push({ nome: nomes[fonte], preco: fonte === "500" ? 250 : fonte === "550" ? 320 : 450 });

    salvarCarrinho();
    atualizarCarrinhoUI();
    atualizarResumoPagamento();

    document.getElementById("resultado-compatibilidade").innerHTML =
        "✅ Build completa adicionada ao carrinho com sucesso!";
}