// const { request } = require("../routes/member.route")

/** memuat model untuk tabel 'pinjam' */
const borrowModel = require(`../models/index`).borrow

/** memuat model untuk tabel `detail_of_borrow` */
const detailsOfBorrowModel = require(`../models/index`).details_of_borrow

const memberModel = require(`../models/index`).member

/** memuat formulir Operator Sequalize */
const Op = require(`sequelize`).Op

/** buat fungsi untuk menambah peminjaman buku */
exports.addBorrowing = async (request, response) => {
    /** menyiapkan data untuk tabel peminjam */
    let newData = {
        memberID: request.body.memberID,
        adminID: request.body.adminID,
        date_of_borrow: request.body.date_of_borrow,
        date_of_return: request.body.date_of_return,
        status: request.body.status
    }
  
    /** eksekusi untuk insert ke tabel borrow */
    borrowModel.create(newData)
        .then(result => {
            /** dapatkan id peminjaman buku terbaru */
            let borrowID = result.id

            /** menyimpan detail peminjaman buku dari permintaan
              * (ketik: objek array)
              */

            let detailsOfBorrow = request.body.detail_of_borrow

            /** sisipkan borrowID ke setiap item detailOfBorrow */

            for (let i = 0; i < detailsOfBorrow.length; i++) {
                detailsOfBorrow[i].borrowID = borrowID
            }

            /** masukkan semua data detailOfBorrow */
            detailsOfBorrowModel.bulkCreate(detailsOfBorrow)
                .then(result => {
                    return response.json({
                        success: true,
                        message: `New Book Borrowed has been inserted`
                    })
                })
                .catch(error => {
                    return response.json({
                        success: false,
                        message: error.message
                    })
                })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })

}

/** buat fungsi untuk memperbarui peminjaman buku */
exports.updateBorrowing = async (request, response) => {
    /** menyiapkan data untuk tabel peminjam */
    let newData = {
        memberID: request.body.memberID,
        adminID: request.body.adminID,
        date_of_borrow: request.body.date_of_borrow,
        date_of_return: request.body.date_of_return,
        status: request.body.status
    }

    /** menyiapkan parameter Pinjam ID */
    let borrowID = request.params.id

    /** eksekusi untuk insert ke tabel borrow */
    borrowModel.update(newData, { where: { id: borrowID } })
        .then(async result => {

            /** hapus semua detailDariBorrow berdasarkan borrowID */
            await detailsOfBorrowModel.destroy(
                { where: { borrowID: borrowID } }
            )

            /** menyimpan detail peminjaman buku dari permintaan 
            * (tipe: objek array) 
            */

            let detailsOfBorrow = request.body.details_of_borrow

            /** sisipkan borrowID ke setiap item detailOfBorrow */

            for (let i = 0; i < detailsOfBorrow.length; i++) {
                detailsOfBorrow[i].borrowID = borrowID
            }

            /** masukkan kembali semua data detailOfBorrow */
            detailsOfBorrowModel.bulkCreate(detailsOfBorrow)
                .then(result => {
                    return response.json({
                        success: true,
                        message: `Book Borrowed has been updated`
                    })
                })
                .catch(error => {
                    return response.json({
                        success: false,
                        message: error.message,
                    })
                })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message,

            })
        })

}

/** buat fungsi untuk menghapus data peminjaman buku */
exports.deleteBorrowing = async (request, response) => {
    /** siapkan borrowID yang akan dihapus sebagai parameter */
    let borrowID = request.params.id

    /** hapus detailDariBorrow menggunakan model */
    detailsOfBorrowModel.destroy(
        { where: { borrowID: borrowID } }
    )

        .then(result => {
            /** hapus data peminjam menggunakan model */
            borrowModel.destroy({ where: { id: borrowID } })
                .then(result => {
                    return response.json({
                        success: true,
                        message: `Borrowing Book's has deleted`
                    })
                })
                .catch(error => {
                    return response.json({
                        success: false,
                        message: error.message
                    })
                })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
}

/** membuat fungsi untuk mengembalikan buku yang dipinjam */
exports.returnBook = async (request, response) => {
    /** siapkan borrowId yang akan dikembalikan */
    let borrowID = request.params.id

    /** mempersiapkan waktu saat ini untuk waktu pengembalian */
    let today = new Date()
    let currentDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`

    /** update status dan date_of_return dari data borrow */
    borrowModel.update(
        {
            date_of_return: currentDate,
            status: true
        },
        {
            where: { id: borrowID }
        }
    )
        .then(result => {
            return response.json({
                success: true,
                message: `Book has been returned`
            })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
}

/** buat fungsi untuk mendapatkan semua data peminjaman */
exports.getBorrow = async (request, response) => {
    let data = await borrowModel.findAll({
            include: [
                `member`, `admin`,  
                {
                    model: detailsOfBorrowModel,
                    as: `details_of_borrow`,
                    include: [`book`]
                }
            ]
        }
    )
    return response.json({
        success: true,
        data: data,
        message: `All borrowing book have been loaded`
    })
}

/** buat fungsi untuk memfilter data peminjaman berdasarkan member*/
exports.findBorrow = async (request, response) => {
    let keyword = request.body.keyword
    let data = await borrowModel.findAll(
        {
            include: [
                `admin`,
                {
                    model: memberModel,
                    as: `member`,
                    where: {
                        [Op.or]: [
                            { name: { [Op.substring]: keyword } }
                        ]
                    }
                },
                {
                    model: detailsOfBorrowModel,
                    as: `details_of_borrow`,
                    include: ["book"]
                }
            ]
        }
    )
    return response.json({
        success: true,
        data: data,
        message: `All borrowing book have been loaded`
    })
}