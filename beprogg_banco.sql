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