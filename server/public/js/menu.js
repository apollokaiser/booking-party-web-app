function formatPrice() {
    var inputElement = document.getElementById("price");
    if(inputElement.value != ""){
    var inputValue = inputElement.value.replace(/[^0-9]/g, "");
    var formattedValue = parseInt(inputValue).toLocaleString("vi-VN");
    inputElement.value = formattedValue;
    }
}
document.getElementById("price").addEventListener('keyup',formatPrice);

// NOTE:upload image 
const imageUpload = document.querySelector('#food_upload');
const previewImg = document.getElementById('preview_image');
const revoke_image = document.querySelector('.revoke_image');
const upload_area = document.querySelector('.upload_food_area');
var imageURL = null;
imageUpload.addEventListener('change',(event)=>{
    imageURL = URL.createObjectURL(event.target.files[0]);
    previewImg.src = imageURL;
    console.log(imageURL);
    previewImg.classList.add("show");
});
revoke_image.addEventListener('click',()=>{
    previewImg.src = "";
    previewImg.classList.remove("show");
    URL.revokeObjectURL(imageURL);
})
// NOTE:drag and drop image ///////////////////////////////////////////
upload_area.addEventListener('dragover',(e)=>{
    e.preventDefault();
    upload_area.classList.add("dragover");
});
upload_area.addEventListener('dragleave',(e)=>{
    e.preventDefault();
    upload_area.classList.remove("dragover");
});
upload_area.addEventListener('drop',(e)=>{
    e.preventDefault();
    upload_area.classList.remove("dragover");
    var image = e.dataTransfer.files[0];
    if(isValidImage(image)){
        imageUpload.files = e.dataTransfer.files;
    } else {
        alert("Vui lòng chọn 1 hình ảnh");
    }
        imageURL = URL.createObjectURL(image);
        previewImg.src = imageURL;
        previewImg.classList.add("show");
});

function isValidImage(image) {
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const fileExtension = image.name.split('.').pop().toLowerCase();
    return validExtensions.includes(fileExtension);
}
////////////////////////////////////////////////////////////////////
///////////////////////
//NOTE:   ajax request  ////////////////////////////////////////////////
/////////////////////
$('#add_new_food').click((event)=>{
    event.preventDefault();
    const foodName = $("#food_name").val();
    const typeID = $("#type_food").val();
    const description = $("#description").val();
    let price = $("#price").val();
    price = price.replace(/[^0-9]/g, "");
    const food = {foodName, price, typeID, description};
    const formData = new FormData();
    var imageInput = document.getElementById('food_upload');
    var file = imageInput.files[0];
    formData.append('food-image', file);
    formData.append('food',JSON.stringify(food));
    $.ajax({
            url: '/menu/add-food',
            type: 'POST',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function(response) {
                if(response.success==true){
                    alert("Nhập thành công !")
                    $("#food_name").val("");
                    $("#price").val("");
                    $("#description").val("");
                    previewImg.src = "";
                    previewImg.classList.remove("show");
                    URL.revokeObjectURL(imageURL);
                } else {
                    alert("Không thành công! Vui lòng kiểm tra lại");
                }
            },
            error: function(error) {
                alert(error);
            }
        });
})

//NOTE: 

var checkbox = document.getElementsByName('checkbox');
const tools = document.querySelectorAll('.tools_selected');
var count_selected = document.querySelectorAll('.count_selected');
var checkall = document.getElementById('checkall');
var delete__confirm = document.querySelector('#delete__confirm'); //FIXME:
var delete_menu = document.querySelector('#delete_menu');//FIXME:
var update_menu = document.querySelector('#update_menu');//FIXME:
var result_message = document.querySelector('.result_message');//FIXME:
var selected_value = [];
var count = 0;
checkbox.forEach((item) => {
    item.addEventListener('change', () => {
        if (item.checked) {
            selected_value.push(item.value);
            tools.forEach(item => {
                item.classList.add('show');
            })
            count++;
        } else {
            count--;
            selected_value.splice(selected_value.indexOf(item.value), 1);
        }
        // Xử lý nút update
        if (count > 1) {
            update_menu.classList.add('disabled-link');
            update_menu.href = "";
        } else {
            update_menu.classList.remove('disabled-link');
            update_menu.href = `/menu/update-menu/${selected_value[0]}`;
        }
        // Xử lý nút chọn
        if (count == 0) {
            closeToolsSelected(tools);
        }
        count_selected.forEach(item => {
            item.innerHTML = count;
        })
    })
});
//NOTE:FIXED:Hàm đóng các chức năng tùy chọn trên thanh công cụ
function closeToolsSelected(tools){
    tools.forEach(item => {
        item.classList.remove('show');
    })
}//-------------------------------------------------------

checkall.addEventListener("change", () => {
    if (checkall.checked) {
        checkbox.forEach(item => {
            if (!item.checked) {
                item.checked = true;
                selected_value.push(item.value);
                update_menu.classList.add('disabled-link');
                update_menu.href = "";
                count++;
            }
        });
    } else {
        checkbox.forEach(item => {
            item.checked = false;
            closeToolsSelected(tools);
        });
        count = 0; // return 0 selected_items
        selected_value = []; // return empty array
    }
    count_selected.forEach(item => {
        item.innerHTML = count;
    })
});
delete__confirm.addEventListener('click', (e) => {
    e.preventDefault();
    let data = "";
    if(checkall.checked){
        data = ["all"];
    } else {
        data = selected_value;
    }
    fetch("/menu/delete-menu", {
        method: "POST",
        body:JSON.stringify(data),
        headers: {
             'Content-Type': 'application/json'
            },
    }).then(result => result.json())
    .then(result =>{
            document.querySelector(".delmenu-modal-close").click();
            const menuContent = document.querySelectorAll(".menu_content >.card");
            menuContent.forEach(item =>{
                console.log(item);
                if(data[0]=="all"){
                    item.remove();
                    document.querySelector(".menu_content h2").classList.remove("hide");
                } else {
                    const selectedID = item.querySelector(".checkbox input").value
                    if( data.includes(selectedID)){
                        item.remove();
                    }
                    if(document.querySelectorAll(".menu_content .card").length ==0){
                        document.querySelector(".menu_content h2").classList.remove("hide");
                    }
                }
            })
            document.getElementById("result_message").innerHTML = result.message
            result_message.classList.add("show");
            count = 0; // return 0 selected_items
            selected_value = []; // return empty array
            closeToolsSelected(tools);
            setTimeout(() => {
                result_message.classList.remove("show");
            },2000);
    })
    .catch(err => console.log(err))
});





