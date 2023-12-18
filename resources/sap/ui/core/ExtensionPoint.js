/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/Log","sap/base/util/ObjectPath","sap/ui/core/mvc/View"],function(L,O,V){"use strict";sap.ui.extensionpoint=function(c,e,C,t,a){L.warning("Do not use deprecated factory function 'sap.ui.extensionpoint'. Use 'sap.ui.core.ExtensionPoint.load' instead","sap.ui.extensionpoint",null,function(){return{type:"sap.ui.extensionpoint",name:e};});return E._factory(c,e,C,t,a);};var E=sap.ui.extensionpoint;E._factory=function(c,e,C,t,a){var b,v,r;var d=sap.ui.require('sap/ui/core/CustomizingConfiguration');if(c){if(c.isA("sap.ui.core.mvc.View")){b=d&&d.getViewExtension(c.sViewName,e,c);v=c;}else if(c.isA("sap.ui.core.Fragment")){b=d&&d.getViewExtension(c.getFragmentName(),e,c);v=c._oContainingView;}}if(b){if(b.className){var f=sap.ui.requireSync(b.className.replace(/\./g,"/"));f=f||O.get(b.className);var I=v&&b.id?v.createId(b.id):b.id;L.info("Customizing: View extension found for extension point '"+e+"' in View '"+v.sViewName+"': "+b.className+": "+(b.viewName||b.fragmentName));if(b.className==="sap.ui.core.Fragment"){var F=new f({id:I,type:b.type,fragmentName:b.fragmentName,containingView:v});r=(Array.isArray(F)?F:[F]);}else if(b.className==="sap.ui.core.mvc.View"){v=V._legacyCreate({type:b.type,viewName:b.viewName,id:I});r=[v];}else{L.warning("Customizing: Unknown extension className configured (and ignored) in Component.js for extension point '"+e+"' in View '"+v.sViewName+"': "+b.className);}}else{L.warning("Customizing: no extension className configured in Component.js for extension point '"+e+"' in View '"+v.sViewName+"': "+b.className);}}else if(E._fnExtensionProvider){var s=E._fnExtensionProvider(v);var g;if(v.isA("sap.ui.core.Fragment")){g=v._sExplicitId;var o=v.getController();v=o&&o.getView();if(v){g=v.getLocalId(g);}else{L.warning("View instance could not be passed to ExtensionPoint Provider for extension point '"+e+"' "+"in fragment '"+g+"'.");}}if(s){return[{providerClass:s,view:v,fragmentId:g,name:e,createDefault:C,targetControl:undefined,aggregationName:undefined,index:undefined,ready:function(h){var n=this._nextSibling;while(n!=null){n.index+=h.length;n=n._nextSibling;}},_isExtensionPoint:true,_nextSibling:null}];}}if(!r&&typeof C==='function'){r=C();}var p=function(r){if(r&&!Array.isArray(r)){r=[r];}if(r&&t){var A=t.getMetadata().getAggregation(a);if(A){for(var i=0,l=r.length;i<l;i++){t[A._sMutator](r[i]);}}else{L.error("Creating extension point failed - Tried to add extension point with name "+e+" to an aggregation of "+t.getId()+" in view "+v.sViewName+", but sAggregationName was not provided correctly and I could not find a default aggregation");}}return r||[];};if(r&&typeof r.then==='function'){return r.then(p);}else{return p(r);}};E.registerExtensionProvider=function(e){if(e==null){delete E._fnExtensionProvider;}else if(typeof e=="function"){E._fnExtensionProvider=e;}else{L.error("ExtensionPoint provider must be a function!");}};E.load=function(o){return Promise.resolve(E._factory(o.container,o.name,o.createDefaultContent));};return E;});
