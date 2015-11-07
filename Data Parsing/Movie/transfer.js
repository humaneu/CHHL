conn = new Mongo();
db = conn.getDB("cis550project");

print("id, title, backdrop, runtime, adult, poster, homepage");
db.movieInfo.find().forEach(function(myDoc){
	print(myDoc.id + "," + myDoc.title + "," + myDoc.backdrop + "," + myDoc.runtime + "," + myDoc.adult + "," + myDoc.poster + "," + myDoc.homepage + "\n";
})