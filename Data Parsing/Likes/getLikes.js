conn = new Mongo();
db = conn.getDB("cis550project");

//db = connect("localhost:27017/cis550project")

cursor = db.TMDBmovieInfo.find({},{_id : 0, id : 1, revenue : 1, votes : 1, popularity : 1, userrating : 1});

while (cursor.hasNext()) {
	printjson(cursor.next());
}
