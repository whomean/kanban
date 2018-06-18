module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
  	browserSync: {
		    bsFiles: {
		        src : 'css/*.css'
		    },
		    options: {
		        server: {
		            baseDir: "./"
		        },
		        watchTask: true
		    }
	},

	sass: {
	    options: {
	    	sourceMap: true
	    },
	      	dist: {
	        	files: {
	          	'css/style.css': 'sass/*.scss'
	        	}
	      	}
    },

    watch: {
	    scripts: {
	        files: ['sass/*.scss'],
	        tasks: ['sass'],
	        options: {
	            spawn: false,
	        },
	    }
	},

	// jshint: {
  //     	all: ['js/*.js']
  //   }

  });
  // Load the plugins tasks
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  // grunt.loadNpmTasks('grunt-contrib-jshint');
  // Default task(s).
  grunt.registerTask('default', ['sass', 'browserSync', 'watch']);
};
