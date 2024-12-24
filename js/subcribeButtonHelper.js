'use strict';
class SubcribeButtonHelper {
    static createSubcribeButton(subcribed) {
        try {
            const subcribeButton = document.querySelector('[rnr-id="subscribe-button"]');
            if (!subcribeButton) {
                const creditBarButtons = document.querySelector('.pl-xs');
                const subcribeButton = document.createRange().createContextualFragment(SubcribeButtonHelper.subcribeButtonFragment(subcribed));
                creditBarButtons.appendChild(subcribeButton);
                const sbcrbBttn = document.querySelector('[rnr-id="subscribe-button"]');
                sbcrbBttn.addEventListener('click', (e) => { SubcribeButtonHelper.subcribeButtonClicked_event(e); });
            }
        }
        catch (e) {
            console.error("rnr", e);
        }
    }

    static subcribeButtonFragment(subcribed) {
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

    static async subcribeButtonClicked_event(e) {
        try {
            const subcribeButton = document.querySelector('[rnr-id="subscribe-button"]');
            if (subcribeButton) {
                const lBulb1 = document.querySelector('path[rnr-id="l-bulb');
                const currentSubState = (lBulb1.style.fillOpacity == "1");
                subcribeButton.remove();
                SubcribeButtonHelper.createSubcribeButton(!currentSubState);
            }
        }
        catch (e) {
            console.error("rnr", e)
        }

        // T E S T -----------------
        SubcribeButtonHelper.TEST();
        //--------------------------
    }

    static async TEST() {
        // T E S T
        console.log("rnr", await RedditHelper.getComments('latin', 't3_pi9iti'));
    }
}
