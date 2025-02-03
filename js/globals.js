/*
 *  Copyright 2018-2025 Felix Garcia Carballeira, Alejandro Calderon Mateos, Diego Camarmas Alonso
 *
 *  This file is part of CREATOR.
 *
 *  CREATOR is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Lesser General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  CREATOR is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Lesser General Public License for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public License
 *  along with CREATOR.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

let architecture_available = [];
let load_architectures_available = [];
let load_architectures = [];
let back_card = [];
let architecture_hash = [];
let architecture = {arch_conf:[], memory_layout:[], components:[], instructions:[], directives:[]};
let architecture_json = ""
let app;
let align;
let word_size_bits  = 32 ; // TODO: load from architecture
let word_size_bytes = word_size_bits / 8 ; // TODO: load from architecture
let register_size_bits = 32 ; 
let main_memory = [] ;
    //  [
    //    addr: { addr: addr, bin: "00", def_bin: "00", tag: null, data_type: ref <main_memory_datatypes>, reset: true, break: false },
    //    ...
    //  ]

let main_memory_datatypes = {} ;
    //  {
    //    addr: { address: addr, "type": type, "address": addr, "value": value, "default": "00", "size": 0 },
    //    ...
    //  }

let memory_hash = [ "data_memory", "instructions_memory", "stack_memory" ] ;
    // main segments
