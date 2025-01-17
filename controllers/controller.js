const db = require("../models/db.js");
const Transaction = require("../models/TransactionModel.js");

const controller = {
  getFavicon: function (req, res) {
    res.status(204);
  },

  /*
    TODO:   This function is executed when the client sends an HTTP GET
            request to path `/`. This displays `index.hbs` with all
            transactions currently stored in the database.
    */
  getIndex: function (req, res) {
    async function getTransactions() {
      db.findMany(Transaction, {}, "name refno amount", (transactions) => {
        res.render("index", { transactions });
      });
    }

    getTransactions();
  },

  /*
        TODO:   This function is executed when the client sends an HTTP GET
                request to path `/getCheckRefNo`. This function checks if a
            specific reference number is stored in the database. If the number
            is stored in the database, it returns an object containing the
            reference number, otherwise, it returns an empty string.
    */
  getCheckRefNo: function (req, res) {
    const { refno } = req.query;

    db.findOne(Transaction, { refno }, "refno", (account) =>
      account ? res.sendStatus(409) : res.sendStatus(200)
    );
  },

  /*
    TODO:   This function is executed when the client sends an HTTP GET
            request to path `/getAdd`. This function adds the transaction
            sent by the client to the database, then appends the new
            transaction to the list of transactions in `index.hbs`.
    */
  getAdd: function (req, res) {
    const { name, refno, amount } = req.query;

    db.insertOne(
      Transaction,
      {
        name,
        refno,
        amount,
      },
      (success, error) => {
        if (error) {
          res.sendStatus(500);
        }
        res.sendStatus(200);
      }
    );
  },

  /*
    TODO:   This function is executed when the client sends an HTTP GET
            request to path `/getDelete`. This function deletes the transaction
            from the database, then removes the transaction from the list of
            transactions in `index.hbs`.
    */
  getDelete: function (req, res) {
    const { refno } = req.query;

    db.deleteOne(
      Transaction,
      {
        refno,
      },
      (success, error) => {
        if (error) {
          res.sendStatus(403);
        }

        res.sendStatus(200);
      }
    );
  },
};

module.exports = controller;
