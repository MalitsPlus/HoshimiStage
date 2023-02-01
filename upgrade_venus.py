from os import _exit as exit
import sys
import json
from pathlib import Path

def main():
  print("Start updating package.json...")
  if sys.argv.__len__() < 2:
    print("No new version string was given, exiting")
    exit(-1)
  pkg = json.loads(Path("package.json").read_text())
  hsm_versions = str(pkg["version"]).split(".")
  hsm_versions[-1] = str(int(hsm_versions[-1]) + 1)
  pkg["version"] = ".".join(hsm_versions)
  pkg["dependencies"]["hoshimi-venus"] = "^" + sys.argv[1]
  with open("package.json", "w", encoding="utf8") as fp:
    json.dump(pkg, fp, indent=2)
  print("package.json was updated.")

if __name__ == "__main__":
  main()
