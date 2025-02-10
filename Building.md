# CREATOR Build System

## Overview

The CREATOR Build System is a Python-based script designed to automate the process of building JavaScript project files for both web and Node.js environments. It manages the compilation, minification, and packaging of source files.

## Version
- Current Version: 2.0.0

## Dependencies

The script requires the following Node.js packages:
- terser
- jshint
- colors
- yargs
- readline-sync
- source-map-support
- vue-loader
- @vue/compiler-sfc
- webpack
- webpack-cli

Ensure that Node.js and npm are installed and available in the system PATH.

## Installation

To make sure all dependencies are installed, run:
```
npm install
```

## Usage

Run the script using Python 3:

```
python3 build_script.py [--debug]
```

### Command-Line Arguments

- `--debug`: If specified, the script will also create debug versions of the files alongside the release versions.

## Build Process

1. **Check Environment:**
   - Verifies the existence of Node.js and npm.

2. **Check Dependencies:**
   - Validates that all required npm packages are installed. If not, attempts to install them.

3. **Build Configurations:**
   - The script can generate both minified and debug versions of files based on the debug flag.

4. **Web Version:**
   - Includes JavaScript files necessary for the web environment.
   - Generates `min.creator_web.js` and optionally `debug.creator_web.js`.

5. **Node Version:**
   - Includes JavaScript files necessary for the Node.js environment.
   - Generates `min.creator_node.js` and optionally `debug.creator_node.js`.

6. **Concatenation and Minification:**
   - Uses `terser` to minify JavaScript files.

## Script Details

### Main Functions

- `parse_args`: Parses command-line arguments.
- `check_environment`: Checks if Node.js and npm are installed.
- `check_dependencies`: Ensures all npm dependencies are installed.
- `concatenate_files`: Combines content from multiple files into one output file.
- `get_js_files_recursively`: Recursively retrieves JavaScript files from a directory.
- `build_web_min`: Builds the minified web version of the project.
- `build_web_debug`: Builds the debug web version of the project.
- `build_node_min`: Builds the minified Node version of the project.
- `build_node_debug`: Builds the debug Node version of the project.

### Error Handling

If any part of the build process fails, the script will output an error message and terminate the process.

### Output

Upon successful completion, the build script outputs minified and/or debug versions of JavaScript files into the `js` directory.
