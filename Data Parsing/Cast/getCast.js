conn = new Mongo();
db = conn.getDB("cis550project");

//db = connect("localhost:27017/cis550project")

cursor = db.TMDBmovieInfo.aggregate({$project:{_id:0,id:1,cast:1}},{$unwind:"$cast"});

while (cursor.hasNext()) {
	printjson(cursor.next());
}
