var game = {
    init: function(elevators, floors) {
        var i;
        var topFloor = floors.length - 1;

        var floorRequests = {
            "up": {},
            "down": {}
        };

        for (i = 0; i < floors.length; i++) {
            floors[i].on("up_button_pressed", function() {
                floorRequests["up"][this.floorNum()] = true;
            });

            floors[i].on("down_button_pressed", function() {
                floorRequests["down"][this.floorNum()] = true;
            });
        }

        for (i = 0; i < elevators.length; i++) {
            elevators[i].on("floor_button_pressed", function(floorNum) {
                if (this.maxPassengerCount() < 5) {
                    this.goToFloor(floorNum);
                }
            });

            elevators[i].on("passing_floor", function(floorNum, direction) {
                if (floorNum in floorRequests[direction] && this.loadFactor() < 1) {
                    delete floorRequests[direction][floorNum];
                    this.goToFloor(floorNum, true);
                }

                if (floorNum in floorRequests[direction] && this.loadFactor() < 1) {
                    delete floorRequests[direction][floorNum];
                    this.goToFloor(floorNum, true);
                }
            });

            elevators[i].on("stopped_at_floor", function(floorNum) {
                if (this.maxPassengerCount() > 4) {
                    if (floorNum == 0) {
                        this.goToFloor(topFloor);
                    }
                    if (floorNum == topFloor) {
                        this.goToFloor(0);
                    }
                }
            });

            elevators[i].on("idle", function() {
                if (this.maxPassengerCount() > 4) {
                    this.goToFloor(0);
                    return;
                }
                for (var floorNum in floorRequests["up"]) {
                    delete floorRequests["up"][floorNum];
                    this.goToFloor(floorNum);
                    return;
                }
                for (var floorNum in floorRequests["down"]) {
                    delete floorRequests["down"][floorNum];
                    this.goToFloor(floorNum);
                    return;
                }
                this.goToFloor(0);
            });
        }
    },
    update: function(dt, elevators, floors) {}
};