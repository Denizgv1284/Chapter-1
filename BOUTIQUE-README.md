# Storefront additions

Production target authorized by the owner: https://dcmd-designer.vercel.app/ (product view: `/#products`). Continue publishing updates to this existing site. The source repository is `Denizgv1284/Chapter-1`, branch `main`.

## Editorial navigation and theme

Performance (September 25): responsive 480/960px WebP derivatives are used for storefront images, menus and thumbnails. Original PNGs remain the photo zoom source. `optimize-images.cjs` creates encoding-only derivatives from unchanged originals and updates image srcsets; run it against a local server after adding photos. Language translation caches repeated strings and skips its own unchanged DOM writes. The product background no longer uses a fixed, filtered layer, and invisible star timers are disabled. `audit-performance.cjs URL...` records browser long tasks, transferred bytes and runtime/image errors for the same scroll/language scenario. Browser and network conditions affect results; this is not a universal frame-rate guarantee.

Localization: `languages-extra.js` extends the six-language store dictionary, including gifts, rewards, capsules and navigation. Policy pages use `policies/translations.js` and `policies/localize.js`, inherit the selected language and provide their own selector. Turkish source drafts remain available; other languages render the corresponding translated sections. Support now opens from the star tab on the left edge. `test_localization_mobile.cjs` covers all 24 policy/language combinations and footer clearance.

Mobile photography: at widths up to 700px the two editorial scene images display at their full aspect ratio with copy below. The campaign film gets its own portrait viewport. `theme-lifestyle-dcmd.png` and `theme-hero-dcmd.png` are the branded versions; the originals remain as source references.

The landing page uses three consecutive full-width chapters: the existing film loop, Capital city atmosphere, and the DCMD editorial image. Replace the two `.home-scene > img` sources in `index.html` for future theme photos. The faint shop background is the `#products::before` image in `dcmd-boutique.css`.

`dcmd-reference.js` defines collection and unisex category previews. Each uses matching front/back product images in square frames. Mens and Womens are explicitly coming-soon departments with a link to the available unisex range. Footwear, accessories and Country Collection are not presented as available stock. The same menus are available from the mobile drawer. `test_editorial_navigation.cjs` checks previews, filtering, coming-soon states, panel placement and mobile navigation.

- `campaign-playlist.js`: append `{src:'images/name.mp4', title:'...'}` to add a film. Playback advances on `ended` and wraps to the first film. Failed clips are skipped; autoplay respects reduced motion, data saving, tab visibility and viewport visibility. The WhatsApp film is preserved as `images/dcmd-campaign-02.mp4`.
- `dcmd-boutique.js`: capsule editorial, six new Capital arrivals, outfit shopping, product recommendations, demo drop availability, gift packaging and welcome scratch reward.
- Gift packaging is free in the demo. Only the packaging choice is stored in the anonymous test receipt. Gift notes stay in the temporary email preview.
- Welcome reward options are 15% off, 20% off, or 50 star points. This is an anonymous membership preview; one result is stored per browser, including across reloads. It does not create an account or apply checkout discounts. Actual eligibility, odds, redemption and server-side persistence remain to be defined by the owner.
- Limited-drop numbers are the existing 20 demo production slots per product, not claims about manufactured stock. They update after demo orders and reset with the inventory controls or page reload.
- Product IDs remain stable when image filenames change. Product and order images use uniform frames and `object-fit:contain`.

Build with `node build-static.cjs`. Publish the generated `public` directory (Vercel runs this automatically from the repository configuration).

Validation: `test_boutique.cjs`, `test_commerce_browser.cjs`, `test_visual_weather_fixes.cjs`, `test_product_images.cjs`, `test_capital_expansion.cjs`, and `test_weather_live.cjs`. Browser tests require the existing temporary Playwright installation and Edge. Most accept `DCMD_TEST_URL`; the live weather test checks port 8012 and `file://`.
