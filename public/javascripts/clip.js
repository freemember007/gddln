	ZeroClipboard.setDefaults( { moviePath: 'http://www.gddln.com/javascripts/ZeroClipboard.swf' } );
	
	var clip = new ZeroClipboard(document.getElementById('chooseMenu-copy'),{
		trustedDomains:'*',
		allowScriptAccess:'always',
		useNoCache: true,
	});

	clip.on( 'load', function(client) {
	   console.log( "movie is loaded from remote" );
	});
	
	
	clip.on( 'complete', function(client, args) {
	  console.log("Copied text to clipboard from remote: " + args.text );
	});
	
	clip.on( 'mouseover', function(client) {
	   console.log("mouse over from remote");
	});
	
	clip.on( 'mouseout', function(client) {
	   console.log("mouse out from remote");
	});
	
	clip.on( 'mousedown', function(client) {
		console.log("mouse down from remote");
	});