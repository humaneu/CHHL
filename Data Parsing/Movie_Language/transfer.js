conn = new Mongo();
db = conn.getDB("cis550project");

print("id, language");
db.movieInfo.find().forEach(function(myDoc){
	print(myDoc.id + "," + myDoc.translations.language + "\n";
})