extends Node

var USER_DATA:Dictionary

const API_NAME:String = "'ImaginatioWeb'"

func onLoad() -> void:
	USER_DATA = getData()
	if (USER_DATA["name"] == ""):
		print("primera vez")
	else:
		print("normal user")
		UserManager.PET_NAME = USER_DATA["name"]
		UserManager.MONEY = USER_DATA["likes"]
		InventoryManager.loadStorageData(USER_DATA["inventory"])

func formatData(petName:String, likes:int, inventory:Array):
	var rawInventory = []
	for item in inventory:
		if(item["type"] == "prop"):
			rawInventory.append({"id": item["id"],"pos": item["pos"],"isUse": item["isUse"]})
		elif(item["type"] == "skin"):
			rawInventory.append({"id": item["id"],"isUse": item["isUse"]})
	return {
		"name": petName,
		"likes": likes,
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
			"likes": 0,
			"inventory": []
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
