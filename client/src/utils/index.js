import { format } from "date-fns";

export const shortDate = (date)=>{
    console.log(date);
    const ISODate = new Date(date);
        const formattingDate = format(ISODate,"dd/MM/yyyy");
        return formattingDate;
}
export const formatDate = (date,pattern)=>{
        const ISODate = new Date(date);
        const formattingDate = format(ISODate,pattern);
        return formattingDate;
}
export const checkDate = (inittDate,updateDate)=>{
    let now = new Date();
    let defaultDate = new Date(inittDate);
    let changedDate = new Date(updateDate);
    if(defaultDate.getTime()==changedDate.getTime()) return true; //Đổi 1 hồi lại trở về ngày mặc định thì trả thẳng về true
    if(changedDate.getTime() > defaultDate.getTime()) return true; // Sửa thành 1 ngày trong tương lai thì OK
    //Sửa thành ngày nhỏ hơn ngày lúc đầu. Xét xem changedDate và ngày hiện tại. Nếu hiện tại + 2 > changeDate thì không được
    now.setDate(now.getDate()+2);
    if(now >= changedDate) return false;
    else {
        return true;
    }
}
export const checkDateUpdate = (orderDate, deleteMode = false)=>{
    let now = new Date();
    let date = new Date(orderDate);
    if(deleteMode){
        if(now.getTime() >= date.getTime()){
            return true;
        } else {
            return false;
        }
    } 
    now.setDate(now.getDate()+1);
    if(now >= date) return false;
    else {
        return true;
    }
}

export function convertToSlug(text) {
    return text
      .toLowerCase()
      .normalize("NFD") // Chuyển đổi ký tự có dấu thành không dấu
      .replace(/[\u0300-\u036f]/g, "") // Loại bỏ các dấu thanh
      .replace(/\s+/g, "-") // Thay thế khoảng trắng bằng dấu gạch ngang
      .replace(/[^\w-]+/g, "") // Loại bỏ các ký tự không phải chữ cái, số, gạch ngang
      .replace(/--+/g, "-") // Loại bỏ các dấu gạch ngang kéo dài
      .replace(/^-+|-+$/g, ""); // Loại bỏ gạch ngang ở đầu và cuối chuỗi
  }

  export const setCurrency = price => {
    var formattedNumber = Number(price).toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND'
    });
    return formattedNumber;
}
export function getDateDiff(checkDate){
    const today = new Date();
    const date  = new Date(checkDate);
    const periodDate = (date - today)/(1000 * 60 * 60 * 24);
    return Math.round(periodDate);
}
export function shortContent(content){
    const arrayContent = content.split(" ");
    const content15 = arrayContent.slice(0,20);
    return content15.join(" ")+ " ...";
}
