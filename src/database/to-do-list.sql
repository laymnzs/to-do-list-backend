-- Active: 1675772788197@@127.0.0.1@3306
CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL, --chave primária e unique(não pode ser repitida)
    name TEXT NOT NULL, --pode repetir e é obrigatório
	email TEXT UNIQUE NOT NULL, --não pode ser repitida
	password TEXT NOT NULL --não pode ser repitida
);

CREATE TABLE tasks (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL, --se não adicionar um valo, ela atribui automaticamente
	status INTEGER DEFAULT (0) NOT NULL 
);

CREATE TABLE users_tasks (
	user_id TEXT NOT NULL,
	task_id TEXT NOT NULL,
	FOREIGN KEY (user_id) REFERENCES users (id), 
	FOREIGN KEY (task_id) REFERENCES tasks (id)
);

INSERT INTO users (id, name, email, password)
VALUES
	("f001", "Fulano", "fulano@email.com", "fulano123"),
	("f002", "Beltrana", "beltrana@email.com", "beltrana00");

INSERT INTO tasks (id, title, description)
VALUES
	("t001", "Implementar o header", "Criar o componente Header do site"),
	("t002", "Implementar o footer", "Criar o componente Footer do site"),
	("t003", "Testar site", "Teste de usabilidade de todo o site"),
	("t004", "Deploy do site", "Subir o site no surge");

INSERT INTO users_tasks (user_id, task_id)
VALUES
	("f001", "t001"),
	("f002", "t002"),
	("f001", "t003"),
	("f002", "t003");

SELECT * FROM users;
SELECT * FROM tasks;
SELECT * FROM users_tasks;