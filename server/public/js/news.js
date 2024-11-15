
var checkbox = document.getElementsByName('checkbox');
const tools = document.querySelectorAll('.tools_selected');
var count_selected = document.querySelectorAll('.count_selected');
var checkall = document.getElementById('myCheckbox');
var delete__confirm = document.querySelector('#delete__confirm');
var delete_news = document.querySelector('#delete_news');
var update_news = document.querySelector('#update_news');
var error_message = document.querySelector('.error_message');
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
            update_news.classList.add('disabled-link');
            update_news.href = "";
        } else {
            update_news.classList.remove('disabled-link');
            update_news.href = `/news/update-news/${selected_value[0]}`;
        }
        // Xử lý nút chọn
        if (count == 0) {
            tools.forEach(item => {
                item.classList.remove('show');
            })
        }
        if(count == checkbox.length) {
            checkall.checked = true;
        } else {
            checkall.checked = false;
        }
        count_selected.forEach(item => {
            item.innerHTML = count;
        })
    })
});

checkall.addEventListener("change", () => {
    if (checkall.checked) {
        checkbox.forEach(item => {
            if (!item.checked) {
                item.checked = true;
                selected_value.push(item.value);
                count++;
            }
        });
    } else {
        checkbox.forEach(item => {
            item.checked = false;
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
    if (checkall.checked) {
        fetch(`/news/delete-news/?target=all`)
            .then(respone => respone.json())
            .then(respone => {
                if (respone.success == true) {
                    const card_news = document.querySelectorAll('.card-news');
                    card_news.forEach(item => {
                        item.remove();
                    });
                    document.querySelector(".news-container h2").classList.remove("hide");
                    document.querySelector(".pagination").classList.add("hide");
                    document.querySelector(".error_message.alert-success div").innerHTML = `Xóa thành công`;
                    document.querySelector(".error_message.alert-success").classList.add("show");
                    document.querySelector(".modal-btn-close").click();
                    setTimeout(() => {
                        document.querySelector(".error_message.alert-success").classList.remove("show");
                    },1000);
                    tools.forEach(item => {
                        item.classList.remove('show');
                    })
                    count = 0;
                    selected_value = []
                } else {
                    document.querySelector(".error_message.alert-danger").classList.add("show");
                    setTimeout(() => {
                        document.querySelector(".error_message.alert-danger").classList.remove("show");
                    },1000);
                }
            })
    } else {
        fetch(`/news/delete-news?target=${selected_value.join('-')}`)
            .then(respone => respone.json())
            .then(respone => {
                if (respone.success == true) {
                    const card_news = document.querySelectorAll('.card-news');
                    card_news.forEach(item => {
                        if(item.querySelector(".checkbox input").checked)
                        item.remove();
                    });
                    if(document.querySelectorAll('.card-news').length==0) {
                        document.querySelector(".pagination").classList.add("hide");
                        document.querySelector(".news-container h2").classList.remove("hide");
                    }
                    document.querySelector(".error_message.alert-success div").innerHTML = `Xóa thành công ${respone.result} tin tức`;
                    document.querySelector(".error_message.alert-success").classList.add("show");
                    setTimeout(() => {
                        document.querySelector(".error_message.alert-success").classList.remove("show");
                    },1000);
                    tools.forEach(item => {
                        item.classList.remove('show');
                    })
                    count = 0;
                    selected_value = [];
                } 
                else {
                    document.querySelector(".error_message.alert-danger").classList.add("show");
                    setTimeout(() => {
                        document.querySelector(".error_message.alert-danger").classList.remove("show");
                    },1000);
                }
                document.querySelector(".modal-btn-close").click();
                
            })
    }

})

