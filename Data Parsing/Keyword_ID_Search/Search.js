conn = new Mongo();
db = conn.getDB("cis550project");

cursor = db.TMDBmovieInfo.aggregate({$project:{_id:0,id:1,keywords:1}},{$unwind:"$keywords"});

while (cursor.hasNext()) {
	printjson(cursor.next());
}

// db.TMDBmovieInfo.find({languages : {$exists : true, $not:{$size : 0}}}).count()
// result: 0