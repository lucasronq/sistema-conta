var express = require('express');
var usuariosApp = require("../app/usuarios/controller/ctlUsuarios")

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
router.get('/', authenticationMiddleware, usuariosApp.getAllUsuarios);
router.get('/insertUsuarios', authenticationMiddleware, usuariosApp.insertUsuarios);
router.get('/viewUsuarios/:id/:oper', authenticationMiddleware, usuariosApp.viewUsuarios);

/* POST métodos */
router.post('/insertUsuarios', authenticationMiddleware, usuariosApp.insertUsuarios);
router.post('/DeleteUsuarios', authenticationMiddleware, usuariosApp.DeleteUsuarios);
router.post('/viewUsuarios', authenticationMiddleware, usuariosApp.viewUsuarios);


module.exports = router;
