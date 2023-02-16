import express, { Request, Response } from 'express'
import cors from 'cors'
import { TUsersDB } from './database/types'
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



//Endpoint de POST:

app.post("/users", async (req: Request, res: Response) => {
    try {

        /*forma de fazer desestruturação passo a passo:

        const id = req.body.id
        const name = req.body.name
        const email = req.body.email
        const password = req.body.password*/

        
        
        //desestrurando direto
        const {id, name, email, password} = req.body 

        if(typeof id !== "string"){ //se for diferente de string, irá dar erro
            res.status(400)
            throw new Error("'id' deve ser string")
        }


        if(id.length <4){ //se for menor que 2, precisará de 4 caracteres
            res.status(400)
            throw new Error("'id' deve possuir 4 caracteres")
        }

        if(typeof name !== "string"){ //se id for diferente de string, irá dar erro
            res.status(400)
            throw new Error("'name' deve ser string")
        }


        if(name.length <4){ //se nome for menor que 2, precisará de 4 caracteres
            res.status(400)
            throw new Error("'name' deve possuir 4 caracteres")
        }


        if(typeof email !== "string"){ //se email for diferente de string, irá dar erro
            res.status(400)
            throw new Error("'email' deve ser string")
        }


        if(email.length <4){ //se email for menor que 2, precisará de 4 caracteres
            res.status(400)
            throw new Error("'email' deve possuir 4 caracteres")
        }
       
        if(typeof password !== "string"){ //se for diferente de string, irá dar erro
            res.status(400)
            throw new Error("'password' deve ser string")
        }


        if(password.length <8){ //se password for menor que 2, precisará de 4 caracteres
            res.status(400)
            throw new Error("'password' deve possuir 8 caracteres")
        }


         /*está no no material fluxo de dados:
         if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{4,6}$/g)) {
			throw new Error("'password' deve possuir entre 4 e 6 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial")
		}*/



        //usersExists: ARRAY              await db("users") = SELECT
        //sempre que fizer um select de tabela, retornará uma tipagem DB (de tabela)  + array "[]" e pode tb tipar undefined (ñ obrigatória)
        
        
        const [usersIdExists]: TUsersDB[] | undefined[] = await db("users").where({id}) //retornara um array vazio ou vem array com item encontrado

        if(usersIdExists) { //se existir, deixará de ser undefined
         res.status(400)
         throw new Error("'ID' já existe")
        }



        const [usersEmailExists]: TUsersDB[] | undefined[] = await db("users").where({email}) //retornara um array vazio ou vem array com item encontrado

        if(usersEmailExists) { //se existir, deixará de ser undefined
         res.status(400)
         throw new Error("'Email' já existe")
        }



        //Modelando usuário: recebendo a estrutura da tabela users

        const newUsers: TUsersDB = {
            id, name, email, password
        }

        await db("users").insert(newUsers) //inserindo novo usuário na tabela
        res.status(201).send({
            message: "Usuário criado com sucesso!",
            user: newUsers //devolver o usuário/formato (newUsers) criado  
        })


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




