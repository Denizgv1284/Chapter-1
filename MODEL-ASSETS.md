# DCMD model showcase assets

## Paris model — built-in imagegen edit

Saved project asset: `images/model-paris-cutout.png` (transparent PNG; corner alpha verified as 0).

Inputs: `images/model-black-hoodie-front.jpg` (identity/edit target), `images/capital-paris-front.jpeg` (garment reference).

Final prompt:

> Use case: identity-preserve. Edit target image 1: preserve this exact adult male model's face, hair, identity, pose and photographic lighting. Replace only his hoodie with the oversized black short sleeve DCMD Paris/FR Capital Collection T-shirt in image 2 (garment reference). Preserve reference garment graphics, DCMD logo, PARIS lettering, French flag, Eiffel Tower composition and blue accents faithfully. Frame head through hips including entire tee hem and relaxed bare forearms. Website campaign cutout, photorealistic, actual transparent alpha background with clean hair edges, no white/gray/colored backdrop, no checkerboard baked into image, no added text. Output one transparent PNG.

This is an AI-edited campaign visualization, not a new product photograph. Original garment images remain unchanged.

## Warsaw — background extraction completed

The original `images/model-warsaw-front-back.jpg` is retained. The gallery now uses `images/model-warsaw-front-back-cutout.png`, edited with built-in imagegen with transparent alpha.

## Reference UI scope

CAPTURE 1–10: DCMD navigation, lookbook, hero placement, footer, newsletter preview, and rewards preview. CAPTURE 11 (authentication) intentionally deferred.

Rewards now display ten stars, one per unique completed demo order. A local browser ledger stores up to ten anonymous demo order IDs; clear demo data resets it. This is not an authoritative customer balance or a monetary benefit. Newsletter preview clears the input and makes no network request. Production rewards, subscription delivery and authentication still need real services and business rules.

## Capital expansion and editorial layout

London (LDN/GB), Ankara (ANK/TR), Roma (ROM/IT), Berlin (BER/DE), Madrid (MAD/ES), Amsterdam (AMS/NL): original front/back JPEGs copied from the supplied September 17 WhatsApp images into `images/capital-{city}-{front,back}.jpeg`. No product graphics were altered. Existing Capital demo price of EUR 49.99 is inherited pending pricing confirmation. No new model try-on images were generated.

The old Warsaw/Paris campaign section was removed and replaced by the existing three-tile lookbook, followed by the ten-star promo card. Product galleries share square image viewports with contained, centered images and 5% padding. Source image proportions no longer override the square viewport. Clicking a card opens a keyboard-accessible photo dialog.

## September 23 product cutouts

September 24 editorial update: `theme-lifestyle-dcmd.png` and `theme-hero-dcmd.png` were edited with built-in imagegen using the original scene, hoodie, wide-leg pants and transparent logo as references. The models now wear DCMD clothing; scene colour and atmosphere were retained, with a logo in the upper-left space. All displayed uses of the two unbranded theme images were switched to these sibling assets. They are editorial AI edits and not pixel-identical product photographs. Mobile uses the full image instead of cropping faces and clothing into a tall background.

All 28 garment views and both model gallery photos now use sibling `*-cutout.png` files made with built-in imagegen. Original JPEG/JPG assets remain available. The edits requested background removal, transparent alpha, centered square framing and preservation of garments and graphics. These are AI-edited display assets, not pixel-identical originals; small texture and lettering details may differ. No CLI or paid API fallback was used.
