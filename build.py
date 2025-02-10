# Copyright 2018-2025 Felix Garcia Carballeira, Diego Camarmas Alonso, Alejandro Calderon Mateos, Jorge Ramos Santana

# This file is part of CREATOR.

# CREATOR is free software: you can redistribute it and/or modify
# it under the terms of the GNU Lesser General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.

# CREATOR is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Lesser General Public License for more details.

# You should have received a copy of the GNU Lesser General Public License
# along with CREATOR.  If not, see <http://www.gnu.org/licenses/>.

import os
import sys
import subprocess
import concurrent.futures
import argparse
import time
import json
from typing import List, Dict
from pathlib import Path

VERSION = "2.0.0"

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

          CREATOR Build System v{VERSION}
================================================
    """
    print(banner)

def parse_args():
    parser = argparse.ArgumentParser(description='CREATOR build script')
    parser.add_argument('--debug', action='store_true', help='Build debug versions')
    parser.add_argument('--nocache', action='store_true', help='Disable build caching')
    return parser.parse_args()

def is_deps_installation_needed() -> bool:
    """Check if dependencies need to be installed"""
    if not os.path.exists('node_modules'):
        return True
        
    if not os.path.exists('package-lock.json'):
        return True
        
    # Check if package.json is newer than node_modules
    package_mtime = os.path.getmtime('package.json')
    modules_mtime = os.path.getmtime('node_modules')
    
    return package_mtime > modules_mtime

def check_package_json():
    """Validate package.json and handle dependency installation if needed"""
    try:
        if not os.path.exists('package.json'):
            raise FileNotFoundError("package.json not found")
            
        if is_deps_installation_needed():
            print(f"{Colors.BLUE}Installing dependencies...{Colors.NC}")
            subprocess.run(["bun", "install"], check=True)
            print(f"{Colors.GREEN}Dependencies installed successfully{Colors.NC}")
        else:
            print(f"{Colors.GREEN}Dependencies are up to date{Colors.NC}")
            
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"{Colors.RED}Failed to install dependencies: {e}{Colors.NC}")
        print(f"{Colors.RED}Try running 'bun install' manually to debug{Colors.NC}")
        return False
    except FileNotFoundError as e:
        print(f"{Colors.RED}{str(e)}{Colors.NC}")
        return False

def check_dependencies():
    """Simplified dependency check using npm"""
    return check_package_json()

def check_environment() -> bool:
    try:
        subprocess.run(["bun", "--version"], check=True, capture_output=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        print(f"{Colors.RED}Error: Bun is required but not detected in system PATH{Colors.NC}")
        print(f"{Colors.BLUE}Install Bun with: curl -fsSL https://bun.sh/install | bash{Colors.NC}")
        return False

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

def get_file_hash(filepath: str) -> float:
    """Get file modification time as a cache key"""
    try:
        return os.path.getmtime(filepath)
    except OSError:
        return 0

def load_build_cache() -> Dict:
    """Load the build cache from disk"""
    cache_file = Path('.build_cache')
    if cache_file.exists():
        try:
            with open(cache_file) as f:
                return json.load(f)
        except (json.JSONDecodeError, OSError):
            pass
    return {}

def save_build_cache(cache: Dict):
    """Save the build cache to disk"""
    try:
        with open('.build_cache', 'w') as f:
            json.dump(cache, f)
    except OSError:
        print(f"{Colors.RED}Warning: Failed to save build cache{Colors.NC}")

def is_rebuild_needed(target: str, source_files: List[str], cache: Dict) -> bool:
    """Check if target needs rebuilding based on source file changes"""
    if args.nocache:
        return True
        
    if not os.path.exists(target):
        return True
        
    target_mtime = get_file_hash(target)
    cached_mtimes = cache.get(target, {})
    
    for src in source_files:
        current_mtime = get_file_hash(src)
        if current_mtime != cached_mtimes.get(src, 0):
            return True
            
    return False

def update_cache_for_target(target: str, source_files: List[str], cache: Dict):
    """Update cache entries for a successfully built target"""
    cache[target] = {
        src: get_file_hash(src) for src in source_files
    }

def build_web_min(web_files: List[str], cache: Dict):
    target = "js/min.creator_web.js"
    if not is_rebuild_needed(target, web_files, cache):
        print(f"• Skipping {target} (up to date)")
        return
        
    print("• Generating min.creator_web.js...")
    concatenate_files(web_files, "js/debug.creator_web.js")
    subprocess.run(["bun", "run", "terser", "-o", target, "js/debug.creator_web.js"], check=True)
    if not args.debug:
        os.remove("js/debug.creator_web.js")
    update_cache_for_target(target, web_files, cache)


def build_web_debug(web_files: List[str], cache: Dict):
    target = "js/debug.creator_web.js"
    if not is_rebuild_needed(target, web_files, cache):
        print(f"• Skipping {target} (up to date)")
        return
        
    print("• Generating debug.creator_web.js...")
    concatenate_files(web_files, target)
    update_cache_for_target(target, web_files, cache)

def build_node_min(node_files: List[str], cache: Dict):
    target = "js/min.creator_node.js"
    if not is_rebuild_needed(target, node_files, cache):
        print(f"• Skipping {target} (up to date)")
        return
        
    print("• Generating min.creator_node.js...")
    subprocess.run([
        "npx", "terser", *node_files,
        "--output", target,
        "--source-map", "filename='min.creator_node.js.map',url='min.creator_node.js.map',root='..'"
    ], check=True)
    update_cache_for_target(target, node_files, cache)

def build_node_debug(node_files: List[str], cache: Dict):
    target = "js/debug.creator_node.js"
    if not is_rebuild_needed(target, node_files, cache):
        print(f"• Skipping {target} (up to date)")
        return
        
    print("• Generating debug.creator_node.js...")
    concatenate_files(node_files, target)
    update_cache_for_target(target, node_files, cache)

def main():
    start_time = time.perf_counter()
    global args
    args = parse_args()
    print_banner()
    
    if not check_environment():
        sys.exit(1)
    
    build_type = []
    if args.debug:
        build_type.append(f"{Colors.BLUE}Debug + Release{Colors.NC}")
    else:
        build_type.append(f"{Colors.GREEN}Release{Colors.NC}")
    
    if args.nocache:
        build_type.append(f"{Colors.RED}No Cache{Colors.NC}")
    
    print(f"Build configuration: {' | '.join(build_type)}\n")

    if not check_environment() or not check_dependencies():
        sys.exit(1)
    print(f"\n{Colors.BLUE}Initiating build process...{Colors.NC}\n")

    try:
        # Load build cache if not disabled
        cache = {} if args.nocache else load_build_cache()

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

        
        # Define build tasks with cache parameter
        build_tasks = [(build_web_min, [web_files, cache])]
        if args.debug:
            build_tasks.extend([
                (build_web_debug, [web_files, cache]),
                (build_node_debug, [node_files, cache])
            ])
        build_tasks.append((build_node_min, [node_files, cache]))

        # Execute tasks concurrently
        with concurrent.futures.ThreadPoolExecutor() as executor:
            futures = [executor.submit(task, *args) for task, args in build_tasks]
            concurrent.futures.wait(futures)
            
            # Check for exceptions
            for future in futures:
                if future.exception():
                    raise future.exception()

        # Save updated cache if not disabled
        if not args.nocache:
            save_build_cache(cache)

        build_time = time.perf_counter() - start_time
        print(f"\n{Colors.GREEN}Build completed successfully in {build_time:.2f}s{Colors.NC}")
        if args.debug:
            print(f"{Colors.BLUE}Debug artifacts have been generated{Colors.NC}")

    except Exception as e:
        print(f"{Colors.RED}Build process failed:{Colors.NC} {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()