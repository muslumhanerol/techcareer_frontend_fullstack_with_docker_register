// MongoDB için veritabanı işlemlerinde kullanmak üzere `MongoBlogModel` adında model oluşturalım.
// Mongoose adında ki kütüphaneyi ekle ve bu kütüphaneye erişmek için `mongoose` adını kullan.
// mongoose paketini sisteme dahil ediyoruz.
// Mongoose MongoDB ile bağlantı kurarken sağlıklı ve hızlı bağlantısı için  bir ODM(Object Data Modeling)
// NOT: Eğer bu sayfada Typescript kullansaydım reqire yerine import kullanacaktım.
// Import
const mongoose = require("mongoose");

// Schema adından (BlogRegisterSchema)
const BlogRegisterSchema = new mongoose.Schema({
    // 1.YOL (HEADER)
    //header: String,

    // 2.YOL (HEADER)
    username: {
        type: String,
        required: [true, " Blog Başlığı için gereklidir"],
        trim: true,
        minleght: [5, "Blog başlığı için minumum 5 karakter olmalıdır."],
        maxleght: [100, "Blog başlığı için maksimum 100 karakter olmalıdır."],
    },

    // CONTENT
    // content: String,
    password: {
        type: String,
        required: [true, " Blog içeriği için gereklidir"],
        trim: true,
        minleght: [5, "Blog başlığı için minumum 5 karakter olmalıdır."],
    },

    // AUTHOR
    email: {
        type: String,
        required: [true, " Blog içeriği için gereklidir"],
        trim: true,
        minleght: [5, "Blog başlığı için minumum 5 karakter olmalıdır."],
    },

    // TAGS (Dizi)
    // Etiketler (alanı için en az bir etiket zorunluluğu getirildi.)
    // Tags (Etiketler): Blog gönderilerine etiketler ekleyerek onları kategorize edebilir ve aramalarda bu etiketleri kullanabilirsiniz.
    // tags: {
    //     type: [String], validate: function (v) {
    //         return Array.isArray(v) && v.length > 0;
    //     }, message: "En az bir etiket girmelisiniz",
    // },

    // DATE
    dateInformation: {
        type: String, default: Date.now(),
    },

    // VIEWS
    // Blog Görüntüleme (Default: 0)
    views: {
        type: Number, default: 0, min: [0, "Blog gösterimi için Negatif değer verilmez"],
    },

    // STATUS
    // Durum (Proje için bu bir taslak mı yoksa canlı ortam için mi ?)
    // Enum Durum Alanı: status: Blog gönderisinin durumu "draft" veya "published" olarak belirlenir. Bu, bir gönderinin taslak mı yoksa yayınlanmış mı olduğunu gösterir.
    status: {
        type: String, enum: ["draft", "published"], default: "draft",
    },
}, //end BlogRegisterSchema {}
    {
        // Oluşturma ve güncellemem zamanları sisteme eklemek
        // Zaman Bilgileri: timestamps: createdAt ve updatedAt alanları otomatik olarak eklenir ve her işlemde güncellenir.
        timestamps: true,
    }); //end PostSchema

////////////////////////////////////////////////////////////////////
// Sanal alan (Virtuals) - İçerik özetini döndürme
// summary: Blog içeriğinin ilk 100 karakterini döndüren bir sanal alan ekledik.
// Bu, API cevaplarında sadece kısa bir özet göstermek için kullanılabilir.
BlogRegisterSchema.virtual("summary").get(function () {
    return this.password.substring(0, 100) + "..."; // İlk 100 karakter ve ardından ...
});

// Şema için ön middleware - Her kaydetmeden önce başlık ve içeriği büyük harflerle güncelleme
// Şema Middleware (Pre-save Hook): pre("save"): Kaydedilmeden önce başlık ve içeriğin ilk harflerini büyük yapmak için bir ön middleware ekledik.
BlogRegisterSchema.pre("save", function (next) {
    this.username = this.username.charAt(0).toUpperCase() + this.username.slice(1);
    this.password = this.password.charAt(0).toUpperCase() + this.password.slice(1);
    next();
});

// Statik metot - Belirli bir yazara ait tüm blogları bulma
// Statik Metot: findByAuthor: Belirli bir yazara ait tüm blog gönderilerini bulmak için statik bir metot ekledik. Bu, belirli yazara göre blog filtrelemek için kullanılabilir.
// BlogRegisterSchema.statics.findByAuthor = function (authorName) {
//     return this.find({ author: authorName });
// };

// Instance metodu - Görüntüleme sayısını artırma
// Instance Metot: incrementViews: Her blog gönderisine ait görüntüleme sayısını artırmak için bir instance metot ekledik. Bu, bir gönderi görüntülendiğinde görüntüleme sayısını artırmanızı sağlar.
BlogRegisterSchema.methods.incrementViews = function () {
    this.views += 1;
    return this.save();
};

// Sanal alanların JSON'a dahil edilmesi
BlogRegisterSchema.set("toJSON", { virtuals: true });

// Module Exports modelName(BlogModel)
// BlogModel modelini dışa aktarmak
// Post kullanımı daha yaygındır
// module.exports = mongoose.model('Post', BlogRegisterSchema );

// Module
// 1.YOL
// module.exports = mongoose.model("MongoBlogModel", BlogRegisterSchema);

// 2.YOL
const Blog = mongoose.model("MongoBlogRegisterModel", BlogRegisterSchema);
module.exports = Blog;
