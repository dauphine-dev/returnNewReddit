'use strict';
class ContentScript {
    static get instance() { return (this._instance = this._instance || new this()); }

    constructor() {
        const bgc1 = "#030303"; //background color 1
        const bgc2 = "#1a1a1a"; //background color 2

        this._domChanges = [
            //s: selector, t: target container, p: position
            { s: "span.mr-sm", t: "#main-content", p: "afterbegin" },                   // move "Create Post" button
        ];

        this._styleChanges = [
            //s: selector, p: property, v: value
            { s: "#left-sidebar-container", p: "display", v: "none" },                  // hide left sidebar
            { s: "html", p: "background-color", v: bgc1 },                              // page background color
            { s: "shreddit-app > div", p: "background-color", v: bgc1 },                // page background color             
            { s: "section.flex:nth-child(2)", p: "background-color", v: bgc2 },         // header background color
            { s: "section.flex:nth-child(2)", p: "padding-left", v: "15vw" },           // community logo/name position
            { s: "section.flex:nth-child(2)", p: "padding-right", v: "40vw" },          // "Join" button position
            { s: ".subgrid-container", p: "grid-column-start", v: "unset" },            // header left position
            { s: ".subgrid-container", p: "max-width", v: "unset" },                    // header right position
            { s: ".subgrid-container", p: "width", v: "100vw" },                        // header size
            { s: ".main-container", p: "padding-left", v: "15vw" },                     // main container position
            { s: "div.py-md", p: "background-color", v: bgc2 },                         // right sidebar background color
            { s: "div.py-md *", p: "background-color", v: bgc2 },                       // elements in right sidebar background color
            { s: ".community-highlight-carousel", p: "background-color", v: bgc2 },     // community highlights background color
            { s: ".community-highlight-carousel *", p: "background-color", v: bgc2 },   // community highlights background color
            { s: "article.w-full *:not(a, div)", p: "background-color", v: bgc2 },      // articles background color
            { s: "hr.border-b-sm", p: "border", v: "none" },                            // hide lines betwenn articles
            { s: "hr.border-b-sm", p: "height", v: "10px" },                            // vertical space betwenn articles
            { s: ".ml-0", p: "width", v: "100%" },                                      // "Create Post" button size
            { s: "div.justify-between:nth-child(3) > div:nth-child(1)", p: "display", v: "flex" }, // make sort menu horizontal
        ];
    }

    run() {
        this.updateWebpage();
        const options = { subtree: true, childList: true, attributeOldValue: true, characterData: true, characterDataOldValue: true };
        const observerConnect = () => { observer.observe(document, options); };
        const observer = new MutationObserver((mutations, observer) => {
            observer.disconnect();
            this.updateWebpage();
            observerConnect();
        });
        observerConnect();
    }

    updateWebpage() {
        this.updateDom();
        this.updateCustom();
        this.updateElementsStyle();
    }

    updateDom() {
        //update elements container according _domChanges
        for (const item of this._domChanges) {
            const elements = document.querySelectorAll(item.s);
            const targetNode = document.querySelector(item.t);
            if (targetNode) {
                for (const el of elements) {
                    targetNode.insertAdjacentElement(item.p, el);
                }
            }
        }
    }

    updateCustom() {
        //Move short menu from dropdown in the  container upper
        const memuItems = document.querySelector(".mr-md > div:nth-child(1) > shreddit-sort-dropdown:nth-child(1) > div:nth-child(3)");
        if (memuItems) {
            const newContainer = document.querySelector('shreddit-async-loader[bundlename="shreddit_sort_dropdown"]').parentNode;
            if (newContainer) {
                newContainer.insertAdjacentElement("afterbegin", memuItems);
            }
        }

        //Hide the empty short menu dropdown
        const menuDropdown = document.querySelector('shreddit-sort-dropdown[telemetry-source="sort_switch"]').parentNode;
        menuDropdown.style.display = "none";

    }


    updateElementsStyle() {
        //update elements style according _styleChanges
        for (const item of this._styleChanges) {
            const elements = document.querySelectorAll(item.s);
            for (const el of elements) {
                el.style[item.p] = item.v;
            }
        }
    }
}
ContentScript.instance.run();
