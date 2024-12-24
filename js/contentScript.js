'use strict';
class ContentScript {
    static get instance() { return (this._instance = this._instance || new this()); }

    constructor() {
        this._updatingWebpage = false;
        const bgc1 = '#030303'; //background color 1
        const bgc2 = '#1a1a1a'; //background color 2

        this._containers = [
            //s: selector, t: target container, p: position
            { s: "span.mr-sm", t: "#main-content", p: "afterbegin" },                   // move "Create Post" button
        ];

        this._styles = [
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
        if (this._updatingWebpage) { return; }
        this._updatingWebpage = true;
        try {
            //does not process user page (at least for now...)
            if (window.location.pathname.startsWith("/user/")) { return; }
            this.updateDom();
            this.updateCustom();
            this.updateElementsStyle();
        }
        catch (e) {
            console.error("rnr", e)
        }
        this._updatingWebpage = false;
    }

    updateDom() {
        //update elements container according _containers
        try {
            for (const item of this._containers) {
                try {
                    const elements = document.querySelectorAll(item.s);
                    const targetNode = document.querySelector(item.t);
                    if (targetNode) {
                        for (const el of elements) {
                            try { targetNode.insertAdjacentElement(item.p, el); }
                            catch (e) { console.error("rnr", e) }
                        }
                    }
                }
                catch (e) {
                    console.error("rnr", e);
                }
            }
        }
        catch (e) {
            console.error("rnr", e)
        }
    }

    updateCustom() {
        //Move short menu from dropdown in the  container upper
        try {
            const memuItems = document.querySelector(".mr-md > div:nth-child(1) > shreddit-sort-dropdown:nth-child(1) > div:nth-child(3)");
            if (memuItems) {
                const newContainer = document.querySelector('shreddit-async-loader[bundlename="shreddit_sort_dropdown"]').parentNode;
                if (newContainer) {
                    newContainer.insertAdjacentElement("afterbegin", memuItems);
                }
            }
        }
        catch (e) {
            console.error("rnr", e)
        }

        //Hide the empty short menu dropdown
        try {
            const shredditSort = document.querySelector('shreddit-sort-dropdown[telemetry-source="sort_switch"]');
            if (shredditSort) {
                shredditSort.parentNode.style.display = "none";
            }
        }
        catch (e) {
            console.error("rnr", e)
        }

        //Add subcribe button in the credit bar
        try {
            SubcribeButtonHelper.createSubcribeButton(false, (e) => { this.subcribeButtonClicked_event(e); });
        }
        catch (e) {
            console.error("rnr", e)
        }
    }

    updateElementsStyle() {
        //update elements style according _styles
        try {
            for (const item of this._styles) {
                try {
                    const elements = document.querySelectorAll(item.s);
                    for (const el of elements) {
                        try { el.style[item.p] = item.v; }
                        catch (e) { console.error("rnr", e) }

                    }
                }
                catch (e) {
                    console.error("rnr", e)
                }
            }
        }
        catch (e) {
            console.error("rnr", e)
        }
    }
}
ContentScript.instance.run();
