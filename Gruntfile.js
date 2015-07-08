module.exports = function(grunt) {

    grunt.initConfig({
        ts: {
            dist: {
                src: [
                    "scripts/TreeTraversal.ts",
                    "scripts/NodeCommonality.ts",
                    "scripts/TreeCommonality.ts",
                    "scripts/AugmentedTreeBuilding.ts",
                    "scripts/TreePrinting.ts",
                    "scripts/TypedPlugin.ts"],
                options: {
                    comments: true
                }
            }
        },
        concat: {
          dist: {
              src: [
                  "scripts/TreeTraversal.js",
                  "scripts/NodeCommonality.js",
                  "scripts/TreeCommonality.js",
                  "scripts/AugmentedTreeBuilding.js",
                  "scripts/TreePrinting.js",
                  "scripts/TypedPlugin.js"],
              dest: 'scripts/src.js'
          }
        },
        'string-replace': {
            dist: {
                files: {
                    'dist/gsap-typed-plugin.js': 'scripts/template.js'
                },
                options: {
                    replacements: [
                        {
                            pattern: "/**__CODE_GOES_HERE__**/",
                            replacement: "<%= grunt.file.read('scripts/src.js') %>"
                        }
                    ]
                }
            }
        },
        uglify: {
            dist: {
                files: {
                    'dist/gsap-typed-plugin.min.js': 'dist/gsap-typed-plugin.js'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.registerTask('default', ['ts:dist', 'concat:dist', 'string-replace:dist', 'uglify:dist']);

};