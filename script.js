// 인포크 통계 대시보드 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 전역 변수
    let currentTab = 'summary';
    let currentDate = 'today';
    
    // DOM 요소들
    const pcLayout = document.querySelector('.pc-layout');
    const mobileLayout = document.querySelector('.mobile-layout');
    const tabs = document.querySelectorAll('.tab, .mobile-tab');
    const dropdowns = document.querySelectorAll('.dropdown, .mobile-dropdown');
    const navItems = document.querySelectorAll('.nav-item, .mobile-nav-item');
    
    // 초기화
    init();
    
    function init() {
        // 반응형 레이아웃 설정
        setupResponsiveLayout();
        
        // 이벤트 리스너 등록
        setupEventListeners();
        
        // 초기 데이터 로드
        loadInitialData();
    }
    
    // 반응형 레이아웃 설정
    function setupResponsiveLayout() {
        function handleResize() {
            const width = window.innerWidth;
            
            if (width <= 809) {
                pcLayout.style.display = 'none';
                mobileLayout.style.display = 'block';
                
                // PC 레이아웃 요소들 강제 숨기기
                const pcElements = document.querySelectorAll('.pc-container, .sidebar, .content-area, .main-content');
                pcElements.forEach(el => {
                    el.style.display = 'none';
                });
            } else {
                pcLayout.style.display = 'flex';
                mobileLayout.style.display = 'none';
                
                // PC 레이아웃 요소들 복원
                const pcContainer = document.querySelector('.pc-container');
                const sidebar = document.querySelector('.sidebar');
                const contentArea = document.querySelector('.content-area');
                const mainContent = document.querySelector('.main-content');
                
                if (pcContainer) pcContainer.style.display = 'flex';
                if (sidebar) sidebar.style.display = 'flex';
                if (contentArea) contentArea.style.display = 'flex';
                if (mainContent) mainContent.style.display = 'block';
            }
        }
        
        // 초기 설정
        handleResize();
        
        // 리사이즈 이벤트 리스너 (디바운스 적용)
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(handleResize, 100);
        });
    }
    
    // 이벤트 리스너 설정
    function setupEventListeners() {
        // 탭 클릭 이벤트
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabType = this.textContent.trim();
                switchTab(tabType);
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
        tabs.forEach(tab => {
            tab.classList.remove('active');
        });
        
        // 클릭된 탭에 active 클래스 추가
        tabs.forEach(tab => {
            if (tab.textContent.trim() === tabType) {
                tab.classList.add('active');
            }
        });
        
        // 모든 탭 콘텐츠 숨기기
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => content.classList.remove('active'));
        
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
        
        if (targetTabId) {
            const targetContent = document.getElementById(targetTabId);
            if (targetContent) {
                targetContent.classList.add('active');
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
        
        if (existingMenu) {
            existingMenu.remove();
        } else {
            createDropdownMenu(dropdown);
        }
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
            item.style.cssText = `
                padding: var(--spacing-100) var(--spacing-150);
                cursor: pointer;
                font: var(--font-paragraph-2-regular);
                color: var(--color-gray-800);
                transition: background-color 0.2s ease;
            `;
            
            item.addEventListener('click', function() {
                dropdown.querySelector('span').textContent = option;
                menu.remove();
                currentDate = option;
                loadDateData(option);
            });
            
            item.addEventListener('mouseenter', function() {
                this.style.backgroundColor = 'var(--color-gray-100)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.backgroundColor = 'transparent';
            });
            
            menu.appendChild(item);
        });
        
        dropdown.style.position = 'relative';
        dropdown.appendChild(menu);
        
        // 외부 클릭 시 메뉴 닫기
        setTimeout(() => {
            document.addEventListener('click', function closeMenu(e) {
                if (!dropdown.contains(e.target)) {
                    menu.remove();
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
    
    // 전역 함수로 노출 (필요시 외부에서 호출 가능)
    window.Dashboard = {
        switchTab,
        loadTabContent,
        updateSummaryCards,
        updateRankingData,
        fetchData
    };
});
