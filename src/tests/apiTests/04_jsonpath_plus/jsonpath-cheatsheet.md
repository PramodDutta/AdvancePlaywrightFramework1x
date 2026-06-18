# JSONPath Cheat Sheet (`jsonpath-plus`)

Quick reference for querying JSON with the [`jsonpath-plus`](https://github.com/JSONPath-Plus/JSONPath) package.
All examples below run against [`store.json`](./store.json) and are exercised live in
[`jsonpath-queries.e2e.spec.ts`](./jsonpath-queries.e2e.spec.ts).

JSONPath is the JSON analogue of XPath. A path is evaluated against a document and
**always returns an array of matches** (empty array = no match).

## Usage

```ts
import { JSONPath } from 'jsonpath-plus';

const result = JSONPath({ path: '$.store.book[*].author', json: data });
// result is ALWAYS an array, even for a single match.

// Useful options:
JSONPath({ path, json, wrap: false });   // unwrap single result (no array)
JSONPath({ path, json, resultType: 'path' }); // return the paths, not the values
JSONPath({ path, json, flatten: true });
```

---

## Core syntax

| Symbol | Name | Meaning |
|--------|------|---------|
| `$` | root | The root object/element. Every path starts here. |
| `@` | current | The current node being processed (used inside filters). |
| `.` | child (dot) | Direct child: `$.store.book`. |
| `['name']` | child (bracket) | Same as dot; needed for keys with spaces/special chars: `$['store']['book']`. |
| `..` | recursive descent | Search at **any depth**: `$..author` finds every `author` anywhere. |
| `*` | wildcard | All children of an object or all elements of an array. |
| `[n]` | array index | Element at index `n` (0-based): `$.store.book[0]`. |
| `[n1,n2]` | union | Multiple indices/keys: `$.store.book[0,2]`. |
| `[start:end:step]` | slice | Array sub-range, `end` **exclusive**: `$.store.book[0:2]`. |
| `[?(...)]` | filter | Keep only elements where the expression is truthy. |
| `[(expr)]` | script expr | Computed index, e.g. last item: `$.store.book[(@.length-1)]`. |

---

## 1. Root element — `$`

```
$                      → the whole document
$.store                → the store object
```

## 2. Child element — `.child` or `['child']`

```
$.store.bicycle.color          → "red"
$['store']['bicycle']['color'] → "red"   (equivalent; required for odd keys)
$.store.book                   → the book array
```

## 3. Recursive descent — `..`

Finds a key/element regardless of how deeply it is nested.

```
$..author        → every author in the document
$..price         → every price (books + bicycle + electronics)
$..tools         → tool arrays buried in company.departments.*.teams.*
$..book[*].title → all book titles found via recursive descent
```

## 4. Wildcard — `*`

```
$.store.book[*].author    → authors of all books
$.store.*                 → all direct values of store (book array, bicycle, ...)
$.company.departments.*   → every department object
$..book[*]                → all book objects anywhere
```

## 5. Array index — `[n]`

```
$.store.book[0]      → first book
$.store.book[2]      → third book
$.store.book[-1:]    → last book (negative index via slice)
$.store.book[0,2]    → union: first and third book
```

> `jsonpath-plus` also supports `$.store.book[(@.length-1)]` for the last element.

## 6. Array slicing — `[start:end:step]`

`end` is **exclusive**. Any part can be omitted.

```
$.store.book[0:2]    → books at index 0 and 1 (first two)
$.store.book[2:]     → from index 2 to the end
$.store.book[:2]     → first two (start defaults to 0)
$.store.book[::2]    → every other book (index 0, 2, 4)
$.store.book[-2:]    → last two books
```

## 7. Filtration — `[?(...)]`

The heart of querying. `@` = current element. Expression is JavaScript-like.

### Comparison operators

| Operator | Meaning |
|----------|---------|
| `==` / `===` | equal (prefer `===`) |
| `!=` / `!==` | not equal |
| `<` `<=` `>` `>=` | numeric/string comparison |
| `&&` | logical AND |
| `\|\|` | logical OR |
| `!` | logical NOT |
| `=~` | regex match: `[?(@.title =~ /lord/i)]` |

### Examples

```
$.store.book[?(@.price < 10)]                       → books cheaper than 10
$.store.book[?(@.price >= 10 && @.price <= 25)]     → mid-priced books
$.store.book[?(@.category === 'fiction')]           → all fiction
$.store.book[?(@.inStock === true)]                 → in-stock books
$.store.book[?(@.price < 10 && @.inStock === true)] → cheap AND in stock
$.store.book[?(@.isbn)]                              → books that HAVE an isbn (field exists)
$.store.book[?(!@.isbn)]                             → books with NO isbn
$.store.book[?(@.title =~ /playwright/i)]            → title matches regex

$.employees[?(@.role === 'SDET')]                   → all SDETs
$.employees[?(@.role === 'SDET' && @.salary > 90000)] → well-paid SDETs
$.employees[?(@.address.city === 'Pune')]           → filter on nested field
$.store.book[?(@.tags.indexOf('classic') !== -1)]   → tag contains "classic"
```

### Filter referencing the document root

Use `$` inside a filter to compare against a value elsewhere in the document:

```
$.store.book[?(@.price < $.expensiveThreshold)]     → cheaper than the configured threshold
```

---

## Combining everything

```
$..book[?(@.price < 10)].title           → titles of cheap books, found at any depth
$.store.book[?(@.category === 'fiction')][0]        → first fiction book
$.store.electronics[?(@.specs.ram === '8GB')].brand → brands with 8GB RAM
$.employees[*].skills[*]                  → flat list of all skills across employees
```

## Result-type options (jsonpath-plus specific)

| Option | Effect |
|--------|--------|
| `resultType: 'value'` | the matched values (default) |
| `resultType: 'path'` | normalized path strings to each match |
| `resultType: 'pointer'` | JSON Pointer to each match |
| `resultType: 'parent'` | the parent of each match |
| `resultType: 'all'` | `{ value, path, parent, parentProperty, pointer }` |
| `wrap: false` | return a single value unwrapped instead of a 1-element array |

```ts
JSONPath({ path: '$.store.book[?(@.price<10)]', json: data, resultType: 'path' });
// → ["$['store']['book'][0]", "$['store']['book'][2]"]
```
