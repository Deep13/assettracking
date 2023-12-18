/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./CustomListSelection","sap/ui/support/supportRules/Storage","sap/ui/support/supportRules/ui/models/SelectionUtils","sap/ui/support/supportRules/Constants"],function(C,S,a,b){"use strict";var c=C.extend("sap.ui.support.supportRules.ui.models.CustomJSONListSelection",{constructor:function(o,d,k){C.call(this,o,k);this._dependent=d;},_updateModelAfterSelectionChange:function(e){var B=this._getBinding();var m=B.getModel();var d=m.getData();var f=e.getParameter("rowIndices")||[];var s=this._getSelectionModel();var t=this;function g(p,h,k){var n=m.getProperty(p+"/nodes");if(t._isTree()&&t._dependent){if(n&&n.length){for(var j=0;j<n.length;j++){g(p+"/nodes/"+j+"",h,true);t.updateModelAfterChangedSelection(d,p,h);}}else{if(!h&&!k){var P=p.split("/");P.pop();P.pop();var l=P.join("/");t._setSelectionForContext(m,m.createBindingContext(l),h);}}}t.updateModelAfterChangedSelection(d,p,h);t._setSelectionForContext(m,m.createBindingContext(p),h);}for(var i=0;i<f.length;i++){var o=this._getContextByIndex(f[i]);if(o){g(o.getPath(),s.isSelectedIndex(f[i]));}}this.syncParentNodeSelectionWithChildren(d,B.getModel("treeModel"));this._finalizeSelectionUpdate();a.getSelectedRules();if(S.readPersistenceCookie(b.COOKIE_NAME)){a.persistSelection();var T=S.getRules();a.getRulesSelectionState().forEach(function(r){if(r.libName==="temporary"){T.forEach(function(h){if(r.ruleId===h.id){h.selected=r.selected;}});}});S.setRules(T);}}});return c;});
