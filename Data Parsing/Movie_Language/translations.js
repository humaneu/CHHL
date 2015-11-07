conn = new Mongo();
db = conn.getDB("cis550project");

cursor = db.TMDBmovieInfo.aggregate({$project:{_id:0,id:1,translations:1}},{$unwind:"$translations"});

while (cursor.hasNext()) {
	printjson(cursor.next());
}
