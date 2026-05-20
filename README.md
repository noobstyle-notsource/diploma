# ZenGamer - Цахим Спортын P2P Зах Зээл ба Чөлөөт Хөгжүүлэлтийн Платформ
*Дипломын төсөл*

ZenGamer нь цахим спортын тамирчид, дасгалжуулагч болон сонирхогчдыг нэгтгэсэн Монгол төгрөгөөр ажилладаг анхны аюулгүй P2P (Peer-to-Peer) маркетплейс ба чөлөөт үйлчилгээний (Freelance) платформ юм.

## Үндсэн боломжууд (Features)
- **Escrow (Дундын дансны хамгаалалт)**: Модераторын баталгаажуулалтаар тоглоомын аккаунт болон гүйлгээг 100% аюулгүй солилцох систем.
- **Ангилал бүхий маркетплейс**: Boosting, Coaching, Gear, Supplements гэх мэт цахим спорттой холбоотой бүх төрлийн үйлчилгээ, барааг зарах ба худалдан авах.
- **Бодит хугацааны чат**: Худалдан авагч болон борлуулагч хооронд шууд харилцах боломж.
- **Google Gemini AI ухаалаг туслах**: Тоглогчдод тоглоомын зөвлөгөө, стратегийн асуултанд хариулах хиймэл оюуны туслах.

## Технологийн Стек (Tech Stack)
- **Фронтенд**: React.js (Vite), Tailwind CSS, Framer Motion
- **Бэкенд**: Express.js (Node.js) - Serverless дэд бүтэцтэй
- **Өгөгдлийн сан**: NeonDB (Serverless PostgreSQL)
- **Файл хадгалах сан**: Cloudinary
- **Аюулгүй байдал**: JSON Web Tokens (JWT), Bcrypt password hashing

## Локал орчинд ажиллуулах заавар (Local Setup)

### Шаардлагатай програмууд:
- Node.js (v18+)

### 1. Төслийг татаж авах ба хамаарлыг суулгах
```bash
git clone <repository-url>
cd zengamer
npm install
```

### 2. Орчны хувьсагч тохируулах (Environment Variables)
Root хавтас дотор `.env` файл үүсгэн `.env.example` доторх хувьсагчуудыг өөрийн түлхүүрүүдээр солино:
```env
DATABASE_URL="таны_neon_db_холболтын_url"
JWT_SECRET="таны_нууц_түлхүүр"
VITE_GEMINI_KEY="таны_gemini_api_түлхүүр"
CLOUDINARY_CLOUD_NAME="таны_cloudinary_cloud_name"
CLOUDINARY_API_KEY="таны_cloudinary_api_key"
CLOUDINARY_API_SECRET="таны_cloudinary_api_secret"
VITE_GOOGLE_CLIENT_ID="таны_google_oauth_client_id"
```

### 3. Төслийг эхлүүлэх
```bash
# Хөгжүүлэлтийн горимд эхлүүлэх (Frontend & Backend зэрэг ажиллана)
npm run dev
```
Фронтенд нь `http://localhost:3000` хаяг дээр, бэкенд API нь `http://localhost:3002` хаяг дээр тус тус ажиллах болно.
