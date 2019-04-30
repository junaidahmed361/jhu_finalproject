// this function executes our search via an AJAX call
function runSearch( term ) {
    // hide and clear the previous results, if any
    $('#results').hide();
    //$('#tabs').hide();
    //$('#tabs').bind('tabsselect', function(event, ui) {     $(ui.panel).empty(); });
    //$('#tabs').refresh();
    //$('tbody').empty();
    // transforms all the form parameters into a string we can send to the server
    var frmStr = $('#gene_search').serialize();
    $.ajax({
        url: './search_product.cgi',
        dataType: 'json',
        data: frmStr,
        success: function(data, textStatus, jqXHR) {
            processJSON(data);
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert("Failed to perform gene search! textStatus: (" + textStatus +
                  ") and errorThrown: (" + errorThrown + ")");
        }
    });
}

function removeTab() {
    for(i=0;i<5;i++){
    // Remove the tab
    var tabIdStr = "#tabs-" + i;    
    // Remove the panel   $
    $( tabIdStr ).remove();  
    // Refresh the tabs widget   
    $("tabs").tabs( "refresh" );    
    // Remove the tab   
    var hrefStr = "a[href='" + tabIdStr + "']";   
    $( hrefStr ).closest("li").remove();
    $( "#tabs" ).tabs("refresh");
    }
    //$('#tabs').hide();
    runSearch();
    //$('#tabs').show();
}

// this processes a passed JSON structure representing gene matches and draws it
//  to the result table
function processJSON( data ) {
   // $(".se-pre-con").fadeIn("slow");
    console.log('I am in processJSON');
    if($('.contentDiv2').length){
        for(i=0;i<5;i++){
            var tabIdStr = "tabs"+i;
            $( "span[id="+tabIdStr+"]" ).remove();
            //var hrefStr = "a[href='#" + tabIdStr + "']";
            //$( hrefStr ).closest("li").remove();
            $('.contentDiv'+i).remove();
            $('#tabLinks').empty();
        }
        $("#tabs").tabs("refresh");
    }
    // set the span that lists the match count
    $('#match_count').text( data.match_count );
    
    // this will be used to keep track of row identifiers
    var next_row_num = 1;
    var count = 0;
    // iterate over each match and add a row to the result table for each
    $.each( data.matches, function(i, item) {
        $("body").append('<div class="contentDiv'+i+'"><h2><mark style="font-weight:bold;text-decoration:underline;">Product</mark></h2><p>' + item.product + '</p><h2 style="word-wrap: break-word;"><mark style="font-weight:bold;text-decoration:underline;">Residue</mark></h2><p style="word-wrap: break-word;">' + item.residue + '</p><h2 style="word-wrap: break-word;"><mark style="font-weight:bold;text-decoration:underline;">Protein Data Bank Information</mark></h2>');
        var pr_range = item.protinfo.length
        //$('.contentDiv'+i).append('<p style="text-decoration: underline; font-weight:bold;">Structure Id</p>');
        for(var j=0;j<pr_range;j++){
	    //$('.contentDiv'+i).append('<p style="text-decoration: underline; font-weight:bold;">Structure Id</p>');
	    $('.contentDiv'+i).append('<h3 style="text-decoration: underline; font-weight:bold;">PDB Match #'+(j+1)+':</h3>');
	    $('.contentDiv'+i).append('<p><span style="font-weight:bold;">Structure Id: </span><a href="https://www.rcsb.org/structure/'+item.protinfo[j].structureId+'" target="_blank">'+item.protinfo[j].structureId+'</a></p>');
	    $('.contentDiv'+i).append('<p><span style="font-weight:bold;">Pubmed Reference Id: </span><a href="https://www.ncbi.nlm.nih.gov/pubmed/?term='+item.protinfo[j].pubmedId+'%5Buid%5D" target="_blank">'+item.protinfo[j].pubmedId+'</a></p>');
	    $('.contentDiv'+i).append('<p><span style="font-weight:bold;">Structure Publication Title:</span> '+item.protinfo[j].title+'</p>');
	    $('.contentDiv'+i).append('<p><span style="font-weight:bold;">Publication Authors:</span> '+item.protinfo[j].structure_authors+'</p>');
	    $('.contentDiv'+i).append('<p><span style="font-weight:bold;">Peptide Resolution:</span> '+item.protinfo[j].resolution+'</p>');
	    $('.contentDiv'+i).append('<p><span style="font-weight:bold;">Number of Residues:</span> '+item.protinfo[j].nr_residues+'</p>');
	    $('.contentDiv'+i).append('<p><span style="font-weight:bold;">Number of Atoms:</span> '+item.protinfo[j].nr_atoms+'</p>');
	    //$('.contentDiv'+i).append('<p style="font-weight:bold;">'+item.plot'</p>');
	}
	//$('.contentDiv'+i).append('<p style="font-weight:bold;">'+item.plot+'</p>');
        //$('.contentDiv'+i).append('<p>Average Temperature Factor: '+item.avg_temp_factor+'</p>');
        $("#tabs").append('<div id="tabs-' + i + '"></div>');
        $("#tabLinks").append('<li><a href="#tabs-' + i + '">' + item.locus_id + '</a></li>');
	count = i;
    });
    
    for (var index=0; index<=count; index++){
    	$(".contentDiv"+index).appendTo($("#tabs-"+index));
    }
    //});
    $("#tabs").tabs();
    $("#tabs").tabs("refresh");
    $("#tabs").tabs({active:0});
    //$("#tabs").show();
    // now show the result section that was previously hidden
    //$(".se-pre-con").fadeOut("slow");
    $('#results').show();
    
}





// run our javascript once the page is ready
$(document).ready( function() {
    //$(".se-pre-con").fadeOut("slow");
    $(document).ajaxStart(function(){     $(".se-pre-con").css("display", "block");   });
    $(document).ajaxComplete(function(){     $(".se-pre-con").css("display", "none");   }); 
    $('#submit').click( function() {
        //if(!$("#tabs").tabs()){runSearch();}
        //else{removeTab();}
        runSearch();
        return false;  // prevents 'normal' form submission
    });
});
