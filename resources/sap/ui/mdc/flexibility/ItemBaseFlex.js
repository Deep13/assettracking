/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/changeHandler/Base","sap/ui/fl/apply/api/FlexRuntimeInfoAPI"],function(F,a){"use strict";var I={_bSupressFlickering:true,beforeAddItem:function(D,d,c,p){return D.addItem.call(D,d,c,p);},afterRemoveItem:function(D,i,c,p){return D.removeItem.call(D,i,c,p);},findItem:function(m,d,n){return;},beforeApply:function(c,C,i){return;},afterApply:function(c,C,i){return;},determineAggregation:function(m,c){var d=m.getControlMetadata(c).getDefaultAggregation().name;var D=m.getAggregation(c,d);return{name:d,items:D};},_getExistingAggregationItem:function(c,p,C){var m=p.modifier;var A=this.determineAggregation(m,C);var b=A.items;var o;if(b){o=this.findItem(m,b,c.name);}return o;},_getDelegate:function(d,s,f){sap.ui.require([d],s,f);},_getOperationText:function(i){return i?"reverted ":"applied ";},_getChangeTypeText:function(A){return A?"add":"remove";},_delayInvalidate:function(c){if(c&&c.isInvalidateSuppressed&&!c.isInvalidateSuppressed()){c.iSuppressInvalidate=1;a.waitForChanges({element:c}).then(function(){c.iSuppressInvalidate=0;c.invalidate();});}},_applyAdd:function(c,C,p,i){this.beforeApply(c.getChangeType(),C,i);if(this._bSupressFlickering){this._delayInvalidate(C);}return new Promise(function(r,b){var m=p.modifier,o=i?c.getRevertData():c.getContent();var d=o.name;var A=this.determineAggregation(m,C);var D=A.items;var e=o.index>-1?o.index:D.length;var f=this._getExistingAggregationItem(o,p,C);var P=f?Promise.resolve(f):new Promise(function(r,b){var m=p.modifier;this._getDelegate(m.getProperty(C,"delegate").name,function(g){this.beforeAddItem(g,d,C,p,o).then(function(h){if(h){r(h);}else{b();}});}.bind(this),b);}.bind(this));P.then(function(f){if(!f){b(new Error("No item in"+A.name+"  created. Change to "+this._getChangeTypeText(!i)+"cannot be "+this._getOperationText(i)+"at this moment"));return;}if(D.indexOf(f)<0){m.insertAggregation(C,A.name,f,e);}else{F.markAsNotApplicable("Specified change is already existing",true);}if(i){c.resetRevertData();}else{c.setRevertData({id:m.getId(f),name:o.name,index:e});}this.afterApply(c.getChangeType(),C,i);r();}.bind(this),function(){b(new Error("Change to "+this._getChangeTypeText(!i)+"cannot be"+this._getOperationText(i)+"at this moment"));}.bind(this));}.bind(this));},_applyRemove:function(c,C,p,i){this.beforeApply(c.getChangeType(),C,i);if(this._bSupressFlickering){this._delayInvalidate(C);}return new Promise(function(r,b){var m=p.modifier,o=i?c.getRevertData():c.getContent();var A=this.determineAggregation(m,C);var d=this._getExistingAggregationItem(o,p,C);if(!d){if(i){b(new Error("No item found in "+A.name+". Change to "+this._getChangeTypeText(i)+"cannot be "+this._getOperationText(i)+"at this moment"));return;}else{F.markAsNotApplicable("Specified change is already existing",true);}}var e=m.findIndexInParentAggregation(d);m.removeAggregation(C,A.name,d);if(i){c.resetRevertData();}else{c.setRevertData({id:m.getId(d),name:o.name,index:e});}this._getDelegate(m.getProperty(C,"delegate").name,function(D){this.afterRemoveItem(D,d,C,p).then(function(f){if(f){m.destroy(d);}this.afterApply(c.getChangeType(),C,i);r();}.bind(this));}.bind(this),b);}.bind(this));},_applyMove:function(c,C,p,i){this.beforeApply(c.getChangeType(),C,i);if(this._bSupressFlickering){this._delayInvalidate(C);}return new Promise(function(r,b){var m=p.modifier;var o=i?c.getRevertData():c.getContent();var d=this._getExistingAggregationItem(o,p,C);var A=this.determineAggregation(m,C);if(!d){b(new Error("No corresponding item found in "+A.name+" found. Change to move item cannot be "+this._getOperationText(i)+"at this moment"));return;}var O=m.findIndexInParentAggregation(d);if(C.moveColumn){C.moveColumn(d,o.index);}else{m.removeAggregation(C,A.name,d);m.insertAggregation(C,A.name,d,o.index);}if(i){c.resetRevertData();}else{c.setRevertData({id:m.getId(d),name:o.name,index:O});}this.afterApply(c.getChangeType(),C,i);r();}.bind(this));},_removeIndexFromChange:function(c){delete c.getContent().index;},createChangeHandler:function(A,c,r){return{"changeHandler":{applyChange:function(C,o,p){return A(C,o,p);},completeChangeContent:function(C,m,p){c(C,m,p);},revertChange:function(C,o,p){return r(C,o,p,true);}},"layers":{"USER":true}};},createAddChangeHandler:function(){var A=this._applyAdd.bind(this);var c=function(){};var r=this._applyRemove.bind(this);return this.createChangeHandler(A,c,r);},createRemoveChangeHandler:function(){var A=this._applyRemove.bind(this);var c=this._removeIndexFromChange.bind(this);var r=this._applyAdd.bind(this);return this.createChangeHandler(A,c,r);},createMoveChangeHandler:function(){var A=this._applyMove.bind(this);var c=function(){};var r=A;return this.createChangeHandler(A,c,r);}};return I;});
