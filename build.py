#!/usr/bin/env python3

import os
import sys
import subprocess
from typing import List

VERSION = "2.0.0"  # Add version constant

# ANSI Colors
class Colors:
    RED = '\033[0;31m'
    GREEN = '\033[0;32m'
    BLUE = '\033[0;34m'
    NC = '\033[0m'  # No Color

def print_banner():
    banner = f"""
   ____ ____  _____    _  _____ ___  ____  
  / ___|  _ \\| ____|  / \\|_   _/ _ \\|  _ \\ 
 | |   | |_) |  _|   / _ \\ | || | | | |_) |
 | |___|  _ <| |___ / ___ \\| || |_| |  _ < 
  \\____|_| \\_\\_____/_/   \\_\\_| \\___/|_| \\_\\

==========  Package Builder v{VERSION}  ==========
    """
    print(banner)

def check_dependencies():
    print(f"\n{Colors.BLUE}Checking dependencies...{Colors.NC}")
    deps = ["terser", "jshint", "colors", "yargs", "readline-sync", "source-map-support"]
    missing_deps = []
    
    for dep in deps:
        try:
            subprocess.run(["npm", "list", dep], capture_output=True, check=True)
        except subprocess.CalledProcessError:
            missing_deps.append(dep)
    
    if missing_deps:
        print(f"{Colors.RED}Installing missing packages:{Colors.NC} {' '.join(missing_deps)}")
        subprocess.run(["npm", "install"] + missing_deps)
    else:
        print(f"{Colors.GREEN}All dependencies are installed{Colors.NC}")

def concatenate_files(files: List[str], output_file: str):
    with open(output_file, 'w') as outfile:
        for file in files:
            if os.path.exists(file):
                with open(file, 'r') as infile:
                    outfile.write(infile.read())
                    outfile.write('\n')

def get_js_files_recursively(directory: str) -> List[str]:
    js_files = []
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.js'):
                # Convert to relative path and use forward slashes
                full_path = os.path.join(root, file)
                relative_path = os.path.relpath(full_path)
                js_files.append(relative_path.replace('\\', '/'))
    return sorted(js_files)  # Sort for consistent order

def main():
    # Enable debug mode if arguments provided
    if len(sys.argv) > 1:
        import pdb; pdb.set_trace()

    print_banner()
    check_dependencies()
    print(f"\n{Colors.BLUE}Starting build process...{Colors.NC}\n")

    # Web version files
    web_files = [
        "js/globals.js",
        "js/creator_bigint.js",
        "js/creator_ga.js",
        "js/creator_preload.js",
        "js/creator_util.js",
        "js/creator_track_stack.js",
        "js/creator_sentinel.js",
        "js/creator_definition_api.js",
        "js/creator_registerfile.js",
        "js/creator_memory.js",
        "js/creator_compiler.js",
        "js/creator_executor.js",
    ]

    # Add all component files
    web_files.extend(get_js_files_recursively('components'))

    # Add the final files
    web_files.extend([
        "js/creator_ui.js",
        "js/app.js"
    ])

    # Node version files
    node_files = [
        "js/globals.js",
        "js/creator_bigint.js",
        "js/creator_ga.js",
        "js/creator_util.js",
        "js/creator_sentinel.js",
        "js/creator_definition_api.js",
        "js/creator_track_stack.js",
        "js/creator_registerfile.js",
        "js/creator_memory.js",
        "js/creator_compiler.js",
        "js/creator_executor.js",
        "js/creator_node.js"
    ]

    print("  Packing:")
    
    # Build web version
    print("  * min.creator_web.js...")
    concatenate_files(web_files, "js/creator_web.js")
    subprocess.run(["npx", "terser", "-o", "js/min.creator_web.js", "js/creator_web.js"])
    os.remove("js/creator_web.js")

    # Build node version
    print("  * min.creator_node.js...")
    subprocess.run([
        "npx",
        "terser",
        *node_files,
        "--output", "js/min.creator_node.js",
        "--source-map", "filename='min.creator_node.js.map',url='min.creator_node.js.map',root='..'"
    ])

    # Build debug version
    print("  * debug.creator_node.js...")
    concatenate_files(node_files, "js/debug.creator_node.js")

    print("\n  CREATOR packed (if no error was shown).\n")

if __name__ == "__main__":
    main()