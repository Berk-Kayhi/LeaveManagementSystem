# Leave Management System

Leave Management System; çalışan izin taleplerini, takım yönetimini, onay akışlarını, rol bazlı panelleri ve anlık bildirimleri yöneten full-stack bir web uygulamasıdır. Proje React tabanlı bir istemci, üç ayrı Node.js servisi, Docker Compose geliştirme ortamı, Kubernetes manifestleri ve otomasyon testleri içerir.

Bu repo yalnızca uygulama kodunu değil; admin, takım lideri ve çalışan rollerini kapsayan unit, integration ve uçtan uca otomasyon senaryolarını da içerir. CI akışı servis testlerini, frontend test/build adımlarını, Docker image üretimini, Selenium lifecycle senaryolarını ve Kubernetes deployment smoke testlerini çalıştıracak şekilde genişletilmiştir.

## Öne Çıkanlar

- Rol bazlı izin yönetimi: admin, takım lideri ve çalışan akışları
- İlk admin kurulumu: boş kullanıcı veritabanında tek seferlik bootstrap ekranı
- Takım ve kullanıcı yönetimi: admin panelinden kullanıcı, takım, lider ve üye atama işlemleri
- İzin lifecycle akışı: talep oluşturma, onaylama, reddetme, geçmiş ve takvim görünümü
- Anlık bildirim altyapısı: Socket.IO ile kullanıcı bazlı bildirim odaları
- Kapsamlı test piramidi: Jest, Vitest, Selenium WebDriver, TestNG ve Allure raporları
- Container ve deployment desteği: Docker Compose, CI image artifact'ları ve Kubernetes manifestleri

## Teknolojiler

- İstemci: React, Vite, TypeScript, Tailwind CSS, FullCalendar, Recharts, Socket.IO Client, Nginx
- Kimlik servisi: Node.js, Express, MongoDB, JWT
- Yönetim servisi: Node.js, Express, PostgreSQL, Sequelize
- Bildirim servisi: Node.js, Express, MongoDB, Socket.IO
- Frontend testleri: Vitest, Testing Library, jsdom
- Backend testleri: Jest, Supertest
- UI test otomasyonu: Selenium WebDriver, ChromeDriver, TestNG, Maven, Allure
- Çalıştırma ve deployment: Docker, Docker Compose, Kubernetes, GitHub Actions

## Proje Yapısı

```text
client/                         React istemcisi
backend/authService/            Kimlik doğrulama, bootstrap ve kullanıcı yönetimi
backend/managementService/      Takım, izin ve PostgreSQL migration yönetimi
backend/socketService/          Bildirim API'si ve Socket.IO bağlantısı
TestAutomation/                 Selenium/TestNG tabanlı UI test otomasyonu
k8s/                            Kubernetes namespace, config, secret, deployment ve statefulset dosyaları
.github/workflows/              Develop/Main CI, Docker image build, Selenium ve Kubernetes akışları
docker-compose.yml              Yerel Docker Compose ortamı
docker-compose.ci.yml           CI image override dosyası
.env.example                    Ortam değişkenleri şablonu
docs/screenshots/               README ekran görüntüleri
```

## Mimari

Uygulama servisleri birbirinden ayrılmıştır:

- `authService`: giriş, çıkış, cookie tabanlı JWT doğrulama, ilk admin oluşturma ve kullanıcı yönetimi endpoint'lerini sağlar.
- `managementService`: izin taleplerini, takım verilerini, onay/red akışlarını ve PostgreSQL modellerini yönetir.
- `socketService`: kalıcı bildirim kayıtlarını ve gerçek zamanlı Socket.IO event'lerini yönetir.
- `client`: React uygulamasını build eder, Nginx ile statik olarak servis eder ve `/api` ile `/socket.io` isteklerini internal backend servislerine proxy'ler. Docker dışı Vite geliştirme modunda `VITE_*` değişkenleriyle backend portlarına doğrudan bağlanabilir.

Yönetim servisi Docker Compose ortamında başlamadan önce `npx sequelize-cli db:migrate` komutunu çalıştırır. Kubernetes ortamında migration işlemi ayrı bir `management-migration` Job'u ile uygulanır.

## Kurulum

Önce ortam değişkenleri dosyasını oluşturun:

```bash
cp .env.example .env
```

`.env` içindeki `JWT_SECRET`, `SOCKET_SERVICE_TOKEN` ve veritabanı parolası gibi değerleri kendi ortamınıza göre değiştirin.

Ardından uygulamayı Docker Compose ile başlatın:

```bash
docker compose up --build
```

Docker Compose ortamında dışarıya yalnızca istemci açılır:

- İstemci: `http://localhost:5173`

Auth, management, socket ve veritabanı servisleri Docker network içinde kalır. Frontend container'ındaki Nginx, `/api/auth`, `/api`, `/api/notifications` ve `/socket.io` isteklerini ilgili backend servislerine yönlendirir.

Verileri sıfırdan başlatmak için container'ları volume'lerle birlikte kapatabilirsiniz:

```bash
docker compose down -v
```

## İlk Kurulum

MongoDB içindeki kullanıcı koleksiyonu boşken uygulama ilk kurulum modunda açılır. Login ekranında geçici bir admin kayıt formu görünür.

Bu form üzerinden ilk admin hesabı oluşturulduğu anda:

- Kullanıcı `admin` rolüyle kaydedilir.
- Oturum otomatik başlatılır.
- `/api/auth/register` endpoint'i artık erişime kapanır.
- Login ekranı normal giriş formuna döner.

İlk admin oluşturulduktan sonra yeni kullanıcılar yalnızca admin panelinden, yetkili admin hesabı ile oluşturulabilir.

## Kullanım

1. `http://localhost:5173` adresini açın.
2. İlk çalıştırmada admin hesabınızı oluşturun.
3. Admin hesabı ile giriş yaptıktan sonra kullanıcı, takım ve izin yönetimi ekranlarını kullanın.
4. Çalışanlar izin talebi oluşturabilir; takım liderleri ve adminler yetkilerine göre talepleri yönetebilir.

## Test Otomasyonu

Proje içinde Selenium WebDriver ve TestNG ile hazırlanmış UI test otomasyonu bulunur. Testler [`TestAutomation`](TestAutomation) klasörü altında tutulur ve gerçek kullanıcı akışlarını uçtan uca doğrular. Otomasyon ChromeDriver kullanır; test hedefi varsayılan olarak uygulama URL'sinden alınır, gerekirse Maven çalıştırırken `-Dapp.url=http://...` ile değiştirilebilir.

Otomasyon kapsamı:

- İlk admin kurulum kontrolü
- Role-based login akışları
- Admin kullanıcı ve takım yönetimi
- Takım lideri ve çalışan izin talebi oluşturma
- Admin ve takım lideri onay/red akışları
- Rol bazlı sayfa turu ve bildirim paneli kontrolü
- Demo veri hazırlama senaryosu

Ana testler:

- `PositiveDemoDataSetupTest`: Demo sunum için admin, takım lideri, iki çalışan, takım ve izin kayıtları oluşturur. Bu test ortamda veri bırakır.
- `PositiveRoleBasedPageTourTest`: Demo hesaplarla admin, takım lideri ve çalışan ekranlarını gezer. Veri oluşturmaz veya silmez.
- `PositiveRoleBasedLeaveLifecycleTest`: Kullanıcı, takım, izin talebi, onay/red ve temizlik adımlarını tek lifecycle senaryosunda doğrular.

Testleri çalıştırmadan önce uygulama servisleri ayağa kalkmış olmalıdır:

```bash
docker compose up --build
```

Testleri çalıştırmak için:

```bash
cd TestAutomation
mvn test
```

Tek bir Selenium senaryosunu çalıştırmak için:

```bash
cd TestAutomation
mvn -Dtest=tests.PositiveRoleBasedLeaveLifecycleTest test
```

Farklı bir uygulama URL'si hedeflemek için:

```bash
cd TestAutomation
mvn -Dapp.url=http://localhost:5173 test
```

## Unit ve Integration Testleri

Backend servisleri Jest ve Supertest ile, frontend ise Vitest ve Testing Library ile test edilir.

```bash
cd backend/authService && npm test
cd backend/managementService && npm test
cd backend/socketService && npm test
cd client && npm test
```

Frontend build kontrolü:

```bash
cd client
npm run build
```

Test kapsamından örnekler:

- Auth Service: bootstrap status, ilk admin kaydı, login/logout, token doğrulama, kullanıcı CRUD ve atama akışları
- Management Service: izin oluşturma, kişisel/takım/yönetici görünümleri, onay/red, takım CRUD ve üye atama akışları
- Socket Service: bildirim listeleme, okundu/silindi işlemleri, servis token ile bildirim oluşturma ve socket event yayını
- Frontend: login, ilk kurulum formu, protected route, dashboard card, date range picker ve izin yardımcı fonksiyonları

### Allure Test Raporu

UI otomasyon testlerinin Allure HTML raporu GitHub Pages üzerinden yayınlanır:

[Canlı Allure Test Raporu](https://berk-kayhi.github.io/LeaveManagementSystem/)

Lokal olarak rapor üretmek için:

```bash
cd TestAutomation
mvn test
allure generate target/allure-results -o target/allure-report --clean
```

## CI/CD

GitHub Actions altında iki workflow bulunur:

- [`develop-ci-test.yml`](.github/workflows/develop-ci-test.yml): `develop` branch'i için auth, management, socket ve frontend testlerini çalıştırır.
- [`main-ci-test.yml`](.github/workflows/main-ci-test.yml): `main` branch'i için tam kalite kapısını çalıştırır.

Main workflow aşamaları:

1. Auth, management ve socket servislerinde `npm ci` + `npm test`
2. Frontend için `npm ci`, `npm test` ve `npm run build`
3. Docker image build ve `lms-docker-images` artifact üretimi
4. Tek Docker Compose ortamı üzerinde Selenium lifecycle, demo data ve page tour testleri
5. Self-hosted runner üzerinde Docker Desktop Kubernetes deployment
6. Kubernetes smoke testleri: client ve frontend üzerinden auth bootstrap endpoint'i
7. Hata durumunda Docker logları, Surefire/Allure çıktıları ve Kubernetes diagnostics artifact'ları

CI ortamında Docker image'ları şu tag'lerle hazırlanır:

```text
lms-client:ci
lms-auth-service:ci
lms-management-service:ci
lms-socket-service:ci
```

## Kubernetes

Kubernetes manifestleri [`k8s`](k8s) klasöründedir ve varsayılan namespace `leave-management` olarak tanımlanmıştır.

Kapsam:

- `ConfigMap`: servis portları, internal servis URL'leri ve MongoDB/PostgreSQL bağlantı ayarları
- `Secret`: `JWT_SECRET`, `SOCKET_SERVICE_TOKEN` ve PostgreSQL parolası
- `StatefulSet`: 3 podlu MongoDB replica set ve tek podlu PostgreSQL kalıcı veritabanları
- `Deployment`: 3 replica client, auth, management ve socket servisleri
- `Job`: MongoDB replica set başlatma ve management service Sequelize migration adımları
- `NodePort`: yalnızca client `30080`; backend servisleri cluster içinde `ClusterIP` olarak kalır

Yerelde Docker Desktop Kubernetes kullanırken önce CI tag'li image'ları hazırlayın:

```bash
docker compose -f docker-compose.yml -f docker-compose.ci.yml build
```

Ardından manifestleri uygulayın:

```bash
kubectl apply -f k8s/namespace.yml
kubectl apply -f k8s/configs/
kubectl apply -f k8s/databases/postgres.yml
kubectl delete service mongodb -n leave-management --ignore-not-found
kubectl apply -f k8s/databases/mongodb.yml
kubectl rollout status statefulset/postgres -n leave-management --timeout=180s
kubectl rollout status statefulset/mongodb -n leave-management --timeout=180s

kubectl delete job mongodb-replica-init -n leave-management --ignore-not-found
kubectl apply -f k8s/databases/mongodb-replica-init-job.yml
kubectl wait --for=condition=complete job/mongodb-replica-init -n leave-management --timeout=180s

kubectl delete job management-migration -n leave-management --ignore-not-found
kubectl apply -f k8s/backend/management-migration-job.yml
kubectl wait --for=condition=complete job/management-migration -n leave-management --timeout=180s

kubectl apply -f k8s/backend/auth-deployment.yml
kubectl apply -f k8s/backend/management-deployment.yml
kubectl apply -f k8s/backend/socket-deployment.yml
kubectl apply -f k8s/client/
```

Durum kontrolü:

```bash
kubectl get all,pvc -n leave-management
```

NodePort adresi:

- Client: `http://localhost:30080`

Backend servislerine dışarıdan doğrudan erişim açılmaz; istekler client servisindeki Nginx proxy üzerinden yönlendirilir.

Kubernetes secret dosyalarındaki örnek değerler canlı ortamda kullanılmadan önce değiştirilmelidir.

## Ekran Görüntüleri

Ekran görüntüleri rol bazlı klasörlerde tutulur. Ortak ekranlar [`docs/screenshots/global`](docs/screenshots/global), admin görünümü [`docs/screenshots/admin`](docs/screenshots/admin), takım lideri görünümü [`docs/screenshots/team_lead`](docs/screenshots/team_lead), çalışan görünümü ise [`docs/screenshots/emplooye`](docs/screenshots/emplooye) klasöründedir.

### Ortak Ekranlar

#### Giriş

![Giriş ekranı](docs/screenshots/global/login.png)

Kullanıcılar e-posta ve şifreleriyle giriş yapar; beni hatırla seçeneğiyle oturum tercihi korunabilir.

#### İlk Kurulum

![İlk kurulum ekranı](docs/screenshots/global/first-run-setup.png)

Veritabanında kullanıcı yokken ilk admin hesabı bu geçici kurulum formu üzerinden oluşturulur.

### Admin Görünümü

#### Anasayfa

![Admin anasayfa görünümü](docs/screenshots/admin/dashboard.png)

Admin; izin taleplerinin onay, red ve bekleyen durumlarını, en çok izin kullanan liderleri, onay bekleyen lider izinlerini, bugün izinde olan liderleri, yaklaşan resmi tatilleri ve yaklaşan izinleri tek ekrandan takip eder.

#### Takvim

![Admin takvim görünümü](docs/screenshots/admin/calendar.png)

Takvim ekranında liderlerin izin kullandığı tarihler ve resmi tatiller görünür. Çalışan izinleri bu admin takvim özetine dahil edilmez.

#### İzin İstekleri

![Admin izin istekleri görünümü](docs/screenshots/admin/leader-leave-requests.png)

Liderlerin oluşturduğu izin talepleri onaylanan, reddedilen ve bekleyen durumlarına göre ayrı kolonlarda listelenir.

![Admin izin talebi detay ekranı](docs/screenshots/admin/leader-leave-detail.png)

Bekleyen lider talebinde izin türü, tarih aralığı, süre, açıklama ve kullanıcının izin özeti görüntülenir; admin talebi bu ekrandan onaylayabilir veya reddedebilir.

#### İstek Geçmişi

![Admin istek geçmişi görünümü](docs/screenshots/admin/request-history.png)

Geçmiş kayıtlar yıl, ay, takım, kullanıcı ve durum filtreleriyle incelenebilir. Liste hem bekleyen hem de sonuçlanmış talepleri kapsar.

![Admin istek geçmişi detay ekranı](docs/screenshots/admin/request-history-detail.png)

Geçmiş talep detayı; kullanıcı bilgilerini, izin türünü, tarih aralığını, süreyi ve talep açıklamasını sade bir özet halinde gösterir.

#### Yönetim

![Admin yönetim paneli görünümü](docs/screenshots/admin/management.png)

Admin bu ekranda kullanıcı oluşturabilir, takım tanımlayabilir, lider atayabilir ve mevcut kullanıcı/takım kayıtlarını takip edebilir.

![Admin kullanıcı detayı görünümü](docs/screenshots/admin/user-detail.png)

Kullanıcı detayında takım bilgisi, rol, izin kullanım durumu, talep geçmişi ve hesap silme aksiyonu yer alır.

![Admin takım detayı görünümü](docs/screenshots/admin/team-detail.png)

Takım detayında lider, çalışan sayısı, ekip üyeleri ve takım yönetimi aksiyonları birlikte gösterilir.

### Takım Lideri Görünümü

#### Anasayfa

![Takım lideri takım görünümü](docs/screenshots/team_lead/team-dashboard.png)

Takım lideri, takımındaki çalışanların izin istatistiklerini, en çok izin kullanan çalışanları, onay bekleyen talepleri, bugün izinde olan çalışanları, yaklaşan resmi tatilleri ve yaklaşan çalışan izinlerini takip eder.

![Takım lideri kişisel görünümü](docs/screenshots/team_lead/personal-dashboard.png)

Kişisel sekmede takım lideri kendi izin hakkını, yaklaşan onaylı izinlerini ve geçmiş izin kayıtlarını görüntüler.

#### Takvim

![Takım lideri takvim görünümü](docs/screenshots/team_lead/calendar.png)

Takvim ekranında takım liderinin kendi izinleri, takımındaki çalışan izinleri ve resmi tatiller birlikte görünür.

#### İzin İstekleri

![Takım lideri izin istekleri görünümü](docs/screenshots/team_lead/leave-requests.png)

Takımdaki çalışanların izin talepleri onaylanan, reddedilen ve bekleyen durumlarına göre ayrılır.

#### İstek Geçmişi

![Takım lideri istek geçmişi görünümü](docs/screenshots/team_lead/request-history.png)

Geçmiş talepler yıl, ay, takım, çalışan ve durum filtreleriyle incelenebilir.

#### İzin Talebi

![Takım lideri izin talebi oluşturma ekranı](docs/screenshots/team_lead/create-leave-request.png)

Takım lideri kendi adına izin türü, açıklama ve tarih aralığı seçerek izin talebi oluşturur; sağ panelde izin özeti ve ekip durumu görünür.

#### Bildirimler

![Takım lideri bildirim görünümü](docs/screenshots/team_lead/notifications.png)

Bildirim panelinde yeni çalışan talepleri ve takım liderinin kendi izin sonucuna ait bildirimler listelenir.

### Çalışan Görünümü

#### Anasayfa

![Çalışan anasayfa görünümü](docs/screenshots/emplooye/personal-dashboard.png)

Çalışan kendi izin hakkını, yaklaşan onaylı izinlerini, resmi tatilleri, ekipte yaklaşan izinleri ve geçmiş izin kayıtlarını görüntüler.

#### Takvim

![Çalışan takvim görünümü](docs/screenshots/emplooye/calendar.png)

Takvim ekranında çalışanın kendi izinleri, ekip izinleri ve resmi tatiller birlikte takip edilir.

#### İzin Talebi

![Çalışan izin talebi oluşturma ekranı](docs/screenshots/emplooye/create-leave-request.png)

Çalışan izin türü, açıklama ve tarih aralığı seçerek yeni izin talebi oluşturur; sağ panelde izin özeti ve seçilen tarihlere göre ekip durumu yer alır.

#### Bildirimler

![Çalışan bildirim görünümü](docs/screenshots/emplooye/notifications.png)

Bildirim panelinde çalışanın izin taleplerine ait onay ve red sonuçları gösterilir.

## Geliştirme Komutları

Docker kullanmadan servisleri ayrı ayrı çalıştırmak isterseniz ilgili dizinlerde bağımlılıkları kurup geliştirme komutlarını çalıştırabilirsiniz:

```bash
cd client && npm install && npm run dev
cd backend/authService && npm install && npm run dev
cd backend/managementService && npm install && npm run dev
cd backend/socketService && npm install && npm run dev
```

Bu yöntemle çalıştırırken `.env` içindeki servis adreslerini yerel adreslere göre güncellemeniz gerekir.

## Lisans

Bu proje özel bir kaynak inceleme lisansı ile sunulur. Kaynak kodları inceleme ve değerlendirme amacıyla görüntülenebilir; değiştirilmiş sürümlerin ticari amaçla kullanımı, dağıtımı veya satışı yasaktır. Ayrıntılar için `LICENSE` dosyasına bakabilirsiniz.
