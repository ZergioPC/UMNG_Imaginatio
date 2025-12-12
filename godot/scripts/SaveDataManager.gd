extends Node

# Inventory: [id:int ,position:Vector3]
var USER_DATA:Dictionary

const API_NAME:String = "ImaginatioWeb"

func onLoad() -> void:
	USER_DATA = getData()
	if (USER_DATA["name"] == ""):
		print("primera vez")
	else:
		print("normal")

func saveData(data:Dictionary) -> void:
	var json = JSON.stringify(data)
	var query = "localStorage.setItem(" + API_NAME + "," + json + ")"
	JavaScriptBridge.eval(query)
	
func getData() -> Dictionary :
	var json_data = JavaScriptBridge.eval("localStorage.getItem(" + API_NAME + ")")
	if (not json_data):
		return {
			"name": "",
			"money": 0,
			"inventory": []
		}
	else:
		return JSON.parse_string(json_data)
