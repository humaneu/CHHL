conn = new Mongo();
db = conn.getDB("cis550project");

cursor = db.TMDBmovieInfo.aggregate({$project:{_id:0,id:1,releases:1}},{$unwind:"$releases"});

while (cursor.hasNext()) {
	printjson(cursor.next());
}
