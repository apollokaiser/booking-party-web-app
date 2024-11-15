<template>
    <div>
        <div id="info">
            <div class="container">
                <div class="d-flex flex-row justify-content-evenly align-items-center">
                    <span id="slogan" class="col-md-5">Tổ chức tiệc Chất lượng – Chuyên nghiệp – Phong cách</span>
                    <div id="contact" class="col-md-5 d-flex flex-row justify-content-end align-items-center">
                        <div class="social__icon"><i class="fa-solid fa-phone"></i></div>
                        <span>03.2902.6130</span>
                        <div class="social__icon"><i class="fa-regular fa-envelope"></i></div>
                        <span>thinh.ngohoai@gmail.com</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
    @media screen and (max-width:992px) {
        #contact{
            display: none !important;
        }
        .container #slogan{
            width: 100%;
            display: block;
            text-align: center;
            margin-top: 5px;
        }
        #info .container > div {
            justify-content: center !important;
        }

    }
</style>