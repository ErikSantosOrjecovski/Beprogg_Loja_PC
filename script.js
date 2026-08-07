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

    alert(`"${item.nome}" foi adicionado ao carrinho!`);
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

        const planoSelecionado=JSON.parse(localStorage.getItem("planoSelecionado"));

if(planoSelecionado){
    const usuario=JSON.parse(localStorage.getItem("usuario"));

    if(usuario?.email){
        const resPlano=await fetch("http://localhost:3000/ativar-plano",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                email:usuario.email,
                plano:planoSelecionado.nome.toLowerCase()
            })
        });

        if(resPlano.ok){
            localStorage.setItem("planoAtivo",planoSelecionado.nome);
            localStorage.removeItem("planoSelecionado");
        }
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


function obterCaminhoImagem(nomeProduto){
    const nome=nomeProduto.toLowerCase();

    if(nome.includes("7800x3d")||nome.includes("ryzen"))
        return"imagens/andryzen5-5560-removebg-preview.png";

    if(nome.includes("i5"))return"imagens/intelcore-i5-removebg-preview.png";
    if(nome.includes("i7"))return"imagens/intelcore-i7-removebg-preview.png";

    if(nome.includes("cooler"))
        return"imagens/aircooler-removebg-preview.png";

    if(nome.includes("b550"))
        return"imagens/placamaeb550-removebg-preview.png";

    if(nome.includes("b650")||nome.includes("b660")||nome.includes("asrock"))
        return"imagens/placamaeb660-removebg-preview.png";

    if(nome.includes("x570"))
        return"imagens/placamaex570-removebg-preview.png";

    if(nome.includes("ddr5")&&nome.includes("32"))
        return"imagens/ram32gb-ddr5-removebg-preview.png";

    if(nome.includes("ddr4")&&nome.includes("32"))
        return"imagens/ram32gb-ddr4-removebg-preview.png";

    if(nome.includes("3060"))
        return"imagens/rtx3060-removebg-preview.png";

    if(nome.includes("4060"))
        return"imagens/rtx4060-removebg-preview.png";

    if(nome.includes("4070")||nome.includes("5070"))
        return"imagens/rtx4070-removebg-preview.png";

    if(nome.includes("ssd")||nome.includes("nvme"))
        return"imagens/ssd-1tb-removebg-preview.png";

    if(nome.includes("750w"))
        return"imagens/fonte750w-removebg-preview.png";

    if(nome.includes("850w"))
        return"imagens/fonte850w-removebg-preview.png";

    if(nome.includes("gabinete"))
        return"imagens/gabinete-removebg-preview.png";

    if(nome.includes("wooting")||nome.includes("teclado"))
        return"imagens/wooting-80he-removebg-preview.png";

    if(nome.includes("mouse")||nome.includes("superlight")||nome.includes("razer"))
        return"imagens/logitech-superlight2-removebg-preview.png";

    if(nome.includes("hayate")||nome.includes("saturn")||nome.includes("mousepad"))
        return"imagens/hayate-otsu-removebg-preview.png";

    if(nome.includes("audeze")||nome.includes("steelseries"))
        return"imagens/audeze-maxwell-removebg-preview.png";

    if(nome.includes("monitor")||nome.includes("benq"))
        return"imagens/BenqZowie.png";

    return"imagens/logo-bepro.png.jpeg";
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
        mouses:["mouse","superlight","sleeve","pad"],
        monitores:["monitor","zowie","xl"],
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
        lista=todosProdutos.filter(p=>p.preco<1000);
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


function renderizarProdutos(lista,container){

    container.innerHTML="";


    if(!lista.length){
        container.innerHTML="<p>Nenhum produto encontrado.</p>";
        return;
    }


    lista.forEach(p=>{

        const img=obterCaminhoImagem(p.nome);
        const fav=isFavorito(p.id);


        container.innerHTML+=`

        <div class="card-produto-loja">

            <button class="btn-favorito"
            onclick="toggleFavorito(${p.id},event)">
                <i class="${fav?"fa-solid":"fa-regular"} fa-heart"
                style="${fav?"color:#ff4757":""}">
                </i>
            </button>


            <div class="card-produto-img-box">
                <img src="${img}"
                alt="${sanitizarTexto(p.nome)}"
                class="card-produto-img"
                onerror="this.src='imagens/logo-bepro.png.jpeg'">
            </div>


            <div class="card-produto-detalhes">

                <h3 class="card-produto-titulo">
                    ${sanitizarTexto(p.nome)}
                </h3>

                <p class="card-produto-preco">
                    R$ ${p.preco}
                </p>


                <button class="btn-card-comprar"
                onclick="adicionarAoCarrinho('${p.nome.replace(/'/g,"\\'")}',${p.preco})">
                    Adicionar ao Carrinho
                </button>

            </div>

        </div>`;

    });
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

const playersData=[
{
nome:"👑 Pro Player: Blackoutz",
jogo:"FORTNITE",
imagem:"imagens/blackoutzx.jpg",
preco:"R$ 150,00",
descricao:"Aprenda mecânicas avançadas de construção, highground retakes e rotas de mapa."
},
{
nome:"👑 Pro Player: Fallen",
jogo:"COUNTER STRIKE 2",
imagem:"imagens/Fallen.jpg",
preco:"R$ 200,00",
descricao:"Aprenda controle de mapa, posicionamento de AWP e setups de granadas."
},
{
nome:"👑 Pro Player: Faker",
jogo:"LEAGUE OF LEGENDS",
imagem:"imagens/Faker.jpg",
preco:"R$ 300,00",
descricao:"Domine controle de wave, visão de mapa e decisões macro."
},
{
nome:"👑 Pro Player: Neskwga",
jogo:"RAINBOW SIX SIEGE",
imagem:"imagens/Neskwga.jpg",
preco:"R$ 180,00",
descricao:"Estratégias avançadas de ataque, defesa e comunicação."
},
{
nome:"👑 Pro Player: FRTT",
jogo:"VALORANT",
imagem:"imagens/FRTT.jpg",
preco:"R$ 160,00",
descricao:"Uso avançado de agentes, clutch e movimentação tática."
},
{
nome:"👑 Pro Player: TonyBoy",
jogo:"CALL OF DUTY: WARZONE",
imagem:"imagens/tonyBOy.jpg",
preco:"R$ 140,00",
descricao:"Movimentação avançada, loadouts e rotações."
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

function assinarPlano(nomePlano,preco){
    localStorage.setItem("planoSelecionado",JSON.stringify({
        nome:nomePlano,
        preco:preco
    }));

    adicionarAoCarrinho(`Aulas Pro Player (Plano ${nomePlano})`,preco);
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

if(index===-1)favoritos.push(id);
else favoritos.splice(index,1);

localStorage.setItem("bepro_favoritos",JSON.stringify(favoritos));

atualizarBadges();

if(typeof carregarProdutos==="function")carregarProdutos();
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
    const usuario=JSON.parse(localStorage.getItem("usuario"));

    if(!usuario?.email)return;

    try{
        const res=await fetch(`http://localhost:3000/meu-plano?email=${encodeURIComponent(usuario.email)}`);
        const plano=await res.json();

        const box=document.getElementById("plano-ativo");
        const titulo=document.getElementById("plano-titulo");
        const beneficios=document.getElementById("plano-beneficios");

        if(!plano.ativo){
            box.style.display="none";
            return;
        }

        const dados={
            basico:{
                nome:"🌱 Plano Básico",
                beneficios:[
                    "1 Sessão de VOD Review (Replay)",
                    "Guia em PDF de Rotinas de Treino",
                    "Acesso ao Discord de Alunos"
                ]
            },
            pro:{
                nome:"🔥 Plano Pro",
                beneficios:[
                    "3 Sessões Ao Vivo (1h cada)",
                    "Análise de Sensibilidade/Config",
                    "Tudo do Plano Básico",
                    "Grupo VIP de Discussão Tática"
                ]
            },
            champion:{
                nome:"👑 Plano Champion",
                beneficios:[
                    "Acompanhamento Semanal 1-on-1",
                    "Partidas Duo In-Game com o Pro",
                    "Suporte VIP via WhatsApp",
                    "Relatório de Evolução Mensal"
                ]
            }
        };

        const info=dados[plano.plano];

        if(!info){
            box.style.display="none";
            return;
        }

        titulo.innerText=info.nome;
        beneficios.innerHTML=info.beneficios.map(b=>`<li>✅ ${b}</li>`).join("");
        box.style.display="block";

    }catch(error){
        console.error("Erro ao carregar plano:",error);
    }
}