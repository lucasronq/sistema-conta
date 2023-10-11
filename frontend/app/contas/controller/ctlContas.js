const axios = require("axios");

//@ Abre o formulário de manutenção de contas
const getAllContas = (req, res) =>
  (async () => {
    token = req.session.token;
    try {
      resp = await axios.get(process.env.SERVIDOR_DW3 + "/contas", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      //console.log("[ctlLogin.js] Valor resp:", resp.data);
      res.render("contas/view_manutencao", {
        title: "Manutenção de contas",
        data: { registro: resp.data.result },
      });
    } catch (erro) {
      console.log("[ctlContas.js|getAllContas] Try Catch:Erro de requisição");
    }
  })();

//@ Abre formulário de cadastro de contas
const insertConta = (req, res) =>
  (async () => {
    var oper = "";
    userName = req.session.userName;
    token = req.session.token;
    try {
      if (req.method == "GET") {
        oper = "c";
        res.render("contas/view_cadContas", {
          title: "Cadastro de contas",
          oper: oper,
          userName: userName,
        });
      }
    } catch (erro) {
      console.log(
        "[ctlUsuario.js|insertUsuario] Try Catch: Erro não identificado",
        erro
      );
    }
  })();

//@ Função para validar campos no formulário
function validateForm(regFormPar) {
  if (regFormPar.contasid == "") {
    regFormPar.contasid = 0;
  } else {
    regFormPar.contasid = parseInt(regFormPar.contasid);
  }

  regFormPar.deleted = regFormPar.deleted === "true"; //converte para true ou false um check componet

  return regFormPar;
}

//@ Abre formulário de cadastro de contas
const openContasUpdate = (req, res) =>
  (async () => {
    var oper = "";
    userName = req.session.userName;
    token = req.session.token;
    try {
      if (req.method == "GET") {
        oper = "u";
        const id = req.params.id;
        parseInt(id);
        res.render("contas/view_cadContas", {
          title: "Cadastro de contas",
          oper: oper,
          idBusca: id,
          userName: userName,
        });
      }
    } catch (erro) {
      console.log(
        "[ctlUsuario.js|insertUsuario] Try Catch: Erro não identificado",
        erro
      );
    }
  })();


//@ Recupera os dados dos contas
const getDados = (req, res) =>
  (async () => {
    const idBusca = req.body.idBusca;
    parseInt(idBusca);
    console.log("[ctlContas.js|getDados] valor id :", idBusca);
    try {
      resp = await axios.post(
        process.env.SERVIDOR_DW3 + "/GetContasByID",
        {
          contasid: idBusca,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      if (resp.data.status == "ok") {
        res.json({ status: "ok", registro: resp.data.registro[0] });
      }
    } catch (error) {
      console.log(
        "[ctlContas.js|getDados] Try Catch: Erro não identificado",
        erro
      );
    }

  })();

//@ Realiza inserção de contas
const openContasInsert = (req, res) =>
  (async () => {
    token = req.session.token;
    try {
      if (req.method == "POST") {
        const regPost = validateForm(req.body);
        regPost.contasid = 0;
        const resp = await axios.post(
          process.env.SERVIDOR_DW3 + "/conta",
          regPost,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        if (resp.data.status == "ok") {
          res.json({ status: "ok", mensagem: "Contas inserido com sucesso!" });
        } else {
          res.json({ status: "erro", mensagem: "Erro ao inserir conta!" });
        }
      }
      res.render('contas/view_cadContas', { title: 'Cadastro de contas', oper: "c" });
    } catch (erro) {
      console.log(
        "[ctlUsuario.js|insertUsuario] Try Catch: Erro não identificado",
        erro
      );
    }
  })();



//@ Realiza atualização de contas
///@ console.log("[ctlUsuarios.js|updateContas] Valor regPost: ", regPost);
const updateContas = (req, res) =>
  (async () => {
    token = req.session.token;
    try {
      if (req.method == "POST") {
        const regPost = validateForm(req.body);
        const resp = await axios.post(
          process.env.SERVIDOR_DW3 + "/UpdateContas",
          regPost,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        if (resp.data.status == "ok") {
          res.json({ status: "ok", mensagem: "Contas atualizado com sucesso!" });
        } else {
          res.json({ status: "erro", mensagem: "Erro ao atualizar conta!" });
        }
      }
    } catch (erro) {
      console.log(
        "[ctlUsuarios.js|updateContas] Try Catch: Erro não identificado.",
        erro
      );
    }
  })();

//@ Realiza remoção soft de contas
//@ "[ctlUsuarios.js|deleteContas] Try Catch: Erro não identificado", erro);
const deleteContas = (req, res) =>
  (async () => {
    token = req.session.token;
    try {
      if (req.method == "POST") {
        const regPost = validateForm(req.body);
        regPost.contaid = parseInt(regPost.contaid);
        const resp = await axios.post(
          process.env.SERVIDOR_DW3 + "/DeleteContas",
          {
            contaid: regPost.contaid,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        if (resp.data.status == "ok") {
          res.json({ status: "ok", mensagem: "Contas removido com sucesso!" });
        } else {
          res.json({ status: "erro", mensagem: "Erro ao remover conta!" });
        }
      }
    } catch (erro) {
      console.log(
        "[ctlUsuarios.js|deleteContas] Try Catch: Erro não identificado", erro);
    }
  })();
module.exports = {
  getAllContas,
  insertConta,
  openContasInsert,
  openContasUpdate,
  getDados,
  updateContas,
  deleteContas,
};
