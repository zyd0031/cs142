"use strict";

function Cs142TemplateProcessor(template){
    this.template = template;
}

Cs142TemplateProcessor.prototype.fillIn = function(directory){
    var filledTemplate = this.template;

    filledTemplate = filledTemplate.replace(/\{\{(\w+)\}\}/g, function(match, key){
        return key in dictionary ? directory[key] : '';
    });
    return filledTemplate;
}