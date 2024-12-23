'use strict';
class ContentScript {
    static get instance() { return (this._instance = this._instance || new this()); }

    constructor() {
        this._updatingWebpage = false;
        const bgc1 = "#030303"; //background color 1
        const bgc2 = "#1a1a1a"; //background color 2

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
            this.createSubcribeButton(false);
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

    subcribeButtonClicked_event(e) {
        try {
            const subcribeButton = document.querySelector('[rnr-id="subscribe-button"]');
            if (subcribeButton) {
                const lBulb1 = document.querySelector('path[rnr-id="l-bulb');
                const currentSubState = (lBulb1.style.fillOpacity == "1");
                subcribeButton.remove();
                this.createSubcribeButton(!currentSubState);
            }
        }
        catch (e) {
            console.error("rnr", e)
        }
    }

    createSubcribeButton(subcribed) {
        const subcribeButton = document.querySelector('[rnr-id="subscribe-button"]');
        if (!subcribeButton) {
            const creditBarButtons = document.querySelector('.pl-xs');
            const subcribeButton = document.createRange().createContextualFragment(this.subcribeButtonFragment(subcribed));
            creditBarButtons.appendChild(subcribeButton);
            const sbcrbBttn = document.querySelector('[rnr-id="subscribe-button"]');
            sbcrbBttn.addEventListener('click', (e) => { this.subcribeButtonClicked_event(e); });
        }
    }

    subcribeButtonFragment(subcribed) {
        const subcribeButtonFragment = `<button rnr-id="subscribe-button" rpl="" class="button-small px-[var(--rem6)] button-plain icon items-center justify-center button inline-flex" aria-haspopup="true" aria-expanded="false">
            <shreddit-status-icons class="nd:visible flex items-center gap-2xs isolate">
                <rpl-tooltip class="nd:visible" appearance="inverted" trigger="hover focus" content="Subscribe">
                    <svg rpl="" fill="currentColor" height="20" icon-name="notification-outline" viewBox="0 0 48 48" width="20" xmlns="http://www.w3.org/2000/svg">
                        <path
                            style="fill:none;stroke:#ffffff;stroke-width:1.60772;stroke-linecap:round;stroke-dasharray:none;stroke-opacity:1"
                            d="m 21.905067,46.80386 c 0,0.178226 0.3992,0.230541 1.047374,0.319654 0.648174,0.08915 1.44682,0.08915 2.094995,0 0.648174,-0.08911 1.047497,-0.141428 1.047497,-0.319654 h -2.094872 z"
                        />
                        <path
                            style="fill:none;stroke:#ffffff;stroke-width:2;stroke-linecap:round;stroke-dasharray:none;stroke-opacity:1"
                            d="m 28.64535,43.499991 -9.2907,0.0406 z"
                        />
                        <path
                            style="fill:none;stroke:#ffffff;stroke-width:2;stroke-linecap:round;stroke-dasharray:none;stroke-opacity:1"
                            d="m 28.655924,39.999995 -9.311848,0.0305 z"
                        />
                        <path
                            d="m 23.927734,1.2011719 c -2.203,-0.00764 -4.124253,0.5196231 -5.251953,1.0332031 -1.1301,0.51463 -4.616453,2.598985 -6.189453,5.265625 -1.5729,2.66662 -2.7617878,6.708097 -2.085937,10.716797 0.6759,4.0088 5.708975,8.630569 7.109375,11.792969 1.4003,3.1623 2.014496,5.030259 2.029296,6.943359 3.2883,0.0137 1.402438,0.012 4.460938,0 1.903,0.0196 1.172538,0.0137 4.460937,0 0.0148,-1.9131 0.628997,-3.781059 2.029297,-6.943359 1.4004,-3.1624 6.433475,-7.784169 7.109375,-11.792969 C 38.275409,14.208097 37.086672,10.16662 35.513672,7.5 33.940672,4.83336 30.454219,2.749005 29.324219,2.234375 28.196519,1.720795 26.130734,1.2088019 23.927734,1.2011719 Z"
                            style="fill:#ffffff;stroke:#ffffff;stroke-width:2.40328;stroke-linecap:round;fill-opacity:${(subcribed ? "1" : "0")}"
                            rnr-id="l-bulb"
                        />
                    </svg>
                </rpl-tooltip>
            </shreddit-status-icons>
        </button>`;
        return subcribeButtonFragment;

    }
}
ContentScript.instance.run();
