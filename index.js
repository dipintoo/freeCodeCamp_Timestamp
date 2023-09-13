// Inisialisasi
const express = require('express');
const app = express();

// Aktifkan CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// sehingga API Anda dapat diuji dari jarak jauh oleh FCC
const cors = require('cors');

// beberapa browser lama mengalami masalah pada kode status 204
app.use(cors({ optionsSuccessStatus: 200 })); 

// http://expressjs.com/en/starter/static-files.html
// Mengaktifkan server untuk menyajikan file statis yang ada di folder 'public'
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
// Mengatur routing dasar untuk URL root ("/") dan mengirimkan file HTML
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// Membuat fungsi untuk memeriksa apakah tanggal valid atau tidak
const isInvalidDate = (date) => date.toUTCString() === "Invalid Date"

// Meminta respon dengan input param setelah "/api"
app.get("/api/:date", function (req, res) {
  let input = req.params.date;
  let date;
  
  // Memeriksa apakah input mengandung karakter selain angka (misalnya, "2022-09"),
  if (/\D/.test(input)) {
    // Jika inputnya angka, anggap sebagai jumlah milidetik sejak Epoch Unix.
    date = new Date(input);
  } else {
    // Jika input bukan angka, interpretasikan sebagai tanggal lengkap.
    date = new Date (+input)
  }

  // Memeriksa apakah objek date merupakan tanggal yang valid.
  if (isInvalidDate(date)) {
    // Jika tidak valid, mengirimkan pesan kesalahan sebagai respons JSON.
    res.json({ error: "Invalid Date" });
    return;
  }

  // Jika valid, mengirimkan respons JSON dengan timestamp Unix dan format UTC.
  res.json({
    unix: date.getTime(),
    utc: date.toUTCString()
  });
});

// Meminta respon dengan tanpa input param setelah "/api"
app.get("/api", (req, res) => {
  // Mengirim respons JSON dengan timestamp Unix dan format UTC saat ini.
  res.json({
    unix: new Date().getTime(),
    utc: new Date().toUTCString()
  })
})

// Mendengarkan permintaan pada port yang ditentukan oleh lingkungan
var listener = app.listen(process.env.PORT, function () {
  console.log('Aplikasi Anda mendengarkan di port ' + listener.address().port);
});
