document.onkeydown=nextpage;

thisURL = document.URL;

if (thisURL.match(/\/(\d+)$/)){
	var pageid=thisURL.match(/\/(\d+)$/)[1]
	if(pageid==1){
		prevpage="/"
	}
	else{
		var prevpage="/"+(parseInt(pageid)-1)
	}
}
else{
	var pageid=1
	prevpage="/"
};


if(pageid==21){
	nextpage="/"
}
else{
	var nextpage="/"+(parseInt(pageid)+1)
};


// function nextpage(event)
// {
//    event = event ? event : (window.event ? window.event : null);
//    if (event.keyCode==39)
//    {
//      location=nextpage
//    }
//   if (event.keyCode==37)
//   {
//     location=prevpage;
//   }
// }

// document.keyup(function(event){
//    if(event.keyCode==83){
//     	window.open(document.getElementById("sinashare").href,'_self');
//     };
// });