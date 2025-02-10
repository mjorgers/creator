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

/*
 *  Register operations
 */
export function crex_findReg(value1) {
  var ret = {};

  ret.match = 0;
  ret.indexComp = null;
  ret.indexElem = null;

  if (value1 == "") {
    return ret;
  }

  for (var i = 0; i < architecture.components.length; i++) {
    for (var j = 0; j < architecture.components[i].elements.length; j++) {
      if (architecture.components[i].elements[j].name.includes(value1) !== false) {
        ret.match = 1;
        ret.indexComp = i;
        ret.indexElem = j;
        break;
      }
    }
  }

  return ret;
}
export function crex_findReg_bytag(value1) {
  var ret = {};

  ret.match = 0;
  ret.indexComp = null;
  ret.indexElem = null;

  if (value1 == "") {
    return ret;
  }

  for (var i = 0; i < architecture.components.length; i++) {
    for (var j = 0; j < architecture.components[i].elements.length; j++) {
      if (architecture.components[i].elements[j].properties.includes(value1) !== false) {
        ret.match = 1;
        ret.indexComp = i;
        ret.indexElem = j;
        break;
      }
    }
  }

  return ret;
}