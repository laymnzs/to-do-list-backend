import express, { Request, Response } from 'express'
import cors from 'cors'
import { db } from './database/knex' 

const app = express() //cria o aplicativo

app.use(cors())
app.use(express.json()) //trabalha objetos de entrada e a saída em json

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`)
})


//configuração do express:
app.get("/ping", async (req: Request, res: Response) => {
    try {
				const result = await db("users") //buscou no banco de dados - tabela users
        res.status(200).send({ message: "Pong!", result: result}) //result: trouxe o array da tabela users
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})


//Endpoint de GET all users:

app.get("/users", async (req: Request, res: Response) => {
    try {

        const qUsers = req.query.q as string | undefined  //query params que trás o usuário pela letra digitada

        if (qUsers === undefined) {

            const result = await db("users") //buscou no banco de dados - tabela users
            res.status(200).send(result) //result: trouxe o array da tabela users


        } else {
            //const result = await db("users").where("email", "LIKE", `%${qUsers}%`) //busca por email, ex: "beltrana@emai.com"
            const result = await db("users").where("name", "LIKE", `%${qUsers}%`) //busca por nome, ex: "fulano"
            res.status(200).send(result) 
        }

        

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})



