//mongo script_name.js > output_file.txt

conn = new Mongo();
db = conn.getDB("cis550project");

//db = connect("localhost:27017/cis550project")

cursor = db.TMDBpersonInfo.find({},{_id : 0, personId : 1, name : 1, dayofbirth : 1, dayofdeath : 1, profile : 1,biography : 1});

while (cursor.hasNext()) {
	printjson(cursor.next());
}
