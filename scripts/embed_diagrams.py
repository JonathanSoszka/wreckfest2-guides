#!/usr/bin/env python3
"""
Embed generated diagrams into the lesson markdown.

Lesson figures are inline SVG (the lessons are plain Markdown, so there is no
component to import). This script keeps them in sync with `gen_diagrams.py`:
it regenerates each mapped diagram and swaps it into the lesson's <figure>,
preserving the hand-written <figcaption>.

Re-runnable — figures are tagged `data-diagram="<name>"` so a second run replaces
rather than duplicates. Run it after changing gen_diagrams.py:

    python scripts/embed_diagrams.py
"""
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import gen_diagrams as gd  # noqa: E402

LESSONS = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                       'src', 'content', 'lessons')

# lesson file -> diagram builder in gen_diagrams
DIAGRAMS = {
    'rotating-the-car-on-loose.md': gd.pendulum_svg,
    'reading-the-surface.md': gd.swept_line_svg,
    'jumps-and-crests.md': gd.jump_svg,
}

FIGURE = re.compile(r'<figure class="lesson-figure"[^>]*>.*?</figure>', re.S)
CAPTION = re.compile(r'<figcaption>(.*?)</figcaption>', re.S)


def inline_svg(builder):
    """Generator SVG trimmed to the embedded form: viewBox only, no width/height."""
    s = builder().strip()
    return re.sub(r'<svg([^>]*?)>',
                  lambda m: '<svg' + re.sub(r'\s+(width|height)="[^"]*"', '', m.group(1)) + '>',
                  s, count=1)


def main():
    for name, builder in DIAGRAMS.items():
        path = os.path.join(LESSONS, name)
        text = open(path, encoding='utf-8').read()
        found = FIGURE.search(text)
        if not found:
            print('SKIP (no <figure> found):', name)
            continue
        caption = CAPTION.search(found.group(0))
        if not caption:
            print('SKIP (no <figcaption> to preserve):', name)
            continue
        diagram = os.path.splitext(name)[0]
        block = (f'<figure class="lesson-figure" data-diagram="{builder.__name__[:-4].replace("_", "-")}">\n'
                 + inline_svg(builder) + '\n<figcaption>' + caption.group(1) + '</figcaption>\n</figure>')
        updated = text[:found.start()] + block + text[found.end():]
        if updated == text:
            print('unchanged:', name)
            continue
        open(path, 'w', encoding='utf-8', newline='\n').write(updated)
        print('updated:', name, f'({diagram})')


if __name__ == '__main__':
    main()
