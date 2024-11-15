function convertToUnsigned(str, join=false) {
    str = str.toLowerCase();
    
    const from = "àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ";
    const to   = "aaaaaaaaaaaaaaaaeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd";
    
    for (let i = 0, l = from.length; i < l; i++) {
        str = str.replace(RegExp(from[i], "g"), to[i]);
    }
    if(join){
        str = str.replace(" ","_");
    }
    return str;
}

module.exports = {convertToUnsigned};