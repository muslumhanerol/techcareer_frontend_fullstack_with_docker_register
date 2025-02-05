const mongoose = require("mongoose");
//mongoose kütüphanesini import ettim, kullandım.


// Schema adından (RegisterPostSchema)
const RegisterPostSchema = new mongoose.Schema({
    // 1.YOL (USERNAME)
    //username: String,

    // 2.YOL (USERNAME)
    username: {
        type: String,
        required: [true, " User Name Başlığı için gereklidir"],
        trim: true, //Başta ve sonda boşluk varsa onları sil.
        minleght: [5, "User Name başlığı için minumum 5 karakter olmalıdır."],
        maxleght: [100, "User Name başlığı için maksimum 100 karakter olmalıdır."],
    },

    // PASSWORD
    // password: String,
    password: {
        type: String,
        required: [true, " Password içeriği için gereklidir"],
        trim: true,
        minleght: [5, "Password başlığı için minumum 5 karakter olmalıdır."],
    },

    // EMAIL

    email: {
        type: String,
        required: [true, " Email içeriği için gereklidir"],
        trim: true,
        minleght: [5, "Email başlığı için minumum 5 karakter olmalıdır."],
    },



    // // DATE
    // dateInformation: {
    //     type: String, default: Date.now(),
    // },

    // VIEWS
    // Blog Görüntüleme (Default: 0)
    // views: {
    //     type: Number, default: 0, min: [0, "Blog gösterimi için Negatif değer verilmez"],
    // },

    // STATUS
    // Durum (Proje için bu bir taslak mı yoksa canlı ortam için mi ?)
    // Enum Durum Alanı: status: Blog gönderisinin durumu "draft" veya "published" olarak belirlenir. Bu, bir gönderinin taslak mı yoksa yayınlanmış mı olduğunu gösterir.
    status: {
        type: String, enum: ["draft", "published"], default: "draft",
    },
}, //end BlogPostSchema {}
    {
        // Oluşturma ve güncellemem zamanları sisteme eklemek
        // Zaman Bilgileri: timestamps: createdAt ve updatedAt alanları otomatik olarak eklenir ve her işlemde güncellenir.
        timestamps: true,
    }); //end PostSchema

////////////////////////////////////////////////////////////////////
// Sanal alan (Virtuals) - İçerik özetini döndürme
// summary: Blog içeriğinin ilk 100 karakterini döndüren bir sanal alan ekledik.
// Bu, API cevaplarında sadece kısa bir özet göstermek için kullanılabilir.
RegisterPostSchema.virtual("summary").get(function () {
    return this.content.substring(0, 100) + "..."; // İlk 100 karakter ve ardından ...
});

// Şema için ön middleware - Her kaydetmeden önce başlık ve içeriği büyük harflerle güncelleme
// Şema Middleware (Pre-save Hook): pre("save"): Kaydedilmeden önce başlık ve içeriğin ilk harflerini büyük yapmak için bir ön middleware ekledik.
RegisterPostSchema.pre("save", function (next) {
    this.header = this.header.charAt(0).toUpperCase() + this.header.slice(1);
    this.content = this.content.charAt(0).toUpperCase() + this.content.slice(1);
    next();
});

// Statik metot - Belirli bir yazara ait tüm blogları bulma
// Statik Metot: findByAuthor: Belirli bir yazara ait tüm blog gönderilerini bulmak için statik bir metot ekledik. Bu, belirli yazara göre blog filtrelemek için kullanılabilir.
RegisterPostSchema.statics.findByAuthor = function (authorName) {
    return this.find({ author: authorName });
};

// Instance metodu - Görüntüleme sayısını artırma
// Instance Metot: incrementViews: Her blog gönderisine ait görüntüleme sayısını artırmak için bir instance metot ekledik. Bu, bir gönderi görüntülendiğinde görüntüleme sayısını artırmanızı sağlar.
RegisterPostSchema.methods.incrementViews = function () {
    this.views += 1;
    return this.save();
};

// Sanal alanların JSON'a dahil edilmesi
RegisterPostSchema.set("toJSON", { virtuals: true });

// Module Exports modelName(BlogModel)
// BlogModel modelini dışa aktarmak
// Post kullanımı daha yaygındır
// module.exports = mongoose.model('Post', BlogPostSchema );

// Module
// 1.YOL
// module.exports = mongoose.model("MongoBlogModel", BlogPostSchema);

// 2.YOL
const Register = mongoose.model("MongoRegisterModel", RegisterPostSchema);
module.exports = Register; //Dışarının kullanımına açtık.


