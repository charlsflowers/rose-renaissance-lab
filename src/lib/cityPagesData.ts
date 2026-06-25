/**
 * Nationwide city landing pages (FedEx-shipped roses outside South Florida).
 * Each entry carries UNIQUE editorial content. Miami metro is excluded.
 */
export interface CityPage {
  slug: string;
  slugEs: string;
  name: string;
  state: string;
  stateFull: string;
  fedexHub: { en: string; es: string; transitDays: string };
  neighborhoods: string[];
  zips: string[];
  occasions: { en: string; es: string }[];
  intro: { en: string; es: string };
  localTouch: { en: string; es: string };
}

export const cityPages: CityPage[] = [
  {
    slug: "new-york", slugEs: "nueva-york", name: "New York", state: "NY", stateFull: "New York",
    fedexHub: { en: "Newark (EWR) FedEx Express ramp", es: "ramp FedEx Express de Newark (EWR)", transitDays: "1–2 business days" },
    neighborhoods: ["Upper East Side","SoHo","Williamsburg","Tribeca","Astoria","Park Slope"],
    zips: ["10021","10013","11211","10282","11106","11215"],
    occasions: [
      { en: "Broadway opening nights & dressing-room flowers", es: "Estrenos de Broadway y flores para camerinos" },
      { en: "Anniversaries at restaurants on the Upper East Side", es: "Aniversarios en restaurantes del Upper East Side" },
      { en: "Surprise deliveries to Midtown offices", es: "Sorpresas a oficinas de Midtown" },
      { en: "Hospital gifts to Mount Sinai or NYU Langone", es: "Regalos hospitalarios a Mount Sinai o NYU Langone" },
    ],
    intro: {
      en: "Sending roses to New York means timing them to a doorman building, an office tower with a strict mailroom, or a 4-flight East Village walk-up. Charls Flowers ships from Miami via FedEx Express overnight to all five boroughs, packed in our insulated luxury box so the bouquet arrives cold and tight after a 1,280-mile flight.",
      es: "Mandar rosas a Nueva York implica coordinar con un portero, con la mailroom de una torre de oficinas o con un walk-up de cuatro pisos en el East Village. Charls Flowers envía desde Miami por FedEx Express overnight a los cinco boroughs, empacadas en nuestra caja de lujo aislada para que el bouquet llegue frío y firme tras 1,280 millas.",
    },
    localTouch: {
      en: "Most NYC orders go to UES doorman buildings, FiDi towers, Park Slope brownstones and Williamsburg lofts. Book before noon ET for next-day delivery in time for an evening dinner.",
      es: "La mayoría de pedidos a NYC van a edificios con portero del UES, torres del FiDi, brownstones de Park Slope y lofts de Williamsburg. Pide antes del mediodía ET para entrega al día siguiente a tiempo para la cena.",
    },
  },
  {
    slug: "los-angeles", slugEs: "los-angeles", name: "Los Angeles", state: "CA", stateFull: "California",
    fedexHub: { en: "Memphis SuperHub → LAX FedEx ramp", es: "Memphis SuperHub → ramp FedEx en LAX", transitDays: "2 business days" },
    neighborhoods: ["Beverly Hills","Silver Lake","Venice","Brentwood","Los Feliz","DTLA"],
    zips: ["90210","90039","90291","90049","90027","90014"],
    occasions: [
      { en: "Wrap-party deliveries to studio lots in Burbank & Culver City", es: "Entregas para wrap parties en estudios de Burbank y Culver City" },
      { en: "Stage-door bouquets for the Hollywood Bowl & Greek Theatre", es: "Bouquets de stage door para el Hollywood Bowl y Greek Theatre" },
      { en: "Push gifts to maternity wards in Beverly Hills", es: "Push gifts a maternidades en Beverly Hills" },
      { en: "Realtor closing gifts for Westside listings", es: "Regalos de cierre para listings del Westside" },
    ],
    intro: {
      en: "Los Angeles is where a bouquet has to survive a hot driveway in Tarzana or a hand-off at a Culver City studio gate. We ship to greater LA via FedEx 2Day on a refrigerated truck the night you order, with extra cold packs May–September so the roses don't sweat their first day in SoCal sun.",
      es: "LA es donde un bouquet tiene que sobrevivir a un driveway caliente en Tarzana o a la garita de un estudio en Culver City. Enviamos a LA por FedEx 2Day en camión refrigerado la noche del pedido, con cold packs extra de mayo a septiembre.",
    },
    localTouch: {
      en: "We ship to all 88 LA County cities — Manhattan Beach to Long Beach to Pasadena. Studio mailrooms in Burbank and Sherman Oaks know our FedEx label by sight.",
      es: "Enviamos a las 88 ciudades del condado de LA. Las mailrooms de estudios en Burbank y Sherman Oaks ya conocen nuestra etiqueta FedEx.",
    },
  },
  {
    slug: "chicago", slugEs: "chicago", name: "Chicago", state: "IL", stateFull: "Illinois",
    fedexHub: { en: "Indianapolis hub → O'Hare (ORD) FedEx ramp", es: "Hub de Indianapolis → ramp FedEx en O'Hare (ORD)", transitDays: "1–2 business days" },
    neighborhoods: ["Lincoln Park","Wicker Park","Gold Coast","Lakeview","Logan Square","Hyde Park"],
    zips: ["60614","60622","60611","60657","60647","60615"],
    occasions: [
      { en: "Apology bouquets after a Bears game weekend", es: "Bouquets de disculpa tras un fin de semana de Bears" },
      { en: "Engagements along the Lakefront Trail", es: "Compromisos en el Lakefront Trail" },
      { en: "Welcome flowers for new arrivals in the Loop", es: "Flores de bienvenida en el Loop" },
      { en: "U of C and Northwestern graduation gifts", es: "Regalos de graduación de U of C y Northwestern" },
    ],
    intro: {
      en: "Chicago winters are the real test. From November through March we add insulation pads to every Cook County box so the roses survive sub-zero ORD ramp temperatures while waiting for the FedEx truck. Result: tight, hydrated buds in Lincoln Park, Wicker Park or Oak Park.",
      es: "Los inviernos de Chicago son la prueba real. De noviembre a marzo añadimos paneles aislantes a cada caja para el condado de Cook para resistir las temperaturas bajo cero del ramp de ORD. Resultado: botones firmes en Lincoln Park, Wicker Park u Oak Park.",
    },
    localTouch: {
      en: "We ship across Chicagoland — Gold Coast, Streeterville, Hyde Park, North Shore (Evanston, Wilmette, Winnetka) and Naperville. Lake Shore Drive doormen sign for our boxes routinely.",
      es: "Enviamos a todo Chicagoland — Gold Coast, Streeterville, Hyde Park, North Shore (Evanston, Wilmette, Winnetka) y Naperville.",
    },
  },
  {
    slug: "houston", slugEs: "houston", name: "Houston", state: "TX", stateFull: "Texas",
    fedexHub: { en: "Memphis SuperHub → IAH FedEx Express ramp", es: "Memphis SuperHub → ramp FedEx Express en IAH", transitDays: "1–2 business days" },
    neighborhoods: ["River Oaks","The Heights","Montrose","Memorial","Rice Village","EaDo"],
    zips: ["77019","77008","77006","77024","77005","77003"],
    occasions: [
      { en: "Quinceañera centerpieces and quince gifts", es: "Centros y regalos para quinceañeras" },
      { en: "Texas Medical Center patient deliveries", es: "Entregas a pacientes del Texas Medical Center" },
      { en: "Energy Corridor corporate gifting", es: "Regalos corporativos en el Energy Corridor" },
      { en: "Rodeo season congratulations", es: "Felicitaciones de temporada de rodeo" },
    ],
    intro: {
      en: "Houston is bilingual gifting country. Our Spanish-speaking studio writes the card in either language with no translation fees — useful when the recipient is family in West University or Sugar Land. FedEx Express drops most Houston packages by 10:30 AM CT.",
      es: "Houston es territorio bilingüe. Nuestro estudio escribe la tarjeta en español o inglés sin coste — útil cuando la familia está en West University o Sugar Land. FedEx Express deja la mayoría de paquetes antes de las 10:30 AM CT.",
    },
    localTouch: {
      en: "Coverage spans Harris and Fort Bend counties — River Oaks, The Heights, The Woodlands, Katy and Pearland. For TMC deliveries we put the room number on the FedEx label so it routes through the hospital concierge.",
      es: "Cubrimos los condados de Harris y Fort Bend — River Oaks, The Heights, The Woodlands, Katy y Pearland. Para el TMC ponemos el número de habitación en la etiqueta.",
    },
  },
  {
    slug: "phoenix", slugEs: "phoenix", name: "Phoenix", state: "AZ", stateFull: "Arizona",
    fedexHub: { en: "Memphis SuperHub → PHX FedEx ramp", es: "Memphis SuperHub → ramp FedEx en PHX", transitDays: "2 business days" },
    neighborhoods: ["Arcadia","Biltmore","Scottsdale Old Town","Paradise Valley","Ahwatukee","North Central"],
    zips: ["85018","85016","85251","85253","85044","85020"],
    occasions: [
      { en: "Spring-training congratulations in Scottsdale", es: "Felicitaciones de spring training en Scottsdale" },
      { en: "Snowbird welcome bouquets in Paradise Valley", es: "Bouquets de bienvenida a snowbirds en Paradise Valley" },
      { en: "Realtor closings for desert homes", es: "Cierres inmobiliarios en casas del desierto" },
      { en: "Mother's Day in retirement communities", es: "Día de la Madre en comunidades de retiro" },
    ],
    intro: {
      en: "Phoenix needs the heat-resistant box, period. April–October we ship with double cold packs and a moisture pillow at the stem base — the protocol we use for desert weddings. FedEx 2Day lands at PHX overnight and flowers are usually on the doorstep in Arcadia or Old Town Scottsdale before the afternoon sun hits.",
      es: "Phoenix exige caja anti-calor. De abril a octubre enviamos con doble cold pack y almohadilla de humedad en la base del tallo — el protocolo de bodas en el desierto. FedEx 2Day llega de noche a PHX.",
    },
    localTouch: {
      en: "Full Phoenix metro: Scottsdale, Tempe, Mesa, Chandler, Gilbert, Glendale and Paradise Valley. Gated communities in Silverleaf and DC Ranch — include the gate code in the notes.",
      es: "Metro completo: Scottsdale, Tempe, Mesa, Chandler, Gilbert, Glendale y Paradise Valley. Para Silverleaf y DC Ranch incluye el código de garita.",
    },
  },
  {
    slug: "philadelphia", slugEs: "filadelfia", name: "Philadelphia", state: "PA", stateFull: "Pennsylvania",
    fedexHub: { en: "Newark (EWR) FedEx Express → PHL ground sort", es: "FedEx Express de Newark (EWR) → sort terrestre PHL", transitDays: "1–2 business days" },
    neighborhoods: ["Rittenhouse Square","Fishtown","Old City","Manayunk","Society Hill","University City"],
    zips: ["19103","19125","19106","19127","19147","19104"],
    occasions: [
      { en: "Rowing-regatta congratulations on the Schuylkill", es: "Felicitaciones de regatas en el Schuylkill" },
      { en: "Penn and Drexel commencement gifts", es: "Regalos de graduación de Penn y Drexel" },
      { en: "Eagles game-day apologies", es: "Disculpas de día de partido de los Eagles" },
      { en: "Italian Market anniversary deliveries", es: "Aniversarios en el Italian Market" },
    ],
    intro: {
      en: "Philly is a row-house city, so every Center City delivery uses a slimmer box that fits narrow Rittenhouse vestibules without crushing stems. FedEx routes Philly through Newark overnight and into the PHL ground sort by 7 AM — same-business-day for most 19102–19147 ZIPs.",
      es: "Philly es ciudad de row-houses, así que cada entrega en Center City usa caja más estrecha que cabe por vestíbulos angostos de Rittenhouse. FedEx enruta por Newark de noche y entra al sort terrestre de PHL antes de las 7 AM.",
    },
    localTouch: {
      en: "We deliver across Philly plus the Main Line (Bryn Mawr, Wayne, Ardmore), Chestnut Hill and South Jersey (Cherry Hill, Haddonfield). For Penn or CHOP use the building name on the label.",
      es: "Entregamos en Philly, Main Line (Bryn Mawr, Wayne, Ardmore), Chestnut Hill y South Jersey (Cherry Hill, Haddonfield).",
    },
  },
  {
    slug: "san-antonio", slugEs: "san-antonio", name: "San Antonio", state: "TX", stateFull: "Texas",
    fedexHub: { en: "Memphis SuperHub → SAT FedEx ramp", es: "Memphis SuperHub → ramp FedEx en SAT", transitDays: "2 business days" },
    neighborhoods: ["Alamo Heights","Stone Oak","King William","Olmos Park","Terrell Hills","Southtown"],
    zips: ["78209","78258","78204","78212","78209","78210"],
    occasions: [
      { en: "Fiesta San Antonio celebrations in April", es: "Celebraciones de Fiesta San Antonio en abril" },
      { en: "Quinceañeras across the Westside", es: "Quinceañeras en el Westside" },
      { en: "Lackland & Fort Sam Houston graduation flowers", es: "Flores de graduación en Lackland y Fort Sam" },
      { en: "Riverwalk anniversary surprises", es: "Sorpresas de aniversario en el Riverwalk" },
    ],
    intro: {
      en: "San Antonio is one of our most consistent military-base destinations — Lackland, Fort Sam Houston and Randolph basic-training graduations almost every weekend. Base mailrooms require recipient rank and unit on the label; we add that field to the checkout notes for any Bexar County address with a base.",
      es: "San Antonio es uno de nuestros destinos militares más constantes — Lackland, Fort Sam Houston y Randolph. Las mailrooms exigen rango y unidad en la etiqueta; lo añadimos en las notas.",
    },
    localTouch: {
      en: "We deliver to all four San Antonio area codes — Alamo Heights, Stone Oak, Southtown, plus Boerne and New Braunfels. Bilingual card messaging standard.",
      es: "Entregamos en las cuatro áreas de San Antonio y hasta Boerne y New Braunfels. Mensaje bilingüe estándar.",
    },
  },
  {
    slug: "san-diego", slugEs: "san-diego", name: "San Diego", state: "CA", stateFull: "California",
    fedexHub: { en: "Memphis SuperHub → SAN FedEx ramp", es: "Memphis SuperHub → ramp FedEx en SAN", transitDays: "2 business days" },
    neighborhoods: ["La Jolla","Coronado","North Park","Hillcrest","Encinitas","Del Mar"],
    zips: ["92037","92118","92104","92103","92024","92014"],
    occasions: [
      { en: "Naval Base homecomings and PCS goodbyes", es: "Homecomings de Naval Base y despedidas PCS" },
      { en: "La Jolla cove proposal bouquets", es: "Bouquets para propuestas en La Jolla Cove" },
      { en: "Coronado wedding-week gifting", es: "Regalos de semana de boda en Coronado" },
      { en: "Comic-Con creator thank-yous", es: "Agradecimientos a creadores de Comic-Con" },
    ],
    intro: {
      en: "San Diego is the rare US city where our flowers ship into nearly identical Miami weather — coastal, mild, low humidity. We lighten the cold-pack count and roses arrive in show condition. Daily shipments to Coronado, La Jolla and Carmel Valley.",
      es: "San Diego es de las pocas ciudades donde el clima de llegada es casi igual al de Miami. Bajamos el número de cold packs y las rosas llegan en condición de showroom.",
    },
    localTouch: {
      en: "Coverage spans San Diego County north to Carlsbad and Encinitas, east to El Cajon, south to Chula Vista. Rancho Santa Fe gated estates accept FedEx with code in the notes.",
      es: "Cobertura por todo el condado: Carlsbad, Encinitas, El Cajon, Chula Vista. Rancho Santa Fe acepta FedEx con código.",
    },
  },
  {
    slug: "dallas", slugEs: "dallas", name: "Dallas", state: "TX", stateFull: "Texas",
    fedexHub: { en: "Memphis SuperHub → DFW FedEx Express ramp", es: "Memphis SuperHub → ramp FedEx Express en DFW", transitDays: "1–2 business days" },
    neighborhoods: ["Highland Park","Uptown","Bishop Arts","Preston Hollow","Lakewood","Deep Ellum"],
    zips: ["75205","75204","75208","75225","75214","75226"],
    occasions: [
      { en: "Cowboys home-game congratulations", es: "Felicitaciones de partidos de los Cowboys" },
      { en: "State Fair of Texas opening week gifts", es: "Regalos de apertura de la State Fair" },
      { en: "Highland Park debutante events", es: "Eventos debutantes en Highland Park" },
      { en: "Uptown energy-sector executive thank-yous", es: "Agradecimientos a ejecutivos del sector energía en Uptown" },
    ],
    intro: {
      en: "Dallas-Fort Worth is FedEx's secondary US hub, so DFW packages move faster than almost anywhere else. We see frequent next-day delivery to Highland Park, Preston Hollow and the Park Cities even with late Miami orders.",
      es: "DFW es el segundo hub más grande de FedEx en EE.UU., por eso los paquetes se mueven más rápido. Vemos entrega al día siguiente con frecuencia en Highland Park y las Park Cities.",
    },
    localTouch: {
      en: "Coverage spans Dallas County plus Plano, Frisco, Southlake and downtown Fort Worth. McKinney Avenue high-rises have concierges that sign for FedEx.",
      es: "Cobertura: condado de Dallas, Plano, Frisco, Southlake y downtown Fort Worth.",
    },
  },
  {
    slug: "austin", slugEs: "austin", name: "Austin", state: "TX", stateFull: "Texas",
    fedexHub: { en: "Memphis SuperHub → AUS FedEx ramp", es: "Memphis SuperHub → ramp FedEx en AUS", transitDays: "1–2 business days" },
    neighborhoods: ["Tarrytown","South Congress","East Austin","Hyde Park","Mueller","Westlake"],
    zips: ["78703","78704","78702","78751","78723","78746"],
    occasions: [
      { en: "SXSW speaker green-room flowers in March", es: "Flores para green-rooms de SXSW en marzo" },
      { en: "ACL festival artist deliveries", es: "Entregas a artistas del ACL" },
      { en: "UT Austin commencement bouquets", es: "Bouquets de graduación de UT" },
      { en: "Tech-startup launch celebrations downtown", es: "Lanzamientos tech en downtown" },
    ],
    intro: {
      en: "Austin moves on event cycles — SXSW in March, ACL in October, F1 in late October — and we ship more roses during those weeks than any other Texas city. We tag those orders for early FedEx sort so the box reaches the Driskill or Fairmont before noon.",
      es: "Austin se mueve por ciclos de evento — SXSW, ACL, F1. Marcamos esos pedidos para sort temprano para que lleguen al Driskill o Fairmont antes del mediodía.",
    },
    localTouch: {
      en: "Coverage spans Travis County out to Round Rock, Cedar Park, Lakeway and Bee Cave. Hill Country driveways occasionally need a phone number for the driver.",
      es: "Cobertura en Travis County hasta Round Rock, Cedar Park, Lakeway y Bee Cave. Hill Country a veces pide teléfono.",
    },
  },
  {
    slug: "jacksonville", slugEs: "jacksonville", name: "Jacksonville", state: "FL", stateFull: "Florida",
    fedexHub: { en: "Direct FedEx Ground from Miami via I-95 line-haul", es: "FedEx Ground directo desde Miami por línea I-95", transitDays: "1 business day" },
    neighborhoods: ["San Marco","Avondale","Riverside","Ponte Vedra","Atlantic Beach","Nocatee"],
    zips: ["32207","32205","32204","32082","32233","32081"],
    occasions: [
      { en: "Mayo Clinic Jacksonville patient deliveries", es: "Entregas a pacientes de la Mayo Clinic Jacksonville" },
      { en: "Naval Air Station Jacksonville homecomings", es: "Homecomings de Naval Air Station Jacksonville" },
      { en: "Jaguars game-week gifting at TIAA Bank Field", es: "Regalos de semana de partido de los Jaguars" },
      { en: "Ponte Vedra beach-club anniversary bouquets", es: "Aniversarios en Ponte Vedra beach clubs" },
    ],
    intro: {
      en: "Jacksonville is the closest FedEx-eligible city to our Miami studio — a 350-mile I-95 line-haul. Orders by 3 PM ET land in Duval County the next morning, often before 10 AM. That speed matters for Mayo Clinic patient deliveries and time-sensitive surprises in San Marco and Avondale.",
      es: "Jacksonville es la más cercana en nuestra red FedEx — 350 millas por I-95 desde Miami. Pedidos antes de las 3 PM ET llegan al condado de Duval a la mañana siguiente, a menudo antes de las 10 AM.",
    },
    localTouch: {
      en: "Coverage: Duval and St. Johns counties — Atlantic Beach, Neptune Beach, Jax Beach, Ponte Vedra, Nocatee and St. Augustine. No flat-rate surcharge.",
      es: "Cobertura: Duval y St. Johns — playas, Ponte Vedra, Nocatee y St. Augustine. Sin recargo flat-rate.",
    },
  },
  {
    slug: "fort-worth", slugEs: "fort-worth", name: "Fort Worth", state: "TX", stateFull: "Texas",
    fedexHub: { en: "Memphis SuperHub → DFW Alliance Texas hub", es: "Memphis SuperHub → hub de Alliance Texas en DFW", transitDays: "1–2 business days" },
    neighborhoods: ["TCU/Westcliff","Sundance Square","Cultural District","Tanglewood","Arlington Heights","Mira Vista"],
    zips: ["76109","76102","76107","76109","76107","76132"],
    occasions: [
      { en: "Stock Show & Rodeo events in January", es: "Eventos del Stock Show & Rodeo en enero" },
      { en: "TCU football and graduation milestones", es: "Hitos de football y graduación de TCU" },
      { en: "Western-art gallery opening nights", es: "Inauguraciones de galerías de arte western" },
      { en: "Sundance Square corporate celebrations", es: "Celebraciones corporativas en Sundance Square" },
    ],
    intro: {
      en: "Fort Worth orders move through Alliance Texas, FedEx's dedicated DFW operation, so Cowtown packages don't fight Dallas suburban congestion. Most Tanglewood and TCU-area packages land before lunch even during Stock Show traffic.",
      es: "Los pedidos a Fort Worth pasan por Alliance Texas, la operación dedicada de FedEx en DFW. Los paquetes en Tanglewood y TCU llegan antes del lunch incluso con tráfico de Stock Show.",
    },
    localTouch: {
      en: "Coverage: Sundance Square out to Aledo, Benbrook, Keller and Southlake. Mira Vista gated estates familiar with our routing.",
      es: "Cobertura: Sundance Square hasta Aledo, Benbrook, Keller y Southlake.",
    },
  },
  {
    slug: "san-jose", slugEs: "san-jose", name: "San Jose", state: "CA", stateFull: "California",
    fedexHub: { en: "Memphis SuperHub → OAK / SJC FedEx ramps", es: "Memphis SuperHub → ramps FedEx en OAK / SJC", transitDays: "2 business days" },
    neighborhoods: ["Willow Glen","Almaden","Rose Garden","Santana Row","Cambrian Park","Naglee Park"],
    zips: ["95125","95120","95126","95128","95124","95112"],
    occasions: [
      { en: "Tech IPO / funding-round celebrations", es: "Celebraciones de IPO y rondas tech" },
      { en: "Stanford Hospital and Kaiser patient deliveries", es: "Entregas a pacientes de Stanford y Kaiser" },
      { en: "Lunar New Year gifting across Silicon Valley", es: "Año Nuevo Lunar en Silicon Valley" },
      { en: "Diwali celebrations in Cupertino & Saratoga", es: "Diwali en Cupertino y Saratoga" },
    ],
    intro: {
      en: "San Jose is the gateway to Silicon Valley — most orders are gifts for engineers, founders and investors in Palo Alto, Mountain View, Cupertino and Sunnyvale. We use the company name as the primary line on the FedEx label so the bouquet reaches the front desk, not an unused home address.",
      es: "San Jose es la puerta a Silicon Valley. Usamos el nombre de la empresa en la primera línea de la etiqueta para que llegue al front desk, no a una residencia desocupada.",
    },
    localTouch: {
      en: "Coverage extends across Santa Clara County — Los Gatos, Saratoga, Cupertino, Milpitas, plus Palo Alto and Menlo Park.",
      es: "Cobertura en Santa Clara County — Los Gatos, Saratoga, Cupertino, Milpitas, Palo Alto y Menlo Park.",
    },
  },
  {
    slug: "charlotte", slugEs: "charlotte", name: "Charlotte", state: "NC", stateFull: "North Carolina",
    fedexHub: { en: "Greensboro hub → CLT FedEx ramp", es: "Hub de Greensboro → ramp FedEx en CLT", transitDays: "1–2 business days" },
    neighborhoods: ["Myers Park","Dilworth","South End","Ballantyne","NoDa","Plaza Midwood"],
    zips: ["28207","28203","28203","28277","28205","28205"],
    occasions: [
      { en: "Banking-sector promotions in Uptown", es: "Ascensos del sector bancario en Uptown" },
      { en: "Panthers and Hornets game congratulations", es: "Felicitaciones de Panthers y Hornets" },
      { en: "Davidson and UNCC graduation gifts", es: "Regalos de graduación de Davidson y UNCC" },
      { en: "Myers Park anniversary deliveries", es: "Aniversarios en Myers Park" },
    ],
    intro: {
      en: "Charlotte is one of our fastest-growing destinations — driven by Uptown banking and a steady Northeast migration. We ship through Greensboro FedEx and most Mecklenburg County orders deliver next-day, including the Ballantyne and South End high-rises.",
      es: "Charlotte es uno de nuestros destinos de mayor crecimiento. Enviamos por el hub FedEx de Greensboro y la mayoría de pedidos del condado de Mecklenburg entrega al siguiente día hábil.",
    },
    localTouch: {
      en: "Coverage: Mecklenburg plus the Lake Norman crescent (Cornelius, Davidson, Huntersville) and Fort Mill across the SC line.",
      es: "Cobertura: Mecklenburg, Lake Norman (Cornelius, Davidson, Huntersville) y Fort Mill (SC).",
    },
  },
  {
    slug: "columbus", slugEs: "columbus", name: "Columbus", state: "OH", stateFull: "Ohio",
    fedexHub: { en: "Indianapolis hub → CMH FedEx ramp", es: "Hub de Indianapolis → ramp FedEx en CMH", transitDays: "1–2 business days" },
    neighborhoods: ["German Village","Short North","Bexley","Upper Arlington","Clintonville","Worthington"],
    zips: ["43206","43215","43209","43221","43202","43085"],
    occasions: [
      { en: "Ohio State game-weekend congratulations", es: "Fin de semana de partido de Ohio State" },
      { en: "Nationwide Children's Hospital patient gifts", es: "Regalos a pacientes del Nationwide Children's" },
      { en: "Insurance and retail HQ corporate gifting", es: "Regalos a HQs de seguros y retail" },
      { en: "Short North gallery hop anniversaries", es: "Aniversarios del gallery hop de Short North" },
    ],
    intro: {
      en: "Columbus rides the same FedEx Indianapolis hub our Chicago boxes use — reliable one-night transit to all 614 ZIPs. Ohio State game weekends (Sept–Nov) are our busiest Franklin County period; we tag those orders to avoid Saturday campus chaos.",
      es: "Columbus va por el mismo hub FedEx de Indianapolis que Chicago — tránsito fiable de una noche a todos los 614. Los fines de semana de Ohio State son pico.",
    },
    localTouch: {
      en: "Coverage: Franklin County out to Dublin, Hilliard, New Albany and Powell. German Village brick homes and Bexley estates both receive without issue.",
      es: "Cobertura: Franklin hasta Dublin, Hilliard, New Albany y Powell.",
    },
  },
  {
    slug: "indianapolis", slugEs: "indianapolis", name: "Indianapolis", state: "IN", stateFull: "Indiana",
    fedexHub: { en: "Indianapolis (IND) FedEx Express national hub", es: "Hub nacional FedEx Express de Indianapolis (IND)", transitDays: "1 business day" },
    neighborhoods: ["Meridian-Kessler","Broad Ripple","Mass Ave","Carmel","Fishers","Zionsville"],
    zips: ["46208","46220","46204","46032","46038","46077"],
    occasions: [
      { en: "Indy 500 race-week deliveries in May", es: "Entregas de la semana del Indy 500 en mayo" },
      { en: "Final Four and NCAA event gifting", es: "Regalos en Final Four y eventos NCAA" },
      { en: "Eli Lilly executive thank-yous downtown", es: "Agradecimientos a ejecutivos de Eli Lilly" },
      { en: "Butler and IU commencement bouquets", es: "Bouquets de graduación de Butler e IU" },
    ],
    intro: {
      en: "Indianapolis is where FedEx's second-largest US national hub physically lives, so an Indy-bound rose box lands at the destination sort — no second flight, no second truck. The most reliable next-morning delivery window in our entire network outside Florida.",
      es: "En Indianapolis está físicamente el segundo hub nacional más grande de FedEx en EE.UU., así que las cajas aterrizan en el sort de destino — sin segundo vuelo. Ventana de entrega a la mañana siguiente más fiable fuera de Florida.",
    },
    localTouch: {
      en: "Coverage: Marion County plus Hamilton County's high-growth suburbs (Carmel, Fishers, Westfield, Noblesville) and the western collar.",
      es: "Cobertura: Marion y suburbs de Hamilton (Carmel, Fishers, Westfield, Noblesville).",
    },
  },
  {
    slug: "san-francisco", slugEs: "san-francisco", name: "San Francisco", state: "CA", stateFull: "California",
    fedexHub: { en: "Memphis SuperHub → OAK FedEx ramp", es: "Memphis SuperHub → ramp FedEx en OAK", transitDays: "2 business days" },
    neighborhoods: ["Pacific Heights","Marina","Mission","Noe Valley","Hayes Valley","Cole Valley"],
    zips: ["94115","94123","94110","94114","94102","94117"],
    occasions: [
      { en: "Funding-round and IPO bouquets to SoMa offices", es: "Bouquets de funding e IPO a oficinas de SoMa" },
      { en: "UCSF and CPMC patient deliveries", es: "Entregas a pacientes de UCSF y CPMC" },
      { en: "Pride Month celebrations across the Castro", es: "Pride Month en el Castro" },
      { en: "Mission anniversary surprises", es: "Sorpresas de aniversario en el Mission" },
    ],
    intro: {
      en: "SF apartments are vertical, narrow and often locked behind a key fob — include the recipient's phone for the FedEx driver. We deliver across the city, and the fog actually helps: cool damp air keeps rose buds tight all day.",
      es: "Los apartamentos de SF son verticales y a menudo con key fob — incluye teléfono para el conductor. La niebla ayuda: el aire fresco mantiene los botones firmes.",
    },
    localTouch: {
      en: "Coverage extends across the city plus Marin (Sausalito, Mill Valley, Tiburon), East Bay (Berkeley, Oakland, Piedmont) and the Peninsula down to Burlingame.",
      es: "Cobertura: ciudad, Marin (Sausalito, Mill Valley, Tiburon), East Bay y Peninsula hasta Burlingame.",
    },
  },
  {
    slug: "seattle", slugEs: "seattle", name: "Seattle", state: "WA", stateFull: "Washington",
    fedexHub: { en: "Memphis SuperHub → SEA FedEx ramp", es: "Memphis SuperHub → ramp FedEx en SEA", transitDays: "2 business days" },
    neighborhoods: ["Capitol Hill","Ballard","Queen Anne","Fremont","Madison Park","West Seattle"],
    zips: ["98112","98107","98109","98103","98112","98116"],
    occasions: [
      { en: "Amazon, Microsoft and Boeing corporate gifting", es: "Regalos corporativos a Amazon, Microsoft y Boeing" },
      { en: "UW Medical patient deliveries", es: "Entregas a pacientes de UW Medical" },
      { en: "Seahawks and Kraken game-day flowers", es: "Flores de día de partido de Seahawks y Kraken" },
      { en: "Pike Place engagement bouquets", es: "Bouquets de compromiso en Pike Place" },
    ],
    intro: {
      en: "Seattle's mild humid climate is friendly to long-haul roses, but the challenge is rain. Every King County box ships with a sealed waterproof outer wrap and FedEx label instructions to leave under cover, not on an open porch.",
      es: "El clima suave de Seattle es amigable, pero el reto es la lluvia. Cada caja al condado de King lleva wrap impermeable e instrucciones de dejar bajo cubierta.",
    },
    localTouch: {
      en: "Coverage spans Seattle plus Bellevue, Redmond, Kirkland and Mercer Island. Microsoft and Amazon mailrooms accept FedEx with badge-only access.",
      es: "Cobertura: Seattle, Bellevue, Redmond, Kirkland y Mercer Island.",
    },
  },
  {
    slug: "denver", slugEs: "denver", name: "Denver", state: "CO", stateFull: "Colorado",
    fedexHub: { en: "Memphis SuperHub → DEN FedEx ramp", es: "Memphis SuperHub → ramp FedEx en DEN", transitDays: "2 business days" },
    neighborhoods: ["Cherry Creek","Wash Park","LoHi","RiNo","Highlands","Capitol Hill"],
    zips: ["80206","80209","80211","80205","80211","80218"],
    occasions: [
      { en: "Ski-weekend welcome gifts to Aspen / Vail rentals", es: "Regalos de bienvenida en alquileres de Aspen / Vail" },
      { en: "Broncos and Nuggets game flowers at Ball Arena", es: "Flores de Broncos y Nuggets en Ball Arena" },
      { en: "Anschutz Medical Campus patient deliveries", es: "Entregas a pacientes del Anschutz Medical Campus" },
      { en: "Mountain-elopement celebrations", es: "Celebraciones de elopements en la montaña" },
    ],
    intro: {
      en: "Denver's altitude (5,280 ft) and dry climate dehydrate roses faster than sea-level cities, so every Front Range box ships with our deep-hydration stem foam pre-soaked the night before. The bouquet arrives already drinking — no shock from mile-high dry air.",
      es: "La altitud de Denver y el aire seco deshidratan rápido las rosas, así que cada caja del Front Range lleva espuma pre-empapada la noche anterior.",
    },
    localTouch: {
      en: "Coverage: Denver County, Boulder, Englewood, Littleton, Aurora, Centennial. Mountain (Vail, Aspen, Breck) in 2 business days via the same DEN sort.",
      es: "Cobertura: Denver, Boulder, Englewood, Littleton, Aurora, Centennial. Montaña (Vail, Aspen, Breck) en 2 días.",
    },
  },
  {
    slug: "washington-dc", slugEs: "washington-dc", name: "Washington", state: "DC", stateFull: "District of Columbia",
    fedexHub: { en: "Newark (EWR) FedEx Express → IAD / DCA sort", es: "FedEx Express de Newark (EWR) → sort IAD / DCA", transitDays: "1–2 business days" },
    neighborhoods: ["Georgetown","Dupont Circle","Capitol Hill","Logan Circle","Kalorama","Adams Morgan"],
    zips: ["20007","20036","20003","20005","20008","20009"],
    occasions: [
      { en: "Embassy receptions and diplomatic congratulations", es: "Recepciones de embajadas y felicitaciones diplomáticas" },
      { en: "Inauguration-week and Congressional swearing-in flowers", es: "Flores de inauguración y juramentos del Congreso" },
      { en: "Georgetown Hospital patient deliveries", es: "Entregas a pacientes de Georgetown Hospital" },
      { en: "Press-corps thank-yous in Foggy Bottom", es: "Agradecimientos al press corps en Foggy Bottom" },
    ],
    intro: {
      en: "DC is a high-security delivery market. Congressional offices, embassies on Mass Ave and law firms in the West End require recipient name plus an office suite or hearing-room number on the FedEx label. If the package stalls at a security desk for a missing field, the roses don't survive.",
      es: "DC es mercado de entrega de alta seguridad. Oficinas del Congreso, embajadas y bufetes exigen nombre del destinatario más número de oficina o sala en la etiqueta.",
    },
    localTouch: {
      en: "Coverage: the District plus Northern Virginia (Arlington, McLean, Alexandria) and Bethesda / Chevy Chase in Maryland.",
      es: "Cobertura: el Distrito, Virginia del Norte (Arlington, McLean, Alexandria) y Bethesda / Chevy Chase.",
    },
  },
  {
    slug: "boston", slugEs: "boston", name: "Boston", state: "MA", stateFull: "Massachusetts",
    fedexHub: { en: "Newark (EWR) FedEx Express → BOS ramp", es: "FedEx Express de Newark (EWR) → ramp en BOS", transitDays: "1–2 business days" },
    neighborhoods: ["Back Bay","Beacon Hill","South End","Cambridge","Brookline","Seaport"],
    zips: ["02116","02108","02118","02138","02446","02210"],
    occasions: [
      { en: "Harvard, MIT and BU commencement bouquets in May", es: "Bouquets de graduación de Harvard, MIT y BU en mayo" },
      { en: "Mass General and Brigham patient gifts", es: "Regalos a pacientes de Mass General y Brigham" },
      { en: "Marathon Monday celebrations along Boylston", es: "Marathon Monday en Boylston" },
      { en: "Seaport biotech-IPO congratulations", es: "Felicitaciones de IPOs de biotech en Seaport" },
    ],
    intro: {
      en: "Boston's brick-and-brownstone density means tighter packing and slightly slimmer boxes — Back Bay vestibules and Beacon Hill stoops don't fit wide cubes. Winter shipments (Dec–Feb) carry the same insulation pads as Chicago because Logan ramp temps drop below freezing.",
      es: "La densidad de ladrillo y brownstone de Boston exige cajas más estrechas. Los envíos de invierno llevan los mismos paneles aislantes que Chicago.",
    },
    localTouch: {
      en: "Coverage spans Suffolk County plus Cambridge, Brookline, Newton, Somerville and out to Wellesley. Harvard houses and MIT dorms route through Smith Campus Center.",
      es: "Cobertura en Suffolk, Cambridge, Brookline, Newton, Somerville y Wellesley.",
    },
  },
  {
    slug: "nashville", slugEs: "nashville", name: "Nashville", state: "TN", stateFull: "Tennessee",
    fedexHub: { en: "Memphis SuperHub → BNA FedEx ramp (3-hour ground)", es: "Memphis SuperHub → ramp FedEx en BNA (3h por tierra)", transitDays: "1 business day" },
    neighborhoods: ["12 South","Belle Meade","Germantown","Hillsboro Village","East Nashville","The Gulch"],
    zips: ["37204","37205","37208","37212","37206","37203"],
    occasions: [
      { en: "Bachelorette weekend welcome bouquets", es: "Bouquets de bienvenida para despedidas" },
      { en: "CMA Awards and Bluebird Cafe artist deliveries", es: "Entregas a artistas en CMA y Bluebird Cafe" },
      { en: "Vanderbilt graduation and reunion flowers", es: "Flores de Vanderbilt" },
      { en: "Country-music label congratulations on Music Row", es: "Felicitaciones de sellos country en Music Row" },
    ],
    intro: {
      en: "Nashville is a short FedEx ground hop from the Memphis SuperHub — same-business-day delivery to 37xxx ZIPs when ordered by 2 PM ET the day before. We see massive bachelorette-weekend demand: most goes to STRs in 12 South, the Gulch and East Nashville, so we put the unit number on the label so the host doesn't lose the box.",
      es: "Nashville está a un salto corto del SuperHub de Memphis. Vemos demanda enorme para despedidas — usamos el número de unidad en la etiqueta para que el host no pierda la caja.",
    },
    localTouch: {
      en: "Coverage spans Davidson County plus Franklin, Brentwood and Hendersonville. Music Row studios accept packages at the front desk.",
      es: "Cobertura: Davidson, Franklin, Brentwood y Hendersonville.",
    },
  },
  {
    slug: "las-vegas", slugEs: "las-vegas", name: "Las Vegas", state: "NV", stateFull: "Nevada",
    fedexHub: { en: "Memphis SuperHub → LAS FedEx ramp", es: "Memphis SuperHub → ramp FedEx en LAS", transitDays: "2 business days" },
    neighborhoods: ["Summerlin","Henderson","The Lakes","Anthem","Downtown Arts District","MacDonald Ranch"],
    zips: ["89135","89014","89117","89052","89101","89052"],
    occasions: [
      { en: "Strip-hotel suite deliveries (Bellagio, Wynn, Cosmopolitan)", es: "Entregas a suites del Strip (Bellagio, Wynn, Cosmopolitan)" },
      { en: "Convention week corporate gifting", es: "Regalos corporativos en semanas de convención" },
      { en: "Bachelorette and bachelor weekends", es: "Despedidas de soltera y soltero" },
      { en: "Same-night-show stage flowers", es: "Flores de escenario para shows nocturnos" },
    ],
    intro: {
      en: "Vegas is unique: Strip hotels operate their own delivery desks separate from in-room service. We address Bellagio, Wynn, Cosmopolitan, Aria, Caesars and Encore packages to the property's delivery dock with guest reservation name and check-in date. Without that detail the box circles 12 hours.",
      es: "Vegas es único: los hoteles del Strip tienen sus propios delivery docks. Etiquetamos con nombre de reserva y fecha de check-in. Sin ese detalle la caja da vueltas 12 horas.",
    },
    localTouch: {
      en: "Off-Strip coverage: Summerlin, Henderson, Anthem and the West Side. Same desert protocol as Phoenix — double cold pack May–September.",
      es: "Fuera del Strip: Summerlin, Henderson, Anthem y West Side. Mismo protocolo que Phoenix.",
    },
  },
  {
    slug: "portland", slugEs: "portland", name: "Portland", state: "OR", stateFull: "Oregon",
    fedexHub: { en: "Memphis SuperHub → PDX FedEx ramp", es: "Memphis SuperHub → ramp FedEx en PDX", transitDays: "2 business days" },
    neighborhoods: ["Pearl District","Alberta","Sellwood","Hawthorne","Northwest District","Laurelhurst"],
    zips: ["97209","97211","97202","97214","97210","97232"],
    occasions: [
      { en: "Chef congratulations on James Beard nights", es: "Felicitaciones a chefs en noches de James Beard" },
      { en: "Nike and Columbia Sportswear corporate gifting", es: "Regalos a Nike y Columbia Sportswear" },
      { en: "OHSU and Doernbecher patient deliveries", es: "Entregas a OHSU y Doernbecher" },
      { en: "Rose Festival anniversaries in June", es: "Aniversarios del Rose Festival en junio" },
    ],
    intro: {
      en: "There's irony in shipping roses to the Rose City, but Portland customers want sourced South-American roses local florists don't always stock. We use the same waterproof outer wrap as Seattle and the cool gray Willamette Valley climate keeps blooms tight a full week.",
      es: "Hay ironía en mandar rosas a la Rose City, pero los clientes quieren rosas sudamericanas que los locales no siempre tienen. Mismo wrap impermeable que Seattle.",
    },
    localTouch: {
      en: "Coverage: Portland plus Beaverton, Tigard, Lake Oswego and Vancouver, WA. Nike's One Bowerman campus accepts FedEx at the south gate.",
      es: "Cobertura: Portland, Beaverton, Tigard, Lake Oswego y Vancouver, WA.",
    },
  },
  {
    slug: "atlanta", slugEs: "atlanta", name: "Atlanta", state: "GA", stateFull: "Georgia",
    fedexHub: { en: "Direct FedEx Ground from Miami → ATL ramp", es: "FedEx Ground directo desde Miami → ramp ATL", transitDays: "1 business day" },
    neighborhoods: ["Buckhead","Inman Park","Virginia-Highland","Midtown","Decatur","Westside"],
    zips: ["30327","30307","30306","30309","30030","30318"],
    occasions: [
      { en: "Emory and Georgia Tech graduation gifts", es: "Regalos de graduación de Emory y Georgia Tech" },
      { en: "Falcons and Hawks game flowers", es: "Flores de Falcons y Hawks" },
      { en: "Film-industry wrap parties at Tyler Perry / Trilith", es: "Wrap parties del cine en Tyler Perry / Trilith" },
      { en: "Buckhead anniversary deliveries", es: "Aniversarios en Buckhead" },
    ],
    intro: {
      en: "Atlanta is one of our fastest non-Florida destinations — single-day FedEx Ground from Miami via I-75. The film industry (Tyler Perry, Trilith, Atlanta Metro Studios) is one of our top corporate accounts; hundreds of wrap-party bouquets ship every year.",
      es: "Atlanta es uno de nuestros destinos no-Florida más rápidos — un día por FedEx Ground por la I-75. El film industry es una de nuestras cuentas corporativas top.",
    },
    localTouch: {
      en: "Coverage: Fulton and DeKalb plus the OTP suburbs (Sandy Springs, Roswell, Alpharetta, Marietta) and the Smyrna/Vinings corridor.",
      es: "Cobertura: Fulton y DeKalb, OTP (Sandy Springs, Roswell, Alpharetta, Marietta) y Smyrna/Vinings.",
    },
  },
  {
    slug: "orlando", slugEs: "orlando", name: "Orlando", state: "FL", stateFull: "Florida",
    fedexHub: { en: "Direct FedEx Ground from Miami via Florida Turnpike", es: "FedEx Ground directo desde Miami por Florida Turnpike", transitDays: "1 business day" },
    neighborhoods: ["Winter Park","Baldwin Park","College Park","Lake Nona","Dr. Phillips","Thornton Park"],
    zips: ["32789","32814","32804","32827","32819","32801"],
    occasions: [
      { en: "Theme-park anniversary surprises at Disney / Universal resorts", es: "Sorpresas de aniversario en resorts de Disney / Universal" },
      { en: "AdventHealth and Orlando Health patient deliveries", es: "Entregas a AdventHealth y Orlando Health" },
      { en: "UCF graduation bouquets", es: "Bouquets de graduación de UCF" },
      { en: "Convention-week corporate gifting", es: "Regalos corporativos en semanas de convención" },
    ],
    intro: {
      en: "Orlando is a 4-hour drive from Miami but the FedEx Ground route is shorter — packages move on a dedicated I-95 / Florida Turnpike line-haul overnight. Disney and Universal resorts accept guest packages at their package centers; label with reservation name and check-in date.",
      es: "Orlando está a 4h en coche pero la ruta FedEx Ground es más corta — línea dedicada I-95 / Florida Turnpike de noche. Etiquetamos resorts con nombre de reserva y check-in.",
    },
    localTouch: {
      en: "Coverage: Orange and Seminole plus Lake Nona, Winter Garden and Kissimmee. Resort deliveries: Grand Floridian, Polynesian, Yacht Club, Cabana Bay, Hard Rock Hotel.",
      es: "Cobertura: Orange y Seminole, Lake Nona, Winter Garden y Kissimmee. Resorts: Grand Floridian, Polynesian, Yacht Club, Cabana Bay, Hard Rock.",
    },
  },
  {
    slug: "tampa", slugEs: "tampa", name: "Tampa", state: "FL", stateFull: "Florida",
    fedexHub: { en: "Direct FedEx Ground from Miami via I-75", es: "FedEx Ground directo desde Miami por I-75", transitDays: "1 business day" },
    neighborhoods: ["Hyde Park","South Tampa","Davis Islands","Westchase","Channelside","St. Pete (Old Northeast)"],
    zips: ["33606","33629","33606","33626","33602","33704"],
    occasions: [
      { en: "Lightning game congratulations at Amalie Arena", es: "Felicitaciones de Lightning en Amalie Arena" },
      { en: "Gasparilla pirate-festival week deliveries in January", es: "Entregas del Gasparilla en enero" },
      { en: "Tampa General and Moffitt patient flowers", es: "Flores a pacientes de Tampa General y Moffitt" },
      { en: "Bayshore-mansion anniversary bouquets", es: "Aniversarios en mansiones de Bayshore" },
    ],
    intro: {
      en: "Tampa Bay is a sister-city run — five hours up I-75, same-day on FedEx Ground line-haul. Daily shipments to both sides of the bay; climate is identical to Miami so no special heat or humidity packaging.",
      es: "Tampa Bay es ciudad hermana — 5h por I-75, mismo día por FedEx Ground. Mismo clima que Miami, sin empaque especial.",
    },
    localTouch: {
      en: "Coverage: Hillsborough and Pinellas plus the beaches (Clearwater, St. Pete Beach, Treasure Island). Davis Islands and Harbour Island gated deliveries route through property gate codes.",
      es: "Cobertura: Hillsborough y Pinellas, playas (Clearwater, St. Pete Beach, Treasure Island).",
    },
  },
  {
    slug: "minneapolis", slugEs: "minneapolis", name: "Minneapolis", state: "MN", stateFull: "Minnesota",
    fedexHub: { en: "Indianapolis hub → MSP FedEx ramp", es: "Hub de Indianapolis → ramp FedEx en MSP", transitDays: "2 business days" },
    neighborhoods: ["Linden Hills","Kenwood","Northeast","Uptown","North Loop","Edina"],
    zips: ["55410","55403","55413","55408","55401","55424"],
    occasions: [
      { en: "Twin Cities corporate gifting (Target, Best Buy, 3M, US Bank HQs)", es: "Regalos corporativos a HQs de Target, Best Buy, 3M y US Bank" },
      { en: "Mayo Clinic patient deliveries in Rochester", es: "Entregas a pacientes de la Mayo Clinic en Rochester" },
      { en: "Vikings and Wild game-day flowers", es: "Flores de día de partido de Vikings y Wild" },
      { en: "Walker Art Center and Guthrie opening nights", es: "Inauguraciones del Walker y el Guthrie" },
    ],
    intro: {
      en: "Minneapolis winters drop to -20 °F on bad weeks and a box left on a porch 30 minutes is a write-off. Nov–March we add a thermal blanket to every Hennepin and Ramsey county package and ask for the recipient's phone so the FedEx driver can hand off directly.",
      es: "Los inviernos de Minneapolis bajan a -20 °F. Nov–marzo añadimos manta térmica y pedimos teléfono del destinatario para handoff directo.",
    },
    localTouch: {
      en: "Coverage: both Twin Cities plus Edina, Wayzata and western lake suburbs. Mayo Clinic Rochester ships same FedEx Ground line.",
      es: "Cobertura: Twin Cities, Edina, Wayzata y suburbs occidentales. Mayo Clinic Rochester por la misma línea.",
    },
  },
  {
    slug: "new-orleans", slugEs: "nueva-orleans", name: "New Orleans", state: "LA", stateFull: "Louisiana",
    fedexHub: { en: "Memphis SuperHub → MSY FedEx ramp", es: "Memphis SuperHub → ramp FedEx en MSY", transitDays: "1–2 business days" },
    neighborhoods: ["Garden District","Uptown","French Quarter","Marigny","Lakeview","Bywater"],
    zips: ["70115","70118","70116","70117","70124","70117"],
    occasions: [
      { en: "Mardi Gras krewe ball deliveries (Jan–Feb)", es: "Entregas a krewes de Mardi Gras (en-feb)" },
      { en: "Jazz Fest weekend bouquets in April–May", es: "Bouquets del Jazz Fest en abril-mayo" },
      { en: "Garden District anniversary surprises", es: "Sorpresas en el Garden District" },
      { en: "Saints game-day flowers in the Superdome corridor", es: "Flores de Saints en el corredor del Superdome" },
    ],
    intro: {
      en: "NOLA has its own delivery rhythm — Mardi Gras parade routes shut down whole neighborhoods, Jazz Fest weekends double our French Quarter and Garden District volume. We follow published route closures and reschedule FedEx deliveries on parade-blocked streets so the box doesn't get stranded.",
      es: "NOLA tiene su propio ritmo — Mardi Gras cierra barrios enteros, Jazz Fest dobla el volumen. Reprogramamos entregas en calles bloqueadas.",
    },
    localTouch: {
      en: "Coverage: Orleans Parish plus Jefferson (Metairie, Kenner) and the Northshore (Mandeville, Covington).",
      es: "Cobertura: Orleans, Jefferson (Metairie, Kenner) y Northshore (Mandeville, Covington).",
    },
  },
  {
    slug: "detroit", slugEs: "detroit", name: "Detroit", state: "MI", stateFull: "Michigan",
    fedexHub: { en: "Indianapolis hub → DTW FedEx ramp", es: "Hub de Indianapolis → ramp FedEx en DTW", transitDays: "1–2 business days" },
    neighborhoods: ["Birmingham","Bloomfield Hills","Royal Oak","Grosse Pointe","Midtown","Corktown"],
    zips: ["48009","48304","48067","48230","48201","48216"],
    occasions: [
      { en: "Big Three automotive corporate gifting (Ford, GM, Stellantis)", es: "Regalos a la Big Three (Ford, GM, Stellantis)" },
      { en: "U of M graduation deliveries in Ann Arbor", es: "Entregas de graduación de U of M en Ann Arbor" },
      { en: "Lions and Tigers game flowers downtown", es: "Flores de Lions y Tigers en downtown" },
      { en: "Grosse Pointe wedding-week bouquets", es: "Bouquets de semana de boda en Grosse Pointe" },
    ],
    intro: {
      en: "Detroit metro is structurally a suburban delivery market — the auto-industry executives our boxes often go to live in Bloomfield Hills, Birmingham and Grosse Pointe. We ship to those high-end Oakland County addresses through DTW; FedEx drivers know the long driveways and gated cul-de-sacs.",
      es: "El metro de Detroit es mercado suburbano — ejecutivos del auto industry viven en Bloomfield Hills, Birmingham y Grosse Pointe. Enviamos por DTW.",
    },
    localTouch: {
      en: "Coverage: Wayne, Oakland and Macomb plus Ann Arbor for U of M. Downtown Detroit revitalization (Corktown, Capitol Park) accepts FedEx at building front desks.",
      es: "Cobertura: Wayne, Oakland, Macomb y Ann Arbor.",
    },
  },
  {
    slug: "kansas-city", slugEs: "kansas-city", name: "Kansas City", state: "MO", stateFull: "Missouri",
    fedexHub: { en: "Memphis SuperHub → MCI FedEx ramp", es: "Memphis SuperHub → ramp FedEx en MCI", transitDays: "1–2 business days" },
    neighborhoods: ["Brookside","Country Club Plaza","Westport","Crossroads","Mission Hills (KS)","Leawood (KS)"],
    zips: ["64113","64112","64111","64108","66208","66206"],
    occasions: [
      { en: "Chiefs Sunday flowers (and Mahomes-celebration weeks)", es: "Flores de domingo de Chiefs (y semanas Mahomes)" },
      { en: "Plaza Lighting Ceremony deliveries in November", es: "Entregas de la Plaza Lighting en noviembre" },
      { en: "Children's Mercy patient gifts", es: "Regalos a pacientes de Children's Mercy" },
      { en: "Hallmark HQ corporate thank-yous", es: "Agradecimientos al HQ de Hallmark" },
    ],
    intro: {
      en: "Kansas City straddles two states — MO and KS — and we ship daily to both sides. Most orders go to Country Club Plaza, Brookside and Mission Hills (KS side). Hallmark Cards is headquartered downtown and is a quietly steady corporate account of ours.",
      es: "KC se reparte entre dos estados — MO y KS. La mayoría va a Country Club Plaza, Brookside y Mission Hills. Hallmark tiene aquí su HQ.",
    },
    localTouch: {
      en: "Coverage: Jackson County (MO) plus Johnson County (KS): Overland Park, Leawood, Prairie Village. KCK and the Northland also covered.",
      es: "Cobertura: Jackson (MO), Johnson (KS), KCK y Northland.",
    },
  },
  {
    slug: "salt-lake-city", slugEs: "salt-lake-city", name: "Salt Lake City", state: "UT", stateFull: "Utah",
    fedexHub: { en: "Memphis SuperHub → SLC FedEx ramp", es: "Memphis SuperHub → ramp FedEx en SLC", transitDays: "2 business days" },
    neighborhoods: ["The Avenues","Sugar House","9th & 9th","Federal Heights","Holladay","Park City"],
    zips: ["84103","84106","84105","84103","84117","84060"],
    occasions: [
      { en: "Park City Sundance Festival week deliveries (January)", es: "Entregas del Sundance en Park City (enero)" },
      { en: "Temple-wedding congratulations", es: "Felicitaciones de bodas en templos" },
      { en: "U of U Health and Primary Children's patient deliveries", es: "Entregas a U of U Health y Primary Children's" },
      { en: "Adobe and Qualtrics tech-corridor gifting", es: "Regalos en el corredor tech de Adobe y Qualtrics" },
    ],
    intro: {
      en: "Salt Lake delivery splits into two seasons: ski (Nov–April) when boxes go up the canyons to Park City, Deer Valley and Snowbird condos, and the rest of the year when volume centers on the Avenues and Sugar House. Sundance late January is a peak — we tag those for early Park City sort to beat festival shuttle blockages.",
      es: "Salt Lake se divide en dos temporadas: ski (nov–abril) hacia Park City, Deer Valley, Snowbird, y el resto en Avenues y Sugar House. Sundance es pico.",
    },
    localTouch: {
      en: "Coverage: Salt Lake County plus Park City, Heber and Provo. Same dry-air hydration protocol as Denver.",
      es: "Cobertura: Salt Lake, Park City, Heber y Provo.",
    },
  },
  {
    slug: "pittsburgh", slugEs: "pittsburgh", name: "Pittsburgh", state: "PA", stateFull: "Pennsylvania",
    fedexHub: { en: "Indianapolis hub → PIT FedEx ramp", es: "Hub de Indianapolis → ramp FedEx en PIT", transitDays: "1–2 business days" },
    neighborhoods: ["Shadyside","Squirrel Hill","Lawrenceville","Sewickley","Mt. Lebanon","South Side"],
    zips: ["15232","15217","15201","15143","15228","15203"],
    occasions: [
      { en: "Steelers, Penguins and Pitt game-day flowers", es: "Flores de Steelers, Penguins y Pitt" },
      { en: "UPMC patient deliveries across the hospital network", es: "Entregas en la red UPMC" },
      { en: "CMU and Pitt commencement bouquets", es: "Bouquets de graduación de CMU y Pitt" },
      { en: "Shadyside and Sewickley anniversary deliveries", es: "Aniversarios en Shadyside y Sewickley" },
    ],
    intro: {
      en: "Pittsburgh's hilly topography makes for tricky last-mile delivery — Mt. Washington, Squirrel Hill and the South Side Slopes have switchback streets. We add the recipient phone number to the label by default for all 152xx ZIPs so drivers can confirm if Google Maps drops them on the wrong side of a hill.",
      es: "Las colinas de Pittsburgh complican el last-mile — Mt. Washington, Squirrel Hill, South Side Slopes. Añadimos teléfono por defecto en todos los 152xx.",
    },
    localTouch: {
      en: "Coverage: Allegheny County plus the Sewickley/North Hills corridor and Mt. Lebanon. UPMC addresses always carry the building name on the label.",
      es: "Cobertura: Allegheny, Sewickley/North Hills y Mt. Lebanon.",
    },
  },
  {
    slug: "cincinnati", slugEs: "cincinnati", name: "Cincinnati", state: "OH", stateFull: "Ohio",
    fedexHub: { en: "Indianapolis hub → CVG FedEx ramp", es: "Hub de Indianapolis → ramp FedEx en CVG", transitDays: "1 business day" },
    neighborhoods: ["Hyde Park","Mt. Adams","Indian Hill","OTR (Over-the-Rhine)","Mariemont","Newport (KY)"],
    zips: ["45208","45202","45243","45202","45227","41071"],
    occasions: [
      { en: "Bengals game flowers at Paycor Stadium", es: "Flores de Bengals en Paycor Stadium" },
      { en: "Reds Opening Day deliveries downtown", es: "Opening Day de los Reds en downtown" },
      { en: "P&G and Kroger HQ corporate gifting", es: "Regalos a HQs de P&G y Kroger" },
      { en: "Cincinnati Children's Hospital patient bouquets", es: "Bouquets a Cincinnati Children's" },
    ],
    intro: {
      en: "Cincinnati's airport (CVG) sits across the Ohio River in Northern Kentucky — our FedEx sort technically lands in KY and trucks back into OH. The whole tri-state shares the same sort, so Cincy, Northern Kentucky (Covington, Newport, Fort Mitchell) and Indiana suburbs deliver on the same FedEx label.",
      es: "CVG está al otro lado del Ohio River en KY. El tri-state — Cincinnati, norte de Kentucky e Indiana suburbs — comparte el mismo sort.",
    },
    localTouch: {
      en: "Coverage: Hamilton County plus Northern Kentucky and Mason/West Chester. P&G's downtown HQ accepts FedEx at the lobby security desk.",
      es: "Cobertura: Hamilton, norte de Kentucky y Mason/West Chester.",
    },
  },
  {
    slug: "st-louis", slugEs: "san-luis", name: "St. Louis", state: "MO", stateFull: "Missouri",
    fedexHub: { en: "Memphis SuperHub → STL FedEx ramp", es: "Memphis SuperHub → ramp FedEx en STL", transitDays: "1–2 business days" },
    neighborhoods: ["Central West End","Clayton","Ladue","Soulard","U City","Webster Groves"],
    zips: ["63108","63105","63124","63104","63130","63119"],
    occasions: [
      { en: "Cardinals and Blues game-day flowers", es: "Flores de Cardinals y Blues" },
      { en: "Wash U commencement bouquets in May", es: "Bouquets de graduación de Wash U en mayo" },
      { en: "Anheuser-Busch and Edward Jones corporate gifting", es: "Regalos a Anheuser-Busch y Edward Jones" },
      { en: "BJC and Children's Hospital patient deliveries", es: "Entregas a BJC y Children's Hospital" },
    ],
    intro: {
      en: "St. Louis sits near the geographic center of FedEx's US network — packages from Miami arrive at STL in a single overnight, often before the morning rush. Most volume goes to Clayton (suburban business center), the Central West End, Ladue, plus a steady Wash U graduation run every May.",
      es: "St. Louis está en el centro geográfico de la red FedEx — los paquetes desde Miami llegan en una noche. La mayoría va a Clayton, Central West End y Ladue.",
    },
    localTouch: {
      en: "Coverage: St. Louis City and County plus St. Charles County (Chesterfield, Town & Country) and the Metro East in Illinois.",
      es: "Cobertura: ciudad y condado de St. Louis, St. Charles y Metro East en Illinois.",
    },
  },
];

export const findCityBySlug = (slug: string): CityPage | undefined =>
  cityPages.find((c) => c.slug === slug || c.slugEs === slug);

export const cityPageSlugs = cityPages.map((c) => ({ slug: c.slug, slugEs: c.slugEs }));
