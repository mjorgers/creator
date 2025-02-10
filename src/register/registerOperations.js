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
import { bi_intToBigInt, bi_BigIntTofloat, bi_BigIntTodouble, bi_floatToBigInt, bi_doubleToBigInt } from '../utils/bigint';
import { architecture } from '../core';
import { execution_index } from '../executor/executor';
import { packExecute, writeStackLimit } from '../executor/executor';
import { instructions } from '../compiler/compiler';
import { updateDouble, updateSimple } from './fpRegisterSync';
import { creator_callstack_writeRegister } from '../sentinel/sentinel';
import { console_log } from '../utils/creator_logger.mjs';

export function readRegister(indexComp, indexElem, register_type) {
  var draw = {
    space: [],
    info: [],
    success: [],
    danger: [],
    flash: []
  };

  if ((architecture.components[indexComp].elements[indexElem].properties.includes("read") !== true)) {
    for (var i = 0; i < instructions.length; i++) {
      draw.space.push(i);
    }
    draw.danger.push(execution_index);

    throw packExecute(true, 'The register ' + architecture.components[indexComp].elements[indexElem].name.join(' | ') + ' cannot be read', 'danger', null);
  }

  if ((architecture.components[indexComp].type == "ctrl_registers") ||
    (architecture.components[indexComp].type == "int_registers")) {
    console_log(`Reading ${architecture.components[indexComp].type} [${indexComp}][${indexElem}] ${architecture.components[indexComp].elements[indexElem].name.join('|')}: ${architecture.components[indexComp].elements[indexElem].value}`, "DEBUG");
    return bi_intToBigInt(architecture.components[indexComp].elements[indexElem].value);
  }

  if (architecture.components[indexComp].type == "fp_registers") {
    if (architecture.components[indexComp].double_precision === false) {
      const value = bi_BigIntTofloat(architecture.components[indexComp].elements[indexElem].value);
      console_log(`Reading float register [${indexComp}][${indexElem}] ${architecture.components[indexComp].elements[indexElem].name.join('|')}: ${value}`, "DEBUG");
      return value;
    }
    else {

      if (architecture.components[indexComp].double_precision_type == "linked") {
        const value = bi_BigIntTodouble(architecture.components[indexComp].elements[indexElem].value);
        console_log(`Reading linked double register [${indexComp}][${indexElem}] ${architecture.components[indexComp].elements[indexElem].name.join('|')}: ${value}`, "DEBUG");
        return value;
      }

      else {
        if (typeof register_type === 'undefined') {
          register_type = "DFP-Reg";
        }
        if (register_type === 'SFP-Reg') {
          const value = bi_BigIntTofloat(architecture.components[indexComp].elements[indexElem].value);
          console_log(`Reading single-precision register [${indexComp}][${indexElem}] ${architecture.components[indexComp].elements[indexElem].name.join('|')}: ${value}`, "DEBUG");
          return value;
        }
        if (register_type === 'DFP-Reg') {
          const value = bi_BigIntTodouble(architecture.components[indexComp].elements[indexElem].value);
          console_log(`Reading double-precision register [${indexComp}][${indexElem}] ${architecture.components[indexComp].elements[indexElem].name.join('|')}: ${value}`, "DEBUG");
          return value;
        }
      }
    }
  }
}
export function writeRegister(value, indexComp, indexElem, register_type) {
  var draw = {
    space: [],
    info: [],
    success: [],
    danger: [],
    flash: []
  };

  if (value == null) {
    return;
  }

  if ((architecture.components[indexComp].type == "int_registers") ||
    (architecture.components[indexComp].type == "ctrl_registers")) {
    if ((architecture.components[indexComp].elements[indexElem].properties.includes('write') !== true)) {
      if ((architecture.components[indexComp].elements[indexElem].properties.includes('ignore_write') !== false)) {
        return;
      }

      for (var i = 0; i < instructions.length; i++) {
        draw.space.push(i);
      }
      draw.danger.push(execution_index);

      throw packExecute(true, 'The register ' + architecture.components[indexComp].elements[indexElem].name.join(' | ') + ' cannot be written', 'danger', null);
    }
    // value should always be a bigint (?)
    // calling the conversion function doesn't do any harm anyway
    architecture.components[indexComp].elements[indexElem].value = bi_intToBigInt(value, 10);
    creator_callstack_writeRegister(indexComp, indexElem);

    if ((architecture.components[indexComp].elements[indexElem].properties.includes('stack_pointer') !== false) &&
      (value != parseInt(architecture.memory_layout[4].value))) {
      writeStackLimit(parseInt(bi_intToBigInt(value, 10)));
    }

    if (typeof window !== "undefined") {
      btn_glow(architecture.components[indexComp].elements[indexElem].name, "Int");
    }
  }

  else if (architecture.components[indexComp].type == "fp_registers") {
    if (architecture.components[indexComp].double_precision === false) {
      if ((architecture.components[indexComp].elements[indexElem].properties.includes('write') !== true)) {
        if ((architecture.components[indexComp].elements[indexElem].properties.includes('ignore_write') !== false)) {
          return;
        }
        draw.danger.push(execution_index);

        throw packExecute(true, 'The register ' + architecture.components[indexComp].elements[indexElem].name.join(' | ') + ' cannot be written', 'danger', null);
      }

      //architecture.components[indexComp].elements[indexElem].value = parseFloat(value); //TODO: float2bin -> bin2hex -> hex2big_int //TODO
      architecture.components[indexComp].elements[indexElem].value = bi_floatToBigInt(value);
      creator_callstack_writeRegister(indexComp, indexElem);

      if ((architecture.components[indexComp].elements[indexElem].properties.includes('stack_pointer') !== false) &&
        (value != parseInt(architecture.memory_layout[4].value))) {
        writeStackLimit(parseFloat(value));
      }

      updateDouble(indexComp, indexElem);

      if (typeof window !== "undefined") {
        btn_glow(architecture.components[indexComp].elements[indexElem].name, "FP");
      }
    }

    else if (architecture.components[indexComp].double_precision === true) {
      if ((architecture.components[indexComp].elements[indexElem].properties.includes('write') !== true)) {
        if ((architecture.components[indexComp].elements[indexElem].properties.includes('ignore_write') !== false)) {
          return;
        }
        draw.danger.push(execution_index);

        throw packExecute(true, 'The register ' + architecture.components[indexComp].elements[indexElem].name.join(' | ') + ' cannot be written', 'danger', null);
      }

      if (architecture.components[indexComp].double_precision_type == "linked") {
        //architecture.components[indexComp].elements[indexElem].value = parseFloat(value); //TODO
        architecture.components[indexComp].elements[indexElem].value = bi_doubleToBigInt(value);
        updateSimple(indexComp, indexElem);
      }

      else {
        if (typeof register_type === 'undefined') {
          register_type = "DFP-Reg";
        }
        if (register_type === 'SFP-Reg') {
          architecture.components[indexComp].elements[indexElem].value = bi_floatToBigInt(value);
        }
        if (register_type === 'DFP-Reg') {
          architecture.components[indexComp].elements[indexElem].value = bi_doubleToBigInt(value);
        }
      }

      creator_callstack_writeRegister(indexComp, indexElem);

      if (typeof window !== "undefined") {
        btn_glow(architecture.components[indexComp].elements[indexElem].name, "DFP");
      }
    }
  }
}
