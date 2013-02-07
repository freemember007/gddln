var startpage=2

var xmlhttp;
if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  }
else
  {// code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }

function autoloading(){
	var currentpage=startpage
	
	xmlhttp.onreadystatechange=function()
	  {
	  if (xmlhttp.readyState==4 && xmlhttp.status==200)
	    {
		var objs = eval(xmlhttp.responseText);
		document.getElementById("image_url").src=objs[0].image_url;
	    }
	  }
	xmlhttp.open("GET","/ajax/"+currentpage,true);
	xmlhttp.send();
	startpage=startpage+1	
		
};

function load(){
	var currentpage=startpage-1

	xmlhttp.onreadystatechange=function()
	  {
	  if (xmlhttp.readyState==4 && xmlhttp.status==200)
	    {
		var objs = eval(xmlhttp.responseText);
		document.getElementById("text").innerHTML=objs[0].text;
		document.getElementById("author").innerHTML=objs[0].author+"("+objs[0].created_at+")";	
	    }
	  }
	xmlhttp.open("GET","/ajax/"+currentpage,true);
	xmlhttp.send();
	//startpage=startpage+1		
};

setInterval("autoloading()",1000*60);

