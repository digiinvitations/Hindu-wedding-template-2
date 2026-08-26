import json

with open("src/data/wedding_config.json", "r") as f:
    config = json.load(f)

config["bride"]["name"] = "Hitakshi sharma"
config["bride"]["fatherName"] = "Pradeep sharma"
config["bride"]["motherName"] = "Rekha sharma"

config["groom"]["name"] = "Trishi Bhatt"
config["groom"]["fatherName"] = "Devendra Kumar"
config["groom"]["motherName"] = "Asha sharma"

with open("src/data/wedding_config.json", "w") as f:
    json.dump(config, f, indent=2)

print("Config updated")
