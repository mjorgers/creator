/*
 *  Copyright 2018-2023 Felix Garcia Carballeira, Diego Camarmas Alonso, Alejandro Calderon Mateos
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


  /* jshint esversion: 6 */

  var uielto_uri = {

        props:      {
                      id:                  { type: String, required: true }
                    },

        data:       function () {
                      return {

                      }
                    },

        methods:    {
                      make_uri ()
                      {
                        return document.URL + "?architecture="+ encodeURIComponent(app._data.architecture_name) + "&asm=" + encodeURIComponent(code_assembly);
                      },

                      copy_uri ()
                      {
                        navigator.clipboard.writeText(this.make_uri());
                      }
                    },

        template:   '<b-modal  :id = "id"' +
                    '          title = "URI" ' +
                    '          hide-footer' +
                    '          class="text-center">' +
                    ' ' +
                    '  <div class="text-center">' +
                    '    <b-form-textarea v-model="make_uri()" :rows="4"></b-form-textarea> ' +
                    '    <br> ' +
                    '    <b-button variant="info" @click="copy_uri()">' +
                    '      <span class="fas fa-copy"></span> Copy' +
                    '    </b-button>' +
                    '  </div>' +
                    '</b-modal>'
  }

  Vue.component('make-uri', uielto_uri) ;