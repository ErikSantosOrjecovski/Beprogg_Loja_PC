CREATE DATABASE IF NOT EXISTS beprogg;
USE beprogg;

CREATE TABLE IF NOT EXISTS cursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2)
);

DELETE FROM cursos;

INSERT INTO cursos (nome, descricao, preco) VALUES
('Aula de FPS competitivo', 'Curso para melhorar desempenho em jogos competitivos.', 49.90),
('Otimização de PC Gamer', 'Aprenda a configurar o PC para ganhar desempenho.', 39.90),
('Montagem de PC', 'Aprenda a escolher peças compatíveis para montar um computador.', 59.90);
-- ========================================================
-- LIMPEZA E CRIAÇÃO DO BANCO DE DADOS (ZERA O BANCO ANTIGO)
-- ========================================================
DROP DATABASE IF EXISTS beprogg;
CREATE DATABASE beprogg;
USE beprogg;

-- ========================================================
-- 1. ESTRUTURA DAS TABELAS (DDL)
-- ========================================================

-- Tabela de Usuários (Sistema de Cadastro e Login)
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Produtos (Peças de Hardware da Loja)
CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    imagem_url VARCHAR(255),
    descricao TEXT
);

-- Tabela de Aulas e Mentoria (Módulo Academy / Coach)
CREATE TABLE aulas_coach (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    duracao VARCHAR(20) NOT NULL,
    professor VARCHAR(100) NOT NULL,
    descricao TEXT
);

-- Tabela de Pedidos (Carrinho de Compras integrado ao Usuário)
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
-- 2. INSERÇÃO DOS DADOS (DML) - PRODUTOS REAIS DA LOJA
-- ========================================================

INSERT INTO produtos (nome, categoria, preco, imagem_url, descricao) VALUES
-- Processadores
('Processador AMD Ryzen 5 5600X', 'Processador', 949.00, 'img/produtos/ryzen5.jpg', '6 núcleos e 12 threads, excelente para jogos e produtividade.'),
('Processador Intel Core i5-12400F', 'Processador', 899.00, 'img/produtos/i5-12400f.jpg', 'Desempenho de última geração com ótimo custo-benefício.'),
('Processador AMD Ryzen 7 5700X', 'Processador', 1299.00, 'img/produtos/ryzen7.jpg', '8 núcleos de alto desempenho para setups gamers avançados.'),
('Processador Intel Core i7-13700K', 'Processador', 2499.00, 'img/produtos/i7-13700k.jpg', 'Poder bruto para renderização, streaming e jogos pesados.'),

-- Placas de Vídeo
('Placa de Vídeo RTX 4060 Galax', 'Placa de Vídeo', 2199.00, 'img/produtos/rtx4060.jpg', 'Tecnologia DLSS 3 e Ray Tracing para a nova geração.'),
('Placa de Vídeo RX 6600 AMD Radeon', 'Placa de Vídeo', 1499.00, 'img/produtos/rx6600.jpg', 'O melhor custo-benefício para jogar em resolução Full HD.'),
('Placa de Vídeo RTX 4070 Ti MSI', 'Placa de Vídeo', 5499.00, 'img/produtos/rtx4070ti.jpg', 'Desempenho extremo para rodar tudo no Ultra em 4K.'),
('Placa de Vídeo RX 7700 XT PowerColor', 'Placa de Vídeo', 3199.00, 'img/produtos/rx7700xt.jpg', 'Nova arquitetura RDNA 3 com excelente estabilidade de FPS.'),

-- Memórias RAM
('Memória RAM Kingston Fury Beast 8GB 3200MHz', 'Memória RAM', 189.00, 'img/produtos/ram8gb.jpg', 'Alta velocidade e dissipador térmico elegante para o seu PC.'),
('Memória RAM Corsair Vengeance RGB Pro 16GB 3200MHz', 'Memória RAM', 399.00, 'img/produtos/ram16gb.jpg', 'Estilo RGB customizável e máxima performance de leitura.'),
('Kit Memória RAM XPG Spectrix 32GB (2x16GB) 3600MHz', 'Memória RAM', 749.00, 'img/produtos/ram32gb.jpg', 'Ideal para multitarefas pesadas e edição de vídeo.'),

-- Armazenamento (SSD)
('SSD Kingston NV2 1TB NVMe M.2', 'Armazenamento', 389.00, 'img/produtos/ssd1tb.jpg', 'Velocidades de leitura impressionantes de até 3500MB/s.'),
('SSD Crucial P3 500GB NVMe M.2', 'Armazenamento', 249.00, 'img/produtos/ssd500gb.jpg', 'Carregamento instantâneo do sistema operacional e jogos.'),
('SSD Sata III SanDisk Plus 480GB', 'Armazenamento', 219.00, 'img/produtos/ssdsata.jpg', 'Upgrade perfeito para ressuscitar notebooks e PCs antigos.'),

-- Fontes de Alimentação
('Fonte Corsair CV650 650W 80 Plus Bronze', 'Fonte', 369.00, 'img/produtos/fonte650w.jpg', 'Energia estável e certificada para placas de vídeo modernas.'),
('Fonte MSI Mag A650BN 650W 80 Plus Bronze', 'Fonte', 329.00, 'img/produtos/fontemsi.jpg', 'Circuito de proteção robusto e alta eficiência energética.'),
('Fonte XPG Core Reactor 850W 80 Plus Gold Modular', 'Fonte', 699.00, 'img/produtos/fonte850w.jpg', 'Cabeamento modular para um gerenciamento de cabos perfeito.'),

-- Placas-Mãe
('Placa-Mãe ASUS TUF Gaming B550M-Plus', 'Placa-Mãe', 899.00, 'img/produtos/b550m.jpg', 'Suporte total para processadores AMD Ryzen e VRM robusto.'),
('Placa-Mãe Gigabyte B760M AORUS ELITE', 'Placa-Mãe', 1199.00, 'img/produtos/b760m.jpg', 'Pronta para processadores Intel de 12ª e 13ª geração com DDR5.'),
('Placa-Mãe ASRock A520M-HVS', 'Placa-Mãe', 429.00, 'img/produtos/a520m.jpg', 'A opção ideal e econômica para setups de entrada.');


-- ========================================================
-- 3. INSERÇÃO DOS DADOS - CONTEÚDO ACADEMY / COACHING
-- ========================================================

INSERT INTO aulas_coach (titulo, duracao, professor, descricao) VALUES
('Configuração Avançada de Windows para Jogos', '45 min', 'Coach Pedro', 'Aprenda a desativar processos inúteis e otimizar o sistema para ganhar FPS.'),
('Análise de Gargalo (Bottleneck) de Hardware', '60 min', 'Coach Erik', 'Como identificar se seu processador está limitando sua placa de vídeo.'),
('Undervolt de GPU: Menos Temperatura, Mesmo Desempenho', '30 min', 'Coach Murilo', 'Guia prático para reduzir o consumo de energia e o calor da sua placa de vídeo.'),
('Introdução ao Overclock de Memória RAM', '50 min', 'Coach Lucas', 'Entenda como ativar o XMP/DOCP de forma segura na Bios da placa-mãe.');