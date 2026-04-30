// simulator.js — 복리 시뮬레이터 + Chart.js 시각화

const Simulator = {
  chart: null,

  // ── 복리 계산 (월복리) ──
  calcCompound({ monthly, years, rate, initial = 0 }) {
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    let balance = initial;
    const data = [{ month: 0, balance: initial, principal: initial }];

    for (let m = 1; m <= months; m++) {
      balance = (balance + monthly) * (1 + monthlyRate);
      if (m % 12 === 0) {
        const principal = initial + monthly * m;
        data.push({ month: m, balance: Math.round(balance), principal });
      }
    }
    return data;
  },

  // ── Chart.js 그래프 렌더 ──
  render(canvasId, params) {
    const data = this.calcCompound(params);
    const labels = data.map(d => `${d.month / 12}년`);
    const balances = data.map(d => d.balance);
    const principals = data.map(d => d.principal);

    const ctx = document.getElementById(canvasId)?.getContext('2d');
    if (!ctx) return null;

    if (this.chart) { this.chart.destroy(); }

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: '최종 자산',
            data: balances,
            borderColor: '#ff6b35',
            backgroundColor: 'rgba(255,107,53,0.08)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#ff6b35',
            borderWidth: 2,
          },
          {
            label: '납입 원금',
            data: principals,
            borderColor: '#2a2a3e',
            backgroundColor: 'rgba(42,42,62,0.3)',
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            pointBackgroundColor: '#3d8ef0',
            borderWidth: 1.5,
            borderDash: [4, 4],
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: {
              color: '#9090b0',
              font: { size: 11 },
              boxWidth: 12,
            }
          },
          tooltip: {
            backgroundColor: '#1e1e2e',
            borderColor: '#2a2a3e',
            borderWidth: 1,
            titleColor: '#e8e8f0',
            bodyColor: '#9090b0',
            callbacks: {
              label: (ctx) => {
                const val = ctx.parsed.y;
                if (val >= 100000000) return ` ${(val/100000000).toFixed(2)}억원`;
                if (val >= 10000000)  return ` ${(val/10000000).toFixed(1)}천만원`;
                return ` ${val.toLocaleString()}원`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(42,42,62,0.5)' },
            ticks: { color: '#5a5a7a', font: { size: 11 } }
          },
          y: {
            grid: { color: 'rgba(42,42,62,0.5)' },
            ticks: {
              color: '#5a5a7a',
              font: { size: 11 },
              callback: (val) => {
                if (val >= 100000000) return `${(val/100000000).toFixed(1)}억`;
                if (val >= 10000000) return `${(val/10000000).toFixed(0)}천만`;
                if (val >= 1000000) return `${(val/1000000).toFixed(0)}백만`;
                return `${(val/10000).toFixed(0)}만`;
              }
            }
          }
        }
      }
    });

    return data[data.length - 1];
  },

  // ── 시나리오 비교 ──
  compareScenarios(monthly, years) {
    return [
      { label: '파킹통장만', rate: 3.0 },
      { label: '예적금+채권', rate: 4.5 },
      { label: '균형 포트폴리오', rate: 6.5 },
      { label: '성장형 포트폴리오', rate: 8.0 },
    ].map(s => {
      const result = this.calcCompound({ monthly, years, rate: s.rate });
      const final = result[result.length - 1];
      return {
        ...s,
        final: final.balance,
        principal: final.principal,
        profit: final.balance - final.principal,
        profitRate: ((final.balance / final.principal - 1) * 100).toFixed(1),
      };
    });
  }
};

window.Simulator = Simulator;
