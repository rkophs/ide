define(['modules/controller', 'text!config/ledger.json', 'd3'], function (controllers, ledger, d3) {
    'use strict';

    controllers.controller('FileSelector', function ($scope) {

        $scope.show = false;

        $scope.tree = {
            i: 0,
            duration: 350,
            root: JSON.parse(ledger),
            levels: []
        };

        $scope.init = function(){
            $scope.tree.init_tree();

            $scope.$onRootScope('file_selector', function(event, message){
                if(message === 'open'){
                    $scope.open();
                }
            });

            $scope.$onRootScope('file', function(event, message){
                if(message.action === 'close'){
                    $scope.tree.set_to_closed($scope.tree.root, message.name);
                }
            });
        };

        $scope.tree.set_to_closed = function(d, name){
            if(d.name === name){
                d.open = false;
                return true;
            }
            for(var child in d._children){
                if($scope.tree.set_to_closed(d._children[child], name)){
                    return true;
                }
            }
            for(var child in d.children){
                if($scope.tree.set_to_closed(d.children[child], name)){
                    return true;
                }
            }
            return false;
        }

        $scope.tree.set_perimeter = function(){
            var picker = $('#nav_block_wrapper');
            $scope.tree.width = (picker.width() > picker.height()) ? picker.height() : picker.width();
            $scope.tree.height = $scope.tree.width;
            $scope.tree.radius = ($scope.tree.width - $scope.tree.nodeRadius*2 - 100 - $scope.tree.rootPadding);
            $scope.tree.diameter = $scope.tree.radius * 2;
            d3.select(self.frameElement).style("height", $scope.tree.radius + "px");
        };

        $scope.tree.init_tree = function(){
            $scope.tree.nodeRadius = $scope.$parent.nav_button.radius;
            $scope.tree.nodeStroke = $scope.$parent.nav_button.stroke;
            $scope.tree.rootPadding = $scope.$parent.nav_button.padding;
            $scope.tree.set_perimeter();

            $scope.tree.root.children.forEach($scope.tree.collapse);
            $scope.tree.root.x0 = 0;
            $scope.tree.root.y0 = 0;
            $scope.tree.close_root();

            $scope.tree.tree = d3.layout.tree().size([90, $scope.tree.radius - 100]);
            $scope.tree.diagonal = d3.svg.diagonal.radial().projection(function(d){
                return [d.y, d.x / 180 * Math.PI];
            });

            $scope.tree.svg = d3.select("#file_selector").append("svg")
                .attr("width", $scope.tree.width)
                .attr("height", $scope.tree.height)
                .append("g")
                .attr("transform", "translate(" + ($scope.tree.nodeRadius + $scope.tree.rootPadding)
                    + ", " + ($scope.tree.nodeRadius + $scope.tree.rootPadding) + ") rotate(90)")

            $(window).on("resize", function() {
                $scope.tree.set_perimeter();
                $scope.tree.svg.attr("width", $scope.tree.width)
                    .attr("height", $scope.tree.height);

                $scope.tree.update($scope.tree.root)
            });
        };

        $scope.tree.collapse = function(d) {
            if (d.children) {
                d._children = d.children;
                d._children.forEach($scope.tree.collapse);
                d.children = null;
            }
        };

        $scope.tree.click = function(d) {
            var close = false;
            if((!d.depth) && (!d._children)){ //Clicked root to close;
                close = true;
            }
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }

            if((!(d.children || d._children)) && !d.open){ //Must be a closed file (or empty directory)
                d.open = true;
                $scope.open_file({name: d.name});
                $scope.tree.update(d);
            } else {
                $scope.tree.update(d, close);
            }
        };

        $scope.tree.close_root = function() {
            $scope.tree.root._children = $scope.tree.root.children;
            $scope.tree.root.children = null;
        };

        $scope.tree.open_root = function() {
            $scope.tree.root.children = $scope.tree.root._children;
            $scope.tree.root._children = null;
        };

        $scope.tree.getLevels = function(node){
            if(node.depth >= $scope.tree.levels.length){
                $scope.tree.levels.push(0);
            }
            $scope.tree.levels[node.depth] += 1;
            if(node.children){
                for(var child in node.children){
                    $scope.tree.getLevels(node.children[child]);
                }
            }
        };

        $scope.tree.update = function(source, close) {

            // Compute the new tree layout.
            var root = $scope.tree.root;
            var tree = $scope.tree.tree;
            var nodes = tree.nodes(root);
            var links = tree.links(nodes);


            $scope.tree.levels = [];
            $scope.tree.getLevels(root);

            //Get the maximum amount of depth to display:
            var maxDepth = 0;
            nodes.forEach(function (d) {
                if (maxDepth < d.depth) {
                    maxDepth = d.depth;
                }
            });

            // Normalize for maximized tree radius:
            nodes.forEach(function (d) {
                if(maxDepth == 0){
                    d.y = 0;
                } else {
                    d.y = (d.depth / maxDepth) * $scope.tree.radius;
                }
            });

            // Update the nodes…
            var node = $scope.tree.svg.selectAll("g.node")
                .data(nodes, function (d) {
                    return d.id || (d.id = ++$scope.tree.i);
                });

            // Enter any new nodes at the parent's previous position.
            var nodeEnter = node.enter().append("g")
                .attr("class", "node")
                .on("click", $scope.tree.click);

            nodeEnter.append("circle")
                .attr("r", 1e-6)
                .style("fill", function (d) {
                    return d._children ? "lightsteelblue" : "#fff";
                }).style("stroke", function(d){
                    return d.open ? "lightsteelblue" : "#cc4d35";
                });


            nodeEnter.append("text")
                .attr("x", 10)
                .attr("dy", ".35em")
                .attr("text-anchor", "start")
                .text(function (d) {
                    return d.name;
                })
                .style("fill-opacity", 1e-6);

            // Transition nodes to their new position.
            var nodeUpdate = node.transition()
                .duration($scope.tree.duration)
                .attr("transform", function (d) {
                    return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
                })

            nodeUpdate.select("circle")
                .attr("r", $scope.tree.nodeRadius)
                .style("fill", function (d) {
                    return d._children ? "#cc4d35" : "#111";
                }).style("stroke", function(d){
                    return d.open ? "lightsteelblue" : "#cc4d35";
                });

            nodeUpdate.select("text")
                .style("fill-opacity", 1)
                .attr("text-anchor", function (d) {
                    return d.x >= 180 ? "end" : "start";
                })
                .attr("transform", function (d) {
                    return d.x < 180 ? "translate(2)" : "rotate(180) translate(-"
                        + ($scope.tree.nodeRadius * 2 + 2) + ")";
                });

            var nodeExit = node.exit()
                .transition()
                .duration($scope.tree.duration)
                .attr("transform", function (d) {
                    return "translate(" + (-d.y) + ") rotate(" + (-d.x + 90) + ")";
                })
                .remove();

            nodeExit.select("circle")
                .attr("r", 1e-6)

            nodeExit.select("text")
                .style("fill-opacity", 1e-6)
                .attr("transform", function (d) {
                    return d.x < 180 ? "translate(-2)" : "translate("
                        + ($scope.tree.nodeRadius * 2 + 2) + ") rotate(-180) ";
                });


            // Update the links…
            var link = $scope.tree.svg.selectAll("path.link")
                .data(links, function (d) {
                    return d.target.id;
                });

            // Enter any new links at the parent's previous position.
            link.enter().insert("path", "g")
                .attr("class", "link")
                .attr("d", function (d) {
                    var o = {x: source.x0, y: source.y0};
                    return $scope.tree.diagonal({source: o, target: o});
                });

            // Transition links to their new position.
            link.transition()
                .duration($scope.tree.duration)
                .attr("d", $scope.tree.diagonal);

            // Transition exiting nodes to the parent's new position.
            link.exit().transition()
                .duration($scope.tree.duration)
                .attr("d", function (d) {
                    var o = {x: source.x, y: source.y};
                    return $scope.tree.diagonal({source: o, target: o});
                })
                .remove();

            // Stash the old positions for transition.
            nodes.forEach(function (d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });

            setTimeout(function(){
                if(close){
                    $scope.close();
                }
            }, $scope.tree.duration + 100);
        };

        $scope.open_file = function(obj){
            $scope.$emit('file', {
                action: "open",
                language: "json",
                name: obj.name,
                same_window: true
            });
        };

        $scope.open = function(){
            $scope.show = true;
            $scope.$apply
            $scope.tree.open_root();
            $scope.tree.update($scope.tree.root);
        };

        $scope.close = function(){
            $scope.show = false;
            $scope.$apply();
        };
    });
})
