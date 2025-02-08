$(document).ready(function () {
    let isUpdating = false;
    let updateId = null;
    const maxChars = 2000; // Maksimum harf sayısı

    // Hata mesajlarını temizleme fonksiyonu
    const clearErrors = () => {
        $(".error-message, .valid-message").remove();
    };

    // Hata mesajı ekleme fonksiyonu
    const showError = (element, message) => {
        $(element).next(".error-message, .valid-message").remove();
        $(element).after(`<small class="text-danger error-message">${message}</small>`);
    };

    // Geçerli mesajı ekleme fonksiyonu
    const showValid = (element, message) => {
        $(element).next(".error-message, .valid-message").remove();
        $(element).after(`<small class="text-success valid-message">${message}</small>`);
    };

    // İçerik harf sınırını kontrol etme fonksiyonu
    // const updateCharCount = () => {
    //     const username = $("#username").val();
    //     const charCount = username.length;
    //     const remainingChars = maxChars - charCount;

    //     $("#char-count").text(`Kalan Harf Sayısı: ${remainingChars}`);

    //     if (remainingChars < 0) {
    //         $("#char-count").removeClass("text-success").addClass("text-danger");
    //         showError("#content", "İçerik 2000 harften fazla olamaz!");
    //     } else {
    //         $("#char-count").removeClass("text-danger").addClass("text-success");
    //         $(".error-message").remove();
    //     }
    // };

    // Form doğrulama fonksiyonu
    const validateForm = () => {
        clearErrors();
        let isValid = true;
        const content = $("#content").val();
        const charCount = content.length;

        if ($("#username").val().trim() === "") {
            showError("#username", "User name boş bırakılamaz!");
            isValid = false;
        } else {
            showValid("#username", "User name geçerli.");
        }

        if ($("#password").val().trim() === "") {
            showError("#password", "Password boş bırakılamaz!");
            isValid = false;
        } else {
            showValid("#password", "Password geçerli.");
        }


        if ($("#email").val().trim() === "") {
            showError("#email", "Şifre adı boş bırakılamaz!");
            isValid = false;
        } else {
            showValid("#email", "Şifre adı geçerli.");
        }

        return isValid;
    };

    // Kullanıcı içerik alanına yazdıkça harf sayısını güncelle
    // $("#content").on("input", function () {
    //     updateCharCount();
    // });

    // Kullanıcı input'a yazarken hataları kaldır ve geçerli mesaj ekle
    $("#username, #password, #email").on("input", function () {
        const field = $(this);
        if (field.val().trim() === "") {
            showError(field, "Bu alan boş bırakılamaz!");
        } else {
            showValid(field, "Geçerli.");
        }
    });

    // Formu sıfırlama fonksiyonu
    const resetForm = () => {
        $("#register-form")[0].reset();
        isUpdating = false;
        updateId = null;
        $("#submit-btn").text("Ekle");
        clearErrors();
        updateCharCount();
    };

    // Register listesini getir
    const fetchRegisterList = () => {
        $.ajax({
            url: "/blog/register",
            method: "GET",
            success: function (data) {
                const $tbody = $("#register-table tbody").empty();
                data.forEach(item => {
                    $tbody.append(`
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
                    `);
                });
            },
            error: handleError
        });
    };

    // Hata yönetimi fonksiyonu
    const handleError = (xhr, status, error) => {
        console.error("İşlem başarısız:", error);
        alert("Beklenmeyen bir hata oluştu, lütfen tekrar deneyin.");
    };

    // Blog ekleme/güncelleme işlemi
    $("#register-form").on("submit", function (event) {
        event.preventDefault();

        // Form doğrulama
        if (!validateForm()) {
            return;
        }

        const registerData = {
            username: $("#username").val(),
            password: $("#password").val(),
            email: $("#email").val(),
            _csrf: $("input[name='_csrf']").val()
        };

        if (isUpdating && updateId) {
            $.ajax({
                url: `/blog/register/${updateId}`,
                method: "PUT",
                data: registerData,
                success: function () {
                    fetchRegisterList();
                    resetForm();
                },
                error: handleError
            });
        } else {
            $.ajax({
                url: "/blog/register",
                method: "POST",
                data: registerData,
                success: function () {
                    fetchRegisterList();
                    resetForm();
                },
                error: handleError
            });
        }
    });

    // Blog güncelleme işlemi
    $("#register-table tbody").on("click", ".edit-btn", function () {
        const row = $(this).closest("tr");
        const id = row.data("id");

        $("#username").val(row.find("td:eq(1)").text());
        $("#password").val(row.find("td:eq(2)").text());
        $("#email").val(row.find("td:eq(3)").text());

        isUpdating = true;
        updateId = id;
        $("#submit-btn").text("Güncelle");
    });

    // Blog silme işlemi
    $("#register-table tbody").on("click", ".delete-btn", function () {
        const id = $(this).closest("tr").data("id");

        if (!confirm(`${id} nolu Kullanıcıyı'u Silmek İstiyor musunuz?`)) return;

        $.ajax({
            url: `/blog/register/${id}`,
            method: "DELETE",
            success: fetchRegisterList,
            error: handleError
        });
    });

    // Sayfa yüklendiğinde register listesini getir
    fetchRegisterList();
    updateCharCount(); // Başlangıçta harf sayacını güncelle
});
