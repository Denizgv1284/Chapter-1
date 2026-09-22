# DCMD model showcase assets

## Paris model — built-in imagegen edit

Saved project asset: `images/model-paris-cutout.png` (transparent PNG; corner alpha verified as 0).

Inputs: `images/model-black-hoodie-front.jpg` (identity/edit target), `images/capital-paris-front.jpeg` (garment reference).

Final prompt:

> Use case: identity-preserve. Edit target image 1: preserve this exact adult male model's face, hair, identity, pose and photographic lighting. Replace only his hoodie with the oversized black short sleeve DCMD Paris/FR Capital Collection T-shirt in image 2 (garment reference). Preserve reference garment graphics, DCMD logo, PARIS lettering, French flag, Eiffel Tower composition and blue accents faithfully. Frame head through hips including entire tee hem and relaxed bare forearms. Website campaign cutout, photorealistic, actual transparent alpha background with clean hair edges, no white/gray/colored backdrop, no checkerboard baked into image, no added text. Output one transparent PNG.

This is an AI-edited campaign visualization, not a new product photograph. Original garment images remain unchanged.

## Warsaw — incomplete background extraction

The original `images/model-warsaw-front-back.jpg` is retained. Background extraction failed first due to the image generation usage limit, and on retry due to file access in the image tool. Its white photographic background has NOT been removed. No alternate paid API was used.

## Reference UI scope

CAPTURE 1–10: DCMD navigation, lookbook, hero placement, footer, newsletter preview, and rewards preview. CAPTURE 11 (authentication) intentionally deferred.

Rewards are in-memory demo points only; not a stored customer balance or a monetary benefit. Newsletter preview clears the input and makes no network request. Production rewards, scanning, subscription delivery and authentication still need real services and business rules.
