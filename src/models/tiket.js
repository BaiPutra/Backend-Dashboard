const { query } = require("express");
const sql = require("./db.js");

const Tiket = function (Tiket) {
  this.tiketID = Tiket.tiketID;
  this.tid = Tiket.tid;
  this.bagian = Tiket.bagian;
  this.lokasi = Tiket.lokasi;
  this.jenisMasalah = Tiket.jenisMasalah;
  this.pemasang = Tiket.pemasang;
  this.entryTiket = Tiket.entryTiket;
  this.updateTiket = Tiket.updateTiket;
  this.status = Tiket.status;
  this.eskalasi = Tiket.eskalasi;
  this.target_hari = Tiket.target_hari;
  this.nama_pemasang = Tiket.nama_pemasang;
};

Tiket.create = (newTiket, result) => {
  sql.query("INSERT INTO tiket SET ?", Tiket, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("created Tiket: ", { id: res.insertId, ...newTiket });
    result(null, { id: res.insertId, ...newTiket });
  });
};

Tiket.getAll = (tiketID, result) => {
  let query = "SELECT * FROM tiket";
  if (tiketID) {
    query += ` WHERE tiketID LIKE '${tiketID}%'`;
  }
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
  const sqlQuery = `
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
  sql.query(sqlQuery, (err, res) => {
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

Tiket.performaPemasang = (result) => {
  let query = `
    SELECT i.nama, SUM(a.targetIn) + SUM(a.targetOut) AS total,
    SUM(a.targetIn) AS targetIn, SUM(a.targetOut) AS targetOut,
    ROUND((SUM(a.targetIn) / ((SUM(a.targetIn) + SUM(a.targetOut)))*100), 2)
    AS rateTarget
    FROM (
    SELECT t.tid, COUNT(1) AS tiket_close,
      COUNT(CASE WHEN DATEDIFF(updateTiket, entryTiket) <= j.targetHari THEN 1 ELSE null END) AS targetIn,
      COUNT(CASE WHEN DATEDIFF(updateTiket, entryTiket) > j.targetHari THEN 1 ELSE null END) AS targetOut
      FROM tiket t JOIN jenistiket j
      ON t.jenisMasalah = j.jenisID
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
    console.log("list pemasang: ", res);
    result(null, res);
  });
};

Tiket.perJenisMasalah = (result) => {
  const sqlQuery = `
    SELECT j.jenisMasalah AS id, COUNT(1) AS tiketClose,
    COUNT(CASE WHEN DATEDIFF(updateTiket, entryTiket) <= j.targetHari THEN 1 ELSE null END) AS targetIn,
    COUNT(CASE WHEN DATEDIFF(updateTiket, entryTiket) > j.targetHari THEN 1 ELSE null END) AS targetOut,
    ROUND(
        COUNT(CASE WHEN DATEDIFF(updateTiket, entryTiket) <= j.targetHari THEN 1 ELSE null END) / COUNT(1) * 100, 2)
        AS rateTarget
    FROM tiket t JOIN jenistiket j
    ON t.jenisMasalah = j.jenisID
    WHERE t.tiketID LIKE '6%'
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

Tiket.perTanggal = (result) => {
  const sqlQuery = `
    SELECT DATE_FORMAT(updateTiket, '%m/%d/%y') AS id, COUNT(1) AS tiketClose,
    COUNT(CASE WHEN DATEDIFF(updateTiket, entryTiket) <= j.targetHari THEN 1 ELSE null END) AS targetIn,
    COUNT(CASE WHEN DATEDIFF(updateTiket, entryTiket) > j.targetHari THEN 1 ELSE null END) AS targetOut,
    ROUND(
        COUNT(CASE WHEN DATEDIFF(updateTiket, entryTiket) <= j.targetHari THEN 1 ELSE null END) / COUNT(1) * 100, 2) 
        AS rateTarget
    FROM tiket t JOIN jenistiket j
    ON t.jenisMasalah = j.jenisID
    WHERE updateTiket BETWEEN DATE_SUB(NOW(), INTERVAL 1 WEEK) AND NOW()
    GROUP BY updateTiket ORDER BY updateTiket ASC;
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
    COUNT(
      CASE WHEN bagian = 'CRM' THEN 1 ELSE null END) AS crm,
    COUNT(
      CASE WHEN bagian = 'EDC' THEN 1 ELSE null END) AS edc,
    COUNT(updateTiket) AS total
    FROM tiket t JOIN perangkat p
    ON t.tid = p.tid
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

Tiket.performaKanca = (result) => {
  let query = `
    SELECT k.nama AS id, SUM(a.targetIn) + SUM(a.targetOut) AS total,
    SUM(a.targetIn) AS targetIn, SUM(a.targetOut) AS targetOut,
    ROUND((SUM(a.targetIn) / ((SUM(a.targetIn) + SUM(a.targetOut)))*100), 2)
    AS rateTarget
    FROM (
    SELECT t.tid, COUNT(1) AS tiket_close,
      COUNT(CASE WHEN DATEDIFF(updateTiket, entryTiket) <= j.targetHari THEN 1 ELSE null END) AS targetIn,
      COUNT(CASE WHEN DATEDIFF(updateTiket, entryTiket) > j.targetHari THEN 1 ELSE null END) AS targetOut
      FROM tiket t JOIN jenistiket j
      ON t.jenisMasalah = j.jenisID
      GROUP BY t.tid ORDER BY tiket_close DESC ) a
    JOIN perangkat b ON a.tid = b.tid
    JOIN kanca k ON b.kancaID = k.kancaID
    GROUP BY k.kancaID ORDER BY total DESC
    LIMIT 10
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

// query perBagian

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

module.exports = Tiket;
