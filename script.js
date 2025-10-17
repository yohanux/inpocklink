// 인포크 통계 대시보드 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 전역 변수
    let currentTab = 'summary';
    let currentDate = 'today';
    
    // DOM 요소들
    const layout = document.querySelector('.layout');
    const tabs = document.querySelectorAll('.tab');
    const dropdowns = document.querySelectorAll('.dropdown');
    const navItems = document.querySelectorAll('.nav-item, .mobile-nav-item');
    
    // 초기화
    init();
    
    function init() {
        // 반응형 레이아웃 설정
        setupResponsiveLayout();
        
        // 오버레이 토글 설정
        setupOverlayToggle();
        
        // 실시간 시각 업데이트
        updateRealTime();
        setInterval(updateRealTime, 1000); // 1초마다 업데이트
        
        // 이벤트 리스너 등록
        setupEventListeners();
        
        // 링크 페이지 실시간 텍스트 반영 설정
        setupLinkPageRealtimeUpdate();
        
        // 초기 데이터 로드
        loadInitialData();
    }
    
    // 반응형 레이아웃 설정 (현재는 CSS로 처리됨)
    function setupResponsiveLayout() {
        console.log('Responsive layout handled by CSS media queries');
    }
    
    // 이벤트 리스너 설정
    function setupEventListeners() {
        // 탭 클릭 이벤트
        tabs.forEach(tab => {
            tab.addEventListener('click', function(e) {
                e.preventDefault(); // 기본 동작 방지
                const tabType = this.textContent.trim();
                switchTab(tabType);
                this.blur(); // 클릭 후 포커스 제거
            });
        });
        
        // 드롭다운 클릭 이벤트
        dropdowns.forEach(dropdown => {
            dropdown.addEventListener('click', function() {
                toggleDropdown(this);
            });
        });
        
        // 네비게이션 아이템 클릭 이벤트
        navItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const navType = this.querySelector('span').textContent.trim();
                navigateToPage(navType);
            });
        });
        
        // 모바일 메뉴 아이콘 클릭 이벤트
        const menuIcon = document.querySelector('.menu-icon');
        if (menuIcon) {
            menuIcon.addEventListener('click', function() {
                toggleMobileMenu();
            });
        }
    }
    
    // 탭 전환
    function switchTab(tabType) {
        // 모든 탭에서 active 클래스 제거
        const allTabs = document.querySelectorAll('.tab');
        allTabs.forEach(tab => {
            tab.classList.remove('active');
        });
        
        // 클릭된 탭에 active 클래스 추가
        allTabs.forEach(tab => {
            if (tab.textContent.trim() === tabType) {
                tab.classList.add('active');
            }
        });
        
        // 모든 탭 콘텐츠에서 active 클래스 제거
        const allTabContents = document.querySelectorAll('.tab-content');
        allTabContents.forEach(content => content.classList.remove('active'));
        
        // 모든 모바일 탭 콘텐츠에서 active 클래스 제거
        const allMobileTabContents = document.querySelectorAll('.mobile-tab-content');
        allMobileTabContents.forEach(content => content.classList.remove('active'));
        
        // 클릭된 탭에 해당하는 콘텐츠 표시
        let targetTabId = '';
        
        switch(tabType) {
            case '요약':
                targetTabId = 'summary-tab';
                break;
            case '링크':
                targetTabId = 'link-tab';
                break;
            case '소식받기':
                targetTabId = 'newsletter-tab';
                break;
            case '방문':
                targetTabId = 'visit-tab';
                break;
        }
        
        // 탭 콘텐츠 표시
        if (targetTabId) {
            const targetContent = document.getElementById(targetTabId);
            if (targetContent) {
                targetContent.classList.add('active');
                
                // 해당 탭 내의 모바일 탭 콘텐츠도 활성화
                const mobileTabContent = targetContent.querySelector('.mobile-tab-content');
                if (mobileTabContent) {
                    mobileTabContent.classList.add('active');
                }
            }
        }
        
        // 현재 탭 업데이트
        currentTab = getTabKey(tabType);
        
        // 탭별 콘텐츠 로드
        loadTabContent(currentTab);
        
        console.log(`탭 전환: ${tabType} -> ${targetTabId}`);
    }
    
    // 탭 타입을 키로 변환
    function getTabKey(tabType) {
        const tabMap = {
            '요약': 'summary',
            '링크': 'links',
            '소식받기': 'newsletter',
            '방문': 'visits'
        };
        return tabMap[tabType] || 'summary';
    }
    
    // 탭별 콘텐츠 로드
    function loadTabContent(tabKey) {
        console.log(`Loading content for tab: ${tabKey}`);
        
        // 실제 구현에서는 API 호출로 데이터를 가져옴
        switch(tabKey) {
            case 'summary':
                loadSummaryData();
                break;
            case 'links':
                loadLinksData();
                break;
            case 'newsletter':
                loadNewsletterData();
                break;
            case 'visits':
                loadVisitsData();
                break;
        }
    }
    
    // 드롭다운 토글
    function toggleDropdown(dropdown) {
        // 드롭다운 메뉴 생성 또는 토글
        const existingMenu = dropdown.querySelector('.dropdown-menu');
        const icon = dropdown.querySelector('img');
        
        if (existingMenu) {
            closeDropdown(dropdown);
        } else {
            createDropdownMenu(dropdown);
            // 아이콘을 up으로 변경
            if (icon) {
                icon.src = 'icon/icon-dropdown-up.svg';
            }
            dropdown.setAttribute('data-open', 'true');
        }
    }
    
    // 드롭다운 닫기
    function closeDropdown(dropdown) {
        const existingMenu = dropdown.querySelector('.dropdown-menu');
        const icon = dropdown.querySelector('img');
        
        if (existingMenu) {
            existingMenu.remove();
        }
        // 아이콘을 down으로 변경
        if (icon) {
            icon.src = 'icon/icon-dropdown-down.svg';
        }
        dropdown.removeAttribute('data-open');
    }
    
    // 드롭다운 메뉴 생성
    function createDropdownMenu(dropdown) {
        const menu = document.createElement('div');
        menu.className = 'dropdown-menu';
        menu.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--color-white);
            border: 1px solid var(--color-gray-200);
            border-radius: var(--radius-300);
            box-shadow: 0 4px 12px var(--color-black-opacity-100);
            z-index: 1000;
            margin-top: 4px;
        `;
        
        const options = ['오늘', '어제', '이번 주', '이번 달', '지난 달'];
        
        options.forEach(option => {
            const item = document.createElement('div');
            item.className = 'dropdown-item';
            item.textContent = option;
            
            // 현재 선택된 항목에 selected 클래스 추가
            if (option === currentDate) {
                item.classList.add('selected');
            }
            
            item.addEventListener('click', function() {
                dropdown.querySelector('span').textContent = option;
                closeDropdown(dropdown);
                currentDate = option;
                loadDateData(option);
            });
            
            item.addEventListener('mouseenter', function() {
                if (!this.classList.contains('selected')) {
                    this.style.backgroundColor = 'var(--color-gray-100)';
                }
            });
            
            item.addEventListener('mouseleave', function() {
                if (!this.classList.contains('selected')) {
                    this.style.backgroundColor = 'transparent';
                }
            });
            
            menu.appendChild(item);
        });
        
        dropdown.style.position = 'relative';
        dropdown.appendChild(menu);
        
        // 외부 클릭 시 메뉴 닫기
        setTimeout(() => {
            document.addEventListener('click', function closeMenu(e) {
                if (!dropdown.contains(e.target)) {
                    closeDropdown(dropdown);
                    document.removeEventListener('click', closeMenu);
                }
            });
        }, 0);
    }
    
    // 모바일 메뉴 토글
    function toggleMobileMenu() {
        console.log('Mobile menu toggled');
        // 모바일 메뉴 구현
    }
    
    // 페이지 네비게이션
    function navigateToPage(pageType) {
        console.log(`Navigating to: ${pageType}`);
        
        // 모든 네비게이션 아이템에서 active 클래스 제거
        navItems.forEach(item => {
            item.classList.remove('active');
        });
        
        // 클릭된 아이템에 active 클래스 추가
        navItems.forEach(item => {
            if (item.querySelector('span').textContent.trim() === pageType) {
                item.classList.add('active');
            }
        });
        
        // 실제 구현에서는 페이지 라우팅 처리
    }
    
    // 초기 데이터 로드
    function loadInitialData() {
        loadSummaryData();
    }
    
    // 요약 데이터 로드
    function loadSummaryData() {
        console.log('Loading summary data...');
        // API 호출로 실제 데이터 가져오기
        // updateSummaryCards(data);
    }
    
    // 링크 데이터 로드
    function loadLinksData() {
        console.log('Loading links data...');
        // API 호출로 실제 데이터 가져오기
    }
    
    // 소식받기 데이터 로드
    function loadNewsletterData() {
        console.log('Loading newsletter data...');
        // API 호출로 실제 데이터 가져오기
    }
    
    // 방문 데이터 로드
    function loadVisitsData() {
        console.log('Loading visits data...');
        // API 호출로 실제 데이터 가져오기
    }
    
    // 날짜별 데이터 로드
    function loadDateData(date) {
        console.log(`Loading data for: ${date}`);
        // API 호출로 날짜별 데이터 가져오기
    }
    
    // 통계 카드 업데이트
    function updateSummaryCards(data) {
        // 방문자 통계 업데이트
        if (data.visitors) {
            updateVisitorStats(data.visitors);
        }
        
        // 소식받기 통계 업데이트
        if (data.newsletter) {
            updateNewsletterStats(data.newsletter);
        }
    }
    
    // 방문자 통계 업데이트
    function updateVisitorStats(visitorData) {
        const totalElement = document.querySelector('.stat-item .value');
        const todayElement = document.querySelectorAll('.stat-item .value')[1];
        const realtimeElement = document.querySelectorAll('.stat-item .value')[2];
        
        if (totalElement) totalElement.textContent = visitorData.total || '0';
        if (todayElement) todayElement.textContent = visitorData.today || '0';
        if (realtimeElement) realtimeElement.textContent = visitorData.realtime || '0';
    }
    
    // 소식받기 통계 업데이트
    function updateNewsletterStats(newsletterData) {
        const totalElement = document.querySelectorAll('.card .stat-item .value')[3];
        if (totalElement) totalElement.textContent = newsletterData.total || '0';
    }
    
    // 순위 데이터 업데이트
    function updateRankingData(rankingData) {
        const rankingItems = document.querySelectorAll('.ranking-item, .mobile-ranking-item');
        
        rankingItems.forEach((item, index) => {
            if (rankingData[index]) {
                const title = item.querySelector('.title');
                const count = item.querySelector('.count');
                const status = item.querySelector('.status');
                
                if (title) title.textContent = rankingData[index].title;
                if (count) count.textContent = rankingData[index].count;
                if (status) status.textContent = rankingData[index].status;
            }
        });
    }
    
    // 애니메이션 효과
    function animateValue(element, start, end, duration) {
        const startTimestamp = performance.now();
        
        function step(timestamp) {
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const current = Math.floor(progress * (end - start) + start);
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }
        
        requestAnimationFrame(step);
    }
    
    // 로딩 상태 표시
    function showLoading() {
        const loadingElement = document.createElement('div');
        loadingElement.className = 'loading';
        loadingElement.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: var(--color-white);
                padding: var(--spacing-300);
                border-radius: var(--radius-400);
                box-shadow: 0 4px 12px var(--color-black-opacity-100);
                z-index: 9999;
            ">
                로딩 중...
            </div>
        `;
        document.body.appendChild(loadingElement);
    }
    
    // 로딩 상태 숨기기
    function hideLoading() {
        const loadingElement = document.querySelector('.loading');
        if (loadingElement) {
            loadingElement.remove();
        }
    }
    
    // 에러 처리
    function handleError(error) {
        console.error('Error:', error);
        
        // 에러 메시지 표시
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--color-red-500);
                color: var(--color-white);
                padding: var(--spacing-200);
                border-radius: var(--radius-400);
                z-index: 9999;
            ">
                오류가 발생했습니다. 다시 시도해주세요.
            </div>
        `;
        document.body.appendChild(errorElement);
        
        // 3초 후 자동 제거
        setTimeout(() => {
            errorElement.remove();
        }, 3000);
    }
    
    // API 호출 함수 (실제 구현 시 사용)
    async function fetchData(url, options = {}) {
        try {
            showLoading();
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            hideLoading();
            return data;
        } catch (error) {
            hideLoading();
            handleError(error);
            throw error;
        }
    }
    
    // 실시간 시각 업데이트 함수
    function updateRealTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        
        const timeString = `${year}. ${month}. ${day}. ${hours}:${minutes} 기준`;
        
        // 모든 chart-date 요소 업데이트
        const chartDates = document.querySelectorAll('.chart-date');
        chartDates.forEach(element => {
            element.textContent = timeString;
        });
    }

    // 링크 페이지 실시간 텍스트 반영 설정
    function setupLinkPageRealtimeUpdate() {
        // 타이틀 input 찾기
        const titleInput = document.querySelector('input[placeholder="타이틀을 입력해주세요"]');
        // Preview text 찾기
        const previewText = document.querySelector('.preview-text p');
        
        if (titleInput && previewText) {
            // 초기값 설정
            previewText.textContent = titleInput.value;
            
            // 실시간 업데이트
            titleInput.addEventListener('input', function() {
                previewText.textContent = this.value;
            });
        }
    }

    // 전역 함수로 추가 (HTML에서 직접 호출)
    function updatePreviewText(value) {
        const previewText = document.querySelector('.preview-text p');
        if (previewText) {
            previewText.textContent = value;
        }
    }

    // 아코디언 토글 함수 (전역)
    function toggleAccordion(button) {
        const section = button.closest('.link-visibility-section');
        const content = section.querySelector('.section-content');
        const arrow = button.querySelector('img');
        
        // 토글 상태 변경
        button.classList.toggle('active');
        
        if (button.classList.contains('active')) {
            // 펼치기 - section-content 표시
            content.style.display = 'block';
            arrow.src = 'icon/icon-arrowup.svg';
            arrow.alt = '접기';
        } else {
            // 접기 - section-content 숨기기
            content.style.display = 'none';
            arrow.src = 'icon/icon-arrowdown.svg';
            arrow.alt = '펼치기';
        }
    }

        
        // 링크 주소 입력 필드 (현재는 사용하지 않지만 나중을 위해 준비)
        const linkInput = document.querySelector('.input-fields .input-group:last-child input');
        const linkUrl = document.querySelector('.url-content span:last-child');
        
        if (linkInput && linkUrl) {
            linkInput.addEventListener('input', function() {
                const value = this.value.trim() || 'username';
                linkUrl.textContent = value;
            });
        }
        
        // 스티커 내용 입력 필드 (스티커 섹션 내부)
        const stickerInput = document.querySelector('.content-input input');
        const stickerSectionTexts = document.querySelectorAll('.sticker-section .block-text p, .sticker-section .preview-text-area p');
        
        if (stickerInput && stickerSectionTexts.length > 0) {
            stickerInput.addEventListener('input', function() {
                const value = this.value.trim() || 'text';
                stickerSectionTexts.forEach(textElement => {
                    textElement.textContent = value;
                });
            });
        }
        
        // 스타일 선택에 따른 미리보기 업데이트
        const styleOptions = document.querySelectorAll('.style-option');
        const previewCard = document.querySelector('.preview-card');
        
        styleOptions.forEach(option => {
            option.addEventListener('click', function() {
                // 모든 옵션에서 active 클래스 제거
                styleOptions.forEach(opt => opt.classList.remove('active'));
                // 클릭된 옵션에 active 클래스 추가
                this.classList.add('active');
                
                // 스타일 라벨 업데이트
                const styleLabels = document.querySelectorAll('.style-label');
                styleLabels.forEach(label => {
                    label.classList.remove('active');
                });
                const activeLabel = this.querySelector('.style-label');
                if (activeLabel) {
                    activeLabel.classList.add('active');
                }
                
                // 미리보기 카드 스타일 업데이트
                if (previewCard) {
                    // 기존 스타일 클래스 제거
                    previewCard.classList.remove('sticker', 'simple', 'card', 'background');
                    
                    // 선택된 스타일에 따라 클래스 추가
                    const labelText = activeLabel ? activeLabel.textContent.trim() : '';
                    switch(labelText) {
                        case '썸네일':
                            // 기본 스타일 유지
                            break;
                        case '심플':
                            previewCard.classList.add('simple');
                            break;
                        case '카드':
                            previewCard.classList.add('card');
                            break;
                        case '배경':
                            previewCard.classList.add('background');
                            break;
                    }
                }
            });
        });
        
        // 색상 선택에 따른 스타일 업데이트
        const colorOptions = document.querySelectorAll('.color-option');
        
        colorOptions.forEach(option => {
            option.addEventListener('click', function() {
                // 같은 그룹의 다른 옵션에서 active 클래스 제거
                const colorGroup = this.closest('.color-picker');
                const groupOptions = colorGroup.querySelectorAll('.color-option');
                groupOptions.forEach(opt => opt.classList.remove('active'));
                
                // 클릭된 옵션에 active 클래스 추가
                this.classList.add('active');
                
                // 색상 적용
                const colorCircle = this.querySelector('.color-circle');
                if (colorCircle) {
                    const colorClass = Array.from(colorCircle.classList).find(cls => 
                        ['black', 'pink', 'red', 'orange', 'green', 'blue', 'purple', 'violet'].includes(cls)
                    );
                    
                    if (colorClass) {
                        const colorMap = {
                            'black': '#000000',
                            'pink': '#ec5aa1',
                            'red': '#ee7477',
                            'orange': '#f4c05f',
                            'green': '#84fac1',
                            'blue': '#6abef6',
                            'purple': '#a874f9',
                            'violet': '#ca56eb'
                        };
                        
                        const color = colorMap[colorClass];
                        const isTextColor = colorGroup.querySelector('.input-label').textContent.includes('텍스트');
                        
                        if (isTextColor) {
                            // 텍스트 색상 적용
                            stickerTexts.forEach(textElement => {
                                textElement.style.color = color;
                            });
                        } else {
                            // 배경 색상 적용
                            const stickerBadges = document.querySelectorAll('.sticker-badge');
                            stickerBadges.forEach(badge => {
                                badge.style.backgroundColor = color;
                            });
                        }
                    }
                }
            });
        });
        
        console.log('링크 페이지 실시간 업데이트 설정 완료');
    }

    // 오버레이 토글 기능
    function setupOverlayToggle() {
        const toggleBtn = document.getElementById('overlayToggle');
        const overlays = document.querySelectorAll('.lock-overlay');
        
        // 초기 상태: 오버레이 숨김
        overlays.forEach(overlay => {
            overlay.style.setProperty('display', 'none', 'important');
        });
        
        toggleBtn.addEventListener('click', function() {
            const isActive = toggleBtn.classList.contains('active');
            
            if (isActive) {
                // 오버레이 숨기기
                overlays.forEach(overlay => {
                    overlay.style.setProperty('display', 'none', 'important');
                });
                toggleBtn.classList.remove('active');
            } else {
                // 오버레이 보이기
                overlays.forEach(overlay => {
                    overlay.style.setProperty('display', 'flex', 'important');
                });
                toggleBtn.classList.add('active');
            }
        });
    }

    // 전역 함수로 노출 (필요시 외부에서 호출 가능)
    window.switchTab = switchTab;
    window.toggleOverlay = function() {
        const toggleBtn = document.getElementById('overlayToggle');
        const overlays = document.querySelectorAll('.lock-overlay');
        
        if (!toggleBtn || overlays.length === 0) return;
        
        const isActive = toggleBtn.classList.contains('active');
        
        if (isActive) {
            // 오버레이 숨기기
            overlays.forEach(overlay => {
                overlay.style.setProperty('display', 'none', 'important');
            });
            toggleBtn.classList.remove('active');
        } else {
            // 오버레이 보이기
            overlays.forEach(overlay => {
                overlay.style.setProperty('display', 'flex', 'important');
            });
            toggleBtn.classList.add('active');
        }
    };
    
    window.Dashboard = {
        switchTab,
        loadTabContent,
        updateSummaryCards,
        updateRankingData,
        fetchData,
        updateRealTime
    };
});
