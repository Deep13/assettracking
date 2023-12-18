/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/library','sap/m/library','sap/ui/Device'],function(c,l,D){"use strict";var B=l.BackgroundHelper;var T=c.TitleLevel;var S={apiVersion:2};S.render=function(r,C){var t=(C.getTitleLevel()===T.Auto)?T.H1:C.getTitleLevel();t=t.toLowerCase();r.openStart("div",C);r.class("sapMShell");if(C.getAppWidthLimited()){r.class("sapMShellAppWidthLimited");}B.addBackgroundColorStyles(r,C.getBackgroundColor(),C.getBackgroundImage(),"sapMShellGlobalOuterBackground");var s=C.getTooltip_AsString();if(s){r.attr("title",s);}r.openEnd();B.renderBackgroundImageTag(r,C,["sapContrastPlus","sapMShellBG","sapUiGlobalBackgroundImageForce"],C.getBackgroundImage(),C.getBackgroundRepeat(),C.getBackgroundOpacity());r.openStart("div");r.class("sapMShellBrandingBar");r.openEnd();r.close("div");r.openStart("div");r.class("sapMShellCentralBox");r.openEnd();var e="",a="";if(!C.getBackgroundImage()){e="sapMShellBackgroundColorOnlyIfDefault";a="sapUiGlobalBackgroundImageOnlyIfDefault";}r.openStart("header",C.getId()+"-hdr");r.class("sapMShellHeader");r.class(e);r.openEnd();r.openStart("div");r.class(a);r.openEnd();r.close("div");S.getLogoImageHtml(r,C);if(C.getTitle()){r.openStart(t,C.getId()+"-hdrTxt");r.class("sapMShellHeaderText");r.openEnd();r.text(C.getTitle());r.close(t);}r.openStart("span");r.class("sapMShellHeaderRight");r.openEnd();r.openStart("span",C.getId()+"-hdrRightTxt");if(!C.getHeaderRightText()){r.style("display","none");}r.class("sapMShellHeaderRightText");r.openEnd();r.text(C.getHeaderRightText());r.close("span");if(C.getShowLogout()){var b=sap.ui.getCore().getLibraryResourceBundle("sap.m");r.openStart("a",C.getId()+"-logout");r.attr("tabindex","0");r.attr("role","button");r.class("sapMShellHeaderLogout");r.openEnd();r.text(b.getText("SHELL_LOGOUT"));r.close("a");}r.close("span");r.close("header");r.openStart("div",C.getId()+"-content");r.attr("data-sap-ui-root-content","true");r.class("sapMShellContent");r.class("sapMShellGlobalInnerBackground");r.openEnd();r.renderControl(C.getApp());r.close("div");r.close("div");r.close("div");};S.getLogoImageHtml=function(r,C){var i=C.getLogo();if(!i){jQuery.sap.require("sap.ui.core.theming.Parameters");i=sap.ui.require("sap/ui/core/theming/Parameters")._getThemeImage();}if(i){var R=sap.ui.getCore().getLibraryResourceBundle("sap.m");r.openStart("div");r.class("sapMShellLogo");r.openEnd();if(D.browser.msie){r.openStart("span");r.class("sapMShellLogoImgAligner");r.openEnd();r.close("span");}r.voidStart("img",C.getId()+"-logo");r.class("sapMShellLogoImg");r.attr("src",i);r.attr("alt",R.getText("SHELL_ARIA_LOGO"));r.voidEnd();r.close("div");}};return S;},true);