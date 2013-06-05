
JQVALIDATE JQUERY PLUGIN 0.2
==============

Created to validate forms
--------------

pending documentation


PENDING GLOBAL MESSAGE


PENDING ADD VALIDATION TAKS FUNCTIONALITY


Here is an example of how to use the plugin and it contains all the possible options
--------------

	//storing element in jQuery wrapper
	var form = $('#form'); 


	//executing plugin
	form.jqvalidate({

		//REQUIRED
		//SUBMIT BUTTON SELECTOR
		submitBtnSelector: '#submit',

		//OPTIONAL
		//WILL BE EXECUTED WHEN THE FORM IS VALID
		//you can add custom code here
		onSuccess: function(){
			console.log('onsuccessr', this);
		},
		//OPTIONAL
		//WILL BE EXECUTED WHEN THE FORM IS NOT VALID
		//this object will be an array with the form elements that failed validation
		//you can add custom code here
		onError: function(){
			console.log('onError', this);
		},
		//OPTIONAL
		//defaultValue 'invalid'
		//INVALID CLASS THAT WILL BE ADDED TO THE INVALID INPUTS, SELECTS, TEXTAREAS
		invalidCls: 'invalid',

		//OPTIONAL
		//default value 'span'
		//TAG THAT WILL BE USED FOR THE ERROR LABEL
		errorLabelTag: 'span',

		//OPTIONAL
		//default value is 'errorLabel'
		//CLASS FOR THE ERROR LABEL ELEMENTS
		errorLabelCls: 'errorLabel',

		//OPTIONAL
		//default valie is true
		//CHANGE FLAG TO FALSE IF YOU DONT WANT TO PRINT ERRORS
		shouldPrintErrors: true,
	});

--------------

--------------
Please remember to allways destroy the plugin instance when is no longer needed by runnung this line
	
	//form is the name of the variable where the jQuery element was stored in.
	form.data('jqvalidate').destroy();

--------------



*****

**Copyright (c) 2012 Ian Calderon MIT LICENSED

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
