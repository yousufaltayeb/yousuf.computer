+++
title = "كيف تبث 10 تيرابايت من الفيديو بأقل من 10 دولارات؟"
date = 2026-08-30
description = "شرح عملي لبناء بنية بث فيديو عند الطلب باستخدام FFmpeg وCloudflare R2 وWorkers، مع مقارنة تكلفة Cloudflare Stream وMux وBunny Stream وapi.video وحسابات التخزين والطلبات والبث."
[taxonomies]
tags = ["video", "streaming", "ffmpeg", "cloudflare-r2", "cloudflare-workers", "hls"]
[extra]
lang = "ar"
+++

تخيل أنك تبني منصة كورسات تحتوي على 10 كورسات بجودة 1080p، وكل كورس مدته 20 ساعة.

هذا يعني أن لديك:

- 200 ساعة فيديو.
- 12,000 دقيقة محتوى.
- وحوالي 10TB من الفيديو يتم بثها للمستخدمين شهريًا.

لو استخدمت خدمة متكاملة مثل Cloudflare Stream أو Mux، فقد تصل فاتورتك إلى مئات الدولارات شهريًا.

لكن لو فصلت عملية الـencoding عن التخزين والبث، ونفذت جزءًا من البنية بنفسك، فمن الممكن نظريًا خفض التكلفة الأساسية إلى حوالي:

**8.90 دولارات شهريًا.**

قبل أن ندخل في التفاصيل، هناك توضيح مهم:

> المقصود بـ10TB هنا هو حجم البيانات التي تم إرسالها للمستخدمين خلال الشهر، وليس حجم الفيديوهات المخزنة.

لو كنت تخزن 10TB فعلًا، فإن تخزينها على Cloudflare R2 وحده سيكلف قرابة 150 دولارًا شهريًا.

كذلك، رقم 8.90 دولارات يفترض نسخة واحدة من الفيديو بمتوسط bitrate إجمالي يقارب 3Mbps، وقطع HLS مدتها 6 ثوانٍ، وبقاء عدد الطلبات داخل الحدود المشمولة. الرقم لا يشمل وقت التطوير، الكهرباء، تكلفة الجهاز، الضرائب، أو الخدمات المتقدمة مثل DRM والتحليلات.

الأسعار المذكورة في هذا المقال تمت مراجعتها بتاريخ **30 أغسطس 2026**.

---

## من أين تأتي تكلفة بث الفيديو؟

تكلفة تشغيل الفيديو لا تتعلق بالتخزين فقط. غالبًا ستدفع مقابل أربع مراحل مختلفة:

1. **التخزين:** الاحتفاظ بالفيديوهات والنسخ الناتجة بعد المعالجة.
2. **الـTranscoding:** تحويل الفيديو إلى codecs وbitrates ودقات مناسبة للأجهزة وسرعات الإنترنت المختلفة.
3. **الـPackaging:** تقسيم الفيديو إلى أجزاء صغيرة وإنشاء ملفات البث مثل HLS manifests.
4. **الـDelivery:** نقل هذه الملفات من مزود التخزين إلى جهاز المشاهد.

هناك أيضًا تكلفة إضافية قد لا تظهر مباشرة في الفاتورة، مثل:

- حماية الروابط.
- إدارة صلاحيات المشاهدة.
- مشغل الفيديو.
- التحليلات.
- الترجمة والـcaptions.
- الصور المصغرة.
- مراقبة الجودة والأخطاء.
- إعادة المحاولة عند فشل المعالجة.

الخدمات المتخصصة في الفيديو تجمع لك كل هذه الأجزاء في منتج واحد. أنت ترفع ملفًا، وتحصل بعد فترة قصيرة على رابط فيديو جاهز للتشغيل.

لكن هذه الراحة لها تكلفة.

---

## تصحيح تقني صغير: MP4 وHLS ليسا codecs

من الشائع أن نقول: «سنحول الفيديو من MP4 إلى HLS»، لكن هذا الوصف ليس دقيقًا بالكامل.

MP4 هو **container** يمكن أن يحتوي على فيديو مشفر باستخدام H.264 أو H.265 أو غيرهما.

أما HLS فهو طريقة لتقديم الفيديو باستخدام:

- ملف playlist غالبًا بامتداد `.m3u8`.
- مجموعة من ملفات الفيديو الصغيرة.
- نسخة واحدة أو عدة نسخ بجودات وbitrates مختلفة.

بالتالي قد تمر العملية بمرحلتين:

- **Transcoding:** إعادة ضغط الفيديو أو تغيير الدقة والـbitrate.
- **Packaging:** تقسيم الفيديو وإنشاء ملفات HLS.

إذا كان الفيديو الأصلي متوافقًا، فمن الممكن أحيانًا إنشاء HLS بدون إعادة ترميز كاملة باستخدام stream copy. لكن للحصول على bitrate ثابت نسبيًا، وأحجام متوقعة، وkeyframes مناسبة، ستحتاج غالبًا إلى إعادة الترميز.

FFmpeg يدعم إنشاء HLS playlists والقطع وتحديد مدة كل قطعة وأسماء الملفات، كما يدعم إنشاء عدة renditions للـAdaptive Bitrate Streaming.

[توثيق FFmpeg الخاص بـHLS](https://ffmpeg.org/ffmpeg-formats.html)

---

## السيناريو الذي سنحسب عليه

لدينا:

```text
10 كورسات × 20 ساعة = 200 ساعة فيديو
200 ساعة × 60 = 12,000 دقيقة محتوى
```

وسنفترض أن مستخدمي المنصة استهلكوا خلال الشهر:

```text
10TB من البيانات
```

الخدمات التي تحاسب على عدد دقائق المشاهدة، مثل Cloudflare Stream وMux، لا تحاسبك مباشرة بالـGB. لذلك نحتاج إلى تحويل 10TB إلى عدد تقريبي من دقائق المشاهدة.

للمقارنة مع الأرقام المختصرة في منشور LinkedIn، سنفترض أن متوسط الفيديو الذي وصل للمشاهد كان:

```text
4Mbps
```

الحسبة تكون:

```text
10,000GB × 8,000Mb لكل GB
÷ 4Mbps
÷ 60 ثانية
≈ 333,333 دقيقة مشاهدة
```

أي ما يعادل تقريبًا:

```text
5,556 ساعة مشاهدة
```

هذه ليست قاعدة ثابتة. لو كان متوسط البث 2Mbps، فستحصل على عدد دقائق أكبر من نفس الـ10TB. ولو كان 6Mbps، فستحصل على عدد دقائق أقل.

---

## كم ستكلف الخدمات المتكاملة؟

### Cloudflare Stream

Cloudflare Stream يحاسب حاليًا على بعدين رئيسيين:

- 5 دولارات لكل 1,000 دقيقة مخزنة.
- دولار واحد لكل 1,000 دقيقة يتم توصيلها للمشاهدين.

الـencoding والـingress مشمولان بدون تكلفة منفصلة.

[تسعير Cloudflare Stream](https://developers.cloudflare.com/stream/pricing/)

#### التخزين

```text
12,000 ÷ 1,000 × $5
= $60 شهريًا
```

#### البث

```text
333,333 ÷ 1,000 × $1
≈ $333.33
```

#### الإجمالي

```text
$60 + $333.33
≈ $393.33 شهريًا
```

ميزة Cloudflare Stream أن التكلفة لا تعتمد على حجم الملفات أو عدد الجودات التي ينشئها. لكن كلما زادت المشاهدات زادت الفاتورة بشكل مباشر.

### Mux

في Mux، مستوى Basic لا يفرض تكلفة input على الفيديو عند الطلب، بينما يبلغ تخزين فيديو 1080p في أول شريحة سعرية حوالي:

```text
$0.003 لكل دقيقة مخزنة شهريًا
```

ويحصل الحساب على أول 100,000 دقيقة delivery شهريًا مجانًا. بعد ذلك، يصل سعر توصيل 1080p في أول شريحة إلى:

```text
$0.001 لكل دقيقة
```

توجد خصومات حسب الحجم والدقة، كما أن Mux يطبق نظام Automatic Cold Storage على الفيديوهات غير المشاهدة.

[نظرة عامة على تسعير Mux](https://www.mux.com/docs/pricing/overview)

#### التخزين

```text
12,000 × $0.003
= $36
```

#### البث

أول 100,000 دقيقة مجانية:

```text
333,333 - 100,000
= 233,333 دقيقة مدفوعة
```

وفي الحسبة المحافظة، لو اعتبرناها كلها 1080p:

```text
233,333 × $0.001
≈ $233.33
```

#### الإجمالي المحافظ

```text
$36 + $233.33
≈ $269.33 شهريًا
```

حاسبة Mux تفترض عادة أن مشاهدة فيديو 1080p موزعة بين 720p و1080p. وفق هذا التوزيع قد يقترب الرقم من 246 دولارًا بدلًا من 269 دولارًا.

لذلك الرقم الواقعي في هذا المثال هو تقريبًا:

```text
$246 إلى $269 شهريًا
```

### Bunny Stream

Bunny Stream يستخدم تسعيرًا مختلفًا يعتمد على حجم البيانات:

- Encoding مجاني.
- التخزين يبدأ من 0.01 دولار لكل GB.
- الـCDN يبدأ من 0.005 دولار لكل GB.
- الحد الأدنى للحساب دولار واحد شهريًا.

السعر النهائي يعتمد على مناطق المشاهدين، وعدد نقاط التخزين، والـtier المستخدم.

[تسعير Bunny Stream](https://bunny.net/pricing/stream/)

#### توصيل 10TB

```text
10,000GB × $0.005
= $50
```

لو افترضنا أن حجم ملفات الفيديو الناتجة حوالي 270GB:

```text
270GB × $0.01
= $2.70
```

إذن البداية النظرية تكون:

```text
$50 + $2.70
≈ $52.70 شهريًا
```

لكن هذا أفضل سعر معلن، وليس رقمًا مضمونًا لكل منطقة أو إعداد. كذلك تخزين عدة نسخ من الفيديو أو استخدام عدة replication points سيرفع التكلفة.

### api.video

api.video يقدم encoding مجانيًا، ويعلن عن أسعار تبدأ من:

- 0.00285 دولار لكل دقيقة مخزنة.
- 0.0017 دولار لكل دقيقة يتم توصيلها.

هذه أسعار موصوفة بأنها “as low as”، أي إنها أدنى أسعار معلنة وقد تتطلب حجم استخدام أو شروطًا معينة.

[تسعير api.video](https://api.video/pricing/)

باستخدام هذه الأسعار كحد نظري أدنى:

#### التخزين

```text
12,000 × $0.00285
= $34.20
```

#### البث

```text
333,333 × $0.0017
≈ $566.67
```

#### الإجمالي النظري الأدنى

```text
$34.20 + $566.67
≈ $600.87 شهريًا
```

لذلك يمكننا وصف التكلفة هنا بأنها **مئات الدولارات شهريًا**، مع ضرورة استخدام الحاسبة الفعلية أو الحصول على عرض سعر لمعرفة الرقم النهائي.

### لماذا لم أضع AWS IVS في المقارنة؟

Amazon IVS مصمم أساسًا للبث المباشر منخفض التأخير أو البث اللحظي، وليس منصة VOD تقليدية لمكتبة كورسات مسجلة.

[Amazon IVS](https://aws.amazon.com/ivs/)

لو أردنا بناء مقارنة عادلة على AWS للفيديو المسجل، فعلينا حساب عدة خدمات معًا، مثل:

```text
S3
+ MediaConvert
+ CloudFront
+ Lambda أو Backend للحماية
```

لذلك وضع AWS IVS كرقم واحد بجانب Cloudflare Stream أو Mux سيكون مقارنة غير متكافئة.

---

## الحل منخفض التكلفة

بدل استخدام مزود فيديو متكامل، سنبني البنية التالية:

```text
MP4 الأصلي
    ↓
FFmpeg على جهازنا
    ↓
ملفات HLS
    ↓
Cloudflare R2
    ↓
Cloudflare Worker للحماية
    ↓
HLS Player في المتصفح
```

كل جزء له وظيفة محددة:

- **FFmpeg:** يعالج الفيديو مرة واحدة.
- **R2:** يخزن ملفات الفيديو.
- **Worker:** يتحقق من صلاحية المستخدم قبل تقديم الملفات.
- **HLS Player:** يشغل الفيديو داخل التطبيق.

الفكرة الأساسية هي أننا لن ندفع مقابل encoding مُدار، ولن ندفع مقابل كل GB يخرج من التخزين.

---

## لماذا Cloudflare R2 يغير الحسبة؟

تسعير R2 Standard حاليًا هو:

- 0.015 دولار لكل GB مخزن شهريًا.
- 4.50 دولارات لكل مليون Class A operations بعد المجاني.
- 0.36 دولار لكل مليون Class B operations بعد المجاني.
- لا توجد رسوم egress لنقل البيانات إلى الإنترنت.

وتتضمن الباقة المجانية الشهرية:

- 10GB من التخزين.
- مليون Class A operation.
- 10 ملايين Class B operations.
- Egress مجاني.

[تسعير Cloudflare R2](https://developers.cloudflare.com/r2/pricing/)

Class A تشمل عادة عمليات الكتابة مثل رفع الملفات.

Class B تشمل عادة عمليات القراءة مثل جلب كل قطعة فيديو من R2.

النقطة المهمة هنا:

> خروج 10TB من R2 إلى المستخدمين لا ينتج عنه رسم bandwidth منفصل.

لكن هذا لا يعني أن كل شيء مجاني. ما زلت تدفع مقابل التخزين، والطلبات التي تتجاوز الحدود المجانية، والـWorker.

---

## حساب تكلفة مكتبة الفيديو

سنفترض أننا أنشأنا نسخة HLS واحدة بدقة 1080p، بمتوسط bitrate إجمالي قدره:

```text
3Mbps
```

المقصود هنا هو مجموع الفيديو والصوت.

كل ساعة فيديو عند 1Mbps تستهلك تقريبًا:

```text
0.45GB
```

إذن:

```text
200 ساعة × 3Mbps × 0.45GB
= 270GB
```

تكلفة R2 بعد خصم أول 10GB المجانية:

```text
270GB - 10GB
= 260GB مدفوعة
```

ثم:

```text
260 × $0.015
= $3.90 شهريًا
```

---

## تكلفة Cloudflare Workers

خطة Workers المدفوعة تكلف 5 دولارات شهريًا، وتشمل:

- 10 ملايين request شهريًا.
- 30 مليون CPU millisecond شهريًا.
- 0.30 دولار لكل مليون request إضافي.
- 0.02 دولار لكل مليون CPU millisecond إضافي.

[تسعير Cloudflare Workers](https://developers.cloudflare.com/workers/platform/pricing/)

ملاحظة مهمة:

```text
الحد هو 10 ملايين request شهريًا
وليس 10 ملايين يوميًا.
```

الخطة المجانية تسمح بـ100 ألف request يوميًا، لكن هذا الحد قد لا يكون كافيًا عند تمرير كل HLS segment عبر Worker.

---

## كم request سينتج عن بث 10TB؟

سننشئ HLS segments مدة كل واحدة منها 6 ثوانٍ.

أولًا نحسب عدد ساعات المشاهدة الناتجة عن 10TB عند متوسط 3Mbps:

```text
10TB عند 3Mbps
≈ 444,444 دقيقة مشاهدة
≈ 7,407 ساعات مشاهدة
```

كل دقيقة تحتوي على عشر قطع مدة كل واحدة منها 6 ثوانٍ:

```text
444,444 × 10
≈ 4.44 ملايين segment request
```

سنضيف إلى ذلك طلبات:

- ملفات `.m3u8`.
- ملف `init.mp4`.
- إعادة فتح الفيديو.
- تقديم المستخدم داخل الفيديو.
- أي retries من المشغل.

مع ذلك، في هذا السيناريو توجد مساحة جيدة قبل الوصول إلى 10 ملايين request.

بالتالي غالبًا ستبقى:

```text
R2 Class B operations = $0
Workers request overage = $0
```

بشرط ألا تستخدم قطعًا قصيرة جدًا، وألا يكون لديك عدد ضخم من جلسات المشاهدة القصيرة والمتكررة.

---

## وماذا عن عمليات رفع الملفات؟

لدينا 200 ساعة فيديو، والقطعة الواحدة مدتها 6 ثوانٍ:

```text
200 × 60 × 60 ÷ 6
= 120,000 قطعة فيديو
```

حتى مع إضافة playlists وملفات initialization، سنبقى بعيدين عن مليون Class A operation المجانية.

ولو أنشأنا ثلاث جودات، فقد نقترب من:

```text
360,000 قطعة
```

وهو أيضًا أقل من المليون، لكن حجم التخزين سيرتفع بشكل واضح.

---

## التكلفة النهائية

في السيناريو الأساسي:

- تخزين 270GB على R2: **$3.90**.
- Cloudflare Workers Paid: **$5.00**.
- R2 Egress لـ10TB: **$0**.
- R2 Class B requests: **$0 ضمن الحد**.
- Workers request overage: **$0 ضمن الحد**.
- **الإجمالي: $8.90 شهريًا**.

إذن نعم، من الممكن بث 10TB من الفيديو بتكلفة بنية أساسية تقارب:

```text
$8.90 شهريًا
```

لكن الرقم يفترض:

- مكتبة بحجم 270GB تقريبًا.
- bitrate إجمالي قريب من 3Mbps.
- نسخة فيديو واحدة.
- HLS segments مدتها 6 ثوانٍ.
- Worker خفيف لا ينفذ عمليات باهظة لكل قطعة.
- عدد الطلبات أقل من الحدود المشمولة.
- عدم احتساب الضرائب، الكهرباء، ووقت التطوير.

---

## ما الحد الأقصى للحجم حتى نبقى تحت 10 دولارات؟

لدينا 5 دولارات ثابتة للـWorkers.

يتبقى من الميزانية:

```text
$10 - $5
= $5 للتخزين
```

عند سعر:

```text
$0.015 لكل GB
```

وبعد أول 10GB المجانية:

```text
$5 ÷ $0.015
≈ 333.3GB مدفوعة
```

نضيف إليها 10GB المجانية:

```text
343.3GB تقريبًا
```

إذن لكي تبقى التكلفة الأساسية تحت 10 دولارات، يجب أن يكون حجم المكتبة أقل من حوالي:

```text
343GB
```

بالنسبة إلى مكتبة مدتها 200 ساعة، هذا يعادل متوسط bitrate إجمالي يقارب:

```text
3.81Mbps
```

أي أن عنوان المقال يظل صحيحًا تقريبًا طالما بقي متوسط حجم النسخ المخزنة تحت هذا الحد.

---

## متى يصبح الرقم أكبر من 10 دولارات؟

### 1. عند رفع الـbitrate

لو كان متوسط الفيديو 4Mbps بدلًا من 3Mbps:

```text
200 × 4 × 0.45
= 360GB
```

التخزين:

```text
(360 - 10) × $0.015
= $5.25
```

مع Workers:

```text
$5.25 + $5
= $10.25
```

أي إننا تجاوزنا 10 دولارات حتى قبل حساب أي زيادات أخرى.

### 2. عند إنشاء Adaptive Bitrate Ladder

تجربة الفيديو الجيدة عادة لا تعتمد على نسخة 1080p واحدة.

قد تنشئ مثلًا:

```text
1080p: 3.0Mbps
720p:  1.5Mbps
480p:  0.8Mbps
Audio: 0.128Mbps
```

إجمالي النسخ المخزنة يصبح قريبًا من:

```text
5.4Mbps
```

لمدة 200 ساعة، قد يصل حجم المكتبة إلى حوالي:

```text
490GB
```

تكلفة التخزين تصبح تقريبًا:

```text
(490 - 10) × $0.015
= $7.20
```

ثم نضيف Workers:

```text
$7.20 + $5
= $12.20 شهريًا
```

لا تزال التكلفة منخفضة جدًا مقارنة بمئات الدولارات، لكنها لم تعد أقل من 10 دولارات.

### 3. عند الاحتفاظ بالملفات الأصلية

لو خزنت:

- الملف الأصلي.
- نسخة 1080p.
- نسخة 720p.
- نسخة 480p.
- نسخة MP4 قابلة للتحميل.

فقد يتضاعف حجم التخزين بسهولة.

الحسبة السابقة تفترض أنك تخزن الملفات المطلوبة للبث فقط، ولا تحتفظ بنسخ master ضخمة داخل نفس R2 bucket.

### 4. عند استخدام HLS segments قصيرة جدًا

لو استخدمت قطعًا مدتها ثانيتان بدلًا من 6 ثوانٍ، فإن عدد الطلبات سيتضاعف ثلاث مرات تقريبًا.

في مثال 10TB عند 3Mbps:

```text
6-second segments ≈ 4.44M requests
2-second segments ≈ 13.33M requests
```

وهنا ستتجاوز:

- 10 ملايين Worker requests.
- 10 ملايين R2 Class B operations.

الزيادة لن تحول الفاتورة إلى مئات الدولارات، لكنها ستجعل رقم 8.90 غير صحيح.

بالنسبة إلى محتوى كورسات مسجل، لا توجد غالبًا حاجة لقطع شديدة القصر. القطع القصيرة أهم في حالات البث المباشر منخفض التأخير.

### 5. عند تنفيذ Authentication معقد لكل قطعة

لو كان الـWorker يقوم لكل segment بـ:

- الاتصال بقاعدة بيانات.
- استدعاء API خارجي.
- قراءة session من خدمة بعيدة.
- فك JWT ضخم ومعالجة صلاحيات معقدة.
- كتابة analytics event متزامن.

فقد تزيد تكلفة CPU والـlatency بشكل واضح.

الحل الأفضل هو إصدار token قصير الصلاحية مرة واحدة، ثم التحقق منه محليًا داخل Worker باستخدام HMAC.

### 6. عند استخدام R2 Infrequent Access

قد يبدو R2 Infrequent Access أرخص لأن التخزين فيه يبلغ 0.01 دولار لكل GB، لكنه يفرض:

```text
$0.01 لكل GB يتم استرجاعه
```

لو تم بث 10,000GB:

```text
10,000 × $0.01
= $100 retrieval fees
```

لذلك يجب استخدام **R2 Standard** للفيديوهات التي تتم مشاهدتها باستمرار. كما أن الباقة المجانية لـR2 تنطبق على Standard ولا تنطبق على Infrequent Access.

[تفاصيل تسعير R2](https://developers.cloudflare.com/r2/pricing/)

---

## إنشاء ملفات HLS باستخدام FFmpeg

هذه نقطة بداية لنسخة HLS واحدة بدقة 1080p.

```bash
mkdir -p output

ffmpeg -i input.mp4 \
  -map 0:v:0 \
  -map 0:a:0? \
  -vf "scale=-2:1080" \
  -c:v libx264 \
  -preset slow \
  -crf 23 \
  -maxrate 2800k \
  -bufsize 5600k \
  -force_key_frames "expr:gte(t,n_forced*6)" \
  -c:a aac \
  -b:a 128k \
  -ac 2 \
  -f hls \
  -hls_time 6 \
  -hls_playlist_type vod \
  -hls_flags independent_segments \
  -hls_segment_type fmp4 \
  -hls_fmp4_init_filename init.mp4 \
  -hls_segment_filename "output/segment_%05d.m4s" \
  output/index.m3u8
```

الناتج سيكون قريبًا من:

```text
output/
├── index.m3u8
├── init.mp4
├── segment_00000.m4s
├── segment_00001.m4s
├── segment_00002.m4s
└── ...
```

القيمة `maxrate` ليست ضمانًا بأن متوسط الفيديو سيكون 2.8Mbps بالضبط. الفيديوهات التي تحتوي على شرائح ثابتة أو تسجيل شاشة قد تخرج بحجم أصغر، بينما المحتوى كثير الحركة قد يحتاج إلى bitrate أعلى للحفاظ على الجودة.

الأفضل أن تقيس الحجم الحقيقي بعد ترميز عينة من محتواك، بدل الاعتماد على رقم نظري.

لحساب حجم الملفات الناتجة على Linux:

```bash
find output -type f -printf '%s\n' |
awk '{ total += $1 } END { printf "%.2f GB\n", total / 1000000000 }'
```

كذلك، لا تقم برفع فيديو 720p إلى 1080p بلا سبب. عدّل أمر `scale` أو احذفه حسب دقة المصدر.

---

## رفع الملفات إلى R2

أنشئ bucket خاصًا، مثل:

```text
course-videos
```

ثم يمكنك استخدام AWS CLI لأن R2 يدعم S3-compatible API:

```bash
aws s3 sync output/ \
  s3://course-videos/courses/course-01/lesson-01/ \
  --endpoint-url "https://<ACCOUNT_ID>.r2.cloudflarestorage.com"
```

يفضل تنظيم الملفات بمسارات واضحة:

```text
courses/
  course-01/
    lesson-01/
      index.m3u8
      init.mp4
      segment_00000.m4s
      ...
    lesson-02/
      ...
```

اترك الـbucket خاصًا. لا تجعل ملفات الكورسات المدفوعة متاحة من خلال رابط `r2.dev` عام.

Cloudflare توضح أن نطاقات `r2.dev` مخصصة للتطوير ومحدودة، بينما يتيح الـcustom domain استخدام خصائص مثل caching وWAF والتحكم في الوصول.

[توثيق R2 Public Buckets](https://developers.cloudflare.com/r2/buckets/public-buckets/)

---

## حماية الفيديو باستخدام روابط موقعة

لا نريد أن يستطيع أي شخص تخمين رابط مثل:

```text
/courses/course-01/lesson-01/index.m3u8
```

وتحميل الفيديو.

الحل هو إنشاء token قصير الصلاحية يمنح المستخدم الوصول إلى مجلد درس محدد.

سيكون رابط التشغيل بالشكل التالي:

```text
https://video.example.com/v/<TOKEN>/courses/course-01/lesson-01/index.m3u8
```

ميزة وضع الـtoken داخل المسار هي أن الروابط النسبية الموجودة داخل ملف HLS ستحتفظ به تلقائيًا:

```text
segment_00001.m4s
```

سيتحول في المتصفح إلى:

```text
https://video.example.com/v/<TOKEN>/courses/course-01/lesson-01/segment_00001.m4s
```

وبذلك لا نحتاج إلى تعديل كل سطر داخل ملف `.m3u8`.

### إصدار الـtoken من الـBackend

لا تقم بإنشاء التوقيع داخل المتصفح، لأن ذلك سيكشف secret.

هذا مثال باستخدام Node.js:

```ts
import { createHmac } from "node:crypto";

type PlaybackGrant = {
  exp: number;
  prefix: string;
};

export function createPlaybackToken(
  prefix: string,
  ttlSeconds = 60 * 60,
): string {
  const secret = process.env.VIDEO_SIGNING_SECRET;

  if (!secret) {
    throw new Error("VIDEO_SIGNING_SECRET is not configured");
  }

  const normalizedPrefix = prefix.endsWith("/")
    ? prefix
    : `${prefix}/`;

  const grant: PlaybackGrant = {
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
    prefix: normalizedPrefix,
  };

  const payload = Buffer
    .from(JSON.stringify(grant))
    .toString("base64url");

  const signature = createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");

  return `${payload}.${signature}`;
}
```

إنشاء رابط تشغيل:

```ts
const prefix = "courses/course-01/lesson-01/";

const token = createPlaybackToken(prefix, 60 * 60);

const playbackUrl =
  `https://video.example.com/v/${token}/${prefix}index.m3u8`;
```

قبل إصدار الرابط، يجب أن يتحقق الـBackend من أن المستخدم:

- مسجل دخوله.
- اشترى الكورس.
- لديه صلاحية مشاهدة الدرس.
- لم يتم إيقاف حسابه.

بعد ذلك يمنحه token صالحًا لمدة قصيرة، مثل ساعة.

---

## إعداد R2 Binding داخل Worker

ملف `wrangler.jsonc`:

```jsonc
{
  "name": "video-gateway",
  "main": "src/index.ts",
  "compatibility_date": "2026-08-01",

  "r2_buckets": [
    {
      "binding": "VIDEOS",
      "bucket_name": "course-videos"
    }
  ],

  "vars": {
    "ALLOWED_ORIGIN": "https://app.example.com"
  }
}
```

ثم خزّن مفتاح التوقيع كـsecret:

```bash
npx wrangler secret put VIDEO_SIGNING_SECRET
```

لا تضع المفتاح مباشرة داخل `wrangler.jsonc` أو Git repository.

Cloudflare تدعم الوصول المباشر إلى R2 من Worker من خلال bucket binding، ويمكن تمرير Range والـconditional headers إلى عملية القراءة.

[استخدام R2 من داخل Workers](https://developers.cloudflare.com/r2/api/workers/workers-api-usage/)

---

## Worker للتحقق من الـtoken وتقديم الفيديو

```ts
interface Env {
  VIDEOS: R2Bucket;
  VIDEO_SIGNING_SECRET: string;
  ALLOWED_ORIGIN: string;
}

type PlaybackGrant = {
  exp: number;
  prefix: string;
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();

let hmacKeyPromise: Promise<CryptoKey> | undefined;

function decodeBase64Url(value: string): Uint8Array {
  const base64 = value
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const padded = base64.padEnd(
    Math.ceil(base64.length / 4) * 4,
    "=",
  );

  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index++) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

async function verifyToken(
  token: string,
  env: Env,
): Promise<PlaybackGrant | null> {
  const parts = token.split(".");

  if (parts.length !== 2) {
    return null;
  }

  const [payloadPart, signaturePart] = parts;

  if (!payloadPart || !signaturePart) {
    return null;
  }

  hmacKeyPromise ??= crypto.subtle.importKey(
    "raw",
    encoder.encode(env.VIDEO_SIGNING_SECRET),
    {
      name: "HMAC",
      hash: "SHA-256",
    },
    false,
    ["verify"],
  );

  const key = await hmacKeyPromise;

  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    decodeBase64Url(signaturePart),
    encoder.encode(payloadPart),
  );

  if (!valid) {
    return null;
  }

  try {
    const payloadText = decoder.decode(
      decodeBase64Url(payloadPart),
    );

    const grant = JSON.parse(payloadText) as PlaybackGrant;

    if (
      !Number.isInteger(grant.exp) ||
      grant.exp <= Math.floor(Date.now() / 1000) ||
      typeof grant.prefix !== "string" ||
      !grant.prefix.endsWith("/")
    ) {
      return null;
    }

    return grant;
  } catch {
    return null;
  }
}

function createCorsHeaders(env: Env): Headers {
  const headers = new Headers();

  headers.set(
    "Access-Control-Allow-Origin",
    env.ALLOWED_ORIGIN,
  );
  headers.set(
    "Access-Control-Allow-Methods",
    "GET, HEAD, OPTIONS",
  );
  headers.set(
    "Access-Control-Allow-Headers",
    "Range",
  );
  headers.set(
    "Access-Control-Expose-Headers",
    "Content-Length, Content-Range, ETag, Accept-Ranges",
  );
  headers.set("Vary", "Origin");

  return headers;
}

function fallbackContentType(key: string): string {
  if (key.endsWith(".m3u8")) {
    return "application/vnd.apple.mpegurl";
  }

  if (key.endsWith(".m4s")) {
    return "video/iso.segment";
  }

  if (key.endsWith(".mp4")) {
    return "video/mp4";
  }

  if (key.endsWith(".ts")) {
    return "video/mp2t";
  }

  return "application/octet-stream";
}

function hasUnsafePathSegment(key: string): boolean {
  return key
    .split("/")
    .some((part) => part === "." || part === "..");
}

export default {
  async fetch(
    request: Request,
    env: Env,
  ): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: createCorsHeaders(env),
      });
    }

    if (
      request.method !== "GET" &&
      request.method !== "HEAD"
    ) {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: {
          Allow: "GET, HEAD, OPTIONS",
        },
      });
    }

    const url = new URL(request.url);

    const match = url.pathname.match(
      /^\/v\/([^/]+)\/(.+)$/,
    );

    if (!match) {
      return new Response("Not Found", {
        status: 404,
      });
    }

    const token = match[1];

    let objectKey: string;

    try {
      objectKey = decodeURIComponent(match[2]);
    } catch {
      return new Response("Invalid path", {
        status: 400,
      });
    }

    if (hasUnsafePathSegment(objectKey)) {
      return new Response("Invalid path", {
        status: 400,
      });
    }

    const grant = await verifyToken(token, env);

    if (!grant) {
      return new Response("Invalid or expired token", {
        status: 403,
      });
    }

    if (!objectKey.startsWith(grant.prefix)) {
      return new Response("Forbidden", {
        status: 403,
      });
    }

    const headers = createCorsHeaders(env);

    if (request.method === "HEAD") {
      const object = await env.VIDEOS.head(objectKey);

      if (!object) {
        return new Response("Not Found", {
          status: 404,
          headers,
        });
      }

      object.writeHttpMetadata(headers);

      headers.set("ETag", object.httpEtag);
      headers.set("Content-Length", String(object.size));
      headers.set("Accept-Ranges", "bytes");

      if (!headers.has("Content-Type")) {
        headers.set(
          "Content-Type",
          fallbackContentType(objectKey),
        );
      }

      return new Response(null, {
        status: 200,
        headers,
      });
    }

    const object = await env.VIDEOS.get(objectKey, {
      onlyIf: request.headers,
      range: request.headers,
    });

    if (!object) {
      return new Response("Not Found", {
        status: 404,
        headers,
      });
    }

    if (!("body" in object)) {
      return new Response(null, {
        status: 412,
        headers,
      });
    }

    object.writeHttpMetadata(headers);

    headers.set("ETag", object.httpEtag);
    headers.set("Accept-Ranges", "bytes");

    if (!headers.has("Content-Type")) {
      headers.set(
        "Content-Type",
        fallbackContentType(objectKey),
      );
    }

    let status = 200;

    const range = object.range as
      | {
          offset?: number;
          length?: number;
        }
      | undefined;

    if (
      range?.offset !== undefined &&
      range.length !== undefined
    ) {
      const end = range.offset + range.length - 1;

      headers.set(
        "Content-Range",
        `bytes ${range.offset}-${end}/${object.size}`,
      );
      headers.set(
        "Content-Length",
        String(range.length),
      );

      status = 206;
    } else {
      headers.set(
        "Content-Length",
        String(object.size),
      );
    }

    headers.set(
      "Cache-Control",
      objectKey.endsWith(".m3u8")
        ? "private, max-age=60"
        : "private, max-age=3600",
    );

    return new Response(object.body, {
      status,
      headers,
    });
  },
};
```

ثم انشر الـWorker:

```bash
npx wrangler deploy
```

بعد ذلك اربطه بنطاق مثل:

```text
video.example.com
```

---

## تشغيل الفيديو في الواجهة

على Safari يمكن تشغيل HLS بشكل أصلي. وفي المتصفحات التي لا تدعمه مباشرة، يمكن استخدام `hls.js`.

```bash
npm install hls.js
```

ثم:

```ts
import Hls from "hls.js";

export function attachHlsPlayer(
  video: HTMLVideoElement,
  playbackUrl: string,
): Hls | null {
  if (
    video.canPlayType(
      "application/vnd.apple.mpegurl",
    )
  ) {
    video.src = playbackUrl;
    return null;
  }

  if (Hls.isSupported()) {
    const hls = new Hls();

    hls.loadSource(playbackUrl);
    hls.attachMedia(video);

    return hls;
  }

  throw new Error(
    "HLS playback is not supported by this browser",
  );
}
```

الاستخدام:

```ts
const video = document.querySelector<HTMLVideoElement>(
  "#course-player",
);

if (!video) {
  throw new Error("Video element was not found");
}

attachHlsPlayer(video, playbackUrl);
```

وفي HTML:

```html
<video
  id="course-player"
  controls
  playsinline
  preload="metadata"
></video>
```

---

## ماذا عن الـCaching؟

R2 لا يفرض egress fees، لذلك الـcache ليس ضروريًا للوصول إلى حسبة 8.90 دولارات.

لكنه قد يفيد في:

- تقليل قراءات R2.
- تسريع تحميل القطع المتكررة.
- تحسين الأداء للمستخدمين البعيدين.
- تقليل الضغط عند مشاهدة نفس الدرس من عدد كبير من المستخدمين.

يمكن استخدام Workers Cache API، لكن Cloudflare تشترط ربط Worker بـcustom domain أو route حتى يعمل الـCache API فعليًا؛ التخزين المؤقت لن يعمل كما هو متوقع من خلال `workers.dev`.

[مثال استخدام Cache API مع R2](https://developers.cloudflare.com/r2/examples/cache-api/)

مع الروابط الموقعة يجب الحذر: لو استخدمت رابط المستخدم كاملًا كـcache key، فكل token سيولد نسخة cache مختلفة.

الطريقة الأفضل هي:

1. التحقق من الـtoken.
2. استخدام مسار الملف الأصلي فقط كـcache key داخلي.
3. عدم السماح بالوصول إلى الـcache قبل نجاح التحقق.

بهذا تشترك الجلسات المصرح لها في نفس النسخة المخزنة مؤقتًا، بدون جعل الملف عامًا.

---

## لماذا لا نستخدم R2 Presigned URLs مباشرة؟

R2 يدعم presigned URLs، لكنها تعمل مع نطاق S3 API الخاص بـR2، ولا تعمل مع custom domains. Cloudflare تقترح استخدام WAF HMAC validation للوصول الموثق عبر custom domains، وهذه الميزة تتطلب Pro plan أو أعلى.

[توثيق R2 Presigned URLs](https://developers.cloudflare.com/r2/api/s3/presigned-urls/)

استخدام Worker يمنحنا تحكمًا أكبر:

- custom domain.
- tokens مخصصة.
- تحديد مجلد أو درس بعينه.
- CORS.
- Range requests.
- إضافة rate limiting.
- إبطال أو تغيير منطق الصلاحيات.

لكن في المقابل، كل طلب فيديو يمر عبر Worker ويُحسب ضمن طلباته.

---

## هل هذا يحمي الفيديو من السرقة؟

لا توجد طريقة تمنع نسخ الفيديو بالكامل طالما يستطيع المستخدم مشاهدته.

الرابط الموقع يمنع:

- تخمين الروابط.
- الوصول بدون شراء الكورس.
- الـhotlinking البسيط.
- نشر رابط دائم صالح للجميع.
- الوصول إلى بقية مكتبة الفيديو بنفس token.

لكنه لا يمنع مستخدمًا مصرحًا له من:

- مشاركة الرابط قبل انتهاء صلاحيته.
- التقاط الشاشة.
- مراقبة network requests.
- حفظ القطع أثناء تشغيلها.
- استخدام أدوات متقدمة لاستخراج المحتوى.

حتى لو استخدمت AES-128 encryption داخل HLS، يجب أن يحصل المشغل على مفتاح فك التشفير في النهاية.

للحماية الأقوى ستحتاج عادة إلى DRM مثل:

- Widevine.
- FairPlay.
- PlayReady.

وهذا أحد الأسباب التي تجعل Mux أو خدمات الفيديو المتخصصة مناسبة أكثر للمحتوى مرتفع القيمة. Mux، مثلًا، يقدم DRM كإضافة مدفوعة مع رسم شهري وتكلفة لكل license.

[تفاصيل تسعير Mux وDRM](https://www.mux.com/docs/pricing/overview)

---

## ما الذي تحصل عليه مع Mux أو Cloudflare Stream ولا تحصل عليه هنا؟

عند بناء هذا الحل بنفسك، ستصبح مسؤولًا عن:

- معالجة الفيديو.
- التعامل مع الملفات التالفة.
- إعادة المحاولة.
- إدارة queues.
- إنشاء عدة دقات.
- اختيار bitrates مناسبة.
- تخزين الملفات الأصلية.
- إنشاء thumbnails.
- الـcaptions.
- التحليلات.
- قياس startup time والـbuffering.
- حماية المحتوى.
- التوافق مع الأجهزة.
- مراقبة الأخطاء.
- الترحيل مستقبلًا.
- إدارة التكاليف عند النمو.

في Mux أو Cloudflare Stream، معظم هذه الوظائف تأتي جاهزة أو متاحة من خلال API.

لذلك المقارنة ليست:

```text
$393 مقابل $8.90 لنفس المنتج
```

المقارنة الحقيقية هي:

```text
خدمة فيديو متكاملة
مقابل
تخزين وبث منخفض التكلفة تبني طبقاته بنفسك
```

أنت لا تلغي التكلفة بالكامل، بل تنقل جزءًا منها من فاتورة المزود إلى وقت التطوير والتشغيل.

---

## متى يكون هذا الحل مناسبًا؟

هذا التصميم مناسب غالبًا عندما تكون لديك:

- مكتبة كورسات مستقرة.
- فيديوهات ترفع على دفعات، وليس آلاف الفيديوهات يوميًا.
- فريق تقني يستطيع إدارة FFmpeg وWorkers.
- ميزانية تشغيل محدودة.
- محتوى لا يحتاج DRM متقدمًا.
- قدرة على اختبار الفيديو على الأجهزة والمتصفحات المختلفة.
- استعداد لبناء analytics والحماية بنفسك.

وقد لا يكون مناسبًا عندما تكون لديك:

- منصة User-Generated Content.
- عدد كبير من الuploads اليومية.
- بث مباشر.
- محتوى سينمائي يحتاج جودة عالية جدًا.
- متطلبات DRM واتفاقيات توزيع.
- حاجة إلى SLA ودعم مؤسسي.
- فريق صغير لا يريد صيانة video pipeline.
- حاجة إلى analytics متقدمة منذ اليوم الأول.

---

## الخلاصة

نعم، من الممكن تقنيًا بث 10TB من الفيديو شهريًا بتكلفة بنية أساسية تقل عن 10 دولارات.

لكن ذلك لا يعني أنك تستطيع تخزين 10TB مقابل 10 دولارات، ولا يعني أنك تحصل على بديل مطابق لخدمات مثل Mux أو Cloudflare Stream.

الحسبة تعتمد على فصل مراحل النظام:

```text
FFmpeg للمعالجة
Cloudflare R2 للتخزين
Cloudflare Workers للحماية
HLS Player للتشغيل
```

وفي السيناريو الذي استخدمناه:

```text
200 ساعة فيديو
270GB تخزين
3Mbps متوسط bitrate
10TB بث شهري
6-second HLS segments
```

تصبح التكلفة الأساسية:

```text
R2 Storage: $3.90
Workers:     $5.00
R2 Egress:   $0
------------------
Total:       $8.90/month
```

الحل ليس مجانيًا، وليس بسيطًا، وليس مناسبًا للجميع.

لكنه يوضح فكرة مهمة:

> عندما تكون رسوم نقل البيانات هي الجزء الأكبر من فاتورتك، فإن اختيار object storage بدون egress fees يمكن أن يغير اقتصاديات المنتج بالكامل.
