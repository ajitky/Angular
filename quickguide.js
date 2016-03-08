/*
Template        HTML with additional markup
Directives      Extends HTML with custom attributes, elements, classes or comments
Model           Data shown in View for user interaction
Scope           Context where Model is stored so that Controllers, Directives and Expressions can access it
Expressions     JavaScript like expressions with access to Scope
Compiler        Parses Template and instantiates Directives and Expressions
Filter          Formats value of an Expression for display to user
View            What user sees (the DOM)
Data Binding    Sync data between Model and View
Controller      Business logic behind Views
Dependency Injection (DI)      Creates and wires objects and functions using $injector and $provide
Injector        DI container used to identify and retrieve dependencies, instantiate types, invoke methods, and load modules
Module          Container for different components of an app, also manages Injector configuration
Service         Reusable business logic independent of Views
Providers       Blueprints for creating object instances which are then ready to be injected into collaborators
Routes          Maps URL paths to templates, partials and controllers

Prefixes        Names of Public objects are prefixed with $ and that of Private objects with $$
componentType   As used below, refers to either controller, directive, factory, filter, service
*/



// Bootstrap: Initialization
// ==========================
// Automatic
// ----------
// Only one application can be auto-bootstrapped per HTML document, rest can be manually bootstrapped
// Using multiple ng-app, first will be considered and rest will be ignored
// ng-app - acts as root of compilation and designates root element of application
// ng-strict-di - creates injector in "strict-di" mode and invokes functions using explicit annotation style (see DI)
<html ng-app='[moduleName]' [ng-strict-di]>

// Manual
// -------
// Runs multiple non-nested applications per HTML document
// Preferred when using script loaders or while performing an operation before compilation phase
angular.module('module1Name', []).componentType('componentName', ['dep', function (dep) { ... }]);
angular.module('module2Name', []).componentType('componentName', ['dep', function (dep) { ... }]);
angular.element(document).ready(function() {
    angular.bootstrap(element1, ['module1Name']);
    angular.bootstrap(element2, ['module2Name']);
    // Cannot add more components after an application bootstraps
});

// Mixed
// -------
// Automatic and Manual approach can be combined, with ng-app for one app and bootstrap(...) for rest of the apps

// Deferred
// ---------
// Hooks into bootstrap process and sneak in more modules into DI registry
// Can replace/augment DI services for instrumentation or mocking out heavy dependencies
// Used with 'ng-app' directive
window.name = NG_DEFER_BOOTSTRAP!someName;
// When angular.bootstrap() is called, the bootstrap process will be paused until:
angular.resumeBootstrap(['moduleName', ...]);



// Dependency Injection (DI) or Inversion of Control
// ==================================================
// Component can get hold of its dependencies in 3 ways - by creating, looking up, and having dependency passed where needed (preferred)
// First 2 ways hard code dependency to the component, making it difficult if not impossible to modify dependencies for test isolation
// 3 equivalent ways to provide dependency annotation information used by injector for resolving dependencies:

// Way 1 - Implicit Annotation
// ----------------------------
// Automatic function annotations (disabled in "strict-di" mode)
// Does not work with minifiers/obfuscators as it rename method parameters
function componentName(dependency, ...) { ... }

// Way 2 - Explicit Annotation
// ----------------------------
// Order of dependencies must match the order of method parameters
var componentName = function(renamedDependency, ...) { ... };
componentName['$inject'] = ['dependency', ...];
// or
function componentName(renamedDependency, ...) { ... };
componentName.$inject = ['dependency', ...];

moduleInstance.componentType('componentName', componentName);

// Way 3 - Inline Array Annotation
// --------------------------------
// Explicit annotation style
// Order of dependencies must match the order of method parameters
moduleInstance.componentType('componentName', ['dependency', ..., function(renamedDependency, ...) { ... }]);



// Modules
// ========
// Manage $injector configuration and have nothing to do with loading of scripts into VM
// Each module can only be loaded once, even if multiple other modules require it
angular.module('moduleName', ['dependency', ...]);    // creates or overwrite a module
angular.module('moduleName');                         // returns an existing module instance

// Recommended Setup
// ------------------
angular.module('moduleName.each_feature', []);
angular.module('moduleName.each_reusable_component', []);   //especially directives and filters
// Injected modules have access to each other without any injection into respective definitions
angular.module('moduleName', ['moduleName.each_feature', 'moduleName.each_reusable_component']);   //application level module with init code

angular.module('moduleName', []).
    config(['depProvider', ..., function(depProvider, ...) {
        // Gets executed during the provider registration and configuration phase
        // Can only inject constants and Providers (not instances) with exception of services ($provide and $injector) from AUTO module
        // Prevent accidental instantiation of services before they have been fully configured
        // Can have as many of these as you want
    }]).
    run(['depService', ..., function(depService, ...) {
        // Gets executed after the injector is created and are used to kickstart the application
        // Can only inject constants and instances (not Providers)
        // Prevent further system configuration during application run time
        // Can have as many of these as you want
    }]);

// Modules Load Cycle
// -------------------
angular.module('moduleName', ['ngXXX', 'ngYYY', ...]);
// ngXXX - Constant, Providers, Config, Run
// ngYYY - Constant, Providers, Config, Run
// moduleName - Constant, Providers, Config, Run
// $injector - Instance Cache, Provider Cache



// Controllers
// ============
// Can be attached to DOM by either declaring it in route definition or 'ng-controller'
// "ng-controller = controllerName" - binds methods/properties onto $scope which is injected into controller - $scope.xyz
// "ng-controller = controllerName as ctrlInstance" - binds methods/properties directly onto controller - this.xyz or ControllerConstructor.prototype.xyz
//// Instantiates controller and saves it in current $scope property as 'ctrlInstance'
//// In template use 'ctrlInstance.xyz' or else use 'xyz'
moduleInstance.controller('controllerName', ['$scope', '$rootScope', '$route', 'dependency', ...,
    function ControllerConstructor ($scope, $rootScope, $route, dependency, ...) {
        // $route - values resolved if controller is instantiated as part of a route
        // mentioning 'ControllerConstructor' is optional and helps with debugger stack traces
    }
]);



// Expressions
// ============
// Can be used in {{interpolation}} bindings and Directive attributes
// Processed by $parse service instead of JS eval()
// Operates on containing $scope within which they are called
// Can access context using this, $locals, $window, $document, $location
// Expression evaluation is forgiving to certain exceptions (undefined, null)
// NO control flow statements, function declaration, regular expressions, new object creation, comma, void operator

// One-time binding ::
// --------------------
// Retains expression value at the end of (first) digest cycle as long as that value is not undefined
// Gets watch deregistered and frees up resources once the binding is stabilized and digest loop is done
// Reducing the number of expressions being watched makes the digest loop faster and allows more information to be displayed
// Expression that does not change once set is a candidate for one-time binding
{{ ::expr }}, ng-if="::expr", ng-class="::{ className: expr }", ng-repeat="expr in ::exprs"



// Forms
// ======
// All HTML5 validation attributes can be used apart from ng-* version of each
// property: $error, $submitted, $pristine, $dirty, $valid, $invalid, $touched, $pending
// validation: required, validationAttributes, types, customValidation
// formName.property, formName.inputName.property.validation
// novalidate - disables browser's native form validation
<form name="formName" novalidate ng-submit="...">
    <input name="inputName" type="XYZ" ng-model="..." required ng-[attribute]="..." ng-pattern="..." ng-class="..." class="ng-[property]" />
    <ANY ng-show="formName.inputName.property && formName.inputName.property">Error Message</ANY>
    <button type="submit" ng-disabled="formName.inputName.property">Label</button>

// Using ngMessages:
// ------------------
// Provides enhanced support for displaying messages within templates
// Handles the complexity, inheritance and priority sequencing based on the order of how the messages are defined in the template
// ngMessages - expression evaluating to key/value object (typically formName.inputName.$error object on ngModel instance)
// ngMessage - string value corresponding to the message key (typically validationName property of formName.inputName.$error object)
// ngMessageExp  - expression value corresponding to the message key
// ngMessagesInclude  - string value corresponding to the remote template
<form name="formName">
    <input name="inputName" ... />
    <ANY ng-messages="expression" role="alert" ng-messages-multiple>
        <ANY ng-message="stringValue">overridden or new message</ANY>
        <ANY ng-message="stringValue1, stringValue2, ...">...</ANY>
        <ANY ng-repeat="repeat_expression"> // optional, can also have ng-if, ng-switch
            <ANY ng-message-exp="expressionValue">{{expressionValue}}</ANY>
        </ANY>
        <ANY ng-messages-include="remoteTemplateString">...</ANY>
    </ANY>
</form>



// CSS in AngularJS
// =================
// Angular (ngModel) sets these CSS classes on binded elements. It is up to your application to provide useful styling.
ng-scope // element with scope
ng-isolate-scope // element with isolate scope
ng-binding // element with data binding, via ng-bind or {{}}
ng-invalid-[key], ng-valid-[key] // element's input validation status [added by $setValidity]
ng-pristine, ng-dirty // element's user interaction status
ng-touched, ng-untouched // element's blur status
ng-pending // any $asyncValidators are unfulfilled



// Filters
// ========
// Using filters in view templates
// --------------------------------
{{expr | filter:arg:arg:... | filter | ...}}
// Using filter in template (ng-repeat) re-evaluates filter on every digest cycle and can be costly (if array is big)

// Using filters in controllers, services, and directives
// -------------------------------------------------------
moduleInstance.componentType('componentName', ['dep1', '<filterName>Filter', ...,
    function componentName (dep1, <filterName>Filter, ...) {
        output = <filterName>Filter(input, ...);
    }
]);
// OR
moduleInstance.componentType('componentName', ['dep1', $filter, ...,
    function componentName (dep1, $filter, ...) {
        output = $filter('filterName')(input, arg, ...);
    }
]);

// Creating Custom Filters
// ------------------------
moduleInstance.filter('name', ['dep1', ..., function(dep1, ...) {
    return function(input, attr1, ...){
        var output = ...;
        // ...
        return output;
    };
}]);



// Providers
// ==========
// Register a recipe with $injector to return a “singleton” service instance
// Many of $provide service methods are also exposed on angular.Module
// Factories & Providers inject whatever is returned by the factory & $get function respectively, which could be of any type and could change at runtime.
//* Service, Constant & Value injections are of fixed type and well defined during the recipe definition, hence considered type friendly in nature.

// Constant Recipe
// ----------------
// Register constant service with $injector
// Cannot be overridden by decorator
// Available in both config (preferred) and run phase
// Cannot have dependencies
//* Uses type friendly injection
// value - can be string, number, array, object or function
// Used to define constant, immutable, config values across app
// returnValue = value
moduleInstance.constant('name', value);
// which is same as:
moduleInstance.config(function($provide) { $provide.constant('name', value); });
// Usage - injected as dependency
moduleInstance.controller('ctrlName', function(name) { expect(name).toEqual(value); });

// Value Recipe
// -------------
// Register value service with $injector
// Available in run, but not config phase
// Cannot have dependencies
//* Uses type friendly injection
// value - can be string, number, array, object or function
// Used to create shared, mutable values across app
// returnValue = value
moduleInstance.value('name', value);
// which is same as:
moduleInstance.config(function($provide) { $provide.value('name', value); });
// Usage - injected as dependency
moduleInstance.controller('ctrlName', function(name) { expect(name).toEqual(value); });

// Service Recipe
// ---------------
// Register service constructor with $injector
//* Uses type friendly injection
// Cannot create functions, primitives, works better with custom objects
// Can have dependencies
// Available in run, but not config phase
// Used to define a type/class in OO manner, taking advantage of prototypal inheritance
// Used for sharing utility functions, which could also run as function.call(this) or similar
// Used to persist data across app without initial configuration
// returnValue = new FunctionYouPassedToService() i.e. Constructor()
moduleInstance.service('name', ['dep1', ..., function Constructor(dep1, ...) {
    this.properties = values;
}]);
// which is same as:
moduleInstance.config(function($provide) { $provide.service('name', function Constructor(){ ... }); });
// Usage - injected as dependency
moduleInstance.controller('ctrlName', function(name) { expect(name.properties).toEqual(values); });

// Factory Recipe
// ---------------
// Register service factory with $injector
// Does not uses type friendly injection
// Can create primitives, functions, object literal, or custom objects
// Can have dependencies
// Available in run, but not config phase
// Used for returning a ‘class’ function that can then be new'ed to create instances
// Used with constant functionality modules (i.e., returning a function primitive)
// returnValue = FunctionYouPassedToFactory() i.e. $getFn()
moduleInstance.factory('name', ['dep1', ..., function $getFn(dep1, ...) {
    // Internally $getFn is a short hand for $provide.provider(name, {$get: $getFn})
    // Factory function $getFn can be named as <name>Factory to help with debugger stack traces
    return serviceInstance;
}]);
// which is same as:
moduleInstance.config(function($provide) { $provide.factory('name', function $getFn(){ ... }); });
// Usage - injected as dependency
moduleInstance.controller('ctrlName', function(name) { expect(name).toEqual(serviceInstance); });

// Provider Recipe
// ----------------
// Register service provider with $injector
// Allows configuration of provider and its service during bootstrap before injection
// For DI the provider instance is cached in providerCache, whereas the return value of $get (service instance) is cached in instanceCache
// All recipes (except constant) are derived from $provide.provider returning registered provider instance
// Available in config, but not run phase
// Does not uses type friendly injection
// Can create functions, primitives
// Can have dependencies

// Way 1 - Constructor function
// returnValue = new FunctionYouPassedToProvider().$get() i.e. name_Provider()
moduleInstance.provider('name', function name_Provider() {          // dependencies (Providers, constants, $provide, $injector)
    this.$get = ['dep1', ..., function name_Factory(dep1, ...) {   // dependencies (Instances, constants)
        return new ServiceConstructor(dep1);                        // returns service instance using constructor
        // return { ... };                                          // returns service instance using factory pattern
    }];
    var someThing = 'defaultValue';
    this.setSomething = function(newValue){
        someThing = newValue;
    };
    // OO style code, taking advantage of prototypal inheritance
    function ServiceConstructor(dep1){
        // where 'values' may be computed using dep1, someThing, ...
        this.properties = values;
    }
});

// Way 2 - Function that returns a provider (or provider factories)
// returnValue = FunctionYouPassedToProvider().$get() i.e. name_Provider()
moduleInstance.provider('name', function name_Provider(name2Provider) {             // dependencies (Providers, constants)
    return {
        $get: ['dep1', 'name2', ..., function name_Factory(dep1, name2, ....) {     // dependencies (Instances, constants)
            return new ServiceConstructor(dep1);                                    // returns service instance
        }]
    };
});

// Way 3 - Provider object
// returnValue = $get()
moduleInstance.provider('name', {
    $get: ['dep1', ..., function name_Factory(dep1, ...) {          // dependencies (Instances, constants)
        return new ServiceConstructor(dep1);                        // returns service instance
    }]
});

// Way 4 - Or defining provider in Module config for more flexibility
// returnValue = $get()
moduleInstance.config(['$provide', function($provide) {             // dependencies (Providers, constants)
    //do some config stuff here...
    $provide.provider('name', {
        $get: ['dep1', ..., function name_Factory(dep1, ...) {      // dependencies (Instances, constants)
            return new ServiceConstructor(dep1);                    // returns service instance
        }]
    });
}]);

// Usage - provider will be available under 'name'+'Provider' key for configuration before injection
moduleInstance.config(['nameProvider', function(nameProvider) {
    // do some config stuff here...
    nameProvider.setSomething('newValue');
}]);
// Usage - injected as dependency
moduleInstance.controller('ctrlName', function(name) { expect(name.properties).toEqual(values); });

// Decorators
// -----------
// Intercepts creation of service to override/augment its behaviour
// Under the hood, provider $get function is wrapped by decorator
// Used if a (3rd party) module's service needs a tweak before consumption, without affecting the original
moduleInstance.config(function($provide) {
    // Register service decorator with $injector
    // serviceName - name of service to decorate or delegate to
    // $delegate - original service instance
    $provide.decorator('serviceName', function($delegate, ...) {    // dependencies
        // ...
        return $delegatedInstance;                                  // returns instance of decorated/delegated service
    });
});
// Usage - injected as dependency
moduleInstance.controller('ctrlName', function(serviceName) { expect(serviceName).toEqual(returnValue); });



// Directives
// ===========
// Used to access and transform DOM, as artifacts manipulating DOM are hard to test
// HTML to JS name normalization process:
//  1. Strip x- and data- from the front of the element/attributes
//  2. Convert the :, -, or _-delimited name to camelCase
// Prefer using dash-delimited format, whereas use data-prefixed version with HTML validation tools
// Prefer using tag name and attributes over comment and class names for sake of clarity and ease
// Every time something is binded in UI, a $watch is created and insterted in the $watch list

// Text and attribute bindings
<a ng-href="img/{{username}}.jpg">Hello {{username}}!</a>

// ngAttr binds attribute that would otherwise be eagerly processed by browsers or has DOM API restrictions
<circle ng-attr-cx="{{cx}}"></circle>
// w/o ngAttr prefix it results in 'Error: Invalid value for attribute cx="{{cx}}"'

// Factory function is invoked only once when the $compiler first matches a directive
moduleInstance.directive('directiveName', ['dep1', ..., function Factory(dep1, ...) {
    return {
        // Replace the contents of the directive's element (default)
        // Replace the directive's element itself (if replace:true - DEPRECATED)
        // Wrap the contents of the directive's element (if transclude:true)
        template: 'some text {{$scope_property}} or {{expression}}',
        // Preferred over template option
        // Loads template asynchronously from specified url
        templateUrl: 'template-file.html',
        // Matches either attribute (default), element (default), class, comment
        // Use element when you are creating a component that is in control of the template
        // Use attribute when you are decorating an existing element with new functionality
        // Can be used as <my-directive my-directive="exp" class="my-directive: exp;"></my-directive> <!-- directive: my-directive exp -->
        restrict: 'AECM',
        // true - template will replace the directive's element
        // false - template will replace the contents of the directive's element
        // Useful with reusable custom components that are used within SVG contexts
        replace: 'false',   // DEPRECATED
        // Uses parent scope
        scope: false,
        // Creates child scope, prototypically inherited from parent scope
        scope: true,
        // Creates a new "isolate" scope, not prototypically inherited from parent scope
        // Useful when creating reusable components, which should not read/modify parent scope
        // Object hash defines a set of local scope properties derived from parent scope, used to pass data (attributes/scope) to directive
        scope: {},
        // One-way binding between local scope property and parent scope property i.e. String value of DOM attribute
        // Whenever parent scope property changes the corresponding isolated scope property also changes, but not vice versa
        // If attrName is not specified then attrName is assumed to be same as localName
        // Given <directive-name attr-name="hello {{name}}"> then localName reflects interpolated value of "hello {{name}}" on parent scope
        scope: {localName: '@attrName'},
        // Two-way binding between local scope property and parent scope property of name defined via the value of attribute
        // Whenever the parent scope model changes the corresponding isolated scope model also changes, and vice versa
        // Given <directive-name attr-name="parentModel"> then localModel reflects value of "parentModel" on parent scope
        scope: {localModel: '=attrName'},
        // Provides way to execute an expression in the context of parent scope
        // Allows an external or parent scope function to be passed into the directive and invoked
        // Given <directive-name attr-name="count=count+value"> then localFn points to function wrapper for "count=count+value" expression
        // To pass data from isolated scope to parent scope...
        // Option 1 - Pass an Object literal i.e. map of local variable names and values to localFn
        // Given <directive-name attr-name="increment(amount)"> then amount value can be specified by calling "localFn({amount: 22})"
        // Option 2 - Storing a Function Reference and Invoking It
        // Given <directive-name attr-name="increment"> then amount value can be specified by calling "localFn()(22)"
        scope: {localFn: '&attrName'},
        // Deals with transforming the original DOM (template element) before an instance and its scope is created of the element
        // There can be multiple element instances, but only one template element e.g. ng-repeat
        // The template instance and the link instance may be different objects if the template has been cloned
        // Not safe to do anything other than DOM transformations that apply to all cloned DOM nodes
        // Called once for each occurrence of the directive in the HTML page to do any one-time configuration needed
        compile: function(templateElement, templateAttrs, transcludeFn) {
            // Wraps all of the containing DOM element’s directives' linking functions
            // Returning a (post-link) function is equivalent to registering the linking function via link property
            return function postLink(scope, instanceElement, instanceAttrs, siblingDirectiveCtrl) { ... }
            // OR
            // Returning an object with function(s) registered via pre & post properties - controls when linking function should be called
            return {
                // Executed before the child elements are linked
                // Not safe to do DOM transformation since compiler linking function will fail to locate correct elements for linking
                pre: function preLink( ... ){ ... },
                // Executed after the child elements are linked
                // Safe to do DOM transformation on elements that are not waiting for their async templates to be resolved
                post: function postLink( ... ){ ... }
            }
        },
        // OR
        // Shorthand for having an empty compile function with an empty pre-link function and code in the post-link function
        // Responsible for registering DOM listeners as well as updating the DOM, and watching model for changes
        // Executed after template has been cloned. Most of the directive logic will be put here
        // runs for each cloned instance, that's why the compile() does not receive a scope
        // When the directive is removed use element.on('$destroy', ...) or scope.$on('$destroy', ...) to run a clean-up function
        // Called every time the element is to be bound to data in the $scope object
        link: function postLink(scope, instanceElement, instanceAttrs, siblingDirectiveCtrl, transcludeFn) {
            // 'siblingDirectiveCtrl' is available when 'require' option is used
        },
        // OR
        link: {
            pre: function preLink( ... ){ ... },
            post: function postLink( ... ){ ... }
        },  
        // true - Compile the DOM content of element/consumer and transclude/include/import/make it available into the directive
        // 'element' - Transclude the whole element including any directives defined at lower priority
        // Used with "ngTransclude" directive to mark the insertion point for transcluded DOM of nearest parent directive using transclusion
        // Transclusion function received in linking function is pre-bound to the correct/calling/parent scope
        // Transclusion is not a child, but a sibling of the isolate scope, and is bound to the parent (pre-isolate) scope
        transclude: true or 'element',
        // Require another directive and inject its controller as the fourth argument to the linking function
        // (no prefix) - Locate controller on current element, ^ - element and its parents, ? - pass null to link()) if controller not found
        // Throws error if directive or its controller cannot be found
        require: '^siblingDirectiveName', // or // ['^parentDirectiveName', '?optionalDirectiveName', '?^optionalParent'],
        // Controller constructor is instantiated before pre-linking phase and is shared with other directives (see require attribute)
        // Allows the directives to communicate with each other and augment each other's behavior
        controller: [$scope, $element, $attrs, $transclude, otherInjectables, function($scope, ...){
            // '$scope' and 'scope' are same thing. $scope is passed through Dependency Injection whereas scope is not
        }],
        // Compiler collects DOM nodes between nodes with attributes directive-name-start and directive-name-end
        // Groups the collected DOM nodes together as the directive elements
        // Use to repeat a series of elements instead of just one parent element
        multiElement: true,
        // Directives with greater numerical priority are compiled and applied first
        // compile() and preLink() run in priority order, whereas postLink() run in reverse order
        // Order of directives with same priority is undefined
        priority: 0
    };
    // OR
    return function postLink(scope, instanceElement, instanceAttrs) { ... }
}]);

// Attributes object passed to link() or compile() functions has variety of uses like Normalized attribute names, Directive inter-communication, Supports interpolation, Observing interpolated attributes.

// Execution order - Factory, template, compile, [controller, pre, post], [...], ..., link
// Executes the [functions] once for each cloned instance e.g. when using ng-repeat
// Executes post-link function on a directive when we don't have a child directive, or the child directive uses ng-repeat

/* 
// Considering original HTML markup as...
<level-1>
    <level-2 ng-repeat="i in [0,1,2]">
        <level-31> Hello {{name}} </level-31>
        <level-32> Hello {{name}} </level-32>
    </level-2>
</level-1>

// Execution order would be as...
// HERE THE ELEMENTS ARE STILL THE ORIGINAL TEMPLATE ELEMENTS
// COMPILE PHASE - compile function is called on original DOM
level-1: compile, 
    level-2: compile, 
        level-31: compile,
        level-32: compile
// AS OF HERE, THE ELEMENTS HAVE BEEN INSTANTIATED AND ARE BOUND TO A SCOPE
// PRE-LINK PHASE & POST-LINK PHASE (reverse order) - controller/pre/post-link function is called on element instance
level-1: controller, pre-link, post-link
    // NG-REPEAT WOULD HAVE MULTIPLE INSTANCES
    level-2: controller, pre-link, 
        level-31: controller, pre-link, post-link, 
        level-32: controller, pre-link, post-link, 
    level-2: post-link,
    level-2: controller, pre-link, 
        level-31: controller, pre-link, post-link, 
        level-32: controller, pre-link, post-link, 
    level-2: post-link,
    level-2: controller, pre-link, 
        level-31: controller, pre-link, post-link, 
        level-32: controller, pre-link, post-link, 
    level-2: post-link  
*/



// AJAX, Deferred & Promises
// ==========================
$http({
	method: 'GET', 
	url: 'https://...', 
	headers: {'Content-Type': undefined}, 
	data:{abc: 'xyz'},
	... })
	.success(function(data, status, headers, config, statusText){...})
	.error(function(data, status, headers, config, statusText){...});

// Setting HTTP Headers defaults in 'config' block
$httpProvider.defaults.headers.get = {'header-name': 'header-value'}
// Or in 'run' block
$http.defaults.headers.get = {'header-name': 'header-value'}

// Shortcut Methods
$http.get, $http.head, $http.post, $http.put, $http.delete, $http.jsonp, $http.patch

// Deferred, Promise:
// -------------------
// ES6 style promise using $q as a constructor
function asyncFun(arg){
	return $q(function(resolve, reject){
		setTimeout(function(){
			if(someCondition){
				resolve(value);
			} else{
				reject(reason);
			}
		}, 1000);
		return deferred.promise;
	});
}
var promise = asyncFun(par);
promise.then(successCallback, errorCallback, notifyCallback).catch(errorCallback).finally(callback, notifyCallback);

// CommonJS-style promise
function asyncFun(arg){
	var deferred = $q.defer();
	setTimeout(function(){
		deferred.notify(value);
		if(someCondition){
			deferred.resolve(value);
		} else{
			deferred.reject(reason);
		}
	}, 1000);
	return deferred.promise;
}
var promise = asyncFun(par);
promise.then(successCallback, errorCallback, notifyCallback).catch(errorCallback).finally(callback, notifyCallback);

// Chaining Promises
// promiseB will be resolved immediately after promiseA is resolved and its value will be the result of promiseA incremented by 1
promiseB = promiseA.then(function(result) {
  return result + 1;
});



// Code Structure
// ===============
// Global Function - dependency parameter names could get mangled during script minification
function componentName (dep1, ...) { ... }

// AngularJS way - a bit messy
angular.module('moduleName').componentType('componentName', ['dep1', ... , function(dep1, ...) { ... }]);

// IIFE - pulls code out of global scope
(function () {
    var componentName = function (dep1, ...) { ... };   // option 1
    componentName.$inject = ['dep1', ...];
    function componentName (dep1, ...) { ... }          // option 2
    angular.module('moduleName').componentType('componentName', componentName);
}());

// Global Namespacing
var yourRootNamespace = yourRootNamespace || {};
yourRootNamespace.yourApp = angular.module('moduleName', ['ngRoute']);
yourRootNamespace.yourApp.componentType('componentName', componentName);



// Complex Nesting of Partials and Templates
// ==========================================
<div ng-view></div> // Layout template

// Leveraging strings in ng-include:
<a ng-click="subPage='section1/subpage1.htm'">Sub Page 1</a> ... // View template
<ng-include src="subPage"></ng-include> // View template

// Create an object with links to sub pages:
$scope.pages = { page1: 'section1/subpage1.htm', ... }; // Controller
<a ng-click="subPage='page1'">Sub Page 1</a> ... // View template
<ng-include src="pages[subPage]"></ng-include> // View template

// Using $routeParams:
$routeProvider.when('/home/:tab', ...); // Config block
$scope.params = $routeParams; // Controller
<a href="#/home/tab1">Sub Page 1</a> ... // View template
<ng-include src=" '/home/' + params.tab + '.html' "></ng-include> // View template

// Using ng-switch:

// Using Nested Directive Controls:

// there are no ways to keep the parent state unchanged when children are updated via routing mechanics - the $route service re-creates the whole scope after a route is changed, losing its state completely. 



// Manual Bootstrap
(function() {
    var myApplication = angular.module("myApplication", []);

    fetchData().then(bootstrapApplication);

    function fetchData() {
        var $http = angular.injector(["ng"]).get("$http");

        return $http.get("/path/to/data.json")
            .then(function(response) {
                myApplication.constant("config", response.data);
            }, function(errorResponse) {
                // Handle error case
            });
    }

    function bootstrapApplication() {
        angular.element(document).ready(function() {
            angular.bootstrap(document, ["myApplication"]);
        });
    }
}());


$injector.invoke(function($rootScope, $compile, $document) {
    $compile($document)($rootScope);
    $rootScope.$digest();
});

// HTML block containing ng-controller added to end of document body by JQuery, and then compiled and linked into current AngularJS scope
var $div = $('<div ng-controller="MyCtrl">{{content.label}}</div>');
$(document.body).append($div);
angular.element(document).injector().invoke(function($compile) {
    var scope = angular.element($div).scope();
    $compile($div)(scope);
});

$injector.instantiate(function myCtrl($scope){ });



window.app.config([
    '$routeProvider',
    '$controllerProvider',
    '$compileProvider',
    '$filterProvider',
    '$provide',
    function ($routeProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {
        //router definition here
        //store a reference to various provider functions
        window.app.components = {
            controller: $controllerProvider.register,
            service: $provide.service
        }
    }
]);
app.components.controller('loginController'); 



// $injector = angular.injector(modules, [strictDi]);
// Creates an injector object that can be used for retrieving services as well as for dependency injection.
// $injector is used to retrieve object instances as defined by provider, instantiate types, invoke methods, and load modules.
// $provide service has a number of methods for registering components with the $injector.
// When you request a service, the $injector is responsible for finding the correct service provider, instantiating it and then calling its $get service factory function to get the instance of the service.



// angularFiles.js - defines config info for Grunt build task, has map of files
// src\[angular/*].[prefix/suffix] - prepends/appends code at the beginning/end of other files during the build process
// angular.prefix - IIFE
// angular.suffix - checks if Angular has already bootstraped, binds jQuery to angular.element if available, publish Angular public API, calls angularInit() on DOMContentLoaded event
// angularInit() -  sniff out any Angular application instances declared on the page from an elements array, and sends it off to bootstrap() via appElement
//   Loop through the names array and query anything that could be an Angular app, then append the queried elements to our elements array.
//   Loop through our elements array and see if there's anything that should be bootstrapped as an application and assign it to appElement.
//   Loop through the attributes of the element and see if any of the attribute names match keys from our names array.
//   Bootstrap the element that has the application declaration.
// angular.bootstrap() - compiles passed element's static content to dynamic Angular app along with its dependencies and scope
//   Convert the element we passed in to a jqLite element
//   Ensure there is no injector setup for the element already i.e the element has not already been bootstrapped
//   Provide $rootElement to the element that is being bootstrapped
//   Create an injector instance and assign it to "injector"
//   Invoke scope.$apply() and inject scope, element, compile, injector and animate as dependencies
//   Instance of the $injector returned from doBootstrap()
//   Setup a regular expression to look for "NG_DEFER_BOOTSTRAP"
//   Check window.name against our regex and call doBootstrap() if it fails
//   Remove "NG_DEFER_BOOTSTRAP" from window.name
//   Create a method that allows for extra modules to be added to during the bootstrapping process
// Element is compiled with its dependencies and scope
