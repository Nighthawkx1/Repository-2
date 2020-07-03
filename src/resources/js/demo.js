var inputType = "string";
var stepped = 0, rowCount = 0, errorCount = 0, firstError;
var start, end;
var firstRun = true;
var maxUnparseLength = 10000;

$(function () {
	// Tabs
	$('#tab-string').click(function () {
		$('.tab').removeClass('active');
		$(this).addClass('active');
		$('.input-area').hide();
		$('#input-string').show();
		$('#submit').text("Parse");
		inputType = "string";
	});

	$('#tab-local').click(function () {
		$('.tab').removeClass('active');
		$(this).addClass('active');
		$('.input-area').hide();
		$('#input-local').show();
		$('#submit').text("Parse");
		inputType = "local";
	});

	$('#tab-remote').click(function () {
		$('.tab').removeClass('active');
		$(this).addClass('active');
		$('.input-area').hide();
		$('#input-remote').show();
		$('#submit').text("Parse");
		inputType = "remote";
	});

	$('#tab-unparse').click(function () {
		$('.tab').removeClass('active');
		$(this).addClass('active');
		$('.input-area').hide();
		$('#input-unparse').show();
		$('#submit').text("Unparse");
		inputType = "json";
	});



	// Sample files
	$('#remote-normal-file').click(function (e) {
		$('#url').val($('#local-normal-file').attr('href'));
		$('#input').val($('#local-normal-file').attr('href'));
e.preventDefault();
	});
	$('#remote-large-file').click(function () {
		$('#url').val($('#local-large-file').attr('href'));
		$('#input').val($('#local-large-file').attr('href'));
	});
	$('#remote-malformed-file').click(function () {
		$('#url').val($('#local-malformed-file').attr('href'));
		$('#input').val($('#local-malformed-file').attr('href'));
	});




	// Demo invoked
	$('#submit').click(function () {
		if ($(this).prop('disabled') == "true")
			return;

		stepped = 0;
		rowCount = 0;
		errorCount = 0;
		firstError = undefined;

		var config = buildConfig();
		var input = $('#input').val();

		if (inputType == "remote")
			input = $('#url').val();
		else if (inputType == "json")
			input = $('#json').val();

		// Allow only one parse at a time
		$(this).prop('disabled', true);

		if (!firstRun)
			console.log("--------------------------------------------------");
		else
			firstRun = false;



		if (inputType == "local") {
			if (!$('#files')[0].files.length) {
				alert("Please choose at least one file to parse.");
				return enableButton();
			}

			$('#files').parse({
				config: config,
				before: function (file, inputElem) {
					start = now();
					console.log("Parsing file...", file);
				},
				error: function (err, file) {
					console.log("ERROR:", err, file);
					firstError = firstError || err;
					errorCount++;
				},
				complete: function () {
					end = now();
					printStats("Done with all files");
				}
			});
	
		} else if (inputType == "remote" && !input) {
			alert("Please enter the URL of a file to download and parse.");
			return enableButton();
		}
		else {
			start = now();
			var results = Papa.parse(input, config);
			displayResults(results)

			console.log("Synchronous results:", results);
			if (config.worker || config.download)
				console.log("Running...");
		}
	});

	$('#insert-tab').click(function () {
		$('#delimiter').val('\t');
	});


	$('#insert-tab').click(function () {
		$('#delimiter').val('\t');
	});
	$('#insert-nl').click(function () {
		$('#delimiter').val('\n');
	});
	$('#insert-nlr').click(function () {
		$('#delimiter').val('\r\n');
	});
	$('#insert-dash').click(function () {
		$('#delimiter').val('-');
	});
	$('#insert-under').click(function () {
		$('#delimiter').val('_');
	});

	$('#save').click(function () {
		var o = $('#outdone').val();
		var fName = $('#fName').val()
		$.post("files/" + fName, { data: o, fName: fName }).then(function () {

			window.location.replace("files/" + fName);
		});


	});
});

function isNaME(str) {
	const regex = /^([A-Z]{1})+([[A-Za-z]+[,.]?[ ]?|[A-Za-z]+['-]]?)+$/g;
	let m;

	while ((m = regex.exec(str)) !== null) {
		// This is necessary to avoid infinite loops with zero-width matches
		if (m.index === regex.lastIndex) {
			regex.lastIndex++;
		}

		// The result can be accessed through the `m`-variable.
		m.forEach((match, groupIndex) => {
			//console.log(`Found match, group ${groupIndex}: ${match}`);
			return true;
		});
	}
	return false;
}

function isPhone(str) {
	var phoneRe = /^[2-9]\d{2}[2-9]\d{2}\d{4}$/;
	var digits = str.replace(/\D/g, "");
	let t = phoneRe.test(digits);
	if (t) {
		return true;
	} else {
		return false;
	}
}

function isEmail(email) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function isAddress(l, chk) {
    var parsed = parseAddress.parseLocation(l);
    if (parsed != null && parsed.zip && Object.keys(parsed).length && chk) {
      return true;
    } else if (!chk && parsed != null) {
      return parsed;
    }
    return false;
  }
function guess(hs, row) {
	var re = {};
	hs.forEach(function (v, k) {
		re[v] = '';
	})
	console.log(re);

	if (row.length != hs.length) {
		row.forEach(function (v, k) {
			v=v.replace(/,\s*$/, "");
			if (isPhone(v)) {
				re.Phone = v;
			} else if (isEmail(v)) {
				re.Email = v;
			} else if (isNaME(v)) {
				re.Name = v;
			}else if(isAddress(v, true)){
				re.Address=v;
			}else if(k==0){
				
				re.Name=v;
			}else if(k==1){
				
				re.Company=v;
			}else if(k==2){
				
				re.Contact=v;
			}else if(k==3){
				
				re.Company2=v;
			}else if(k==4){
				
				re.Phone=v;
			}else if(k==5){
				
				re.Email=v;
			}else if(k==6){
				
				re.Address=v;
			}else{
				console.log(v)
			}
		})
	}
	sendToDB(re)
	return Object.values(re);
}

function displayResults(results) {
	var hs = $('#headers').val().split(", ");
	//var d = JSON.stringify(results.data);
	//results.data = results.data.trim();

	

	// var regex = /\],\[/gm;
	// var subst = `\n`
	// var closeCommaRegex = /[\],]/gm;
	// console.log(d)
	// d = format(d,regex, subst)
	// regex = /\],\[/gm;
	// d = format(d,regex,'')
	// regex = /\[\[|\]\]/gm;
	// d = format(d,regex, subst)
	// regex = /"/gm;
	// d = format(d,regex, '')
	//$('#outdone').val(d);

	var r = '';
	var row = []
	var g ={};
	r+= '"'+hs.join('","')+'"'+"\n"
	results.data.forEach(function (v, k) {
		if(v == ''){
			return;
		}else if (v.length == 1) {
			row.push('"' + clean(v) + '"');
		} else if (v.length == 2) {
			g = guess(hs, row);
			
			console.log(g)

			r += ''+g.join(',')+''+"\n"
			row = [];
			//r += '\n';
		}
	})
	console.log(r);
	$('#outdone').val(r);
}
function clean(d){
let r = d[0];
r.trim().replace(',','');
return r;
}
function sendToDB(g){
	console.log(g);
	
	$.post( "/new", g)
  .done(function( data ) {
   // alert( "Data Loaded: " + data );
  });
}


function styleFormat(re, wi, data) {
	function commaToNew(match, offset, string) {
		return (offset > 0 ? '\n' : '') + match
	}
	return data.replace(/[,]/g, commaToNew);
}


function format(str, regex, subst) {
	const result = str.replace(regex, subst);
	console.log('Substitution result: ', result);
	return result;
}


function printStats(msg) {
	if (msg)
		console.log(msg);
	console.log("       Time:", (end - start || "(Unknown; your browser does not support the Performance API)"), "ms");
	console.log("  Row count:", rowCount);
	if (stepped)
		console.log("    Stepped:", stepped);
	console.log("     Errors:", errorCount);
	if (errorCount)
		console.log("First error:", firstError);
}



function buildConfig() {
	return {
		delimiter: $('#delimiter').val(),
		header: $('#header').prop('checked'),
		dynamicTyping: $('#dynamicTyping').prop('checked'),
		skipEmptyLines: $('#skipEmptyLines').prop('checked'),
		preview: parseInt($('#preview').val() || 0),
		step: $('#stream').prop('checked') ? stepFn : undefined,
		encoding: $('#encoding').val(),
		worker: $('#worker').prop('checked'),
		comments: $('#comments').val(),
		complete: completeFn,
		error: errorFn,
		download: inputType == "remote"
	};
}

function stepFn(results, parser) {
	stepped++;
	if (results) {
		if (results.data)
			rowCount += results.data.length;
		if (results.errors) {
			errorCount += results.errors.length;
			firstError = firstError || results.errors[0];
		}
	}
}

function completeFn(results) {
	end = now();

	if (results && results.errors) {
		if (results.errors) {
			errorCount = results.errors.length;
			firstError = results.errors[0];
		}
		if (results.data && results.data.length > 0)
			rowCount = results.data.length;
	}

	printStats("Parse complete");
	console.log("    Results:", results);

	// icky hack
	setTimeout(enableButton, 100);
}

function errorFn(err, file) {
	end = now();
	console.log("ERROR:", err, file);
	enableButton();
}

function enableButton() {
	$('#submit').prop('disabled', false);
}

function now() {
	return typeof window.performance !== 'undefined'
		? window.performance.now()
		: 0;
}