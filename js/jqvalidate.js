/**
* JQValidate Jquery Plugin
* Created to validate forms
* Version 0.2
* Copyright 2012 Ian Calderon Lopez
* MIT LICENSED 2012
*/

/**
 *PENDING OPTIIONS VALIDATION
 *PENDING GLOBAL MESSAGE
 *PENDING ADD VALIDATION TAKS FUNCTIONALITY
 *PENDING UNIT TESTING
 */
(function(window, document, $, undefined){

var
/**********************************Private variables**************************************/
//Plugin Class
plugin,

//CONSTANTS
DATA_VALIDATION_TASKS = 'formvalidation',
DATA_DEFAULT_VALUE = 'defaultvalue',
EMPTY_STRING = '',
INDIVIDUAL_MESSAGE_IDENTIFIER = 'individual',

//DOM elements
$submitBtn,
$formInputElements,

//FormChildList reference
allFormElements,

//other vars
boolShouldLog = true,
boolIsFormValid,
formElementId = 0,

//objects
validationTasks = {
	required: {
		name: 'required',
		fn: function(strVal, defaultVal){
			return strVal !== defaultVal;
		},
		strError: 'this field is required'
	},
	number:{
		name: 'number',
		fn: function(strVal){
			return (/^\d+$/).test(strVal);
		},
		strError: 'please enter a number only'
	}
},
defaultOptions = {
	invalidCls: 'invalid',
	msgType: 'individual',
	errorLabelTag: 'span',
	errorLabelCls: 'errorLabel',
	shouldPrintErrors: true,
},

/**********************************Private methods**************************************/
/**
 * log method
 * @param  {string} strMsg message that will be printed on console
 * @return {void}
 */
log = function(strMsg){
	if(!boolShouldLog){ return false; }
	console.log(strMsg);
},
/**
 * containString method
 * @param  {string} strTypes      [description]
 * @param  {string} strIdentifier [description]
 * @return {boolean} true if contains string, else returns false
 */
containString = function(strTarget, strElement){
	return strTarget.match(strElement) !== null;
},
/**
 * local push method
 * local reference to Array push method
 */
local_push = Array.prototype.push;

/**********************************Base Classes**************************************/

/**
 *
 *FormChild Class
 *Base Class for form child elements
 *@param [jQuery object] element 
 */
var FormChild = function(el){
	this.id = formElementId++;
	this.$el = el;
	this.$parent = this.$el.parent();
	this.errors = [];
	this.errorLabel = $(document.createElement(defaultOptions.errorLabelTag));
	this.errorLabel.addClass(defaultOptions.errorLabelCls);
};

/**
 *FormChild Prototype
 */
FormChild.prototype = {
	constructor: FormChild,

	/**
	 *addError Method
	 *@param [string] strErrorName error type name
	 *@return [FormChild] current FormChild object
	 */
	addError: function(strErrorName){
		if(!this.containsError(strErrorName)){
			this.errors.push(strErrorName);
		}

		return this;
	},

	/**
	 *removeError Method
	 *@param [string] strErrorName error type name
	 *@return [FormChild] current FormChild object
	 */
	removeError: function(strErrorName){
		var index = this.indexOfError(strErrorName);

		if(index !== -1){
			this.errors.splice(index, 1);
		}
		return this;
	},

	/**
	 *containsError Method
	 *@param [string] strErrorName error type name
	 *@return [boolean] true if contains error, else false
	 */
	containsError: function(strErrorName){
		return this.errors.indexOf(strErrorName) !== -1;
	},

	/**
	 *indexOfError Method
	 *@param [string] strErrorName error type name
	 *@return [int] error index, else -1 if error does not exist on error array
	 */
	indexOfError: function(strErrorName){
		return this.errors.indexOf(strErrorName);
	},

	/**
	 *firstError Method
	 *@return [string] first error name of the error array
	 *@return void
	 */
	firstError: function(){
		return this.errors[0];
	},
	generateAndPrintError: function(){
		var errorName = this.firstError(),
				errorMessage = validationTasks[errorName].strError;

			this.errorLabel.text(errorMessage);
			this.$parent.append(this.errorLabel);
	},
	clearErrorLabel: function(){
		this.errorLabel.text('');
	}
};


/**
 *
 *FormChildList Class
 *@arguments [FormChild] elements as individual params
 */
var FormChildList = function(){
	var i;

	this.length = 0;
	this.addElements(arguments);

};

/**
 *FormChild Prototype
 */
FormChildList.prototype = {
	constructor: FormChildList,
	splice: Array.prototype.splice,
	/**
	 *addElement Method
	 *@param [FormElement] element that will be added to element array
	 *@return [FormChildList] current FormChildList object
	 */
	addElement: function(el){

		if(!this.containsElement(el) && (el instanceof FormChild)){
			local_push.call(this, el);
		}

		return this;
	},

	addElements: function(elements){

		for(i=0; i<elements.length; i++){
			this.addElement(elements[i]);
		}
	},

	/**
	 *removeElement Method
	 *@param [FormElement] element that will be removed to element array
	 *@return [FormChildList] current FormChildList object
	 */
	removeElement: function(el){
		var index = this.indexOfElement(el);

		if(index !== -1){
			this.splice(index, 1);
		}

		return this;
	},

	/**
	 *containsElement Method
	 *@param [FormElement] element that will be looked for in the element array
	 *@return [boolean] true if the element exists on elements array, else false
	 */
	containsElement: function(el){
		var i,
			id = el.id,
			ret = false;

		for(i=0; i<this.length; i++){
			var currentId = this[i].id;

			if(id === currentId){
				ret = true;
				break;
			}
		}

		return ret;
	},

	/**
	 *indexOfElement Method
	 *@param [FormElement] element that will be looked for in the element array
	 *@return [int] element index if the element exists on elements array, else -1
	 */
	indexOfElement: function(el){
		var i,
			id = el.id,
			ret = -1;

		for(i=0; i<this.length; i++){
			var currentId = this[i].id;

			if(id === currentId){
				ret = i;
				break;
			}
		}

		return ret;
	},
	/**
	 *allElementsWithErrors Method
	 *@return [Array] array contains all elements that have validation errors
	 */
	allElementsWithErrors: function(boolShuldExportRegularArray){
		var ret = typeof boolShuldExportRegularArray !== 'undefined' ? [] : new FormChildList(),
			i,
			currentEl;

		for(i=0; i<this.length; i++){
			currentEl = this[i];

			if(currentEl.errors.length > 0){
				if(boolShuldExportRegularArray){
					ret.push(currentEl);
				} else {
					ret.addElement(currentEl);
				}	
			}

			currentEl = null;
		}

		return ret;
	},
	forEachElement: function(fn) {
		var i;

		for (i = 0; i < this.length; i++) {
			fn.call(this[i], i);
		}
	},
	clearElementsErrorLabels: function(){
		this.forEachElement(function(){
			this.clearErrorLabel();	
		});
	}
};


/**
 * Plugin Class
 * @param  {jQuery Object} $element will be the form object wrapped in a jquery object
 * @param  {object} options  Set of options provided by the user
 * @return {jQuery Object} the form element received as param so the user can use chaining
 */
plugin = function($element, options){
	
	this.initialize = function(){
		log('************************LOG: Attempting to initialize plugin*****************************');

		//validating options
		options = $.extend({}, defaultOptions, options);

		//setting default values
		boolIsFormValid = true;

		//storing inputs and selects
		$formInputElements = $.merge($element.find('input'), $element.find('select'));
		$formInputElements = $.merge($formInputElements, $element.find('textarea'));
		$submitBtn = $(options.submitBtnSelector);

		//this reference will store all form elements
		allFormElements = new FormChildList();

		//creating all necessary FormChild instances
		this.initAllFormChildElements();

		//adding all event listeners
		this.addListeners();

		log('************************LOG: Initialized Plugin sucessfully************************');	
	};


	/**
	 * This method create a FormChild instance for every input, select and textarea
	 * and adds it to the main FormChildList instance
	 * @return {void}
	 */
	this.initAllFormChildElements = function(){
		var i;

		log('LOG: Attempting to initialize all form child elements...');

		$formInputElements.each(function(i){
			var newChild,
				currentInput;

			currentInput = $(this);
			newChild = new FormChild(currentInput);
			allFormElements.addElement(newChild);

			newEl = null;
			currentInput = null;
		});


		//removing allformInputElement references and deleting array
		for(i=0; i<$formInputElements; i++){
			$formInputElements[i] = null;
			delete $formInputElements[i];
		}

		$formInputElements = null;

		log('LOG: Initialized all form child elements sucessfully');
	};

	/**
	 * Adds all necesary event listentes
	 * @return {void}
	 */
	this.addListeners = function(){
		log('LOG: Attempting to add all Listeners...');

		//on submit form listener
		//binds plugin context to callback method
		$element.on('submit',$.proxy(this.beginValidation, this));

		log('LOG: Addedd all Listeners sucessfully...');
	};

	/**
	 * inits the validation process
	 * @param  {event} evt event object
	 * @return {void}
	 */
	this.beginValidation = function(evt, objParams){
		var key;

		evt.preventDefault();
		log('************************LOG: BeginValidation onform submit, Starting validation...************************');

		for(key in validationTasks){
			this.validateFormChild(key);
		}

		//clear all labels
		allFormElements.clearElementsErrorLabels();

		if(defaultOptions.shouldPrintErrors){
			this.printErrors();
		}

		if(boolIsFormValid){
			//executing success callback if available
			if(options.onSuccess){
				options.onSuccess.call(allFormElements.allElementsWithErrors(true));
			}
		} else {
			//executing error callback if available
			if(options.onError){
				options.onError.call(allFormElements.allElementsWithErrors(true));
			}
		}
		
		log('************************LOG: BeginValidation Validation complete...************************');
	};

	/**
	 * Validates Every form child instance
	 * @param  {string} strKey current validationTask key name
	 * @return {void}
	 */
	this.validateFormChild = function (strKey) {
		
		var currentTask = validationTasks[strKey];

		boolIsFormValid = true;

		log('LOG: Attempting to validate for '+strKey+'...');

		allFormElements.forEachElement(function(){
			var validateFor = this.$el.data(DATA_VALIDATION_TASKS) || EMPTY_STRING,
				defaultValue = this.$el.data(DATA_DEFAULT_VALUE) || EMPTY_STRING;

			if(containString(validateFor, currentTask.name)){

				if(currentTask.fn(this.$el.val(), defaultValue)){
					this.removeError(currentTask.name);
					this.$el.removeClass(defaultOptions.invalidCls);

				} else {
					this.addError(currentTask.name);
					this.$el.addClass(defaultOptions.invalidCls);
					boolIsFormValid = false;
				}
			}

		});

		currentTask = null;

		log('LOG: Validation for '+strKey+' completed successfuly');
	};

	/**
	 * prints global or individual errors
	 * @return {void}
	 */
	this.printErrors = function(){

		log('LOG: Attempting to print errors...');

		if(defaultOptions.msgType === INDIVIDUAL_MESSAGE_IDENTIFIER){
			this.printEachError();
		} else {
			this.printErrorsToPanel();
		}

		log('LOG: Errors printed successfuly...');
	};

	/**
	 * Prints all individual errors
	 * @return {void}
	 */
	this.printEachError = function(){
		log('LOG: Attempting to print each  errors...');

		var elementsWithErrors = allFormElements.allElementsWithErrors();

		elementsWithErrors.forEachElement(function(){
			this.generateAndPrintError();
		});
		

		log('LOG: individual Errors printed successfuly...');
	};

	//init plugin
	this.initialize();

	//returning jQuery object to allow chaninig
	return $element;
};


/**
 * Integrating plugin with jQuery
 * @param  {object} options plugin options
 * @return {plugin object}
 */
$.fn.formValidation = function(options){
	return new plugin(this, options);
};

}(this, document, jQuery));

/*
Copyright (c) 2011 Ian Calderon MIT LICENCED

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/


$('#form').formValidation({
	submitBtnSelector: '#submit',
	onSuccess: function(){
		console.log('onsuccessr', this);
	},
	onError: function(){
		console.log('onError', this);
	}
});


