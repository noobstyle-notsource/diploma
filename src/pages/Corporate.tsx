import React from 'react';
import { motion } from 'motion/react';
import { Shield, Info, HelpCircle, Mail, MapPin, Phone } from 'lucide-react';

const ContentWrapper = ({ children, title, icon: Icon }: any) => (
  <div className="max-w-4xl mx-auto px-6 py-20">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-20"
    >
      <div className="w-20 h-20 bg-primary/10 rounded-[32px] flex items-center justify-center mx-auto mb-8">
        <Icon className="w-10 h-10 text-primary" />
      </div>
      <h1 className="text-headline-xl text-on-surface mb-4 font-display">{title}</h1>
      <div className="h-1.5 w-20 bg-primary mx-auto rounded-full" />
    </motion.div>
    <div className="glass-surface rounded-[48px] p-12 md:p-20 border border-outline-variant/10 shadow-2xl prose prose-invert max-w-none">
      {children}
    </div>
  </div>
);

export const About = () => (
  <ContentWrapper title="Бидний тухай" icon={Info}>
    <h2 className="text-2xl font-display font-bold text-on-surface mb-6">Элит тоглогчдод зориулсан орчин</h2>
    <p className="text-on-surface-variant leading-relaxed mb-8">
      Zen-Gamer нь тоглоомын зах зээл дэх замбараагүй, найдваргүй байдлыг халж, тоглогчдод хамгийн чанартай үйлчилгээ, бүтээгдэхүүнийг найдвартай орчинд хүргэх зорилгоор үүсгэн байгуулагдсан.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-primary">Бидний эрхэм зорилго</h3>
        <p className="text-sm text-on-surface-variant">Өрсөлдөгч тоглогч бүрийг өөрийн ур чадвараа ахиулахад шаардлагатай шилдэг тоноглол болон сургалтаар хангах.</p>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-secondary">Бидний алсын хараа</h3>
        <p className="text-sm text-on-surface-variant">Аливаа гүйлгээ, үйлчилгээ бүр нь баталгаатай, хэрэглэгч бүр нь найдвартай байх дэлхийн жишиг платформ болох.</p>
      </div>
    </div>
  </ContentWrapper>
);

export const Privacy = () => (
  <ContentWrapper title="Нууцлалын бодлого" icon={Shield}>
    <h2 className="text-2xl font-display font-bold text-on-surface mb-6">Таны мэдээлэл, Таны аюулгүй байдал</h2>
    <p className="text-on-surface-variant leading-relaxed mb-8">
      Бид таны хувийн мэдээллийг өндөр түвшинд хамгаалдаг бөгөөд энэхүү бодлого нь таны мэдээллийг хэрхэн боловсруулж, хамгаалдаг болохыг тайлбарлана.
    </p>
    <h3 className="text-lg font-bold text-on-surface mb-4">1. Мэдээлэл цуглуулалт</h3>
    <p className="text-sm text-on-surface-variant mb-6">Бид зөвхөн платформын хэвийн ажиллагаанд шаардлагатай нэвтрэх мэдээлэл, захиалгын түүх болон зурвасын түүх зэрэг мэдээллийг цуглуулдаг.</p>
    <h3 className="text-lg font-bold text-on-surface mb-4">2. Мэдээллийн аюулгүй байдал</h3>
    <p className="text-sm text-on-surface-variant mb-6">Бүх чухал мэдээлэл 256-bit шифрлэлтээр хамгаалагдсан. Таны төлбөрийн мэдээлэл манай серверт хадгалагддаггүй.</p>
  </ContentWrapper>
);

export const Terms = () => (
  <ContentWrapper title="Үйлчилгээний нөхцөл" icon={Shield}>
    <h2 className="text-2xl font-display font-bold text-on-surface mb-6">Хэрэглэгчийн дагаж мөрдөх дүрэм</h2>
    <p className="text-on-surface-variant leading-relaxed mb-8">
      Zen-Gamer платформыг ашигласнаар та манай үйлчилгээний нөхцөлийг хүлээн зөвшөөрч буй хэрэг юм.
    </p>
    <h3 className="text-lg font-bold text-on-surface mb-4">1. Бүртгэлийн үнэн зөв байдал</h3>
    <p className="text-sm text-on-surface-variant mb-6">Борлуулагчид үйлчилгээ болон бүтээгдэхүүнийхээ талаар үнэн зөв мэдээлэл оруулах үүрэгтэй. Зөрчсөн тохиолдолд бүртгэлийг хаах болно.</p>
    <h3 className="text-lg font-bold text-on-surface mb-4">2. Гүйлгээний урсгал</h3>
    <p className="text-sm text-on-surface-variant mb-6">Худалдан авагчийн баталгааг хангах үүднээс бүх гүйлгээ зөвхөн Zen-Gamer платформоор дамжин хийгдэх ёстой.</p>
  </ContentWrapper>
);

export const Support = () => (
  <ContentWrapper title="Тусламж & Холбоо барих" icon={HelpCircle}>
    <h2 className="text-2xl font-display font-bold text-on-surface mb-12 text-center">Бид танд хэрхэн туслах вэ?</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="glass-card rounded-3xl p-8 text-center space-y-4">
        <Mail className="w-8 h-8 text-primary mx-auto" />
        <h3 className="text-sm font-black uppercase tracking-widest text-on-surface">И-мэйл хаяг</h3>
        <p className="text-xs text-on-surface-variant">support@zen-gamer.com</p>
      </div>
      <div className="glass-card rounded-3xl p-8 text-center space-y-4">
        <MapPin className="w-8 h-8 text-primary mx-auto" />
        <h3 className="text-sm font-black uppercase tracking-widest text-on-surface">Хаяг</h3>
        <p className="text-xs text-on-surface-variant">Улаанбаатар, Монгол улс</p>
      </div>
      <div className="glass-card rounded-3xl p-8 text-center space-y-4">
        <Phone className="w-8 h-8 text-primary mx-auto" />
        <h3 className="text-sm font-black uppercase tracking-widest text-on-surface">Утас</h3>
        <p className="text-xs text-on-surface-variant">+976 1234-5678</p>
      </div>
    </div>
    <div className="mt-16 p-10 bg-primary/5 rounded-[32px] border border-primary/20">
      <h3 className="text-lg font-bold text-on-surface mb-6">Хүсэлт илгээх</h3>
      <div className="space-y-6">
        <input type="text" placeholder="Гарчиг" className="w-full bg-background border border-outline-variant/20 rounded-2xl p-4 outline-none focus:border-primary transition-all" />
        <textarea placeholder="Таны асуулт, санал хүсэлт..." rows={4} className="w-full bg-background border border-outline-variant/20 rounded-2xl p-4 outline-none focus:border-primary transition-all" />
        <button className="w-full bg-primary text-on-primary py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:brightness-110 transition-all">Илгээх</button>
      </div>
    </div>
  </ContentWrapper>
);
