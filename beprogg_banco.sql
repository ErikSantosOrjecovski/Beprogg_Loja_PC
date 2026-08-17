-- ========================================================
-- BANCO DE DADOS BEPROGG
-- SCRIPT DE ESTRUTURA (SCHEMA) - SEGURO PARA RODAR SEMPRE
-- Este script NUNCA apaga o banco. Ele só cria o que não existe.
-- Rode este arquivo sempre que precisar (deploy, restart, etc.)
-- ========================================================

CREATE DATABASE IF NOT EXISTS beprogg
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE beprogg;


-- ========================================================
-- 1. ESTRUTURA DAS TABELAS (DDL)
-- ========================================================

-- ========================================================
-- 1.1 TABELA DE USUÁRIOS
-- ========================================================

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    cpf VARCHAR(20) NOT NULL,
    telefone VARCHAR(30) NOT NULL,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);


-- ========================================================
-- 1.2 TABELA DE PRODUTOS
-- ========================================================

CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL UNIQUE,
    categoria VARCHAR(50) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    preco_original DECIMAL(10, 2) NOT NULL,
    preco_promocional DECIMAL(10, 2) DEFAULT 0.00,
    imagem_url VARCHAR(255),
    descricao TEXT
);


-- ========================================================
-- 1.3 TABELA DE AULAS / COACH
-- ========================================================

CREATE TABLE IF NOT EXISTS aulas_coach (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL UNIQUE,
    descricao TEXT NOT NULL
);


-- ========================================================
-- 1.4 TABELA DE PEDIDOS
-- ========================================================

CREATE TABLE IF NOT EXISTS pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NULL,
    cliente VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    endereco TEXT NOT NULL,
    pagamento VARCHAR(50) NOT NULL,
    usuario_email VARCHAR(100) NOT NULL,
    usuario_nome VARCHAR(100) NOT NULL,
    itens JSON NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Confirmado',
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_pedido_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id)
        ON DELETE SET NULL
);


-- ========================================================
-- 1.5 TABELA DE PLANOS DOS USUÁRIOS
-- ========================================================

CREATE TABLE IF NOT EXISTS planos_usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_email VARCHAR(255) NOT NULL UNIQUE,
    plano VARCHAR(50) NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    data_ativacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_expiracao DATETIME NULL
);


-- ========================================================
-- 1.6 TABELA DE DISPONIBILIDADE DO COACH
-- ========================================================

CREATE TABLE IF NOT EXISTS disponibilidade_coach (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data DATE NOT NULL,
    horario TIME NOT NULL,
    disponivel BOOLEAN DEFAULT TRUE,

    UNIQUE KEY horario_unico (data, horario)
);


-- ========================================================
-- 1.7 TABELA DE AULAS AGENDADAS
-- ========================================================

CREATE TABLE IF NOT EXISTS aulas_agendadas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_email VARCHAR(255) NOT NULL,
    data DATE NOT NULL,
    horario TIME NOT NULL,

    status ENUM(
        'confirmada',
        'cancelada'
    ) DEFAULT 'confirmada',

    data_agendamento DATETIME DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY aula_unica (data, horario)
);

-- ========================================================
-- BANCO DE DADOS BEPROGG
-- SCRIPT DE DADOS INICIAIS (SEED) - SEGURO PARA RODAR SEMPRE
-- Usa INSERT IGNORE: se o registro já existir (mesmo nome/titulo/
-- data+horario), ele simplesmente pula, sem duplicar e sem apagar
-- nada. NUNCA mexe na tabela "usuarios".
-- Rode SEMPRE DEPOIS de beprogg_schema.sql
-- ========================================================

USE beprogg;


-- ========================================================
-- DISPONIBILIDADE DOS COACHES
-- ========================================================

INSERT IGNORE INTO disponibilidade_coach
(data, horario, disponivel)
VALUES
('2026-08-12', '14:00:00', TRUE),
('2026-08-12', '15:00:00', TRUE),
('2026-08-12', '16:00:00', TRUE),

('2026-08-13', '14:00:00', TRUE),
('2026-08-13', '17:00:00', TRUE),
('2026-08-13', '19:00:00', TRUE),

('2026-08-14', '15:00:00', TRUE),
('2026-08-14', '16:00:00', TRUE),
('2026-08-14', '20:00:00', TRUE);


-- ========================================================
-- PRODUTOS DO CATÁLOGO
-- ========================================================

INSERT INTO produtos
(nome, categoria, preco, preco_original, preco_promocional, imagem_url, descricao)
VALUES

-- PROCESSADORES
('AMD Ryzen 7 7800X3D', 'pecas', 2499.00, 2499.00, 2499.00, 'img/produtos/ryzen7.jpg', 'O AMD Ryzen 7 7800X3D é um processador desenvolvido especialmente para alto desempenho em jogos, equipado com 8 núcleos, 16 threads e tecnologia 3D V-Cache. Sua grande quantidade de memória cache ajuda a entregar excelentes taxas de quadros e estabilidade nos 1% Low, sendo uma excelente escolha para jogadores competitivos e PCs gamer de alto desempenho.'),
('AMD Ryzen 5 7600X', 'pecas', 1400.00, 1400.00, 1400.00, 'img/produtos/ryzen5.jpg', 'O AMD Ryzen 5 7600X oferece excelente equilíbrio entre preço e desempenho para computadores gamer. Com 6 núcleos e 12 threads, apresenta ótimo desempenho em jogos competitivos, multitarefa e aplicações do dia a dia. É uma ótima opção para montar um PC gamer equilibrado sem investir em um processador topo de linha.'),
('AMD Ryzen 9 7950X3D', 'pecas', 4299.00, 4299.00, 4299.00, 'img/produtos/ryzen9.jpg', 'O AMD Ryzen 9 7950X3D é um processador de altíssimo desempenho com 16 núcleos e 32 threads. A tecnologia 3D V-Cache proporciona excelente desempenho em jogos, enquanto a grande quantidade de núcleos permite trabalhar com streaming, renderização, edição de vídeo e multitarefa pesada. É indicado para PCs high-end.'),
('AMD Ryzen 7 9700X', 'pecas', 2599.00, 2599.00, 2599.00, 'img/produtos/ryzen7_9k.jpg', 'O AMD Ryzen 7 9700X utiliza a arquitetura Zen 5 para oferecer alto desempenho aliado a excelente eficiência energética. Com 8 núcleos e 16 threads, é indicado para jogadores que buscam altas taxas de quadros e também para usuários que trabalham com aplicações exigentes.'),
('Intel Core i7-14700K', 'pecas', 2800.00, 2800.00, 2800.00, 'img/produtos/i7.jpg', 'O Intel Core i7-14700K oferece alto desempenho para jogos, criação de conteúdo e aplicações que exigem bastante processamento. Seu grande número de núcleos e threads permite executar jogos, programas e tarefas simultaneamente com excelente fluidez. É indicado para PCs gamer avançados, streaming, edição de vídeo e multitarefa pesada.'),
('Intel Core i9-14900K', 'pecas', 3999.00, 3999.00, 3999.00, 'img/produtos/i9.jpg', 'O Intel Core i9-14900K é um processador topo de linha desenvolvido para oferecer desempenho extremo. Com grande quantidade de núcleos, threads e frequências elevadas, é capaz de lidar com jogos competitivos, criação de conteúdo, renderização, edição de vídeo e multitarefa pesada.'),
-- PLACAS DE VÍDEO
('NVIDIA GeForce RTX 4070 Super', 'pecas', 4399.00, 4399.00, 4399.00, 'img/produtos/rtx4070super.jpg', 'A NVIDIA GeForce RTX 4070 Super é uma placa de vídeo de alto desempenho indicada para jogos em 1440p e experiências em 4K. Oferece suporte a Ray Tracing, DLSS e NVIDIA Reflex, combinando qualidade visual, alto desempenho e baixa latência. É uma excelente opção para PCs gamer avançados.'),
('NVIDIA GeForce RTX 4060 Ti', 'pecas', 2799.00, 2799.00, 2799.00, 'img/produtos/rtx4060ti.jpg', 'A NVIDIA GeForce RTX 4060 Ti oferece excelente desempenho para jogos em 1080p e 1440p. Sua arquitetura moderna conta com Ray Tracing, DLSS e NVIDIA Reflex, permitindo alcançar altas taxas de quadros e baixa latência. É indicada para jogadores que desejam um PC gamer moderno e eficiente.'),
('NVIDIA GeForce RTX 4070', 'pecas', 3999.00, 3999.00, 3999.00, 'img/produtos/rtx4070.jpg', 'A NVIDIA GeForce RTX 4070 combina alto desempenho gráfico com excelente eficiência energética. É uma ótima escolha para jogos em 1440p, oferecendo potência para altas taxas de quadros em títulos competitivos e qualidade gráfica elevada em jogos modernos.'),
('NVIDIA GeForce RTX 3060 Ti', 'pecas', 2100.00, 2100.00, 2100.00, 'img/produtos/rtx3060ti.jpg', 'A NVIDIA GeForce RTX 3060 Ti continua sendo uma excelente opção para jogadores que buscam bom desempenho sem investir em uma placa topo de linha. É indicada principalmente para jogos em 1080p e 1440p, entregando boas taxas de quadros em títulos competitivos e jogos populares.'),
('NVIDIA GeForce RTX 4070 Ti Super', 'pecas', 6100.00, 6100.00, 6100.00, 'img/produtos/rtx4070tisuper.jpg', 'A NVIDIA GeForce RTX 4070 Ti Super oferece desempenho elevado para jogos em 1440p e 4K. Conta com recursos avançados como Ray Tracing, DLSS e NVIDIA Reflex, sendo indicada para jogadores que procuram altas taxas de quadros, excelente qualidade gráfica e uma experiência premium.'),
('NVIDIA GeForce RTX 4080 Super', 'pecas', 8500.00, 8500.00, 8500.00, 'img/produtos/rtx4080super.jpg', 'A NVIDIA GeForce RTX 4080 Super é uma placa de vídeo de altíssimo desempenho voltada para jogos em 4K, criação de conteúdo e aplicações gráficas pesadas. Possui grande capacidade de processamento e suporte a tecnologias modernas como Ray Tracing e DLSS, sendo indicada para PCs gamer high-end.'),
('NVIDIA GeForce RTX 5080', 'pecas', 8999.00, 8999.00, 8999.00, 'img/produtos/rtx5080.jpg', 'A NVIDIA GeForce RTX 5080 representa uma solução gráfica de altíssimo nível para jogadores que procuram desempenho extremo. É indicada para jogos em altas resoluções, altas taxas de atualização, Ray Tracing, criação de conteúdo e aplicações que exigem grande poder gráfico.'),
('AMD Radeon RX 6750 XT 12GB', 'pecas', 2399.00, 2399.00, 2399.00, 'img/produtos/rx6750xt.jpg', 'A AMD Radeon RX 6750 XT possui 12 GB de memória de vídeo e oferece excelente desempenho para jogos em 1080p e 1440p. É uma ótima opção para jogadores que procuram bastante VRAM e bom desempenho gráfico para jogos competitivos e títulos modernos.'),
('AMD Radeon RX 7800 XT 16GB', 'pecas', 3999.00, 3999.00, 3999.00, 'img/produtos/rx7800xt.jpg', 'A AMD Radeon RX 7800 XT conta com 16 GB de memória de vídeo e foi desenvolvida para oferecer excelente desempenho em 1440p. Sua grande quantidade de VRAM ajuda em jogos modernos com texturas pesadas, enquanto seu desempenho gráfico permite utilizar configurações elevadas com ótima fluidez.'),
('NVIDIA GeForce RTX 5070', 'pecas', 4999.00, 4999.00, 4999.00, 'img/produtos/rtx5070.jpg', 'A NVIDIA GeForce RTX 5070 oferece desempenho gráfico de nova geração para jogadores que procuram altas taxas de atualização. É indicada para jogos competitivos, experiências em 1440p e aplicações gráficas exigentes, contando com tecnologias modernas de aceleração e recursos avançados da NVIDIA.'),
-- REFRIGERAÇÃO
('Air cooler premium ou AIO 240 mm', 'pecas', 450.00, 450.00, 450.00, 'img/produtos/cooler.jpg', 'Sistema de refrigeração desenvolvido para manter o processador em temperaturas adequadas durante jogos e tarefas pesadas. Dependendo da configuração, pode utilizar um air cooler premium ou um water cooler AIO de 240 mm, oferecendo boa capacidade térmica para processadores gamer e contribuindo para maior estabilidade do sistema.'),
('Water Cooler Lian Li Galahad II Trinity 360mm', 'pecas', 1199.00, 1199.00, 1199.00, 'img/produtos/galahad360.jpg', 'O Lian Li Galahad II Trinity 360mm é um sistema de refrigeração líquida de alto desempenho equipado com radiador de 360 mm. É indicado para processadores de alto desempenho e oferece grande capacidade de dissipação térmica, ajudando a manter temperaturas controladas durante jogos, renderização e tarefas pesadas.'),
-- PLACAS-MÃE
('ASRock B650M Pro RS', 'pecas', 1100.00, 1100.00, 1100.00, 'img/produtos/b650m.jpg', 'A ASRock B650M Pro RS é uma placa-mãe com chipset B650 desenvolvida para processadores AMD Ryzen compatíveis. Seu formato compacto facilita a montagem de PCs gamer menores, enquanto oferece recursos modernos de conectividade, suporte a memória DDR5 e uma plataforma adequada para computadores de alto desempenho.'),
('ASUS ROG Strix B650-A Gaming WiFi', 'pecas', 1899.00, 1899.00, 1899.00, 'img/produtos/b650a_strix.jpg', 'A ASUS ROG Strix B650-A Gaming WiFi é uma placa-mãe premium para processadores AMD Ryzen. Possui conectividade Wi-Fi, suporte a DDR5 e recursos voltados para jogadores e entusiastas. Seu projeto combina desempenho, conectividade e acabamento premium para montar PCs gamer modernos.'),
('MSI MAG B650 Tomahawk WiFi', 'pecas', 1699.00, 1699.00, 1699.00, 'img/produtos/tomahawk.jpg', 'A MSI MAG B650 Tomahawk WiFi oferece uma plataforma robusta para processadores AMD Ryzen. Possui suporte a memória DDR5, conectividade Wi-Fi e construção voltada para estabilidade. É uma excelente escolha para PCs gamer de médio e alto desempenho que precisam de boa capacidade de expansão.'),
('Gigabyte Z790 AORUS Elite AX', 'pecas', 2499.00, 2499.00, 2499.00, 'img/produtos/z790_aorus.jpg', 'A Gigabyte Z790 AORUS Elite AX é uma placa-mãe de alto desempenho para processadores Intel compatíveis. Oferece suporte a DDR5, conectividade sem fio e recursos avançados para montagem de PCs gamer e máquinas de alto desempenho. Seu projeto também atende usuários que desejam maior capacidade de expansão e personalização.'),
-- MEMÓRIA RAM
('32 GB DDR5 6000 MHz CL30', 'pecas', 850.00, 850.00, 850.00, 'img/produtos/ram32gb_cl30.jpg', 'Kit de memória DDR5 com 32 GB de capacidade, frequência de 6000 MHz e latência CL30. É uma excelente configuração para PCs gamer modernos, oferecendo boa largura de banda e baixa latência. A capacidade de 32 GB permite jogar, utilizar aplicativos em segundo plano e realizar multitarefa com bastante folga.'),
('16 GB DDR5 5600 MHz', 'pecas', 450.00, 450.00, 450.00, 'img/produtos/ram16gb.jpg', 'Memória DDR5 com 16 GB de capacidade e frequência de 5600 MHz, indicada para computadores gamer de entrada e intermediários. Oferece desempenho suficiente para jogos competitivos, navegação, estudos e aplicações do dia a dia, sendo uma boa opção para quem busca uma configuração moderna com ótimo custo-benefício.'),
('32 GB DDR5 6400 MHz CL32', 'pecas', 950.00, 950.00, 950.00, 'img/produtos/ram32gb_6400.jpg', 'Memória DDR5 de 32 GB com frequência elevada de 6400 MHz e latência CL32. Foi desenvolvida para usuários que procuram alta velocidade e excelente capacidade para jogos e aplicações pesadas. A combinação de frequência e capacidade proporciona ótima resposta em sistemas modernos de alto desempenho.'),
('64 GB (2x32GB) DDR5 6000 MHz CL30', 'pecas', 1699.00, 1699.00, 1699.00, 'img/produtos/ram64gb.jpg', 'Kit com 64 GB de memória DDR5 distribuídos em dois módulos de 32 GB, com frequência de 6000 MHz e latência CL30. É indicado para usuários que trabalham com edição, criação de conteúdo, streaming, máquinas virtuais e multitarefa pesada, além de oferecer ampla capacidade para jogos atuais e futuros.'),
-- SSDs
('SSD 1 TB NVMe PCIe 4.0', 'pecas', 450.00, 450.00, 450.00, 'img/produtos/ssd1tb.jpg', 'SSD NVMe de 1 TB com interface PCIe 4.0, desenvolvido para proporcionar inicialização rápida do sistema, carregamentos menores e excelente resposta durante o uso de programas e jogos. É uma ótima opção para substituir unidades SATA tradicionais e melhorar significativamente a velocidade geral do computador.'),
('SSD 2 TB Samsung 990 Pro NVMe PCIe 4.0', 'pecas', 1299.00, 1299.00, 1299.00, 'img/produtos/990pro.jpg', 'O Samsung 990 Pro é um SSD NVMe PCIe 4.0 de alto desempenho com 2 TB de capacidade. Foi desenvolvido para usuários que precisam de grande espaço de armazenamento aliado a velocidades muito altas. É indicado para sistemas operacionais, jogos, edição de vídeo, criação de conteúdo e aplicações que realizam grande quantidade de leitura e gravação de dados.'),
-- FONTES
('Fonte Corsair RM750x 750W 80+ Gold', 'pecas', 749.00, 749.00, 749.00, 'img/produtos/rm750x.jpg', 'A Corsair RM750x oferece 750 W de potência e certificação 80 Plus Gold, sendo indicada para PCs gamer de médio e alto desempenho. Sua construção prioriza eficiência, estabilidade e durabilidade, fornecendo energia de forma confiável para processadores e placas de vídeo potentes. É uma excelente escolha para quem deseja montar um computador gamer com uma fonte de qualidade.'),
('Fonte Corsair RM1000e 1000W 80+ Gold ATX 3.0', 'pecas', 1199.00, 1199.00, 1199.00, 'img/produtos/rm1000e.jpg', 'A Corsair RM1000e oferece 1000 W de potência, certificação 80 Plus Gold e compatibilidade com o padrão ATX 3.0. É indicada para computadores de alto desempenho equipados com placas de vídeo modernas e componentes de alto consumo. Sua potência oferece ampla margem para upgrades e configurações gamer avançadas.'),
-- GABINETES
('Gabinete com bom airflow', 'pecas', 350.00, 350.00, 350.00, 'img/produtos/gabinete.jpg', 'Gabinete desenvolvido com foco em bom fluxo de ar interno, permitindo a entrada e saída eficiente de ar para ajudar na refrigeração dos componentes. É uma opção prática para montar PCs gamer, oferecendo espaço para componentes modernos e possibilitando uma organização adequada dos cabos e ventoinhas.'),
('Gabinete NZXT H9 Flow', 'pecas', 1150.00, 1150.00, 1150.00, 'img/produtos/h9flow.jpg', 'O NZXT H9 Flow possui design moderno com visual panorâmico e excelente capacidade de circulação de ar. Seu formato permite instalar diversos componentes, ventoinhas e sistemas de refrigeração líquida, sendo indicado para PCs gamer de alto desempenho que precisam de espaço interno e boa ventilação.'),
('Gabinete Lian Li O11 Dynamic EVO', 'pecas', 1299.00, 1299.00, 1299.00, 'img/produtos/o11d.jpg', 'O Lian Li O11 Dynamic EVO é um gabinete premium conhecido pelo design moderno e pela grande capacidade de personalização. Seu interior permite diversas configurações de ventoinhas, radiadores e componentes, sendo uma excelente escolha para PCs gamer de alto desempenho com foco em estética, organização e refrigeração.'),
-- TECLADOS
('Wooting 80HE', 'teclados', 1800.00, 1800.00, 1800.00, 'img/produtos/wooting80he.jpg', 'O Wooting 80HE é um teclado gamer de alto desempenho equipado com tecnologia de atuação analógica. Recursos como Rapid Trigger permitem respostas extremamente rápidas durante movimentos e mudanças de direção, sendo especialmente interessante para jogos competitivos. Seu formato 80% mantém as principais teclas de navegação sem ocupar o espaço de um teclado completo.'),
('Wooting 60HE+', 'teclados', 1450.00, 1450.00, 1450.00, 'img/produtos/wooting60he.jpg', 'O Wooting 60HE+ é um teclado compacto de formato 60% voltado para jogadores competitivos. Seus switches analógicos permitem configurar o ponto de atuação e utilizar recursos como Rapid Trigger, proporcionando respostas rápidas e personalizáveis. O tamanho reduzido também libera mais espaço para movimentos amplos do mouse.'),
('Razer Huntsman V3 Pro TKL', 'teclados', 1450.00, 1450.00, 1450.00, 'img/produtos/huntsman_tkl.jpg', 'O Razer Huntsman V3 Pro TKL é um teclado gamer compacto desenvolvido para jogos competitivos. Seus switches ópticos analógicos permitem ajustar o ponto de atuação e utilizar recursos voltados para respostas rápidas. O formato Tenkeyless reduz o tamanho do teclado mantendo as teclas de função e navegação essenciais.'),
('Logitech G Pro X TKL Rapid', 'teclados', 1000.00, 1000.00, 1000.00, 'img/produtos/logitech_tkl.jpg', 'O Logitech G Pro X TKL Rapid foi desenvolvido com foco em jogadores competitivos e eSports. Seu formato TKL oferece mais espaço para movimentação do mouse sem eliminar as teclas de função. É indicado para quem busca um teclado rápido, compacto e adequado para partidas competitivas.'),
('Razer Huntsman V3 Pro Mini', 'teclados', 1100.00, 1100.00, 1100.00, 'img/produtos/huntsman_mini.jpg', 'O Razer Huntsman V3 Pro Mini é um teclado compacto de formato reduzido, desenvolvido para jogadores que preferem deixar bastante espaço livre sobre a mesa. Seus switches ópticos analógicos oferecem ajuste do ponto de atuação e recursos para respostas rápidas em jogos competitivos.'),
('Corsair K70 MAX RGB Magnetic', 'teclados', 1399.00, 1399.00, 1399.00, 'img/produtos/k70max.jpg', 'O Corsair K70 MAX RGB Magnetic é um teclado gamer premium equipado com switches magnéticos ajustáveis. Seu sistema permite configurar o ponto de atuação das teclas de acordo com a preferência do jogador, proporcionando personalização para jogos competitivos e uso cotidiano. O teclado também conta com iluminação RGB e construção robusta.'),
-- MOUSES E MOUSEPADS
('Razer Viper V3 Pro', 'mouses', 850.00, 850.00, 850.00, 'img/produtos/viper_v3_pro.jpg', 'O Razer Viper V3 Pro é um mouse gamer sem fio desenvolvido para jogadores competitivos. Seu design leve facilita movimentos rápidos e precisos, enquanto o sensor de alta precisão oferece excelente rastreamento. Com suporte a altas taxas de polling, é indicado para jogadores que buscam baixa latência e máxima resposta durante partidas competitivas.'),
('Logitech G Pro X Superlight 2 Dex', 'mouses', 950.00, 950.00, 950.00, 'img/produtos/superlight2_dex.jpg', 'O Logitech G Pro X Superlight 2 DEX é um mouse gamer sem fio com formato ergonômico desenvolvido para proporcionar conforto durante longas sessões. Conta com sensor HERO 2 e switches LIGHTFORCE, oferecendo alta precisão, resposta rápida e excelente desempenho para jogos competitivos.'),
('Razer DeathAdder V3 Pro', 'mouses', 850.00, 850.00, 850.00, 'img/produtos/deathadder_v3.jpg', 'O Razer DeathAdder V3 Pro possui formato ergonômico desenvolvido para proporcionar conforto e controle durante longas sessões de jogo. Seu sensor de alta precisão e construção leve permitem movimentos rápidos e consistentes, sendo indicado principalmente para jogadores que preferem mouses ergonômicos.'),
('Logitech G Pro X Superlight 2', 'mouses', 800.00, 800.00, 800.00, 'img/produtos/superlight2.jpg', 'O Logitech G Pro X Superlight 2 é um mouse gamer desenvolvido para jogadores competitivos. Seu formato simétrico, construção leve e sensor de alta precisão proporcionam excelente controle durante movimentos rápidos. É indicado para FPS e outros jogos que exigem precisão e baixa latência.'),
('Artisan FX Hayate Otsu XL', 'mouses', 400.00, 400.00, 400.00, 'img/produtos/hayate_otsu.jpg', 'O Artisan FX Hayate Otsu XL é um mousepad premium desenvolvido para oferecer equilíbrio entre velocidade e controle. Sua superfície proporciona movimentos suaves e consistentes, sendo adequada para jogadores que alternam entre movimentos rápidos e ajustes precisos de mira.'),
('Artisan FX Zero Soft XL', 'mouses', 450.00, 450.00, 450.00, 'img/produtos/artisan_zero.jpg', 'O Artisan FX Zero Soft XL é um mousepad premium focado em controle e precisão. Sua superfície oferece resistência equilibrada aos movimentos, permitindo realizar ajustes finos de mira com consistência. É uma excelente opção para jogadores de FPS que valorizam controle durante movimentos de baixa e alta velocidade.'),
('Lethal Gaming Gear Saturn Pro XL', 'mouses', 350.00, 350.00, 350.00, 'img/produtos/lgg_saturn.jpg', 'O Lethal Gaming Gear Saturn Pro XL é um mousepad de controle desenvolvido para jogadores que procuram movimentos previsíveis e consistentes. Sua superfície proporciona boa resistência ao mouse, facilitando microajustes e controle da mira em jogos competitivos.'),
('Logitech G640 Large', 'mouses', 150.00, 150.00, 150.00, 'img/produtos/g640.jpg', 'O Logitech G640 Large é um mousepad de tecido com tamanho amplo, indicado para jogadores que utilizam sensibilidades baixas e precisam de bastante espaço para movimentar o mouse. Sua superfície oferece atrito consistente e movimentos previsíveis, sendo uma escolha popular para jogos competitivos.'),
('Artisan Ninja FX Zero Mid', 'mouses', 400.00, 400.00, 400.00, 'img/produtos/artisan_zero_mid.jpg', 'O Artisan Ninja FX Zero Mid é um mousepad premium desenvolvido para oferecer excelente equilíbrio entre controle e velocidade. Sua base de densidade média proporciona estabilidade sobre a mesa, enquanto a superfície permite movimentos precisos e consistentes durante partidas competitivas.'),
('SkyPAD Glass 3.0 XL', 'mouses', 750.00, 750.00, 750.00, 'img/produtos/skypad3.jpg', 'O SkyPAD Glass 3.0 XL é um mousepad de vidro desenvolvido para oferecer deslize extremamente rápido e uniforme. Sua superfície rígida proporciona movimentos suaves e baixa resistência, sendo indicado para jogadores que preferem alta velocidade e tracking contínuo. O tamanho XL oferece bastante espaço para movimentos amplos.'),
('Pulsar ES Arm Sleeve', 'mouses', 120.00, 120.00, 120.00, 'img/produtos/sleeve.jpg', 'O Pulsar ES Arm Sleeve é um manguito desenvolvido para jogadores que utilizam mousepad e procuram reduzir o atrito entre o braço e a superfície. O tecido proporciona movimentos mais uniformes e confortáveis, ajudando a manter a consistência da mira durante sessões prolongadas de jogo.'),
('Base Labs Gaming Sleeve', 'mouses', 79.00, 79.00, 79.00, 'img/produtos/baselabs_sleeve.jpg', 'O Base Labs Gaming Sleeve é um manguito desenvolvido para melhorar a movimentação do braço sobre o mousepad. Ele ajuda a reduzir o atrito e proporciona uma sensação mais uniforme durante os movimentos, sendo indicado especialmente para jogadores que utilizam baixa sensibilidade e fazem movimentos amplos.'),
-- HEADSETS
('Audeze Maxwell Wireless Gaming', 'headsets', 2300.00, 2300.00, 2300.00, 'img/produtos/audeze_maxwell.jpg', 'O Audeze Maxwell Wireless Gaming é um headset gamer premium equipado com drivers planares magnéticos de 90 mm. Ele foi desenvolvido para oferecer alta qualidade sonora, excelente detalhamento e boa percepção espacial. É indicado para jogadores que desejam identificar passos, tiros e outros elementos sonoros com precisão, além de ser adequado para música e entretenimento.'),
('HyperX Cloud III Wireless', 'headsets', 950.00, 950.00, 950.00, 'img/produtos/cloud3_wireless.jpg', 'O HyperX Cloud III Wireless é um headset gamer sem fio desenvolvido para oferecer conforto durante longas sessões. Possui áudio detalhado, microfone integrado e longa duração de bateria, sendo indicado para jogos competitivos, comunicação com a equipe e entretenimento. Seu design confortável facilita o uso prolongado.'),
('SteelSeries Arctis Nova Pro Wireless', 'headsets', 2100.00, 2100.00, 2100.00, 'img/produtos/arctis_nova_pro.jpg', 'O SteelSeries Arctis Nova Pro Wireless é um headset premium voltado para jogadores que procuram qualidade sonora e recursos avançados. Oferece áudio de alta fidelidade, conectividade sem fio e recursos de cancelamento de ruído, proporcionando uma experiência imersiva em jogos, filmes e música.'),
('Logitech G Pro X 2 LIGHTSPEED', 'headsets', 1400.00, 1400.00, 1400.00, 'img/produtos/gpro_x2.jpg', 'O Logitech G Pro X 2 LIGHTSPEED é um headset gamer sem fio desenvolvido para jogos competitivos. Seus drivers de grafeno ajudam a proporcionar reprodução sonora detalhada e boa separação dos sons, facilitando a localização de passos e ações durante as partidas. O sistema sem fio oferece liberdade de movimento e baixa latência.'),
('Beyerdynamic DT 990 Pro + Amp', 'headsets', 1900.00, 1900.00, 1900.00, 'img/produtos/dt990pro.jpg', 'O Beyerdynamic DT 990 Pro é um headphone de estúdio com construção aberta, conhecido pelo palco sonoro amplo e detalhamento dos elementos de áudio. Quando utilizado com um amplificador adequado, pode oferecer excelente desempenho para música, produção de áudio e jogos nos quais a percepção espacial é importante.'),
-- MONITORES
('ASUS ROG Swift 360Hz OLED', 'monitores', 5500.00, 5500.00, 5500.00, 'img/produtos/asus_360hz_oled.jpg', 'O ASUS ROG Swift 360Hz OLED é um monitor gamer premium desenvolvido para jogos competitivos. Seu painel OLED proporciona excelente contraste e resposta extremamente rápida, enquanto a taxa de atualização de 360Hz permite movimentos muito mais fluidos. É indicado para jogadores competitivos que procuram máxima velocidade, baixa latência e excelente qualidade de imagem.'),
('BenQ ZOWIE XL2586X+', 'monitores', 5999.00, 5999.00, 5999.00, 'img/produtos/zowie_540hz.jpg', 'O BenQ ZOWIE XL2586X+ é um monitor desenvolvido especialmente para jogos competitivos de altíssimo nível. Seu painel Fast-TN trabalha com taxa de atualização de até 540Hz e tecnologia DyAc 2, que ajuda a melhorar a clareza das imagens durante movimentos rápidos. É indicado principalmente para jogadores de FPS e eSports.'),
('BenQ ZOWIE XL2566K', 'monitores', 4200.00, 4200.00, 4200.00, 'img/produtos/zowie_360hz.jpg', 'O BenQ ZOWIE XL2566K é um monitor gamer focado em competitividade, oferecendo alta taxa de atualização e tecnologia DyAc+ para melhorar a nitidez durante movimentos rápidos. É indicado para jogadores de FPS que priorizam clareza de movimento, baixa latência e resposta rápida durante partidas competitivas.'),
('LG UltraGear 27" OLED 240Hz', 'monitores', 4500.00, 4500.00, 4500.00, 'img/produtos/lg_27_oled.jpg', 'O LG UltraGear 27 OLED 240Hz combina painel OLED com alta taxa de atualização para entregar excelente qualidade de imagem e fluidez. O painel oferece contraste elevado, cores vibrantes e resposta extremamente rápida. É indicado tanto para jogos competitivos quanto para jogadores que desejam uma experiência visual premium.'),
('LG UltraGear 360Hz IPS', 'monitores', 3200.00, 3200.00, 3200.00, 'img/produtos/lg_360hz.jpg', 'O LG UltraGear 360Hz IPS é um monitor gamer desenvolvido para oferecer alta fluidez em jogos competitivos. Sua taxa de atualização de 360Hz proporciona movimentos mais suaves, enquanto o painel IPS oferece bons ângulos de visão e qualidade de imagem. É uma excelente opção para jogadores que priorizam velocidade e responsividade.'),
('ASUS ROG Swift PG27AQDM', 'monitores', 4500.00, 4500.00, 4500.00, 'img/produtos/asus_pg27aqdm.jpg', 'O ASUS ROG Swift PG27AQDM é um monitor gamer premium com resolução 1440p e painel OLED de alta taxa de atualização. Ele combina excelente contraste, cores intensas e resposta extremamente rápida, sendo indicado para jogadores que desejam uma experiência de alto nível tanto em jogos competitivos quanto em títulos visualmente exigentes.'),
('Alienware AW2725DF (360Hz QD-OLED)', 'monitores', 4299.00, 4299.00, 4299.00, 'img/produtos/alienware_360.jpg', 'O Alienware AW2725DF combina tecnologia QD-OLED com taxa de atualização de 360Hz para oferecer excelente qualidade de imagem e altíssima fluidez. O painel proporciona cores intensas, contraste elevado e resposta extremamente rápida, sendo indicado para jogadores competitivos e usuários que procuram uma experiência visual premium.')

ON DUPLICATE KEY UPDATE
descricao = VALUES(descricao),
categoria = VALUES(categoria),
preco = VALUES(preco),
preco_original = VALUES(preco_original),
preco_promocional = VALUES(preco_promocional),
imagem_url = VALUES(imagem_url);


-- ========================================================
-- AULAS DO COACH
-- ========================================================

INSERT IGNORE INTO aulas_coach
(titulo, descricao)
VALUES
('Fortnite - Blackoutz', 'Aprenda mecânicas avançadas de construção, highground retakes e rotas de rotação competitiva com um dos maiores nomes do Fortnite brasileiro.'),
('Counter Strike 2 - Fallen', 'Aprenda controle de mapa, posicionamento de Awper, setups de granadas (smokes/flashes) e mentalidade de capitão com o Professor.'),
('League of Legends - Faker', 'Domine o controle de wave na Mid Lane, visão de mapa macro, gerenciamento de recursos e tomadas de decisão que mudam o rumo da partida com o Rei.'),
('Rainbow Six Siege - Neskwga', 'Estratégias de ataque e defesa estruturadas, posicionamento de mira (crosshair placement) e comunicação avançada de equipe em alto nível.'),
('Valorant - FRTT', 'Otimização de utilitários de agentes, estratégias avançadas de clutch, leitura de economia e movimentação tática com o fRoD brasileiro.'),
('Call of Duty: Warzone - TonyBoy', 'Movimentação avançada (slide cancel), gerenciamento de inventário sob pressão, escolha dos melhores loadouts do meta e rotações para o endgame.');


-- ========================================================
-- PROMOÇÕES (aplica descontos por nome, não por ID —
-- assim funciona mesmo que a ordem de inserção mude)
-- ========================================================

UPDATE produtos SET preco_promocional = preco_original * 0.95
WHERE nome IN ('AMD Ryzen 5 7600X', 'AMD Ryzen 9 7950X3D');

UPDATE produtos SET preco_promocional = preco_original * 0.90
WHERE nome IN ('AMD Ryzen 7 9700X', 'Intel Core i7-14700K');

UPDATE produtos SET preco_promocional = preco_original * 0.85
WHERE nome IN ('Intel Core i9-14900K', 'NVIDIA GeForce RTX 4060 Ti');

UPDATE produtos SET preco_promocional = preco_original * 0.75
WHERE nome IN ('NVIDIA GeForce RTX 4070', 'NVIDIA GeForce RTX 3060 Ti');

UPDATE produtos SET preco_promocional = preco_original * 0.80
WHERE nome IN ('AMD Ryzen 7 7800X3D', 'NVIDIA GeForce RTX 4070 Super');