-- ========================================================
-- LIMPEZA E CRIAÇÃO DO BANCO DE DADOS (ZERA O BANCO ANTIGO)
-- ========================================================
DROP DATABASE IF EXISTS beprogg;
CREATE DATABASE beprogg CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
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

-- Tabela de Aulas e Mentoria (Módulo Academy / Coach Adaptado)
CREATE TABLE aulas_coach (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL, -- Guardará o padrão 'Jogo - Pro Player'
    descricao TEXT NOT NULL
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