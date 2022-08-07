module.exports = (app) => {
  const tiket = require("../controllers/tiket.controller.js");
  var router = require("express").Router();
  
  router.post("/", tiket.create);

  // router.get("/", tiket.getAll)

  router.get(`/:startDate/:endDate`, tiket.getAll)
  
  router.get("/closedTicketLastWeek", tiket.closedTicketLastWeek);

  router.get("/performaPemasang", tiket.performaPemasang);

  router.get("/perJenisMasalah", tiket.perJenisMasalah);

  router.get("/perTanggal", tiket.perTanggal);

  router.get("/perMinggu", tiket.perMinggu);

  router.get("/performaKanca", tiket.performaKanca);

  router.get("/perBagian", tiket.perBagian);

  router.get("/jenisTiket", tiket.jenisTiket)
  
  app.use("/api/tiket", router);
};