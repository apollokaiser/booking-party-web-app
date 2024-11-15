console.log("loading updateNews.js file...");
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
    $('.submit').click((event)=>{
        event.preventDefault();
        var myModal = new bootstrap.Modal(document.getElementById('errorUpdating'), {
            keyboard: false
        });
        const news_id = $("#news_id").val();
        const news_title = $('#news_title').val();
        const news_hastag = $('#news_hastag').val();
        const news_content = $(".ck-content p").text();
        const serviceID = $('#service').val();
        if(news_title =="" || news_hastag =="" || news_content ==""){
            myModal.show();
        } else { 
        const news = {news_id,news_title,news_hastag,news_content,serviceID};
        const formData = new FormData();
        var imageInput = document.getElementById('news_upload');
        var file = imageInput.files[0];
        if(file!=undefined) {
        formData.append('news-image', file);
        }
        formData.append('newsUpdated',JSON.stringify(news));
                $.ajax({
                        url: '/news/update',
                        type: 'POST',
                        data: formData,
                        cache: false,
                        contentType: false,
                        processData: false,
                        success: function(response) {
                            if(response.success==true){
                                document.querySelector('.modal-body p').innerHTML = "Tuyệt vời ! Bạn đã sửa thành công";
                                document.querySelector('.modal-footer button').remove();
                                myModal.show();
                            } else {
                                document.querySelector('.modal-body p').innerHTML = "Sửa không thành công, vui lòng thử lại";
                                document.querySelector('.modal-footer a').style.display="none";
                                myModal.show();  
                            }
                        },
                        error: function(error) {
                            alert("Sửa thất bại ! Vui lòng kiểm trả lại !");
                        }
                    });
        }

    })
})
//------------------------------------------------------------------------------------//