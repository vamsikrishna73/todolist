


exports.getdate = function(){
    const today = new Date();
    
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }

    const day = today.toLocaleDateString("en-us",options);
    return day;
}

exports.getday  = function(){
    const today = new Date();
    
    const options = {
        weekday: "long",
        
    }

    var day = today.toLocaleDateString("en-us",options);
    return day;
}
