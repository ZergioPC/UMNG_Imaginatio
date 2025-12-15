extends Node

var USER_DATA:Dictionary
var firstTime:bool = false

const API_NAME:String = "'ImaginatioWeb'"

func onLoad() -> void:
	USER_DATA = getData()
	if (USER_DATA["name"].is_empty()):
		firstTime = true
		
	InventoryManager.loadStorageData(USER_DATA["inventory"])
	UserManager.PET_NAME = USER_DATA["name"]
	UserManager.MONEY = USER_DATA["likes"]
	UserManager.HOUSE_FLOOR = USER_DATA["floor"]
	UserManager.HOUSE_ROOF = USER_DATA["roof"]
	UserManager.HOUSE_WALL = USER_DATA["wall"]

func formatData(
	petName:String, 
	likes:int, 
	inventory:Array,
	suelo:int,
	roof:int,
	wall:int
):
	var rawInventory = []
	for item in inventory:
		if(item["type"] == "prop"):
			rawInventory.append({"id": item["id"],"pos": item["pos"],"isUse": item["isUse"]})
		elif(item["type"] == "skin"):
			rawInventory.append({"id": item["id"],"isUse": item["isUse"]})
	return {
		"name": petName,
		"likes": likes,
		"floor": suelo,
		"wall": wall,
		"roof": roof,
		"inventory": rawInventory
	}

func saveData(data:Dictionary) -> void:
	var json = JSON.stringify(data)
	var query = "localStorage.setItem(" + API_NAME + ", %s);" % JSON.stringify(json)
	JavaScriptBridge.eval(query)
	print(query)
	
func getData() -> Dictionary :
	var json_data = JavaScriptBridge.eval("localStorage.getItem(" + API_NAME + ")")
	if (not json_data):
		return {
			"name": "",
			"likes": 20,
			"floor": 2025101,
			"roof": 2025104,
			"wall": 2025105,
			"inventory": [
				{"id": 2025101,"isUse": true},
				{"id": 2025104,"isUse": true},
				{"id": 2025107,"isUse": true},
			]
		}
	else:
		var parsed = JSON.parse_string(json_data)
		return parsed

func fetchData():
	const file_path:String = "res://data.json"
	var file := FileAccess.open(file_path, FileAccess.READ)
	if file == null:
		push_error("Failed to open JSON file")
		return null

	var json_text := file.get_as_text()
	file.close()

	var json := JSON.new()
	var error := json.parse(json_text)
	if error != OK:
		push_error("JSON parse error: %s" % json.get_error_message())
		return null

	return json.data
