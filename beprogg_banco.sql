DROP DATABASE IF EXISTS beprogg;
CREATE DATABASE beprogg CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE beprogg;

-- ========================================================
-- 1. ESTRUTURA DAS TABELAS (DDL)
-- ========================================================

<<<<<<< HEAD
-- Tabela de Usuários (Sistema de Cadastro e Login)
=======
>>>>>>> 23979982f3b432d4af0549c2d1b53f87e44cdc47
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

<<<<<<< HEAD
-- Tabela de Produtos (Peças de Hardware da Loja)
=======
>>>>>>> 23979982f3b432d4af0549c2d1b53f87e44cdc47
CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    imagem_url VARCHAR(255),
    descricao TEXT
);

<<<<<<< HEAD
-- Tabela de Aulas e Mentoria (Módulo Academy / Coach Adaptado)
CREATE TABLE aulas_coach (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL, -- Guardará o padrão 'Jogo - Pro Player'
    descricao TEXT NOT NULL
);

-- Tabela de Pedidos (Carrinho de Compras integrado ao Usuário)
=======
CREATE TABLE aulas_coach (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT NOT NULL
);

>>>>>>> 23979982f3b432d4af0549c2d1b53f87e44cdc47
CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pendente',
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pedido_usuario 
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id) 
        ON DELETE SET NULL
);

-- ========================================================
<<<<<<< HEAD
-- 2. INSERÇÃO DOS DADOS (DML) - PRODUTOS COMBINANDO COM O SEU SCRIPT.JS
-- ========================================================

-- Corrigido 'category' para 'categoria' e adicionado todos os produtos da sua lista do JS
INSERT INTO produtos (nome, categoria, preco, imagem_url, descricao) VALUES
-- Peças e Hardware (Categoria: 'pecas')
('AMD Ryzen 7 7800X3D', 'pecas', 2499.00, 'img/produtos/ryzen7.jpg', 'O rei absoluto dos jogos competitivos atualmente.'),
('Air cooler premium ou AIO 240 mm', 'pecas', 450.00, 'img/produtos/cooler.jpg', 'Refrigeração de alta performance para manter os frames estáveis.'),
('ASRock B650M Pro RS', 'pecas', 1100.00, 'img/produtos/b650m.jpg', 'Placa-mãe robusta com VRM frio, ideal para Ryzen 7000.'),
('NVIDIA GeForce RTX 5070 ou AMD Radeon RX 9070 XT', 'pecas', 4999.00, 'img/produtos/rtx5070.jpg', 'Próxima geração de desempenho gráfico para altíssimas taxas de atualização.'),
('32 GB DDR5 6000 MHz CL30', 'pecas', 850.00, 'img/produtos/ram32gb.jpg', 'Kit de memórias otimizado para a plataforma AM5 com baixa latência.'),
('SSD 1 TB NVMe PCIe 4.0', 'pecas', 450.00, 'img/produtos/ssd1tb.jpg', 'Velocidade máxima de carregamento para o Windows e jogos competitivos.'),
('750 W 80+ Gold', 'pecas', 600.00, 'img/produtos/fonte750w.jpg', 'Eficiência e segurança energética premium para o setup.'),
('Gabinete com bom airflow', 'pecas', 350.00, 'img/produtos/gabinete.jpg', 'Frente em mesh para garantir que suas peças trabalhem frias.'),

-- Periféricos Premium (Categoria: 'perifericos')
('Teclado Wooting 80HE', 'perifericos', 1800.00, 'img/produtos/wooting.jpg', 'Teclado analógico com Rapid Trigger, o melhor do mundo para FPS.'),
('Mouse Logitech G Pro X Superlight 2', 'perifericos', 900.00, 'img/produtos/superlight2.jpg', 'Sensor HERO 2 de altíssima precisão e peso ultra leve de 60g.'),
('FX Hayate Otsu v2 XL', 'perifericos', 350.00, 'img/produtos/mousepad.jpg', 'Mousepad premium feito para deslize rápido e paradas precisas.'),
('Audeze Maxwell Wireless Gaming', 'perifericos', 2300.00, 'img/produtos/audeze.jpg', 'Áudio planar magnético de estúdio para localização perfeita de passos.'),
('BenQ ZOWIE XL2586X+', 'perifericos', 5999.00, 'img/produtos/zowie.jpg', 'Monitor profissional de esports com tecnologia DyAc 2.'),
('Pulsar ES Arm Sleeve', 'perifericos', 120.00, 'img/produtos/sleeve.jpg', 'Manguito de alta qualidade para consistência no deslize do braço.');
=======
-- 2. INSERÇÃO DOS DADOS (DML) - COM CATEGORIAS ESPECÍFICAS
-- ========================================================

INSERT INTO produtos (nome, categoria, preco, imagem_url, descricao) VALUES

-- 🔧 PEÇAS E HARDWARE (categoria: 'pecas')
('AMD Ryzen 7 7800X3D', 'pecas', 2499.00, 'img/produtos/ryzen7.jpg', 'O rei do FPS e da estabilidade no 1% Low.'),
('AMD Ryzen 5 7600X', 'pecas', 1400.00, 'img/produtos/ryzen5.jpg', 'Excelente desempenho custo-benefício para eSports.'),
('AMD Ryzen 9 7950X3D', 'pecas', 4299.00, 'img/produtos/ryzen9.jpg', 'Desempenho máximo para jogos e criação de conteúdo pesado.'),
('AMD Ryzen 7 9700X', 'pecas', 2599.00, 'img/produtos/ryzen7_9k.jpg', 'Nova arquitetura Zen 5 com alta eficiência energética.'),
('Intel Core i7-14700K', 'pecas', 2800.00, 'img/produtos/i7.jpg', 'Altíssimo desempenho multi-core e alta frequência.'),
('Intel Core i9-14900K', 'pecas', 3999.00, 'img/produtos/i9.jpg', 'O processador mais rápido da Intel para taxas extremas de quadros.'),
('NVIDIA GeForce RTX 4070 Super', 'pecas', 4399.00, 'img/produtos/rtx4070super.jpg', 'Desempenho gráfico extremo com tecnologias DLSS 3 e Reflex.'),
('NVIDIA GeForce RTX 4060 Ti', 'pecas', 2799.00, 'img/produtos/rtx4060ti.jpg', 'Foco em alta taxa de quadros e excelente eficiência em 1080p.'),
('NVIDIA GeForce RTX 4070', 'pecas', 3999.00, 'img/produtos/rtx4070.jpg', 'Ideal para jogos competitivos em quadros elevados.'),
('NVIDIA GeForce RTX 3060 Ti', 'pecas', 2100.00, 'img/produtos/rtx3060ti.jpg', 'Excelente custo-benefício para MOBAs e jogos leves.'),
('NVIDIA GeForce RTX 4070 Ti Super', 'pecas', 6100.00, 'img/produtos/rtx4070tisuper.jpg', 'Poder bruto para resoluções altas e taxas de atualização máximas.'),
('NVIDIA GeForce RTX 4080 Super', 'pecas', 8500.00, 'img/produtos/rtx4080super.jpg', 'Foco em altíssima resolução e framerate máximo.'),
('NVIDIA GeForce RTX 5080', 'pecas', 8999.00, 'img/produtos/rtx5080.jpg', 'A nova geração de desempenho gráfico de altíssimo nível.'),
('AMD Radeon RX 6750 XT 12GB', 'pecas', 2399.00, 'img/produtos/rx6750xt.jpg', 'Ótima quantidade de VRAM e excelente performance intermediária.'),
('AMD Radeon RX 7800 XT 16GB', 'pecas', 3999.00, 'img/produtos/rx7800xt.jpg', 'Alta largura de banda para resoluções 1440p sem gargalos.'),
('Air cooler premium ou AIO 240 mm', 'pecas', 450.00, 'img/produtos/cooler.jpg', 'Refrigeração de alta performance para manter os frames estáveis.'),
('Water Cooler Lian Li Galahad II Trinity 360mm', 'pecas', 1199.00, 'img/produtos/galahad360.jpg', 'Resfriamento líquido fluido para processadores topo de linha.'),
('ASRock B650M Pro RS', 'pecas', 1100.00, 'img/produtos/b650m.jpg', 'Placa-mãe robusta com VRM frio, ideal para Ryzen 7000.'),
('ASUS ROG Strix B650-A Gaming WiFi', 'pecas', 1899.00, 'img/produtos/b650a_strix.jpg', 'Construção premium com conectividade de alta velocidade.'),
('MSI MAG B650 Tomahawk WiFi', 'pecas', 1699.00, 'img/produtos/tomahawk.jpg', 'Estabilidade e durabilidade militar para sessões longas de jogo.'),
('Gigabyte Z790 AORUS Elite AX', 'pecas', 2499.00, 'img/produtos/z790_aorus.jpg', 'Suporte total a overclocking para a linha Intel.'),
('32 GB DDR5 6000 MHz CL30', 'pecas', 850.00, 'img/produtos/ram32gb_cl30.jpg', 'Latência ultra baixa otimizada para o ecossistema AMD.'),
('32 GB DDR5 6000 MHz', 'pecas', 800.00, 'img/produtos/ram32gb_6000.jpg', 'Alta velocidade para estabilidade de frames em jogos pesados.'),
('16 GB DDR5 5600 MHz', 'pecas', 450.00, 'img/produtos/ram16gb.jpg', 'Quantidade ideal para MOBAs e jogos leves de eSports.'),
('32 GB DDR5 6400 MHz CL32', 'pecas', 950.00, 'img/produtos/ram32gb_6400.jpg', 'Frequência máxima e velocidade extrema para mapas pesados.'),
('64 GB (2x32GB) DDR5 6000 MHz CL30', 'pecas', 1699.00, 'img/produtos/ram64gb.jpg', 'Capacidade total sem gargalos para multitarefa extrema e streaming.'),
('SSD 1 TB NVMe PCIe 4.0', 'pecas', 450.00, 'img/produtos/ssd1tb.jpg', 'Velocidade máxima de carregamento para o Windows e jogos.'),
('SSD 2 TB Samsung 990 Pro NVMe PCIe 4.0', 'pecas', 1299.00, 'img/produtos/990pro.jpg', 'O SSD mais rápido da categoria para tempos de load instantâneos.'),
('750 W 80+ Gold', 'pecas', 600.00, 'img/produtos/fonte750w.jpg', 'Eficiência e segurança energética premium para o setup.'),
('Fonte Corsair RM750x 750W 80+ Gold', 'pecas', 749.00, 'img/produtos/rm750x.jpg', 'Construção com capacitores japoneses de alta durabilidade.'),
('Fonte Corsair RM1000e 1000W 80+ Gold ATX 3.0', 'pecas', 1199.00, 'img/produtos/rm1000e.jpg', 'Pronta para as novas placas de vídeo com conector 12VHPWR.'),
('Gabinete com bom airflow', 'pecas', 350.00, 'img/produtos/gabinete.jpg', 'Frente em mesh para garantir fluxo de ar contínuo.'),
('Gabinete NZXT H9 Flow', 'pecas', 1150.00, 'img/produtos/h9flow.jpg', 'Design aquário com excelente fluxo de ar e visão interna total.'),
('Gabinete Lian Li O11 Dynamic EVO', 'pecas', 1299.00, 'img/produtos/o11d.jpg', 'Modularidade total e suporte para múltiplos radiadores.'),

-- ⌨️ TECLADOS (categoria: 'teclados')
('Wooting 80HE', 'teclados', 1800.00, 'img/produtos/wooting80he.jpg', 'Rapid Trigger Analógico e tecnologia SOCD/Snap Tap de ponta.'),
('Wooting 60HE+', 'teclados', 1450.00, 'img/produtos/wooting60he.jpg', 'Formato compacto 60% com os switches analógicos mais rápidos.'),
('Razer Huntsman V3 Pro TKL', 'teclados', 1450.00, 'img/produtos/huntsman_tkl.jpg', 'Switches ópticos analógicos Gen-2 para acionamento ultrarrápido.'),
('Logitech G Pro X TKL Rapid', 'teclados', 1000.00, 'img/produtos/logitech_tkl.jpg', 'Teclado de nível profissional projetado com foco em eSports.'),
('Razer Huntsman V3 Pro Mini', 'teclados', 1100.00, 'img/produtos/huntsman_mini.jpg', 'Desempenho compacto com ajuste fino de ponto de atuação.'),
('Corsair K70 MAX RGB Magnetic', 'teclados', 1399.00, 'img/produtos/k70max.jpg', 'Switches magnéticos MGX ajustáveis ponto a ponto.'),

-- 🖱️ MOUSES (categoria: 'mouses')
('Razer Viper V3 Pro', 'mouses', 850.00, 'img/produtos/viper_v3_pro.jpg', 'Sensor de alta precisão com até 8000Hz de Polling Rate e peso reduzido.'),
('Logitech G Pro X Superlight 2 Dex', 'mouses', 950.00, 'img/produtos/superlight2_dex.jpg', 'Design ergonômico com switches híbridos LIGHTFORCE e sensor HERO 2.'),
('Razer DeathAdder V3 Pro', 'mouses', 850.00, 'img/produtos/deathadder_v3.jpg', 'Formato ergonômico icônico com tecnologia sem fio ultrarrápida.'),
('Logitech G Pro X Superlight 2', 'mouses', 800.00, 'img/produtos/superlight2.jpg', 'A evolução do mouse simétrico campeão dos eSports.'),

-- 🟩 MOUSEPADS E ACESSÓRIOS (categoria: 'mouses')
('Artisan FX Hayate Otsu XL', 'mouses', 400.00, 'img/produtos/hayate_otsu.jpg', 'Mousepad japonês com equilíbrio ideal entre velocidade e controle.'),
('Artisan FX Zero Soft XL', 'mouses', 450.00, 'img/produtos/artisan_zero.jpg', 'Controle absoluto para precisão cirúrgica em flicadas.'),
('Lethal Gaming Gear Saturn Pro XL', 'mouses', 350.00, 'img/produtos/lgg_saturn.jpg', 'Superfície de controle de altíssima durabilidade.'),
('Logitech G640 Large', 'mouses', 150.00, 'img/produtos/g640.jpg', 'Superfície de tecido com atrito ideal para baixo DPI.'),
('Artisan Ninja FX Zero Mid', 'mouses', 400.00, 'img/produtos/artisan_zero_mid.jpg', 'Base de densidade média para movimentos consistentes.'),
('SkyPAD Glass 3.0 XL', 'mouses', 750.00, 'img/produtos/skypad3.jpg', 'Mousepad de vidro temperado para deslize e tracking infinitos.'),
('Pulsar ES Arm Sleeve', 'mouses', 120.00, 'img/produtos/sleeve.jpg', 'Manguito de alta qualidade para consistência no deslize do braço.'),
('Base Labs Gaming Sleeve', 'mouses', 79.00, 'img/produtos/baselabs_sleeve.jpg', 'Redução do atrito do braço contra o mousepad para deslizes consistentes.'),

-- 🎧 HEADSETS & ÁUDIO (categoria: 'headsets')
('Audeze Maxwell Wireless Gaming', 'headsets', 2300.00, 'img/produtos/audeze_maxwell.jpg', 'Drivers planares magnéticos de 90mm para palco sonoro imbatível.'),
('HyperX Cloud III Wireless', 'headsets', 950.00, 'img/produtos/cloud3_wireless.jpg', 'Conforto lendário com até 120 horas de bateria e áudio espacial.'),
('SteelSeries Arctis Nova Pro Wireless', 'headsets', 2100.00, 'img/produtos/arctis_nova_pro.jpg', 'Sistema de áudio de alta fidelidade com cancelamento ativo de ruído.'),
('Logitech G Pro X 2 LIGHTSPEED', 'headsets', 1400.00, 'img/produtos/gpro_x2.jpg', 'Drivers de Grafeno para clareza e localização sonora perfeitas.'),
('Beyerdynamic DT 990 Pro + Amp', 'headsets', 1900.00, 'img/produtos/dt990pro.jpg', 'Fone de estúdio aberto para percepção espacial máxima de passos.'),

-- 🖥️ MONITORES (categoria: 'monitores')
('ASUS ROG Swift 360Hz OLED', 'monitores', 5500.00, 'img/produtos/asus_360hz_oled.jpg', 'Tempo de resposta de 0.03ms com a nitidez do painel OLED.'),
('BenQ ZOWIE XL2586X+', 'monitores', 5999.00, 'img/produtos/zowie_540hz.jpg', 'Painel Fast-TN de 540Hz com tecnologia DyAc 2 para clareza em movimento.'),
('BenQ ZOWIE XL2566K', 'monitores', 4200.00, 'img/produtos/zowie_360hz.jpg', 'Monitor 360Hz e DyAc+ padrão dos campeonatos internacionais.'),
('LG UltraGear 27" OLED 240Hz', 'monitores', 4500.00, 'img/produtos/lg_27_oled.jpg', 'Tempo de resposta absurdo e cores vibrantes em 240Hz.'),
('LG UltraGear 360Hz IPS', 'monitores', 3200.00, 'img/produtos/lg_360hz.jpg', 'Alta taxa de atualização com painel IPS de ótimos ângulos de visão.'),
('ASUS ROG Swift PG27AQDM', 'monitores', 4500.00, 'img/produtos/asus_pg27aqdm.jpg', 'Resolução 1440p (2K) combinada com painel OLED de 240Hz.'),
('Alienware AW2725DF (360Hz QD-OLED)', 'monitores', 4299.00, 'img/produtos/alienware_360.jpg', 'Cores QD-OLED com altíssima taxa de atualização.');
>>>>>>> 23979982f3b432d4af0549c2d1b53f87e44cdc47

-- ========================================================
-- 3. INSERÇÃO DOS DADOS - CATEGORIAS DE JOGOS COMPETITIVOS
-- ========================================================

INSERT INTO aulas_coach (titulo, descricao) VALUES 
('Fortnite - Blackoutz', 'Aprenda mecânicas avançadas de construção, highground retakes e rotas de rotação competitiva com um dos maiores nomes do Fortnite brasileiro.'),
('Counter Strike 2 - Fallen', 'Aprenda controle de mapa, posicionamento de Awper, setups de granadas (smokes/flashes) e mentalidade de capitão com o Professor.'),
('League of Legends - Faker', 'Domine o controle de wave na Mid Lane, visão de mapa macro, gerenciamento de recursos e tomadas de decisão que mudam o rumo da partida com o Rei.'),
('Rainbow Six Siege - Neskwga', 'Estratégias de ataque e defesa estruturadas, posicionamento de mira (crosshair placement) e comunicação avançada de equipe em alto nível.'),
('Valorant - FRTT', 'Otimização de utilitários de agentes, estratégias avançadas de clutch, leitura de economia e movimentação tática com o fRoD brasileiro.'),
('Call of Duty: Warzone - TonyBoy', 'Movimentação avançada (slide cancel), gerenciamento de inventário sob pressão, escolha dos melhores loadouts do meta e rotações para o endgame.');