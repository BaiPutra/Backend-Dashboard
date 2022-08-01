const Tiket = require("../models/tiket.js");

exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  // Create a Ticket
  const tiket = new Tiket({
    ticket_id: req.body.ticket_id,
    merchant: req.body.merchant,
    mid: req.body.mid,
    tid: req.body.tid,
    peruntukan: req.body.peruntukan,
    entry_ticket: req.body.entry_ticket,
    update_ticket: req.body.update_ticket,
    jenis_masalah: req.body.jenis_masalah,
    status: req.body.status,
    kanwil: req.body.kanwil,
    pemasang: req.body.pemasang,
    target_hari: req.body.target_hari,
  });
  // Save Ticket in the database
  Tiket.create(tiket, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the tickets.",
      });
    else res.send(data);
  });
};

exports.getAll = (req, res) => {
  const ticketID = req.query.ticketID;
  Tiket.getAll(ticketID, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving tickets",
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

exports.performaKanca = (req, res) => {
  Tiket.performaKanca((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred",
      });
    else res.send(data);
  });
};

exports.perBagian = (req, res) => {
  Tiket.perBagian((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred",
      });
    else res.send(data);
  });
};