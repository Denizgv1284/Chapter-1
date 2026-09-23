# Storefront additions

- `campaign-playlist.js`: append `{src:'images/name.mp4', title:'...'}` to add a film. Playback advances on `ended` and wraps to the first film. Failed clips are skipped; autoplay respects reduced motion, data saving, tab visibility and viewport visibility. The WhatsApp film is preserved as `images/dcmd-campaign-02.mp4`.
- `dcmd-boutique.js`: capsule editorial, six new Capital arrivals, outfit shopping, product recommendations, demo drop availability, gift packaging and welcome scratch reward.
- Gift packaging is free in the demo. Only the packaging choice is stored in the anonymous test receipt. Gift notes stay in the temporary email preview.
- Welcome reward options are 15% off, 20% off, or 50 star points. This is an anonymous membership preview; one result is stored per browser, including across reloads. It does not create an account or apply checkout discounts. Actual eligibility, odds, redemption and server-side persistence remain to be defined by the owner.
- Limited-drop numbers are the existing 20 demo production slots per product, not claims about manufactured stock. They update after demo orders and reset with the inventory controls or page reload.
- Product IDs remain stable when image filenames change. Product and order images use uniform frames and `object-fit:contain`.

Build with `node build-static.cjs`. Publish the generated `public` directory (Vercel runs this automatically from the repository configuration).

Validation: `test_boutique.cjs`, `test_commerce_browser.cjs`, `test_visual_weather_fixes.cjs`, `test_product_images.cjs`, `test_capital_expansion.cjs`, and `test_weather_live.cjs`. Browser tests require the existing temporary Playwright installation and Edge. Most accept `DCMD_TEST_URL`; the live weather test checks port 8012 and `file://`.
