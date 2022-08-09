module.exports = (app) => {
  const tiket = require("../controllers/tiket.controller.js");
  var router = require("express").Router();

  // router.get("/", tiket.getAll)

  router.get(`/:bagian/:startDate/:endDate`, tiket.getAll)
  
  router.get("/closedTicketLastWeek", tiket.closedTicketLastWeek);

  router.get("/performaKanca/:bagian", tiket.performaKanca);

  router.get("/performaPemasang", tiket.performaPemasang);

  router.get("/perJenisMasalah", tiket.perJenisMasalah);

  router.get("/perTanggal", tiket.perTanggal);

  router.get("/perMinggu", tiket.perMinggu);

  router.get("/perBagian", tiket.perBagian);

  router.get("/jenisTiket", tiket.jenisTiket)
  
  app.use("/api/tiket", router);
};