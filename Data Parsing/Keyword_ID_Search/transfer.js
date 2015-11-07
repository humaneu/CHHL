conn = new Mongo();
db = conn.getDB("cis550project");

print("id, keywords");
db.searchInfo.find().forEach(function(myDoc){
	print(myDoc.id + "," + myDoc.keywords);
})