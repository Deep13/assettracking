/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./BaseContentRenderer","sap/ui/core/Core","sap/ui/core/Control","sap/ui/model/json/JSONModel","sap/ui/base/ManagedObjectObserver","sap/ui/integration/util/LoadingProvider"],function(B,C,a,J,M,L){"use strict";var b=a.extend("sap.ui.integration.cards.BaseContent",{metadata:{library:"sap.ui.integration",aggregations:{_content:{multiple:false,visibility:"hidden"}},associations:{card:{type:"sap.ui.integration.widgets.Card",multiple:false}},events:{press:{}}},renderer:B});b.prototype.init=function(){this._iWaitingEventsCount=0;this._bReady=false;this._mObservers={};this._awaitEvent("_dataReady");this._awaitEvent("_actionContentReady");this._oLoadingProvider=new L();};b.prototype.ontap=function(e){if(!e.isMarked()){this.firePress({});}};b.prototype.exit=function(){this._iWaitingEventsCount=0;if(this._mObservers){Object.keys(this._mObservers).forEach(function(k){this._mObservers[k].disconnect();delete this._mObservers[k];},this);}this._oServiceManager=null;this._oDataProviderFactory=null;this._oIconFormatter=null;if(this._oDataProvider){this._oDataProvider.destroy();this._oDataProvider=null;}if(this._oActions){this._oActions.destroy();this._oActions=null;}if(this._oLoadingProvider){this._oLoadingProvider.destroy();this._oLoadingProvider=null;}if(this._oLoadingPlaceholder){this._oLoadingPlaceholder.destroy();this._oLoadingPlaceholder=null;}};b.prototype.loadDependencies=function(c){return Promise.resolve();};b.prototype.getActions=function(){return this._oActions;};b.prototype.setActions=function(A){this._oActions=A;};b.prototype._awaitEvent=function(e){this._iWaitingEventsCount++;this.attachEventOnce(e,function(){this._iWaitingEventsCount--;if(this._iWaitingEventsCount===0){this._bReady=true;this.fireEvent("_ready");}});};b.prototype.setConfiguration=function(c,t){this._oConfiguration=c;if(!c){return this;}this._oLoadingPlaceholder=this._oLoadingProvider.createContentPlaceholder(c,t);this._setDataConfiguration(c.data);return this;};b.prototype.getConfiguration=function(){return this._oConfiguration;};b.prototype._setDataConfiguration=function(d){if(!d){this.fireEvent("_dataReady");return;}this.bindObject(d.path||"/");if(this._oDataProvider){this._oDataProvider.destroy();}if(this._oDataProviderFactory){this._oDataProvider=this._oDataProviderFactory.create(d,this._oServiceManager);}if(this._oDataProvider){this.setModel(new J());this._oDataProvider.attachDataRequested(function(){this.onDataRequested();}.bind(this));this._oDataProvider.attachDataChanged(function(e){this._updateModel(e.getParameter("data"));this.onDataChanged();this.onDataRequestComplete();}.bind(this));this._oDataProvider.attachError(function(e){this._handleError(e.getParameter("message"));this.onDataRequestComplete();}.bind(this));this._oDataProvider.triggerDataUpdate();}else{this.fireEvent("_dataReady");}};b.prototype.destroyPlaceholder=function(){var c=this.getAggregation("_content");if(c){c.removeStyleClass("sapFCardContentHidden");}if(this._oLoadingPlaceholder){this._oLoadingPlaceholder.destroy();this._oLoadingPlaceholder=null;}};b.prototype.onDataChanged=function(){};function _(A,c,o){var d=this.getBindingContext(),e=c.getAggregation(A);if(d){o.path=o.path||d.getPath();c.bindAggregation(A,o);if(this.getModel("parameters")&&e){this.getModel("parameters").setProperty("/visibleItems",e.length);}if(!this._mObservers[A]){this._mObservers[A]=new M(function(f){if(f.name===A&&(f.mutation==="insert"||f.mutation==="remove")){var e=c.getAggregation(A);var l=e?e.length:0;if(this.getModel("parameters")){this.getModel("parameters").setProperty("/visibleItems",l);}}}.bind(this));this._mObservers[A].observe(c,{aggregations:[A]});}}}b.prototype._bindAggregationToControl=function(A,c,o){var d=A&&typeof A==="string";var e=o&&typeof o==="object";if(!d||!c||!e){return;}if(this.getBindingContext()){_.apply(this,arguments);}else{c.attachModelContextChange(_.bind(this,A,c,o));}};b.prototype.isReady=function(){return this._bReady;};b.prototype._updateModel=function(d){this.getModel().setData(d);};b.prototype._handleError=function(l){this.fireEvent("_error",{logMessage:l});};b.prototype.setServiceManager=function(s){this._oServiceManager=s;return this;};b.prototype.setDataProviderFactory=function(d){this._oDataProviderFactory=d;return this;};b.prototype.setIconFormatter=function(i){this._oIconFormatter=i;return this;};b.prototype.isLoading=function(){var l=this._oLoadingProvider,c=this.getCardInstance();return!l.getDataProviderJSON()&&(l.getLoadingState()||(c&&c.isLoading()));};b.prototype.attachPress=function(){var m=Array.prototype.slice.apply(arguments);m.unshift("press");a.prototype.attachEvent.apply(this,m);this.invalidate();return this;};b.prototype.detachPress=function(){var m=Array.prototype.slice.apply(arguments);m.unshift("press");a.prototype.detachEvent.apply(this,m);this.invalidate();return this;};b.prototype.onActionSubmitStart=function(f){};b.prototype.onActionSubmitEnd=function(r,e){};b.prototype.onDataRequested=function(){if(this._oLoadingProvider){this._oLoadingProvider.createLoadingState(this._oDataProvider);}};b.prototype.onDataRequestComplete=function(){this.fireEvent("_dataReady");this.destroyPlaceholder();this._oLoadingProvider.setLoading(false);};b.prototype.getCardInstance=function(){return C.byId(this.getCard());};return b;});
