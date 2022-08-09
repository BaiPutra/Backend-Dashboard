const Tiket = require("../models/tiket.js");

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

exports.closedTicketLastWeek = (req, res) => {
  Tiket.closedTicketLastWeek((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred",
      });
    else res.send(data);
  });
};

exports.performaPemasang = (req, res) => {
  Tiket.performaPemasang((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred",
      });
    else res.send(data);
  });
};

exports.perJenisMasalah = (req, res) => {
  Tiket.perJenisMasalah((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred",
      });
    else res.send(data);
  });
};

exports.perTanggal = (req, res) => {
  Tiket.perTanggal((err, data) => {
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

exports.jenisTiket = (req, res) => {
  Tiket.jenisTiket((err, data) => {
    if (err)
      res.status(500).send({
        message:err.message || "Some error occured",
      })
    else res.send(data);
  })
}