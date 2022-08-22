module.exports = (app) => {
  const tiket = require("../controllers/tiket.controller.js");
  var router = require("express").Router();
  // const bodyParser = require('body-parser');

  router.get("/:bagian/:startDate/:endDate", tiket.getAll)
  
  router.get("/closedTicketLastWeek", tiket.closedTicketLastWeek);

  router.get("/performaKanca/:bagian/:startDate/:endDate", tiket.performaKanca);

  router.get("/performaImplementor/:bagian/:startDate/:endDate", tiket.performaImpementor);

  router.get("/perTanggal/:bagian", tiket.perTanggal);

  router.get("/perJenisMasalah/:bagian/:startDate/:endDate", tiket.perJenisMasalah);

  router.get("/perMinggu", tiket.perMinggu);

  router.get("/perBagian", tiket.perBagian);

  router.get("/jenisTiket", tiket.jenisTiket)

  router.get("/terlambat/:bagian", tiket.terlambat);

  router.post("/login", tiket.login);
  
  app.use("/api/tiket", router);
};