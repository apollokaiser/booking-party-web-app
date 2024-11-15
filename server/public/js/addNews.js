console.log("loading addNews.js file...");
//-----------------------------------------------------------------------//
//create ckeditor
ClassicEditor
.create( document.querySelector( '#editor' ) )
.catch( error => {
    console.error( error );
} );
//----------------------------------------------------------------------//
//preview image
const imageUpload = document.querySelector('#news_upload');
const previewImg = document.getElementById('demo_image');
const revoke_image = document.querySelector('.revoke_image');
imageUpload.addEventListener('change',(event)=>{
    imageURL = URL.createObjectURL(event.target.files[0]);
    previewImg.src = imageURL;
    previewImg.classList.add("show");
revoke_image.addEventListener('click',()=>{
    previewImg.src = "";
    previewImg.classList.remove("show");
    URL.revokeObjectURL(imageURL);
})
document.addEventListener('keydown',(e)=>{
    if(e.code == 'Enter'){
        document.querySelector('.news_content').click();
    }
});
});       
//--------------------------------------------------------------------------------------//
//ajax request handle
$(document).ready(function() {
    $('#postExcelFile').submit(function(event){
        event.preventDefault();
        const formData = new FormData($(this)[0]);
        $.ajax({
                url: '/news/upload',
                type: 'POST',
                data: formData,
                dataType: 'json',
                cache: false,
                contentType: false,
                processData: false,
                success: function(response) {
                    if(response.success==true){
                        alert("Nhập thành công !")
                    }
                },
                error: function(error) {
                    alert("Nhập thất bại ! Vui lòng kiểm trả lại !");
                }
            });
    });
    function check(title,content,image){
         if(title =="") {
            alert("Vui lòng nhập tựa đề !");
            return false;
        } 
        if(content==""){
            alert("Vui lòng nhập nội dung !");
            return false;
        } if(!image){
            alert("Vui lòng chọn ảnh !");
            return false;
        } 
        return true;
    }
    $('.submit').click((event)=>{
        event.preventDefault();
        const news_title = $('#news_title').val();
        const news_hastag = $('#news_hastag').val();
        const news_content = $(".ck-content p").text();
        const serviceID = $('#service').val();
        const news = {news_title,news_hastag,news_content,serviceID};
        const formData = new FormData();
        var imageInput = document.getElementById('news_upload');
        var file = imageInput.files[0];
        formData.append('news-image', file);
        formData.append('news',JSON.stringify(news));
        if(check(news_title,news_content,file)){
        $.ajax({
                url: '/news/add',
                type: 'POST',
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                success: function(response) {
                    if(response.success > 0){
                        alert("Nhập thành công !")
                    } else if(response.success ==0) {
                        alert("Nhập thất bại !!");
                    } else {
                        alert("Bài viết đã tồn tại !! Vui lòng thử lại ");
                    }
                },
                error: function(error) {
                    alert(error);
                }
            });
        }
    })
})
//------------------------------------------------------------------------------------//