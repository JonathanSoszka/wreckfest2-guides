/**
 * Content access helpers.
 *
 * Every page must go through `getPublished()` rather than calling `getCollection()`
 * and filtering `draft` itself — that filter used to be copy-pasted across ten call
 * sites, which is ten chances to forget one and leak an unfinished guide.
 */
import { getCollection, type CollectionEntry, type CollectionKey } from 'astro:content';
import { SHOW_DRAFTS } from '../config/flags';

/**
 * All entries in a collection, minus drafts.
 *
 * With `SHOW_DRAFTS=1` (local authoring) drafts are included instead. That flag
 * defaults to false, so a production build can't ship one by accident.
 */
export async function getPublished<C extends CollectionKey>(
  collection: C,
): Promise<CollectionEntry<C>[]> {
  const entries = await getCollection(collection);
  if (SHOW_DRAFTS) return entries;
  return entries.filter((entry) => !(entry.data as { draft?: boolean }).draft);
}
