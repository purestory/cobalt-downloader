import { useState, useEffect } from 'react'
import './App.css'

const API_URL = '/cobalt/api'

function App() {
  const [url, setUrl] = useState('')
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  const [result, setResult] = useState(null)
  const [supportedServices, setSupportedServices] = useState([])
  const [loading, setLoading] = useState(false)
  
  // 초기 옵션 상태
  const [options, setOptions] = useState({
    downloadMode: 'auto',           // 다운로드 모드
    audioFormat: 'mp3',            // 기본 mp3 선택됨
    audioBitrate: '320',           // 320 kbps (고음질)
    videoQuality: '1080',          // 1080p 선택됨
    youtubeVideoCodec: 'h264',     // H.264 선택됨
    filenameStyle: 'classic',      // 클래식 선택됨
    tiktokFullAudio: false,
    disableMetadata: false,
    twitterGif: true               // 트위터 GIF 체크됨
  })

  // 페이지 로드 시 지원 서비스 가져오기
  useEffect(() => {
    fetchSupportedServices()
  }, [])

  const fetchSupportedServices = async () => {
    try {
      const response = await fetch(`${API_URL}/`)
      const data = await response.json()
      setSupportedServices(data.cobalt?.services || [])
    } catch (error) {
      console.error('서비스 목록을 가져오는데 실패했습니다:', error)
      setSupportedServices(['YouTube', 'Twitter', 'TikTok', 'Instagram', 'Facebook', 'Reddit', 'SoundCloud'])
    }
  }

  const handleOptionChange = (key, value) => {
    setOptions(prevOptions => ({
      ...prevOptions,
      [key]: value
    }))
  }

  const handleSave = async () => {
    if (!url.trim()) {
      alert('URL을 입력해주세요.')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const requestData = {
        url: url,
        audioBitrate: options.audioBitrate,
        audioFormat: options.audioFormat,
        downloadMode: options.downloadMode,
        filenameStyle: options.filenameStyle,
        youtubeVideoCodec: options.youtubeVideoCodec,
        videoQuality: options.videoQuality,
        tiktokFullAudio: options.tiktokFullAudio,
        disableMetadata: options.disableMetadata,
        twitterGif: options.twitterGif
      }

      const response = await fetch(`${API_URL}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
      })

      const data = await response.json()
      
      if (data.status === 'success' || data.status === 'redirect' || data.status === 'tunnel') {
        setResult(data)
      } else {
        setResult({ 
          status: 'error', 
          text: data.text || '다운로드 처리 중 오류가 발생했습니다.' 
        })
      }
    } catch (error) {
      console.error('요청 실패:', error)
      setResult({ 
        status: 'error', 
        text: '서버에 연결할 수 없습니다.' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave()
    }
  }

  const renderOptions = () => {
    const audioOptionsVisible = options.downloadMode === 'auto' || options.downloadMode === 'audio'
    const videoOptionsVisible = options.downloadMode === 'auto' || options.downloadMode === 'mute'

    return (
      <div className="main-options">
        <div className="main-options-grid">
          <div className="option-group">
            <h3>다운로드 모드</h3>
            <select 
              value={options.downloadMode}
              onChange={(e) => handleOptionChange('downloadMode', e.target.value)}
            >
              <option value="auto">자동 감지</option>
              <option value="audio">오디오만</option>
              <option value="mute">비디오만 (음소거)</option>
            </select>
          </div>
          
          {audioOptionsVisible && (
            <>
              <div className="option-group">
                <h3>오디오 형식</h3>
                <select 
                  value={options.audioFormat}
                  onChange={(e) => handleOptionChange('audioFormat', e.target.value)}
                >
                  <option value="best">최상</option>
                  <option value="mp3">MP3</option>
                  <option value="ogg">OGG</option>
                  <option value="wav">WAV</option>
                  <option value="opus">OPUS</option>
                </select>
              </div>
              
              <div className="option-group">
                <h3>오디오 비트레이트</h3>
                <select 
                  value={options.audioBitrate}
                  onChange={(e) => handleOptionChange('audioBitrate', e.target.value)}
                >
                  <option value="320">320 kbps (고음질)</option>
                  <option value="256">256 kbps</option>
                  <option value="128">128 kbps (표준)</option>
                  <option value="96">96 kbps</option>
                  <option value="64">64 kbps (저음질)</option>
                  <option value="8">8 kbps</option>
                </select>
              </div>
            </>
          )}
          
          {videoOptionsVisible && (
            <div className="option-group">
              <h3>비디오 품질</h3>
              <select 
                value={options.videoQuality}
                onChange={(e) => handleOptionChange('videoQuality', e.target.value)}
              >
                <option value="max">최대 해상도</option>
                <option value="4320">4320p (8K)</option>
                <option value="2160">2160p (4K)</option>
                <option value="1440">1440p (2K)</option>
                <option value="1080">1080p (FHD)</option>
                <option value="720">720p (HD)</option>
                <option value="480">480p (SD)</option>
                <option value="360">360p</option>
                <option value="240">240p</option>
                <option value="144">144p</option>
              </select>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderAdvancedOptions = () => {
    if (!showAdvancedOptions) return null

    const videoOptionsVisible = options.downloadMode === 'auto' || options.downloadMode === 'mute'

    return (
      <div className="options-panel">
        <div className="options-grid">
          {videoOptionsVisible && (
            <div className="option-group">
              <h3>비디오 코덱 (유튜브)</h3>
              <select 
                value={options.youtubeVideoCodec}
                onChange={(e) => handleOptionChange('youtubeVideoCodec', e.target.value)}
              >
                <option value="h264">H.264 (호환성 높음)</option>
                <option value="vp9">VP9 (고품질)</option>
                <option value="av1">AV1 (최신)</option>
              </select>
            </div>
          )}
          
          <div className="option-group">
            <h3>파일명 스타일</h3>
            <select 
              value={options.filenameStyle}
              onChange={(e) => handleOptionChange('filenameStyle', e.target.value)}
            >
              <option value="classic">클래식</option>
              <option value="pretty">예쁘게</option>
              <option value="basic">기본</option>
              <option value="nerdy">상세</option>
            </select>
          </div>
        </div>
        
        <div className="option-checkboxes">
          <label>
            <input 
              type="checkbox" 
              checked={options.tiktokFullAudio}
              onChange={(e) => handleOptionChange('tiktokFullAudio', e.target.checked)}
            />
            틱톡 전체 오디오
          </label>
          
          <label>
            <input 
              type="checkbox" 
              checked={options.disableMetadata}
              onChange={(e) => handleOptionChange('disableMetadata', e.target.checked)}
            />
            메타데이터 비활성화
          </label>
          
          <label>
            <input 
              type="checkbox" 
              checked={options.twitterGif}
              onChange={(e) => handleOptionChange('twitterGif', e.target.checked)}
            />
            트위터 GIF 다운로드
          </label>
        </div>
      </div>
    )
  }

  const renderResult = () => {
    if (!result) return null

    if (result.status === 'error') {
      return (
        <div className="error-message">
          <h3>오류 발생</h3>
          <p>{result.text}</p>
        </div>
      )
    }

    if (result.status === 'success' || result.status === 'redirect' || result.status === 'tunnel') {
      return (
        <div className="download-item">
          <div className="download-info">
            <h3>다운로드 준비 완료</h3>
            <p>{result.filename || '파일'}</p>
          </div>
          <div className="download-actions">
            <a 
              href={result.url} 
              download 
              className="download-button"
              target="_blank" 
              rel="noopener noreferrer"
            >
              다운로드
            </a>
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <div className="container">
      <header>
        <h1>코발트</h1>
        <p>당신이 사랑하는 것을 저장하세요</p>
      </header>
      
      <main>
        <div className="search-box">
          <input 
            type="text" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="URL을 입력하세요..."
            disabled={loading}
          />
          <button 
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? '처리중...' : '저장'}
          </button>
          <button 
            className="options-toggle"
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
          >
            {showAdvancedOptions ? '고급 옵션 닫기 ✖' : '고급 옵션 ⚙️'}
          </button>
        </div>
        
        {renderOptions()}
        {renderAdvancedOptions()}
        
        <div className="result-section">
          <h2>결과</h2>
          <div className="result-container">
            {renderResult()}
          </div>
        </div>
        
        <div className="supported-services">
          <h2>지원되는 서비스</h2>
          <div className="services-list">
            {supportedServices.length > 0 ? (
              supportedServices.map((service, index) => (
                <div key={index} className="service-item">
                  {service}
                </div>
              ))
            ) : (
              <p>로딩 중...</p>
            )}
          </div>
        </div>
      </main>
      
      <footer>
        <p>코발트 - 간단한 미디어 다운로드 도구</p>
      </footer>
    </div>
  )
}

export default App
