const axios = require("axios");
const moment = require("moment");

//@ Abre o formulário de manutenção de usuarios
const getAllUsuarios = (req, res) =>
  (async () => {
    userName = req.session.userName;
    try {
      resp = await axios.get(process.env.SERVIDOR_DW3 + "/getAllUsuarios", {});
      //console.log("[ctlLogin.js] Valor resp:", resp.data);
      res.render("usuarios/view_manutencao", {
        title: "Manutenção de usuarios",
        data: resp.data,
        userName: userName,
      });
    } catch (erro) {
      console.log("[ctlUsuarios.js|getAllUsuarios] Try Catch:Erro de requisição");
    }
  })();

//@ Função para validar campos no formulário
function validateForm(regFormPar) {
  //@ *** Regra de validação
  //@ Como todos os campos podem ter valor nulo, vou me preocupar
  //@ com campo datanascimento. Caso ele tenha valor "", vou atribuir null a ele.

  if (regFormPar.datanascimento == "") {
    regFormPar.datanascimento = null;
  }

  return regFormPar;
}

//@ Abre e faz operações de CRUD no formulário de cadastro de usuarios
const insertUsuarios = (req, res) =>
  (async () => {
    var oper = "";
    var registro = {};
    var contas = {};
    userName = req.session.userName;
    token = req.session.token;
    try {
      if (req.method == "GET") {
        oper = "c";
        contas = await axios.get(
          process.env.SERVIDOR_DW3 + "/GetAllContas",
          {}
        );
        //console.log("[crlUsuarios|insertUsuarios] valor de contas:", contas.data.registro);
        registro = {
          usuarioid: 0,
          prontuario: "",
          nome: "",
          endereco: "",
          rendafamiliar: "0.00",
          datanascimento: "",
          contaid: 0,
          deleted: false,
        };

        res.render("usuarios/view_cadUsuarios", {
          title: "Cadastro de usuarios",
          data: registro,
          conta: contas.data.registro,
          oper: oper,
          userName: userName,
        });
      } else {
        oper = "c";
        const usuarioREG = validateForm(req.body);
        resp = await axios.post(
          process.env.SERVIDOR_DW3 + "/insertUsuarios",
          {
            usuarioid: 0,
            prontuario: usuarioREG.prontuario,
            nome: usuarioREG.nome,
            endereco: usuarioREG.endereco,
            rendafamiliar: usuarioREG.rendafamiliar,
            datanascimento: usuarioREG.datanascimento,
            contaid: usuarioREG.contaid,
            deleted: false,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        console.log("[ctlUsuarios|insertUsuarios] resp:", resp.data);
        if (resp.data.status == "ok") {
          registro = {
            usuarioid: 0,
            prontuario: "",
            nome: "",
            endereco: "",
            rendafamiliar: "0.00",
            datanascimento: "",
            contaid: 0,
            deleted: false,
          };
        } else {
          registro = usuarioREG;
        }
        contas = await axios.get(
          process.env.SERVIDOR_DW3 + "/GetAllContas",
          {}
        );
        oper = "c";
        res.render("usuarios/view_cadUsuarios", {
          title: "Cadastro de usuarios",
          data: registro,
          conta: contas.data.registro,
          oper: oper,
          userName: userName,
        });
      }
    } catch (erro) {
      console.log(
        "[ctlUsuarios.js|insertUsuarios] Try Catch: Erro não identificado",
        erro
      );
    }
  })();

//@ Abre o formulário de cadastro de usuarios para futura edição
const viewUsuarios = (req, res) =>
  (async () => {
    var oper = "";
    var registro = {};
    var contas = {};
    userName = req.session.userName;
    token = req.session.token;
    try {
      if (req.method == "GET") {
        const id = req.params.id;
        oper = req.params.oper;

        parseInt(id);
        resp = await axios.post(
          process.env.SERVIDOR_DW3 + "/getAlunoByID",
          {
            usuarioid: id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        if (resp.data.status == "ok") {
          registro = resp.data.registro[0];
          registro.datanascimento = moment(registro.datanascimento).format(
            "YYYY-MM-DD"
          );
          contas = await axios.get(
            process.env.SERVIDOR_DW3 + "/GetAllContas",
            {}
          );
          console.log("[ctlUsuarios|viewUsuarios] GET oper:", oper);

          res.render("usuarios/view_cadUsuarios", {
            title: "Cadastro de usuarios",
            data: registro,
            conta: contas.data.registro,
            oper: oper,
            userName: userName,
          });
        }
      } else {
        // Código vai entrar quando o usuário clicar no botão Alterar e requisição for POST
        oper = "vu";
        console.log("[ctlUsuarios|viewUsuarios] POST oper:", oper);
        const usuarioREG = validateForm(req.body);
        console.log("[ctlUsuarios|viewUsuarios] POST id:", usuarioREG.id);
        const id = parseInt(usuarioREG.id);
        resp = await axios.post(
          process.env.SERVIDOR_DW3 + "/updateUsuarios",
          {
            usuarioid: id,
            prontuario: usuarioREG.prontuario,
            nome: usuarioREG.nome,
            endereco: usuarioREG.endereco,
            rendafamiliar: usuarioREG.rendafamiliar,
            datanascimento: usuarioREG.datanascimento,
            contaid: usuarioREG.contaid,
            deleted: false,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        if (resp.data.status == "ok") {
          res.json({ status: "ok" });
        } else {
          res.json({ status: "erro" });
        }
      }
    } catch (erro) {
      res.json({ status: "[ctlUsuarios.js|viewUsuarios] Aluno não pode ser alterado" });
      console.log(
        "[ctlUsuarios.js|viewUsuarios] Try Catch: Erro não identificado",
        erro
      );
    }
  })();

//@ Abre o formulário de cadastro de usuarios
const DeleteUsuarios = (req, res) =>
  (async () => {
    var oper = "";
    userName = req.session.userName;
    token = req.session.token;
    try {
      oper = "v";
      const id = parseInt(req.body.id);
    
      resp = await axios.post(
        process.env.SERVIDOR_DW3 + "/DeleteUsuarios",
        {
          usuarioid: id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      if (resp.data.status == "ok") {
        res.json({ status: "ok" });
      } else {
        res.json({ status: "erro" });
      }
    } catch (erro) {
      console.log(
        "[ctlUsuarios.js|DeleteUsuarios] Try Catch: Erro não identificado",
        erro
      );
    }
  })();

module.exports = {
  getAllUsuarios,
  //cadUsuarios,
  // getAlunoByID,
  viewUsuarios,
  insertUsuarios,
  // updateUsuarios,
  DeleteUsuarios,
};
