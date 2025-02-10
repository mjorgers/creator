import globals from "globals";
import pluginJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,vue}"]},
  {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}},
  {
    languageOptions: { 
      globals: {
        ...globals.browser,
        ...globals.node,
        architecture: "writable",
        architecture_available: "writable",
        architecture_hash: "writable",
        architecture_json: "writable",
        load_architectures: "writable",
        load_architectures_available: "writable",
        back_card: "writable",
        textarea_assembly_editor: "writable",
        codemirrorHistory: "writable",
        code_assembly: "writable",
        tokenIndex: "writable", 
        nEnters: "writable",
        pc: "writable",
        address: "writable",
        data_address: "writable",
        stack_address: "writable",
        backup_stack_address: "writable",
        backup_data_address: "writable",
        pending_instructions: "writable",
        pending_tags: "writable",
        extern: "writable",
        compileError: "writable",
        app: "writable",
        align: "writable",
        console_log: "writable",
        word_size_bits: "writable",
        word_size_bytes: "writable",
        register_size_bits: "writable",
        main_memory: "writable",
        main_memory_datatypes: "writable",
        memory_hash: "writable"
      }
    }
  },
  pluginJs.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  {rules: {"no-unused-vars": 0}}
];