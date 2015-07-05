module.exports = function(grunt) {

    grunt.initConfig({
        typescript: {
            dist: {
                src: [
                    "scripts/TreeTraversal.ts",
                    "scripts/NodeCommonality.ts",
                    "scripts/TreeCommonality.ts",
                    "scripts/AugmentedTreeBuilding.ts",
                    "scripts/TreePrinting.ts",
                    "scripts/TypedPlugin.ts"],
                dest: "scripts/src.js",
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
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['typescript:dist', 'string-replace:dist', 'uglify:dist']);

};