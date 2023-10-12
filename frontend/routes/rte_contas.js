var express = require('express');
var contasApp = require("../app/contas/controller/ctlContas")

////var login = require("../controllers/login/login")
var router = express.Router();
//const passport = require('passport');



//Função necessária para evitar que usuários não autenticados acessem o sistema.
function authenticationMiddleware(req, res, next) {
    // Verificar se existe uma sessão válida.
    isLogged = req.session.isLogged;    
  
    if (!isLogged) {      
      res.redirect("/Login");
    }
    next();
}; 
  
/* GET métodos */
router.get('/contas', authenticationMiddleware, contasApp.getAllContas);
router.get('/openContasInsert', authenticationMiddleware, contasApp.openContasInsert);
router.get('/openContasUpdate/:id', authenticationMiddleware, contasApp.openContasUpdate);

/* POST métodos */
router.post('/insertContas', authenticationMiddleware, contasApp.insertConta);
router.post('/getDados', authenticationMiddleware, contasApp.getDados);
router.post('/updateContas', authenticationMiddleware, contasApp.updateContas);
router.post('/deleteContas', authenticationMiddleware, contasApp.deleteContas);




module.exports = router;