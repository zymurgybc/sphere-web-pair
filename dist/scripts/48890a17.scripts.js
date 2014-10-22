"use strict";angular.module("sphereWebPairApp",["ngResource","ngSanitize","ngRoute","hmTouchEvents","angular-ladda","ngDialog"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("sphereWebPairApp").value("SERVER",window.location.protocol+"//"+window.location.hostname+("80"!==window.location.port?":"+window.location.port:"")).value("USER_LOADED","userLoaded").value("LOADED","loaded"),angular.module("sphereWebPairApp").factory("authInterceptor",["$rootScope","$q","$window",function(a,b,c){return{request:function(a){return a.headers=a.headers||{},c.sessionStorage.token&&(a.headers.Authorization="Bearer "+c.sessionStorage.token),a},response:function(a){return(401===a.status||403===a.status)&&(window.location.href="/auth/ninja"),a||b.when(a)}}}]),angular.module("sphereWebPairApp").config(["$httpProvider",function(a){a.interceptors.push("authInterceptor")}]),angular.module("sphereWebPairApp").run(["$rootScope","$resource","$timeout","$window","SERVER","LOADED","USER_LOADED",function(a,b,c,d,e,f,g){var h=function(b){a.$broadcast(f),a.$broadcast(g,b),a.User=b},i=function(){var a=b("/rest/v1/user",{});a.get(function(a){h(a.data)},function(){window.location.href="/auth/ninja"})};a.AccountLink=d.location.href.replace("api.","id."),a.LogoutLink=d.location.href.replace("api.","id.")+"auth/logout",c(function(){var a=b("/rest/v1/auth/session_token",{});a.get(function(a){window.sessionStorage.token=a.data.token,i()},function(){window.location.href="/auth/ninja"})},1e3)}]),function(){(window.location.hostname.indexOf("0.0.0.0")>=0||"localhost"===window.location.hostname)&&(console.log("==== STUBBED BACKEND ===="),angular.module("sphereWebPairApp").config(["$provide",function(a){a.decorator("$httpBackend",angular.mock.e2e.$httpBackendDecorator)}]).run(["$httpBackend","$timeout","SERVER",function(a,b,c){console.log("Setting up Stubs on ",c);var d={user_id:"80eykz",site_id:"75e62f02-1d40-4a0a-86e4-f705cff14f36",node_id:"HELLO1234568888YYY",name:"Theo"},e={nodes:[{node_id:"123456789",name:"My Dev Kit 1"},{node_id:"123456789",name:""}]};a.whenGET("/rest/v1/user").respond(function(){return[200,d]}),a.whenGET("/rest/v1/node").respond(e),a.whenDELETE("/rest/v1/node/123456789").respond(function(){return[200,{success:!0}]}),a.whenPOST("/rest/v1/node").respond(function(){return[200,{node_id:"123456789",metadata:{local_ip:"www.google.com"},code:32,message:"Could not find Spheramid"}]}),a.whenGET(/^\/views\//).passThrough()}]))}(angular),angular.module("sphereWebPairApp").controller("MainCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),function(a){function b(a,b){for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c]);return a}function c(a,c){this.el=a,this.options=b({},this.options),b(this.options,c),this._init()}c.prototype.options={speedIn:500,easingIn:mina.linear},c.prototype._init=function(){var a=Snap(this.el.querySelector("svg"));this.path=a.select("path"),this.initialPath=this.path.attr("d");var b=this.el.getAttribute("data-opening");if(this.openingSteps=b?b.split(";"):"",this.openingStepsTotal=b?this.openingSteps.length:0,0!==this.openingStepsTotal){var c=this.el.getAttribute("data-closing")?this.el.getAttribute("data-closing"):this.initialPath;this.closingSteps=c?c.split(";"):"",this.closingStepsTotal=c?this.closingSteps.length:0,this.isAnimating=!1,this.options.speedOut||(this.options.speedOut=this.options.speedIn),this.options.easingOut||(this.options.easingOut=this.options.easingIn)}},c.prototype.show=function(){if(this.isAnimating)return!1;this.isAnimating=!0;var a=this,b=function(){classie.addClass(a.el,"pageload-loading")};this._animateSVG("in",b),classie.add(this.el,"show")},c.prototype.hide=function(){var a=this;classie.removeClass(this.el,"pageload-loading"),this._animateSVG("out",function(){a.path.attr("d",a.initialPath),classie.removeClass(a.el,"show"),a.isAnimating=!1})},c.prototype._animateSVG=function(a,b){var c=this,d=0,e="out"===a?this.closingSteps:this.openingSteps,f="out"===a?this.closingStepsTotal:this.openingStepsTotal,g="out"===a?c.options.speedOut:c.options.speedIn,h="out"===a?c.options.easingOut:c.options.easingIn,i=function(a){return a>f-1?void(b&&"function"==typeof b&&b()):(c.path.animate({path:e[a]},g,h,function(){i(a)}),void a++)};i(d)},a.SVGLoader=c}(window),angular.module("sphereWebPairApp").directive("svgLoader",["$rootScope","$timeout","LOADED",function(a,b,c){return{restrict:"A",link:function(d,e,f){var g=f.svgLoaderSpeed?parseInt(f.svgLoaderSpeed,10):300,h=new SVGLoader(e[0],{speedIn:g,easingIn:mina.easeinout}),i=e.find(".loading");a.$on(c,function(){h.show(),i.remove(),b(function(){e.remove(),h=null},g)})}}}]),angular.module("sphereWebPairApp").controller("PairControllerCtrl",["$rootScope","$scope","$timeout","$resource","ngDialog","SERVER","USER_LOADED",function(a,b,c,d,e,f,g){var h=d("/rest/v1/node/:nodeId",{nodeId:"@node_id"});a.IsPaired=!1,b.User,b.Node,b.Nodes=[],b.Serial,b.Pairing=!1,b.LoadSpheres=function(){h.get(function(a){b.Nodes=a.data})},b.PairSphere=function(){this.formPair.$valid&&(b.Pairing=!0,h.save({nodeId:this.Serial},function(a){c(function(){b.Pairing=!1,a.data.node_id&&b.PairSuccess(a.data)},2e3)},function(a){c(function(){b.Pairing=!1,a.data.title="Pairing Error",e.open({template:"/views/modalpairerror.html",scope:b,data:JSON.stringify(a.data),showClose:!0})})}))},b.PairSuccess=function(c){a.IsPaired=!0,b.Node=c},b.ConfirmNodeDelete=function(a){e.open({template:"/views/modalnodedelete.html",scope:b,data:JSON.stringify(a),showClose:!0})},b.DeleteNode=function(a){h.delete({nodeId:a.node_id},function(a){a&&(e.closeAll(),b.LoadSpheres())},function(a){a.data.title="Unpair Error",e.open({template:"/views/modalpairerror.html",scope:b,data:JSON.stringify(a.data),showClose:!0})})},a.$on(g,function(a,c){b.User=c,b.LoadSpheres()})}]);