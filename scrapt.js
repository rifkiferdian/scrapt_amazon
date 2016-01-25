var request = require('request');
var cheerio = require('cheerio');
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12",
  database: "scraptAPBD"
});



function scrapt(page){
	request('https://www.amazon.com/review/top-reviewers/ref=cm_cr_tr_link_2?ie=UTF8&page='+page, function (error, response, html) {
	  if (!error && response.statusCode == 200) {
	    
	    var $ = cheerio.load(html);

	    //NAME
	    var nama = $('.a-bordered.a-horizontal-stripes.a-align-center.a-spacing-top-none.a-size-small.crDataGrid.neg-margin tr').map(function() {
		    var Id = $(this).find("td").eq(2).find("a").find("b").html(); 
		    return Id;    
		 }).get(); 

	    //RANK
	    var rank = $('.a-bordered.a-horizontal-stripes.a-align-center.a-spacing-top-none.a-size-small.crDataGrid.neg-margin tr').map(function() {
		    var Id = $(this).find("td").eq(0).html(); 
		    return Id;
		 }).get();

	    //URL Review
		 var url = $('.a-bordered.a-horizontal-stripes.a-align-center.a-spacing-top-none.a-size-small.crDataGrid.neg-margin tr').map(function() {
		    var Id = $(this).find("td").eq(2).find('.tiny').find('a').attr('href'); 
		    return Id;    
		 }).get();  

		// console.log("nama : "+JSON.stringify(data, null, 2));

		for (var i = 0; i <= nama.length-1 ; i++) {

			con.query('INSERT INTO `amazon`(`nama`,`rank`,`url`) VALUES ("'+nama[i]+'","'+rank[i].substring(1)+'","https://www.amazon.com'+url[i]+'")', function(err,res){
			  if(err) throw err;

			  console.log('Last insert ID:', res.insertId);
			});
		};

		page+=1;
		if(nama.length>0) scrapt(page);
	  }
	});
}

scrapt(1);