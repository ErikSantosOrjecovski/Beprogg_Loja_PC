function sanitizarTexto(str){
    if(!str)return'';
    return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
}

function exibirNomeUsuario(nome){
    const elemento=document.getElementById("nome-usuario");
    if(elemento)elemento.textContent=nome;
}

function trocarAba(id){
    document.querySelectorAll(".conteudo").forEach(sec=>sec.classList.remove("ativo"));
    const aba=document.getElementById(id);
    if(aba)aba.classList.add("ativo");

    atualizarCarrinhoUI();
    atualizarResumoPagamento();

    if(id==="pedidos")carregarPedidos();
    if(id==="loja")carregarProdutos();
}

let carrinho=JSON.parse(localStorage.getItem("carrinho"))||[];

function adicionarAoCarrinho(nomeOuId,preco=null){
    let nome=nomeOuId;
    let valor=preco;

    if(typeof nomeOuId==="number"||!isNaN(nomeOuId)){
        const prod=todosProdutos.find(p=>Number(p.id)===Number(nomeOuId));
        if(prod){
            nome=prod.nome;
            valor=prod.preco;
        }
    }

    const item={
        nome:String(nome),
        preco:valor!==null?Number(valor):0
    };

    carrinho.push(item);
    salvarCarrinho();
    atualizarCarrinhoUI();
    atualizarResumoPagamento();
    atualizarBadges?.();
    mostrarNotificacaoCarrinho(item.nome);

}

function mostrarNotificacaoCarrinho(nome) {
    // Remove uma notificação anterior, se existir
    const antiga = document.getElementById("notificacao-carrinho");
    if (antiga) antiga.remove();

    const notificacao = document.createElement("div");

    notificacao.id = "notificacao-carrinho";

    notificacao.innerHTML = `
        <div class="notificacao-carrinho-icone">🛒</div>
        <div class="notificacao-carrinho-texto">
            <strong>Adicionado ao carrinho</strong>
            <span>${nome}</span>
        </div>
    `;

    document.body.appendChild(notificacao);

    setTimeout(() => {
        notificacao.classList.add("saindo");

        setTimeout(() => {
            notificacao.remove();
        }, 300);
    }, 2200);
}

function atualizarCarrinhoUI(){
    const lista=document.getElementById("lista-carrinho");
    const total=document.getElementById("total-carrinho");

    if(!lista||!total)return;

    lista.innerHTML="";
    let soma=0;

    if(!carrinho.length){
        lista.innerHTML="<p style='color:#94a3b8'>Seu carrinho está vazio.</p>";
        total.innerText="Total: R$ 0";
        return;
    }

    carrinho.forEach((item,index)=>{
        soma+=Number(item.preco);

        lista.innerHTML+=`
        <div class="card" style="display:flex;justify-content:space-between;align-items:center;padding:15px;margin-bottom:10px;background:#0d1117;border:1px solid #1f293d">
            <div>
                <h4 style="color:#fff;margin:0">${sanitizarTexto(item.nome)}</h4>
                <p style="color:#00d4ff;font-weight:bold;margin:5px 0 0">R$ ${item.preco}</p>
            </div>
            <button onclick="removerItem(${index})" style="background:#ff4d4d;color:white;border:0;padding:6px 12px;border-radius:4px">Remover</button>
        </div>`;
    });

    total.innerText="Total: R$ "+soma;
}

function removerItem(index){
    carrinho.splice(index,1);
    salvarCarrinho();
    atualizarCarrinhoUI();
    atualizarResumoPagamento();
    atualizarBadges?.();
}

function salvarCarrinho(){
    localStorage.setItem("carrinho",JSON.stringify(carrinho));
}

function toggleDropdownPerfil(){
    const dropdown=document.getElementById("perfil-dropdown");
    if(!dropdown)return;
    dropdown.style.display=dropdown.style.display==="block"?"none":"block";
}

function selecionarPerfil(nomePerfil,classeIcone){
    const displayTexto=document.getElementById("perfil-selected")||document.getElementById("perfil-selecionado");

    if(displayTexto)displayTexto.innerText=nomePerfil;

    const icone=document.querySelector(".perfil-botao .icon-perfil");

    if(icone)
        icone.className=`fa-solid ${classeIcone} icon-perfil`;

    document.querySelectorAll(".perfil-item").forEach(item=>{
        item.classList.toggle("ativo",item.innerText.includes(nomePerfil));
    });

    const dropdown=document.getElementById("perfil-dropdown");
    if(dropdown)dropdown.style.display="none";
}

window.addEventListener("click",e=>{
    const container=document.querySelector(".perfil-container");
    const dropdown=document.getElementById("perfil-dropdown");

    if(container&&dropdown&&!container.contains(e.target))
        dropdown.style.display="none";
});

function abrirPerfil(){
    const logado=localStorage.getItem("usuarioLogado")==="true";

    if(!logado){
        trocarAba("login");
        return;
    }

    trocarAba("perfil");
    carregarPerfil?.();
     carregarPlano?.();
}

async function gerarRecomendacao(){
    const jogo=document.getElementById("jogo")?.value;
    const resultado=document.getElementById("resultado-buildix");
    const robot=document.getElementById("robot");
    const robotText=document.getElementById("robot-text");
    const respostaIA=document.getElementById("resposta-ia");

    if(!jogo){
        if(resultado)resultado.innerHTML="⚠️ Por favor, selecione um jogo competitivo!";
        if(respostaIA)respostaIA.innerHTML="";
        return;
    }

    if(resultado)resultado.innerHTML="";
    if(respostaIA)respostaIA.innerHTML="";

    if(robot&&robotText){
        robot.style.display="block";
        robotText.innerText="🤖 Computando ecossistema profissional da Academy...";
    }

    const tabelaPrecos={
        "AMD Ryzen 7 7800X3D":2899,
        "AMD Ryzen 9 7950X3D":4299,
        "AMD Ryzen 7 9700X":2599,
        "Intel Core i7-14700K":2799,
        "Intel Core i9-14900K":3999,
        "Air Cooler DeepCool AK620 Digital":480,
        "Water Cooler Lian Li Galahad II Trinity 360mm":1199,
        "Water Cooler Corsair iCUE Link H150i 360mm":1499,
        "Gabinete NZXT H9 Flow":1150,
        "ASRock B650M Pro RS":1150,
        "MSI MAG B650 Tomahawk WiFi":1699,
        "NVIDIA GeForce RTX 4060 Ti 8GB":2699,
        "NVIDIA GeForce RTX 4070 Super 12GB":4399,
        "NVIDIA GeForce RTX 4080 Super 16GB":7899,
        "NVIDIA GeForce RTX 5090":15999,
        "AMD Radeon RX 7800 XT 16GB":3999,
        "32 GB DDR5 6000 MHz CL30":899,
        "64 GB (2x32GB) DDR5 6000 MHz CL30":1699,
        "SSD 1 TB NVMe PCIe 4.0 (Kingston/XPG)":499,
        "SSD 2 TB Samsung 990 Pro NVMe PCIe 4.0":1299,
        "Fonte Corsair RM750x 750W 80+ Gold":749,
        "Wooting 80HE":1999,
        "Logitech G Pro X Superlight 2":899,
        "Razer Viper V3 Pro":899,
        "HyperX Cloud III Wireless":949,
        "Audeze Maxwell Wireless Gaming":2499,
        "BenQ ZOWIE XL2586X+ (540Hz)":5999
    };

    setTimeout(async()=>{
        try{
            const response=await fetch("http://localhost:3000/recomendar",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({jogo})
            });

            const data=await response.json();
            const linhas=data.resposta.split("\n");

            let pecas="";
            let perifericos="";
            let categoria="";

            linhas.forEach(linha=>{
                const texto=linha.replace("• ","").trim();

                if(texto.includes("Configuração Ideal Competitiva")){
                    categoria="pecas";
                    return;
                }

                if(texto.includes("Periféricos Ideais")){
                    categoria="perifericos";
                    return;
                }

                if(texto.includes(":")&&(categoria==="pecas"||categoria==="perifericos")){
                    const partes=texto.split(":");
                    const tipo=partes[0].trim();
                    const modelo=partes.slice(1).join(":").trim();
                    const preco=tabelaPrecos[modelo]||250;

                    const card=`
                    <div style="display:flex;justify-content:space-between;align-items:center;background:#111823;padding:12px;margin-bottom:8px;border-radius:6px">
                        <div>
                            <strong style="color:#00d4ff">${tipo}</strong>
                            <span style="color:white;display:block">${modelo}</span>
                            <b style="color:#48bb78">R$ ${preco}</b>
                        </div>
                        <button onclick="adicionarAoCarrinho('${modelo.replace(/'/g,"\\'")}',${preco})">
                        + Carrinho
                        </button>
                    </div>`;

                    if(categoria==="pecas")pecas+=card;
                    else perifericos+=card;
                }
            });

            if(respostaIA){
                respostaIA.innerHTML=`
                <div class="card-academy">
                    <h3>🤖 Setup Recomendado pela IA Store</h3>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
                        <div>
                            <h4>💻 Peças</h4>
                            ${pecas||"Nenhuma peça encontrada"}
                        </div>
                        <div>
                            <h4>🎮 Periféricos</h4>
                            ${perifericos||"Nenhum periférico encontrado"}
                        </div>
                    </div>
                </div>`;
            }

        }catch(e){
            console.error(e);
            if(respostaIA)respostaIA.innerHTML="⚠️ Erro ao processar recomendações.";
        }

        if(robot)robot.style.display="none";

    },1000);
}


function fazerCadastro(event){
    event.preventDefault();

    const usuario={
        nome:document.getElementById("nome").value.trim(),
        email:document.getElementById("email").value.trim(),
        senha:document.getElementById("senha").value.trim(),
        cpf:document.getElementById("cpf").value.trim(),
        telefone:document.getElementById("cadastro-tel").value.trim()
    };

    const msg=document.getElementById("msg-cadastro");

    if(Object.values(usuario).some(v=>!v)){
        msg.innerText="❗ Preencha todos os campos!";
        return;
    }

    localStorage.setItem("usuario",JSON.stringify(usuario));
    localStorage.setItem("usuarioLogado","true");

    msg.innerText="✅ Conta criada! Logando...";
    atualizarStatusLogin();

    setTimeout(()=>trocarAba("inicio"),1500);
}


function fazerLogin(){
    const email=document.getElementById("login-email").value.trim();
    const senha=document.getElementById("login-senha").value.trim();
    const msg=document.getElementById("msg-login");

    const usuario=JSON.parse(localStorage.getItem("usuario"));

    if(usuario&&usuario.email===email&&usuario.senha===senha){
        localStorage.setItem("usuarioLogado","true");
        msg.innerText="✅ Login realizado!";
        atualizarStatusLogin();
        setTimeout(()=>trocarAba("inicio"),1500);
    }else{
        msg.innerText="❌ Credenciais inválidas!";
    }
}


function atualizarResumoPagamento(){

    const resumo =
        document.getElementById("resumo-pagamento");

    if(!resumo)return;

    resumo.innerHTML="";

    let total=0;

    carrinho.forEach(item=>{

        total+=Number(item.preco)||0;

        resumo.innerHTML+=`
            <p>
                ${sanitizarTexto(item.nome)}
                -
                ${moeda(item.preco)}
            </p>
        `;
    });

    resumo.innerHTML+=`
        <h4>
            Total: ${moeda(total)}
        </h4>
    `;
}


/* =========================================================
   PAGAMENTO
   ========================================================= */

function obterTotalCarrinho(){

    return carrinho.reduce(
        (total,item)=>
            total+(Number(item.preco)||0),
        0
    );
}


/* =========================================================
   CRIAR ÁREA DOS DETALHES
   ========================================================= */

function criarAreaDetalhesPagamento(){

    const select =
        document.getElementById("forma-pagamento");

    if(!select)return null;

    let area =
        document.getElementById("detalhes-pagamento");

    if(!area){

        area=document.createElement("div");

        area.id="detalhes-pagamento";

        select.parentNode.insertBefore(
            area,
            select.nextSibling
        );
    }

    return area;
}


/* =========================================================
   CAMPO
   ========================================================= */

function campoPagamento(
    id,
    label,
    type="text",
    placeholder=""
){

    return `

        <label
            for="${id}"
            style="
                display:block;
                margin:10px 0 5px;
                color:#cbd5e1;
                font-weight:600;
            "
        >
            ${label}
        </label>

        <input
            id="${id}"
            type="${type}"
            placeholder="${placeholder}"
            autocomplete="off"

            style="
                width:100%;
                box-sizing:border-box;
                padding:11px;
                border-radius:7px;
                border:1px solid #263449;
                background:#0d1117;
                color:#fff;
            "
        >
    `;
}


/* =========================================================
   MOSTRAR CAMPOS DO PAGAMENTO
   ========================================================= */

function atualizarCamposPagamento(){

    const select =
        document.getElementById("forma-pagamento");

    const area =
        criarAreaDetalhesPagamento();

    if(!select || !area)return;

    const metodo =
        String(select.value||"").toLowerCase();

    area.innerHTML="";


    /* =========================
       PIX
       ========================= */

    if(metodo==="pix"){

        area.innerHTML=`

            <div
                style="
                    padding:15px;
                    margin-bottom:15px;
                    border:1px solid #1f3b52;
                    border-radius:8px;
                    background:#0d1722;
                "
            >

                <h4
                    style="
                        margin:0 0 10px;
                        color:#00d4ff;
                    "
                >
                    💠 Pagamento via PIX
                </h4>

                <p
                    style="
                        color:#cbd5e1;
                        margin-bottom:10px;
                    "
                >
                    Informe uma chave PIX ou gere o
                    pagamento através do QR Code.
                </p>

                ${campoPagamento(
                    "pix-chave",
                    "Chave PIX",
                    "text",
                    "CPF, e-mail, telefone ou chave aleatória"
                )}

                <div
                    id="pix-resultado"
                    style="
                        margin-top:15px;
                        text-align:center;
                    "
                ></div>

            </div>
        `;

        return;
    }


    /* =========================
       CARTÃO
       ========================= */

    if(
        metodo==="cartao" ||
        metodo==="cartao_credito" ||
        metodo==="credito"
    ){

        const total =
            obterTotalCarrinho();

        let parcelasHTML="";

        for(let i=1;i<=12;i++){

            const valor=
                total/i;

            parcelasHTML+=`

                <option value="${i}">
                    ${i}x de ${moeda(valor)}
                </option>

            `;
        }


        area.innerHTML=`

            <div
                style="
                    padding:15px;
                    margin-bottom:15px;
                    border:1px solid #1f3b52;
                    border-radius:8px;
                    background:#0d1722;
                "
            >

                <h4
                    style="
                        margin:0 0 10px;
                        color:#00d4ff;
                    "
                >
                    💳 Cartão de crédito
                </h4>


                ${campoPagamento(
                    "cartao-numero",
                    "Número do cartão",
                    "text",
                    "0000 0000 0000 0000"
                )}


                ${campoPagamento(
                    "cartao-nome",
                    "Nome no cartão",
                    "text",
                    "NOME COMPLETO"
                )}


                <div
                    style="
                        display:grid;
                        grid-template-columns:1fr 1fr;
                        gap:10px;
                    "
                >

                    <div>

                        ${campoPagamento(
                            "cartao-validade",
                            "Validade",
                            "text",
                            "MM/AA"
                        )}

                    </div>


                    <div>

                        ${campoPagamento(
                            "cartao-cvv",
                            "CVV",
                            "password",
                            "123"
                        )}

                    </div>

                </div>


                <label
                    for="cartao-parcelas"
                    style="
                        display:block;
                        margin:10px 0 5px;
                        color:#cbd5e1;
                        font-weight:600;
                    "
                >
                    Parcelas
                </label>


                <select
                    id="cartao-parcelas"

                    style="
                        width:100%;
                        padding:11px;
                        border-radius:7px;
                        border:1px solid #263449;
                        background:#0d1117;
                        color:#fff;
                    "
                >

                    ${parcelasHTML}

                </select>

            </div>
        `;


        configurarMascaraCartao();

        return;
    }


    /* =========================
       BOLETO
       ========================= */

    if(metodo==="boleto"){

        area.innerHTML=`

            <div
                style="
                    padding:15px;
                    margin-bottom:15px;
                    border:1px solid #1f3b52;
                    border-radius:8px;
                    background:#0d1722;
                "
            >

                <h4
                    style="
                        margin:0 0 10px;
                        color:#00d4ff;
                    "
                >
                    🧾 Pagamento via boleto
                </h4>


                <p
                    style="
                        color:#cbd5e1;
                        margin-bottom:10px;
                    "
                >
                    Informe o CPF do pagador para gerar
                    o boleto.
                </p>


                ${campoPagamento(
                    "boleto-cpf",
                    "CPF do pagador",
                    "text",
                    "000.000.000-00"
                )}


                <div
                    id="boleto-resultado"
                    style="margin-top:15px;"
                ></div>

            </div>

        `;
    }
}


/* =========================================================
   MÁSCARA CARTÃO
   ========================================================= */

function configurarMascaraCartao(){

    const numero =
        document.getElementById("cartao-numero");

    const validade =
        document.getElementById("cartao-validade");

    const cvv =
        document.getElementById("cartao-cvv");


    if(numero){

        numero.addEventListener(
            "input",
            ()=>{

                let valor=
                    numero.value
                    .replace(/\D/g,"")
                    .slice(0,16);

                numero.value=
                    valor
                    .replace(
                        /(\d{4})(?=\d)/g,
                        "$1 "
                    )
                    .trim();
            }
        );
    }


    if(validade){

        validade.addEventListener(
            "input",
            ()=>{

                let valor=
                    validade.value
                    .replace(/\D/g,"")
                    .slice(0,4);

                if(valor.length>2){

                    valor=
                        valor.slice(0,2)
                        +"/"+
                        valor.slice(2);
                }

                validade.value=valor;
            }
        );
    }


    if(cvv){

        cvv.addEventListener(
            "input",
            ()=>{

                cvv.value=
                    cvv.value
                    .replace(/\D/g,"")
                    .slice(0,4);
            }
        );
    }
}


/* =========================================================
   VALIDAR PAGAMENTO
   ========================================================= */

function validarPagamento(){

    const select =
        document.getElementById("forma-pagamento");

    if(!select){

        return{
            ok:false,
            mensagem:
                "Forma de pagamento não encontrada."
        };
    }


    const metodo =
        String(select.value||"").toLowerCase();


    if(!metodo){

        return{
            ok:false,
            mensagem:
                "⚠️ Selecione uma forma de pagamento."
        };
    }


    /* PIX */

    if(metodo==="pix"){

        const chave=
            document
            .getElementById("pix-chave")
            ?.value
            ?.trim()||"";

        return{

            ok:true,

            dados:{

                tipo:"pix",

                chave:chave
            }
        };
    }


    /* BOLETO */

    if(metodo==="boleto"){

        const cpf=
            document
            .getElementById("boleto-cpf")
            ?.value
            ?.replace(/\D/g,"")||"";


        if(cpf.length!==11){

            return{

                ok:false,

                mensagem:
                    "⚠️ Informe um CPF válido para gerar o boleto."
            };
        }


        return{

            ok:true,

            dados:{

                tipo:"boleto",

                cpf:cpf
            }
        };
    }


    /* CARTÃO */

    if(
        metodo==="cartao" ||
        metodo==="cartao_credito" ||
        metodo==="credito"
    ){

        const numero=
            document
            .getElementById("cartao-numero")
            ?.value
            ?.replace(/\D/g,"")||"";


        const nome=
            document
            .getElementById("cartao-nome")
            ?.value
            ?.trim()||"";


        const validade=
            document
            .getElementById("cartao-validade")
            ?.value
            ?.trim()||"";


        const cvv=
            document
            .getElementById("cartao-cvv")
            ?.value
            ?.replace(/\D/g,"")||"";


        const parcelas=
            document
            .getElementById("cartao-parcelas")
            ?.value||"1";


        if(
            numero.length!==16 ||
            !nome ||
            !/^\d{2}\/\d{2}$/.test(validade) ||
            cvv.length<3
        ){

            return{

                ok:false,

                mensagem:
                    "⚠️ Preencha corretamente os dados do cartão."
            };
        }


        return{

            ok:true,

            dados:{

                tipo:"cartao_credito",

                numero:numero,

                nome:nome,

                validade:validade,

                cvv:cvv,

                parcelas:Number(parcelas)
            }
        };
    }


    return{

        ok:true,

        dados:{
            tipo:metodo
        }
    };
}


/* =========================================================
   INICIALIZAR PAGAMENTO
   ========================================================= */

function inicializarPagamento(){

    const select =
        document.getElementById("forma-pagamento");

    if(!select)return;


    if(!select.dataset.pagamentoConfigurado){

        select.addEventListener(
            "change",
            atualizarCamposPagamento
        );

        select.dataset.pagamentoConfigurado="true";
    }


    atualizarCamposPagamento();
}


/* =========================================================
   FINALIZAR PEDIDO
   ========================================================= */

   async function finalizarPedido(){
    const cliente=document.getElementById("nome-cliente");
    const telefone=document.getElementById("telefone");
    const endereco=document.getElementById("endereco");
    const pagamento=document.getElementById("forma-pagamento");
    const msg=document.getElementById("mensagem-pedido");

    if(localStorage.getItem("usuarioLogado")!=="true"){
        alert("Você precisa estar logado para finalizar o pedido!");
        return;
    }

    if(!carrinho.length){
        msg.innerText="⚠️ O carrinho está vazio!";
        return;
    }

    if(!cliente||!telefone||!endereco||!pagamento){
        msg.innerText="⚠️ Erro: campos do checkout não encontrados.";
        return;
    }

    if(!cliente.value.trim()||!telefone.value.trim()||!endereco.value.trim()||!pagamento.value){
        msg.innerText="⚠️ Preencha todos os dados do pedido!";
        return;
    }

    const dados={
        cliente:cliente.value.trim(),
        telefone:telefone.value.trim(),
        endereco:endereco.value.trim(),
        pagamento:pagamento.value,
        usuario:JSON.parse(localStorage.getItem("usuario")),
        itens:carrinho
    };

    if(pagamento.value==="pix"){
        dados.detalhesPagamento={
            tipo:"pix",
            chave:document.getElementById("pix-chave")?.value.trim()||""
        };
    }

    if(pagamento.value==="cartao"){
        dados.detalhesPagamento={
            tipo:"cartao",
            numero:document.getElementById("cartao-numero")?.value.replace(/\D/g,"")||"",
            nome:document.getElementById("cartao-nome")?.value.trim()||"",
            validade:document.getElementById("cartao-validade")?.value.trim()||"",
            parcelas:document.getElementById("cartao-parcelas")?.value||"1"
        };
    }

    if(pagamento.value==="boleto"){
        dados.detalhesPagamento={
            tipo:"boleto",
            cpf:document.getElementById("boleto-cpf")?.value.replace(/\D/g,"")||""
        };
    }

    msg.innerText="⏳ Processando pedido...";

    try{
        const res=await fetch("http://localhost:3000/pedido",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(dados)
        });

        let data={};

        try{
            data=await res.json();
        }catch(e){
            data={};
        }

        if(!res.ok){
            throw new Error(data.mensagem||data.message||`Erro HTTP ${res.status}`);
        }

        msg.innerText=data.mensagem||data.message||"✅ Pedido realizado com sucesso!";


const planoSelecionado = JSON.parse(
    localStorage.getItem("planoSelecionado")
);

if(planoSelecionado){

    const usuario = JSON.parse(
        localStorage.getItem("usuario")
    );

    if(usuario?.email){

        const plano = planoSelecionado.chave ||
            normalizarPlano(planoSelecionado.nome);

        const resPlano = await fetch(
            "http://localhost:3000/ativar-plano",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: usuario.email,
                    plano: plano
                })
            }
        );

        let respostaPlano = {};

        try {
            respostaPlano = await resPlano.json();
        } catch(e) {}

        if(!resPlano.ok){

            throw new Error(
                respostaPlano.mensagem ||
                respostaPlano.message ||
                "Não foi possível ativar o plano."
            );
        }

        localStorage.setItem(
            "planoAtivo",
            plano
        );

        localStorage.removeItem(
            "planoSelecionado"
        );

        const nomePlano = nomePlanoBonito(plano);

        msg.innerHTML = `
            <span style="color:#22c55e;font-weight:bold;">
                ✅ Pagamento confirmado! Plano ${nomePlano} ativo!
            </span>
        `;

        await carregarPlano();

        setTimeout(() => {
            trocarAba("plano");
        }, 1200);
    }
}

        carrinho=[];

        salvarCarrinho();
        atualizarCarrinhoUI();
        atualizarResumoPagamento();
        atualizarBadges();

    }catch(error){
        console.error("Erro ao finalizar pedido:",error);
        msg.innerText="❌ Erro ao finalizar pedido: "+error.message;
    }
}

function abrirMeuPlano(){

    const logado =
        localStorage.getItem("usuarioLogado") === "true";

    if(!logado){

        alert("Você precisa estar logado para acessar seu plano.");

        trocarAba("login");

        return;
    }

    trocarAba("plano");

    carregarPlano();
}

async function carregarPedidos(){
    const container=document.getElementById("lista-pedidos");
    if(!container)return;

    const usuario=JSON.parse(localStorage.getItem("usuario"));

    if(!usuario){
        container.innerHTML=`<div class="card"><h3>🔒 Faça login</h3><p>Entre na sua conta para visualizar seus pedidos.</p></div>`;
        return;
    }

    container.innerHTML="<p>⏳ Carregando seus pedidos...</p>";

    try{
        const res=await fetch(`http://localhost:3000/pedidos?email=${encodeURIComponent(usuario.email)}`);

        if(!res.ok)throw new Error(`HTTP ${res.status}`);

        const pedidos=await res.json();

        if(!Array.isArray(pedidos)||pedidos.length===0){
            container.innerHTML=`
                <div class="card" style="grid-column:1/-1;text-align:center;padding:40px;">
                    <h3>📦 Nenhum pedido encontrado</h3>
                    <p style="color:#94a3b8;">Você ainda não realizou nenhuma compra.</p>
                </div>
            `;
            return;
        }

        container.innerHTML="";

        pedidos.forEach((pedido,index)=>{
            const itens=pedido.itens||[];
            let listaItens="";

            itens.forEach(item=>{
                listaItens+=`
                    <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #1f293d;">
                        <span>${sanitizarTexto(item.nome||"Produto")}</span>
                        <strong>${moeda(item.preco||0)}</strong>
                    </div>
                `;
            });

            const total=pedido.total||itens.reduce((s,item)=>s+(Number(item.preco)||0),0);
            const pagamento=pedido.pagamento||"Não informado";

            container.innerHTML+=`
                <div class="card" style="padding:20px;margin-bottom:20px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <h3>📦 Pedido #${pedido.id||index+1}</h3>
                        <span style="color:#00d4ff;font-weight:bold;">
                            ${pedido.status||"Pedido realizado"}
                        </span>
                    </div>

                    <p><strong>💳 Pagamento:</strong> ${sanitizarTexto(String(pagamento))}</p>

                    <h4>🛒 Produtos comprados</h4>
                    ${listaItens}

                    <h3 style="text-align:right;color:#00d4ff;">
                        Total: ${moeda(total)}
                    </h3>
                </div>
            `;
        });

    }catch(error){
        console.error("Erro ao carregar pedidos:",error);

        container.innerHTML=`
            <div class="card">
                <h3>❌ Não foi possível carregar seus pedidos</h3>
                <p style="color:#94a3b8;">Verifique se o servidor está funcionando.</p>
            </div>
        `;
    }
}

/* =========================================================
   SISTEMA DE PAGAMENTO
   ========================================================= */

function obterTotalCarrinho(){
    return carrinho.reduce((total,item)=>{
        return total + (Number(item.preco) || 0);
    },0);
}

function atualizarCamposPagamento(){
    const select=document.getElementById("forma-pagamento");
    const area=document.getElementById("detalhes-pagamento");

    if(!select || !area)return;

    const pagamento=select.value;
    area.innerHTML="";

    /* PIX */
    if(pagamento==="pix"){
        area.innerHTML=`
            <div style="padding:15px;margin-bottom:15px;border:1px solid #1f293d;border-radius:8px;background:#0d1117;">
                <h4 style="color:#00d4ff;margin-top:0;">💠 Pagamento via PIX</h4>
                <p style="color:#cbd5e1;">Escolha como deseja pagar:</p>

                <label style="color:#fff;">Chave PIX</label>

                <input
                    id="pix-chave"
                    type="text"
                    placeholder="Digite sua chave PIX"
                    style="width:90%;padding:10px;margin-top:6px;background:#0d1117;border:1px solid #1f293d;color:white;border-radius:6px;"
                >

                <div id="pix-resultado" style="margin-top:15px;text-align:center;"></div>
            </div>
        `;
        return;
    }

    /* CARTÃO */
    if(pagamento==="cartao"){
        const total=obterTotalCarrinho();
        let parcelas="";

        for(let i=1;i<=12;i++){
            parcelas+=`
                <option value="${i}">
                    ${i}x de ${moeda(total/i)}
                </option>
            `;
        }

        area.innerHTML=`
            <div style="padding:15px;margin-bottom:15px;border:1px solid #1f293d;border-radius:8px;background:#0d1117;">
                <h4 style="color:#00d4ff;margin-top:0;">💳 Cartão de crédito</h4>

                <label style="color:#fff;">Número do cartão</label>
                <input
                    id="cartao-numero"
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    maxlength="19"
                    style="width:90%;padding:10px;margin-top:6px;margin-bottom:12px;background:#0d1117;border:1px solid #1f293d;color:white;border-radius:6px;"
                >

                <label style="color:#fff;">Nome no cartão</label>
                <input
                    id="cartao-nome"
                    type="text"
                    placeholder="NOME COMPLETO"
                    style="width:90%;padding:10px;margin-top:6px;margin-bottom:12px;background:#0d1117;border:1px solid #1f293d;color:white;border-radius:6px;"
                >

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                    <div>
                        <label style="color:#fff;">Validade</label>
                        <input
                            id="cartao-validade"
                            type="text"
                            placeholder="MM/AA"
                            maxlength="5"
                            style="width:90%;padding:10px;margin-top:6px;background:#0d1117;border:1px solid #1f293d;color:white;border-radius:6px;"
                        >
                    </div>

                    <div>
                        <label style="color:#fff;">CVV</label>
                        <input
                            id="cartao-cvv"
                            type="password"
                            placeholder="123"
                            maxlength="4"
                            style="width:90%;padding:10px;margin-top:6px;background:#0d1117;border:1px solid #1f293d;color:white;border-radius:6px;"
                        >
                    </div>
                </div>

                <label for="cartao-parcelas" style="display:block;color:#fff;margin-top:15px;">
                    Parcelas
                </label>

                <select
                    id="cartao-parcelas"
                    style="width:96%;padding:10px;margin-top:6px;background:#0d1117;border:1px solid #1f293d;color:white;border-radius:6px;"
                >
                    ${parcelas}
                </select>
            </div>
        `;

        configurarCartao();
        return;
    }

    /* BOLETO */
    if(pagamento==="boleto"){
        area.innerHTML=`
            <div style="padding:15px;margin-bottom:15px;border:1px solid #1f293d;border-radius:8px;background:#0d1117;">
                <h4 style="color:#00d4ff;margin-top:0;">🧾 Pagamento via Boleto</h4>

                <p style="color:#cbd5e1;">
                    Informe o CPF do pagador.
                </p>

                <label style="color:#fff;">CPF</label>

                <input
                    id="boleto-cpf"
                    type="text"
                    placeholder="000.000.000-00"
                    maxlength="14"
                    style="width:90%;padding:10px;margin-top:6px;background:#0d1117;border:1px solid #1f293d;color:white;border-radius:6px;"
                >

                <div id="boleto-resultado"></div>
            </div>
        `;

        configurarCartao();
    }
}


/* =========================================================
   MÁSCARAS
   ========================================================= */

function configurarCartao(){
    const numero=document.getElementById("cartao-numero");
    const validade=document.getElementById("cartao-validade");
    const cvv=document.getElementById("cartao-cvv");
    const cpf=document.getElementById("boleto-cpf");

    if(numero){
        numero.addEventListener("input",()=>{
            let valor=numero.value.replace(/\D/g,"").slice(0,16);
            numero.value=valor.replace(/(\d{4})(?=\d)/g,"$1 ");
        });
    }

    if(validade){
        validade.addEventListener("input",()=>{
            let valor=validade.value.replace(/\D/g,"").slice(0,4);

            if(valor.length>2){
                valor=valor.slice(0,2)+"/"+valor.slice(2);
            }

            validade.value=valor;
        });
    }

    if(cvv){
        cvv.addEventListener("input",()=>{
            cvv.value=cvv.value.replace(/\D/g,"").slice(0,4);
        });
    }

    if(cpf){
        cpf.addEventListener("input",()=>{
            let valor=cpf.value.replace(/\D/g,"").slice(0,11);

            valor=valor.replace(/(\d{3})(\d)/,"$1.$2");
            valor=valor.replace(/(\d{3})(\d)/,"$1.$2");
            valor=valor.replace(/(\d{3})(\d{1,2})$/,"$1-$2");

            cpf.value=valor;
        });
    }
}


/* =========================================================
   INICIALIZAR PAGAMENTO
   ========================================================= */

function inicializarPagamento(){
    const select=document.getElementById("forma-pagamento");

    if(!select)return;

    select.addEventListener(
        "change",
        atualizarCamposPagamento
    );
}


let todosProdutos=[];

async function carregarProdutos(){
    const container=document.getElementById("lista-produtos");
    if(!container)return;

    container.innerHTML="<p>Carregando produtos...</p>";

    try{
        const res=await fetch("http://localhost:3000/produtos");
        todosProdutos=await res.json();
        window.todosProdutos=todosProdutos;
        filtrarCategoria("todos");

    }catch(e){
        console.error(e);
        container.innerHTML="<p>Erro ao carregar produtos.</p>";
    }
}

function pesquisarProdutos() {
    const input = document.getElementById("barra-pesquisa");
    const container = document.getElementById("lista-produtos");
    const titulo = document.getElementById("titulo-categoria-atual");

    if (!input || !container) return;

    const termo = input.value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

    if (!termo) {
        filtrarCategoria("todos");
        return;
    }

    // Palavras que representam cada categoria
    const categoriasPesquisa = {
        "placa de video": ["rtx", "rx", "radeon", "geforce"],
        "placa video": ["rtx", "rx", "radeon", "geforce"],
        "gpu": ["rtx", "rx", "radeon", "geforce"],

        "placa mae": ["placa mae", "b650", "b550", "a520", "x670", "x570", "z790"],
        "placa-mae": ["placa mae", "b650", "b550", "a520", "x670", "x570", "z790"],

        "processador": ["ryzen", "intel", "i3", "i5", "i7", "i9"],
        "cpu": ["ryzen", "intel", "i3", "i5", "i7", "i9"],

        "memoria": ["ddr4", "ddr5", "ram"],
        "memoria ram": ["ddr4", "ddr5", "ram"],
        "ram": ["ddr4", "ddr5", "ram"],

        "fonte": ["fonte", "750w", "850w"],
        "ssd": ["ssd", "nvme"],
        "armazenamento": ["ssd", "nvme"],

        "teclado": ["teclado", "wooting", "huntsman"],
        "mouse": ["mouse", "superlight", "razer"],
        "monitor": ["monitor", "zowie", "xl"],
        "headset": ["headset", "audeze", "fone"]
    };

    let resultados;

    // Se for uma pesquisa de categoria
    if (categoriasPesquisa[termo]) {

        const palavras = categoriasPesquisa[termo];

        resultados = todosProdutos.filter(produto => {
            const nome = String(produto.nome || "")
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");

            return palavras.some(palavra => nome.includes(palavra));
        });

    } else {

        // Pesquisa normal pelo nome
        resultados = todosProdutos.filter(produto => {
            const nome = String(produto.nome || "")
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");

            return nome.includes(termo);
        });
    }

    renderizarProdutos(resultados, container);

    if (titulo) {
        titulo.innerText = resultados.length
            ? `🔎 Resultados para "${input.value}"`
            : `❌ Nenhum produto encontrado`;
    }
}

// =====================================================
// SUGESTÕES DA PESQUISA
// =====================================================

let sugestaoSelecionada = -1;

const categoriasSugestao = {
    "placa": [
        "Placa de Vídeo",
        "Placa Mãe"
    ],

    "placa de video": [
        "Placa de Vídeo",
        "RTX",
        "RX Radeon"
    ],

    "placa video": [
        "Placa de Vídeo",
        "RTX",
        "RX Radeon"
    ],

    "placa mae": [
        "Placa Mãe",
        "B650",
        "B550"
    ],

    "processador": [
        "Processador",
        "Ryzen",
        "Intel Core"
    ],

    "cpu": [
        "Processador",
        "Ryzen",
        "Intel Core"
    ],

    "memoria": [
        "Memória RAM",
        "DDR4",
        "DDR5"
    ],

    "ram": [
        "Memória RAM",
        "DDR4",
        "DDR5"
    ],

    "mouse": [
        "Mouse",
        "Superlight",
        "Razer"
    ],

    "teclado": [
        "Teclado",
        "Wooting",
        "Huntsman"
    ],

    "monitor": [
        "Monitor",
        "Zowie",
        "360Hz"
    ],

    "headset": [
        "Headset",
        "Audeze",
        "Fone"
    ],

    "ssd": [
        "SSD",
        "NVMe"
    ],

    "fonte": [
        "Fonte",
        "750W",
        "850W"
    ]
};


function normalizarPesquisa(texto) {
    return String(texto || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}


function gerarSugestoesPesquisa() {

    const input = document.getElementById("barra-pesquisa");
    const container = document.getElementById("sugestoes-pesquisa");

    if (!input || !container) return;

    const textoOriginal = input.value.trim();
    const texto = normalizarPesquisa(textoOriginal);

    container.innerHTML = "";
    sugestaoSelecionada = -1;

    if (!texto) {
        container.style.display = "none";
        return;
    }

    let sugestoes = [];

    // ==========================================
    // 1. SUGESTÕES DE CATEGORIAS
    // ==========================================

    Object.keys(categoriasSugestao).forEach(chave => {

        if (chave.includes(texto) || texto.includes(chave)) {

            categoriasSugestao[chave].forEach(sugestao => {

                if (!sugestoes.some(s => s.texto === sugestao)) {

                    sugestoes.push({
                        texto: sugestao,
                        tipo: "Categoria"
                    });

                }

            });

        }

    });


    // ==========================================
    // 2. SUGESTÕES DOS PRODUTOS REAIS
    // ==========================================

    if (Array.isArray(todosProdutos)) {

        todosProdutos.forEach(produto => {

            const nome = String(produto.nome || "");
            const nomeNormalizado = normalizarPesquisa(nome);

            if (nomeNormalizado.includes(texto)) {

                if (!sugestoes.some(s => s.texto === nome)) {

                    sugestoes.push({
                        texto: nome,
                        tipo: "Produto"
                    });

                }

            }

        });

    }


    // Limita para não ficar uma lista gigante
    sugestoes = sugestoes.slice(0, 8);


    if (!sugestoes.length) {
        container.style.display = "none";
        return;
    }


    // ==========================================
    // 3. CRIA AS SUGESTÕES
    // ==========================================

    sugestoes.forEach((sugestao, index) => {

        const item = document.createElement("div");

        item.className = "sugestao-pesquisa";

        item.innerHTML = `
            <span class="sugestao-icone">
                <i class="fa-solid fa-magnifying-glass"></i>
            </span>

            <span class="sugestao-texto">
                ${sanitizarTexto(sugestao.texto)}
            </span>

            <span class="sugestao-categoria">
                ${sugestao.tipo}
            </span>
        `;


        item.addEventListener("mousedown", function(event) {

            event.preventDefault();

            input.value = sugestao.texto;

            pesquisarProdutos();

            container.style.display = "none";

        });


        container.appendChild(item);

    });


    container.style.display = "block";
}

document.addEventListener("DOMContentLoaded", () => {

    const barraPesquisa = document.getElementById("barra-pesquisa");

    if (!barraPesquisa) return;

    barraPesquisa.addEventListener("input", () => {

        gerarSugestoesPesquisa();

        pesquisarProdutos();

    });


    // ==========================================
    // TECLADO
    // ==========================================

    barraPesquisa.addEventListener("keydown", (event) => {

        const container = document.getElementById("sugestoes-pesquisa");

        if (!container) return;

        const sugestoes = container.querySelectorAll(".sugestao-pesquisa");

        if (!sugestoes.length) {

            if (event.key === "Enter") {
                pesquisarProdutos();
            }

            return;
        }


        // ↓
        if (event.key === "ArrowDown") {

            event.preventDefault();

            sugestaoSelecionada++;

            if (sugestaoSelecionada >= sugestoes.length) {
                sugestaoSelecionada = 0;
            }

            atualizarSugestaoAtiva(sugestoes);

        }


        // ↑
        else if (event.key === "ArrowUp") {

            event.preventDefault();

            sugestaoSelecionada--;

            if (sugestaoSelecionada < 0) {
                sugestaoSelecionada = sugestoes.length - 1;
            }

            atualizarSugestaoAtiva(sugestoes);

        }


        // ENTER
        else if (event.key === "Enter") {

            event.preventDefault();

            if (sugestaoSelecionada >= 0) {

                sugestoes[sugestaoSelecionada].dispatchEvent(
                    new MouseEvent("mousedown")
                );

            } else {

                pesquisarProdutos();

                container.style.display = "none";

            }

        }


        // ESC
        else if (event.key === "Escape") {

            container.style.display = "none";

            sugestaoSelecionada = -1;

        }

    });


    // Fecha quando clicar fora
    document.addEventListener("click", (event) => {

        if (!event.target.closest(".search-container")) {

            const container =
                document.getElementById("sugestoes-pesquisa");

            if (container) {
                container.style.display = "none";
            }

        }

    });

});


function atualizarSugestaoAtiva(sugestoes) {

    sugestoes.forEach((item, index) => {

        item.classList.toggle(
            "ativa",
            index === sugestaoSelecionada
        );

    });

}

document.addEventListener("DOMContentLoaded", () => {

    const barraPesquisa = document.getElementById("barra-pesquisa");

    if (barraPesquisa) {
        barraPesquisa.addEventListener("input", pesquisarProdutos);
    }

});


function obterCaminhoImagem(nomeProduto) {
    if (!nomeProduto) {
        return "imagens/logo-bepro.png.jpeg";
    }

    const nome = nomeProduto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");


    // =====================================================
    // IMAGENS DO CATÁLOGO
    // =====================================================
    
    const imagensCatalogo = {
        "AMD Ryzen 5 7600X": "imagens/AMD Ryzen 5 7600X.png",
        "AMD Ryzen 9 7950X3D": "imagens/AMD Ryzen 9 7950X3D.png",
        "AMD Ryzen 7 7800X3D": "imagens/AMD Ryzen 7 7800X3D.png",
        "AMD Ryzen 7 9700X": "imagens/AMD Ryzen 7 9700X.png",
        "Intel Core i7-14700K": "imagens/Intel Core i7-14700K.png",
        "Intel Core i9-14900K": "imagens/Intel Core i9-14900K.png",
        "NVIDIA GeForce RTX 4070 Super": "imagens/NVIDIA GeForce RTX 4070 Super.png",
        "NVIDIA GeForce RTX 4070 Ti Super": "imagens/NVIDIA GeForce RTX 4070 Ti Super.png",
        "NVIDIA GeForce RTX 4080 Super": "imagens/NVIDIA GeForce RTX 4080 Super.png",
        "NVIDIA GeForce RTX 5080": "imagens/NVIDIA GeForce RTX 5080.png",
        "NVIDIA GeForce RTX 5070": "imagens/NVIDIA GeForce RTX 5070.png",
        "AMD Radeon RX 6750 XT 12GB": "imagens/AMD Radeon RX 6750 XT 12GB.png",
        "AMD Radeon RX 7800 XT 16GB": "imagens/AMD Radeon RX 7800 XT 16GB.png",
        "Water Cooler AIO 240 mm": "imagens/Water Cooler AIO 240 mm.png",
        "Water Cooler Lian Li Galahad II Trinity 360mm": "imagens/Water Cooler Lian Li Galahad II Trinity 360mm.png",
        "ASRock B650M Pro RS": "imagens/ASRock B650M Pro RS.png",
        "ASUS ROG Strix B650-A Gaming WiFi": "imagens/ASUS ROG Strix B650-A Gaming WiFi.png",
        "MSI MAG B650 Tomahawk WiFi": "imagens/MSI MAG B650 Tomahawk WiFi.png",
        "Gigabyte Z790 AORUS Elite AX": "imagens/Gigabyte Z790 AORUS Elite AX.png",
        "64 GB (2x32GB) DDR5 6000 MHz CL30": "imagens/64 GB (2x32GB) DDR5 6000 MHz CL30.png",
        "SSD 2 TB Samsung 990 Pro NVMe PCIe 4.0": "imagens/SSD 2 TB Samsung 990 Pro NVMe PCIe 4.0.png",
        "Fonte Corsair RM1000e 1000W 80+ Gold ATX 3.0": "imagens/Fonte Corsair RM1000e 1000W 80+ Gold ATX 3.0.png",
        "Gabinete NZXT H9 Flow": "imagens/Gabinete NZXT H9 Flow.png",
        "Gabinete Lian Li O11 Dynamic EVO": "imagens/Gabinete Lian Li O11 Dynamic EVO.png",
        "Wooting 80HE": "imagens/Wooting 80HE.png",
        "Wooting 60HE+": "imagens/Wooting 60HE+.png",
        "Razer Huntsman V3 Pro TKL": "imagens/Razer Huntsman V3 Pro TKL.png",
        "Logitech G Pro X TKL Rapid": "imagens/Logitech G Pro X TKL Rapid.png",
        "Razer Huntsman V3 Pro Mini": "imagens/Razer Huntsman V3 Pro Mini.png",
        "Corsair K70 MAX RGB Magnetic": "imagens/Corsair K70 MAX RGB Magnetic.png",
        "Razer Viper V3 Pro": "imagens/Razer Viper V3 Pro.png",
        "Logitech G Pro X Superlight 2 Dex": "imagens/Logitech G Pro X Superlight 2 Dex.png",
        "Razer DeathAdder V3 Pro": "imagens/Razer DeathAdder V3 Pro.png",
        "Logitech G Pro X Superlight 2": "imagens/Logitech G Pro X Superlight 2.png",
        "Artisan FX Zero Soft XL": "imagens/Artisan FX Zero Soft XL.png",
        "Lethal Gaming Gear Saturn Pro XL": "imagens/Lethal Gaming Gear Saturn Pro XL.png",
        "Logitech G640 Large": "imagens/Logitech G640 Large.png",
        "Artisan Ninja FX Zero Mid": "imagens/Artisan Ninja FX Zero Mid.png",
        "SkyPAD Glass 3.0 XL": "imagens/SkyPAD Glass 3.0 XL.png",
        "Base Labs Gaming Sleeve": "imagens/Base Labs Gaming Sleeve.png",
        "Audeze Maxwell Wireless Gaming": "imagens/Audeze Maxwell Wireless Gaming.png",
        "HyperX Cloud III Wireless": "imagens/HyperX Cloud III Wireless.png",
        "SteelSeries Arctis Nova Pro Wireless": "imagens/SteelSeries Arctis Nova Pro Wireless.png",
        "Logitech G Pro X 2 LIGHTSPEED": "imagens/Logitech G Pro X 2 LIGHTSPEED.png",
        "Beyerdynamic DT 990 Pro + Amp": "imagens/Beyerdynamic DT 990 Pro + Amp.png",
        "ASUS ROG Swift 360Hz OLED": "imagens/ASUS ROG Swift 360Hz OLED.png",
        "BenQ ZOWIE XL2586X+": "imagens/BenQ ZOWIE XL2586X+.png",
        "BenQ ZOWIE XL2566K": "imagens/BenQ ZOWIE XL2566K.png",
        "LG UltraGear 27\" OLED 240Hz": "imagens/LG UltraGear 27_ OLED 240Hz.png",
        "LG UltraGear 360Hz IPS": "imagens/LG UltraGear 360Hz IPS.png",
        "ASUS ROG Swift PG27AQDM": "imagens/ASUS ROG Swift PG27AQDM.png",
        "Alienware AW2725DF (360Hz QD-OLED)": "imagens/Alienware AW2725DF (360Hz QD-OLED).png",
    };

    if (Object.prototype.hasOwnProperty.call(imagensCatalogo, nomeProduto)) {
        return imagensCatalogo[nomeProduto];
    }

    // Também aceita pequenas diferenças de espaços/maiúsculas.
    const nomeCatalogoNormalizado = nomeProduto
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();

    for (const [produtoCatalogo, caminhoImagem] of Object.entries(imagensCatalogo)) {
        const chaveNormalizada = produtoCatalogo
            .toLowerCase()
            .replace(/\s+/g, " ")
            .trim();

        if (chaveNormalizada === nomeCatalogoNormalizado) {
            return caminhoImagem;
        }
    }

    // =====================================================
    // PROCESSADORES AMD
    // =====================================================

    if (nome.includes("7800x3d")) {
        return "imagens/amdryzen7-5700x.png";
    }

    if (nome.includes("7950x3d")) {
        return "imagens/amdryzen7-5700x.png";
    }

    if (nome.includes("9700x")) {
        return "imagens/amdryzen7-5700x.png";
    }

    if (nome.includes("7600x")) {
        return "imagens/andryzen5-5560-removebg-preview.png";
    }

    if (nome.includes("5700x")) {
        return "imagens/amdryzen7-5700x.png";
    }

    // =====================================================
    // PROCESSADORES INTEL
    // =====================================================

    if (nome.includes("i9-14900k")) {
        return "imagens/Intel Core i9-14900K.png";
    }

    if (nome.includes("i7-14700k")) {
        return "imagens/Intel Core i7-14700K.png";
    }

    if (nome.includes("i7")) {
        return "imagens/intelcore-i7-removebg-preview.png";
    }

    if (nome.includes("i5")) {
        return "imagens/intelcore-i5-removebg-preview.png";
    }


    // =====================================================
    // PLACAS DE VÍDEO NVIDIA
    // =====================================================

    if (nome.includes("4080") || nome.includes("4080 super")) {
        return "imagens/NVIDIA GeForce RTX 4080 Super.png";
    }

    if (nome.includes("4070 ti super")) {
        return "imagens/NVIDIA GeForce RTX 4070 Ti Super.png";
    }

    if (nome.includes("4070 super")) {
        return "imagens/NVIDIA GeForce RTX 4070 Super.png";
    }

    if (nome.includes("4070")) {
        return "imagens/rtx4070-removebg-preview.png";
    }

    if (nome.includes("4060 ti")) {
        return "imagens/rtx4060-removebg-preview.png";
    }

    if (nome.includes("4060")) {
        return "imagens/rtx4060-removebg-preview.png";
    }

    if (nome.includes("3060 ti")) {
        return "imagens/rtx3060-removebg-preview.png";
    }

    if (nome.includes("3060")) {
        return "imagens/rtx3060-removebg-preview.png";
    }

    if (nome.includes("5070")) {
        return "imagens/NVIDIA GeForce RTX 5070.png";
    }

    if (nome.includes("5080")) {
        return "imagens/NVIDIA GeForce RTX 5080.png";
    }



    // =====================================================
    // PLACAS DE VÍDEO AMD
    // =====================================================

    if (nome.includes("rx 7600") || nome.includes("rx7600")) {
        return "imagens/rx7600.png";
    }

    if (nome.includes("rx 7800 xt")) {
        return "imagens/AMD Radeon RX 7800 XT 16GB.png";
    }

if (nome.includes("rx 6750 xt")) {
        return "imagens/AMD Radeon RX 6750 XT 12GB (2).png";
    }

    // =====================================================
    // PLACAS-MÃE
    // =====================================================

    if (nome.includes("b650")) {
        return "imagens/MSI MAG B650 Tomahawk WiFi (1).png";
    }

    if (nome.includes("b550")) {
        return "imagens/placamaeb550-removebg-preview.png";
    }

    if (nome.includes("b660")) {
        return "imagens/placamaeb660-removebg-preview.png";
    }

    if (nome.includes("x570")) {
        return "imagens/placamaex570-removebg-preview.png";
    }

    if (nome.includes("z690")) {
        return "imagens/placamaez690-removebg-preview.png";
    }

    if (nome.includes("z790")) {
        return "imagens/Gigabyte Z790 AORUS Elite AX.png";
    }


    // =====================================================
    // MEMÓRIA RAM
    // =====================================================

    if (nome.includes("64 gb") && nome.includes("ddr5")) {
        return "imagens/ram32gb-ddr5-removebg-preview.png";
    }

    if (nome.includes("32 gb") && nome.includes("ddr5")) {
        return "imagens/ram32gb-ddr5-removebg-preview.png";
    }

    if (nome.includes("16 gb") && nome.includes("ddr5")) {
        return "imagens/ram16gb-ddr5-removebg-preview.png";
    }

    if (nome.includes("32 gb") && nome.includes("ddr4")) {
        return "imagens/ram32gb-ddr4-removebg-preview.png";
    }

    if (nome.includes("16 gb") && nome.includes("ddr4")) {
        return "imagens/ram16gb-ddr4-removebg-preview.png";
    }


    // =====================================================
    // SSD / ARMAZENAMENTO
    // =====================================================

    if (nome.includes("990 pro") || nome.includes("2 tb samsung")) {
        return "imagens/SSD 2 TB Samsung 990 Pro NVMe PCIe 4.0.png";
    }

    if (nome.includes("ssd 2 tb")) {
        return "imagens/SSD 2 TB Samsung 990 Pro NVMe PCIe 4.0.png";
    }

    if (nome.includes("ssd 1 tb") ||
        nome.includes("ssd 1tb") ||
        nome.includes("nvme")) {
        return "imagens/ssd-1tb-removebg-preview.png";
    }


    // =====================================================
    // FONTES
    // =====================================================

    if (nome.includes("850w")) {
        return "imagens/fonte850w-removebg-preview.png";
    }

    if (nome.includes("750w")) {
        return "imagens/fonte750w.png";
    }

    if (nome.includes("650w")) {
        return "imagens/fonte650w.png";
    }

    if (nome.includes("550w")) {
        return "imagens/fonte550w.png";
    }


    // =====================================================
    // COOLERS
    // =====================================================

    if (nome.includes("galahad") ||
        nome.includes("lian li") && nome.includes("360")) {
        return "imagens/Water Cooler Lian Li Galahad II Trinity 360mm.png";
    }

    if (nome.includes("water cooler") ||
        nome.includes("aio") ||
        nome.includes("corsair icue") ||
        nome.includes("h150i")) {
        return "imagens/Water Cooler AIO 240 mm.png";
    }

    if (nome.includes("air cooler") ||
        nome.includes("deepcool") ||
        nome.includes("ak620") ||
        nome.includes("cooler")) {
        return "imagens/aircooler-removebg-preview.png";
    }


    // =====================================================
    // GABINETES
    // =====================================================

    if (nome.includes("nzxt") ||
        nome.includes("h9 flow")) {
        return "imagens/Gabinete NZXT H9 Flow.png";
    }

    if (nome.includes("lian li") ||
        nome.includes("o11 dynamic")) {
        return "imagens/Gabinete Lian Li O11 Dynamic EVO.png";
    }

    if (nome.includes("gabinete")) {
        return "imagens/gabinete-removebg-preview.png";
    }


    // =====================================================
    // TECLADOS
    // =====================================================

    if (nome.includes("wooting 60he") ||
        nome.includes("wooting 60he+")) {
        return "imagens/Wooting 60HE+.png";
    }

    if (nome.includes("wooting 80he")) {
        return "imagens/wooting-80he-removebg-preview.png";
    }

    if (nome.includes("huntsman")) {
        return "imagens/Razer Huntsman V3 Pro TKL.png";
    }

    if (nome.includes("g pro x tkl") ||
        nome.includes("logitech g pro x tkl")) {
        return "imagens/Logitech G Pro X TKL Rapid.png";
    }

    if (nome.includes("teclado")) {
        return "imagens/Wooting 60HE+.png";
    }


    // =====================================================
    // MOUSES
    // =====================================================

    if (nome.includes("superlight 2 dex")) {
        return "imagens/Logitech G Pro X Superlight 2 Dex.png";
    }

    if (nome.includes("superlight 2")) {
        return "imagens/Logitech G Pro X Superlight 2.png";
    }

    if (nome.includes("deathadder")) {
        return "imagens/Razer DeathAdder V3 Pro.png";
    }

    if (nome.includes("razer") && nome.includes("mouse")) {
        return "imagens/Razer DeathAdder V3 Pro.png";
    }

    if (nome.includes("mouse")) {
        return "imagens/logitech-superlight2-removebg-preview.png";
    }


    // =====================================================
    // MOUSEPADS
    // =====================================================

    if (nome.includes("saturn")) {
        return "imagens/Lethal Gaming Gear Saturn Pro XL.png";
    }

    if (nome.includes("hayate")) {
        return "imagens/hayate-otsu-removebg-preview.png";
    }

    if (nome.includes("skypad")) {
        return "imagens/SkyPAD Glass 3.0 XL.png";
    }

    if (nome.includes("g640")) {
        return "imagens/Logitech G640 Large.png";
    }

    if (nome.includes("mousepad")) {
        return "imagens/hayate-otsu-removebg-preview.png";
    }


    // =====================================================
    // HEADSETS
    // =====================================================

    if (nome.includes("audeze") ||
        nome.includes("maxwell")) {
        return "imagens/audeze-maxwell-removebg-preview.png";
    }

    if (nome.includes("steelseries") ||
        nome.includes("arctis nova")) {
        return "imagens/SteelSeries Arctis Nova Pro Wireless.png";
    }

    if (nome.includes("hyperx") ||
        nome.includes("cloud iii")) {
        return "imagens/HyperX Cloud III Wireless.png";
    }


    // =====================================================
    // MONITORES
    // =====================================================

    if (nome.includes("lg ultragear 27") ||
        nome.includes("oled 240hz")) {
        return "imagens/LG UltraGear 27_ OLED 240Hz.png";
    }

    if (nome.includes("lg ultragear 360hz")) {
        return "imagens/LG UltraGear 360Hz IPS.png";
    }

    if (nome.includes("benq") ||
        nome.includes("zowie")) {
        return "imagens/BenqZowie.png";
    }


    // =====================================================
    // FALLBACK
    // =====================================================

    console.warn("Pulse", nomeProduto);

    return "imagens/PULSE.png";
}


   

function filtrarCategoria(categoria,elemento){

    const container=document.getElementById("lista-produtos");
    const titulo=document.getElementById("titulo-categoria-atual");

    if(!container)return;


    if(elemento){
        document.querySelectorAll(".categoria-item")
        .forEach(i=>i.classList.remove("active"));

        elemento.classList.add("active");
    }


    let lista=[];


    const busca={
        teclados:["teclado","wooting","huntsman"],
        mouses:["mouse","superlight","sleeve","pad", "xl"],
        monitores:["monitor","zowie"],
        headsets:["headset","audeze","fone"],
        hardware:["ryzen","rtx","radeon","ddr","ssd","cooler"],
        gpu:["rtx","rx","radeon","geforce"],
        cpu:["ryzen","intel","i5","i7"],
        ram:["ddr4","ddr5","ram"],
        "fonte-armazenamento":["fonte","ssd","nvme"],
    };


    if(categoria==="todos"){
        lista=todosProdutos;
        if(titulo)titulo.innerText="📦 Todos os Produtos";

    }else if(categoria==="promocao"){
        lista = todosProdutos.filter(p => Number(p.preco_promocional) < Number(p.preco_original) && Number(p.preco_promocional) > 0);
        if(titulo)titulo.innerText="🏷️ Promoções";

    }else if(busca[categoria]){
        lista=todosProdutos.filter(p=>{
            const n=p.nome.toLowerCase();
            return busca[categoria].some(x=>n.includes(x));
        });

        if(titulo)
            titulo.innerText=categoria.toUpperCase();

    }


    renderizarProdutos(lista,container);
}


function renderizarProdutos(Lista, container) {
    container.innerHTML = "";

    if (!Lista.length) {
        container.innerHTML = "Nenhum produto encontrado.";
        return;
    }

    Lista.forEach(p => {
        const img = obterCaminhoImagem(p.nome);
        const fav = isFavorito(p.id);

        // Lógica para verificar e calcular o desconto
        const precoOriginal = Number(p.preco_original || p.preco);
        const precoPromocional = Number(p.preco_promocional || 0);
        const temDesconto = precoPromocional < precoOriginal && precoPromocional > 0;

        let descontoPercentual = 0;
        if (temDesconto) {
            descontoPercentual = Math.round(((precoOriginal - precoPromocional) / precoOriginal) * 100);
        }

        // Tag visual de desconto (-20%)
        const badgeHTML = temDesconto ? `<span class="badge-desconto">-${descontoPercentual}%</span>` : '';

        // Exibição de preço riscado x preço atual
        const precoHTML = temDesconto
            ? `<div class="preco-box">
                 <span class="preco-antigo">R$ ${precoOriginal.toFixed(2)}</span>
                 <span class="preco-promocional">R$ ${precoPromocional.toFixed(2)}</span>
               </div>`
            : `<span class="preco-unico">R$ ${precoOriginal.toFixed(2)}</span>`;

        // Preço final usado para o botão de adicionar ao carrinho
        const precoFinal = temDesconto ? precoPromocional : precoOriginal;

        container.innerHTML += `
            <div class="card-produto-loja" onclick="abrirDetalhesProduto(${p.id})">
                <button class="btn-favorito" onclick="toggleFavorito(${p.id}, event)">
                    <i class="${fav ? "fa-solid" : "fa-regular"} fa-heart"
                       style="${fav ? "color:#ff4757" : ""}">
                    </i>
                </button>

                <div class="card-produto-img-box">
                    ${badgeHTML}
                    <img
                        src="${img}"
                        alt="${sanitizarTexto(p.nome)}"
                        class="card-produto-img"
                        onerror="this.src='imagens/logo-bepro.png.jpeg'"
                    >
                </div>

                <div class="card-produto-detalhes">
                    <h3 class="card-produto-titulo">${sanitizarTexto(p.nome)}</h3>
                    <div class="card-produto-preco">
                        ${precoHTML}
                    </div>

                    <button
                        class="btn-card-comprar"
                        onclick="event.stopPropagation(); adicionarAoCarrinho('${p.nome.replace(/'/g, "\\'")}', ${precoFinal})">
                        Adicionar ao Carrinho
                    </button>
                </div>
            </div>
        `;
    });
}

function abrirDetalhesProduto(id){
    const produto=todosProdutos.find(p=>Number(p.id)===Number(id));
    if(!produto){
        console.error("Produto não encontrado:",id);
        return;
    }

    const imagem=obterCaminhoImagem(produto.nome);
    const nome=document.getElementById("produto-detalhes-nome");
    const preco=document.getElementById("produto-detalhes-preco");
    const imagemPrincipal=document.getElementById("produto-imagem-principal");
    const miniatura0=document.getElementById("miniatura-0");
    const descricao=document.getElementById("produto-descricao");
    const avaliacoes=document.getElementById("produto-avaliacoes");

    if(nome)nome.innerText=produto.nome;
    if(preco)preco.innerText=moeda(produto.preco);
    if(imagemPrincipal){
        imagemPrincipal.src=imagem;
        imagemPrincipal.alt=produto.nome;
    }
    if(miniatura0){
        miniatura0.src=imagem;
        miniatura0.alt=produto.nome;
    }
    if(descricao){
        descricao.innerText=produto.descricao||"Produto gamer selecionado pela Bepro.gg. Confira as características e informações deste produto antes de realizar sua compra.";
    }
    if(avaliacoes)avaliacoes.innerText="0 avaliações";

    const btnCarrinho=document.getElementById("btn-carrinho-produto");
    if(btnCarrinho){
        btnCarrinho.onclick=function(){
            adicionarAoCarrinho(produto.nome,produto.preco);
        };
    }

    const btnComprar=document.getElementById("btn-comprar-produto");
    if(btnComprar){
        btnComprar.onclick=function(){
            adicionarAoCarrinho(produto.nome,produto.preco);
            trocarAba("pagamento");
        };
    }

    trocarAba("produto-detalhes");
    window.scrollTo({top:0,behavior:"smooth"});
}

function trocarImagemProduto(indice){
    const imagemPrincipal=document.getElementById("produto-imagem-principal");
    const miniatura=document.getElementById(`miniatura-${indice}`);

    if(!imagemPrincipal||!miniatura)return;
    if(!miniatura.src)return;

    imagemPrincipal.src=miniatura.src;
}

function atualizarStatusLogin(){
const logado=localStorage.getItem("usuarioLogado")==="true";
const userArea=document.getElementById("auth-area");
const userName=document.getElementById("auth-user");
const menuLogin=document.getElementById("menu-login");
const menuPedidos=document.getElementById("menu-pedidos");

if(logado){
const usuario=JSON.parse(localStorage.getItem("usuario"));
if(userName)userName.innerText=`Olá, ${usuario?.nome||"User"}`;
if(userArea)userArea.style.display="flex";
if(menuLogin)menuLogin.style.display="none";
if(menuPedidos)menuPedidos.style.display="block";
}else{
if(userArea)userArea.style.display="none";
if(menuLogin)menuLogin.style.display="block";
if(menuPedidos)menuPedidos.style.display="none";
}
}

window.onload=()=>{
atualizarCarrinhoUI();
atualizarResumoPagamento();
atualizarStatusLogin();
};

const tabelaPrecosSetup={
"AMD Ryzen 7 7800X3D (O Rei do FPS)":2499,
"AMD Ryzen 7 7800X3D (Estabilidade máxima de 1% Low)":2499,
"AMD Ryzen 7 7800X3D (Melhor engine sub-tick)":2499,
"AMD Ryzen 7 7800X3D (Crucial para o mapa pesado do Warzone)":2499,
"AMD Ryzen 5 7600X":1400,
"Intel Core i7-14700K":2800,
"NVIDIA GeForce RTX 4070 Super":4399,
"NVIDIA GeForce RTX 4060 Ti":2799,
"NVIDIA GeForce RTX 4070":3999,
"NVIDIA GeForce RTX 3060 Ti":2100,
"NVIDIA GeForce RTX 4070 Ti Super":6100,
"NVIDIA GeForce RTX 4080 Super (Foco em alta resolução/Frames)":8500,
"32 GB DDR5 6000 MHz CL30":850,
"32 GB DDR5 6000 MHz":800,
"16 GB DDR5 5600 MHz":450,
"32 GB DDR5 6400 MHz CL32":950,
"Wooting 80HE (Rapid Trigger Analógico)":1800,
"Wooting 60HE+ ou Razer Huntsman V3 Pro TKL":1450,
"Wooting 80HE (Desempenho de SOCD/Snap Tap)":1800,
"Logitech G Pro X TKL Rapid":1000,
"Razer Huntsman V3 Pro Mini":1100,
"Wooting 80HE":1800,
"Razer Viper V3 Pro (8000Hz Polling Rate)":850,
"Logitech G Pro X Superlight 2 Dex":950,
"Razer DeathAdder V3 Pro ou Logitech G Pro X Superlight 2":850,
"Razer Viper V3 Pro (Leveza para cliques rápidos/APM)":850,
"Logitech G Pro X Superlight 2":800,
"Razer Viper V3 Pro":850,
"Artisan FX Hayate Otsu XL":400,
"Artisan FX Zero Soft XL (Controle perfeito de flicada)":450,
"Lethal Gaming Gear Saturn Pro XL":350,
"Logitech G640 Large":150,
"Artisan Ninja FX Zero Mid":400,
"SkyPAD Glass 3.0 XL (Rastreamento infinito de tracking)":750,
"Audeze Maxwell Wireless":2300,
"HyperX Cloud III Wireless":950,
"SteelSeries Arctis Nova Pro Wireless":2100,
"Logitech G Pro X 2 LIGHTSPEED":1400,
"Beyerdynamic DT 990 Pro + Amp (Áudio de estúdio para pixels)":1900,
"Audeze Maxwell (Melhor palco sonoro para passos distantes)":2300,
"ASUS ROG Swift 360Hz OLED":5500,
"BenQ ZOWIE XL2586X+ (540Hz DyAc 2 - O padrão dos Majors)":5999,
"BenQ ZOWIE XL2566K (360Hz DyAc+)":4200,
"LG UltraGear 27\" OLED 240Hz (Cores e tempo de resposta absurdo)":4500,
"LG UltraGear 360Hz IPS":3200,
"ASUS ROG Swift PG27AQDM (1440p OLED 240Hz)":4500
};

const setups={
fortnite:[
"Processador: AMD Ryzen 7 7800X3D (O Rei do FPS)",
"Placa de Vídeo: NVIDIA GeForce RTX 4070 Super",
"Memória RAM: 32 GB DDR5 6000 MHz CL30",
"Teclado: Wooting 80HE (Rapid Trigger Analógico)",
"Mouse: Razer Viper V3 Pro (8000Hz Polling Rate)",
"Mousepad: Artisan FX Hayate Otsu XL",
"Headset: Audeze Maxwell Wireless",
"Monitor: ASUS ROG Swift 360Hz OLED"
],
valorant:[
"Processador: AMD Ryzen 7 7800X3D (Estabilidade máxima de 1% Low)",
"Placa de Vídeo: NVIDIA GeForce RTX 4060 Ti",
"Memória RAM: 32 GB DDR5 6000 MHz CL30",
"Teclado: Wooting 60HE+ ou Razer Huntsman V3 Pro TKL",
"Mouse: Logitech G Pro X Superlight 2 Dex",
"Mousepad: Artisan FX Zero Soft XL (Controle perfeito de flicada)",
"Headset: HyperX Cloud III Wireless",
"Monitor: BenQ ZOWIE XL2586X+ (540Hz DyAc 2)"
],
cs2:[
"Processador: AMD Ryzen 7 7800X3D (Melhor engine sub-tick)",
"Placa de Vídeo: NVIDIA GeForce RTX 4070",
"Memória RAM: 32 GB DDR5 6000 MHz",
"Teclado: Wooting 80HE (Desempenho de SOCD/Snap Tap)",
"Mouse: Razer DeathAdder V3 Pro ou Logitech G Pro X Superlight 2",
"Mousepad: Lethal Gaming Gear Saturn Pro XL",
"Headset: SteelSeries Arctis Nova Pro Wireless",
"Monitor: BenQ ZOWIE XL2566K (360Hz DyAc+)"
],lol:[
"Processador: AMD Ryzen 5 7600X",
"Placa de Vídeo: NVIDIA GeForce RTX 3060 Ti",
"Memória RAM: 16 GB DDR5 5600 MHz",
"Teclado: Logitech G Pro X TKL Rapid",
"Mouse: Razer Viper V3 Pro (Leveza para cliques rápidos/APM)",
"Mousepad: Logitech G640 Large",
"Headset: Logitech G Pro X 2 LIGHTSPEED",
"Monitor: LG UltraGear 27\" OLED 240Hz (Cores e tempo de resposta absurdo)"
],
rainbow:[
"Processador: Intel Core i7-14700K",
"Placa de Vídeo: NVIDIA GeForce RTX 4070 Ti Super",
"Memória RAM: 32 GB DDR5 6000 MHz",
"Teclado: Razer Huntsman V3 Pro Mini",
"Mouse: Logitech G Pro X Superlight 2",
"Mousepad: Artisan Ninja FX Zero Mid",
"Headset: Beyerdynamic DT 990 Pro + Amp (Áudio de estúdio para pixels)",
"Monitor: LG UltraGear 360Hz IPS"
],
warzone:[
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

const nomesJogos={
fortnite:"Fortnite",
valorant:"Valorant",
cs2:"Counter Strike 2",
lol:"League of Legends",
rainbow:"Rainbow Six Siege",
warzone:"Call of Duty: Warzone"
};

function analisarSetup(){
const jogo=document.getElementById("jogo").value;
const resultado=document.getElementById("resultado-setup");
const robot=document.getElementById("robot");

if(!jogo){
if(resultado)resultado.innerHTML="<p>⚠️ Selecione um jogo primeiro.</p>";
return;
}

if(resultado)resultado.innerHTML="";
if(robot)robot.style.display="block";

const itens=setups[jogo];

setTimeout(()=>{
if(robot)robot.style.display="none";

if(resultado){
let htmlCards="";

itens.forEach(item=>{
const partes=item.split(":");
const categoria=partes[0].trim();
const modelo=partes.slice(1).join(":").trim();

const precoReal=tabelaPrecosSetup[modelo]||150;
const modeloEscapado=modelo.replace(/\\/g,"\\\\").replace(/'/g,"\\'");

htmlCards+=`
<div class="setup-item">
<div>
<span>${categoria}</span>
<strong>${modelo}</strong>
<p>R$ ${precoReal}</p>
</div>
<button onclick="adicionarAoCarrinho('${modeloEscapado}',${precoReal})">
+ Carrinho
</button>
</div>`;
});

resultado.innerHTML=`
<div class="setup-card">
<h3>🤖 Ecossistema Elite Recomendado para ${nomesJogos[jogo]}</h3>
<div class="setup-table">${htmlCards}</div>
<button onclick="adicionarPacoteCompleto('${jogo}')">
🛒 Adicionar Pacote Completo ao Carrinho
</button>
</div>`;
}
},1500);
}

function adicionarPacoteCompleto(jogoChave){
const listaItens=setups[jogoChave];
if(!listaItens)return;

listaItens.forEach(item=>{
const partes=item.split(":");
const modelo=partes.slice(1).join(":").trim();
const preco=tabelaPrecosSetup[modelo]||150;
adicionarAoCarrinho(modelo,preco);
});

alert(`🚀 Setup de ${nomesJogos[jogoChave]} adicionado ao carrinho!`);
}

const playersData = [

    {
        nome: "👑 Pro Player: Blackoutz",
        jogo: "FORTNITE",
        jogoChave: "fortnite",
        imagem: "imagens/blackoutzx.jpg",
        preco: "R$ 150,00",
        descricao: "Aprenda mecânicas avançadas de construção, highground retakes e rotas de mapa.",

        videos: {
            preview: "https://youtu.be/oM5tIUEec4o?si=M5k7aj0qmKkE8Z5",
            aula: "https://youtu.be/5DnF_3mgI5I?si=1PpZTG1dWPyxOiDQ",
            vod: "https://youtu.be/CauKbyWHzJQ?si=kFxdRMkrgB9w3W5N"
        }
    },

    {
        nome: "👑 Pro Player: Fallen",
        jogo: "COUNTER STRIKE 2",
        jogoChave: "cs2",
        imagem: "imagens/Fallen.jpg",
        preco: "R$ 200,00",
        descricao: "Aprenda controle de mapa, posicionamento de AWP e setups de granadas com o lendario Professor.",

        videos: {
            preview: "https://youtu.be/UbJSEpoTbOA?si=-UAgQC7bvaIqr6pQ",
            aula: "https://youtu.be/gB6Lw5ZaUa8?si=DprFkbuKqdh8Qe8p",
            vod: "https://youtu.be/9dKasbByBYY?si=m3uB3EV-YaPk-f8V"
        }
    },

    {
        nome: "👑 Pro Player: Faker",
        jogo: "LEAGUE OF LEGENDS",
        jogoChave: "lol",
        imagem: "imagens/Faker.jpg",
        preco: "R$ 300,00",
        descricao: "Domine controle de wave, visão de mapa e decisões macro com o maior da historia de LoL.",

        videos: {
            preview: "https://youtu.be/tYXJI26nrNc?si=b55rnP7vl_GRwCr9",
            aula: "https://youtu.be/tZgs8X7GFas?si=94cIbyMUxMh-26GT",
            vod: "https://youtu.be/W2DfA6UEiIw?si=tCrnaKL9mmjTN28q"
        }
    },

    {
        nome: "👑 Pro Player: Neskwga",
        jogo: "RAINBOW SIX SIEGE",
        jogoChave: "rainbow",
        imagem: "imagens/Neskwga.jpg",
        preco: "R$ 180,00",
        descricao: "Estratégias avançadas de ataque, defesa e comunicação.",

        videos: {
            preview: "https://youtu.be/18DtB0TUa-c?si=NOl6e1ruLjySaFG2",
            aula: "https://youtu.be/JdNg3076-zg?si=JTB2WJFGecwTPlsB",
            vod: "https://youtu.be/jjxLYeOSovU?si=Ko6KVp2tc-XLqLR3"
        }
    },

    {
        nome: "👑 Pro Player: FRTT",
        jogo: "VALORANT",
        jogoChave: "valorant",
        imagem: "imagens/FRTT.jpg",
        preco: "R$ 160,00",
        descricao: "Uso avançado de agentes, clutch e movimentação tática.",

        videos: {
            preview: "https://youtu.be/zVqC85OwWRE?si=vos0s6s3OmUAxqqH",
            aula: "https://youtu.be/D-o3jTxT4Ck?si=E3Av6Xf6n5sOLuMi",
            vod: "https://youtu.be/Epq1V-L1WmA?si=bk3lj_yrX5aSPbrT"
        }
    },

    {
        nome: "👑 Pro Player: TonyBoy",
        jogo: "CALL OF DUTY: WARZONE",
        jogoChave: "warzone",
        imagem: "imagens/tonyBOy.jpg",
        preco: "R$ 140,00",
        descricao: "Movimentação avançada, loadouts e rotações.",

        videos: {
            preview: "https://youtu.be/sa5PxNTcuLs?si=65xsiBpc14AkHFVG",
            aula: "https://youtu.be/QUpZw_F0JLg?si=aASapcRJiAblk5I7",
            vod: "https://youtu.be/veYz6MRPzS0?si=ojQPY9vH883qyMfs"
        }
    }
];
let playerIndexAtual=0;

function mudarPlayer(direcao){
const card=document.getElementById("card-player");
if(!card)return;

card.style.opacity="0";

setTimeout(()=>{
playerIndexAtual+=direcao;

if(playerIndexAtual>=playersData.length)playerIndexAtual=0;
if(playerIndexAtual<0)playerIndexAtual=playersData.length-1;

const player=playersData[playerIndexAtual];

localStorage.setItem(
    "proPlayerSelecionado",
    JSON.stringify(player)
);

const nome=document.getElementById("player-nome");
const jogo=document.getElementById("player-jogo");
const img=document.getElementById("player-img");
const desc=document.getElementById("player-desc");
const preco=document.getElementById("player-preco");

if(nome)nome.innerText=player.nome;
if(jogo)jogo.innerText=player.jogo;
if(img)img.src=player.imagem;
if(desc)desc.innerText=player.descricao;
if(preco)preco.innerText=player.preco;

card.style.opacity="1";
},200);
}

function abrirModalPlanos(){
const modal=document.getElementById("modal-planos");
if(modal)modal.style.display="flex";
}

function fecharModalPlanos(){
const modal=document.getElementById("modal-planos");
if(modal)modal.style.display="none";
}

function normalizarPlano(nomePlano){
    return String(nomePlano || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

function nomePlanoBonito(plano){
    const nomes = {
        basico: "Básico",
        pro: "Pro",
        champion: "Champion"
    };

    return nomes[plano] || plano;
}

function assinarPlano(nomePlano, preco){

    const planoNormalizado = normalizarPlano(nomePlano);

    localStorage.setItem("planoSelecionado", JSON.stringify({
        nome: nomePlano,
        chave: planoNormalizado,
        preco: Number(preco)
    }));

    adicionarAoCarrinho(
        `Aulas Pro Player (Plano ${nomePlano})`,
        preco

    );

    fecharModalPlanos();
    trocarAba("carrinho");
}

function getFavoritos(){
return JSON.parse(localStorage.getItem("bepro_favoritos"))||[];
}

function isFavorito(id){
return getFavoritos().includes(Number(id));
}

function toggleFavorito(idProduto,event){
    if(event){
        event.preventDefault();
        event.stopPropagation();
    }

    let favoritos=getFavoritos();
    const id=Number(idProduto);
    const index=favoritos.indexOf(id);
    const produto=todosProdutos.find(p=>Number(p.id)===id);
    const nomeProduto=produto?produto.nome:"Produto";
    let adicionado=false;

    if(index===-1){
        favoritos.push(id);
        adicionado=true;
    }else{
        favoritos.splice(index,1);
    }

    localStorage.setItem("bepro_favoritos",JSON.stringify(favoritos));
    atualizarBadges();

    const botao=event?.currentTarget;
    const icone=botao?.querySelector("i");

    if(icone){
        if(adicionado){
            icone.classList.remove("fa-regular");
            icone.classList.add("fa-solid");
            icone.style.color="#ff4757";
        }else{
            icone.classList.remove("fa-solid");
            icone.classList.add("fa-regular");
            icone.style.color="";
        }
    }

    mostrarNotificacaoFavorito(nomeProduto,adicionado);
}

function mostrarNotificacaoFavorito(nome,adicionado){
    const antiga=document.getElementById("notificacao-favorito");
    if(antiga)antiga.remove();

    const notificacao=document.createElement("div");
    notificacao.id="notificacao-favorito";

    notificacao.innerHTML=adicionado
        ? `
            <div class="notificacao-favorito-icone">❤️</div>
            <div class="notificacao-favorito-texto">
                <strong>Adicionado aos favoritos</strong>
                <span>${nome}</span>
            </div>
          `
        : `
            <div class="notificacao-favorito-icone">💔</div>
            <div class="notificacao-favorito-texto">
                <strong>Removido dos favoritos</strong>
                <span>${nome}</span>
            </div>
          `;

    document.body.appendChild(notificacao);

    setTimeout(()=>{
        notificacao.classList.add("saindo");

        setTimeout(()=>{
            notificacao.remove();
        },300);
    },2200);
}

function verFavoritos(event){
if(event){
event.preventDefault();
event.stopPropagation();
}

trocarAba("loja");

const container=document.getElementById("lista-produtos");
if(!container)return;

const favoritos=getFavoritos();

const titulo=document.getElementById("titulo-categoria-atual");
if(titulo)titulo.innerText="❤️ Meus Produtos Favoritos";

if(favoritos.length===0){
container.innerHTML=`
<div style="grid-column:1/-1;text-align:center;padding:40px">
<h3>Você ainda não possui favoritos!</h3>
<p>Clique no coração dos produtos para salvar.</p>
</div>`;
return;
}

const produtos=todosProdutos.filter(p=>favoritos.includes(Number(p.id)));

container.innerHTML="";

produtos.forEach(p=>{
const img=obterCaminhoImagem(p.nome);

container.innerHTML+=`
<div class="card-produto-loja">
<button class="btn-favorito" onclick="toggleFavorito(${p.id},event)">
<i class="fa-solid fa-heart"></i>
</button>

<div class="card-produto-img-box">
<img src="${img}" alt="${sanitizarTexto(p.nome)}">
</div>

<div class="card-produto-detalhes">
<h3>${sanitizarTexto(p.nome)}</h3>
<p>R$ ${p.preco}</p>

<button onclick="adicionarAoCarrinho('${p.nome}',${p.preco})">
Adicionar ao Carrinho
</button>
</div>
</div>`;
});
}

function atualizarBadges(){
const cart=document.getElementById("cart-count");
const fav=document.getElementById("fav-count");

if(cart)cart.innerText=carrinho.length;
if(fav)fav.innerText=getFavoritos().length;
}

document.addEventListener("DOMContentLoaded",()=>{
atualizarCarrinhoUI();
atualizarResumoPagamento();
atualizarBadges();
inicializarPagamento();

localStorage.setItem(
    "proPlayerSelecionado",
    JSON.stringify(playersData[playerIndexAtual])
);

const btn=document.getElementById("btnDropdownCat");
const menu=document.getElementById("menuDropdownCat");

if(btn&&menu){
btn.addEventListener("click",e=>{
e.stopPropagation();
menu.classList.toggle("ativo");
});

document.addEventListener("click",e=>{
if(!btn.contains(e.target)&&!menu.contains(e.target)){
menu.classList.remove("ativo");
}
});
}
});

function renderizarFavoritos(){
const container=document.getElementById("lista-produtos");
if(!container)return;

const favoritos=getFavoritos();

if(!favoritos.length){
container.innerHTML=`
<div style="grid-column:1/-1;text-align:center;padding:40px">
<h3>Nenhum favorito salvo.</h3>
</div>`;
return;
}

const produtos=todosProdutos.filter(p=>favoritos.includes(Number(p.id)));

container.innerHTML="";

produtos.forEach(p=>{
container.innerHTML+=`
<div class="card-produto-loja">
<button class="btn-favorito" onclick="toggleFavorito(${p.id},event)">
<i class="fa-solid fa-heart" style="color:#ff4757"></i>
</button>

<div class="card-produto-img-box">
<img src="${obterCaminhoImagem(p.nome)}">
</div>

<div class="card-produto-detalhes">
<h3>${sanitizarTexto(p.nome)}</h3>
<p>R$ ${p.preco}</p>

<button onclick="adicionarAoCarrinho('${p.nome}',${p.preco})">
Adicionar ao Carrinho
</button>
</div>
</div>`;
});
}

function inicializarSistema(){
atualizarCarrinhoUI();
atualizarResumoPagamento();
atualizarStatusLogin();
atualizarBadges();
}

window.addEventListener("load",inicializarSistema);

function abrirCadastro(){
const box=document.getElementById("cadastro-box");
if(box)box.style.display="block";
}

function sairConta(){
localStorage.removeItem("usuarioLogado");
atualizarStatusLogin();
trocarAba("inicio");
}

function abrirPerfil(){
const logado=localStorage.getItem("usuarioLogado")==="true";

if(!logado){
trocarAba("login");
return;
}

trocarAba("perfil");

if(typeof carregarPerfil==="function"){
carregarPerfil();
}
}

function exibirNomeUsuario(nome){
const el=document.getElementById("nome-usuario");
if(el)el.textContent=nome;
}

function carregarPerfil(){
const usuario=JSON.parse(localStorage.getItem("usuario"));

if(!usuario)return;

const nome=document.getElementById("perfil-nome");
const email=document.getElementById("perfil-email");
const telefone=document.getElementById("perfil-telefone");

if(nome)nome.innerText=usuario.nome;
if(email)email.innerText=usuario.email;
if(telefone)telefone.innerText=usuario.telefone;
}

function fecharDropdownPerfil(){
const dropdown=document.getElementById("perfil-dropdown");
if(dropdown)dropdown.style.display="none";
}

document.addEventListener("click",e=>{
const container=document.querySelector(".perfil-container");
const dropdown=document.getElementById("perfil-dropdown");

if(container&&dropdown&&!container.contains(e.target)){
dropdown.style.display="none";
}
});

function moeda(valor){
return Number(valor).toLocaleString("pt-BR",{
style:"currency",
currency:"BRL"
});
}

function atualizarPrecos(){
document.querySelectorAll("[data-preco]").forEach(el=>{
el.innerText=moeda(el.dataset.preco);
});
}

function limparCarrinho(){
carrinho=[];
salvarCarrinho();
atualizarCarrinhoUI();
atualizarResumoPagamento();
atualizarBadges();
}

function removerTodosFavoritos(){
localStorage.removeItem("bepro_favoritos");
atualizarBadges();

if(typeof carregarProdutos==="function"){
carregarProdutos();
}
}

function confirmarCompra(){
if(carrinho.length===0){
alert("Carrinho vazio!");
return;
}

trocarAba("pagamento");
}

function voltarInicio(){
trocarAba("inicio");
}

console.log("✅ BePro JS carregado com sucesso");

async function carregarPlano(){

    const usuario = JSON.parse(
        localStorage.getItem("usuario")
    );

    const box = document.getElementById("plano-ativo");
    const titulo = document.getElementById("plano-titulo");
    const beneficios = document.getElementById("plano-beneficios");
    const semPlano = document.getElementById("sem-plano");

    if(!usuario?.email){

        if(box) box.style.display = "none";
        if(semPlano) semPlano.style.display = "block";

        return;
    }

    try{

        const res = await fetch(
            `http://localhost:3000/meu-plano?email=${encodeURIComponent(usuario.email)}`
        );

        if(!res.ok){

            throw new Error(
                "Não foi possível consultar o plano."
            );
        }

        const plano = await res.json();
        const chavePlano = normalizarPlano(
            plano?.plano
        );

        if(!plano?.ativo){

            if(box) box.style.display = "none";
            if(semPlano) semPlano.style.display = "block";

            localStorage.removeItem(
            "planoAtivoConfirmado"
        );

            return;
        }

        const planos = {

            basico: {
                nome: "🌱 Plano Básico",
                beneficios: [
                    "1 Sessão de VOD Review (Replay)",
                    "Guia em PDF de Rotinas de Treino",
                    "Acesso ao Discord de Alunos"
                ]
            },

            pro: {
                nome: "🔥 Plano Pro",

                beneficios: [
                    "3 Sessões Ao Vivo (1h cada)",
                    "Análise de Sensibilidade/Config",
                    "Tudo do Plano Básico",
                    "Grupo VIP de Discussão Tática"
                ]
            },

            champion: {

                nome: "👑 Plano Champion",

                beneficios: [
                    "Acompanhamento Semanal 1-on-1",
                    "Partidas Duo In-Game com o Pro",
                    "Suporte VIP via WhatsApp",
                    "Relatório de Evolução Mensal"
                ]
            }
        };

        const info = planos[chavePlano];

        if(!info){

            if(box) box.style.display = "none";
            if(semPlano) semPlano.style.display = "block";

            return;
        }

        titulo.innerText = info.nome;


// ========================================
// CARDS DOS BENEFÍCIOS
// ========================================

const beneficiosCards = {

    vod: {
        titulo: "🎥 VOD Review",
        descricao: "Assista a uma aula de VOD Review e veja como o coach analisa uma gameplay.",
        botao: "Assistir Aula",
        acao: "abrirVODReview()"
    },

    guia: {
        titulo: "📄 Guia de Treino",
        descricao: "Acesse seu guia em PDF com rotinas e exercícios de treino.",
        botao: "Abrir Guia",
        acao: "abrirGuiaTreino()"
    },

    discord: {
        titulo: "💬 Discord de Alunos",
        descricao: "Entre no Discord exclusivo dos alunos Bepro.gg.",
        botao: "Entrar no Discord",
        acao: "abrirDiscordAlunos()"
    },

    sessoes: {
        titulo: "🎮 3 Sessões Ao Vivo",
        descricao: "Marque suas sessões individuais com o coach.",
        botao: "Marcar Aula",
        acao: "abrirSessoesAoVivo()"
    },

    config: {
        titulo: "⚙️ Análise de Config",
        descricao: "Analise sua sensibilidade e configurações de acordo com seu estilo de jogo.",
        botao: "Analisar Config",
        acao: "abrirAnaliseConfig()"
    },

    vip: {
        titulo: "💬 Grupo VIP",
        descricao: "Acesse o grupo VIP para participar das discussões táticas.",
        botao: "Acessar Grupo",
        acao: "abrirGrupoVIP()"
    },

    acompanhamento: {
        titulo: "👑 Acompanhamento 1-on-1",
        descricao: "Acompanhamento individual semanal com o coach.",
        botao: "Acessar",
        acao: "abrirAcompanhamento()"
    },

    duo: {
        titulo: "🎮 Duo In-Game",
        descricao: "Jogue partidas Duo com o Pro Player.",
        botao: "Agendar Duo",
        acao: "abrirDuoInGame()"
    },

    whatsapp: {
        titulo: "📱 Suporte VIP",
        descricao: "Tenha suporte exclusivo pelo WhatsApp.",
        botao: "Abrir WhatsApp",
        acao: "abrirWhatsAppVIP()"
    },

    relatorio: {
        titulo: "📊 Relatório Mensal",
        descricao: "Veja seu relatório de evolução e desempenho.",
        botao: "Ver Relatório",
        acao: "abrirRelatorioMensal()"
    }

};


// ========================================
// BENEFÍCIOS DE CADA PLANO
// ========================================

const beneficiosPorPlano = {

    basico: [
        "vod",
        "guia",
        "discord"
    ],

    pro: [
        "vod",
        "guia",
        "discord",
        "sessoes",
        "config",
        "vip"
    ],

    champion: [
        "vod",
        "guia",
        "discord",
        "sessoes",
        "config",
        "vip",
        "acompanhamento",
        "duo",
        "whatsapp",
        "relatorio"
    ]

};


// ========================================
// MONTA OS CARDS
// ========================================

const listaBeneficios =
    beneficiosPorPlano[chavePlano] || [];


beneficios.innerHTML = listaBeneficios
    .map(chave => {

        const beneficio = beneficiosCards[chave];

        return `
            <div
                class="beneficio-card"
            >

                <div class="beneficio-card-icone">
                    ${beneficio.titulo.split(" ")[0]}
                </div>

                <h3>
                    ${sanitizarTexto(
                        beneficio.titulo.substring(
                            beneficio.titulo.indexOf(" ") + 1
                        )
                    )}
                </h3>

                <p>
                    ${sanitizarTexto(
                        beneficio.descricao
                    )}
                </p>

                <div class="beneficio-status">
                    ✓ LIBERADO
                </div>

                <button
                    class="beneficio-btn"
                    onclick="${beneficio.acao}"
                >
                    ${beneficio.botao}
                </button>

            </div>
        `;

    })
    .join("");

        box.style.display = "block";

        if(semPlano){
            semPlano.style.display = "none";
        }

        localStorage.setItem(
    "planoAtivo",
    chavePlano
);

localStorage.setItem(
    "planoAtivoConfirmado",
    "true"
);

    }catch(error){
        console.error(
            "Erro ao carregar plano:",
            error
        );
    }
}

// ========================================
// FUNÇÕES DOS BENEFÍCIOS
// ========================================

// 🎥 VOD REVIEW
function abrirVODReview(){

    const modal =
        document.getElementById("modal-vod-review");

    if(!modal){
        console.error("Modal VOD Review não encontrado.");
        return;
    }

    modal.style.display = "flex";

}

// 📄 GUIA DE TREINO
function abrirGuiaTreino(){

    alert("📄 Aqui vai abrir o Guia de Treino em PDF.");

}

// 💬 DISCORD
function abrirDiscordAlunos(){

    window.open(
        "https://discord.gg/exemplo",
        "_blank"
    );
}

// 🎮 SESSÕES AO VIVO
function abrirSessoesAoVivo(){

    const modal = document.getElementById("modal-sessoes");

    if(!modal){
        console.error("Modal de sessões não encontrado.");
        return;
    }

    const etapaVideo = document.getElementById("sessao-etapa-video");
    const etapaCalendario = document.getElementById("sessao-etapa-calendario");

    if(etapaVideo) etapaVideo.style.display = "block";
    if(etapaCalendario) etapaCalendario.style.display = "none";

    const player = document.getElementById("sessao-video-player");

    const playerSalvo =
        localStorage.getItem("proPlayerSelecionado");

    if(player && playerSalvo){

        try{

            const proPlayer =
                JSON.parse(playerSalvo);

            const videoUrl =
                proPlayer.videos?.preview;

            const videoId =
                extrairYoutubeId(videoUrl);

            if(videoId){

                player.src =
                    `https://www.youtube.com/embed/${videoId}?rel=0`;

            }else{

                player.src = "";

                console.error(
                    "Preview do Pro Player inválido:",
                    videoUrl
                );
            }

        }catch(error){

            console.error(
                "Erro ao carregar Preview:",
                error
            );

            player.src = "";
        }

    }else if(player){

        player.src = "";
    }

    modal.style.display = "flex";
}

function abrirAnaliseConfig(){

    const modal =
        document.getElementById("modal-analise-config");

    if(!modal){
        console.error("Modal de análise não encontrado.");
        return;
    }

    modal.style.display = "flex";

    mostrarEtapaConfig("estilo");

}

// 💬 GRUPO VIP
function abrirGrupoVIP(){

    window.open(
        "https://discord.gg/grupovip-exemplo",
        "_blank"
    );
}

// 👑 ACOMPANHAMENTO
function abrirAcompanhamento(){

    alert("👑 Aqui vai abrir seu acompanhamento 1-on-1.");

}

// 🎮 DUO
function abrirDuoInGame(){

    const modal = document.getElementById("modal-duo");

    if(!modal){
        console.error("Modal Duo In-Game não encontrado.");
        return;
    }

    modal.style.display = "flex";

    carregarCalendarioDuo();
}

async function carregarCalendarioDuo(){

    const calendario =
        document.getElementById("calendario-duo");

    if(!calendario) return;

    calendario.innerHTML = `
        <p style="color:#94a3b8;">
            ⏳ Carregando dias disponíveis...
        </p>
    `;

    try {

        const resposta = await fetch(
            "http://localhost:3000/dias-disponiveis"
        );

        const diasDisponiveis =
            await resposta.json();

        if(!resposta.ok){
            throw new Error(
                diasDisponiveis.error ||
                "Erro ao buscar dias."
            );
        }

        calendario.innerHTML = "";

        if(!diasDisponiveis.length){

            calendario.innerHTML = `
                <p style="color:#94a3b8;">
                    Nenhum dia disponível no momento.
                </p>
            `;

            return;
        }

        diasDisponiveis.forEach(item => {

            const dataString =
                String(item.data).substring(0,10);

            const data =
                new Date(
                    dataString + "T12:00:00"
                );

            const botao =
                document.createElement("button");

            botao.type = "button";
            botao.className =
                "calendario-dia disponivel";

            const nomesDias = [
                "Dom",
                "Seg",
                "Ter",
                "Qua",
                "Qui",
                "Sex",
                "Sáb"
            ];

            botao.innerHTML = `
                <span class="dia-numero">
                    ${data.getDate()}
                </span>

                <span class="dia-nome">
                    ${nomesDias[data.getDay()]}
                </span>
            `;

            botao.onclick = () => {

                document
                    .querySelectorAll(
                        "#calendario-duo .calendario-dia"
                    )
                    .forEach(btn => {
                        btn.classList.remove("selecionado");
                    });

                botao.classList.add("selecionado");

                window.duoSelecionado = {
                    data: dataString,
                    horario: null
                };

                carregarHorariosDuo(dataString);
            };

            calendario.appendChild(botao);
        });

    } catch(error) {

        console.error(
            "Erro ao carregar calendário do Duo:",
            error
        );

        calendario.innerHTML = `
            <p style="color:#ef4444;">
                ❌ Erro ao carregar calendário.
            </p>
        `;
    }
}

async function confirmarDuoInGame(){

    if(
        !window.duoSelecionado?.data ||
        !window.duoSelecionado?.horario
    ){
        alert("Selecione um dia e um horário.");
        return;
    }

    console.log(
        "Duo In-Game confirmado:",
        window.duoSelecionado
    );

    alert(
        "🎮 Duo In-Game marcado com sucesso!"
    );

    fecharDuoInGame();
}

async function carregarHorariosDuo(data){

    const container =
        document.getElementById("horarios-duo");

    if(!container) return;

    container.style.display = "block";

    container.innerHTML = `
        <h3>🕐 Escolha o horário</h3>

        <p>
            ⏳ Carregando horários disponíveis...
        </p>
    `;

    try {

        const resposta = await fetch(
            `http://localhost:3000/horarios-disponiveis?data=${encodeURIComponent(data)}`
        );

        const horarios =
            await resposta.json();

        if(!resposta.ok){
            throw new Error(
                horarios.error ||
                "Erro ao buscar horários."
            );
        }

        if(!horarios.length){

            container.innerHTML = `
                <h3>🕐 Escolha o horário</h3>

                <p style="color:#ef4444;">
                    ❌ Não existem horários disponíveis para este dia.
                </p>
            `;

            return;
        }

        container.innerHTML = `
            <h3>🕐 Escolha o horário</h3>

            <div
                id="lista-horarios-duo"
                class="lista-horarios"
            ></div>
        `;

        const lista =
            document.getElementById(
                "lista-horarios-duo"
            );

        horarios.forEach(item => {

            const horario =
                String(item.horario).substring(0,5);

            const botao =
                document.createElement("button");

            botao.type = "button";
            botao.className = "horario-btn";
            botao.innerText = horario;

            botao.onclick = () => {

                document
                    .querySelectorAll(
                        "#lista-horarios-duo .horario-btn"
                    )
                    .forEach(btn => {
                        btn.classList.remove(
                            "selecionado"
                        );
                    });

                botao.classList.add(
                    "selecionado"
                );

                window.duoSelecionado.horario =
                    horario;

                const confirmacao =
                    document.getElementById(
                        "confirmacao-duo"
                    );

                const resumo =
                    document.getElementById(
                        "resumo-duo"
                    );

                if(resumo){

                    const dataObj =
                        new Date(
                            data + "T12:00:00"
                        );

                    resumo.innerHTML = `
                        📅 <strong>Data:</strong>
                        ${dataObj.toLocaleDateString("pt-BR")}

                        <br>

                        🕐 <strong>Horário:</strong>
                        ${horario}
                    `;
                }

                if(confirmacao){
                    confirmacao.style.display =
                        "block";
                }
            };

            lista.appendChild(botao);
        });

    } catch(error) {

        console.error(
            "Erro ao carregar horários do Duo:",
            error
        );

        container.innerHTML = `
            <p style="color:#ef4444;">
                ❌ Não foi possível carregar os horários.
            </p>
        `;
    }
}


function fecharDuoInGame(){

    const modal =
        document.getElementById("modal-duo");

    if(modal){
        modal.style.display = "none";
    }
}

// 📱 WHATSAPP
function abrirWhatsAppVIP(){

    window.open(
        "https://wa.me/5500000000000",
        "_blank"
    );

}

// ========================================
// 📊 MODELOS DE RELATÓRIO POR JOGO
// ========================================

const modelosRelatorio = {

    valorant: {

        nome: "VALORANT",

        metricas: [
            "Aim",
            "Movement",
            "Utilitários",
            "Leitura de Round",
            "Posicionamento",
            "Economia"
        ],

        melhorias: [
            "Melhorar controle de recoil",
            "Trabalhar counter-strafe",
            "Aprimorar uso de utilitários",
            "Melhorar tomada de decisão durante o round",
            "Trabalhar posicionamento"
        ],

        focos: [
            "First Bullet Accuracy",
            "Timing dos utilitários",
            "Peek com vantagem",
            "Rotação",
            "Leitura de round"
        ]

    },


    cs2: {

        nome: "COUNTER-STRIKE 2",

        metricas: [
            "Aim",
            "Counter-Strafe",
            "Spray Control",
            "Grenades",
            "Trade",
            "Rotação",
            "Economia"
        ],

        melhorias: [
            "Melhorar First Bullet Accuracy",
            "Trabalhar Spray Control",
            "Melhorar timing das granadas",
            "Aprimorar trades",
            "Melhorar leitura de rotação"
        ],

        focos: [
            "Counter-Strafe",
            "Spray Transfer",
            "Timing de Flash",
            "Trade Frag",
            "Decisão econômica"
        ]

    },


    lol: {

        nome: "LEAGUE OF LEGENDS",

        metricas: [
            "CS/min",
            "Wave Management",
            "Trading",
            "Visão",
            "Macro",
            "Objetivos",
            "Teamfight"
        ],

        melhorias: [
            "Melhorar controle de wave",
            "Aprimorar timing de recall",
            "Melhorar controle de visão",
            "Tomar melhores decisões antes dos objetivos",
            "Melhorar posicionamento em teamfights"
        ],

        focos: [
            "Wave Management",
            "Recall Timing",
            "Controle de visão",
            "Macro",
            "Teamfight"
        ]

    },


    fortnite: {

        nome: "FORTNITE",

        metricas: [
            "Aim",
            "Build",
            "Edit",
            "Piece Control",
            "Movement",
            "Positioning",
            "Rotation",
            "Endgame"
        ],

        melhorias: [
            "Melhorar Piece Control",
            "Aprimorar velocidade de edição",
            "Melhorar movimentação",
            "Trabalhar rotações",
            "Melhorar decisões de Endgame"
        ],

        focos: [
            "Piece Control",
            "Edit Speed",
            "Box Fight",
            "Resource Management",
            "Endgame"
        ]

    },


    r6: {

        nome: "RAINBOW SIX SIEGE",

        metricas: [
            "Aim",
            "Crosshair Placement",
            "Recoil Control",
            "Map Knowledge",
            "Utility",
            "Positioning",
            "Communication",
            "Game Sense"
        ],

        melhorias: [
            "Melhorar conhecimento dos mapas",
            "Trabalhar posicionamento",
            "Aprimorar uso de utility",
            "Melhorar comunicação",
            "Trabalhar leitura do adversário"
        ],

        focos: [
            "Map Knowledge",
            "Utility Usage",
            "Crosshair Placement",
            "Roaming",
            "Site Execution"
        ]

    }

};

function identificarJogoRelatorio(){

    const salvo =
        localStorage.getItem(
            "proPlayerSelecionado"
        );

    if(!salvo){
        return "valorant";
    }

    try{

        const proPlayer =
            JSON.parse(salvo);

        const texto = JSON.stringify(
            proPlayer
        ).toLowerCase();

        if(
            texto.includes("valorant")
        ){
            return "valorant";
        }

        if(
            texto.includes("cs2") ||
            texto.includes("counter-strike") ||
            texto.includes("counter strike")
        ){
            return "cs2";
        }

        if(
            texto.includes("league") ||
            texto.includes("lol")
        ){
            return "lol";
        }

        if(
            texto.includes("fortnite")
        ){
            return "fortnite";
        }

        if(
            texto.includes("rainbow") ||
            texto.includes("r6")
        ){
            return "r6";
        }

    }catch(error){

        console.error(
            "Erro ao identificar jogo:",
            error
        );
    }

    return "valorant";
}

// 📊 RELATÓRIO
function abrirRelatorioMensal(){

    const modal =
        document.getElementById(
            "modal-relatorio-mensal"
        );

    if(!modal){
        console.error(
            "Modal do relatório mensal não encontrado."
        );
        return;
    }

    montarRelatorioPorJogo();

    modal.style.display = "flex";
}

function montarRelatorioPorJogo(){

    const jogo =
        identificarJogoRelatorio();

    const modelo =
        modelosRelatorio[jogo];

    if(!modelo){
        console.warn(
            "Modelo de relatório não encontrado:",
            jogo
        );
        return;
    }

    // Nome do jogo
    const titulo =
        document.getElementById(
            "relatorio-jogo"
        );

    if(titulo){
        titulo.textContent =
            modelo.nome;
    }


    // Métricas
    const container =
        document.getElementById(
            "relatorio-indicadores"
        );

    if(!container) return;

    container.innerHTML = "";

    modelo.metricas.forEach(
        (metrica, index) => {

            // Valores fictícios para o relatório
            const anterior =
                65 + (index * 2);

            const atual =
                anterior + 8 + index;

            const evolucao =
                Math.round(
                    ((atual - anterior) /
                    anterior) * 100
                );

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "relatorio-indicador";

            card.innerHTML = `

                <div>

                    <span>
                        ${metrica}
                    </span>

                    <strong>
                        +${evolucao}%
                    </strong>

                </div>

                <div class="relatorio-comparacao">
                    ${anterior} → ${atual}
                </div>

                <div class="relatorio-barra">

                    <div
                        style="width:${atual}%"
                    ></div>

                </div>

            `;

            container.appendChild(card);
        }
    );


    // O que melhorou
    const melhorias =
        document.getElementById(
            "relatorio-melhorias"
        );

    if(melhorias){

        melhorias.innerHTML =
            modelo.melhorias
                .slice(0, 4)
                .map(
                    item => `<li>${item}</li>`
                )
                .join("");
    }


    // Próximo foco
    const focos =
        document.getElementById(
            "relatorio-focos"
        );

    if(focos){

        focos.innerHTML =
            modelo.focos
                .slice(0, 4)
                .map(
                    item => `<li>${item}</li>`
                )
                .join("");
    }
}


function fecharRelatorioMensal(){

    const modal =
        document.getElementById(
            "modal-relatorio-mensal"
        );

    if(modal){

        modal.style.display = "none";
    }

}

function carregarVideoRelatorio(input){

    const arquivo =
        input.files?.[0];

    if(!arquivo) return;

    if(!arquivo.type.startsWith("video/")){

        alert(
            "Selecione um arquivo de vídeo."
        );

        input.value = "";

        return;
    }

    const player =
        document.getElementById(
            "relatorio-video-player"
        );

    const preview =
        document.getElementById(
            "relatorio-video-preview"
        );

    if(!player || !preview) return;

    const url =
        URL.createObjectURL(arquivo);

    player.src = url;

    preview.style.display = "block";
}

function fecharRelatorioMensal(){

    const modal = document.getElementById(
        "modal-relatorio-mensal"
    );

    if(modal){
        modal.style.display = "none";
    }
}

// ========================================
// SESSÕES AO VIVO
// ========================================

let aulaSelecionada = {
    data: null,
    horario: null
};


// FECHAR MODAL

function fecharSessoesAoVivo(){

    const modal = document.getElementById(
        "modal-sessoes"
    );

    if(modal){
        modal.style.display = "none";
    }

}


// ABRIR CALENDÁRIO

function mostrarCalendarioSessoes(){

    document.getElementById(
        "sessao-etapa-video"
    ).style.display = "none";

    document.getElementById(
        "sessao-etapa-calendario"
    ).style.display = "block";

    carregarCalendarioAulas();

}


async function carregarCalendarioAulas(){

    const calendario =
        document.getElementById(
            "calendario-aulas"
        );

    if(!calendario) return;

    calendario.innerHTML = `
        <p style="color:#94a3b8;">
            ⏳ Carregando dias disponíveis...
        </p>
    `;

    try{

        const resposta = await fetch(
            "http://localhost:3000/dias-disponiveis"
        );

        const diasDisponiveis =
            await resposta.json();

        if(!resposta.ok){

            throw new Error(
                diasDisponiveis.error ||
                "Erro ao buscar dias."
            );
        }

        calendario.innerHTML = "";

        if(!diasDisponiveis.length){

            calendario.innerHTML = `
                <p style="color:#94a3b8;">
                    Nenhum dia disponível no momento.
                </p>
            `;

            return;

        }

        diasDisponiveis.forEach(item => {

            const dataString =
                String(item.data)
                    .substring(0,10);

            const data =
                new Date(
                    dataString + "T12:00:00"
                );

            const botao =
                document.createElement(
                    "button"
                );

            botao.className =
                "calendario-dia disponivel";

            const nomesDias = [
                "Dom",
                "Seg",
                "Ter",
                "Qua",
                "Qui",
                "Sex",
                "Sáb"
            ];

            botao.innerHTML = `

                <span class="dia-numero">
                    ${data.getDate()}
                </span>

                <span class="dia-nome">
                    ${nomesDias[data.getDay()]}
                </span>

            `;

            botao.onclick = () => {

                selecionarDiaAula(
                    data,
                    botao
                );
            };

            calendario.appendChild(
                botao
            );
        });

    }catch(error){

        console.error(
            "Erro ao carregar calendário:",
            error
        );

        calendario.innerHTML = `
            <p style="color:#ef4444;">
                ❌ Erro ao carregar calendário.
            </p>
        `;
    }
}

// SELECIONAR DIA

function selecionarDiaAula(
    data,
    elemento
){

    document
        .querySelectorAll(
            ".calendario-dia"
        )
        .forEach(btn => {

            btn.classList.remove(
                "selecionado"
            );

        });


    elemento.classList.add(
        "selecionado"
    );


    const dataFormatada =
        data.toLocaleDateString(
            "pt-BR"
        );


    aulaSelecionada.data =
        data.toISOString().split("T")[0];


    aulaSelecionada.horario =
        null;


    document.getElementById(
        "dia-selecionado"
    ).innerText =
        `📅 ${dataFormatada}`;


    document.getElementById(
        "horarios-aula"
    ).style.display = "block";


    carregarHorariosAula();

}


// HORÁRIOS DISPONÍVEIS

async function carregarHorariosAula(){

    const lista =
        document.getElementById(
            "lista-horarios"
        );

    if(!aulaSelecionada.data){

        return;

    }

    lista.innerHTML = `
        <p style="color:#94a3b8;">
            ⏳ Carregando horários disponíveis...
        </p>
    `;

    try{

        const resposta = await fetch(
            `http://localhost:3000/horarios-disponiveis?data=${encodeURIComponent(
                aulaSelecionada.data
            )}`
        );

        const horarios = await resposta.json();


        if(!resposta.ok){

            throw new Error(
                horarios.error ||
                "Erro ao buscar horários."
            );
        }

        if(!horarios.length){

            lista.innerHTML = `
                <p style="color:#ef4444;">
                    ❌ Não existem horários disponíveis
                    para este dia.
                </p>
            `;

            document.getElementById(
                "confirmacao-aula"
            ).style.display = "none";

            return;

        }

        lista.innerHTML = "";

        horarios.forEach(item => {
            const botao =
                document.createElement(
                    "button"
                );

            botao.className =
                "horario-btn";

            // MySQL TIME pode vir como "14:00:00"
            const horario =
                String(item.horario)
                    .substring(0,5);

            botao.innerText =
                horario;

            botao.onclick = () => {

                selecionarHorario(
                    horario,
                    botao
                );
            };

            lista.appendChild(
                botao
            );
        });


    }catch(error){

        console.error(
            "Erro ao carregar horários:",
            error
        );

        lista.innerHTML = `
            <p style="color:#ef4444;">
                ❌ Não foi possível carregar
                os horários.
            </p>
        `;
    }
}


// SELECIONAR HORÁRIO

function selecionarHorario(
    horario,
    elemento
){

    document
        .querySelectorAll(
            ".horario-btn"
        )
        .forEach(btn => {

            btn.classList.remove(
                "selecionado"
            );

        });


    elemento.classList.add(
        "selecionado"
    );


    aulaSelecionada.horario =
        horario;


    document.getElementById(
        "confirmacao-aula"
    ).style.display = "block";


    const data =
        new Date(
            aulaSelecionada.data +
            "T12:00:00"
        );


    document.getElementById(
        "resumo-aula"
    ).innerHTML = `
        📅 <strong>Data:</strong>
        ${data.toLocaleDateString("pt-BR")}
        <br>

        🕐 <strong>Horário:</strong>
        ${horario}
        <br><br>

        Confira os dados antes de confirmar.
    `;

}
// CONFIRMAR AULA

async function confirmarAula(){

    const playerSelecionado =
        playersData[playerIndexAtual];

    if(!playerSelecionado){
        alert("Erro: Pro Player não encontrado.");
        return;
    }

    // Salva a aula que o cliente está tentando comprar
    localStorage.setItem(
        "aulaSelecionada",
        JSON.stringify(playerSelecionado)
    );

    if(
        !aulaSelecionada.data ||
        !aulaSelecionada.horario
    ){

        alert(
            "Selecione uma data e um horário."
        );

        return;

    }

    const usuario =
        JSON.parse(
            localStorage.getItem("usuario")
        );

    if(!usuario?.email){

        alert(
            "Você precisa estar logado."
        );

        localStorage.removeItem(
        "planoAtivoConfirmado"
        );

        return;

    }

    try{

        const resposta = await fetch(
            "http://localhost:3000/agendar-aula",
            {

                method:"POST",

                headers:{
                    "Content-Type":
                        "application/json"
                },

                body:JSON.stringify({

                    email:
                        usuario.email,

                    data:
                        aulaSelecionada.data,

                    horario:
                        aulaSelecionada.horario

                })
            }
        );

        const resultado =
            await resposta.json();

        if(!resposta.ok){

            throw new Error(
                resultado.error ||
                "Não foi possível agendar a aula."
            );
        }

        const data =
            new Date(
                aulaSelecionada.data +
                "T12:00:00"
            );

        document.getElementById(
            "sessao-etapa-calendario"
        ).style.display = "none";

        document.getElementById(
            "sessao-aula-confirmada"
        ).style.display = "block";

        document.getElementById(
            "aula-confirmada-info"
        ).innerHTML = `

            📅 <strong>Data:</strong>
            ${data.toLocaleDateString("pt-BR")}

            <br>

            🕐 <strong>Horário:</strong>
            ${aulaSelecionada.horario}

            <br><br>

            🎮 Sua sessão foi registrada
            com sucesso.

        `;

    }catch(error){

        console.error(
            "Erro ao confirmar aula:",
            error
        );

        alert(
            "❌ " + error.message
        );
    }
}

// ========================================
// 🤖 ANÁLISE DE CONFIGURAÇÃO
// ========================================

let configAnalise = {
    estilo: null
};


// FECHAR

function fecharAnaliseConfig(){

    const modal =
        document.getElementById(
            "modal-analise-config"
        );

    if(modal){
        modal.style.display = "none";
    }

}
// MOSTRAR ETAPA

function mostrarEtapaConfig(etapa){

    const etapas = [
        "estilo",
        "dados",
        "resultado"
    ];

    etapas.forEach(nome => {

        const elemento =
            document.getElementById(
                `config-etapa-${nome}`
            );

        if(elemento){

            elemento.style.display =
                nome === etapa
                ? "block"
                : "none";
        }
    });
}
// ESCOLHER ESTILO
function selecionarEstiloConfig(estilo){

    configAnalise.estilo =
        estilo;

    mostrarEtapaConfig("dados");

}
// ANALISAR
function analisarConfiguracao(){

    const sensX =
        parseFloat(
            document.getElementById(
                "config-sens-x"
            ).value
        );

    const sensY =
        parseFloat(
            document.getElementById(
                "config-sens-y"
            ).value
        );

    const dpi =
        parseInt(
            document.getElementById(
                "config-dpi"
            ).value
        );

    const fov =
        parseInt(
            document.getElementById(
                "config-fov"
            ).value
        );

    const polling =
        parseInt(
            document.getElementById(
                "config-polling"
            ).value
        );

    if(
        !Number.isFinite(sensX) ||
        !Number.isFinite(sensY) ||
        !Number.isFinite(dpi) ||
        !Number.isFinite(fov) ||
        !Number.isFinite(polling)
    ){

        alert(
            "Preencha todas as configurações."
        );

        return;

    }

    if(
        sensX <= 0 ||
        sensY <= 0 ||
        dpi <= 0
    ){

        alert(
            "Digite valores válidos."
        );

        return;

    }

    const resultado =
        calcularAnaliseConfig({

            sensX,
            sensY,
            dpi,
            fov,
            polling,

            estilo:
                configAnalise.estilo

        });

    mostrarResultadoConfig(
        resultado
    );
}
// ========================================
// CÁLCULO DA ANÁLISE
// ========================================

function calcularAnaliseConfig(config){

    let score = 100;

    const avisos = [];

    const recomendacoes = [];
    /*
        eDPI = DPI × sensibilidade

        Essa métrica nos ajuda a avaliar
        o nível geral de sensibilidade.
    */
    const edpi =
        config.dpi *
        ((config.sensX + config.sensY) / 2);


    // ====================================
    // ESTILO RÁPIDO
    // ====================================

    if(config.estilo === "rapido"){

        if(edpi < 200){

            score -= 20;

            avisos.push(
                "Sua sensibilidade pode estar baixa para um estilo mais rápido."
            );

            recomendacoes.push(
                "Considere aumentar um pouco a sensibilidade para facilitar flicks e movimentos rápidos."
            );
        }

        else if(edpi > 1000){

            score -= 15;

            avisos.push(
                "Sua sensibilidade está muito alta."
            );

            recomendacoes.push(
                "Uma sensibilidade um pouco menor pode melhorar o controle sem perder velocidade."
            );
        }

        else{

            recomendacoes.push(
                "Sua sensibilidade está dentro de uma faixa interessante para um estilo mais rápido."
            );
        }
    }
    // ====================================
    // ESTILO PRECISO
    // ====================================

    if(config.estilo === "preciso"){

        if(edpi > 800){

            score -= 20;

            avisos.push(
                "Sua sensibilidade pode estar alta para um estilo focado em precisão."
            );

            recomendacoes.push(
                "Considere reduzir um pouco a sensibilidade para ganhar mais estabilidade nos micro-ajustes."
            );
        }

        else if(edpi < 150){

            score -= 10;

            avisos.push(
                "Sua sensibilidade está bastante baixa."
            );

            recomendacoes.push(
                "Uma pequena elevação pode facilitar correções rápidas de mira."
            );
        }

        else{

            recomendacoes.push(
                "Sua sensibilidade está em uma faixa interessante para um estilo mais preciso."
            );
        }
    }
    // ====================================
    // POLLING RATE
    // ====================================

    if(config.polling < 500){

        score -= 8;

        recomendacoes.push(
            "Seu polling rate está abaixo de 500 Hz. Se seu mouse permitir, considere testar 1000 Hz."
        );

    }

    else if(config.polling >= 1000){

        recomendacoes.push(
            "Seu polling rate está adequado para uma configuração moderna."
        );
    }
    // ====================================
    // FOV
    // ====================================

    if(config.fov < 90){

        score -= 8;

        recomendacoes.push(
            "Seu FOV está relativamente baixo. Vale testar um campo de visão maior se o jogo permitir."
        );
    }

    if(config.fov > 120){

        score -= 8;

        recomendacoes.push(
            "Seu FOV está bastante alto. Teste valores menores se estiver tendo dificuldade para identificar alvos distantes."
        );
    }

    score =
        Math.max(
            0,
            Math.min(100, score)
        );

    let classificacao;

    if(score >= 85){

        classificacao =
            "Excelente";
    }

    else if(score >= 70){

        classificacao =
            "Boa";
    }

    else if(score >= 50){

        classificacao =
            "Pode melhorar";
    }

    else{

        classificacao =
            "Precisa de ajustes";
    }

    return {

        score,
        classificacao,
        edpi,
        avisos,
        recomendacoes,
        estilo:
            config.estilo === "rapido"
            ? "⚡ Mais rápido"
            : "🎯 Mais preciso"
    };
}

function mostrarResultadoConfig(resultado){

    const container =
        document.getElementById(
            "resultado-config"
        );


    const statusClass =
        resultado.score >= 70
        ? "config-ok"
        : "config-warning";


    const avisosHTML =
        resultado.avisos.length

        ?

        `
            <div class="config-resultado-card">

                <h3>
                    ⚠️ Pontos de atenção
                </h3>

                ${resultado.avisos
                    .map(aviso => `
                        <p>
                            ${sanitizarTexto(aviso)}
                        </p>
                    `)
                    .join("")
                }

            </div>
        `

        :

        `
            <div class="config-resultado-card">

                <h3 class="config-ok">
                    ✅ Nenhum problema importante encontrado
                </h3>

            </div>
        `;


    const recomendacoesHTML =
        resultado.recomendacoes
            .map(recomendacao => `
                <p>
                    💡 ${sanitizarTexto(recomendacao)}
                </p>
            `)
            .join("");


    container.innerHTML = `

        <div class="config-resultado-card">

            <h3>
                ${resultado.estilo}
            </h3>

            <p>
                Sua configuração foi classificada como:
            </p>

            <h2 class="${statusClass}">
                ${resultado.classificacao}
            </h2>


            <div class="config-score">

                <strong>
                    Compatibilidade:
                    ${resultado.score}%
                </strong>

                <div class="config-score-bar">

                    <div
                        class="config-score-fill"
                        style="width:${resultado.score}%"
                    ></div>

                </div>

            </div>


            <p>
                <strong>eDPI:</strong>
                ${Math.round(resultado.edpi)}
            </p>

        </div>


        ${avisosHTML}


        <div class="config-resultado-card">

            <h3>
                💡 Recomendações
            </h3>

            <div class="config-recomendacao">

                ${recomendacoesHTML}

            </div>

        </div>

    `;

    mostrarEtapaConfig(
        "resultado"
    );
}

// NOVA ANÁLISE

function novaAnaliseConfig(){

    configAnalise = {
        estilo:null
    };

    document.getElementById(
        "config-sens-x"
    ).value = "";

    document.getElementById(
        "config-sens-y"
    ).value = "";

    document.getElementById(
        "config-dpi"
    ).value = "";

    document.getElementById(
        "config-fov"
    ).value = "";

    document.getElementById(
        "config-polling"
    ).value = "";

    mostrarEtapaConfig(
        "estilo"
    );
}

// ========================================
// 🎥 VOD REVIEW
// ========================================

function fecharVODReview(){

    const modal =
        document.getElementById(
            "modal-vod-review"
        );

    if(modal){

        modal.style.display = "none";

    }
}

// ========================================
// ABRIR VÍDEO
// ========================================

function extrairYoutubeId(url){

    if(!url) return null;

    const match = String(url).match(
        /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^?&/]+)/
    );

    return match ? match[1] : null;
}

function abrirVODReview(){

    const playerSalvo =
        localStorage.getItem("proPlayerSelecionado");

    if(!playerSalvo){
        alert("Nenhum Pro Player selecionado.");
        return;
    }

    const aula =
        JSON.parse(playerSalvo);

    const video =
        aula.videos?.vod;

    if(!video){
        alert("O VOD desse Pro Player ainda não foi configurado.");
        return;
    }

    const match = String(video).match(
        /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^?&/]+)/
    );

    const videoId =
        match ? match[1] : null;

    if(!videoId){
        alert("URL da VOD inválida.");
        return;
    }

    const titulo =
        document.getElementById("vod-titulo");

    if(titulo){
        titulo.textContent =
            `VOD Review — ${aula.nome.replace("👑 Pro Player: ", "")}`;
    }

    const descricao =
        document.getElementById("vod-descricao");

    if(descricao){
        descricao.textContent =
            `Análise de gameplay de ${aula.nome.replace("👑 Pro Player: ", "")} — ${aula.jogo}.`;
    }

    const player =
        document.getElementById("vod-video-player");

    if(player){
        player.src =
            `https://www.youtube.com/embed/${videoId}`;
    }

    const modal =
        document.getElementById("modal-vod-review");

    if(modal){
        modal.style.display = "flex";
    }
}

function fecharVODReview(){

    const modal =
        document.getElementById(
            "modal-vod-review"
        );

    if(modal){

        modal.style.display = "none";

    }

    const player =
        document.getElementById(
            "vod-video-player"
        );

    if(player){

        player.src = "";

    }

}
function abrirPromocao() {
    // 1. Pega o container onde os produtos são renderizados no seu HTML
    const container = document.getElementById("lista-produtos") || document.querySelector(".produtos-grid");

    // 2. Filtra apenas os produtos que realmente têm preço promocional menor que o original
    const ofertas = todosProdutos.filter(p => Number(p.preco_promocional) < Number(p.preco_original) && Number(p.preco_promocional) > 0);

    // 3. Usa a SUA função real (renderizarProdutos) passando os parâmetros certos
    if (container) {
        if (ofertas.length > 0) {
            renderizarProdutos(ofertas, container);
        } else {
            renderizarProdutos(todosProdutos, container);
        }

        // 4. Rola a tela suavemente
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

    // Procura o container dos produtos
    const secaoProdutos = document.getElementById("lista-produtos") || document.querySelector(".produtos") || document.querySelector("main");
    
    if (secaoProdutos) {
        secaoProdutos.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }

// Mantém um alias para caso o HTML chame por verOfertas
window.verOfertas = abrirPromocao;


/* =================================================================
   🍪 GERENCIADOR DE COOKIES — BEPRO.GG / LGPD
   ================================================================= */
(function () {
    "use strict";

    const COOKIE_NAME = "bepro_cookie_consent";
    const COOKIE_MAX_AGE = 60 * 60 * 24 * 180; // 180 dias

    function obterCookie(nome) {
        const prefixo = nome + "=";
        const cookies = document.cookie ? document.cookie.split("; ") : [];
        for (const cookie of cookies) {
            if (cookie.indexOf(prefixo) === 0) {
                return decodeURIComponent(cookie.substring(prefixo.length));
            }
        }
        return null;
    }

    function salvarCookie(nome, valor, maxAge) {
        const secure = location.protocol === "https:" ? "; Secure" : "";
        document.cookie = `${nome}=${encodeURIComponent(valor)}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`;
    }

    function apagarCookie(nome) {
        document.cookie = `${nome}=; Max-Age=0; Path=/; SameSite=Lax`;
    }

    function normalizarConsentimento(valor) {
        if (!valor) return null;
        try {
            const dados = JSON.parse(valor);
            if (!dados || dados.versao !== 1) return null;
            return {
                necessario: true,
                preferencias: dados.preferencias === true,
                analiticos: dados.analiticos === true,
                data: dados.data || null
            };
        } catch (_) {
            return null;
        }
    }

    function obterConsentimento() {
        return normalizarConsentimento(obterCookie(COOKIE_NAME));
    }

    function atualizarVisibilidade() {
        const banner = document.getElementById("cookie-banner");
        const botao = document.getElementById("cookie-settings-button");
        const consentimento = obterConsentimento();

        if (banner) banner.hidden = !!consentimento;
        if (botao) botao.hidden = !consentimento;
    }

    function salvarConsentimento(preferencias, analiticos) {
        const consentimento = {
            versao: 1,
            necessario: true,
            preferencias: !!preferencias,
            analiticos: !!analiticos,
            data: new Date().toISOString()
        };

        salvarCookie(COOKIE_NAME, JSON.stringify(consentimento), COOKIE_MAX_AGE);
        atualizarVisibilidade();

        // Ponto seguro para futuramente iniciar ferramentas analíticas.
        // Elas NÃO devem ser carregadas antes de consentimento.
        if (consentimento.analiticos) {
            window.dispatchEvent(new CustomEvent("bepro:analytics-consent", {
                detail: consentimento
            }));
        }

        return consentimento;
    }

    window.aceitarTodosCookies = function () {
        salvarConsentimento(true, true);
        fecharPreferenciasCookies();
    };

    window.recusarCookiesOpcionais = function () {
        salvarConsentimento(false, false);
        fecharPreferenciasCookies();
    };

    window.abrirPreferenciasCookies = function () {
        const modal = document.getElementById("cookie-modal");
        if (!modal) return;

        const consentimento = obterConsentimento();
        const preferencias = document.getElementById("cookie-preferencias");
        const analiticos = document.getElementById("cookie-analiticos");

        if (preferencias) preferencias.checked = !!consentimento?.preferencias;
        if (analiticos) analiticos.checked = !!consentimento?.analiticos;

        modal.hidden = false;
        document.body.classList.add("cookie-modal-open");

        setTimeout(() => {
            const fechar = modal.querySelector(".cookie-modal-close");
            if (fechar) fechar.focus();
        }, 0);
    };

    window.fecharPreferenciasCookies = function () {
        const modal = document.getElementById("cookie-modal");
        if (!modal) return;
        modal.hidden = true;
        document.body.classList.remove("cookie-modal-open");
        atualizarVisibilidade();
    };

    window.salvarPreferenciasCookies = function () {
        const preferencias = document.getElementById("cookie-preferencias")?.checked === true;
        const analiticos = document.getElementById("cookie-analiticos")?.checked === true;
        salvarConsentimento(preferencias, analiticos);
        fecharPreferenciasCookies();
    };

    // Funções úteis para futuras integrações do projeto.
    window.BEPRO_COOKIES = {
        obterConsentimento,
        temConsentimento: function (categoria) {
            const consentimento = obterConsentimento();
            if (!consentimento) return false;
            if (categoria === "necessario") return true;
            if (categoria === "preferencias") return consentimento.preferencias;
            if (categoria === "analiticos") return consentimento.analiticos;
            return false;
        },
        limparConsentimento: function () {
            apagarCookie(COOKIE_NAME);
            atualizarVisibilidade();
        }
    };

    document.addEventListener("DOMContentLoaded", function () {
        atualizarVisibilidade();

        // ESC fecha apenas o painel de preferências.
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") fecharPreferenciasCookies();
        });
    });
})();
