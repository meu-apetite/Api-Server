import { Router } from 'express';
const router = Router();

router.get('/home', (req, res) => res.render('home') );

export default router; 
// Faz a página home, onde o dono da loja vai entrar.
// A tela tem que ter alguns dashBoards e um menu hamburguer
// Segui o modelo que tu me mostrou ontem
//Lembrando que o mobile é primeiro (mobile first)
// Usa o padrão kamicase (nomeSegundo) pra nomear variáveis e arquivos
// Pra nomear class usa nome-segundo -> esse padrão que eu não sei o nome
// Tentar deixa as coisas mais genérica e reutilizáveis possível
// é isso... Divitasse ok , nao sei fazer darshbard mais eu vejo depois 

