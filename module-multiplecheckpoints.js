// Copyright (c) IPython Development Team.
// Distributed under the terms of the Modified BSD License.

// Copyright (c) IPython Development Team.
// Distributed under the terms of the Modified BSD License.

require(["base/js/events"], function (events) {

	window.console && console.log('module-multiplecheckpoints loaded');

    $([IPython.events]).on('notebook_restoring.Notebook', function() {
    	$('#notebook-container').html('');
    	var end_space = $('<div/>').addClass('end_space').appendTo('#notebook-container');
    });
});


if (IPython.Notebook !== undefined)
	IPython.Notebook.prototype.add_checkpoint = function (checkpoint) {
        var found = false;
        for (var i = 0; i < this.checkpoints.length; i++) {
            var existing = this.checkpoints[i];
            if (existing.id == checkpoint.id) {
                found = true;
                this.checkpoints[i] = checkpoint;
                break;
            }
        }
        if (!found) {
        	this.checkpoints = this.checkpoints.slice(0, 15);
            this.checkpoints.push(checkpoint);
        }

		var compare = function (a,b) {
		  if (a.last_modified < b.last_modified)
		     return 1;
		  if (a.last_modified > b.last_modified)
		    return -1;
		  return 0;
		}

		this.checkpoints.sort(compare);
        this.last_checkpoint = this.checkpoints[this.checkpoints.length - 1];
    };
