const Tiket = require("../models/tiket.js");

exports.login = (req, res) => {
  // console.log(req);
  Tiket.login(req, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving tickets",
      });
    else res.send(data);
  });
  // res.send("test")
}

exports.getAll = (req, res) => {
  Tiket.getAll(req, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving tickets",
      });
    else res.send(data);
  });
};

exports.performaKanca = (req, res) => {
  Tiket.performaKanca(req, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred",
      });
    else res.send(data);
  });
};

exports.performaImpementor = (req, res) => {
  Tiket.performaImplementor(req, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred",
      });
    else res.send(data);
  });
};

exports.perTanggal = (req, res) => {
  Tiket.perTanggal(req, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred",
      });
    else res.send(data);
  });
};

exports.perJenisMasalah = (req, res) => {
  Tiket.perJenisMasalah(req, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred",
      });
    else res.send(data);
  });
};

exports.perMinggu = (req, res) => {
  Tiket.perMinggu((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occured",
      })
    else res.send(data)
  })
}

exports.perBagian = (req, res) => {
  Tiket.perBagian((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred",
      });
    else res.send(data);
  });
};

exports.terlambat = (req, res) => {
  Tiket.terlambat(req, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving tickets",
      });
    else res.send(data);
  });
};