import React from "react";

export interface BlogArticleData {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  datePublished: string;
  image: string;
  excerpt: string;
  Content: React.FC;
}

/**
 * Slugs of blog posts that have been retired.
 * Used by App.tsx to issue 301-equivalent redirects to /blog.
 */
export const retiredBlogSlugs: string[] = [
  "custom-bouquets-miami",
  "best-flowers-quinceaneras-miami",
  "glitter-vs-natural-bouquets",
  "how-to-choose-roses-quantity",
  "same-day-flower-delivery-miami",
];

export const blogArticles: BlogArticleData[] = [];

export const getBlogArticle = (slug: string) =>
  blogArticles.find((a) => a.slug === slug);

export const blogArticles: BlogArticleData[] = [
  {
    slug: "custom-bouquets-miami",
    title: "Custom Bouquets Miami: How to Design Your Perfect Rose Arrangement",
    seoTitle: "Custom Bouquets Miami | Design Your Own – Charls Flowers",
    seoDescription: "Learn how to create a custom bouquet in Miami with Charls Flowers. Choose colors, quantity, finish, and preview with AI before ordering.",
    datePublished: "2026-03-15",
    image: `${CDN}/5_e69dee54-c820-4910-95cb-130b55626cda.png?v=1774610955`,
    excerpt: "Discover how to design your perfect custom bouquet in Miami with our AI-powered builder.",
    Content: () => (
      <>
        <p>When it comes to expressing your feelings through flowers, nothing compares to a custom-designed bouquet. At <Link to="/" className="text-primary hover:underline">Charls Flowers</Link>, we've made it easier than ever to create the perfect arrangement tailored to your exact vision — right here in Miami.</p>

        <h2>Why Choose a Custom Bouquet?</h2>
        <p>A custom bouquet is more than just flowers — it's a personal statement. Whether you're celebrating a birthday, anniversary, proposal, or simply want to brighten someone's day, a custom arrangement lets you choose every detail. Unlike pre-made bouquets, you have full control over the color combination, the number of roses, the wrapping paper, the finish, and the accessories.</p>
        <p>At Charls Flowers, we believe every bouquet should be as unique as the person receiving it. That's why we've built a custom bouquet builder that walks you through every step of the design process, from selecting your roses to previewing the final result with AI.</p>

        <h2>Step 1: Choose Your Colors</h2>
        <p>The first step in designing your custom bouquet is selecting the rose colors. We offer a wide range of natural colors including white, pink, hot pink, red, yellow, orange, and purple. For something more unique, we also offer painted roses in black, blue, and green.</p>
        <p>You can choose a single color for an elegant, uniform look, or mix two or three colors for a more vibrant arrangement. Some of our most popular combinations include red and white (Bicolor Passion), pink and purple (Magic Pastel), and yellow and orange (Light Citrus).</p>

        <h2>Step 2: Select Your Quantity</h2>
        <p>Our bouquets range from 50 to 200 roses, giving you options for every occasion and budget. A 50-rose bouquet makes a beautiful gift, while a 200-rose arrangement creates a truly show-stopping statement. The most popular choice is our 100-rose bouquet, which offers the perfect balance of impact and value.</p>
        <p>The number of roses also carries symbolic meaning. According to the <a href="https://safnow.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Society of American Florists</a>, different quantities of roses convey different messages — 12 roses for gratitude, 50 for unconditional love, and 100 for devotion.</p>

        <h2>Step 3: Pick Your Finish</h2>
        <p>One of the features that sets Charls Flowers apart is our range of finishes. You can choose between natural (classic, fresh roses), glitter (roses coated with a premium glitter for a glamorous effect), or painted (roses dyed in unique colors like black, blue, or green).</p>
        <p>Natural finish is perfect for traditional occasions, while glitter roses add sparkle and drama — ideal for birthdays, quinceañeras, and celebrations. Painted roses make a bold artistic statement and are popular for themed events and unique gifts.</p>

        <h2>Step 4: Customize Accessories</h2>
        <p>Take your bouquet to the next level with our range of accessories. Add a gold or silver crown for a regal touch, personalized ribbons with custom text, butterfly accents for whimsy, or baby breath letters and numbers for a personalized message. Each accessory is carefully selected to complement our roses.</p>

        <h2>Step 5: Preview with AI</h2>
        <p>Our most innovative feature is the AI bouquet preview. Powered by advanced image generation, this tool creates a realistic preview of your custom bouquet based on your selections. You'll see exactly what your bouquet will look like before placing your order — no surprises, just beautiful flowers.</p>
        <p>Ready to design your perfect bouquet? <Link to="/bouquets/personalizar" className="text-primary hover:underline">Start building your custom bouquet now</Link>.</p>

        <h2>Delivery Options</h2>
        <p>We offer same-day delivery across Miami up to 87 miles when you order before 3PM. Delivery starts at $20 for the first 5 miles, with $1.60 per additional mile. Free in-store pickup is also available at our location: 7261 NW 12th Street, Miami, FL 33126.</p>
        <p>Whether you're sending flowers to Brickell, Coral Gables, Doral, or Miami Beach, we'll get your custom bouquet there fresh and on time. Browse our <Link to="/bouquets" className="text-primary hover:underline">full bouquet collection</Link> for more inspiration.</p>
      </>
    ),
  },
  {
    slug: "best-flowers-quinceaneras-miami",
    title: "Best Flowers for Quinceañeras in Miami: A Complete Guide",
    seoTitle: "Best Flowers for Quinceañeras in Miami | Charls Flowers Guide",
    seoDescription: "Discover the best flowers for quinceañeras in Miami. Tips on colors, bouquet styles, and personalization options for this special celebration.",
    datePublished: "2026-03-10",
    image: `${CDN}/10_13e615d2-0e75-4583-a1bf-5b44f823ed23.png?v=1774610956`,
    excerpt: "Everything you need to know about choosing the perfect quinceañera flowers in Miami.",
    Content: () => (
      <>
        <p>A quinceañera is one of the most important celebrations in a young woman's life, marking her transition from childhood to womanhood. The flowers chosen for this special day play a central role in the celebration, from the bouquet the quinceañera carries to the decorations that transform the venue. Here at <Link to="/" className="text-primary hover:underline">Charls Flowers in Miami</Link>, we've helped hundreds of families create the perfect floral arrangements for their quinceañera celebrations.</p>

        <h2>The Significance of Flowers in a Quinceañera</h2>
        <p>In Latin American tradition, flowers symbolize the beauty, purity, and new beginning that the quinceañera represents. The bouquet is traditionally one of the most important elements — it's carried during the ceremony, featured in photographs, and sometimes presented to the Virgin Mary as an offering. Choosing the right flowers is both a personal and cultural decision.</p>
        <p>According to <a href="https://www.fifteencandles.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Fifteen Candles</a>, a leading quinceañera planning resource, roses remain the most popular flower choice for quinceañeras, symbolizing beauty and love.</p>

        <h2>Most Popular Colors for Quinceañera Bouquets</h2>
        <p>The color of the bouquet typically matches the quinceañera's dress and overall theme. Here are the most popular color choices we see at Charls Flowers:</p>
        <ul>
          <li><strong>Hot Pink:</strong> By far the most popular choice. Our <Link to="/bouquets" className="text-primary hover:underline">Hot Pink Blush bouquet</Link> is a quinceañera favorite, available from 50 to 200 roses.</li>
          <li><strong>Light Pink:</strong> Elegant and soft, perfect for classic and romantic themes. Our Soft Pink bouquet offers a timeless look.</li>
          <li><strong>Purple:</strong> Represents royalty and sophistication. The Purple Charm bouquet is ideal for a regal quinceañera theme.</li>
          <li><strong>White:</strong> Symbolizes purity and new beginnings. The Pure White bouquet is classic and pairs beautifully with any dress color.</li>
          <li><strong>Mixed Colors:</strong> For quinceañeras who want something unique, mixed bouquets like Magic Pastel (pink, purple, and white) or Pink Symphony (multiple pink shades) create stunning visual impact.</li>
        </ul>

        <h2>Bouquet Size for Quinceañeras</h2>
        <p>The size of the quinceañera bouquet depends on the formality of the event and personal preference. We recommend:</p>
        <ul>
          <li><strong>50 roses:</strong> Perfect for a more intimate celebration or as a complementary bouquet</li>
          <li><strong>75-100 roses:</strong> The ideal size for most quinceañeras — impressive but comfortable to carry</li>
          <li><strong>125-200 roses:</strong> For grand celebrations where the bouquet is meant to make a dramatic statement</li>
        </ul>

        <h2>Adding Special Touches</h2>
        <p>What makes a quinceañera bouquet truly special are the personal touches. At Charls Flowers, we offer several accessories that are perfect for quinceañeras:</p>
        <ul>
          <li><strong>Crown:</strong> A gold or silver crown placed atop the bouquet — the perfect symbol for the quinceañera queen</li>
          <li><strong>Butterflies:</strong> Gold butterflies add a whimsical, magical touch</li>
          <li><strong>Personalized ribbon:</strong> Add the quinceañera's name and date</li>
          <li><strong>Glitter finish:</strong> For a glamorous, sparkling effect that looks amazing in photos</li>
        </ul>

        <h2>Quinceañera Room Decoration</h2>
        <p>Beyond the bouquet, flowers can transform any venue into a quinceañera paradise. Our <Link to="/room-decors" className="text-primary hover:underline">room decoration packages</Link> include balloon arrangements, rose petals, LED lights, and more — perfect for creating an unforgettable setting for the celebration.</p>

        <h2>Order Your Quinceañera Flowers</h2>
        <p>Planning a quinceañera in Miami? Let us help you create the perfect floral arrangements. Use our <Link to="/bouquets/personalizar" className="text-primary hover:underline">custom bouquet builder</Link> to design your dream bouquet, or browse our collection for inspiration. Same-day delivery available across Miami, or free pickup at our store.</p>
      </>
    ),
  },
  {
    slug: "glitter-vs-natural-bouquets",
    title: "Glitter vs Natural Bouquets: Which Is Right for Your Occasion?",
    seoTitle: "Glitter vs Natural Bouquets Miami | Which Should You Choose? – Charls Flowers",
    seoDescription: "Compare glitter and natural rose bouquets. Learn which finish is best for your occasion, from weddings to birthdays. Miami flower guide.",
    datePublished: "2026-03-05",
    image: `${CDN}/9_f5ae14ce-39a8-46e7-be8f-e549dd07f043.png?v=1774610955`,
    excerpt: "Wondering whether to choose glitter or natural roses? Here's everything you need to know.",
    Content: () => (
      <>
        <p>One of the most exciting choices you'll make when ordering a bouquet from <Link to="/" className="text-primary hover:underline">Charls Flowers</Link> is selecting the finish. We offer three options — natural, glitter, and painted — each creating a completely different look and feel. In this guide, we'll focus on the two most popular choices: glitter and natural bouquets.</p>

        <h2>What Are Natural Bouquets?</h2>
        <p>Natural bouquets feature fresh roses in their original, unaltered state. The petals maintain their natural texture, scent, and color — from classic reds and pinks to vibrant yellows and oranges. Natural bouquets are timeless and elegant, offering the pure beauty of fresh flowers.</p>
        <p>Natural roses are the traditional choice and remain the most popular for romantic occasions. They carry a subtle fragrance that fills the room and create a soft, organic aesthetic. According to <a href="https://www.proflowers.com/blog/how-to-care-for-roses" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ProFlowers</a>, properly cared-for fresh roses can last 7-10 days in a vase with regular water changes.</p>

        <h2>What Are Glitter Bouquets?</h2>
        <p>Glitter bouquets take fresh roses and coat the petals with a layer of fine, premium glitter. The result is a sparkling, eye-catching arrangement that catches the light beautifully. Our glitter roses use high-quality, non-toxic glitter that adheres to the petals without damaging them.</p>
        <p>Glitter bouquets have become increasingly popular for celebrations, social media photos, and special events. They create a glamorous, luxurious feel that natural flowers alone can't achieve. The glitter effect works particularly well with red, pink, and white roses.</p>

        <h2>When to Choose Natural</h2>
        <ul>
          <li><strong>Romantic occasions:</strong> Anniversaries, date nights, and proposals. Natural roses convey sincerity and classic romance.</li>
          <li><strong>Sympathy and condolences:</strong> The understated elegance of natural roses is more appropriate for somber occasions.</li>
          <li><strong>Home decor:</strong> Natural bouquets blend seamlessly into any interior design style.</li>
          <li><strong>When fragrance matters:</strong> Natural roses retain their scent, while glitter roses may have a reduced fragrance.</li>
          <li><strong>Weddings:</strong> Many brides prefer the classic look of natural roses for their wedding bouquet.</li>
        </ul>

        <h2>When to Choose Glitter</h2>
        <ul>
          <li><strong>Birthdays:</strong> Glitter roses add excitement and celebration to any birthday gift.</li>
          <li><strong>Quinceañeras:</strong> The sparkle of glitter roses matches the glamour of this milestone celebration.</li>
          <li><strong>Prom and formal events:</strong> Glitter bouquets photograph beautifully and match formal attire.</li>
          <li><strong>Social media moments:</strong> If the bouquet will be featured on Instagram or TikTok, glitter roses create stunning visuals.</li>
          <li><strong>Holiday celebrations:</strong> Valentine's Day, Christmas, and New Year's are perfect occasions for glitter roses.</li>
        </ul>

        <h2>Price Comparison</h2>
        <p>Glitter roses require an additional treatment process, which is reflected in the pricing. At Charls Flowers, the glitter upgrade is calculated based on the number of roses in your bouquet. The cost adds approximately $8 per 25 roses to the base price. For a 100-rose bouquet, that's about $32 extra for the glitter finish.</p>
        <p>Natural bouquets start from $76 for 50 roses in a single standard color. Red roses start from $106, and painted colors (black, blue, green) start from $60 for the painted-only finish.</p>

        <h2>What About Painted Roses?</h2>
        <p>Our third option — painted roses — offers bold, unconventional colors like black, blue, and green. Painted roses are dyed using a special absorption process that changes the petal color entirely. They're perfect for themed events, unique gifts, or anyone who wants something truly different.</p>

        <h2>Make Your Choice</h2>
        <p>Whether you choose natural or glitter, every bouquet from Charls Flowers is handcrafted with the freshest roses and delivered with care. Browse our <Link to="/bouquets" className="text-primary hover:underline">complete bouquet collection</Link> to see examples of both finishes, or use our <Link to="/bouquets/personalizar" className="text-primary hover:underline">custom builder</Link> to design your perfect arrangement.</p>
      </>
    ),
  },
  {
    slug: "how-to-choose-roses-quantity",
    title: "How to Choose the Right Number of Roses for Your Bouquet",
    seoTitle: "How Many Roses in a Bouquet? Miami Guide – Charls Flowers",
    seoDescription: "Learn the meaning behind different rose quantities. Guide to choosing 50, 100, 150, or 200 roses for your bouquet in Miami.",
    datePublished: "2026-02-28",
    image: `${CDN}/16.png?v=1774610789`,
    excerpt: "A complete guide to choosing the perfect number of roses for every occasion.",
    Content: () => (
      <>
        <p>The number of roses in a bouquet isn't just about size — it carries meaning, sets the tone, and determines the visual impact of your gift. At <Link to="/" className="text-primary hover:underline">Charls Flowers in Miami</Link>, we offer bouquets ranging from 50 to 200 roses, and each quantity creates a different experience for the recipient.</p>

        <h2>The Meaning Behind Rose Quantities</h2>
        <p>Throughout history, the number of roses given has carried symbolic significance. While these meanings have evolved over time, they still influence how we choose flowers today. According to <a href="https://www.thespruce.com/meaning-of-rose-colors-and-numbers-2131072" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">The Spruce</a>, a trusted gardening and lifestyle resource, different numbers of roses convey distinct messages:</p>
        <ul>
          <li><strong>A single rose:</strong> Love at first sight</li>
          <li><strong>12 roses:</strong> "Be mine" — the classic dozen</li>
          <li><strong>24 roses:</strong> "I'm thinking of you every hour"</li>
          <li><strong>50 roses:</strong> Unconditional love</li>
          <li><strong>100 roses:</strong> Complete devotion</li>
          <li><strong>200 roses:</strong> "My love for you is boundless"</li>
        </ul>

        <h2>50 Roses: The Perfect Starting Point</h2>
        <p>A 50-rose bouquet is our starting size and makes a beautiful, substantial gift. It's perfect for birthdays, thank-you gifts, congratulations, or "just because" moments. A 50-rose arrangement is impressive enough to make an impact while remaining easy to carry and display.</p>
        <p>At Charls Flowers, 50-rose bouquets start from $76 for standard colors, $106 for red, and $136 for painted colors. This makes them an accessible luxury that fits most budgets.</p>

        <h2>75 Roses: The Sweet Spot</h2>
        <p>Our 75-rose bouquet hits a sweet spot between statement and practicality. It's noticeably larger than a 50-rose arrangement and begins to create that "wow" factor. This size is especially popular for Mother's Day, anniversaries, and Valentine's Day.</p>
        <p>The 75-rose option is also the minimum for our three-color mixed bouquets (like Classic Tricolor or Fire & Sun), which need extra roses to showcase all three colors beautifully.</p>

        <h2>100 Roses: The Statement Maker</h2>
        <p>The <Link to="/100-roses-bouquet-miami" className="text-primary hover:underline">100-rose bouquet</Link> is our most popular size. It represents complete devotion and creates a truly impressive arrangement that commands attention. Whether you choose a single color like Total Passion (red) or a mixed arrangement like Dark Romance, 100 roses make a powerful statement.</p>
        <p>A 100-rose bouquet is the ideal choice for proposals, milestone anniversaries, and significant celebrations. It's large enough to be dramatic but still manageable for the recipient to hold and display.</p>

        <h2>125-150 Roses: Going Grand</h2>
        <p>Moving beyond 100 roses, you enter the territory of truly grand gestures. A 125 or 150-rose bouquet fills a room and creates lasting memories. These sizes are popular for quinceañeras, wedding proposals, and major celebrations.</p>
        <p>At this size, mixed-color bouquets look particularly stunning because there are enough roses to create rich patterns and color combinations. The additional roses also allow for more dramatic visual height and width.</p>

        <h2>200 Roses: The Ultimate Expression</h2>
        <p>A 200-rose bouquet is the ultimate expression of love and devotion. This massive arrangement is truly unforgettable and makes a statement that words can't capture. It's our largest size and is often chosen for once-in-a-lifetime moments — proposals, milestone birthdays, or as the centerpiece of a romantic room decoration.</p>
        <p>At $301 for standard colors, a 200-rose bouquet is a significant investment, but the impact it creates is priceless.</p>

        <h2>How to Choose Your Quantity</h2>
        <p>Consider these factors when deciding how many roses to include:</p>
        <ul>
          <li><strong>Occasion:</strong> Casual occasions suit 50-75 roses. Significant milestones call for 100+.</li>
          <li><strong>Budget:</strong> Our pricing scales with quantity. A 50-rose bouquet in standard colors starts at $76, while 200 roses start at $301.</li>
          <li><strong>Recipient:</strong> Consider where they'll display the bouquet. A smaller apartment might suit 50-75 roses, while a spacious home can showcase 100-200.</li>
          <li><strong>Color mix:</strong> If you're mixing 3 colors, 75+ roses ensures each color is well-represented.</li>
        </ul>

        <p>Ready to choose? <Link to="/bouquets/personalizar" className="text-primary hover:underline">Build your custom bouquet</Link> and select the perfect quantity for your occasion. Or browse our <Link to="/bouquets" className="text-primary hover:underline">pre-designed bouquets</Link> to see each size in action.</p>
      </>
    ),
  },
  {
    slug: "same-day-flower-delivery-miami",
    title: "Same-Day Flower Delivery in Miami: Everything You Need to Know",
    seoTitle: "Same-Day Flower Delivery Miami | How It Works – Charls Flowers",
    seoDescription: "Learn how same-day flower delivery works in Miami. Zones, rates, ordering deadlines, and tips for ensuring your bouquet arrives on time.",
    datePublished: "2026-02-20",
    image: `${CDN}/3.png?v=1774610789`,
    excerpt: "Everything you need to know about getting flowers delivered same-day in Miami.",
    Content: () => (
      <>
        <p>Need flowers delivered today in Miami? <Link to="/" className="text-primary hover:underline">Charls Flowers</Link> offers same-day flower delivery across Miami and South Florida, covering an area up to 87 miles from our store. Here's everything you need to know about how it works, what it costs, and how to make sure your bouquet arrives on time.</p>

        <h2>How Same-Day Delivery Works</h2>
        <p>Our same-day delivery process is designed to be fast and reliable. When you place an order, here's what happens:</p>
        <ol>
          <li><strong>You order:</strong> Choose your bouquet, customize it, and select "Home Delivery" at checkout.</li>
          <li><strong>We prepare:</strong> Our team handcrafts your bouquet fresh — every arrangement is made to order, never pre-made.</li>
          <li><strong>We deliver:</strong> Your bouquet is carefully packaged and delivered to the specified address within your chosen time window.</li>
        </ol>
        <p>The entire process requires a minimum of 2 hours from the time you place your order. This ensures every bouquet meets our quality standards and arrives fresh.</p>

        <h2>Ordering Deadline</h2>
        <p>To qualify for same-day delivery, you must place your order before 3PM Miami time (Eastern Time). Orders placed after 3PM will be scheduled for the next available delivery day. According to the <a href="https://www.ftd.com/blog/share/same-day-delivery-flowers" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">FTD flower delivery guide</a>, ordering early in the day gives florists the best chance to fulfill your request with the freshest flowers available.</p>
        <p>Pro tip: If you know you'll need flowers for a specific date, order in advance and select your preferred delivery date and time at checkout. This guarantees your time slot and gives us extra time to create the perfect arrangement.</p>

        <h2>Delivery Zones and Rates</h2>
        <p>Our delivery coverage extends up to 87 miles from our Miami store, covering all of Miami-Dade County and parts of Broward County. Here's our rate structure:</p>
        <ul>
          <li><strong>0-5 miles:</strong> $20 flat rate — covers most of central Miami including Downtown, Brickell, Wynwood, Little Havana, and Coconut Grove.</li>
          <li><strong>5-87 miles:</strong> $1.60 per mile — covers Coral Gables, Doral, Hialeah, Kendall, Miami Beach, Aventura, Hollywood, Fort Lauderdale, and more.</li>
        </ul>
        <p>You can calculate your exact delivery cost during checkout by entering your delivery address. Our system automatically calculates the distance and shows you the fee before you confirm your order.</p>

        <h2>Delivery Areas We Cover</h2>
        <p>We deliver to all neighborhoods in the Miami metropolitan area, including:</p>
        <ul>
          <li>Miami, Brickell, Downtown, Wynwood, Design District</li>
          <li>Miami Beach, South Beach, North Beach, Surfside</li>
          <li>Coral Gables, Coconut Grove, Key Biscayne</li>
          <li>Doral, Sweetwater, Fontainebleau</li>
          <li>Hialeah, Miami Lakes, Opa-locka</li>
          <li>Kendall, Pinecrest, Palmetto Bay</li>
          <li>Aventura, Sunny Isles, Hallandale Beach</li>
          <li>Homestead, Florida City (within 87-mile radius)</li>
        </ul>

        <h2>Free In-Store Pickup</h2>
        <p>Prefer to pick up your bouquet? We offer free in-store pickup at our location: <strong>7261 NW 12th Street, Miami, FL 33126</strong>. Simply select "Store Pickup" at checkout, choose your preferred pickup time, and we'll have your bouquet ready and waiting.</p>
        <p>Our store hours are: Monday–Friday 8AM–7PM, Saturday 8AM–5PM, Sunday Closed.</p>

        <h2>Tips for a Smooth Delivery</h2>
        <ul>
          <li><strong>Double-check the address:</strong> Make sure the delivery address is complete, including apartment numbers and any gate codes.</li>
          <li><strong>Choose the right time:</strong> Select a delivery window when someone will be available to receive the bouquet.</li>
          <li><strong>Order early:</strong> The earlier in the day you order, the more delivery time slots are available.</li>
          <li><strong>Consider the weather:</strong> In Miami's heat, we recommend choosing a delivery time when the recipient will be home to bring the bouquet inside promptly.</li>
        </ul>

        <h2>Ready to Order?</h2>
        <p>Visit our <Link to="/delivery" className="text-primary hover:underline">delivery page</Link> for more details, or start shopping our <Link to="/bouquets" className="text-primary hover:underline">bouquet collection</Link>. You can also <Link to="/bouquets/personalizar" className="text-primary hover:underline">design a custom bouquet</Link> with our AI-powered builder and have it delivered the same day.</p>
      </>
    ),
  },
];

export const getBlogArticle = (slug: string) => blogArticles.find(a => a.slug === slug);
