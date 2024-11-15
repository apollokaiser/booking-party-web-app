
$(document).ready(function () {
    $('#add_new_menu').click((event) => {
        event.preventDefault();
        let service = document.getElementById("services").value;
        const choose_foodKV = document.getElementsByName('choose_foodKV');
        const choose_foodAC = document.getElementsByName('choose_foodAC');
        const choose_foodTM = document.getElementsByName('choose_foodTM');
        let isAccepted = "";
        let menu = {
            serviceID: service,
            menuDetails: []
        };
        choose_foodKV.forEach(item => {
            if (item.checked == true) {
                isAccepted = 1;
                menu.menuDetails.push(item.value);
            }
        });
        choose_foodAC.forEach(item => {
            if (item.checked == true) {
                if (isAccepted == 1) {
                    isAccepted = 2;
                }
                menu.menuDetails.push(item.value);
            }
        });
        choose_foodTM.forEach(item => {
            if (item.checked == true) {
                if (isAccepted == 2) {
                    isAccepted = 3;
                }
                menu.menuDetails.push(item.value);
            }
        });
        if (isAccepted < 3) {
            alert("Vui lòng chọn tất cả các loại thức ăn");
        } else {
            const menuForm = new FormData();
            menuForm.append('menu', JSON.stringify(menu));
            $.ajax({
                url: '/menu/addMenu',
                type: 'POST',
                data: menuForm,
                cache: false,
                contentType: false,
                processData: false,
                success: function (response) {
                    if (response.success == true) {
                        document.querySelector(".error_message.alert-success").classList.add("show");
                        document.getElementById("close_button").click();
                        document.querySelectorAll(".choose_food input").forEach(item => {
                            if (item.checked == true) {
                                item.checked = false;
                            }
                        });
                        setTimeout(() => {
                            document.querySelector(".error_message.alert-success").classList.remove("show");
                        },1000);
                        
                    } else {
                        document.querySelector(".error_message.alert-danger").classList.add("show");
                        document.querySelector(".error_message.alert-danger div").innerHTML = "Thêm không thành công";
                        setTimeout(() => {
                            document.querySelector(".error_message.alert-danger").classList.remove("show");
                        },1000);
                    }
                },
                error: function (error) {
                    console.log(error);
                    alert(error);
                }
            });

        }

    })
});