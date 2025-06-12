# 코발트 (Cobalt) - 한국어 미디어 다운로드 서비스

> 당신이 사랑하는 것을 저장하세요

## 📋 프로젝트 개요

이 프로젝트는 원본 [Cobalt](https://github.com/imputnet/cobalt) 프로젝트를 기반으로 한국어 사용자를 위해 커스터마이징된 미디어 다운로드 웹 서비스입니다. 

### 주요 특징

- 🇰🇷 **완전한 한국어 지원**: UI, 오류 메시지, 도움말 모두 한국어
- 🎨 **Modern React UI**: Vite + React로 구현된 현대적인 웹 인터페이스
- ⚡ **고성능**: 최적화된 빌드와 캐싱으로 빠른 로딩
- 📱 **반응형 디자인**: 모바일/태블릿/데스크톱 지원
- 🔧 **커스터마이징**: 한국 사용자에 최적화된 기본 설정

## 🏗️ 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                     Nginx Reverse Proxy                     │
│                  (itsmyzone.iptime.org)                    │
└─────────────────────┬───────────────────────────────────────┘
                      │
    ┌─────────────────┼─────────────────┐
    │                 │                 │
    ▼                 ▼                 ▼
┌─────────┐    ┌─────────────┐    ┌─────────────┐
│ React   │    │ Cobalt API  │    │ YouTube     │
│ Web UI  │    │ Backend     │    │ Session     │
│ /cobalt/│    │ Port 3601   │    │ Port 3602   │
└─────────┘    └─────────────┘    └─────────────┘
```

## 📁 프로젝트 구조

```
cobalt/
├── 📁 vite-frontend/          # React 웹 애플리케이션 (메인)
│   ├── 📁 src/
│   │   ├── App.jsx           # 메인 React 컴포넌트
│   │   ├── App.css           # 스타일시트
│   │   └── main.jsx          # React 진입점
│   ├── 📁 dist/              # 빌드 결과물 (Nginx 서빙)
│   ├── package.json          # 프론트엔드 의존성
│   └── vite.config.js        # Vite 설정
│
├── 📁 api/                   # Cobalt API 백엔드
├── 📁 packages/              # 원본 Cobalt 패키지들
├── 📁 node_modules/          # Node.js 의존성
├── 📁 .git/                  # Git 저장소
├── youtube-session.service   # systemd 서비스 파일
├── package.json              # 루트 패키지 설정
├── .gitignore                # Git 무시 파일
├── LICENSE                   # 라이센스 파일
└── README.md                 # 이 파일
```

## 🚀 서비스 구성

### 1. Frontend (React Web UI)
- **경로**: `/cobalt/`
- **포트**: Nginx를 통해 서빙
- **기술**: Vite + React + Modern CSS
- **빌드**: `npm run build`로 정적 파일 생성

### 2. Backend API
- **경로**: `/cobalt/api/`
- **포트**: 3601
- **서비스**: `cobalt-api.service` (systemd)
- **기능**: 미디어 URL 처리 및 다운로드 링크 생성

### 3. YouTube Session Generator
- **포트**: 3602
- **서비스**: `youtube-session.service` (systemd)
- **기능**: YouTube 다운로드를 위한 세션 관리

## ⚙️ 설치 및 설정

### 시스템 요구사항
- Ubuntu 20.04+ (권장)
- Node.js 18+
- npm 또는 yarn
- Nginx
- systemd

### 설치 과정
1. **의존성 설치**
```bash
cd /home/purestory/cobalt
npm install
```

2. **프론트엔드 빌드**
```bash
cd vite-frontend
npm install
npm run build
```

3. **시스템 서비스 설정**
```bash
sudo cp youtube-session.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable youtube-session.service
sudo systemctl start youtube-session.service
```

4. **Nginx 설정**
- Nginx 설정 파일: `/etc/nginx/sites-enabled/purestory`
- 정적 파일 경로: `/home/purestory/cobalt/vite-frontend/dist/`

## 🔧 개발 및 운영

### 개발 모드 실행
```bash
cd vite-frontend
npm run dev
```

### 프로덕션 빌드
```bash
cd vite-frontend
npm run build
```

### 서비스 관리
```bash
# 서비스 상태 확인
systemctl status cobalt-api
systemctl status youtube-session

# 서비스 재시작
sudo systemctl restart cobalt-api
sudo systemctl restart youtube-session

# Nginx 재시작
sudo systemctl restart nginx
```

### 로그 확인
```bash
# API 로그
journalctl -fu cobalt-api

# YouTube Session 로그
journalctl -fu youtube-session

# Nginx 로그
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

## 🎯 주요 기능

### 지원하는 서비스
- YouTube (4K, 1080p, 720p 등 다양한 해상도)
- TikTok (비디오 + 오디오)
- Instagram (포스트, 릴스)
- Twitter/X (비디오, GIF)
- Facebook
- Reddit
- SoundCloud
- 기타 다양한 플랫폼

### 다운로드 옵션
- **비디오 품질**: 144p ~ 4K (8K)
- **오디오 형식**: MP3, OGG, WAV, OPUS
- **오디오 비트레이트**: 64~320 kbps (기본값: 320 kbps)
- **파일명 스타일**: 클래식, 예쁘게, 기본, 상세
- **특수 옵션**: 오디오만, 비디오만, 메타데이터 제어

## 🔒 보안 및 성능

### 보안 설정
- CORS 정책 적용
- 요청 속도 제한
- 안전한 파일 다운로드

### 성능 최적화
- Nginx 정적 파일 캐싱
- React 코드 스플리팅
- 압축된 자산 서빙

## 🐛 문제 해결

### 일반적인 문제들

1. **API 연결 오류**
   - 서비스 상태 확인: `systemctl status cobalt-api`
   - 포트 확인: `lsof -i :3601`

2. **YouTube 다운로드 실패**
   - YouTube Session 서비스 확인: `systemctl status youtube-session`
   - 포트 확인: `lsof -i :3602`

3. **웹페이지 로딩 안됨**
   - Nginx 상태 확인: `systemctl status nginx`
   - 정적 파일 권한 확인: `ls -la /home/purestory/cobalt/vite-frontend/dist/`

### 디버깅 팁
- 브라우저 개발자 도구 (F12) Network 탭 확인
- API 응답 상태 코드 확인
- 서버 로그 실시간 모니터링

## 📞 지원 및 기여

### 버그 리포트
- 오류 발생 시 브라우저 콘솔 로그와 함께 리포트
- 재현 가능한 단계 명시

### 기능 개선
- UI/UX 개선 아이디어
- 새로운 플랫폼 지원 요청
- 성능 최적화 제안

---

## 📝 변경 이력

### v1.0.0 (2025-01-05)
- ✅ 원본 Cobalt을 React로 완전 재구성
- ✅ 한국어 UI 완성
- ✅ 현대적인 반응형 디자인 적용
- ✅ systemd 서비스 통합
- ✅ Nginx 프록시 설정 완료
- ✅ 고음질 오디오 기본값 (320kbps) 설정

---

**만든이**: purestory  
**라이센스**: Original Cobalt License  
**버전**: 1.0.0  
**최종 업데이트**: 2025-01-05
