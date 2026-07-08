# Feels - Character Scene Prompts

Prompts for generating the 4 hero character scenes. Best results: ChatGPT (GPT-4o image gen)
or Gemini - both handle "same character, new outfit" iteration well.

## How to get consistency (important!)

1. Do all 4 generations in ONE chat session, in order.
2. Generate the MILD scene first (it's the most neutral). When it looks right, generate the
   other three by saying "same character, same style, now..." so the model anchors on it.
3. If the tool supports it, request a transparent background (PNG). If not, ask for a flat
   `#F6F1EA` background and we'll knock it out.
4. Square, 1024x1024 or larger.
5. Don't accept drift: if her face/hair changes between scenes, reply "keep the exact same
   character as the previous image" and regenerate.

Feel free to tweak the character block below (hair, skin tone, etc.) if you want her to nod
towards Josie - just use the identical block in every prompt.

## Shared style + character block (paste at the top of every prompt)

> A charming 3D-rendered illustration in the style of premium app iconography: soft matte
> clay and vinyl-toy textures, rounded chunky forms, gentle pastel colours, soft studio
> lighting with subtle shadows, slight top-down camera, high-key and friendly. The character
> is a woman in her early 30s with shoulder-length wavy brown hair, rosy cheeks, simple dot
> eyes and a warm smile, stylised like a designer vinyl figure (big head, small body, no
> hyperrealism). She stands centered on a small floating rounded "island" base that hints at
> the environment, like a 3D app icon diorama. Transparent background. Square format.

## 1. MILD - jumper weather (generate first)

> [style + character block]
>
> She wears a cosy mustard-yellow knitted jumper, blue jeans rolled at the ankle, and white
> trainers. The floating island base is soft green grass with two tiny autumn-toned bushes
> and one small fluffy cloud floating beside her head. Relaxed, content pose, hands in
> pockets.

## 2. HOT - beach day

> Same character, same style, same island format as the previous image. Now: she wears a
> coral-pink bikini with a wide-brim straw sun hat and round sunglasses pushed up on her
> head, holding an ice lolly. The island base is warm sand with a tiny turquoise water edge,
> one small palm tree, and a beach umbrella. A chunky 3D sun floats beside her. Happy,
> sun-soaked pose.

## 3. RAIN - umbrella up

> Same character, same style, same island format as the previous image. Now: she wears a
> glossy yellow raincoat with the hood down, red wellies, and holds a cherry-red umbrella
> open above her head. The island base is wet pavement grey with two small puddles showing
> soft reflections. A chunky 3D rain cloud with tiny falling droplets floats above the
> umbrella. Cheerful despite the rain.

## 4. COLD - golden autumn

> Same character, same style, same island format as the previous image. Now: she wears a
> camel-brown wool coat, unbuttoned over a cream jumper, with a burnt-orange knitted beanie
> and brown ankle boots. The island base is a golden-grass path scattered with amber and
> russet fallen leaves, with one beautiful small tree in full golden autumn foliage beside
> her. Two or three chunky 3D leaves drift in the air around her. Cosy, breathing-in-the-
> crisp-air pose, hands in coat pockets.

## 5. FREEZING - wrapped up warm

> Same character, same style, same island format as the previous image. Now: she wears a
> puffy lilac winter coat zipped to the chin, a chunky cream bobble hat, matching mittens
> and a scarf, with a tiny visible breath puff. The island base is snow-dusted with one
> small pine tree and a little snowman. A chunky 3D snowflake floats beside her. Cosy,
> bundled-up pose with shoulders slightly raised.

## Delivery

Drop the finals into `public/characters/` as `hot.png`, `mild.png`, `rain.png`, `cold.png`
(the golden autumn scene) and `freezing.png` (the snowy winter scene).
Placeholders are in the app meanwhile, so any time they land I can swap them in.

## Stretch (only if the build is cruising): baby mode

> Same style as the previous images: a baby version of the scene - a happy stylised baby in
> [outfit matching one of the four scenes above, e.g. "a tiny puffy mint-green snowsuit with
> a bobble hat"] sitting on the same style of floating island base. Same vinyl-toy 3D look.
> Transparent background, square.
