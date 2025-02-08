# Termianlde
mongosh
use blogDB  # blogDB adında bir veritabanı oluştur ve ona geç

db.posts.insertOne({
    header: "İlk Blog Yazım",
    content: "Bu benim ilk blog yazımın içeriğidir.",
    author: "Hamit Mızrak.",
    tags: "java,jsp",
})

