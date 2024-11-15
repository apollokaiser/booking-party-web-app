const datefns = require('date-fns');
const Handlebars = require('handlebars');
Handlebars.registerHelper("unless", function(conditional, options) {
    if (conditional==undefined){
        return options.inverse(this);
    } else {
        return options.fn(this);
    }
});
Handlebars.registerHelper("VND", function(currency){
    var formattedNumber = currency.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND'
      });
      return formattedNumber;
})
Handlebars.registerHelper("GETDATE", function(currency){
    let ISODate;
    if(currency=='NOW'){
        ISODate = new Date();
    } else {
        ISODate = new Date(currency);
    }
    const formattingDate = datefns.format(ISODate,"dd/MM/yyyy");
    return formattingDate;
});
Handlebars.registerHelper("DATE_FORMAT", function(currency,pattern){
    let ISODate = "";
    if(currency =="NOW"){
        ISODate = new Date();
    } else {
        ISODate = new Date(currency);
    }
    const formattingDate = datefns.format(ISODate,pattern);
    return formattingDate;
});
Handlebars.registerHelper("ISEMPTY", function(object,options){
    if(object==null || object.length==0){
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});
Handlebars.registerHelper("NOTEMPTY", function(object,options){
    if(object !=null){
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});
Handlebars.registerHelper("VALUE", function(number){
    return number != null ? number: 0;
});

Handlebars.registerHelper('if_equal', function(a, b, opts) {
    if (a == b) {
        return opts.fn(this)
    } else {
        return opts.inverse(this)
    }
})

const helper = {
    shortContent(content){
        const arrayContent = content.split(" ");
        const content15 = arrayContent.slice(0,20);
        return content15.join(" ")+ " ...";
    }
}


module.exports = helper;