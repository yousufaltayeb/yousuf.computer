+++
title = "كيف تعمل database migrations لتطبيق production من غير أي downtime؟"
date = 2026-07-24
[taxonomies]
tags = ["databases", "migrations", "backend", "software-engineering"]
[extra]
lang = "ar"
+++

لو مثلاً عايز تغيّر اسم column في production — كيف تسويها من غير downtime؟

واحد من الطرق تُسمى **expand and contract pattern**. الفكرة إنك تقسّم الـ migration لعدة خطوات، كل واحدة منها safe وما بتحتاج downtime.

## المثال

عندك column اسمه `name`، وعايز تلغيه وتضيف `first_name` و `last_name`.

### 1. Expand — أضف الـ schema الجديدة

أول خطوة: تضيف `first_name` و `last_name` كـ nullable. الحين عندك `name` و `first_name` و `last_name` كلهم مع بعض.

```sql
ALTER TABLE users
  ADD COLUMN first_name TEXT NULL,
  ADD COLUMN last_name TEXT NULL;
```

### 2. Dual write — اكتب على الاثنين

تخلي الـ application code يكتب على الـ schema الجديدة والقديمة في نفس الوقت، لكن يكمّل يقرأ من القديمة (`name`).

كذا أي row جديد بيكون عنده `name` و `first_name` و `last_name`. لكن عندك rows قديمة ما فيها `first_name` و `last_name`.

### 3. Backfill — املأ البيانات القديمة

ترجع تملأ الخانات القديمة كـ background job. تاخذ `name` وتعمل split by space، مثلاً:

```js
// background job
const [firstName, ...rest] = name.split(" ");
const lastName = rest.join(" ");
```

كذا الحين عندك كل الثلاث خانات فيها بيانات.

### 4. Switch reads — اقرأ من الـ schema الجديدة

تحوّل الـ application code من إنه يقرأ من الـ schema القديمة إلى الجديدة. يعني القراءات تصير من `first_name` و `last_name`.

### 5. Contract — احذف القديم

الـ schema القديمة (`name`) غير مستخدمة — ما عليها أي قراءة أو كتابة. تقدر بكل بساطة تعمل drop للـ `name`:

```sql
ALTER TABLE users DROP COLUMN name;
```

---

الخلاصة: ما تغيّر الـ schema والـ application في نفس اللحظة. توسّع أولاً، تهاجر البيانات، تحوّل القراءات، وبعدين تضيق. كل خطوة قابلة للـ deploy لوحدها، وبدون downtime.

المصدر: [Using the expand and contract pattern — Prisma's Data Guide](https://www.prisma.io/dataguide/types/relational/expand-and-contract-pattern)
