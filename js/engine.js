// engine.js — 재무 진단 룰 엔진

const Engine = {

  // ── 리스크 성향 계산 ──
  calcRiskProfile(answers) {
    // answers: { age, monthlyIncome, monthlySaving, goal, stability, experience, horizon }
    let score = 0;

    // 나이 (젊을수록 공격적 가능)
    if (answers.age < 25) score += 3;
    else if (answers.age < 30) score += 2;
    else if (answers.age < 35) score += 1;

    // 저축 여유 (소득 대비 저축률)
    const savingRatio = answers.monthlySaving / answers.monthlyIncome;
    if (savingRatio >= 0.4) score += 3;
    else if (savingRatio >= 0.25) score += 2;
    else if (savingRatio >= 0.1) score += 1;

    // 목표
    const goalScore = { growth: 3, balance: 2, safe: 0, emergency: 0 };
    score += goalScore[answers.goal] || 0;

    // 안정성 (직업/고용형태)
    const stabilityScore = { public: 3, corporate: 2, freelance: 1, student: 1 };
    score += stabilityScore[answers.stability] || 1;

    // 투자 경험
    const expScore = { expert: 3, intermediate: 2, beginner: 1, none: 0 };
    score += expScore[answers.experience] || 0;

    // 투자 기간
    const horizonScore = { long: 3, mid: 2, short: 1 };
    score += horizonScore[answers.horizon] || 1;

    // 총점 → 유형 분류 (max 18점)
    if (score >= 14) return 'aggressive';
    if (score >= 10) return 'growth';
    if (score >= 6)  return 'balanced';
    return 'conservative';
  },

  // ── 유형별 메타데이터 ──
  profileMeta: {
    aggressive: {
      label: '공격형 투자자',
      emoji: '🚀',
      color: '#ff6b35',
      desc: '높은 수익을 위해 변동성도 감수할 수 있는 타입. 주식, ETF 비중을 높이고 장기 성장을 노리세요.',
      portfolio: { deposit: 10, bond: 15, domestic_etf: 30, global_etf: 35, gold: 10 },
    },
    growth: {
      label: '성장형 투자자',
      emoji: '📈',
      color: '#ffd23f',
      desc: '안정성도 챙기면서 성장도 원하는 타입. 예적금과 투자를 균형 있게 배분하세요.',
      portfolio: { deposit: 20, bond: 20, domestic_etf: 25, global_etf: 25, gold: 10 },
    },
    balanced: {
      label: '균형형 투자자',
      emoji: '⚖️',
      color: '#3d8ef0',
      desc: '손실보다 안정이 더 중요한 타입. 예적금 비중을 높이고, 일부만 투자로 경험을 쌓으세요.',
      portfolio: { deposit: 35, bond: 30, domestic_etf: 15, global_etf: 15, gold: 5 },
    },
    conservative: {
      label: '안전형 투자자',
      emoji: '🛡️',
      color: '#06d6a0',
      desc: '원금 보장이 최우선인 타입. 비상금과 예금 위주로 먼저 기반을 다지세요.',
      portfolio: { deposit: 50, bond: 35, domestic_etf: 8, global_etf: 5, gold: 2 },
    }
  },

  // ── 포트폴리오 세그먼트 색상/레이블 ──
  segmentMeta: {
    deposit:      { label: '예적금',    color: '#06d6a0', textColor: '#003d2e' },
    bond:         { label: '채권/MMF',  color: '#3d8ef0', textColor: '#001e4d' },
    domestic_etf: { label: '국내ETF',   color: '#ffd23f', textColor: '#3d2e00' },
    global_etf:   { label: '글로벌ETF', color: '#ff6b35', textColor: '#3d0f00' },
    gold:         { label: '금/원자재', color: '#9b89c4', textColor: '#1a0050' },
  },

  // ── 상품 추천 로직 ──
  getProducts(profile, monthlySaving, goal, stability) {
    const products = [];

    // 비상금 먼저
    products.push({
      category: '🔥 최우선',
      name: '파킹통장 (비상금)',
      desc: '생활비 3~6개월치를 유동성 높은 계좌에 먼저 모으세요. 카카오뱅크·토스·케이뱅크 파킹통장 연 2.5~3.5%',
      tags: ['tag-green', '원금보장', 'tag-blue', '즉시 출금', 'tag-orange', '최우선'],
      icon: '🏦',
      iconBg: 'rgba(6,214,160,0.1)',
    });

    // ISA 계좌
    products.push({
      category: '💰 절세 필수',
      name: 'ISA 계좌 (개인종합자산관리)',
      desc: `연 ${stability === 'student' ? '200' : '200'}만원 이자·배당 비과세. 만기 후 IRP로 이전 시 추가 세액공제. 국내 ETF 매매차익도 비과세 됩니다.`,
      tags: ['tag-yellow', '비과세', 'tag-green', '연금 연계', 'tag-blue', '필수 가입'],
      icon: '💎',
      iconBg: 'rgba(255,210,63,0.1)',
    });

    // 연금저축/IRP (소득 있는 경우)
    if (stability !== 'student') {
      products.push({
        category: '🏛️ 세액공제',
        name: '연금저축펀드 + IRP',
        desc: '연 최대 900만원 납입 시 세액공제 최대 148.5만원 (16.5%). 직장인이라면 IRP 필수. 납입하면 그 해 연말정산에서 돌려받아요.',
        tags: ['tag-yellow', '세액공제', 'tag-green', '장기 복리', 'tag-orange', '직장인 필수'],
        icon: '📋',
        iconBg: 'rgba(255,107,53,0.1)',
      });
    }

    // 목표별 추가 상품
    if (goal === 'growth' || goal === 'balance') {
      if (profile === 'aggressive' || profile === 'growth') {
        products.push({
          category: '📊 성장 투자',
          name: 'S&P500 ETF (TIGER/KODEX)',
          desc: '미국 대형주 500개에 분산 투자. 역사적 연평균 수익률 약 10%. ISA 계좌 안에서 사면 세금 0원. 월 적립식이 정답.',
          tags: ['tag-orange', '고수익 가능', 'tag-blue', '분산 투자', 'tag-green', 'ISA 내 비과세'],
          icon: '📈',
          iconBg: 'rgba(255,107,53,0.1)',
        });
      }
      products.push({
        category: '📊 성장 투자',
        name: '채권형 ETF / MMF',
        desc: '금리 하락기 수익 기대. 단기 자금 운용에 MMF(수시입출금+연 3~4%), 중장기는 국채ETF. 변동성 낮아 안정적.',
        tags: ['tag-blue', '낮은 변동성', 'tag-green', '유동성 good'],
        icon: '🏛️',
        iconBg: 'rgba(61,142,240,0.1)',
      });
    }

    // 저축 목표
    if (goal === 'safe' || goal === 'emergency') {
      products.push({
        category: '🎯 목돈 마련',
        name: '적금 (은행/저축은행)',
        desc: `월 ${monthlySaving >= 50 ? '30~50만원' : '10~30만원'} 12~36개월 적금. 저축은행 특판 연 4~5% 노리세요. 예금자보호 5000만원 이내로 관리.`,
        tags: ['tag-green', '원금보장', 'tag-yellow', '예금자보호'],
        icon: '🐷',
        iconBg: 'rgba(6,214,160,0.1)',
      });
    }

    // 청년 특화 (30세 미만)
    products.push({
      category: '🎁 청년 혜택',
      name: '청년도약계좌',
      desc: '월 40~70만원 납입 시 정부 기여금 최대 월 2.4만원 + 이자 비과세. 5년 만기 시 5000만원 목표. 소득 조건 확인 필수.',
      tags: ['tag-yellow', '정부 지원', 'tag-green', '비과세', 'tag-orange', '청년 전용'],
      icon: '🌱',
      iconBg: 'rgba(255,210,63,0.1)',
    });

    return products;
  },

  // ── 월별 실천 플랜 ──
  getPlan(profile, monthlySaving) {
    const plans = [
      {
        week: '1개월차',
        action: '비상금 계좌 개설',
        detail: `파킹통장에 비상금 목표 설정. 최소 생활비 3개월치(${Math.round(monthlySaving * 3).toLocaleString()}만원)부터 시작.`
      },
      {
        week: '2개월차',
        action: 'ISA 계좌 개설 & 입금 시작',
        detail: '은행 앱에서 ISA 계좌 개설(5분 완료). 이달부터 월 납입 시작. 내년 비과세 혜택 준비.'
      },
    ];

    if (profile !== 'conservative') {
      plans.push({
        week: '3개월차',
        action: 'ETF 첫 매수',
        detail: 'ISA 계좌 내에서 S&P500 or 국내 시장 ETF 첫 매수. 월 적립식 설정(자동이체).'
      });
    }

    plans.push({
      week: '4~6개월차',
      action: '연금저축펀드 개설',
      detail: '소득 있는 경우 필수. 세액공제 받을 금액 계산 후 납입 시작. 연말정산 대비.'
    });

    plans.push({
      week: '6개월 이후',
      action: '리밸런싱 & 점검',
      detail: '포트폴리오 비율 점검. 비상금 완성되면 투자 비중 늘리기. 연 1~2회 정기 점검 루틴 만들기.'
    });

    return plans;
  },

  // ── 숫자 포맷 ──
  fmt(n) {
    if (n >= 10000) return `${(n / 10000).toFixed(1)}억`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}천만`;
    return `${n.toLocaleString()}만`;
  }
};

window.Engine = Engine;
