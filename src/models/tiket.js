const { query, request } = require("express");
const sql = require("./db.js");
// const bodyParser = require("body-parser");
// app.use(bodyParser.urlencoded({ extended: true }));

const Tiket = function (Tiket) {
  this.tiketID = Tiket.tiketID;
  this.tid = Tiket.tid;
  this.bagian = Tiket.bagian;
  this.lokasi = Tiket.lokasi;
  this.jenisMasalah = Tiket.jenisMasalah;
  this.implementor = Tiket.implementor;
  this.entryTiket = Tiket.entryTiket;
  this.updateTiket = Tiket.updateTiket;
  this.status = Tiket.status;
  this.eskalasi = Tiket.eskalasi;
  this.target_hari = Tiket.target_hari;
  this.nama_pemasang = Tiket.nama_pemasang;
};

Tiket.login = (request, result) => {
  let query = `SELECT * FROM user WHERE username = '${request.body.username}' AND password = '${request.body.password}'`;
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error ", err);
      result(err, null);
      return;
    }
    console.log("message: ", res);
    result(null, res);
  });
};

Tiket.getAll = (request, result) => {
  let query = `
    SELECT t.tiketID AS id, a.tid, a.bagian, j.jenisMasalah, t.peruntukan, a.lokasi, a.nama AS kanca, DATE_FORMAT(entryTiket, '%e %M %Y') AS entryTiket, DATE_FORMAT(updateTiket, '%e %M %Y') AS updateTiket,
    COUNT(CASE WHEN DATEDIFF(updateTiket, entryTiket) <= j.targetHari THEN 1 ELSE null END) AS targetIn,
    COUNT(CASE WHEN DATEDIFF(updateTiket, entryTiket) > j.targetHari THEN 1 ELSE null END) AS targetOut
    FROM (
      SELECT b.tid, b.bagian, b.lokasi, k.nama
      FROM perangkat b JOIN kanca k 
      ON b.kancaID = k.kancaID
      ) a
    JOIN tiket t
    ON t.tid = a.tid
    JOIN jenistiket j
    ON t.jenisMasalah = j.jenisID
    WHERE a.bagian IN (${request.params.bagian}) AND updateTiket BETWEEN '${request.params.startDate}' AND '${request.params.endDate}'
    GROUP BY t.tiketID
  `;
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error ", err);
      result(err, null);
      return;
    }
    console.log("tiket: ", res);
    result(null, res);
  });
};

Tiket.closedTicketLastWeek = (result) => {
  const query = `
    SELECT COUNT(1) AS tiket_selesai, 
    COUNT(CASE WHEN DATEDIFF(updateTiket, entryTiket) <= j.targetHari THEN 1 ELSE null END) AS targetIn,
    COUNT(CASE WHEN DATEDIFF(updateTiket, entryTiket) > j.targetHari THEN 1 ELSE null END) AS targetOut,
    ROUND(
      COUNT(
        CASE WHEN DATEDIFF(updateTiket, entryTiket) <= j.targetHari THEN 1 ELSE null END) / COUNT(1) * 100, 2) AS rate_target
    FROM (
    tiket t JOIN jenistiket j
    ON t.jenisMasalah = j.jenisID )
  `;
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.length) {
      console.log("found tiket: ", res);
      result(null, res[0]);
      return;
    }
    result({ kind: "not_found" }, null);
  });
};

Tiket.performaKanca = (request, result) => {
  let query = `
    SELECT ROW_NUMBER() OVER(ORDER BY total DESC) AS id, k.nama AS nama, SUM(a.targetIn) + SUM(a.targetOut) AS total,
    SUM(a.targetIn) AS targetIn, SUM(a.targetOut) AS targetOut,
    ROUND((SUM(a.targetIn) / ((SUM(a.targetIn) + SUM(a.targetOut)))*100), 2)
    AS rateTarget
    FROM (
    SELECT t.tid, COUNT(1) AS tiket_close,
      COUNT(CASE WHEN DATEDIFF(updateTiket, entryTiket) <= j.targetHari THEN 1 ELSE null END) AS targetIn,
      COUNT(CASE WHEN DATEDIFF(updateTiket, entryTiket) > j.targetHari THEN 1 ELSE null END) AS targetOut
      FROM tiket t JOIN jenistiket j
      ON t.jenisMasalah = j.jenisID
      JOIN perangkat p
      ON t.tid = p.tid
      WHERE bagian IN (${request.params.bagian}) AND updateTiket BETWEEN '${request.params.startDate}' AND '${request.params.endDate}'
      GROUP BY t.tid ORDER BY tiket_close DESC ) a
    JOIN perangkat b ON a.tid = b.tid
    JOIN kanca k ON b.kancaID = k.kancaID
    GROUP BY k.kancaID ORDER BY total DESC
    `;
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("list kanca: ", res);
    result(null, res);
  });
};

Tiket.performaImplementor = (request, result) => {
  let query = `
    SELECT ROW_NUMBER() OVER(ORDER BY total DESC) AS id, i.nama, SUM(a.targetIn) + SUM(a.targetOut) AS total,
    SUM(a.targetIn) AS targetIn, SUM(a.targetOut) AS targetOut,
    ROUND((SUM(a.targetIn) / ((SUM(a.targetIn) + SUM(a.targetOut)))*100), 2)
    AS rateTarget
    FROM (
    SELECT t.tid, COUNT(1) AS tiket_close,
      COUNT(CASE WHEN DATEDIFF(updateTiket, entryTiket) <= j.targetHari THEN 1 ELSE null END) AS targetIn,
      COUNT(CASE WHEN DATEDIFF(updateTiket, entryTiket) > j.targetHari THEN 1 ELSE null END) AS targetOut
      FROM tiket t JOIN jenistiket j
      ON t.jenisMasalah = j.jenisID
      JOIN perangkat p
      ON t.tid = p.tid
      WHERE bagian IN (${request.params.bagian}) AND updateTiket BETWEEN '${request.params.startDate}' AND '${request.params.endDate}'
      GROUP BY t.tid ORDER BY tiket_close DESC ) a
    JOIN perangkat b ON a.tid = b.tid
    JOIN implementor i ON b.implementorID = i.implementorID
    GROUP BY b.implementorID ORDER BY total DESC
    `;
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("list implementor: ", res);
    result(null, res);
  });
};

Tiket.perJenisMasalah = (request, result) => {
  const sqlQuery = `
    SELECT ROW_NUMBER() OVER(ORDER BY tiketClose DESC) AS id, j.jenisMasalah AS nama, COUNT(1) AS tiketClose,
    COUNT(CASE WHEN DATEDIFF(updateTiket, entryTiket) <= j.targetHari THEN 1 ELSE null END) AS targetIn,
    COUNT(CASE WHEN DATEDIFF(updateTiket, entryTiket) > j.targetHari THEN 1 ELSE null END) AS targetOut,
    ROUND(
        COUNT(CASE WHEN DATEDIFF(updateTiket, entryTiket) <= j.targetHari THEN 1 ELSE null END) / COUNT(1) * 100, 2)
        AS rateTarget
    FROM tiket t JOIN jenistiket j
    ON t.jenisMasalah = j.jenisID
    JOIN perangkat p
    ON t.tid = p.tid
    WHERE bagian IN (${request.params.bagian}) AND updateTiket BETWEEN '${request.params.startDate}' AND '${request.params.endDate}'
    GROUP BY j.jenisMasalah ORDER BY tiketClose DESC;
    `;
  sql.query(sqlQuery, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.length) {
      console.log("found tiket: ", res);
      result(null, res);
      return;
    }
    result({ kind: "not_found" }, null);
  });
};

Tiket.perTanggal = (request, result) => {
  const sqlQuery = `
    SELECT ROW_NUMBER() OVER(ORDER BY updateTiket DESC) AS id, DATE_FORMAT(updateTiket, '%e %M %Y') AS tanggal, COUNT(1) AS tiketClose,
    COUNT(CASE WHEN DATEDIFF(updateTiket, entryTiket) <= j.targetHari THEN 1 ELSE null END) AS targetIn,
    COUNT(CASE WHEN DATEDIFF(updateTiket, entryTiket) > j.targetHari THEN 1 ELSE null END) AS targetOut,
    ROUND(
        COUNT(CASE WHEN DATEDIFF(updateTiket, entryTiket) <= j.targetHari THEN 1 ELSE null END) / COUNT(1) * 100, 2) 
        AS rateTarget
    FROM tiket t JOIN jenistiket j
    ON t.jenisMasalah = j.jenisID
    JOIN perangkat p
    ON t.tid = p.tid
    WHERE bagian IN (${request.params.bagian}) AND updateTiket BETWEEN DATE_SUB(NOW(), INTERVAL 1 WEEK) AND NOW()
    GROUP BY updateTiket ORDER BY updateTiket DESC;
    `;
  sql.query(sqlQuery, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.length) {
      console.log("found tiket: ", res);
      result(null, res);
      return;
    }
    result({ kind: "not_found" }, null);
  });
};

Tiket.perMinggu = (result) => {
  const query = `
    SELECT DATE_FORMAT(updateTiket, '%m/%d/%y') AS dari, MAX(DATE_FORMAT(updateTiket, '%m/%d/%y')) AS sampai,
    COUNT(
      CASE WHEN bagian = 'ATM' THEN 1 ELSE null END) AS atm,
    COUNT(CASE WHEN DATEDIFF(updateTiket, entryTiket) <= j.targetHari AND bagian = 'ATM' THEN 1 ELSE null END) AS targetInATM,
    COUNT(
      CASE WHEN bagian = 'CRM' THEN 1 ELSE null END) AS crm,
    COUNT(CASE WHEN DATEDIFF(updateTiket, entryTiket) <= j.targetHari AND bagian = 'CRM' THEN 1 ELSE null END) AS targetInCRM,
    COUNT(
      CASE WHEN bagian = 'EDC' THEN 1 ELSE null END) AS edc,
    COUNT(CASE WHEN DATEDIFF(updateTiket, entryTiket) <= j.targetHari AND bagian = 'EDC' THEN 1 ELSE null END) AS targetInEDC,
    COUNT(updateTiket) AS total,
    COUNT(CASE WHEN DATEDIFF(updateTiket, entryTiket) <= j.targetHari THEN 1 ELSE null END) AS targetIn
    FROM tiket t JOIN perangkat p
    ON t.tid = p.tid
    JOIN jenistiket j
    ON t.jenisMasalah = j.jenisID
    WHERE updateTiket > DATE_SUB(NOW(), INTERVAL 5 WEEK)
    GROUP BY WEEK(updateTiket)
    ORDER BY updateTiket;
    `;
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.length) {
      console.log("foung ticket: ", res);
      result(null, res);
      return;
    }
    result({ kind: "nout_found" }, null);
  });
};

Tiket.perBagian = (result) => {
  let query = `
    SELECT p.bagian, COUNT(1) AS tiket_close,
    COUNT(CASE WHEN DATEDIFF(updateTiket, entryTiket) <= j.targetHari THEN 1 ELSE null END) AS targetIn,
    COUNT(CASE WHEN DATEDIFF(updateTiket, entryTiket) > j.targetHari THEN 1 ELSE null END) AS targetOut,
    ROUND(
      COUNT(CASE WHEN DATEDIFF(updateTiket, entryTiket) <= j.targetHari THEN 1 ELSE null END) / COUNT(1) * 100, 2)
      AS rate_target
    FROM tiket t JOIN jenistiket j
    ON t.jenisMasalah = j.jenisID
    JOIN perangkat p ON t.tid = p.tid
    GROUP BY p.bagian ORDER BY tiket_close DESC;
    `;
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("bagian: ", res);
    result(null, res);
  });
};

Tiket.jenisTiket = (result) => {
  let query = `
    SELECT ROW_NUMBER() OVER() AS id, jenisMasalah, targetHari 
    FROM jenistiket 
    WHERE targetHari >=0 AND jenisID < 18
    `;
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("bagian: ", res);
    result(null, res);
  });
};

Tiket.peruntukan = (request, result) => {
  let query = `
    SELECT peruntukan, COUNT(tiketID) AS total
    FROM tiket 
    WHERE peruntukan != ''
    GROUP BY peruntukan
    `;
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("bagian: ", res);
    result(null, res);
  });
};

module.exports = Tiket;
