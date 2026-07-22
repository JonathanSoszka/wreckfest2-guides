/**
 * Fetches the car index photography from Wikimedia Commons and writes the credit
 * metadata into each car's frontmatter.
 *
 * Every image here is freely licensed (public domain, CC BY, CC BY-SA, or the
 * Commons "Attribution" template) and was verified on its own file page before
 * being added. This manifest IS the provenance record: `source` is the Commons
 * file page a reviewer can check, `license` and `credit` are what the site must
 * display. Don't add an entry without checking the file page yourself.
 *
 * Note on share-alike: resizing produces a derivative, so the CC BY-SA images
 * below stay CC BY-SA and must be labelled as such. That binds those images, not
 * the site.
 *
 *   node scripts/fetch-car-images.mjs           # download + resize + tag frontmatter
 *   node scripts/fetch-car-images.mjs --check   # report what would change
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'cars');
const CONTENT_DIR = path.join(ROOT, 'src', 'content', 'cars');

/** Rendered at ~190px wide on the index; 760 keeps it crisp at 2x DPR. */
const WIDTH = 760;

const UA = 'wreckfest2-guides/1.0 (static site build; contact via github.com/JonathanSoszka/wreckfest2-guides)';

const CARS = [
  { slug: 'bravion', shows: '2004 BMW 330xi (E46) sedan', license: 'CC0 1.0', credit: 'Cutlass',
    source: 'https://commons.wikimedia.org/wiki/File:2004_BMW_330xi_in_Titanium_Silver_Metallic,_front_right,_07-04-2026.jpg',
    file: 'https://upload.wikimedia.org/wikipedia/commons/1/13/2004_BMW_330xi_in_Titanium_Silver_Metallic%2C_front_right%2C_07-04-2026.jpg' },
  { slug: 'buggy', shows: '1971 Volkswagen Beetle', license: 'CC BY 2.0', credit: 'Greg Gjerdingen',
    source: 'https://commons.wikimedia.org/wiki/File:71_Volkswagen_Beetle_(7766302818).jpg',
    file: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/71_Volkswagen_Beetle_%287766302818%29.jpg' },
  { slug: 'bullet', shows: '1970 Dodge Charger', license: 'CC BY 2.0', credit: 'Kieran White',
    source: 'https://commons.wikimedia.org/wiki/File:1970_Dodge_Charger_6.3_V8_(15262649127).jpg',
    file: 'https://upload.wikimedia.org/wikipedia/commons/2/29/1970_Dodge_Charger_6.3_V8_%2815262649127%29.jpg' },
  { slug: 'cardinal', shows: '2007 Ford Crown Victoria LX', license: 'Public domain', credit: 'IFCAR',
    source: 'https://commons.wikimedia.org/wiki/File:2007_Ford_Crown_Victoria_LX.jpg',
    file: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/2007_Ford_Crown_Victoria_LX.jpg' },
  { slug: 'crusader', shows: '2002 Chevrolet Cavalier VL sedan', license: 'CC BY-SA 4.0', credit: 'Elise240SX',
    source: 'https://commons.wikimedia.org/wiki/File:2002_Chevrolet_Cavalier_VL_Sedan_in_Ultra_Silver_Metallic,_Front_Right,_10-18-2022.jpg',
    file: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/2002_Chevrolet_Cavalier_VL_Sedan_in_Ultra_Silver_Metallic%2C_Front_Right%2C_10-18-2022.jpg' },
  { slug: 'gizmo', shows: 'Volkswagen Golf Mk1 (facelift)', license: 'Attribution (free use with credit)', credit: 'Rudolf Stricker',
    source: 'https://commons.wikimedia.org/wiki/File:VW_Golf_I_front_20090416.jpg',
    file: 'https://upload.wikimedia.org/wikipedia/commons/5/54/VW_Golf_I_front_20090416.jpg' },
  { slug: 'grandstar', shows: '2003 Dodge Caravan SE', license: 'CC BY-SA 4.0', credit: 'Elise240SX',
    source: 'https://commons.wikimedia.org/wiki/File:2003_Dodge_Caravan_SE_in_Deep_Molten_Red_Pearl,_Front_Left,_11-12-2022.jpg',
    file: 'https://upload.wikimedia.org/wikipedia/commons/8/83/2003_Dodge_Caravan_SE_in_Deep_Molten_Red_Pearl%2C_Front_Left%2C_11-12-2022.jpg' },
  { slug: 'hurricane', shows: '1969 Chevrolet Camaro Z/28 Rally Sport', license: 'CC BY-SA 4.0', credit: 'MercurySable99',
    source: 'https://commons.wikimedia.org/wiki/File:1969_Chevrolet_Camaro_Z28_Rally_Sport,_front_right,_09-09-2023.jpg',
    file: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/1969_Chevrolet_Camaro_Z28_Rally_Sport%2C_front_right%2C_09-09-2023.jpg' },
  { slug: 'jackal', shows: '1990 Ford Mustang GT 5.0 hatchback (Fox body)', license: 'CC BY-SA 3.0', credit: 'Mr.choppers',
    source: 'https://commons.wikimedia.org/wiki/File:1990_Ford_Mustang_GT_5.0_Hatchback_in_Ultra_Blue,_front_right.jpg',
    file: 'https://upload.wikimedia.org/wikipedia/commons/6/62/1990_Ford_Mustang_GT_5.0_Hatchback_in_Ultra_Blue%2C_front_right.jpg' },
  { slug: 'nami', shows: '1991 Mazda MX-5 Miata (NA)', license: 'CC BY-SA 4.0', credit: 'Elise240SX',
    source: 'https://commons.wikimedia.org/wiki/File:1991_Mazda_MX-5_Miata_in_Classic_Red,_Front_Right,_05-29-2022.jpg',
    file: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/1991_Mazda_MX-5_Miata_in_Classic_Red%2C_Front_Right%2C_05-29-2022.jpg' },
  { slug: 'phaser', shows: '1991 Honda Prelude Si 4WS coupe', license: 'Public domain', credit: 'OSX',
    source: 'https://commons.wikimedia.org/wiki/File:1991_Honda_Prelude_Si_4WS_coupe_(2015-07-24)_02.jpg',
    file: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/1991_Honda_Prelude_Si_4WS_coupe_%282015-07-24%29_02.jpg' },
  { slug: 'popper', shows: '1970 Fiat 500 L', license: 'Public domain', credit: 'IFCAR',
    source: 'https://commons.wikimedia.org/wiki/File:1970_Fiat_500_L_--_2011_DC_1.jpg',
    file: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/1970_Fiat_500_L_--_2011_DC_1.jpg' },
  { slug: 'rammer', shows: '1986 Chevrolet Caprice Classic sedan', license: 'CC BY-SA 4.0', credit: 'Urbansuburban86',
    source: 'https://commons.wikimedia.org/wiki/File:1986_Caprice_Classic_Sedan.jpg',
    file: 'https://upload.wikimedia.org/wikipedia/commons/9/99/1986_Caprice_Classic_Sedan.jpg' },
  { slug: 'roadslayer', shows: '1973 Pontiac Firebird Trans Am', license: 'CC BY-SA 4.0', credit: 'Elise240SX',
    source: 'https://commons.wikimedia.org/wiki/File:1973_Pontiac_Firebird_Trans_Am_in_Buccaneer_Red,_Front_Left,_09-11-2023.jpg',
    file: 'https://upload.wikimedia.org/wikipedia/commons/6/63/1973_Pontiac_Firebird_Trans_Am_in_Buccaneer_Red%2C_Front_Left%2C_09-11-2023.jpg' },
  { slug: 'rocket', shows: '1968 Ford Mustang GT hardtop', license: 'CC BY-SA 4.0', credit: 'MercurySable99',
    source: 'https://commons.wikimedia.org/wiki/File:1968_Ford_Mustang_GT_hardtop,_front_left,_09-07-2024.jpg',
    file: 'https://upload.wikimedia.org/wikipedia/commons/7/75/1968_Ford_Mustang_GT_hardtop%2C_front_left%2C_09-07-2024.jpg' },
  { slug: 'stahlwagen', shows: '2004 Mercedes-Benz C270 CDI estate (S203)', license: 'CC0 1.0', credit: 'MoCars',
    source: 'https://commons.wikimedia.org/wiki/File:2004_Mercedes-Benz_C270_CDI_Elegance_SE_Wagon_(Front).png',
    file: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/2004_Mercedes-Benz_C270_CDI_Elegance_SE_Wagon_%28Front%29.png' },
  { slug: 'switchback', shows: '1968 Chevrolet Chevelle SS396 hardtop', license: 'CC BY 2.0', credit: 'Sicnag',
    source: 'https://commons.wikimedia.org/wiki/File:1968_Chevrolet_Chevelle_SS396_Hardtop_(31750917026).jpg',
    file: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/1968_Chevrolet_Chevelle_SS396_Hardtop_%2831750917026%29.jpg' },
  { slug: 'valken', shows: '1997 Saab 900 (NG900) 3-door hatchback', license: 'Public domain', credit: 'OSX',
    source: 'https://commons.wikimedia.org/wiki/File:1997_Saab_900_(MY97)_S_2.0_3-door_hatchback_(2015-07-15)_01.jpg',
    file: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/1997_Saab_900_%28MY97%29_S_2.0_3-door_hatchback_%282015-07-15%29_01.jpg' },
];

const yamlEscape = (s) => (/[:#]/.test(s) ? `"${s.replace(/"/g, '\\"')}"` : s);

/**
 * Commons' own pre-rendered thumbnail rather than the full original.
 * Pulling 18 multi-megabyte originals gets you a 429, and their error message
 * asks for exactly this — which is also all we need, since we downscale anyway.
 *
 *   .../commons/b/b0/Name.jpg  ->  .../commons/thumb/b/b0/Name.jpg/960px-Name.jpg
 *
 * The width MUST be one of the cached steps, or the request is rejected:
 * 20, 40, 60, 120, 250, 330, 500, 960, 1280, 1920, 3840.
 * See https://www.mediawiki.org/wiki/Common_thumbnail_sizes — 960 is the first
 * step at or above our 760px render width.
 */
function thumbUrl(fileUrl, width) {
  const m = fileUrl.match(/^(https:\/\/upload\.wikimedia\.org\/wikipedia\/commons)\/(\w)\/(\w{2})\/(.+)$/);
  if (!m) return fileUrl;
  const [, base, a, ab, name] = m;
  return `${base}/thumb/${a}/${ab}/${name}/${width}px-${name}`;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Fetch with polite pacing and backoff; Commons rate-limits bursts. */
async function fetchImage(car) {
  const urls = [thumbUrl(car.file, 960), car.file]; // thumbnail first, original as fallback
  for (const url of urls) {
    for (let attempt = 0; attempt < 5; attempt++) {
      const res = await fetch(url, { headers: { 'User-Agent': UA } });
      if (res.ok) return Buffer.from(await res.arrayBuffer());
      if (res.status === 429) {
        // Commons rate-limits in bursts; back off generously rather than hammering.
        await sleep(4000 * (attempt + 1));
        continue;
      }
      break; // some other error — try the next URL
    }
  }
  return null;
}

async function tagFrontmatter(car) {
  const file = path.join(CONTENT_DIR, `${car.slug}.md`);
  if (!existsSync(file)) return `no such file: ${car.slug}.md`;
  let text = await readFile(file, 'utf-8');
  const fields = {
    heroImage: `/cars/${car.slug}.webp`,
    imageShows: car.shows,
    imageCredit: car.credit,
    imageLicense: car.license,
    imageSource: car.source,
  };
  for (const [key, value] of Object.entries(fields)) {
    const line = `${key}: ${yamlEscape(value)}`;
    const re = new RegExp(`^${key}: .*$`, 'm');
    if (re.test(text)) {
      text = text.replace(re, line);
    } else {
      // keep the block together, after bodyStyle (or drivetrain as a fallback)
      const anchor = /^bodyStyle: .*$/m.test(text) ? /^(bodyStyle: .*)$/m : /^(drivetrain: .*)$/m;
      text = text.replace(anchor, `$1\n${line}`);
    }
  }
  await writeFile(file, text, 'utf-8');
  return 'tagged';
}

async function main() {
  const check = process.argv.includes('--check');
  await mkdir(OUT_DIR, { recursive: true });
  let total = 0;
  let ok = 0;
  const failed = [];

  for (const car of CARS) {
    if (check) {
      console.log(`${car.slug.padEnd(11)} ${car.license.padEnd(34)} ${car.credit}`);
      continue;
    }
    const out0 = path.join(OUT_DIR, `${car.slug}.webp`);
    if (existsSync(out0) && !process.argv.includes('--force')) {
      // Still re-tag: the manifest is the source of truth for credits, and skipping
      // the download shouldn't leave frontmatter stale.
      const status = await tagFrontmatter(car);
      console.log(`${car.slug.padEnd(11)} image present — skipped download, ${status}`);
      ok++;
      continue;
    }
    const input = await fetchImage(car);
    if (!input) {
      console.log(`${car.slug.padEnd(11)} FAILED — could not fetch`);
      failed.push(car.slug);
      continue;
    }
    const out = path.join(OUT_DIR, `${car.slug}.webp`);
    // sharp drops EXIF unless asked to keep it — we want it dropped.
    const info = await sharp(input)
      .resize({ width: WIDTH, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(out);
    total += info.size;
    ok++;
    const status = await tagFrontmatter(car);
    console.log(
      `${car.slug.padEnd(11)} ${String(Math.round(input.length / 1024)).padStart(6)}KB -> ` +
      `${String(Math.round(info.size / 1024)).padStart(4)}KB  ${info.width}x${info.height}  ${status}`,
    );
    await sleep(700); // pace the requests; Commons rate-limits bursts
  }
  if (!check) {
    console.log(`\n${ok}/${CARS.length} images, ${(total / 1024).toFixed(0)}KB shipped total`);
    if (failed.length) console.log(`FAILED: ${failed.join(', ')}`);
  }
}

main();
