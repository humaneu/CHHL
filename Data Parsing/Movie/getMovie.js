//mongo script_name.js > output_file.txt

conn = new Mongo();
db = conn.getDB("cis550project");

cursor = db.TMDBmovieInfo.find({},{_id:0, id:1, title:1, backdrop: 1, runtime : 1, adult:1, poster:1, homepage:1 });

while (cursor.hasNext()) {
	printjson(cursor.next());
}
