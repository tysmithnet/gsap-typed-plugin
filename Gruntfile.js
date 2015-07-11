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
              dest: 'dist/src.js'
          },
          license: {
              src: ["dist/license.js", "dist/gsap-typed-plugin.js"],
              dest: "dist/gsap-typed-plugin.js"
          }
        },
        'string-replace': {
            dist: {
                files: {
                    'dist/gsap-typed-plugin.js': 'dist/template.js'
                },
                options: {
                    replacements: [
                        {
                            pattern: "/**__CODE_GOES_HERE__**/",
                            replacement: "<%= grunt.file.read('dist/src.js') %>"
                        }
                    ]
                }
            }
        },
        comments: {
            dist: {
                src: ['dist/gsap-typed-plugin.js']
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-stripcomments');
    grunt.loadNpmTasks('grunt-karma');
    grunt.registerTask('default', ['ts:dist', 'concat:dist', 'string-replace:dist', 'comments:dist', 'concat:license']);
    grunt.registerTask('test', ['karma']);

};