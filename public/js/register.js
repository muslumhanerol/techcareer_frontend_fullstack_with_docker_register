// alert("public/js/register.js");

/*
header: String,
content: String,
author: String,
tags: String,
*/

// jQuery dosyalar hazırsa başlayabilir
$(document).ready(function () {
    // Formu Temizleme Functionu
    const reset = () => {
        // Formu temizlemek için
        $("#register-form")[0].reset();
        //public > js. > register.ejs > #register-form erişim sağladım ve formu temizledim.
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Register List
    function registerList() {
        $.ajax({
            url: "/register", method: "GET", success: function (data) {
                // /register = register.ejs deki formun action adı. Forma tıkladındığında burada handler edilecek.
                $("#register-table tbody").empty();
                // blogList function içerik listesini temizlemek için kullandım.

                // forEach. data= Yukarıdan gelen data.
                data.forEach(function (item) {
                    $("#register-table tbody").append(` 
                <tr data-id="${item._id}"> 
                    <td>${item._id}</td>
                    <td>${item.username}</td>
                    <td>${item.password}</td>
                    <td>${item.email}</td>                    
                    <td>
                        <button class="btn btn-primary edit-btn"><i class="fa-solid fa-wrench"></i></button>
                        <button class="btn btn-danger delete-btn"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
                `); //end append
                }); //end for each item
            }, //end success
        }); //end ajax
    } //end registerList

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Liste Function çağırmak
    registerList();

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // blog Ekleme
    // on= submit işlemlerini yapabilmek için bu özelliği kullandım.
    $("#register-form").on("submit", function (event) {
        // Browser'a otomatik olarak herhangi bir veri göndermesini kısıtladım.
        // DİKKATTTTT : Bunu kapatmazsam csrf çalışmıyordu
        event.preventDefault();

        // Blog Form'da verileri almak için
        const registerDataCreate = {
            // Blog Form'da verileri almak için
            username: $("#username").val(),
            password: $("#password").val(),
            email: $("#email").val(),
            _csrf: $("input[name='_csrf']").val(), // CSRF token'ı AJAX isteğine dahil ediyorum
            //cors hatası almamak için şimdiden ekledim.
        };

        console.warn("sonuç:" + registerDataCreate._csrf); // csrf ekle

        // Aldığım verileri kaydetmek (AJAX)
        $.ajax({
            url: "/register", method: "POST", data: registerDataCreate, success: function (data) {
                //blogList(); = Ekledikten sonraki işlem için listeyi tazele
                blogList();
                // Formu temizlemek için
                // 1.YOL
                $("#register-form")[0].reset();
                // 2.YOL
                //reset()
            }, //end success
            //Hataları yakalamak için yazdım.
            error: function (xhr, status, error) {
                console.error("User Ekleme işlemi başarısız:", error); // Hata mesajını göster
            },
        }); //end submit ajax
    }); // end Blog Add submit

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Blog Güncelleme
    //Güncellemeyi table yapısı üzerinden yapacağız. .edit-btn 37.str
    $("#register-table tbody").on("click", ".edit-btn", function () {
        //alert("güncelleme");
        const row = $(this).closest("tr"); //tablerow da hangisine tıklandıysa.
        const id = row.data("id");

        // Onay Mesajı
        const confirmation = confirm(`${id} nolu Blog'u Güncellemek İstiyor musunuz ?`);

        // Eğer onayımızı evetse
        if (confirmation) {
            // row içerisinde find diyerek buldum, td deki eşitse 1 e.
            const username = row.find("td:eq(1)").text(); // username ikinci sütunda
            const password = row.find("td:eq(2)").text(); // password üçüncü sütunda
            const email = row.find("td:eq(3)").text(); // email dördüncü sütunda

            // içlerini set et dedim.
            $("#username").val(username);
            $("#password").val(password);
            $("#email").val(email);

            $("#register-form")
                .off("submit") //submite tıklandıktan sonra function çalışacak.
                .on("submit", function (event) {
                    event.preventDefault();
                    const registerData = {
                        username: $("#username").val(),
                        password: $("#password").val(),
                        email: $("#email").val(),
                    };

                    $.ajax({
                        url: `/register/${id}`, method: "PUT", data: registerData, success: function () {
                            blogList(); //Güncelleme sonrası halini göster.
                            $("#register-form")[0].reset();
                        }, error: function (xhr, status, error) {
                            console.log("Güncelleme işlemi başarısız:", error);
                        },
                    }); //end put Ajax
                }); //end submit
        } else {
            console.error(`${id} nolu Blog silinmedi`);
            //alert(`${id} nolu user silinmedi`)
        } //end else
    }); //end Güncelleme

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Blog Silme
    // confirm
    $("#blog-table tbody").on("click", ".delete-btn", function () {
        //alert("silme");

        // İlgili satırdaki id almak için
        const id = $(this).closest("tr").data("id");

        // Onay Mesajı
        const confirmation = confirm(`${id} nolu Blog'u Silmek İstiyor musunuz ?`);

        // Eğer onayımızı evetse
        if (confirmation) {
            // Silme (Ajax)
            $.ajax({
                url: `/blog/${id}`, method: "DELETE", success: function () {
                    // Silme işleminden sonrası için listeyi tazele
                    blogList();
                }, error: function (xhr, status, error) {
                    console.log("Silme işlemi başarısız:", error);
                },
            });
        } else {
            console.error(`${id} nolu Blog silinmedi`);
        }
    }); //end Silmek
}); //end Document.Ready
