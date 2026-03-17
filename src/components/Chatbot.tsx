import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, X, Send, Minimize2, User, Phone, Mail, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  from: 'bot' | 'user';
  text: string;
  time: Date;
  options?: QuickOption[];
  isTyping?: boolean;
}

interface QuickOption {
  label: string;
  value: string;
}

// ─── Knowledge Base ───────────────────────────────────────────────────────────
const KB: Record<string, { patterns: string[]; reply: string; options?: QuickOption[] }[]> = {
  en: [
    {
      patterns: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'greetings', 'start'],
      reply: "Hello! 👋 I'm **Alyans**, your personal style assistant at Alyans Perde. I'm here to help you find the perfect curtains for your home.\n\nWhat can I help you with today?",
      options: [
        { label: '🛍️ Browse Collections', value: 'collections' },
        { label: '📦 Shipping Info', value: 'shipping' },
        { label: '↩️ Returns & Exchanges', value: 'returns' },
        { label: '📏 Measuring Guide', value: 'measuring' },
      ],
    },
    {
      patterns: ['collection', 'collections', 'type', 'types', 'category', 'categories', 'what curtains', 'which curtain'],
      reply: "We offer **4 premium collections** 🎨\n\n**1. Sheer Curtains** — Light & airy, perfect for living rooms\n**2. Blackout Curtains** — Total darkness, ideal for bedrooms\n**3. Velvet Drapes** — Rich & luxurious, adds elegance\n**4. Linen & Cotton** — Natural & organic feel\n\nAll collections are available in multiple sizes and colors.",
      options: [
        { label: '💰 Price Range', value: 'price' },
        { label: '📏 Sizing Guide', value: 'measuring' },
        { label: '🛒 Shop Now', value: 'shop' },
      ],
    },
    {
      patterns: ['price', 'cost', 'how much', 'expensive', 'cheap', 'affordable', 'budget'],
      reply: "Our curtains are priced to suit every budget 💛\n\n• **Sheer Curtains** — from $49\n• **Linen & Cotton** — from $69\n• **Blackout Curtains** — from $89\n• **Velvet Drapes** — from $129\n\n✨ Use code **CURTAINS10** for 10% off your first order!",
      options: [
        { label: '🛒 Shop Now', value: 'shop' },
        { label: '📦 Shipping Info', value: 'shipping' },
      ],
    },
    {
      patterns: ['shipping', 'delivery', 'how long', 'when arrive', 'dispatch', 'fast'],
      reply: "📦 **Shipping Information**\n\n• **Free shipping** on orders over $200\n• Standard delivery: **5–7 business days**\n• Express delivery: **2–3 business days**\n• International shipping available\n\nAll orders are tracked and insured 🔒",
      options: [
        { label: '↩️ Return Policy', value: 'returns' },
        { label: '💳 Payment Options', value: 'payment' },
        { label: '📞 Contact Us', value: 'contact' },
      ],
    },
    {
      patterns: ['return', 'returns', 'refund', 'exchange', 'wrong size', 'not happy', 'send back'],
      reply: "↩️ **Returns & Exchanges**\n\nWe offer a **30-day hassle-free return policy**.\n\n✅ Items must be unused and in original packaging\n✅ Free returns on defective items\n✅ Exchange for different size/color available\n✅ Refunds processed within 5–7 business days\n\nNot satisfied? We'll make it right! 💛",
      options: [
        { label: '📞 Contact Support', value: 'contact' },
        { label: '📦 Shipping Info', value: 'shipping' },
      ],
    },
    {
      patterns: ['measure', 'measuring', 'size', 'sizing', 'how to measure', 'dimensions', 'width', 'height', 'length'],
      reply: "📏 **How to Measure Your Windows**\n\n**Width:** Measure the full window width and add 20–30cm on each side for fullness.\n\n**Height:**\n• Floor-length: Measure from rod to floor\n• Sill-length: Measure from rod to sill\n\n**Pro Tip:** Always measure twice! 📐\n\nNeed help? Contact our design team for a free consultation.",
      options: [
        { label: '📞 Get Free Consultation', value: 'contact' },
        { label: '🛒 Shop by Size', value: 'shop' },
      ],
    },
    {
      patterns: ['payment', 'pay', 'credit card', 'visa', 'paypal', 'cash', 'installment', 'how to pay'],
      reply: "💳 **Payment Options**\n\nWe accept all major payment methods:\n\n• 💳 Visa / Mastercard / Amex\n• 🏦 Bank Transfer\n• 📱 PayPal\n• 💰 Cash on Delivery (select regions)\n• 📅 Installment plans available\n\nAll payments are **SSL encrypted** and 100% secure 🔒",
      options: [
        { label: '📦 Shipping Info', value: 'shipping' },
        { label: '🛒 Shop Now', value: 'shop' },
      ],
    },
    {
      patterns: ['custom', 'customise', 'customize', 'bespoke', 'made to measure', 'special order', 'personalize'],
      reply: "✂️ **Custom & Made-to-Measure Curtains**\n\nYes! We offer **fully customized curtains** tailored to your exact specifications:\n\n• Any size — floor to ceiling\n• Choose your fabric, color & lining\n• Custom heading styles (pinch pleat, eyelet, pencil pleat)\n• Lead time: **7–10 business days**\n\nContact our design team for a free quote! 💛",
      options: [
        { label: '📞 Get a Free Quote', value: 'contact' },
        { label: '📏 Measuring Guide', value: 'measuring' },
      ],
    },
    {
      patterns: ['fabric', 'material', 'quality', 'linen', 'velvet', 'cotton', 'silk', 'polyester', 'thread'],
      reply: "🧵 **Our Fabrics & Materials**\n\nAll Alyans Perde curtains are made from **premium-grade fabrics**:\n\n• 🌿 **Linen & Cotton** — breathable, natural, eco-friendly\n• 🪶 **Sheer Voile** — lightweight, diffuses light beautifully\n• 🌙 **Blackout Liner** — blocks 99% of light\n• 👑 **Velvet** — rich texture, excellent insulation\n\nAll fabrics are **machine washable** and fade-resistant.",
      options: [
        { label: '🛒 Shop by Fabric', value: 'shop' },
        { label: '🔧 Care Instructions', value: 'care' },
      ],
    },
    {
      patterns: ['wash', 'clean', 'care', 'washing', 'iron', 'dry clean', 'maintain', 'maintenance'],
      reply: "🧺 **Curtain Care Guide**\n\n• **Sheers & Cotton/Linen:** Machine wash cold, gentle cycle\n• **Velvet Drapes:** Dry clean recommended\n• **Blackout Curtains:** Spot clean or gentle machine wash\n• **All curtains:** Hang while slightly damp to remove wrinkles\n\n⚠️ Avoid tumble drying velvet fabrics.",
      options: [
        { label: '🧵 About Our Fabrics', value: 'fabric' },
        { label: '📞 Ask an Expert', value: 'contact' },
      ],
    },
    {
      patterns: ['discount', 'sale', 'offer', 'coupon', 'promo', 'code', 'deal', 'save', 'off'],
      reply: "🎉 **Current Offers & Discounts**\n\n✨ Use code **CURTAINS10** — 10% off your first order\n🚚 **Free shipping** on orders over $200\n🎁 Buy 3 panels, get 1 **FREE**\n\n💛 Subscribe to our newsletter for exclusive deals and early access to new collections!",
      options: [
        { label: '🛒 Shop with Discount', value: 'shop' },
        { label: '📧 Subscribe Newsletter', value: 'newsletter' },
      ],
    },
    {
      patterns: ['contact', 'reach', 'talk', 'speak', 'human', 'agent', 'support', 'help me', 'phone', 'email', 'whatsapp'],
      reply: "📞 **Contact Alyans Perde**\n\nOur team is ready to help you!\n\n📞 **Phone:** +90 555 123 4567\n📧 **Email:** info@alyansperde.com\n💬 **WhatsApp:** Available 9am–6pm\n🕐 **Hours:** Mon–Sat, 9am–6pm\n\nOr visit our **Contact page** for the full form.",
      options: [
        { label: '💬 Open WhatsApp', value: 'whatsapp' },
        { label: '📧 Send Email', value: 'email' },
        { label: '📄 Go to Contact Page', value: 'contactpage' },
      ],
    },
    {
      patterns: ['shop', 'browse', 'see products', 'view products', 'all products', 'buy'],
      reply: "🛍️ **Ready to shop?**\n\nYou can browse our full collection on the Shop page. We have **12+ premium curtain styles** across 4 collections.\n\nFilter by:\n• Category (Sheer, Blackout, Velvet, Linen)\n• Price range\n• Color & style\n\nEnjoy shopping! 💛",
      options: [
        { label: '💰 View Price Range', value: 'price' },
        { label: '🎉 See Discounts', value: 'discount' },
      ],
    },
    {
      patterns: ['about', 'who are you', 'company', 'brand', 'story', 'history', 'founded'],
      reply: "🏡 **About Alyans Perde**\n\nFounded by **Ariful Islam**, Alyans Perde is a premium curtain brand dedicated to transforming homes with elegance and quality craftsmanship.\n\nWith years of experience in home décor, we combine traditional artistry with modern design to create curtains that are both beautiful and functional.\n\n💛 Our mission: *Every window deserves to be dressed beautifully.*",
      options: [
        { label: '🛒 Explore Collections', value: 'collections' },
        { label: '📞 Contact Us', value: 'contact' },
      ],
    },
    {
      patterns: ['thank', 'thanks', 'thank you', 'great', 'awesome', 'perfect', 'helpful', 'good'],
      reply: "You're so welcome! 😊💛 It's my pleasure to help.\n\nIs there anything else I can assist you with? Whether it's finding the perfect curtain, sizing questions, or placing an order — I'm here!",
      options: [
        { label: '🛒 Continue Shopping', value: 'shop' },
        { label: '📞 Contact Team', value: 'contact' },
      ],
    },
    {
      patterns: ['bye', 'goodbye', 'see you', 'exit', 'close', 'done', 'finished'],
      reply: "Goodbye! 👋 Thank you for choosing **Alyans Perde**. May your windows always look beautiful! ✨\n\nFeel free to return anytime — I'm always here to help. 💛",
      options: [],
    },
    {
      patterns: ['newsletter', 'subscribe', 'email list', 'updates', 'news'],
      reply: "📧 **Newsletter Subscription**\n\nSubscribe to get:\n• 🎉 Exclusive discount codes\n• 🆕 New collection announcements\n• 💡 Interior design tips\n• 🎁 Member-only offers\n\nVisit our Contact page or scroll to the footer to subscribe! 💛",
      options: [
        { label: '🎉 See Current Offers', value: 'discount' },
        { label: '📄 Go to Contact', value: 'contactpage' },
      ],
    },
  ],
  tr: [
    {
      patterns: ['merhaba', 'selam', 'hey', 'iyi günler', 'günaydın', 'başla'],
      reply: "Merhaba! 👋 Ben **Alyans**, Alyans Perde'nin kişisel stil asistanınım. Eviniz için mükemmel perdeyi bulmanıza yardımcı olmak için buradayım.\n\nBugün size nasıl yardımcı olabilirim?",
      options: [
        { label: '🛍️ Koleksiyonları Gör', value: 'collections' },
        { label: '📦 Kargo Bilgisi', value: 'shipping' },
        { label: '↩️ İade & Değişim', value: 'returns' },
        { label: '📏 Ölçüm Rehberi', value: 'measuring' },
      ],
    },
    {
      patterns: ['koleksiyon', 'tür', 'kategori', 'perde çeşit', 'hangi perde'],
      reply: "**4 premium koleksiyonumuz** mevcut 🎨\n\n**1. Tül Perdeler** — Hafif & havadar, oturma odası için ideal\n**2. Blackout Perdeler** — Tam karanlık, yatak odası için mükemmel\n**3. Kadife Drape** — Zengin & lüks, zarafet katar\n**4. Keten & Pamuk** — Doğal & organik his\n\nTüm koleksiyonlar çoklu boyut ve renklerde mevcuttur.",
      options: [
        { label: '💰 Fiyat Aralığı', value: 'price' },
        { label: '🛒 Alışverişe Başla', value: 'shop' },
      ],
    },
    {
      patterns: ['fiyat', 'ne kadar', 'kaç lira', 'ucuz', 'pahalı', 'bütçe'],
      reply: "Perdelerimiz her bütçeye uygun fiyatlarla 💛\n\n• **Tül Perdeler** — 49$'dan başlayan\n• **Keten & Pamuk** — 69$'dan başlayan\n• **Blackout Perdeler** — 89$'dan başlayan\n• **Kadife Drape** — 129$'dan başlayan\n\n✨ İlk siparişinizde **CURTAINS10** kodu ile %10 indirim!",
      options: [
        { label: '🛒 Alışverişe Git', value: 'shop' },
      ],
    },
    {
      patterns: ['kargo', 'teslimat', 'ne zaman gelir', 'hızlı', 'gönderim'],
      reply: "📦 **Kargo Bilgileri**\n\n• 200$ üzeri siparişlerde **ücretsiz kargo**\n• Standart teslimat: **5–7 iş günü**\n• Hızlı teslimat: **2–3 iş günü**\n• Uluslararası gönderim mevcut\n\nTüm siparişler takip numarası ile gönderilir 🔒",
      options: [
        { label: '↩️ İade Politikası', value: 'returns' },
        { label: '📞 Bize Ulaşın', value: 'contact' },
      ],
    },
    {
      patterns: ['iade', 'değişim', 'geri gönder', 'memnun değil', 'yanlış beden'],
      reply: "↩️ **İade & Değişim**\n\n**30 günlük koşulsuz iade** politikamız mevcuttur.\n\n✅ Ürünler kullanılmamış ve orijinal ambalajında olmalı\n✅ Hasarlı ürünlerde ücretsiz iade\n✅ Farklı beden/renk değişimi mümkün\n✅ İadeler 5–7 iş günü içinde işlenir",
      options: [
        { label: '📞 Destek Alın', value: 'contact' },
      ],
    },
    {
      patterns: ['ölçü', 'boyut', 'nasıl ölçülür', 'beden', 'uzunluk', 'genişlik'],
      reply: "📏 **Pencere Ölçümü Nasıl Yapılır?**\n\n**Genişlik:** Pencere genişliğini ölçün ve dolgunluk için her iki tarafa 20–30 cm ekleyin.\n\n**Uzunluk:**\n• Zemine kadar: Kuştan zemine ölçün\n• Pencere kasasına kadar: Kuştan kasaya ölçün\n\n**Profesyonel İpucu:** Her zaman iki kez ölçün! 📐",
      options: [
        { label: '📞 Ücretsiz Danışmanlık', value: 'contact' },
        { label: '🛒 Alışverişe Git', value: 'shop' },
      ],
    },
    {
      patterns: ['iletişim', 'ulaş', 'konuş', 'insan', 'destek', 'yardım', 'telefon', 'whatsapp'],
      reply: "📞 **Alyans Perde İletişim**\n\n📞 **Telefon:** +90 555 123 4567\n📧 **E-posta:** info@alyansperde.com\n💬 **WhatsApp:** 09:00–18:00 arası\n🕐 **Çalışma Saatleri:** Pzt–Cmt, 09:00–18:00",
      options: [
        { label: '💬 WhatsApp Aç', value: 'whatsapp' },
        { label: '📄 İletişim Sayfası', value: 'contactpage' },
      ],
    },
    {
      patterns: ['teşekkür', 'sağ ol', 'harika', 'mükemmel', 'güzel'],
      reply: "Rica ederim! 😊💛 Yardımcı olabildiğim için mutluyum.\n\nBaşka bir konuda yardım edebilir miyim?",
      options: [
        { label: '🛒 Alışverişe Devam', value: 'shop' },
      ],
    },
  ],
  ar: [
    {
      patterns: ['مرحبا', 'السلام', 'أهلا', 'هاي', 'ابدأ', 'مساء الخير', 'صباح الخير'],
      reply: "مرحباً! 👋 أنا **الیانس**، مساعدك الشخصي في Alyans Perde. أنا هنا لمساعدتك في إيجاد الستائر المثالية لمنزلك.\n\nكيف يمكنني مساعدتك اليوم؟",
      options: [
        { label: '🛍️ تصفح المجموعات', value: 'collections' },
        { label: '📦 معلومات الشحن', value: 'shipping' },
        { label: '↩️ الإرجاع والاستبدال', value: 'returns' },
        { label: '📏 دليل القياسات', value: 'measuring' },
      ],
    },
    {
      patterns: ['مجموعة', 'أنواع', 'تشكيلة', 'فئات', 'أي ستائر', 'الستائر'],
      reply: "نقدم **4 مجموعات فاخرة** 🎨\n\n**1. الستائر الشفافة** — خفيفة وهوائية، مثالية لغرفة المعيشة\n**2. ستائر البلاك آوت** — تحجب الضوء تمامًا، مثالية للغرف\n**3. ستائر المخمل** — فاخرة وأنيقة\n**4. الكتان والقطن** — طبيعية وعضوية\n\nجميع المجموعات متاحة بأحجام وألوان متعددة.",
      options: [
        { label: '💰 نطاق الأسعار', value: 'price' },
        { label: '🛒 تسوق الآن', value: 'shop' },
      ],
    },
    {
      patterns: ['سعر', 'كم يكلف', 'غالي', 'رخيص', 'ميزانية', 'تكلفة'],
      reply: "ستائرنا بأسعار تناسب كل ميزانية 💛\n\n• **الستائر الشفافة** — تبدأ من $49\n• **الكتان والقطن** — تبدأ من $69\n• **ستائر البلاك آوت** — تبدأ من $89\n• **ستائر المخمل** — تبدأ من $129\n\n✨ استخدم كود **CURTAINS10** للحصول على خصم 10%!",
      options: [
        { label: '🛒 تسوق الآن', value: 'shop' },
      ],
    },
    {
      patterns: ['شحن', 'توصيل', 'كم يستغرق', 'متى يصل'],
      reply: "📦 **معلومات الشحن**\n\n• **شحن مجاني** على الطلبات فوق $200\n• التوصيل العادي: **5–7 أيام عمل**\n• التوصيل السريع: **2–3 أيام عمل**\n• الشحن الدولي متاح\n\nجميع الطلبات مؤمنة وتُتبع 🔒",
      options: [
        { label: '↩️ سياسة الإرجاع', value: 'returns' },
        { label: '📞 تواصل معنا', value: 'contact' },
      ],
    },
    {
      patterns: ['إرجاع', 'استبدال', 'راجع', 'مش راضي', 'مقاس غلط'],
      reply: "↩️ **الإرجاع والاستبدال**\n\nنقدم **سياسة إرجاع مدتها 30 يومًا** بدون شروط مجحفة.\n\n✅ يجب أن تكون المنتجات غير مستخدمة وفي عبوتها الأصلية\n✅ إرجاع مجاني للمنتجات المعيبة\n✅ يمكن الاستبدال بمقاس أو لون مختلف\n✅ تُعالج المبالغ المستردة خلال 5–7 أيام عمل",
      options: [
        { label: '📞 تواصل مع الدعم', value: 'contact' },
      ],
    },
    {
      patterns: ['قياس', 'مقاس', 'كيف أقيس', 'أبعاد', 'طول', 'عرض'],
      reply: "📏 **كيفية قياس نوافذك**\n\n**العرض:** قس العرض الكامل للنافذة وأضف 20–30 سم على كل جانب.\n\n**الطول:**\n• حتى الأرضية: قس من القضيب إلى الأرض\n• حتى حافة النافذة: قس من القضيب إلى الحافة\n\n**نصيحة:** قس مرتين دائماً! 📐",
      options: [
        { label: '📞 استشارة مجانية', value: 'contact' },
        { label: '🛒 تسوق الآن', value: 'shop' },
      ],
    },
    {
      patterns: ['تواصل', 'اتصال', 'كلم', 'مساعدة', 'هاتف', 'واتساب', 'إيميل'],
      reply: "📞 **تواصل مع Alyans Perde**\n\n📞 **الهاتف:** +90 555 123 4567\n📧 **البريد الإلكتروني:** info@alyansperde.com\n💬 **واتساب:** متاح 9ص–6م\n🕐 **ساعات العمل:** الاثنين–السبت، 9ص–6م",
      options: [
        { label: '💬 فتح واتساب', value: 'whatsapp' },
        { label: '📄 صفحة التواصل', value: 'contactpage' },
      ],
    },
    {
      patterns: ['شكرا', 'شكراً', 'ممتاز', 'رائع', 'جيد', 'مفيد'],
      reply: "على الرحب والسعة! 😊💛 يسعدني مساعدتك.\n\nهل هناك أي شيء آخر يمكنني مساعدتك به؟",
      options: [
        { label: '🛒 مواصلة التسوق', value: 'shop' },
      ],
    },
  ],
};

// ─── AI Response Engine ────────────────────────────────────────────────────────
function getBotResponse(
  input: string,
  lang: string
): { text: string; options?: QuickOption[]; action?: string } {
  const lower = input.toLowerCase().trim();
  const kb = KB[lang as keyof typeof KB] || KB.en;

  // Check quick option actions first
  const actionMap: Record<string, { text: string; options?: QuickOption[]; action?: string }> = {
    collections: {
      text: (KB[lang as keyof typeof KB] || KB.en).find(e => e.patterns.includes('collection') || e.patterns.includes('koleksiyon') || e.patterns.includes('مجموعة'))?.reply || KB.en[1].reply,
      options: (KB[lang as keyof typeof KB] || KB.en).find(e => e.patterns.includes('collection') || e.patterns.includes('koleksiyon') || e.patterns.includes('مجموعة'))?.options,
    },
    shipping: {
      text: (KB[lang as keyof typeof KB] || KB.en).find(e => e.patterns.includes('shipping') || e.patterns.includes('kargo') || e.patterns.includes('شحن'))?.reply || KB.en[3].reply,
      options: (KB[lang as keyof typeof KB] || KB.en).find(e => e.patterns.includes('shipping') || e.patterns.includes('kargo') || e.patterns.includes('شحن'))?.options,
    },
    returns: {
      text: (KB[lang as keyof typeof KB] || KB.en).find(e => e.patterns.includes('return') || e.patterns.includes('iade') || e.patterns.includes('إرجاع'))?.reply || KB.en[4].reply,
      options: (KB[lang as keyof typeof KB] || KB.en).find(e => e.patterns.includes('return') || e.patterns.includes('iade') || e.patterns.includes('إرجاع'))?.options,
    },
    measuring: {
      text: (KB[lang as keyof typeof KB] || KB.en).find(e => e.patterns.includes('measure') || e.patterns.includes('ölçü') || e.patterns.includes('قياس'))?.reply || KB.en[5].reply,
      options: (KB[lang as keyof typeof KB] || KB.en).find(e => e.patterns.includes('measure') || e.patterns.includes('ölçü') || e.patterns.includes('قياس'))?.options,
    },
    price: {
      text: (KB[lang as keyof typeof KB] || KB.en).find(e => e.patterns.includes('price') || e.patterns.includes('fiyat') || e.patterns.includes('سعر'))?.reply || KB.en[2].reply,
      options: (KB[lang as keyof typeof KB] || KB.en).find(e => e.patterns.includes('price') || e.patterns.includes('fiyat') || e.patterns.includes('سعر'))?.options,
    },
    contact: {
      text: (KB[lang as keyof typeof KB] || KB.en).find(e => e.patterns.includes('contact') || e.patterns.includes('iletişim') || e.patterns.includes('تواصل'))?.reply || KB.en[11].reply,
      options: (KB[lang as keyof typeof KB] || KB.en).find(e => e.patterns.includes('contact') || e.patterns.includes('iletişim') || e.patterns.includes('تواصل'))?.options,
    },
    shop: { text: '🛒 Taking you to our Shop...', action: 'navigate:/shop' },
    whatsapp: { text: '💬 Opening WhatsApp...', action: 'open:https://wa.me/905551234567' },
    email: { text: '📧 Opening email...', action: 'open:mailto:info@alyansperde.com' },
    contactpage: { text: '📄 Taking you to the Contact page...', action: 'navigate:/contact' },
    discount: {
      text: (KB[lang as keyof typeof KB] || KB.en).find(e => e.patterns.includes('discount') || e.patterns.includes('تخفيضات'))?.reply || KB.en[10].reply,
      options: (KB[lang as keyof typeof KB] || KB.en).find(e => e.patterns.includes('discount') || e.patterns.includes('تخفيضات'))?.options,
    },
    fabric: {
      text: KB.en.find(e => e.patterns.includes('fabric'))?.reply || '',
      options: KB.en.find(e => e.patterns.includes('fabric'))?.options,
    },
    care: {
      text: KB.en.find(e => e.patterns.includes('wash'))?.reply || '',
      options: KB.en.find(e => e.patterns.includes('wash'))?.options,
    },
    newsletter: {
      text: KB.en.find(e => e.patterns.includes('newsletter'))?.reply || '',
      options: KB.en.find(e => e.patterns.includes('newsletter'))?.options,
    },
  };

  if (actionMap[lower]) return actionMap[lower];

  // Pattern matching
  for (const entry of kb) {
    if (entry.patterns.some(p => lower.includes(p))) {
      return { text: entry.reply, options: entry.options };
    }
  }

  // Fallback
  const fallbacks: Record<string, string> = {
    en: "I'm sorry, I didn't quite catch that 🤔\n\nCould you rephrase your question? Or choose one of the options below:",
    tr: "Üzgünüm, tam anlayamadım 🤔\n\nSorunuzu yeniden ifade edebilir misiniz?",
    ar: "عذرًا، لم أفهم سؤالك تمامًا 🤔\n\nهل يمكنك إعادة صياغة سؤالك؟",
  };

  return {
    text: fallbacks[lang] || fallbacks.en,
    options: [
      { label: '🛍️ Collections', value: 'collections' },
      { label: '📦 Shipping', value: 'shipping' },
      { label: '💰 Prices', value: 'price' },
      { label: '📞 Contact', value: 'contact' },
    ],
  };
}

// ─── Format Bot Text (bold, line breaks) ──────────────────────────────────────
function formatText(text: string) {
  const parts = text.split('\n');
  return parts.map((line, i) => {
    const formatted = line.split(/\*\*(.+?)\*\*/g).map((chunk, j) =>
      j % 2 === 1 ? <strong key={j} className="font-semibold">{chunk}</strong> : chunk
    );
    return <span key={i}>{formatted}{i < parts.length - 1 && <br />}</span>;
  });
}

// ─── Main Chatbot Component ────────────────────────────────────────────────────
const Chatbot: React.FC = () => {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Welcome messages per language
  const welcomeMessages: Record<string, string> = {
    en: "Hi! 👋 I'm **Alyans**, your personal assistant at **Alyans Perde**.\n\nNeed help choosing the perfect curtains for your home? Ask me anything! 💛",
    tr: "Merhaba! 👋 Ben **Alyans**, Alyans Perde'nin kişisel asistanıyım.\n\nMükemmel perdeyi bulmak için yardıma mı ihtiyacınız var? Her şeyi sorabilirsiniz! 💛",
    ar: "مرحباً! 👋 أنا **الیانس**، مساعدك الشخصي في **Alyans Perde**.\n\nهل تحتاج مساعدة في اختيار الستائر المثالية؟ اسألني أي شيء! 💛",
  };

  const welcomeOptions: Record<string, QuickOption[]> = {
    en: [
      { label: '🛍️ Browse Collections', value: 'collections' },
      { label: '💰 View Prices', value: 'price' },
      { label: '📦 Shipping Info', value: 'shipping' },
      { label: '📏 Measuring Guide', value: 'measuring' },
    ],
    tr: [
      { label: '🛍️ Koleksiyonlar', value: 'collections' },
      { label: '💰 Fiyatlar', value: 'price' },
      { label: '📦 Kargo Bilgisi', value: 'shipping' },
      { label: '📏 Ölçüm Rehberi', value: 'measuring' },
    ],
    ar: [
      { label: '🛍️ تصفح المجموعات', value: 'collections' },
      { label: '💰 الأسعار', value: 'price' },
      { label: '📦 معلومات الشحن', value: 'shipping' },
      { label: '📏 دليل القياسات', value: 'measuring' },
    ],
  };

  // Initialize with welcome message
  useEffect(() => {
    const welcome: Message = {
      id: 'welcome',
      from: 'bot',
      text: welcomeMessages[lang] || welcomeMessages.en,
      time: new Date(),
      options: welcomeOptions[lang] || welcomeOptions.en,
    };
    setMessages([welcome]);
  }, [lang]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

  // Show hint on hover after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setHasOpened(true);
    setUnreadCount(0);
    setShowHint(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    setIsOpen(false);
  };

  const addMessage = (msg: Message) => {
    setMessages(prev => [...prev, msg]);
  };

  const handleSend = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      from: 'user',
      text: text.trim(),
      time: new Date(),
    };
    addMessage(userMsg);
    setInput('');
    setIsTyping(true);

    // Simulate thinking delay
    const delay = 600 + Math.random() * 800;
    await new Promise(r => setTimeout(r, delay));

    setIsTyping(false);

    const response = getBotResponse(text.trim(), lang);

    // Handle actions (navigate / open URL)
    if (response.action) {
      const [type, target] = response.action.split(':');
      if (type === 'navigate') {
        window.location.href = target;
      } else if (type === 'open') {
        window.open(response.action.replace('open:', ''), '_blank');
      }
    }

    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      from: 'bot',
      text: response.text,
      time: new Date(),
      options: response.options,
    };
    addMessage(botMsg);

    if (!isOpen) setUnreadCount(c => c + 1);
  }, [lang, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  const handleOption = (opt: QuickOption) => {
    handleSend(opt.value);
  };

  const chatPlaceholder: Record<string, string> = {
    en: 'Type your message...',
    tr: 'Mesajınızı yazın...',
    ar: 'اكتب رسالتك...',
  };

  const chatTitle: Record<string, string> = {
    en: 'Alyans Assistant',
    tr: 'Alyans Asistan',
    ar: 'مساعد الیانس',
  };

  const chatSubtitle: Record<string, string> = {
    en: 'Online · Usually replies instantly',
    tr: 'Çevrimiçi · Anında yanıt verir',
    ar: 'متصل · يرد فورًا عادةً',
  };

  const isRtl = lang === 'ar';

  return (
    <>
      {/* ── Chat Window ───────────────────────────────── */}
      <div
        className={`fixed bottom-24 right-4 z-50 transition-all duration-500 ${
          isOpen && !isMinimized
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
        }`}
        style={{ width: '360px', maxWidth: 'calc(100vw - 2rem)' }}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <div
          className="flex flex-col rounded-2xl overflow-hidden"
          style={{
            height: '520px',
            maxHeight: 'calc(100vh - 120px)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2), 0 0 0 1px rgba(201,168,76,0.15)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' }}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-black font-bold text-sm"
                  style={{ background: 'linear-gradient(135deg, #c9a84c, #e8d48b)' }}
                >
                  A
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm leading-none mb-1">
                  {chatTitle[lang] || chatTitle.en}
                </p>
                <p className="text-green-400 text-xs">{chatSubtitle[lang] || chatSubtitle.en}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleMinimize}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <Minimize2 size={14} />
              </button>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
            style={{ background: '#fafaf8', scrollbarWidth: 'thin' }}
          >
            {messages.map(msg => (
              <div key={msg.id}>
                <div className={`flex items-end gap-2 ${msg.from === 'user' ? (isRtl ? 'flex-row-reverse justify-start' : 'flex-row-reverse') : 'flex-row'}`}>
                  {/* Avatar */}
                  {msg.from === 'bot' && (
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-black text-xs font-bold flex-shrink-0 mb-1"
                      style={{ background: 'linear-gradient(135deg, #c9a84c, #e8d48b)' }}
                    >
                      A
                    </div>
                  )}
                  {msg.from === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-stone-200 flex items-center justify-center flex-shrink-0 mb-1">
                      <User size={14} className="text-stone-600" />
                    </div>
                  )}

                  {/* Bubble */}
                  <div
                    className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.from === 'user'
                        ? 'text-white rounded-br-sm'
                        : 'text-stone-800 rounded-bl-sm border border-stone-100'
                    }`}
                    style={
                      msg.from === 'user'
                        ? { background: 'linear-gradient(135deg, #c9a84c, #b8973b)' }
                        : { background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }
                    }
                  >
                    {formatText(msg.text)}
                    <p className={`text-xs mt-1 opacity-50 ${msg.from === 'user' ? 'text-right' : 'text-left'}`}>
                      {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                {/* Quick Options */}
                {msg.from === 'bot' && msg.options && msg.options.length > 0 && (
                  <div className={`flex flex-wrap gap-1.5 mt-2 ${isRtl ? 'justify-end' : 'justify-start'} pl-9`}>
                    {msg.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleOption(opt)}
                        className="text-xs px-3 py-1.5 rounded-full border font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                        style={{
                          borderColor: '#c9a84c',
                          color: '#b8973b',
                          background: '#fffdf5',
                        }}
                        onMouseEnter={e => {
                          (e.target as HTMLButtonElement).style.background = '#c9a84c';
                          (e.target as HTMLButtonElement).style.color = '#1a1a1a';
                        }}
                        onMouseLeave={e => {
                          (e.target as HTMLButtonElement).style.background = '#fffdf5';
                          (e.target as HTMLButtonElement).style.color = '#b8973b';
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-end gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-black text-xs font-bold flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #c9a84c, #e8d48b)' }}
                >
                  A
                </div>
                <div
                  className="px-4 py-3 rounded-2xl rounded-bl-sm border border-stone-100"
                  style={{ background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
                >
                  <div className="flex gap-1 items-center">
                    {[0, 1, 2].map(i => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full"
                        style={{
                          background: '#c9a84c',
                          animation: 'bounce 1.2s infinite',
                          animationDelay: `${i * 0.2}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Bar */}
          <div
            className="flex items-center gap-2 px-4 py-2 border-t border-stone-100 flex-shrink-0"
            style={{ background: '#fff' }}
          >
            <a
              href="https://wa.me/905551234567"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 font-medium transition-colors"
              title="WhatsApp"
            >
              <Phone size={12} />
              <span>WhatsApp</span>
            </a>
            <span className="text-stone-300 text-xs">|</span>
            <a
              href="mailto:info@alyansperde.com"
              className="flex items-center gap-1 text-xs text-stone-400 hover:text-stone-600 transition-colors"
              title="Email"
            >
              <Mail size={12} />
              <span>Email</span>
            </a>
            <span className="text-stone-300 text-xs">|</span>
            <a
              href="/contact"
              className="flex items-center gap-1 text-xs text-stone-400 hover:text-stone-600 transition-colors"
            >
              <ExternalLink size={12} />
              <span>Contact</span>
            </a>
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 px-3 py-3 border-t border-stone-100 flex-shrink-0"
            style={{ background: '#ffffff' }}
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={chatPlaceholder[lang] || chatPlaceholder.en}
              className="flex-1 text-sm bg-stone-50 border border-stone-200 rounded-full px-4 py-2.5 outline-none focus:border-yellow-500 transition-colors placeholder-stone-400"
              style={{ fontFamily: isRtl ? 'inherit' : undefined }}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #c9a84c, #e8d48b)' }}
            >
              <Send size={15} className={`text-black ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          </form>
        </div>
      </div>

      {/* ── Floating Button ───────────────────────────── */}
      <div className="fixed bottom-6 right-4 z-50 flex flex-col items-end gap-2">
        {/* Hint tooltip */}
        {showHint && !isOpen && !hasOpened && (
          <div
            className="bg-stone-900 text-white text-xs px-3 py-2 rounded-xl shadow-lg animate-bounce-subtle whitespace-nowrap"
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}
          >
            💬 {lang === 'tr' ? 'Yardıma ihtiyacınız var mı?' : lang === 'ar' ? 'هل تحتاج مساعدة؟' : 'Need help? Chat with us!'}
            <div className="absolute -bottom-1.5 right-5 w-3 h-3 bg-stone-900 rotate-45" />
          </div>
        )}

        {/* Button */}
        <button
          onClick={isOpen ? handleClose : handleOpen}
          className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group"
          style={{
            background: isOpen
              ? '#1a1a1a'
              : 'linear-gradient(135deg, #c9a84c 0%, #e8d48b 50%, #c9a84c 100%)',
            boxShadow: isOpen
              ? '0 8px 30px rgba(0,0,0,0.3)'
              : '0 8px 30px rgba(201,168,76,0.5), 0 0 0 0 rgba(201,168,76,0.4)',
            animation: !isOpen && !hasOpened ? 'pulse-gold 2s infinite' : 'none',
          }}
          aria-label="Open chat"
        >
          <div
            className="transition-all duration-300"
            style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
          >
            {isOpen
              ? <X size={22} className="text-white" />
              : <MessageCircle size={22} className="text-stone-900" />
            }
          </div>

          {/* Unread badge */}
          {!isOpen && unreadCount > 0 && (
            <div
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ animation: 'pop 0.3s ease' }}
            >
              {unreadCount}
            </div>
          )}

          {/* Ripple ring */}
          {!isOpen && !hasOpened && (
            <div
              className="absolute inset-0 rounded-full"
              style={{
                animation: 'ripple 2s infinite',
                border: '2px solid rgba(201,168,76,0.6)',
              }}
            />
          )}
        </button>
      </div>

      {/* ── CSS Animations ─────────────────────────────── */}
      <style>{`
        @keyframes pulse-gold {
          0%, 100% { box-shadow: 0 8px 30px rgba(201,168,76,0.5), 0 0 0 0 rgba(201,168,76,0.4); }
          50% { box-shadow: 0 8px 30px rgba(201,168,76,0.7), 0 0 0 12px rgba(201,168,76,0); }
        }
        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes pop {
          0% { transform: scale(0); }
          70% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        .animate-bounce-subtle {
          animation: subtle-bounce 2s ease-in-out infinite;
        }
        @keyframes subtle-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </>
  );
};

export default Chatbot;
