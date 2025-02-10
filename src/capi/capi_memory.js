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
'use strict';
import { architecture } from '../core';
import { creator_executor_exit } from '../executor/executor';
import { writeMemory, readMemory } from '../memory/memoryOperations';
import { creator_memory_value_by_type } from '../memory/memoryManager';
import { capi_bad_align, capi_raise } from './capi_validation';
import { crex_findReg } from '../register/registerLookup';
import { creator_callstack_newWrite, creator_callstack_newRead } from '../sentinel/sentinel';

/*
 *  CREATOR instruction description API:
 *  Memory access
 */
/*
 * Name:        mp_write - Write value into a memory address
 * Sypnosis:    mp_write (destination_address, value2store, byte_or_half_or_word)
 * Description: similar to memmove/memcpy, store a value into an address
 */
// Memory operations
export const CAPI_MEMORY = {
  mem_write: function(addr, value, type, reg_name) {
    // Implementation of capi_mem_write  
    var size = 1;

    if (capi_bad_align(addr, type)) {
      capi_raise("The memory must be align");
      creator_executor_exit(true);
    }

    var addr_16 = parseInt(addr, 16);
    if ((addr_16 >= parseInt(architecture.memory_layout[0].value)) && 
        (addr_16 <= parseInt(architecture.memory_layout[1].value))) 
    {
      capi_raise('Segmentation fault. You tried to write in the text segment');
      creator_executor_exit(true);
    }

    try {
      writeMemory(value, addr, type);
    } 
    catch(e) {
      capi_raise("Invalid memory access to address '0x" + addr.toString(16) + "'");
      creator_executor_exit(true);
    }

    var ret = crex_findReg(reg_name);
    if (ret.match === 0) {
      return;
    }

    var i = ret.indexComp;
    var j = ret.indexElem;

    creator_callstack_newWrite(i, j, addr, type);
  },

  mem_read: function(addr, type, reg_name) {
    // Implementation of capi_mem_read
    var size = 1;
    var val = 0x0;

    if (capi_bad_align(addr, type)) {
      capi_raise("The memory must be align");
      creator_executor_exit(true); 
    }

    var addr_16 = parseInt(addr, 16);
    if ((addr_16 >= parseInt(architecture.memory_layout[0].value)) && 
        (addr_16 <= parseInt(architecture.memory_layout[1].value))) 
    {
      capi_raise('Segmentation fault. You tried to read in the text segment');
      creator_executor_exit(true);
    }

    try {
      val = readMemory(addr, type);
    }
    catch(e) {
      capi_raise("Invalid memory access to address '0x" + addr.toString(16) + "'");
      creator_executor_exit(true);
    }

    var ret = creator_memory_value_by_type(val, type);

    var find_ret = crex_findReg(reg_name);
    if (find_ret.match === 0) {
      return ret;
    }

    var i = find_ret.indexComp;
    var j = find_ret.indexElem;
    
    creator_callstack_newRead(i, j, addr, type);

    return ret;
  }
};