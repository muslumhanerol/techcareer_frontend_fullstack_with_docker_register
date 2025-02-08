// alert("public/js/public.js");

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
        $("#blog-register-form")[0].reset();
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Blog List
    function blogList() {
        $.ajax({
            url: "/register", method: "GET", success: function (data) {
                // blogList function içerik listesini temizlemek için kullandım.
                $("#blog-register-table tbody").empty();

                // forEach
                data.forEach(function (item) {
                    $("#blog-register-table tbody").append(`
                <tr data-id="${item._id}">
                    <td>${item._id}</td>
                    <td>${item.username}</td>
                    <td>${item.password}</td>
                    <td>${item.email}</td>
                    <td>${item.views}</td>
                    <td>${item.status}</td>
                    <td>${item.dateInformation}</td>
                    <td>
                        <button class="btn btn-primary edit-btn"><i class="fa-solid fa-wrench"></i></button>
                        <button class="btn btn-danger delete-btn"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
                `); //end append
                }); //end for each item
            }, //end success
        }); //end ajax
    } //end blogList

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Liste Function çağırmak
    blogList();

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // blog Ekleme
    $("#blog-register-form").on("submit", function (event) {
        // Browser'a otomatik olarak herhangi bir veri göndermesini kısıtkadım.
        // DİKKATTTTT : Bunu kapatmazsam csrf çalışmıyordu
        event.preventDefault();

        // Blog Form'da verileri almak için
        const blogDataCreate = {
            // Blog Form'da verileri almak için
            username: $("#username").val(),
            password: $("#password").val(),
            email: $("#email").val(),
            _csrf: $("input[name='_csrf']").val(), // CSRF token'ı AJAX isteğine dahil ediyoruz
        };

        console.warn("sonuç:" + blogDataCreate._csrf); // csrf ekle

        // Aldığım verileri kaydetmek (AJAX)
        $.ajax({
            url: "/register", method: "POST", data: blogDataCreate, success: function (data) {
                // Ekledikten sonraki işlem için listeyi tazele
                blogList();
                // Formu temizlemek için
                // 1.YOL
                $("#blog-register-form")[0].reset();
                // 2.YOL
                //reset()
            }, //end success
            error: function (xhr, status, error) {
                console.error("Blog Ekleme işlemi başarısız:", error); // Hata mesajını göster
            },
        }); //end submit ajax
    }); // end Blog Add submit

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Blog Güncelleme
    $("#blog-register-table tbody").on("click", ".edit-btn", function () {
        //alert("güncelleme");
        const row = $(this).closest("tr");
        const id = row.data("id");

        // Onay Mesajı
        const confirmation = confirm(`${id} nolu Blog'u Güncellemek İstiyor musunuz ?`);

        // Eğer onayımızı evetse
        if (confirmation) {
            const username = row.find("td:eq(1)").text(); // header ikinci sütunda
            const password = row.find("td:eq(2)").text(); // content üçüncü sütunda
            const email = row.find("td:eq(3)").text(); // author dördüncü sütunda

            $("#username").val(username);
            $("#password").val(password);
            $("#email").val(email);

            $("#blog-register-form")
                .off("submit")
                .on("submit", function (event) {
                    event.preventDefault();
                    const blogData = {
                        username: $("#username").val(),
                        password: $("#password").val(),
                        email: $("#email").val(),
                    };

                    $.ajax({
                        url: `/register/${id}`, method: "PUT", data: blogData, success: function () {
                            blogList();
                            $("#blog-register-form")[0].reset();
                        }, error: function (xhr, status, error) {
                            console.log("Güncelleme işlemi başarısız:", error);
                        },
                    }); //end put Ajax
                }); //end submit
        } else {
            console.error(`${id} nolu Blog silinmedi`);
        } //end else
    }); //end Güncelleme

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Blog Silme
    // confirm
    $("#blog-register-table tbody").on("click", ".delete-btn", function () {
        //alert("silme");

        // İlgili satırdaki id almak için
        const id = $(this).closest("tr").data("id");

        // Onay Mesajı
        const confirmation = confirm(`${id} nolu Blog'u Silmek İstiyor musunuz ?`);

        // Eğer onayımızı evetse
        if (confirmation) {
            // Silme (Ajax)
            $.ajax({
                url: `/register/${id}`, method: "DELETE", success: function () {
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
