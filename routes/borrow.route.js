/** memuat pustaka ekspres */
const express = require (`express`)

/** menginisiasi objek yang merupakan instance dari express */
const app = express()

/** izinkan untuk membaca `permintaan` dengan tipe json */
app.use(express.json())

/** memuat kontroler pinjam */
const borrowController = require(`../controllers/borrow.controller`)
// const borrow = require(`../models/borrow`)

/** membuat rute untuk mendapatkan semua buku yang dipinjam */
app.get("/", borrowController.getBorrow) 

/** membuat rute untuk menambah buku peminjaman baru */
app.post("/", borrowController.addBorrowing)

/** buat rute untuk update buku pinjaman berdasarkan ID */
app.put("/:id", borrowController.updateBorrowing)

/** membuat rute untuk menghapus buku pinjaman berdasarkan ID */
app.delete("/:id", borrowController.deleteBorrowing)

/** membuat rute untuk mengembalikan buku */
app.get("/return/:id", borrowController.returnBook)

/** membuat rute untuk memfilter data berdasarkan member */
app.post("/find", borrowController.findBorrow)

/** ekspor aplikasi untuk dimuat di file lain */
module.exports = app
